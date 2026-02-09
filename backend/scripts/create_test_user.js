require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    await connectDB();

    const email = 'paytest@example.com';
    const name = 'Paystack Test User';
    const plainPassword = 'Password123!';

    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(plainPassword, salt);
      user = new User({ name, email, password: hashed, isEmailVerified: true });
      await user.save();
      console.log('Created test user:', user._id.toString());
    } else {
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
        console.log('Marked existing user as verified:', user._id.toString());
      } else {
        console.log('Test user already exists and verified:', user._id.toString());
      }
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '30d' });
    console.log('\nUse this JWT for Authorization header (Bearer <token>):\n');
    console.log(token);
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
})();
