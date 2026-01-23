const User = require('../models/User');

exports.getStudents = async (req, res) => {
  try {
    // Only admins may list students
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser || !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const students = await User.find({ isAdmin: false }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};
