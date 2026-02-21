<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ConsultationConfirmationMailable;

class ConsultationController extends Controller
{
    // Create consultation request
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);

        $consultationRequest = ConsultationRequest::create($request->all());

        // Send consultation confirmation email
        Mail::to($request->email)->send(new ConsultationConfirmationMailable($consultationRequest));

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
