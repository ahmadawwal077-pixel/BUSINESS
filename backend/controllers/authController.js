const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email configuration with enhanced settings for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: {
    maxConnections: 1,
    maxMessages: Infinity,
    rateDelta: 20000,
    rateLimit: 5,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionUrl: `smtp://${process.env.EMAIL_USER}:${process.env.EMAIL_PASSWORD}@smtp.gmail.com:587`,
});

// Verify transporter connection on startup
console.log('--- Initializing Email Service ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Present' : '✗ Missing');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('   Make sure:');
    console.error('   1. Email & password in .env are correct');
    console.error('   2. Gmail 2-Factor Authentication is enabled');
    console.error('   3. App Password is generated correctly');
    console.error('   4. Internet connection is working');
  } else {
    console.log('✅ Email transporter ready - Ready to send emails');
  }
});

// Helper function to send emails with enhanced error handling
const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    const mailOptions = {
      from: `"Business Consultation Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      replyTo: process.env.EMAIL_USER,
      textEncoding: 'base64',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    if (error.response) console.error('   Response:', error.response);
    return { success: false, error: error.message, code: error.code };
  }
};

// Test email endpoint for debugging
exports.testEmail = async (req, res) => {
  try {
    console.log('📨 Testing email configuration...');
    const testEmail = process.env.EMAIL_USER;
    
    const testContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Email Test Successful!</h2>
          <p>If you're reading this, the email system is working correctly.</p>
          <p><strong>Test sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Email Service:</strong> Gmail SMTP</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.9rem;">This is a test email from Business Consultation Platform</p>
        </div>
      </body>
      </html>
    `;
    
    const result = await sendEmail(testEmail, '✅ Test Email - Business Consultation Platform', testContent);
    
    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully!' : 'Failed to send test email',
      details: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing email',
      error: error.message,
    });
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Register request:', { name, email }); // Debug log

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationTokenHash,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await user.save();
    console.log('User saved successfully:', user._id); // Debug log

    // Send congratulation email with account details
    const congratulationEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f4f8;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0066cc 0%, #00b4d8 100%); padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 2.5rem; font-weight: 700;">🎉</h1>
                    <h2 style="margin: 10px 0 0 0; font-size: 1.8rem; font-weight: 700; letter-spacing: -0.5px;">Welcome to Our Platform!</h2>
                    <p style="margin: 10px 0 0 0; font-size: 1rem; opacity: 0.95;">Your Learning Journey Starts Here</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; color: #2c3e50; line-height: 1.8;">
                    
                    <!-- Greeting -->
                    <h3 style="margin: 0 0 20px 0; font-size: 1.3rem; color: #1f2937; font-weight: 700;">
                      Hi ${name},
                    </h3>
                    
                    <p style="margin: 0 0 15px 0; font-size: 1rem; color: #6b7280;">
                      🎓 Congratulations on creating your account! We're excited to have you join our community of learners and professionals.
                    </p>
                    
                    <p style="margin: 0 0 25px 0; font-size: 1rem; color: #6b7280;">
                      Your account is now active and you have full access to our platform. Below are your login credentials to get started.
                    </p>
                    
                    <!-- Credentials Box -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0066cc 0%, #00b4d8 100%); padding: 20px 25px; color: white; font-weight: 700; font-size: 1.1rem;">
                          📋 Your Login Credentials
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f8fafc; padding: 25px; border-top: 2px dashed #e0e7ff;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                <span style="color: #6b7280; font-size: 0.9rem; display: block; margin-bottom: 3px;">EMAIL ADDRESS</span>
                                <span style="color: #1f2937; font-size: 1.05rem; font-weight: 600; word-break: break-all;">${email}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0;">
                                <span style="color: #6b7280; font-size: 0.9rem; display: block; margin-bottom: 3px;">PASSWORD</span>
                                <span style="color: #1f2937; font-size: 1.05rem; font-weight: 600; font-family: 'Courier New', monospace; word-break: break-all;">${password}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #00b4d8 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);">
                            🔐 Sign In Now
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Security Warning -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0; border-radius: 8px; background-color: #fffbeb; border-left: 4px solid #fbbf24;">
                      <tr>
                        <td style="padding: 15px 20px; color: #92400e; font-size: 0.95rem;">
                          <strong>⚠️ Security Alert:</strong><br style="margin: 5px 0;"/>
                          • Never share your password with anyone<br/>
                          • Change your password after first login<br/>
                          • Enable two-factor authentication for added security<br/>
                          • Report suspicious activity immediately
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Features List -->
                    <h4 style="margin: 25px 0 15px 0; color: #1f2937; font-weight: 700; font-size: 1.05rem;">
                      ✨ You Now Have Access To:
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 0.95rem;">
                      <li style="margin-bottom: 8px;">📚 <strong>Extensive Course Library</strong> - Learn from industry experts</li>
                      <li style="margin-bottom: 8px;">🎓 <strong>Certificates</strong> - Earn recognized credentials</li>
                      <li style="margin-bottom: 8px;">👥 <strong>Expert Consultations</strong> - Book sessions with professionals</li>
                      <li style="margin-bottom: 8px;">💬 <strong>Community Forum</strong> - Connect with fellow learners</li>
                      <li style="margin-bottom: 8px;">📊 <strong>Progress Tracking</strong> - Monitor your learning journey</li>
                    </ul>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;"/>
                    
                    <!-- Support -->
                    <p style="margin: 0; font-size: 0.95rem; color: #6b7280;">
                      <strong>Need Help?</strong> Our support team is here for you. Reply to this email or visit our help center.
                    </p>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.85rem; color: #9ca3af;">
                    <p style="margin: 0 0 10px 0;">
                      <strong style="color: #1f2937; font-size: 0.95rem;">Business Consultation Platform</strong>
                    </p>
                    <p style="margin: 5px 0; color: #9ca3af;">
                      Empowering professionals through education and consultation
                    </p>
                    <p style="margin: 10px 0 0 0; color: #bfdbfe;">
                      © 2026 Business Consultation Platform. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailResult = await sendEmail(email, '🎉 Welcome! Your Account is Ready - Business Consultation Platform', congratulationEmailContent);
    
    console.log('Email sending result:', emailResult);

    res.status(201).json({
      message: 'User registered successfully. Congratulation email sent!',
      success: true,
      emailSent: emailResult.success,
      userId: user._id,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully. You can now log in.',
      verified: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Note: allow login even if email is not verified

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this email address' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save token and expiry to user
    user.passwordResetToken = resetTokenHash;
    user.passwordResetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f4f8;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 2rem; font-weight: 700;">🔐 Password Reset</h1>
                    <p style="margin: 10px 0 0 0; font-size: 0.95rem; opacity: 0.95;">Secure Your Account</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; color: #2c3e50; line-height: 1.8;">
                    <h3 style="margin: 0 0 20px 0; font-size: 1.3rem; color: #1f2937; font-weight: 700;">Hi ${user.name},</h3>
                    
                    <p style="margin: 0 0 15px 0; font-size: 1rem; color: #6b7280;">
                      We received a request to reset your password. If you didn't make this request, you can safely ignore this email and your password will remain unchanged.
                    </p>
                    
                    <p style="margin: 0 0 25px 0; font-size: 1rem; color: #6b7280;">
                      To set a new password, click the button below:
                    </p>
                    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);">
                            🔄 Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Or Copy Link -->
                    <p style="margin: 20px 0 0 0; font-size: 0.9rem; color: #6b7280; text-align: center;">
                      Or copy and paste this link in your browser:
                    </p>
                    <p style="margin: 10px 0; padding: 12px; background-color: #f8f9fa; border-radius: 6px; word-break: break-all; color: #0066cc; font-size: 0.85rem; font-family: monospace;">
                      ${resetUrl}
                    </p>
                    
                    <!-- Warning -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0; border-radius: 8px; background-color: #fef2f2; border-left: 4px solid #dc2626;">
                      <tr>
                        <td style="padding: 15px 20px; color: #7f1d1d; font-size: 0.95rem;">
                          <strong>⏱️ Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons. If you need another reset, just request a new one.
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Security Tips -->
                    <h4 style="margin: 25px 0 15px 0; color: #1f2937; font-weight: 700; font-size: 1rem;">
                      🛡️ Password Security Tips:
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 0.95rem;">
                      <li style="margin-bottom: 8px;">Use a strong password with uppercase, lowercase, numbers and symbols</li>
                      <li style="margin-bottom: 8px;">Don't use personal information that can be guessed</li>
                      <li style="margin-bottom: 8px;">Never reuse passwords across different platforms</li>
                      <li style="margin-bottom: 8px;">Consider using a password manager</li>
                    </ul>
                    
                    <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;"/>
                    
                    <p style="margin: 0; font-size: 0.9rem; color: #6b7280;">
                      <strong>Didn't request this?</strong> Your account may have been compromised. Please contact support immediately if this wasn't you.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.85rem; color: #9ca3af;">
                    <p style="margin: 0 0 10px 0;">
                      <strong style="color: #1f2937; font-size: 0.95rem;">Business Consultation Platform</strong>
                    </p>
                    <p style="margin: 5px 0; color: #9ca3af;">
                      Empowering professionals through education and consultation
                    </p>
                    <p style="margin: 10px 0 0 0; color: #bfdbfe;">
                      © 2026 Business Consultation Platform. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailResult = await sendEmail(email, '🔐 Password Reset Request - Business Consultation Platform', emailContent);

    res.json({
      message: 'Password reset link sent to your email',
      success: emailResult.success,
      emailSent: emailResult.success,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Hash the token
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.json({
      message: 'Password reset successfully. You can now log in with your new password.',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, company } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, company },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
