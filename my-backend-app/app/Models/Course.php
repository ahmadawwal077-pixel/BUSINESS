<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'instructor_id',
        'category',
        'level',
        'price',
        'duration',
        'maxStudents',
        'enrolledStudents',
        'startDate',
        'endDate',
        'schedule',
        'image',
        'status',
    ];

    protected $casts = [
        'schedule' => 'array',
        'startDate' => 'date',
        'endDate' => 'date',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }
}
