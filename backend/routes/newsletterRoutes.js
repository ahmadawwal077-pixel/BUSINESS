const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  getStats,
} = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Protected routes (Admin only)
router.get('/subscribers', protect, getSubscribers);
router.get('/stats', protect, getStats);

module.exports = router;
