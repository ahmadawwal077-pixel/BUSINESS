const Course = require('../models/Course');
const CourseEnrollment = require('../models/CourseEnrollment');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Attendance = require('../models/Attendance');
const AssignmentMark = require('../models/AssignmentMark');
const User = require('../models/User');

// Create a new course (Admin/Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, maxStudents, startDate, endDate, schedule, image } = req.body;

    const course = new Course({
      title,
      description,
      instructor: req.userId,
      category,
      level,
      price,
      duration,
      maxStudents,
      startDate,
      endDate,
      schedule,
      image,
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, status, level } = req.query;
    let filter = { status: 'active' };

    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only instructor or admin can update
    if (course.instructor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only instructor or admin can delete
    if (course.instructor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    const courseId = course._id;
    
    // Delete all related data when course is deleted
    // Get all assignments for this course
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    
    // Delete all submissions for these assignments
    await AssignmentSubmission.deleteMany({ assignment: { $in: assignmentIds } });
    
    // Delete all assignment marks
    await AssignmentMark.deleteMany({ assignment: { $in: assignmentIds } });
    
    // Delete all assignments
    await Assignment.deleteMany({ course: courseId });
    
    // Delete all enrollments
    await CourseEnrollment.deleteMany({ course: courseId });
    
    // Delete all attendance records
    await Attendance.deleteMany({ course: courseId });
    
    // Delete the course
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Course and all related data deleted successfully',
      courseId: courseId
    });
  } catch (error) {
    console.error('Course deletion error:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Enroll student in course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({ course: courseId, student: req.userId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Check if course is full
    if (course.enrolledStudents >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Create enrollment
    const enrollment = new CourseEnrollment({
      course: courseId,
      student: req.userId,
      paymentStatus: 'pending',
    });

    await enrollment.save();

    res.status(201).json({ message: 'Enrollment created. Please proceed with payment.', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// Confirm payment and activate enrollment
exports.confirmEnrollmentPayment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await CourseEnrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update enrollment
    enrollment.paymentStatus = 'completed';
    enrollment.paymentDate = new Date();
    enrollment.status = 'active';
    await enrollment.save();

    // Update course enrolled students count
    const course = await Course.findById(enrollment.course);
    course.enrolledStudents += 1;
    await course.save();

    res.json({ message: 'Payment confirmed. You are now enrolled in the course!', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};

// Get student's enrolled courses
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ student: req.userId, status: 'active' })
      .populate('course')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
};

// Get course assignments
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ course: courseId })
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Get attendance for a course
exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    const attendance = await Attendance.find({ course: courseId, student: req.userId })
      .sort({ date: -1 });

    const totalClasses = await Attendance.find({ course: courseId }).distinct('date');
    const presentDays = attendance.filter(a => a.status === 'present').length;

    res.json({
      attendance,
      attendancePercentage: totalClasses.length > 0 ? ((presentDays / totalClasses.length) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get detailed student view for a course: assignments with student's marks + attendance summary
exports.getStudentCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify student is enrolled
    const enrollment = await CourseEnrollment.findOne({ course: courseId, student: req.userId, status: 'active' });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

    // Get assignments for the course
    const assignments = await Assignment.find({ course: courseId }).sort({ dueDate: 1 });

    // For each assignment, get student's submission and mark
    const assignmentDetails = await Promise.all(assignments.map(async (a) => {
      const submission = await AssignmentSubmission.findOne({
        assignment: a._id,
        student: req.userId,
      });
      
      return {
        _id: a._id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        totalPoints: a.totalPoints,
        content: a.content,
        instructor: a.instructor,
        submission: submission ? {
          status: submission.grading.status,
          score: submission.grading.score,
          maxScore: submission.grading.maxScore,
          percentage: submission.grading.percentage,
          comment: submission.grading.comment,
          submittedAt: submission.submittedAt,
          isLate: submission.isLate,
        } : null,
      };
    }));

    // Attendance summary for this student
    const attendanceRecords = await Attendance.find({ course: courseId, student: req.userId }).sort({ date: -1 });
    const totalClasses = await Attendance.find({ course: courseId }).distinct('date');
    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;

    res.json({
      assignments: assignmentDetails,
      attendance: {
        records: attendanceRecords,
        attendancePercentage: totalClasses.length > 0 ? ((presentDays / totalClasses.length) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student course detail', error: error.message });
  }
};

// Add assignment (Instructor only)
exports.addAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, totalPoints } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !totalPoints) {
      return res.status(400).json({ message: 'Missing required fields: title, description, dueDate, totalPoints' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify instructor
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to add assignments to this course' });
    }

    const assignment = new Assignment({
      course: courseId,
      title,
      description,
      dueDate: new Date(dueDate),
      totalPoints: parseInt(totalPoints),
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment added successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding assignment', error: error.message });
  }
};

// Mark attendance (Instructor only)
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, studentId, date, status, notes } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify instructor
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to mark attendance' });
    }

    let attendance = await Attendance.findOne({ course: courseId, student: studentId, date });

    if (attendance) {
      attendance.status = status;
      attendance.notes = notes;
      await attendance.save();
    } else {
      attendance = new Attendance({
        course: courseId,
        student: studentId,
        date,
        status,
        notes,
      });
      await attendance.save();
    }

    res.json({ message: 'Attendance marked', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Get dashboard stats for student
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const enrolledCourses = await CourseEnrollment.find({
      student: req.userId,
      paymentStatus: 'completed',
    });

    const activeEnrollments = enrolledCourses.filter(e => e.status === 'active').length;
    const completedCourses = enrolledCourses.filter(e => e.status === 'completed').length;

    // Calculate average grade
    const totalGrade = enrolledCourses.reduce((sum, e) => sum + e.finalGrade, 0);
    const averageGrade = enrolledCourses.length > 0 ? (totalGrade / enrolledCourses.length).toFixed(2) : 0;

    // Count upcoming assignments
    const upcomingAssignments = await Assignment.find({
      course: { $in: enrolledCourses.map(e => e.course) },
      dueDate: { $gte: new Date() },
    });

    res.json({
      activeCourses: activeEnrollments,
      completedCourses,
      averageGrade,
      upcomingAssignments: upcomingAssignments.length,
      totalEnrolled: enrolledCourses.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get enrolled students for a course (Instructor/Admin only)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    const user = await User.findById(req.userId);
    const isInstructor = course.instructor.toString() === req.userId;
    const isAdmin = user.isAdmin;

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get active enrollments with student details
    const enrollments = await CourseEnrollment.find({
      course: courseId,
      paymentStatus: 'completed',
      status: 'active',
    })
      .populate('student', 'name email phone')
      .lean();

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};
