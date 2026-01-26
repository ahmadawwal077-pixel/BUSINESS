const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/consultation';
  try {
    console.log('🗄️  Connecting to MongoDB...');
    console.log('📍 Type:', process.env.MONGODB_URI ? 'Remote (Atlas)' : 'Local');
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('📊 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Troubleshooting:');
    console.error('   - Check MONGODB_URI environment variable');
    console.error('   - Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)');
  }
};

module.exports = connectDB;
