const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/consultation';
  try {
    console.log('Connecting to MongoDB:', process.env.MONGODB_URI ? (process.env.MONGODB_URI.split('@')[1] || 'remote') : 'local');
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Proceeding without exiting so you can debug locally. Set MONGODB_URI to a valid connection string.');
  }
};

module.exports = connectDB;
