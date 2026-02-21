const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware - verifies token and attaches user id + role to req
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.warn('⚠️  Auth: No token provided for', req.method, req.path);
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Attach user role for authorization checks (admin/instructor)
    try {
      const user = await User.findById(req.userId).select('isAdmin');
      req.userRole = user && user.isAdmin ? 'admin' : 'user';
    } catch (e) {
      req.userRole = 'user';
    }

    console.log('✓ Auth: Valid token verified for user:', decoded.userId, 'role:', req.userRole);
    next();
  } catch (error) {
    console.error('❌ Auth: Token verification failed -', error.message);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { protect: authMiddleware };
