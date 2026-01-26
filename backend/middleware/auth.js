const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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
    console.log('✓ Auth: Valid token verified for user:', decoded.userId);
    next();
  } catch (error) {
    console.error('❌ Auth: Token verification failed -', error.message);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { protect: authMiddleware };
