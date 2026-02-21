@extends('emails.layout')

@section('content')
<h1>Appointment Booked Successfully</h1>
<p>Hi {{ $appointment->user->name }},</p>
<p>Your appointment has been successfully booked. Our team will review the details and confirm the appointment shortly.</p>

<div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <p style="margin-bottom: 10px;"><strong>Appointment Details:</strong></p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Service:</strong> {{ $appointment->service }}</p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Date:</strong> {{ \Carbon\Carbon::parse($appointment->appointmentDate)->format('F j, Y') }}</p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Time Slot:</strong> {{ $appointment->timeSlot }}</p>
    @if($appointment->description)
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Description:</strong> {{ $appointment->description }}</p>
    @endif
</div>

<p>You can view your appointment details and status in your dashboard.</p>

<div class="divider"></div>

<p style="font-size: 14px; color: #999;">
    Thank you for choosing our platform for your business consultation!
</p>
@endsection