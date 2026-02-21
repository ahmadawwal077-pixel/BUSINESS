@extends('emails.layout')

@section('content')
<h1>Password Reset Request</h1>
<p>Hi {{ $user->name }},</p>
<p>You are receiving this email because we received a password reset request for your account. If you did not request a password reset, no further action is required.</p>

<div style="text-align: center;">
    <a href="{{ $url }}" class="button">Reset Password</a>
</div>

<p style="margin-top: 30px; font-size: 14px; color: #777;">
    If the button above doesn't work, copy and paste the following link into your browser:<br>
    <a href="{{ $url }}" style="color: #007bff; word-break: break-all;">{{ $url }}</a>
</p>

<div class="divider"></div>

<p style="font-size: 14px; color: #999;">
    Reset Token: <code style="background: #f8f8f8; padding: 2px 5px; border-radius: 3px;">{{ $token }}</code><br>
    This password reset link will expire in 60 minutes.
</p>
@endsection