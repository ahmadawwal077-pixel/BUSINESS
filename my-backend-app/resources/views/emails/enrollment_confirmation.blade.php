@extends('emails.layout')

@section('content')
<h1>Course Enrollment Confirmed</h1>
<p>Hi {{ $enrollment->student->name }},</p>
<p>Congratulations! Your payment has been verified, and your enrollment in the course <strong>{{ $enrollment->course->title }}</strong> is now active.</p>

<div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <p style="margin-bottom: 10px;"><strong>Enrollment Details:</strong></p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Course:</strong> {{ $enrollment->course->title }}</p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Enrollment Date:</strong> {{ \Carbon\Carbon::parse($enrollment->enrollmentDate)->format('F j, Y') }}</p>
    <p style="margin-bottom: 5px; font-size: 14px;"><strong>Status:</strong> <span style="color: #10b981; fontWeight: bold;">Active</span></p>
</div>

<p>You can now access the course content, assignments, and resources from your student dashboard.</p>

<div style="text-align: center; margin-top: 30px;">
    <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/dashboard" class="button">Go to Dashboard</a>
</div>

<div class="divider"></div>

<p style="font-size: 14px; color: #999;">
    Start learning and transform your career today!
</p>
@endsection