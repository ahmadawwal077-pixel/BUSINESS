<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\LiveClassController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    // Auth logic for frontend alignment
    Route::get('verify-email/{token}', [AuthController::class, 'verifyEmail']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password/{token}', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'getCurrentUser']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

// Course Routes
Route::prefix('courses')->group(function () {
    Route::get('/', [CourseController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard/student-stats', [CourseController::class, 'getStudentDashboardStats']);
        Route::post('/create', [CourseController::class, 'store']);
        Route::post('/enroll', [CourseController::class, 'enroll']);
        Route::post('/confirm-payment', [CourseController::class, 'confirmEnrollmentPayment']);
        Route::get('/my-courses', [CourseController::class, 'myCourses']);

        Route::get('/{courseId}/assignments', [CourseController::class, 'getCourseAssignments']);
        Route::post('/{courseId}/add-assignment', [CourseController::class, 'addAssignment']);
        Route::get('/{courseId}/student-dashboard', [CourseController::class, 'getStudentCourseDetail']);
        Route::post('/{courseId}/live-classes', [LiveClassController::class, 'store']);
        Route::get('/{courseId}/live-classes', [LiveClassController::class, 'indexByCourse']);
        Route::get('/{courseId}/attendance', [CourseController::class, 'getCourseAttendance']);
        Route::post('/{courseId}/mark-attendance', [CourseController::class, 'markAttendance']);
        Route::get('/{courseId}/enrollments', [CourseController::class, 'getCourseEnrollments']);

        Route::put('/{id}', [CourseController::class, 'update']);
        Route::delete('/{id}', [CourseController::class, 'destroy']);
    });

    Route::get('/{id}', [CourseController::class, 'show']);
});

// Assignment Routes
Route::prefix('assignments')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/create', [AssignmentController::class, 'store']);
        Route::get('/course/{courseId}', [AssignmentController::class, 'indexByCourse']);
        Route::get('/my-submissions', [AssignmentController::class, 'mySubmissions']); // Added if needed
        Route::get('/{id}', [AssignmentController::class, 'show']);
        Route::post('/{assignmentId}/course/{courseId}/submit', [AssignmentController::class, 'submit']);
        Route::get('/{id}/my-submission', [AssignmentController::class, 'mySubmission']);
        Route::get('/{id}/submissions', [AssignmentController::class, 'submissions']);
        Route::post('/{id}/grade', [AssignmentController::class, 'grade']);
        Route::post('/{id}/mark', [AssignmentController::class, 'grade']); // Alias
    });
});

// Payment Routes
Route::prefix('payments')->group(function () {
    Route::post('/webhook/paystack', [PaymentController::class, 'paystackWebhook']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/create-intent', [PaymentController::class, 'createPaymentIntent']);
        Route::post('/confirm', [PaymentController::class, 'confirmPayment']);
        Route::get('/my-payments', [PaymentController::class, 'getUserPayments']);
        Route::get('/all', [PaymentController::class, 'getAllPayments']);
    });
});

// Appointment Routes
Route::prefix('appointments')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [AppointmentController::class, 'store']);
        Route::get('/', [AppointmentController::class, 'index']);
        Route::get('/my-appointments', [AppointmentController::class, 'index']); // Alias
        Route::get('/all', [AppointmentController::class, 'all']);
        Route::put('/{id}/status', [AppointmentController::class, 'updateStatus']);
        Route::post('/{id}/cancel', [AppointmentController::class, 'cancel']);
        Route::put('/{id}/cancel', [AppointmentController::class, 'cancel']); // PUT support
    });
});

// Blog Routes
Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::get('/{slug}', [BlogController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [BlogController::class, 'store']);
        Route::put('/{id}', [BlogController::class, 'update']);
        Route::delete('/{id}', [BlogController::class, 'destroy']);
    });
});

// Consultation Routes
Route::prefix('consultations')->group(function () {
    Route::post('/submit', [ConsultationController::class, 'store']);
    Route::post('/', [ConsultationController::class, 'store']); // Alias

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [ConsultationController::class, 'index']);
        Route::get('/all', [ConsultationController::class, 'index']); // Alias
        Route::put('/{id}/status', [ConsultationController::class, 'updateStatus']);
        Route::delete('/{id}', [ConsultationController::class, 'destroy']);
    });
});

// Live Class stand-alone routes
Route::prefix('live')->middleware('auth:sanctum')->group(function () {
    Route::get('/upcoming', [LiveClassController::class, 'upcoming']);
    Route::get('/course/{courseId}', [LiveClassController::class, 'indexByCourse']);
    Route::post('/course/{courseId}', [LiveClassController::class, 'store']);
    Route::delete('/{id}', [LiveClassController::class, 'destroy']);
    Route::post('/{id}/attendance', [LiveClassController::class, 'markAttendanceForLiveClass']); // Need to impl
});

// Newsletter Routes
Route::prefix('newsletter')->group(function () {
    Route::post('/subscribe', [NewsletterController::class, 'subscribe']);
    Route::post('/unsubscribe', [NewsletterController::class, 'unsubscribe']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/subscribers', [NewsletterController::class, 'index']);
    });
});

// User Routes
Route::prefix('users')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserController::class, 'index']);
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'running', 'timestamp' => now()]);
});
