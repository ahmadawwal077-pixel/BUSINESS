const express = require('express');
const router = express.Router();
const { markAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');

// POST /api/assignments/:assignmentId/mark - mark an assignment (instructor or admin)
router.post('/:assignmentId/mark', protect, markAssignment);

module.exports = router;
