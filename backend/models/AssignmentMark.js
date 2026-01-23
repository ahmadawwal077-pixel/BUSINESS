const mongoose = require('mongoose');

const assignmentMarkSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gradedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AssignmentMark', assignmentMarkSchema);
