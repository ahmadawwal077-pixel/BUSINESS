<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'nanysivyto@mailinator.com';
$user = \App\Models\User::where('email', $email)->first();

if ($user) {
    echo "User found:\n";
    echo "Email: " . $user->email . "\n";
    echo "Verification Token: " . $user->verification_token . "\n";
    echo "Expires: " . $user->verification_token_expires . "\n";
    echo "Is Verified: " . ($user->isEmailVerified ? 'Yes' : 'No') . "\n";
} else {
    echo "User not found for email: $email\n";
    $allUsers = \App\Models\User::all(['email', 'verification_token']);
    echo "All users in DB:\n";
    foreach ($allUsers as $u) {
        echo $u->email . " | " . $u->verification_token . "\n";
    }
}
