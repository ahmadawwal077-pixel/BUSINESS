<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'course_id',
        'student_id',
        'submission',
        'submittedAt',
        'grading_status',
        'score',
        'maxScore',
        'percentage',
        'comment',
        'gradedAt',
        'gradedBy',
        'feedback',
        'isLate',
    ];

    protected $casts = [
        'submission' => 'array',
        'submittedAt' => 'datetime',
        'gradedAt' => 'datetime',
        'feedback' => 'array',
        'isLate' => 'boolean',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function grader()
    {
        return $this->belongsTo(User::class, 'gradedBy');
    }
}
