const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getUserPayments,
  getAllPayments,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/my-payments', protect, getUserPayments);
router.get('/all', protect, getAllPayments); // Admin

module.exports = router;
