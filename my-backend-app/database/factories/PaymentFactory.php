<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 50, 1000),
            'currency' => 'NGN',
            'paystackPaymentRef' => 'T' . fake()->unique()->numberBetween(1000000, 9999999),
            'status' => 'success',
            'paymentMethod' => 'card',
            'verifiedAt' => now(),
        ];
    }
}
