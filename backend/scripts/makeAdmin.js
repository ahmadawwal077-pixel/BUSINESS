const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

(async () => {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node makeAdmin.js user@example.com');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/consultation';

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOneAndUpdate({ email }, { $set: { isAdmin: true } }, { new: true });
    if (!user) {
      console.error('User not found:', email);
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log('User promoted to admin:', user.email, 'id:', user._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error promoting user:', err.message || err);
    process.exit(1);
  }
})();
