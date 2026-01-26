const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  confirmEnrollmentPayment,
  getMyEnrolledCourses,
  getCourseAssignments,
  getCourseAttendance,
  getStudentCourseDetail,
  addAssignment,
  markAttendance,
  getStudentDashboardStats,
  getCourseEnrollments,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { addLiveClass, getCourseLiveClasses } = require('../controllers/liveClassController');

// Public routes
router.get('/', getAllCourses);

// Dashboard stats - MUST come before /:id routes
router.get('/dashboard/student-stats', protect, getStudentDashboardStats);

// Protected routes - must come before /:id routes
router.post('/create', protect, createCourse); // Admin/Instructor
router.post('/enroll', protect, enrollCourse);
router.post('/confirm-payment', protect, confirmEnrollmentPayment);
router.get('/my-courses', protect, getMyEnrolledCourses);

// Specific nested routes - must come before /:id routes
router.get('/:courseId/assignments', protect, getCourseAssignments);
router.post('/:courseId/add-assignment', protect, addAssignment); // Instructor only
router.get('/:courseId/student-dashboard', protect, getStudentCourseDetail);
router.post('/:courseId/live-classes', protect, addLiveClass);
router.get('/:courseId/live-classes', protect, getCourseLiveClasses);
router.get('/:courseId/attendance', protect, getCourseAttendance);
router.post('/:courseId/mark-attendance', protect, markAttendance); // Instructor only
router.get('/:courseId/enrollments', protect, getCourseEnrollments);

// Generic :id routes - MUST come last
router.put('/:id', protect, updateCourse); // Admin/Instructor
router.delete('/:id', protect, deleteCourse); // Admin/Instructor
router.get('/:id', getCourseById);

module.exports = router;
