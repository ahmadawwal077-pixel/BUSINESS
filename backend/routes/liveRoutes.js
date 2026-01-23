const express = require('express');
const router = express.Router();
const { getUpcomingLiveClassesForStudent } = require('../controllers/liveClassController');
const { protect } = require('../middleware/auth');

// GET /api/live/upcoming - upcoming live classes for authenticated student
router.get('/upcoming', protect, getUpcomingLiveClassesForStudent);

module.exports = router;
