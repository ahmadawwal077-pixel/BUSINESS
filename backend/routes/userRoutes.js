const express = require('express');
const router = express.Router();
const { getStudents } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// GET /api/users - list students (admin only)
router.get('/', protect, getStudents);

module.exports = router;
