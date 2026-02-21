<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 400);
        }

        $token = Str::random(32);
        $tokenHash = hash('sha256', $token);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'isAdmin' => false,
            'verification_token' => $tokenHash,
            'verification_token_expires' => now()->addDays(1),
            'isEmailVerified' => false,
        ]);


        // Send verification email (will be logged to storage/logs/laravel.log)
        $verificationUrl = config('app.frontend_url', 'http://localhost:3000') . "/verify-email/" . $token;
        Mail::html("
            <h2>Welcome to our platform!</h2>
            <p>Hi {$request->name},</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href='{$verificationUrl}'>Verify Email</a>
            <p>Verification Token: {$token}</p>
        ", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Email Verification - Business Consultation');
        });

        return response()->json([
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'requiresEmailVerification' => true,
            'emailSent' => true,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 400);
        }

        // Check if email is verified (Mirroring Node logic)
        if (!$user->isEmailVerified) {
            return response()->json([
                'message' => 'Please verify your email before logging in. Check your email for the verification link.',
                'requiresEmailVerification' => true
            ], 400);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => (bool)$user->isAdmin,
            ],
        ]);
    }

    public function getCurrentUser(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $user->update($request->only(['name', 'phone', 'company']));

        return response()->json([
            'message' => 'Profile updated',
            'user' => $user
        ]);
    }

    public function verifyEmail($token)
    {
        $tokenHash = hash('sha256', $token);


        $user = User::where('verification_token', $tokenHash)
            ->where('verification_token_expires', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired verification link'], 400);
        }

        $user->update([
            'isEmailVerified' => true,
            'email_verified_at' => now(),
            'verification_token' => null,
            'verification_token_expires' => null,
        ]);

        return response()->json([
            'message' => 'Email verified successfully. You can now log in.',
            'verified' => true,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No user found with this email address'], 400);
        }

        $token = Str::random(32);
        $tokenHash = hash('sha256', $token);

        $user->update([
            'reset_token' => $tokenHash,
            'reset_token_expires' => now()->addHour(),
        ]);

        // Send reset email (will be logged)
        $resetUrl = config('app.frontend_url', 'http://localhost:3000') . "/reset-password/" . $token;
        Mail::html("
            <h2>Password Reset Request</h2>
            <p>Hi {$user->name},</p>
            <p>You requested to reset your password. Click the link below to set a new password:</p>
            <a href='{$resetUrl}'>Reset Password</a>
            <p>Reset Token: {$token}</p>
        ", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Password Reset Request - Business Consultation');
        });

        return response()->json([
            'message' => 'Password reset link sent to your email',
        ]);
    }

    public function resetPassword(Request $request, $token)
    {
        $request->validate(['password' => 'required|min:6']);
        $tokenHash = hash('sha256', $token);

        $user = User::where('reset_token', $tokenHash)
            ->where('reset_token_expires', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired reset link'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'reset_token' => null,
            'reset_token_expires' => null,
        ]);

        return response()->json([
            'message' => 'Password reset successfully. You can now log in with your new password.',
            'success' => true,
        ]);
    }
}
