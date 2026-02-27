# Email Verification & Password Reset Implementation Guide

This document outlines the setup required for the newly implemented email verification and password reset features.

## Backend Requirements

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### Paystack (Payments)

If you want to accept live payments via Paystack, add these environment variables:

```env
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

Webhook setup:

1. In the Paystack dashboard, add a webhook URL pointing to:
   `https://<your-backend-domain>/api/payments/webhook/paystack`
2. Enable transaction events (e.g., `charge.success` / `transaction.success`).
3. Ensure `PAYSTACK_SECRET_KEY` in your backend matches the key in Paystack so the webhook signature can be verified.

Note: the server stores the raw request body for the webhook route so signature verification uses the exact payload. Do not place a body-parser that consumes the body before the webhook route.

### Gmail SMTP Setup

For email functionality to work, you need to:

1. **Create a Gmail App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Factor Authentication if not already enabled
   - Generate an "App password" for "Mail" and "Windows Computer"
   - Use this generated password as `EMAIL_PASSWORD` in your .env file
   - Use your Gmail address as `EMAIL_USER`

2. **Alternative Email Services:**
   - You can also use other email services by modifying the transporter configuration in `authController.js`
   - Examples: SendGrid, Mailgun, AWS SES, etc.

### Backend Changes Made

1. **User Model** (`models/User.js`):
   - Added `isEmailVerified` (boolean) - tracks if email is verified
   - Added `emailVerificationToken` - stores hashed token
   - Added `emailVerificationTokenExpires` - token expiration time
   - Added `passwordResetToken` - stores hashed reset token
   - Added `passwordResetTokenExpires` - token expiration time

2. **Auth Controller** (`controllers/authController.js`):
   - New `verifyEmail` function - validates email verification tokens
   - Updated `register` function - generates verification token and sends email
   - Updated `login` function - requires email verification before login
   - New `forgotPassword` function - generates password reset token and sends email
   - New `resetPassword` function - validates reset token and updates password

3. **Auth Routes** (`routes/authRoutes.js`):
   - `GET /auth/verify-email/:token` - verify email
   - `POST /auth/forgot-password` - request password reset
   - `POST /auth/reset-password/:token` - reset password with token

### Dependencies Installed

```bash
npm install nodemailer
```

## Frontend Requirements

### New Pages Created

1. **VerifyEmail.js** - Email verification page
   - Accessible at `/verify-email/:token`
   - Handles token validation and verification
   - Shows success or error messages

2. **ForgotPassword.js** - Forgot password request page
   - Accessible at `/forgot-password`
   - Allows users to request password reset
   - Sends reset link to email

3. **ResetPassword.js** - Password reset page
   - Accessible at `/reset-password/:token`
   - Allows users to set new password
   - Validates token before allowing reset

### Frontend Changes Made

1. **Register Page** - Now shows email verification message after signup
2. **Login Page** - Added "Forgot Password" link
3. **App.js** - Added new routes for verify-email, forgot-password, and reset-password
4. **AuthContext.js** - Updated register to not auto-login (requires email verification)
5. **API Service** - Added new auth endpoints

## User Flow

### Registration Flow
1. User fills registration form
2. Backend creates user with `isEmailVerified = false`
3. Verification email sent with link
4. User clicks link → verification page
5. Token validated → email marked as verified
6. User can now login

### Login Flow
1. User enters credentials
2. System checks `isEmailVerified`
3. If not verified: error message shown
4. If verified: login proceeds normally

### Forgot Password Flow
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Backend sends reset link to email
4. User clicks link → reset password page
5. User enters new password
6. Password updated and user can login with new password

## Testing

### Test Registration with Email Verification
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## Email Templates

The emails are sent with HTML formatting including:
- Welcome message
- Verification/Reset link
- Clickable button
- Alternative text link
- Expiration time
- Additional instructions

## Security Features

1. **Token Hashing** - Tokens are hashed with SHA256 before storage
2. **Token Expiration** - Verification tokens expire in 24 hours, reset tokens in 1 hour
3. **Email Protection** - One-way token hashing means tokens can't be reverse-engineered
4. **Password Security** - New passwords are hashed with bcrypt before storage

## Troubleshooting

### Emails Not Sending
1. Check EMAIL_USER and EMAIL_PASSWORD are correct
2. Ensure Gmail App Password is used (not regular password)
3. Check 2FA is enabled on Gmail account
4. Verify EMAIL_USER format is correct email address

### Email Links Not Working
1. Ensure FRONTEND_URL in .env points to correct domain
2. Check frontend routes are added in App.js
3. Verify route parameter names match (:token)

### Verification/Reset Link Invalid
1. Check token hasn't expired (24h for email, 1h for password)
2. Ensure token hasn't been modified in URL
3. Check user still exists in database

## Future Enhancements

- Email resend functionality
- Rate limiting on email sends
- Custom email templates
- Email notification preferences
- SMS verification as backup
- Two-factor authentication
