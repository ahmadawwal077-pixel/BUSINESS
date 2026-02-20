<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Get all users (filtered by student/admin if needed)
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::select('id', 'name', 'email', 'phone', 'company', 'isAdmin', 'created_at')
            ->latest()
            ->get();

        return response()->json($users);
    }
}
