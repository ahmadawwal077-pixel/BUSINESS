const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
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
  // Student's submission content: text, files, and images
  submission: {
    text: {
      type: String,
    },
    files: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    images: [{
      imageUrl: String,
      caption: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  // Grading information
  grading: {
    status: {
      type: String,
      enum: ['pending', 'graded'],
      default: 'pending',
    },
    score: {
      type: Number,
      min: 0,
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    comment: {
      type: String,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  // Instructor's feedback: text, files, and images
  feedback: {
    text: {
      type: String,
    },
    files: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    images: [{
      imageUrl: String,
      caption: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
  },
  isLate: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
