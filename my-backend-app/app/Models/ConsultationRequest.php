<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'fullName',
        'email',
        'phone',
        'company',
        'serviceType',
        'preferredDate',
        'preferredTime',
        'message',
        'status',
    ];

    protected $casts = [
        'preferredDate' => 'date',
    ];
}
