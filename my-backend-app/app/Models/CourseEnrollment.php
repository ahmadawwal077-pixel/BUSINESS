<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'student_id',
        'enrollmentDate',
        'paymentStatus',
        'paymentDate',
        'status',
        'certificateEarned',
        'certificateDate',
        'totalAttendance',
        'presentDays',
        'assignmentsSubmitted',
        'assignmentGrade',
        'finalGrade',
    ];

    protected $casts = [
        'enrollmentDate' => 'datetime',
        'paymentDate' => 'datetime',
        'certificateDate' => 'datetime',
        'certificateEarned' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
