const express = require('express');
const router = express.Router();
const { 
  addLiveClass, 
  getCourseLiveClasses, 
  getUpcomingLiveClassesForStudent 
} = require('../controllers/liveClassController');
const { protect } = require('../middleware/auth');

// GET /api/live/upcoming - upcoming live classes for authenticated student
router.get('/upcoming', protect, getUpcomingLiveClassesForStudent);

// GET /api/live/course/:courseId - get all live classes for a course
router.get('/course/:courseId', protect, getCourseLiveClasses);

// POST /api/live/course/:courseId - add live class to course (instructor/admin only)
router.post('/course/:courseId', protect, addLiveClass);

// DELETE /api/live/:id - delete a live class (instructor/admin)
router.delete('/:id', protect, require('../controllers/liveClassController').deleteLiveClass);

// POST /api/live/:id/attendance - mark attendance for a live class (instructor/admin)
router.post('/:id/attendance', protect, require('../controllers/liveClassController').markAttendanceForLiveClass);

module.exports = router;
