const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Course = require('../models/Course');
const CourseEnrollment = require('../models/CourseEnrollment');
const AssignmentMark = require('../models/AssignmentMark');
const User = require('../models/User');

// Create assignment with attachments
exports.createAssignment = async (req, res) => {
  try {
    console.log('Received assignment creation request:', {
      courseId: req.body.courseId,
      title: req.body.title,
      dueDate: req.body.dueDate,
      userId: req.userId,
    });

    const { courseId, title, description, instructions, dueDate, totalPoints } = req.body;
    const { text, files, images } = req.body.content || {};

    // Validate required fields
    if (!courseId || !title || !description || !dueDate) {
      console.error('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields: courseId, title, description, dueDate' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only course instructor or admin can create assignments
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) {
      console.error('User not found:', req.userId);
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      console.error('User not authorized to create assignment for course:', courseId);
      return res.status(403).json({ message: 'Not authorized to create assignments' });
    }

    // Process files - they come as base64 strings or URLs
    const processedFiles = (files || [])
      .filter(f => f && f.fileName) // Filter out empty entries
      .map(f => ({
        fileName: String(f.fileName || '').trim(),
        fileUrl: f.fileData || '', // Store base64 data directly
        fileType: String(f.fileType || '').trim(),
        uploadedAt: new Date(),
      }));

    // Process images - they come as base64 strings or URLs
    const processedImages = (images || [])
      .filter(img => img && img.imageData) // Filter out empty entries
      .map(img => ({
        imageUrl: img.imageData || '', // Store base64 data directly
        caption: String(img.caption || '').trim(),
        uploadedAt: new Date(),
      }));

    console.log('Creating assignment with:', {
      title: title.trim(),
      filesCount: processedFiles.length,
      imagesCount: processedImages.length,
    });

    const assignment = new Assignment({
      course: courseId,
      title: title.trim(),
      description: description.trim(),
      instructions: instructions ? instructions.trim() : '',
      dueDate: new Date(dueDate),
      totalPoints: parseFloat(totalPoints) || 100,
      content: {
        text: text || '',
        files: processedFiles,
        images: processedImages,
      },
      instructor: req.userId,
    });

    await assignment.save();
    await assignment.populate('instructor', 'name email');
    
    console.log('Assignment created successfully:', assignment._id);
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error('Assignment creation error:', error);
    res.status(500).json({ 
      message: 'Error creating assignment', 
      error: error.message 
    });
  }
};

// Get all assignments for a course
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const assignments = await Assignment.find({ course: courseId })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await Assignment.findById(assignmentId)
      .populate('course')
      .populate('instructor', 'name email');
    
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, instructions, dueDate, totalPoints, content } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const course = await Course.findById(assignment.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only course instructor or admin can update
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this assignment' });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.instructions = instructions || assignment.instructions;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.totalPoints = totalPoints !== undefined ? totalPoints : assignment.totalPoints;
    
    if (content) {
      assignment.content = content;
    }
    
    assignment.updatedAt = Date.now();
    await assignment.save();

    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const course = await Course.findById(assignment.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only course instructor or admin can delete
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    }

    await Assignment.findByIdAndDelete(assignmentId);
    await AssignmentSubmission.deleteMany({ assignment: assignmentId });

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

// Submit assignment response
exports.submitAssignmentResponse = async (req, res) => {
  try {
    const { assignmentId, courseId } = req.params;
    const { submission } = req.body;
    const studentId = req.userId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if student is enrolled in course
    const enrollment = await CourseEnrollment.findOne({
      course: courseId,
      student: studentId,
      status: 'active',
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

    // Process files - they come as base64 strings
    let processedSubmission = { ...submission };
    if (submission && submission.files) {
      processedSubmission.files = (submission.files || [])
        .filter(f => f && f.fileName) // Filter out empty entries
        .map(f => ({
          fileName: String(f.fileName || '').trim(),
          fileUrl: f.fileData || '', // Store base64 data
          fileType: String(f.fileType || '').trim(),
          uploadedAt: new Date(),
        }));
    }

    // Process images - they come as base64 strings
    if (submission && submission.images) {
      processedSubmission.images = (submission.images || [])
        .filter(img => img && img.imageData) // Filter out empty entries
        .map(img => ({
          imageUrl: img.imageData || '', // Store base64 data
          caption: String(img.caption || '').trim(),
          uploadedAt: new Date(),
        }));
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    // Check if submission already exists
    let assignmentSubmission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: studentId,
    });

    if (assignmentSubmission) {
      // Update existing submission
      assignmentSubmission.submission = processedSubmission;
      assignmentSubmission.submittedAt = Date.now();
      assignmentSubmission.isLate = isLate;
      assignmentSubmission.updatedAt = Date.now();
      await assignmentSubmission.save();
    } else {
      // Create new submission
      assignmentSubmission = new AssignmentSubmission({
        assignment: assignmentId,
        course: courseId,
        student: studentId,
        submission: processedSubmission,
        isLate,
      });
      await assignmentSubmission.save();
    }

    await assignmentSubmission.populate('student', 'name email');
    await assignmentSubmission.populate('assignment', 'title');

    res.json({ message: 'Assignment submitted successfully', submission: assignmentSubmission });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  }
};

// Get student submission for assignment
exports.getStudentSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.userId;

    const submission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: studentId,
    }).populate('student', 'name email');

    res.json(submission || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
};

// Get all submissions for assignment (admin/instructor only)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const course = await Course.findById(assignment.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only instructor or admin can view all submissions
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view submissions' });
    }

    const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
      .populate('student', 'name email')
      .populate('assignment', 'title dueDate totalPoints')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Grade assignment submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, comment, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const assignment = await Assignment.findById(submission.assignment);
    const course = await Course.findById(submission.course);

    // Only instructor or admin can grade
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to grade' });
    }

    const maxScore = assignment.totalPoints;
    const percentage = (score / maxScore) * 100;

    submission.grading = {
      status: 'graded',
      score,
      maxScore,
      percentage,
      comment,
      gradedAt: Date.now(),
      gradedBy: req.userId,
    };

    if (feedback) {
      submission.feedback = feedback;
    }

    submission.updatedAt = Date.now();
    await submission.save();

    await submission.populate('student', 'name email');
    await submission.populate('grading.gradedBy', 'name email');

    res.json({ message: 'Submission graded successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Error grading submission', error: error.message });
  }
};

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
