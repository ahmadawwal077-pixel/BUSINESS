<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    // Subscribe
    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $subscriber = Newsletter::where('email', $request->email)->first();

        if ($subscriber) {
            if ($subscriber->isActive) {
                return response()->json(['success' => false, 'message' => 'Already subscribed'], 400);
            }
            $subscriber->update(['isActive' => true]);
            return response()->json(['success' => true, 'message' => 'Resubscribed', 'data' => $subscriber]);
        }

        $subscriber = Newsletter::create([
            'email' => $request->email,
            'source' => $request->source ?: 'website',
        ]);

        return response()->json(['success' => true, 'message' => 'Subscribed', 'data' => $subscriber], 201);
    }

    // Unsubscribe
    public function unsubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $subscriber = Newsletter::where('email', $request->email)->first();

        if (!$subscriber) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $subscriber->update(['isActive' => false]);
        return response()->json(['success' => true, 'message' => 'Unsubscribed']);
    }

    // Get subscribers (Admin)
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $subscribers = Newsletter::where('isActive', true)->latest()->get();
        return response()->json(['success' => true, 'data' => $subscribers]);
    }
}
