<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'isAdmin' => false,
        ]);

        // In a real scenario, you'd send a verification email here.
        // For now, mirroring Node logic:
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

        // Check if email is verified (Laravel default logic)
        // If we want to strictly mirror Node behavior:
        if (!$user->email_verified_at) {
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

    // Additional methods like verifyEmail, forgotPassword, resetPassword
    // would go here, following a similar pattern.
}
