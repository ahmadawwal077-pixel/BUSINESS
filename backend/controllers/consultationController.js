const ConsultationRequest = require('../models/ConsultationRequest');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Create consultation request
exports.createConsultationRequest = async (req, res) => {
  try {
    const { fullName, email, phone, company, serviceType, preferredDate, preferredTime, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        message: 'Full name, email, and phone number are required' 
      });
    }

    // Create new consultation request
    const consultationRequest = new ConsultationRequest({
      fullName,
      email,
      phone,
      company,
      serviceType,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime,
      message,
    });

    // Save to database
    await consultationRequest.save();

    // Send response immediately, emails in background
    res.status(201).json({
      message: 'Consultation request submitted successfully. Check your email for confirmation.',
      consultationRequest,
    });

    // Send emails asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        // Format date and time for email
        const dateObj = preferredDate ? new Date(preferredDate) : null;
        const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'To be confirmed';
        const timeStr = preferredTime ? preferredTime : 'To be confirmed';
        const formattedServiceType = serviceType || 'general';
        const serviceTypeFormatted = formattedServiceType.charAt(0).toUpperCase() + formattedServiceType.slice(1).replace('_', ' ');

        // Professional User Confirmation Email
        const userEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Request Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f7fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #0052a3 50%, #00b4d8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Consultation Request Received</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">We've received your request and will be in touch shortly</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; color: #2d3748;">
              <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 500;">Hi <strong>${fullName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">Thank you for scheduling a consultation with us! We've received your request and our team is reviewing it now. We're excited to discuss how we can help you achieve your goals.</p>

              <!-- Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%); border-left: 4px solid #0066cc; border-radius: 6px; margin: 28px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #0066cc; text-transform: uppercase; letter-spacing: 0.5px;">Consultation Details</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #718096;">
                          <strong>Service Type:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #2d3748; text-align: right;">
                          <strong>${serviceTypeFormatted}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #718096;">
                          <strong>Preferred Date:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #2d3748; text-align: right;">
                          <strong>${dateStr}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #718096;">
                          <strong>Preferred Time:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #2d3748; text-align: right;">
                          <strong>${timeStr}</strong>
                        </td>
                      </tr>
                      ${company ? '<tr><td style="padding: 8px 0; font-size: 14px; color: #718096;"><strong>Company:</strong></td><td style="padding: 8px 0; font-size: 14px; color: #2d3748; text-align: right;"><strong>' + company + '</strong></td></tr>' : ''}
                      ${message ? '<tr><td colspan="2" style="padding: 8px 0; font-size: 14px; color: #718096;"><strong>Message:</strong><br><span style="color: #2d3748; margin-top: 6px; display: block;">' + message.substring(0, 200) + (message.length > 200 ? '...' : '') + '</span></td></tr>' : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next -->
              <div style="background: #f7fafc; border-radius: 6px; padding: 24px; margin: 28px 0;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #2d3748; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next?</p>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #4a5568;">
                  <li style="margin: 8px 0;"><strong>Review:</strong> Our team will review your request within 24 hours</li>
                  <li style="margin: 8px 0;"><strong>Confirmation:</strong> We'll contact you to confirm the consultation details</li>
                  <li style="margin: 8px 0;"><strong>Preparation:</strong> You'll receive a meeting link and agenda before your appointment</li>
                  <li style="margin: 8px 0;"><strong>Consultation:</strong> Meet with our expert to discuss your needs</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0066cc 0%, #0052a3); border-radius: 6px; padding: 14px 32px;">
                          <a href="https://positivehills.com" style="color: white; text-decoration: none; font-size: 15px; font-weight: 700; display: block; letter-spacing: 0.3px;">Visit Our Website</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Contact Info -->
              <p style="margin: 28px 0 0 0; padding-top: 28px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; line-height: 1.6;">
                If you have any questions before your consultation, feel free to reach out to us:
              </p>
              <p style="margin: 8px 0; font-size: 14px;">
                📧 <a href="mailto:hello@positivehills.com" style="color: #0066cc; text-decoration: none; font-weight: 500;">hello@positivehills.com</a><br>
                📞 <a href="tel:+1-800-CONSULT" style="color: #0066cc; text-decoration: none; font-weight: 500;">+1 (800) CONSULT</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f7fafc; border-top: 1px solid #e2e8f0; padding: 28px 30px; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #718096;">
                <strong>Reference ID:</strong> ${consultationRequest._id}
              </p>
              <p style="margin: 0; font-size: 12px; color: #a0aec0;">
                © 2026 PositiveHills Consulting. All rights reserved.<br>
                <a href="https://positivehills.com/privacy" style="color: #0066cc; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://positivehills.com/terms" style="color: #0066cc; text-decoration: none;">Terms of Service</a>
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

        // Professional Admin Notification Email
        const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f7fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
          
          <!-- Alert Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">🎯 New Consultation Request</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Immediate action required</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px; color: #2d3748;">
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;"><strong>A new consultation request has been submitted.</strong> Please review the details below and follow up within 24 hours.</p>

              <!-- Contact Details -->
              <div style="background: #f7fafc; border-left: 4px solid #059669; border-radius: 6px; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Prospect Information</p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Name:</strong>
                    </td>
                    <td style="padding: 10px 0; font-size: 14px; color: #2d3748;">
                      ${fullName}
                    </td>
                  </tr>
                  <tr style="background: rgba(0, 0, 0, 0.02);">
                    <td style="padding: 10px; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Email:</strong>
                    </td>
                    <td style="padding: 10px; font-size: 14px; color: #2d3748;">
                      <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Phone:</strong>
                    </td>
                    <td style="padding: 10px 0; font-size: 14px; color: #2d3748;">
                      <a href="tel:${phone}" style="color: #0066cc; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                  ${company ? '<tr style="background: rgba(0, 0, 0, 0.02);"><td style="padding: 10px; font-size: 14px; color: #718096; width: 40%;"><strong>Company:</strong></td><td style="padding: 10px; font-size: 14px; color: #2d3748;">' + company + '</td></tr>' : ''}
                  <tr>
                    <td style="padding: 10px 0; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Service Type:</strong>
                    </td>
                    <td style="padding: 10px 0; font-size: 14px; color: #2d3748;">
                      ${serviceTypeFormatted}
                    </td>
                  </tr>
                  <tr style="background: rgba(0, 0, 0, 0.02);">
                    <td style="padding: 10px; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Preferred Date:</strong>
                    </td>
                    <td style="padding: 10px; font-size: 14px; color: #2d3748;">
                      ${dateStr}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 14px; color: #718096; width: 40%;">
                      <strong>Preferred Time:</strong>
                    </td>
                    <td style="padding: 10px 0; font-size: 14px; color: #2d3748;">
                      ${timeStr}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message -->
              ${message ? `
              <div style="margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #2d3748; text-transform: uppercase; letter-spacing: 0.5px;">Prospect Message:</p>
                <div style="background: #f7fafc; border-left: 4px solid #718096; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #4a5568;">
                  ${message}
                </div>
              </div>
              ` : ''}

              <!-- Action Items -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Action Items</p>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #78350f;">
                  <li style="margin: 6px 0;">Review the consultation request details</li>
                  <li style="margin: 6px 0;">Contact the prospect within 24 hours</li>
                  <li style="margin: 6px 0;">Confirm preferred date and time</li>
                  <li style="margin: 6px 0;">Send meeting link and preparation materials</li>
                  <li style="margin: 6px 0;">Mark as "contacted" in the system</li>
                </ol>
              </div>

              <!-- Request ID -->
              <p style="margin: 20px 0 0 0; padding: 16px; background: #f0f4ff; border-left: 3px solid #0066cc; border-radius: 4px; font-size: 13px; color: #1e3a8a; font-family: 'Courier New', monospace;">
                <strong>Request ID:</strong> ${consultationRequest._id}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f7fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #718096;">
              <p style="margin: 0;">This is an automated notification from your consultation management system.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        // Send emails
        await sendEmail(email, '✓ Consultation Request Received', userEmailContent);
        await sendEmail(
          process.env.EMAIL_USER || 'hello@positivehills.com',
          '🎯 New Consultation Request - ' + fullName,
          adminEmailContent
        );
        console.log('✓ Professional emails sent successfully for consultation:', consultationRequest._id);
      } catch (emailError) {
        console.error('Error sending emails:', emailError.message);
      }
    });
  } catch (error) {
    console.error('Error creating consultation request:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all consultation requests (Admin)
exports.getAllConsultationRequests = async (req, res) => {
  try {
    const consultationRequests = await ConsultationRequest.find().sort({ createdAt: -1 });
    res.json(consultationRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get consultation request by ID
exports.getConsultationRequest = async (req, res) => {
  try {
    const consultationRequest = await ConsultationRequest.findById(req.params.id);
    
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }
    
    res.json(consultationRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update consultation request status
exports.updateConsultationRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'reviewed', 'contacted', 'completed', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const consultationRequest = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    res.json({ 
      message: 'Consultation request status updated', 
      consultationRequest 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete consultation request
exports.deleteConsultationRequest = async (req, res) => {
  try {
    const consultationRequest = await ConsultationRequest.findByIdAndDelete(req.params.id);

    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    res.json({ message: 'Consultation request deleted', consultationRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
