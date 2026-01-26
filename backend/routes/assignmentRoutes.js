const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignmentResponse,
  getStudentSubmission,
  getAssignmentSubmissions,
  gradeSubmission,
  markAssignment,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');

// Assignment management (instructor/admin)
router.post('/create', protect, createAssignment);
router.get('/course/:courseId', protect, getCourseAssignments);
router.get('/:assignmentId', protect, getAssignmentById);
router.put('/:assignmentId', protect, updateAssignment);
router.delete('/:assignmentId', protect, deleteAssignment);

// Student submissions
router.post('/:assignmentId/course/:courseId/submit', protect, submitAssignmentResponse);
router.get('/:assignmentId/my-submission', protect, getStudentSubmission);

// Admin/Instructor grading
router.get('/:assignmentId/submissions', protect, getAssignmentSubmissions);
router.post('/:submissionId/grade', protect, gradeSubmission);

// Legacy endpoint
router.post('/:assignmentId/mark', protect, markAssignment);

module.exports = router;
