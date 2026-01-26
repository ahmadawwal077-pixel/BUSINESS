require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

console.log('🚀 Starting Business Consultation API Server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 API will run on port:', process.env.PORT || 5000);

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const courseRoutes = require('./routes/courseRoutes');
const liveRoutes = require('./routes/liveRoutes');
const userRoutes = require('./routes/userRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration for Render deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
console.log('🔓 CORS enabled for:', corsOptions.origin);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Business Consultation API Server', status: 'running' });
});

console.log('📍 Registering API routes...');

// API root route
app.get('/api', (req, res) => {
  res.json({
    message: 'Business Consultation API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      assignments: '/api/assignments',
      appointments: '/api/appointments',
      payments: '/api/payments',
      blogs: '/api/blogs',
      users: '/api/users',
      newsletter: '/api/newsletter',
      live: '/api/live',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/live', liveRoutes);

console.log('✓ All API routes registered successfully');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`📡 API ready at: http://0.0.0.0:${PORT}/api`);
  console.log('🔐 Environment vars:', {
    jwt: !!process.env.JWT_SECRET,
    paystack: !!process.env.PAYSTACK_SECRET_KEY,
    mongodb: !!process.env.MONGODB_URI
  });
  console.log('🎉 Ready to accept requests!');
});

// Handle port binding errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    console.error(`   Set PORT environment variable to a different port.`);
  } else if (err.code === 'EACCES') {
    console.error(`❌ Port ${PORT} requires elevated privileges.`);
  } else {
    console.error(`❌ Server error:`, err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📍 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📍 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    process.exit(0);
  });
});
