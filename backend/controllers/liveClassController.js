const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const CourseEnrollment = require('../models/CourseEnrollment');
const User = require('../models/User');

exports.addLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, scheduledAt, durationMinutes, meetingUrl } = req.body;

    if (!title || !scheduledAt) {
      return res.status(400).json({ message: 'Missing required fields: title, scheduledAt' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only instructor or admin
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to schedule classes for this course' });
    }

    const live = new LiveClass({
      course: courseId,
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 60,
      meetingUrl,
      createdBy: req.userId,
    });

    await live.save();
    res.status(201).json({ message: 'Live class scheduled', live });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling live class', error: error.message });
  }
};

exports.getCourseLiveClasses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const classes = await LiveClass.find({ course: courseId }).sort({ scheduledAt: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live classes', error: error.message });
  }
};

// Upcoming classes for authenticated student across enrolled courses
exports.getUpcomingLiveClassesForStudent = async (req, res) => {
  try {
    // find enrolled active courses
    const enrollments = await CourseEnrollment.find({ student: req.userId, status: 'active' }).select('course');
    const courseIds = enrollments.map(e => e.course);

    const now = new Date();
    const upcoming = await LiveClass.find({ course: { $in: courseIds }, scheduledAt: { $gte: now } })
      .sort({ scheduledAt: 1 })
      .limit(10)
      .populate('course', 'title');

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming live classes', error: error.message });
  }
};

// Delete a live class (instructor or admin)
exports.deleteLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const live = await LiveClass.findById(id);
    if (!live) return res.status(404).json({ message: 'Live class not found' });

    const course = await Course.findById(live.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this live class' });
    }

    await LiveClass.findByIdAndDelete(id);
    res.json({ message: 'Live class deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting live class', error: error.message });
  }
};

// Mark attendance for a live class (instructor or admin)
exports.markAttendanceForLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance } = req.body; // [{ studentId, status, notes }]

    if (!Array.isArray(attendance)) return res.status(400).json({ message: 'Attendance array required' });

    const live = await LiveClass.findById(id);
    if (!live) return res.status(404).json({ message: 'Live class not found' });

    const course = await Course.findById(live.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) return res.status(403).json({ message: 'Not authorized' });
    if (course.instructor.toString() !== req.userId && !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to mark attendance' });
    }

    const Attendance = require('../models/Attendance');
    const classDate = new Date(live.scheduledAt);

    const results = [];
    for (const a of attendance) {
      if (!a.studentId || !a.status) continue;
      const filter = { course: course._id, student: a.studentId, date: classDate };
      let record = await Attendance.findOne(filter);
      if (record) {
        record.status = a.status;
        record.notes = a.notes || record.notes;
        await record.save();
      } else {
        record = new Attendance({ course: course._id, student: a.studentId, date: classDate, status: a.status, notes: a.notes || '' });
        await record.save();
      }
      results.push(record);
    }

    res.json({ message: 'Attendance updated', results });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};
