<?php

namespace Tests\Feature;

use App\Mail\VerifyEmailMailable;
use App\Mail\ResetPasswordMailable;
use App\Mail\ConsultationConfirmationMailable;
use App\Models\User;
use App\Models\ConsultationRequest;
use Tests\TestCase;
use Illuminate\Support\Facades\Mail;

class EmailTemplateTest extends TestCase
{
    public function test_verify_email_mailable_renders()
    {
        $user = new User(['name' => 'John Doe', 'email' => 'john@example.com']);
        $mailable = new VerifyEmailMailable($user, 'http://test.com', 'test-token');

        $html = $mailable->render();

        $this->assertStringContainsString('Welcome to', $html);
        $this->assertStringContainsString('John Doe', $html);
        $this->assertStringContainsString('http://test.com', $html);
        $this->assertStringContainsString('test-token', $html);
    }

    public function test_reset_password_mailable_renders()
    {
        $user = new User(['name' => 'John Doe', 'email' => 'john@example.com']);
        $mailable = new ResetPasswordMailable($user, 'http://test.com/reset', 'reset-token');

        $html = $mailable->render();

        $this->assertStringContainsString('Password Reset Request', $html);
        $this->assertStringContainsString('John Doe', $html);
        $this->assertStringContainsString('http://test.com/reset', $html);
        $this->assertStringContainsString('reset-token', $html);
    }

    public function test_consultation_confirmation_mailable_renders()
    {
        $request = new ConsultationRequest([
            'fullName' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '1234567890',
            'message' => 'Test message'
        ]);
        $mailable = new ConsultationConfirmationMailable($request);

        $html = $mailable->render();

        $this->assertStringContainsString('Consultation Request Received', $html);
        $this->assertStringContainsString('Jane Doe', $html);
        $this->assertStringContainsString('jane@example.com', $html);
        $this->assertStringContainsString('1234567890', $html);
        $this->assertStringContainsString('Test message', $html);
    }
}
