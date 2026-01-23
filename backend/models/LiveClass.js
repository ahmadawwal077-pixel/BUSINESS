const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  meetingUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
