const express = require('express');
const router = express.Router();
const { 
  createConsultationRequest,
  getAllConsultationRequests,
  getConsultationRequest,
  updateConsultationRequestStatus,
  deleteConsultationRequest,
} = require('../controllers/consultationController');
const { protect: auth } = require('../middleware/auth');

// Public routes
router.post('/submit', createConsultationRequest);

// Admin/Protected routes
router.get('/', auth, getAllConsultationRequests);
router.get('/:id', auth, getConsultationRequest);
router.put('/:id/status', auth, updateConsultationRequestStatus);
router.delete('/:id', auth, deleteConsultationRequest);

module.exports = router;
