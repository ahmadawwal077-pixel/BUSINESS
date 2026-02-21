<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ConsultationConfirmationMailable;

class ConsultationController extends Controller
{
    // Create consultation request
    public function store(Request $request)
    {
        $request->validate([
            'fullName'  => 'required|string',
            'email'     => 'required|email',
            'phone'     => 'required|string',
        ]);

        $consultationRequest = ConsultationRequest::create($request->all());

        // Send confirmation email to client
        try {
            Mail::to($request->email)->send(new ConsultationConfirmationMailable($consultationRequest));
        } catch (\Exception $e) {
            \Log::warning('Consultation client email failed: ' . $e->getMessage());
        }

        // Send calendar invite to admin
        try {
            $adminEmail = env('ADMIN_EMAIL', 'admin@positivehills.com');
            $preferredDate = $consultationRequest->preferredDate ?? now()->addDays(2)->toDateString();
            $preferredTime = $consultationRequest->preferredTime ?? '10:00';
            $startDt = \Carbon\Carbon::parse("{$preferredDate} {$preferredTime}");
            $endDt = $startDt->copy()->addHour();

            $dtStamp   = now()->format('Ymd\THis\Z');
            $dtStart   = $startDt->format('Ymd\THis');
            $dtEnd     = $endDt->format('Ymd\THis');
            $uid       = 'consult-' . $consultationRequest->id . '@positivehills.com';
            $clientName = $consultationRequest->fullName;
            $clientEmail = $consultationRequest->email;
            $serviceType = $consultationRequest->serviceType ?? 'General';

            $icsContent = "BEGIN:VCALENDAR\r\n"
                . "VERSION:2.0\r\n"
                . "PRODID:-//PositiveHills//Consultation//EN\r\n"
                . "METHOD:REQUEST\r\n"
                . "BEGIN:VEVENT\r\n"
                . "UID:{$uid}\r\n"
                . "DTSTAMP:{$dtStamp}\r\n"
                . "DTSTART:{$dtStart}\r\n"
                . "DTEND:{$dtEnd}\r\n"
                . "SUMMARY:Consultation with {$clientName}\r\n"
                . "DESCRIPTION:Service: {$serviceType}\\nClient: {$clientName}\\nEmail: {$clientEmail}\\nPhone: {$consultationRequest->phone}\r\n"
                . "ORGANIZER;CN=PositiveHills:mailto:{$adminEmail}\r\n"
                . "ATTENDEE;CN={$clientName}:mailto:{$clientEmail}\r\n"
                . "STATUS:TENTATIVE\r\n"
                . "END:VEVENT\r\n"
                . "END:VCALENDAR\r\n";

            Mail::send([], [], function ($m) use ($adminEmail, $clientName, $icsContent, $consultationRequest, $serviceType) {
                $m->to($adminEmail)
                    ->subject("📅 New Consultation: {$clientName}")
                    ->html(
                        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">'
                            . '<h2 style="color:#0066cc;margin-top:0">New Consultation Request</h2>'
                            . '<table style="width:100%;border-collapse:collapse">'
                            . '<tr><td style="padding:8px 0;color:#6b7280;width:130px">Client:</td><td style="padding:8px 0;font-weight:600">' . htmlspecialchars($consultationRequest->fullName) . '</td></tr>'
                            . '<tr><td style="padding:8px 0;color:#6b7280">Email:</td><td style="padding:8px 0"><a href="mailto:' . $consultationRequest->email . '">' . htmlspecialchars($consultationRequest->email) . '</a></td></tr>'
                            . '<tr><td style="padding:8px 0;color:#6b7280">Phone:</td><td style="padding:8px 0">' . htmlspecialchars($consultationRequest->phone) . '</td></tr>'
                            . '<tr><td style="padding:8px 0;color:#6b7280">Service:</td><td style="padding:8px 0">' . htmlspecialchars($serviceType) . '</td></tr>'
                            . '<tr><td style="padding:8px 0;color:#6b7280">Date:</td><td style="padding:8px 0">' . ($consultationRequest->preferredDate ?? 'TBD') . '</td></tr>'
                            . '<tr><td style="padding:8px 0;color:#6b7280">Time:</td><td style="padding:8px 0">' . ($consultationRequest->preferredTime ?? 'TBD') . '</td></tr>'
                            . '</table>'
                            . '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">'
                            . '<p style="color:#6b7280;font-size:13px">A calendar invite (.ics) is attached to this email. Open it to add the event to your calendar.</p>'
                            . '</div>'
                    )
                    ->attachData($icsContent, 'consultation.ics', ['mime' => 'text/calendar']);
            });
        } catch (\Exception $e) {
            \Log::warning('Consultation admin calendar email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Consultation request submitted successfully.',
            'consultationRequest' => $consultationRequest,
        ], 201);
    }

    // Get all requests (Admin)
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(ConsultationRequest::latest()->get());
    }

    // Update status (Admin)
    public function updateStatus(Request $request, $id)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['status' => 'required|in:new,reviewed,contacted,completed,closed']);

        $consultationRequest = ConsultationRequest::find($id);
        if (!$consultationRequest) return response()->json(['message' => 'Not found'], 404);

        $consultationRequest->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated', 'consultationRequest' => $consultationRequest]);
    }

    // Delete request (Admin)
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $consultationRequest = ConsultationRequest::find($id);
        if (!$consultationRequest) return response()->json(['message' => 'Not found'], 404);

        $consultationRequest->delete();

        return response()->json(['message' => 'Request deleted']);
    }
}
