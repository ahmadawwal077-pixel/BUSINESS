const mongoose = require('mongoose');

const consultationRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  company: {
    type: String,
  },
  serviceType: {
    type: String,
    enum: ['general', 'business', 'technical', 'training', 'implementation', 'other'],
    default: 'general',
  },
  preferredDate: {
    type: Date,
  },
  preferredTime: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'completed', 'closed'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ConsultationRequest', consultationRequestSchema);
