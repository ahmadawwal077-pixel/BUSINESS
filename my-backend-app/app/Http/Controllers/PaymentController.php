<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $paystackSecretKey;
    private $paystackApi = 'https://api.paystack.co';

    public function __construct()
    {
        $this->paystackSecretKey = config('services.paystack.secret_key') ?: env('PAYSTACK_SECRET_KEY');
    }

    // Create payment transaction (Paystack)
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'email' => 'required|email',
            'appointmentId' => 'nullable|exists:appointments,id',
            'enrollmentId' => 'nullable|exists:course_enrollments,id',
        ]);

        $amount = $request->amount;
        $email = $request->email;
        $appointmentId = $request->appointmentId;
        $enrollmentId = $request->enrollmentId;

        if (!$appointmentId && !$enrollmentId) {
            return response()->json(['message' => 'appointmentId or enrollmentId is required'], 400);
        }

        // Initialize Paystack transaction
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->paystackSecretKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->paystackApi}/transaction/initialize", [
            'email' => $email,
            'amount' => round($amount * 100), // Kobo
            'metadata' => [
                'appointmentId' => $appointmentId,
                'enrollmentId' => $enrollmentId,
                'userId' => $request->user()->id,
                'fullName' => $request->fullName,
            ],
        ]);

        if (!$response->successful() || !$response->json('status')) {
            return response()->json(['message' => 'Failed to initialize payment', 'error' => $response->json()], 400);
        }

        $data = $response->json('data');

        // Save payment record
        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'appointment_id' => $appointmentId,
            'enrollment_id' => $enrollmentId,
            'amount' => $amount,
            'paystackPaymentRef' => $data['reference'],
            'status' => 'pending',
            'paymentMethod' => 'paystack',
        ]);

        return response()->json([
            'authorization_url' => $data['authorization_url'],
            'access_code' => $data['access_code'],
            'reference' => $data['reference'],
            'paymentId' => $payment->id,
        ]);
    }

    // Verify payment (Paystack)
    public function confirmPayment(Request $request)
    {
        $request->validate(['reference' => 'required']);
        $reference = $request->reference;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->paystackSecretKey,
        ])->get("{$this->paystackApi}/transaction/verify/{$reference}");

        if (!$response->successful() || !$response->json('status')) {
            return response()->json(['message' => 'Payment verification failed'], 400);
        }

        $paymentData = $response->json('data');

        if ($paymentData['status'] === 'success') {
            $payment = Payment::where('paystackPaymentRef', $reference)->first();

            if (!$payment) {
                return response()->json(['message' => 'Payment record not found'], 404);
            }

            $payment->update([
                'status' => 'completed',
                'verifiedAt' => now(),
            ]);

            // If payment is for an enrollment, activate the enrollment
            if ($payment->enrollment_id) {
                $enrollment = CourseEnrollment::find($payment->enrollment_id);
                if ($enrollment) {
                    $enrollment->update([
                        'paymentStatus' => 'completed',
                        'paymentDate' => now(),
                        'status' => 'active',
                    ]);

                    // Update course enrolled students count
                    $course = Course::find($enrollment->course_id);
                    if ($course) {
                        $course->increment('enrolledStudents');
                    }
                }
            }

            return response()->json(['message' => 'Payment successful', 'payment' => $payment]);
        }

        return response()->json(['message' => 'Payment not completed'], 400);
    }

    // Get user payments
    public function getUserPayments(Request $request)
    {
        $payments = Payment::with('appointment')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($payments);
    }

    // Paystack webhook handler
    public function paystackWebhook(Request $request)
    {
        $signature = $request->header('x-paystack-signature');
        if (!$signature) return response()->json(['message' => 'No signature'], 400);

        $payload = $request->getContent();
        $hash = hash_hmac('sha512', $payload, $this->paystackSecretKey);

        if ($hash !== $signature) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $event = json_decode($payload, true);
        if ($event['event'] === 'charge.success') {
            $data = $event['data'];
            $reference = $data['reference'];

            $payment = Payment::where('paystackPaymentRef', $reference)->first();
            if ($payment && $payment->status !== 'completed') {
                $payment->update([
                    'status' => 'completed',
                    'verifiedAt' => now(),
                ]);

                if ($payment->enrollment_id) {
                    $enrollment = CourseEnrollment::find($payment->enrollment_id);
                    if ($enrollment) {
                        $enrollment->update([
                            'paymentStatus' => 'completed',
                            'paymentDate' => now(),
                            'status' => 'active',
                        ]);

                        $course = Course::find($enrollment->course_id);
                        if ($course) {
                            $course->increment('enrolledStudents');
                        }
                    }
                }
            }
        }

        return response()->json(['message' => 'OK'], 200);
    }

    // Get all payments (Admin)
    public function getAllPayments(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payments = Payment::with(['user:id,name,email', 'appointment'])
            ->latest()
            ->get();

        return response()->json($payments);
    }
}
