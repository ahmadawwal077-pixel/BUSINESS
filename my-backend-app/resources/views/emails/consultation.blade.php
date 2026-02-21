@extends('emails.layout')

@section('content')
<h1>Consultation Request Received</h1>
<p>Hi {{ $consultationRequest->fullName }},</p>
<p>Thank you for reaching out to us for a consultation. We have received your request and our team will review it shortly.</p>

<div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <p style="margin-bottom: 10px;"><strong>Request Details:</strong></p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Email:</strong> {{ $consultationRequest->email }}</p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Phone:</strong> {{ $consultationRequest->phone }}</p>
    @if($consultationRequest->message)
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Message:</strong> {{ $consultationRequest->message }}</p>
    @endif
</div>

<p>We will contact you via email or phone to schedule the next steps.</p>

<div class="divider"></div>

<p style="font-size: 14px; color: #999;">
    This is an automated confirmation of your request.
</p>
@endsection