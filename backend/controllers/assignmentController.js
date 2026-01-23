const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const AssignmentMark = require('../models/AssignmentMark');
const User = require('../models/User');

exports.markAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, marks } = req.body;

    if (!studentId || marks === undefined) {
      return res.status(400).json({ message: 'Missing required fields: studentId, marks' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const course = await Course.findById(assignment.course);
    if (!course) return res.status(404).json({ message: 'Course not found for this assignment' });

    // Only course instructor or admin can grade
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to grade this assignment' });
    }

    const mark = new AssignmentMark({
      assignment: assignmentId,
      student: studentId,
      marks: parseFloat(marks),
      gradedBy: req.userId,
    });

    await mark.save();
    res.status(201).json({ message: 'Assignment marked', mark });
  } catch (error) {
    res.status(500).json({ message: 'Error marking assignment', error: error.message });
  }
};
