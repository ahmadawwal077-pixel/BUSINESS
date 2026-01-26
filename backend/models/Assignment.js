const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 100,
  },
  // Attachments: text content, files, and images
  content: {
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

module.exports = mongoose.model('Assignment', assignmentSchema);
