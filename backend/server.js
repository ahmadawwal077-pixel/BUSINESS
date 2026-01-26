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

// CORS configuration - updated for all environments
const allowedOrigins = [
  'http://localhost:3000',                    // Local development
  'http://localhost:5000',                    // Local API calls
  'http://127.0.0.1:3000',                    // Local IP
  process.env.FRONTEND_URL,                   // Render frontend
  'https://frontend-0nbu.onrender.com',       // Your frontend
  'https://business-hkk7.onrender.com',       // Your backend (self)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
console.log('🔓 CORS enabled for:', process.env.FRONTEND_URL || 'http://localhost:3000');

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Preflight requests handler
app.options('*', cors(corsOptions));

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

// ============ TEST ENDPOINTS ============
// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'Server is healthy'
  });
});

// Database connectivity test
app.get('/api/test/db', async (req, res) => {
  try {
    const connectionState = require('mongoose').connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    res.json({
      status: 'success',
      database: states[connectionState],
      connectionState,
      dbName: require('mongoose').connection.name
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// CORS test
app.get('/api/test/cors', (req, res) => {
  res.json({
    status: 'success',
    message: 'CORS is working',
    origin: req.get('origin'),
    userAgent: req.get('user-agent')
  });
});

// Environment variables test (only in development)
app.get('/api/test/env', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production' });
  }
  res.json({
    nodeEnv: process.env.NODE_ENV,
    configuredVars: {
      jwt: !!process.env.JWT_SECRET,
      paystack: !!process.env.PAYSTACK_SECRET_KEY,
      paystackPublic: !!process.env.PAYSTACK_PUBLIC_KEY,
      mongodb: !!process.env.MONGODB_URI,
      frontendUrl: !!process.env.FRONTEND_URL
    },
    port: process.env.PORT || 5000
  });
});

// Auth test - requires token
app.get('/api/test/auth', require('./middleware/auth').protect, (req, res) => {
  res.json({
    status: 'authenticated',
    userId: req.userId,
    message: 'Token verification successful'
  });
});

// Full system status
app.get('/api/test/status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        port: process.env.PORT || 5000,
        host: '0.0.0.0'
      },
      database: {
        status: connectionStates[mongoose.connection.readyState],
        name: mongoose.connection.name
      },
      services: {
        jwt: !!process.env.JWT_SECRET ? '✓' : '✗',
        paystack: !!process.env.PAYSTACK_SECRET_KEY ? '✓' : '✗',
        cors: 'enabled',
        mongodb: mongoose.connection.readyState === 1 ? '✓' : '✗'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============ END TEST ENDPOINTS ============

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
