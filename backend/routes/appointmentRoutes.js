const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createAppointment);
router.get('/my-appointments', protect, getUserAppointments);
router.get('/all', protect, getAllAppointments); // Admin
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
