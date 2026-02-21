<?php

namespace App\Http\Controllers;

use App\Models\LiveClass;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;

class LiveClassController extends Controller
{
    // Get all upcoming classes (Admin/Instructor)
    public function index(Request $request)
    {
        $upcoming = LiveClass::with('course:id,title')
            ->where('scheduledAt', '>=', now()->subHours(2)) // Show recently started too
            ->orderBy('scheduledAt')
            ->get();

        $transformed = $upcoming->map(function (\App\Models\LiveClass $cls) {
            $data = $cls->toArray();
            $data['_id'] = $cls->id;
            if ($cls->course) {
                $data['courseName'] = $cls->course->title;
                $data['course']['_id'] = $cls->course->id;
            }
            return $data;
        });

        return response()->json($transformed);
    }

    // Schedule live class
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string',
            'scheduledAt' => 'required|date',
        ]);

        $course = Course::find($courseId);
        if (!$course) return response()->json(['message' => 'Course not found'], 404);

        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $liveClass = LiveClass::create(array_merge($request->all(), [
            'course_id' => $courseId,
            'createdBy' => $request->user()->id,
        ]));

        return response()->json(['message' => 'Live class scheduled', 'live' => $liveClass], 201);
    }

    // Get classes for a course
    public function indexByCourse($courseId)
    {
        $classes = LiveClass::where('course_id', $courseId)->orderBy('scheduledAt')->get();
        $transformed = $classes->map(function (\App\Models\LiveClass $cls) {
            $data = $cls->toArray();
            $data['_id'] = $cls->id;
            return $data;
        });
        return response()->json($transformed);
    }

    // Upcoming classes for student
    public function upcoming(Request $request)
    {
        $enrollments = CourseEnrollment::where('student_id', $request->user()->id)
            ->where('status', 'active')
            ->pluck('course_id');

        $upcoming = LiveClass::with('course:id,title')
            ->whereIn('course_id', $enrollments)
            ->where('scheduledAt', '>=', now())
            ->orderBy('scheduledAt')
            ->limit(10)
            ->get();

        $transformed = $upcoming->map(function (\App\Models\LiveClass $cls) {
            $data = $cls->toArray();
            $data['_id'] = $cls->id;
            if ($cls->course) {
                $data['course']['_id'] = $cls->course->id;
            }
            return $data;
        });

        return response()->json($transformed);
    }

    // Delete live class
    public function destroy(Request $request, $id)
    {
        $liveClass = LiveClass::with('course')->find($id);
        if (!$liveClass) return response()->json(['message' => 'Not found'], 404);

        if ($liveClass->course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $liveClass->delete();

        return response()->json(['message' => 'Live class deleted']);
    }

    // Mark attendance for a live class (instructor or admin)
    public function markAttendanceForLiveClass(Request $request, $id)
    {
        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.studentId' => 'required|exists:users,id',
            'attendance.*.status' => 'required|in:present,absent,late',
        ]);

        $live = LiveClass::find($id);
        if (!$live) return response()->json(['message' => 'Live class not found'], 404);

        $course = \App\Models\Course::find($live->course_id);
        if ($course->instructor_id !== $request->user()->id && !$request->user()->isAdmin) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $results = [];
        foreach ($request->attendance as $a) {
            $record = \App\Models\Attendance::updateOrCreate(
                ['course_id' => $course->id, 'student_id' => $a['studentId'], 'date' => $live->scheduledAt->format('Y-m-d')],
                ['status' => $a['status'], 'notes' => $a['notes'] ?? '']
            );
            $results[] = $record;
        }

        return response()->json(['message' => 'Attendance updated', 'results' => $results]);
    }
}
