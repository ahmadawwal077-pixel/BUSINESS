<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AssignmentController extends Controller
{
    // Create assignment (Instructor/Admin only)
    public function store(Request $request)
    {
        $request->validate([
            'courseId' => 'required|exists:courses,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'dueDate' => 'required|date',
        ]);

        $course = Course::find($request->courseId);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized to create assignments for this course'], 403);
        }

        $assignment = Assignment::create([
            'course_id' => $request->courseId,
            'title' => $request->title,
            'description' => $request->description,
            'instructions' => $request->instructions,
            'dueDate' => $request->dueDate,
            'totalPoints' => $request->totalPoints ?? 100,
            'content' => $request->input('content'),
            'instructor_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Assignment created successfully', 'assignment' => $assignment], 201);
    }

    // Get all assignments for a course
    public function indexByCourse($courseId)
    {
        $assignments = Assignment::where('course_id', $courseId)->latest()->get();
        $transformed = $assignments->map(function (\App\Models\Assignment $a) {
            $data = $a->toArray();
            $data['_id'] = $a->id;
            return $data;
        });
        return response()->json($transformed);
    }

    // Get assignment by ID
    public function show($id)
    {
        $assignment = Assignment::with('course')->find($id);
        if (!$assignment) return response()->json(['message' => 'Assignment not found'], 404);
        return response()->json($assignment);
    }

    // Submit assignment response
    public function submit(Request $request, $assignmentId, $courseId)
    {
        $studentId = $request->user()->id;

        $assignment = Assignment::find($assignmentId);
        if (!$assignment) return response()->json(['message' => 'Assignment not found'], 404);

        // Check if student is enrolled
        if (!CourseEnrollment::where('course_id', $courseId)->where('student_id', $studentId)->where('status', 'active')->exists()) {
            return response()->json(['message' => 'Not enrolled in this course'], 403);
        }

        $isLate = Carbon::now()->gt(Carbon::parse($assignment->dueDate));

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignmentId, 'student_id' => $studentId],
            [
                'course_id' => $courseId,
                'submission' => $request->submission,
                'isLate' => $isLate,
                'submittedAt' => now(),
            ]
        );

        return response()->json(['message' => 'Assignment submitted successfully', 'submission' => $submission]);
    }

    // Get student's submission
    public function mySubmission($assignmentId, Request $request)
    {
        $submission = AssignmentSubmission::where('assignment_id', $assignmentId)
            ->where('student_id', $request->user()->id)
            ->first();
        return response()->json($submission);
    }

    // Get all submissions for an assignment (Admin/Instructor only)
    public function submissions($assignmentId, Request $request)
    {
        $assignment = Assignment::with('course')->find($assignmentId);
        if (!$assignment) return response()->json(['message' => 'Assignment not found'], 404);

        if ($assignment->course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized to view submissions'], 403);
        }

        $submissions = AssignmentSubmission::with('student:id,name,email')
            ->where('assignment_id', $assignmentId)
            ->latest('submittedAt')
            ->get();

        return response()->json($submissions);
    }

    // Grade assignment submission
    public function grade(Request $request, $id)
    {
        $submission = AssignmentSubmission::find($id);
        if (!$submission) return response()->json(['message' => 'Submission not found'], 404);

        $assignment = Assignment::find($submission->assignment_id);
        $course = Course::find($submission->course_id);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['score' => 'required|numeric']);

        $score = $request->score;
        $maxScore = $assignment->totalPoints;
        $percentage = ($score / $maxScore) * 100;

        $submission->update([
            'grading_status' => 'graded',
            'score' => $score,
            'percentage' => $percentage,
            'comment' => $request->comment,
            'feedback' => $request->feedback,
            'graded_at' => now(),
            'graded_by' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Submission graded successfully', 'submission' => $submission]);
    }

    // Legacy mark assignment (separate from submissions)
    public function mark(Request $request, $id)
    {
        $assignment = Assignment::find($id);
        if (!$assignment) return response()->json(['message' => 'Assignment not found'], 404);

        $request->validate([
            'studentId' => 'required|exists:users,id',
            'marks' => 'required|numeric',
        ]);

        $mark = \App\Models\AssignmentMark::updateOrCreate(
            ['assignment_id' => $id, 'student_id' => $request->studentId],
            ['marks' => $request->marks, 'graded_by' => $request->user()->id]
        );

        return response()->json(['message' => 'Assignment marked', 'mark' => $mark]);
    }

    // Get all submissions for current user across all courses
    public function mySubmissions(Request $request)
    {
        $submissions = AssignmentSubmission::with('assignment:id,title,course_id')
            ->where('student_id', $request->user()->id)
            ->latest('submittedAt')
            ->get();

        return response()->json($submissions);
    }
}
