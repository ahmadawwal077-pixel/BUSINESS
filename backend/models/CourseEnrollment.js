const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'dropped'],
    default: 'pending',
  },
  certificateEarned: {
    type: Boolean,
    default: false,
  },
  certificateDate: {
    type: Date,
  },
  // Progress tracking
  totalAttendance: {
    type: Number,
    default: 0,
  },
  presentDays: {
    type: Number,
    default: 0,
  },
  assignmentsSubmitted: {
    type: Number,
    default: 0,
  },
  assignmentGrade: {
    type: Number, // Average grade
    default: 0,
  },
  finalGrade: {
    type: Number,
    default: 0,
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

// Unique constraint: a student can only enroll in a course once
courseEnrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
