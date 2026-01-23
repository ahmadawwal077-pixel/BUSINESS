const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Web Development', 'Server Security', 'Data Science', 'Mobile Development', 'Cloud Computing', 'AI/ML'],
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // in weeks
    required: true,
  },
  maxStudents: {
    type: Number,
    required: true,
  },
  enrolledStudents: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  schedule: {
    days: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
    startTime: String, // e.g., '10:00 AM'
    endTime: String, // e.g., '12:00 PM'
  },
  image: {
    type: String, // Base64 or URL
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active',
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

module.exports = mongoose.model('Course', courseSchema);
