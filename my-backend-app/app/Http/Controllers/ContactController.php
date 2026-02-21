<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL', 'admin@positivehills.com'));

        Mail::send([], [], function ($m) use ($validated, $adminEmail) {
            $m->to($adminEmail)
                ->replyTo($validated['email'], $validated['name'])
                ->subject('[Contact Form] ' . $validated['subject'])
                ->html(
                    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">'
                        . '<h2 style="color:#0066cc;margin-top:0">New Contact Form Message</h2>'
                        . '<table style="width:100%;border-collapse:collapse">'
                        . '<tr><td style="padding:8px 0;color:#6b7280;width:100px">Name:</td><td style="padding:8px 0;font-weight:600">' . htmlspecialchars($validated['name']) . '</td></tr>'
                        . '<tr><td style="padding:8px 0;color:#6b7280">Email:</td><td style="padding:8px 0;font-weight:600"><a href="mailto:' . $validated['email'] . '">' . htmlspecialchars($validated['email']) . '</a></td></tr>'
                        . ($validated['phone'] ? '<tr><td style="padding:8px 0;color:#6b7280">Phone:</td><td style="padding:8px 0;font-weight:600">' . htmlspecialchars($validated['phone']) . '</td></tr>' : '')
                        . '<tr><td style="padding:8px 0;color:#6b7280">Subject:</td><td style="padding:8px 0;font-weight:600">' . htmlspecialchars($validated['subject']) . '</td></tr>'
                        . '</table>'
                        . '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">'
                        . '<p style="color:#6b7280;font-size:13px;margin-top:0">Message:</p>'
                        . '<div style="background:#f9fafb;border-left:4px solid #0066cc;padding:16px;border-radius:4px;white-space:pre-wrap">' . htmlspecialchars($validated['message']) . '</div>'
                        . '<p style="font-size:12px;color:#9ca3af;margin-top:24px">Sent from PositiveHills Contact Form</p>'
                        . '</div>'
                );
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Your message has been sent. We\'ll get back to you soon!',
        ]);
    }
}
