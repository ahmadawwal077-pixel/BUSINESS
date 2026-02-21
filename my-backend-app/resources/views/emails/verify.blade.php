@extends('emails.layout')

@section('content')
<h1>Welcome to {{ config('app.name') }}!</h1>
<p>Hi {{ $user->name }},</p>
<p>We're excited to have you on board! Before you can start using our platform, please verify your email address by clicking the button below:</p>

<div style="text-align: center;">
    <a href="{{ $url }}" class="button">Verify Email Address</a>
</div>

<p style="margin-top: 30px; font-size: 14px; color: #777;">
    If the button above doesn't work, copy and paste the following link into your browser:<br>
    <a href="{{ $url }}" style="color: #007bff; word-break: break-all;">{{ $url }}</a>
</p>

<div class="divider"></div>

<p style="font-size: 14px; color: #999;">
    Verification Token: <code style="background: #f8f8f8; padding: 2px 5px; border-radius: 3px;">{{ $token }}</code><br>
    This link will expire in 24 hours.
</p>
@endsection