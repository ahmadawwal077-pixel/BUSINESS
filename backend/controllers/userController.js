const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter - reuse from auth
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
});

// Helper function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Business Consultation Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      replyTo: process.env.EMAIL_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error for', to, ':', error.message);
    return { success: false, error: error.message };
  }
};

// Delay helper for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Send welcome emails to all existing users
exports.sendBulkWelcomeEmails = async (req, res) => {
  try {
    // Only admins can use this endpoint
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser || !requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized - Admin only' });
    }

    // Get all users
    const allUsers = await User.find({}).select('name email');
    
    if (allUsers.length === 0) {
      return res.json({ message: 'No users found', sent: 0, failed: 0 });
    }

    console.log(`📨 Starting bulk email campaign to ${allUsers.length} users...`);

    let sent = 0;
    let failed = 0;
    const failedUsers = [];

    // Send emails with delay to avoid rate limiting
    for (const user of allUsers) {
      const welcomeContent = `
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
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                      <h1 style="margin: 0; font-size: 2rem; font-weight: 700;">👋 Welcome!</h1>
                      <p style="margin: 10px 0 0 0; font-size: 1rem; opacity: 0.95;">Your Account is Active & Ready to Use</p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px; color: #2c3e50; line-height: 1.8;">
                      
                      <h3 style="margin: 0 0 20px 0; font-size: 1.3rem; color: #1f2937; font-weight: 700;">
                        Hi ${user.name},
                      </h3>
                      
                      <p style="margin: 0 0 15px 0; font-size: 1rem; color: #6b7280;">
                        🎉 Welcome to the Business Consultation Platform! We're thrilled to have you as part of our community.
                      </p>
                      
                      <p style="margin: 0 0 15px 0; font-size: 1rem; color: #6b7280;">
                        Your account is fully active and ready to use. You now have access to:
                      </p>
                      
                      <!-- Features List -->
                      <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #6b7280; font-size: 0.95rem;">
                        <li style="margin-bottom: 10px;">📚 Extensive Course Library with expert instructors</li>
                        <li style="margin-bottom: 10px;">🎓 Professional Certificates upon course completion</li>
                        <li style="margin-bottom: 10px;">👥 Expert Consultations with industry professionals</li>
                        <li style="margin-bottom: 10px;">💬 Community Forum to connect with peers</li>
                        <li style="margin-bottom: 10px;">📊 Progress Dashboard to track your growth</li>
                        <li style="margin-bottom: 10px;">🔔 Personalized Recommendations based on interests</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                              🚀 Start Learning Now
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Getting Started Tips -->
                      <h4 style="margin: 25px 0 15px 0; color: #1f2937; font-weight: 700; font-size: 1.05rem;">
                        🎯 Getting Started:
                      </h4>
                      <ol style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 0.95rem;">
                        <li style="margin-bottom: 10px;">Log in to your account</li>
                        <li style="margin-bottom: 10px;">Complete your profile</li>
                        <li style="margin-bottom: 10px;">Browse available courses</li>
                        <li style="margin-bottom: 10px;">Enroll in courses that interest you</li>
                        <li style="margin-bottom: 10px;">Start your learning journey!</li>
                      </ol>
                      
                      <!-- Divider -->
                      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;"/>
                      
                      <!-- Support Info -->
                      <p style="margin: 0; font-size: 0.9rem; color: #6b7280;">
                        <strong>Need Help?</strong> Our support team is available to assist you. Reply to this email or visit our help center.
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

      // Send email
      const result = await sendEmail(user.email, '👋 Welcome to Business Consultation Platform!', welcomeContent);
      
      if (result.success) {
        sent++;
        console.log(`✅ Email sent to: ${user.email}`);
      } else {
        failed++;
        failedUsers.push({ email: user.email, name: user.name, error: result.error });
        console.log(`❌ Failed to send to: ${user.email} - ${result.error}`);
      }

      // Delay between emails to avoid rate limiting (nice 2-second delay)
      await delay(2000);
    }

    console.log(`\n📊 Bulk Email Campaign Completed:`);
    console.log(`   ✅ Successfully sent: ${sent}`);
    console.log(`   ❌ Failed: ${failed}`);

    res.json({
      success: true,
      message: `Bulk email campaign completed. Sent: ${sent}, Failed: ${failed}`,
      stats: {
        total: allUsers.length,
        sent,
        failed,
        failedUsers: failed > 0 ? failedUsers : [],
      },
    });
  } catch (error) {
    console.error('Bulk email campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending bulk emails',
      error: error.message,
    });
  }
};
