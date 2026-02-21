<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrollmentConfirmationMailable;

class CourseController extends Controller
{
    // Create a new course (Admin/Instructor only)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'price' => 'required|numeric',
            'duration' => 'required|integer',
            'maxStudents' => 'required|integer',
            'startDate' => 'required|date',
            'endDate' => 'required|date',
        ]);

        $course = Course::create(array_merge($request->all(), [
            'instructor_id' => $request->user()->id,
        ]));

        return response()->json(['message' => 'Course created successfully', 'course' => $course], 201);
    }

    // Get all courses
    public function index(Request $request)
    {
        $query = Course::with('instructor:id,name,email');

        // Non-admins only see active courses by default
        if (!$request->user()?->isAdmin) {
            $query->where('status', 'active');
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $courses = $query->latest()->get();

        // Transform to include _id for frontend parity and enrolledStudents count
        $transformed = $courses->map(function (\App\Models\Course $course) {
            $data = $course->toArray();
            $data['_id'] = $course->id;
            // Recalculate enrolledStudents if it seems out of sync
            $data['enrolledStudents'] = \App\Models\CourseEnrollment::where('course_id', $course->id)
                ->where('paymentStatus', 'completed')
                ->count();
            return $data;
        });

        return response()->json($transformed);
    }

    // Get course by ID
    public function show($id)
    {
        $course = Course::with('instructor:id,name,email')->find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $data = $course->toArray();
        $data['_id'] = $course->id;

        return response()->json($data);
    }

    // Enroll student in course
    public function enroll(Request $request)
    {
        $request->validate(['courseId' => 'required|exists:courses,id']);
        $userId = $request->user()->id;
        $courseId = $request->courseId;

        $course = Course::find($courseId);

        // Check if already enrolled
        $existingEnrollment = CourseEnrollment::where('course_id', $courseId)->where('student_id', $userId)->first();
        if ($existingEnrollment) {
            if ($existingEnrollment->paymentStatus === 'pending') {
                $enrollmentData = $existingEnrollment->toArray();
                $enrollmentData['_id'] = $existingEnrollment->id;
                return response()->json([
                    'message' => 'Pending enrollment found. Please proceed with payment.',
                    'enrollment' => $enrollmentData
                ], 200);
            }
            return response()->json(['message' => 'Already enrolled in this course'], 400);
        }

        // Check if course is full
        if ($course->enrolledStudents >= $course->maxStudents) {
            return response()->json(['message' => 'Course is full'], 400);
        }

        $enrollment = CourseEnrollment::create([
            'course_id' => $courseId,
            'student_id' => $userId,
            'paymentStatus' => 'pending',
        ]);

        $enrollmentData = $enrollment->toArray();
        $enrollmentData['_id'] = $enrollment->id;

        return response()->json([
            'message' => 'Enrollment created. Please proceed with payment.',
            'enrollment' => $enrollmentData
        ], 201);
    }

    // Get student's enrolled courses
    public function myCourses(Request $request)
    {
        $enrollments = CourseEnrollment::with('course')
            ->where('student_id', $request->user()->id)
            ->where('paymentStatus', 'completed')
            ->latest('enrollmentDate')
            ->get();

        // Transform to include _id for frontend parity
        $transformed = $enrollments->map(function (\App\Models\CourseEnrollment $enr) {
            $data = $enr->toArray();
            $data['_id'] = $enr->id;
            if ($enr->course) {
                $data['course']['_id'] = $enr->course->id;
            }
            return $data;
        });

        return response()->json($transformed);
    }

    // Update course
    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Only instructor or admin can update
        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized to update this course'], 403);
        }

        $course->update($request->all());

        return response()->json(['message' => 'Course updated successfully', 'course' => $course]);
    }

    /**
     * Confirm payment and activate enrollment
     */
    public function confirmEnrollmentPayment(Request $request)
    {
        $request->validate(['enrollmentId' => 'required|exists:course_enrollments,id']);

        $enrollment = CourseEnrollment::find($request->enrollmentId);

        $enrollment->update([
            'paymentStatus' => 'completed',
            'paymentDate' => now(),
            'status' => 'active',
        ]);

        $course = Course::find($enrollment->course_id);
        $course->increment('enrolledStudents');

        // Send enrollment confirmation email
        Mail::to($enrollment->student->email)->send(new EnrollmentConfirmationMailable($enrollment->load(['student', 'course'])));

        return response()->json(['message' => 'Payment confirmed. You are now enrolled in the course!', 'enrollment' => $enrollment]);
    }

    /**
     * Get course assignments
     */
    public function getCourseAssignments($courseId)
    {
        $assignments = Assignment::where('course_id', $courseId)->orderBy('dueDate')->get();
        return response()->json($assignments);
    }

    /**
     * Get attendance for a course (student specific)
     */
    public function getCourseAttendance(Request $request, $courseId)
    {
        $userId = $request->user()->id;
        $attendance = \App\Models\Attendance::where('course_id', $courseId)
            ->where('student_id', $userId)
            ->orderBy('date', 'desc')
            ->get();

        $totalClasses = \App\Models\Attendance::where('course_id', $courseId)->distinct('date')->count();
        $presentDays = $attendance->where('status', 'present')->count();

        return response()->json([
            'attendance' => $attendance,
            'attendancePercentage' => $totalClasses > 0 ? round(($presentDays / $totalClasses) * 100, 2) : 0,
        ]);
    }

    /**
     * Get detailed student view for a course
     */
    public function getStudentCourseDetail(Request $request, $courseId)
    {
        $userId = $request->user()->id;

        $enrollment = CourseEnrollment::where('course_id', $courseId)
            ->where('student_id', $userId)
            ->first();

        if (!$enrollment) return response()->json(['message' => 'Not enrolled in this course'], 403);

        $assignments = Assignment::where('course_id', $courseId)->orderBy('dueDate')->get();

        $assignmentDetails = $assignments->map(function ($a) use ($userId) {
            $submission = AssignmentSubmission::where('assignment_id', $a->id)
                ->where('student_id', $userId)
                ->first();

            return [
                '_id' => $a->id,
                'id' => $a->id,
                'title' => $a->title,
                'description' => $a->description,
                'dueDate' => $a->dueDate,
                'totalPoints' => $a->totalPoints,
                'maxScore' => $a->totalPoints, // Frontend uses maxScore sometimes
                'content' => $a->content,
                'submission' => $submission ? [
                    '_id' => $submission->id,
                    'status' => $submission->grading_status,
                    'score' => $submission->score,
                    'percentage' => $submission->percentage,
                    'comment' => $submission->comment,
                    'submittedAt' => $submission->submittedAt,
                    'isLate' => $submission->isLate,
                ] : null,
            ];
        });

        $attendanceRecords = \App\Models\Attendance::where('course_id', $courseId)
            ->where('student_id', $userId)
            ->orderBy('date', 'desc')
            ->get();

        $totalClasses = \App\Models\Attendance::where('course_id', $courseId)->distinct('date')->count();
        $presentDays = $attendanceRecords->where('status', 'present')->count();

        return response()->json([
            'assignments' => $assignmentDetails,
            'attendance' => [
                'records' => $attendanceRecords->map(function ($r) {
                    $d = $r->toArray();
                    $d['_id'] = $r->id;
                    return $d;
                }),
                'attendancePercentage' => $totalClasses > 0 ? round(($presentDays / $totalClasses) * 100, 2) : 0,
            ],
        ]);
    }

    /**
     * Add assignment (Instructor only)
     */
    public function addAssignment(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) return response()->json(['message' => 'Course not found'], 404);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'dueDate' => 'required|date',
            'totalPoints' => 'required|integer',
        ]);

        $assignment = Assignment::create(array_merge($request->all(), [
            'course_id' => $courseId,
            'instructor_id' => $request->user()->id,
        ]));

        return response()->json(['message' => 'Assignment added successfully', 'assignment' => $assignment], 201);
    }

    /**
     * Mark attendance (Instructor only)
     */
    public function markAttendance(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) return response()->json(['message' => 'Course not found'], 404);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $request->validate([
            'studentId' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late',
        ]);

        $attendance = \App\Models\Attendance::updateOrCreate(
            ['course_id' => $courseId, 'student_id' => $request->studentId, 'date' => $request->date],
            ['status' => $request->status, 'notes' => $request->notes]
        );

        return response()->json(['message' => 'Attendance marked', 'attendance' => $attendance]);
    }

    /**
     * Get dashboard stats for student
     */
    public function getStudentDashboardStats(Request $request)
    {
        $userId = $request->user()->id;
        $enrollments = CourseEnrollment::where('student_id', $userId)->where('paymentStatus', 'completed')->get();

        $activeCourses = $enrollments->where('status', 'active')->count();
        $completedCourses = $enrollments->where('status', 'completed')->count();

        // Count upcoming assignments
        $courseIds = $enrollments->pluck('course_id');
        $upcomingAssignments = Assignment::whereIn('course_id', $courseIds)
            ->where('dueDate', '>=', now())
            ->count();

        // Calculate average grade
        $submissions = AssignmentSubmission::where('student_id', $userId)
            ->where('grading_status', 'graded')
            ->get();

        $averageGrade = $submissions->count() > 0 ? round($submissions->avg('percentage'), 2) : 0;

        return response()->json([
            'activeCourses' => $activeCourses,
            'completedCourses' => $completedCourses,
            'upcomingAssignments' => $upcomingAssignments,
            'averageGrade' => $averageGrade,
            'totalEnrolled' => $enrollments->count(),
        ]);
    }

    /**
     * Get enrolled students for a course (Instructor/Admin only)
     */
    public function getCourseEnrollments(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) return response()->json(['message' => 'Course not found'], 404);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrollments = CourseEnrollment::with('student:id,name,email,phone')
            ->where('course_id', $courseId)
            ->where('paymentStatus', 'completed')
            ->where('status', 'active')
            ->get();

        $transformed = $enrollments->map(function (\App\Models\CourseEnrollment $enr) {
            $data = $enr->toArray();
            $data['_id'] = $enr->id;
            if ($enr->student) {
                $data['student']['_id'] = $enr->student->id;
            }
            return $data;
        });

        return response()->json($transformed);
    }
}
