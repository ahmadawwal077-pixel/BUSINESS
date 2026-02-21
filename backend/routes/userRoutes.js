const express = require('express');
const router = express.Router();
const { getStudents, sendBulkWelcomeEmails } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// GET /api/users - list students (admin only)
router.get('/', protect, getStudents);

// POST /api/users/send-welcome-emails - send welcome emails to all users (admin only)
router.post('/send-welcome-emails', protect, sendBulkWelcomeEmails);

module.exports = router;
