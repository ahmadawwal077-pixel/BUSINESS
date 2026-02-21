<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentBookingMailable;

class AppointmentController extends Controller
{
    // Create appointment
    public function store(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'appointmentDate' => 'required|date',
            'timeSlot' => 'required|string',
        ]);

        $appointment = Appointment::create([
            'user_id' => $request->user()->id,
            'service' => $request->service,
            'appointmentDate' => $request->appointmentDate,
            'timeSlot' => $request->timeSlot,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Appointment created',
            'appointment' => $appointment->load('user:id,name,email,phone'),
        ], 201);
    }

    // Get user appointments
    public function index(Request $request)
    {
        $appointments = Appointment::with('user:id,name,email,phone')
            ->where('user_id', $request->user()->id)
            ->latest('appointmentDate')
            ->get();

        return response()->json($appointments);
    }

    // Get all appointments (Admin)
    public function all(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointments = Appointment::with('user:id,name,email,phone')
            ->latest('appointmentDate')
            ->get();

        return response()->json($appointments);
    }

    // Update appointment status (Admin/Internal)
    public function updateStatus(Request $request, $id)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['status' => 'required|in:pending,confirmed,completed,cancelled']);

        $appointment = Appointment::find($id);
        if (!$appointment) return response()->json(['message' => 'Appointment not found'], 404);

        $appointment->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Appointment updated',
            'appointment' => $appointment->load('user:id,name,email,phone'),
        ]);
    }

    // Cancel appointment (User)
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)->where('user_id', $request->user()->id)->first();
        if (!$appointment) return response()->json(['message' => 'Appointment not found or not authorized'], 404);

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled', 'appointment' => $appointment]);
    }
}
