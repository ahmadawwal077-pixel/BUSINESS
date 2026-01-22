# Nigerian Payment Integration - Paystack Setup Guide

## Overview
Your consulting platform now uses **Paystack** for Nigerian payment processing (NGN currency) instead of Stripe.

## What Changed

### Backend Updates
1. **Payment Controller** (`backend/controllers/paymentController.js`)
   - Replaced Stripe with Paystack API
   - `createPaymentIntent()` → Creates Paystack transaction and returns authorization URL
   - `confirmPayment()` → Verifies Paystack payment reference
   - Currency changed from USD to NGN

2. **Environment Variables** (`backend/.env`)
   - Replaced: `STRIPE_SECRET_KEY` 
   - Added: `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`

3. **Payment Model** (`backend/models/Payment.js`)
   - Added `paystackPaymentRef` field for Paystack transaction reference
   - Added `verifiedAt` timestamp for payment verification
   - Changed `currency` default from 'usd' to 'NGN'
   - Updated `paymentMethod` enum to include: 'paystack', 'stripe', 'card', 'bank_transfer', 'ussd'

4. **Dependencies**
   - Installed `axios` package for Paystack API calls

### Frontend Updates
1. **MakeAppointment.js**
   - Updated payment form to collect email instead of card details
   - Added email field to appointment form
   - Changed payment flow to redirect to Paystack checkout page
   - Updated currency display: USD → NGN (₦)
   - Price conversion: USD × 1500 = NGN (approximate)
   - Simplified payment step UI to show Paystack options

## Setup Instructions

### Step 1: Get Paystack Credentials
1. Go to [paystack.com](https://paystack.com)
2. Create an account or log in
3. Navigate to **Settings → API Keys & Webhooks**
4. Copy your:
   - **Secret Key** (starts with `sk_live_` or `sk_test_`)
   - **Public Key** (starts with `pk_live_` or `pk_test_`)

### Step 2: Update .env File
Edit `backend/.env`:
```dotenv
PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_key_here
```

### Step 3: Restart Backend
```bash
cd backend
npm install  # if you haven't already
npm start
```

The backend will use the new Paystack integration.

## How It Works

### User Payment Flow
1. **User books appointment** → Fills service, date, time, email
2. **Proceeds to payment** → Enters email address
3. **Payment gateway** → Redirected to Paystack checkout
4. **Payment options**:
   - 💳 Card payment
   - 🏦 Bank transfer
   - 📱 USSD code
5. **Confirmation** → After payment, appointment is confirmed

### API Endpoints

#### 1. Create Payment Transaction
**POST** `/api/payment/create`
```json
{
  "amount": 199.99,
  "appointmentId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```
**Response**:
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "xxxxxxx",
  "reference": "xxxxxxxxxxxxx",
  "paymentId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

#### 2. Verify Payment
**POST** `/api/payment/confirm`
```json
{
  "reference": "xxxxxxxxxxxxx",
  "paymentId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

## Currency Conversion

Current conversion used in pricing:
- **1 USD = 1500 NGN** (approximate)

You can adjust this in `MakeAppointment.js`:
```javascript
// Change this line to update conversion rate
₦{(getServicePrice(appointmentData.service) * 1500).toLocaleString()}
```

## Paystack Features

✅ **Payment Methods**
- Credit/Debit Cards (Visa, Mastercard)
- Bank Account Transfer
- USSD codes
- Mobile Money

✅ **Security**
- PCI DSS compliant
- SSL encryption
- Fraud detection
- 3D Secure support

✅ **Features**
- Real-time notifications
- Comprehensive dashboard
- Transaction history
- Refunds support
- Settlement to bank account

## Testing

### Test Credentials
Use Paystack test mode for development:
- **Public Key**: `pk_test_...`
- **Secret Key**: `sk_test_...`

### Test Card Numbers
- Visa: `4012 3211 1111 1111` (CVC: 123, any future date)
- Mastercard: `5399 8105 0000 0019` (CVC: 589, any future date)

## Troubleshooting

### "Payment initialization failed"
- Check Paystack keys in `.env` are correct
- Verify email is provided in payment request
- Check axios is installed: `npm list axios`

### Payment not verified
- Ensure transaction reference is passed correctly
- Check Paystack dashboard for transaction status
- Verify API keys have correct permissions

### Currency display issues
- Confirm conversion rate matches your preferred NGN rate
- Update the multiplier (currently 1500) in `MakeAppointment.js`

## Support Resources
- **Paystack Docs**: https://paystack.com/docs
- **API Reference**: https://paystack.com/docs/api
- **Status Page**: https://status.paystack.com

## Next Steps
1. ✅ Update `.env` with Paystack credentials
2. ✅ Restart backend server
3. ✅ Test payment flow with test credentials
4. ✅ Verify transaction appears in Paystack dashboard
5. ✅ Adjust price/currency conversion as needed
6. ✅ Go live with actual Paystack keys

---

**Backend Service:** Uses Paystack API for secure transaction initialization and verification  
**Frontend Display:** Nigerian Naira (₦) currency with converted prices  
**Database:** Stores Paystack reference IDs for transaction tracking
