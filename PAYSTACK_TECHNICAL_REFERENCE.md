# Paystack API Reference - Technical Implementation

## Environment Configuration

### .env Variables
```dotenv
# Paystack Payment Gateway
PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here      # Keep this secure!
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here      # For frontend (if needed)

# API Base URL
# Production: https://api.paystack.co
# Test: https://api.paystack.co (same endpoint, use test keys)
```

## Backend API Endpoints

### 1. Create Payment Transaction
**Endpoint**: `POST /api/payment/create`

**Request Body**:
```javascript
{
  "amount": 199.99,              // Amount in USD (will be converted to NGN in DB)
  "appointmentId": "507f1f77bcf86cd799439011",  // MongoDB appointment ID
  "email": "user@example.com",   // Customer email (required by Paystack)
  "fullName": "John Doe"         // Customer name for metadata
}
```

**Success Response** (200):
```javascript
{
  "authorization_url": "https://checkout.paystack.com/7q90j1da...",
  "access_code": "7q90j1da",
  "reference": "7q90j1da",
  "paymentId": "507f1f77bcf86cd799439012"  // Your payment record ID
}
```

**Error Response** (400/500):
```javascript
{
  "message": "Amount, appointment ID, and email are required",
  "error": "error details"
}
```

### 2. Verify Payment
**Endpoint**: `POST /api/payment/confirm`

**Request Body**:
```javascript
{
  "reference": "7q90j1da",  // From Paystack callback
  "paymentId": "507f1f77bcf86cd799439012"  // Your payment record ID
}
```

**Success Response** (200):
```javascript
{
  "message": "Payment successful",
  "payment": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439010",
    "appointment": "507f1f77bcf86cd799439011",
    "amount": 199.99,
    "currency": "NGN",
    "paystackPaymentRef": "7q90j1da",
    "status": "completed",
    "paymentMethod": "paystack",
    "verifiedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:25:00Z"
  }
}
```

## Frontend Integration

### Initialize Paystack Payment

```javascript
// In MakeAppointment.js
const handlePayment = async (e) => {
  e.preventDefault();
  
  try {
    // Step 1: Create payment transaction
    const paymentResponse = await paymentAPI.createPaymentIntent({
      amount: 199.99,
      appointmentId: appointmentData._id,
      email: userEmail,
      fullName: userName,
    });

    // Step 2: Redirect to Paystack checkout
    window.location.href = paymentResponse.authorization_url;
    
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Handle Paystack Callback

After user completes payment on Paystack, they're redirected to your success/fail page with reference in URL:

```javascript
// Example: https://yourapp.com/appointments?reference=7q90j1da

// Extract and verify in your component
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference');
  
  if (reference) {
    verifyPayment(reference);
  }
}, []);

const verifyPayment = async (reference) => {
  try {
    const response = await paymentAPI.confirmPayment({
      reference: reference,
      paymentId: appointmentData._id,
    });
    
    if (response.payment.status === 'completed') {
      console.log('Payment verified successfully!');
      navigate('/appointments');
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
  }
};
```

## Paystack Direct API (if needed)

### Transaction Initialize
**Endpoint**: `POST https://api.paystack.co/transaction/initialize`

**Headers**:
```javascript
{
  "Authorization": "Bearer sk_live_xxxxx",
  "Content-Type": "application/json"
}
```

**Request Body**:
```javascript
{
  "email": "user@example.com",
  "amount": 19999,  // In kobo (kobo = NGN × 100)
  "metadata": {
    "appointmentId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "fullName": "John Doe"
  }
}
```

**Response**:
```javascript
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "7q90j1da",
    "reference": "7q90j1da"
  }
}
```

### Transaction Verify
**Endpoint**: `GET https://api.paystack.co/transaction/verify/{reference}`

**Headers**:
```javascript
{
  "Authorization": "Bearer sk_live_xxxxx"
}
```

**Response**:
```javascript
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "id": 123456789,
    "reference": "7q90j1da",
    "amount": 19999,
    "paid_at": "2024-01-15T10:30:00.000Z",
    "customer": {
      "id": 987654321,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "authorization": {
      "authorization_code": "AUTH_xxxxx",
      "card_type": "visa"
    },
    "status": "success"
  }
}
```

## Database Schema

### Payment Document

```javascript
{
  "_id": ObjectId,
  "user": ObjectId,          // Reference to User
  "appointment": ObjectId,   // Reference to Appointment
  "amount": Number,          // Amount in USD
  "currency": "NGN",         // Always "NGN" for Paystack
  "paystackPaymentRef": String,  // Paystack transaction reference
  "stripePaymentId": String, // Kept for backward compatibility
  "status": "completed",     // 'pending' | 'completed' | 'failed'
  "paymentMethod": "paystack", // 'paystack' | 'stripe' | 'card' | 'bank_transfer' | 'ussd'
  "verifiedAt": ISODate,    // When payment was verified
  "createdAt": ISODate      // When payment record was created
}
```

## Error Handling

### Common Errors and Solutions

**Invalid API Key**
```
Error: Unauthorized - Invalid API key
Solution: Verify PAYSTACK_SECRET_KEY in .env is correct
```

**Missing Email**
```
Error: Amount, appointment ID, and email are required
Solution: Ensure email is passed in payment request
```

**Payment Not Initialized**
```
Error: Failed to initialize payment
Solution: Check Paystack API status, verify network connectivity
```

**Invalid Reference**
```
Error: Payment verification failed
Solution: Verify reference string is correct, payment may not have completed
```

## Testing Checklist

- [ ] .env updated with Paystack test keys (`sk_test_`, `pk_test_`)
- [ ] Backend restarted after env change
- [ ] Test card payment: `4012 3211 1111 1111`
- [ ] Verify transaction in Paystack dashboard
- [ ] Check payment status changes from 'pending' to 'completed'
- [ ] Verify appointment marked as paid
- [ ] Test failed payment flow
- [ ] Check error messages display correctly

## Production Checklist

- [ ] Updated .env with Paystack live keys (`sk_live_`, `pk_live_`)
- [ ] Set NODE_ENV to 'production'
- [ ] Tested end-to-end payment flow
- [ ] Configured settlement to bank account in Paystack
- [ ] Set up webhook notifications (optional but recommended)
- [ ] Enabled 3D Secure for card payments
- [ ] Created refund policy
- [ ] Monitored first real transactions
- [ ] Set up customer support for payment issues

## Webhook Integration (Optional)

For automatic payment verification without relying on redirect:

**Setup in Paystack Dashboard**:
1. Go to Settings → API Keys & Webhooks
2. Add Webhook URL: `https://yourdomain.com/api/webhook/paystack`
3. Select events: `charge.success`, `charge.failed`

**Backend Webhook Handler** (`backend/routes/webhook.js`):
```javascript
router.post('/paystack', async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
    
  if (hash === req.headers['x-paystack-signature']) {
    const { event, data } = req.body;
    
    if (event === 'charge.success') {
      // Update payment status to completed
      await Payment.findOneAndUpdate(
        { paystackPaymentRef: data.reference },
        { status: 'completed', verifiedAt: new Date() }
      );
    }
  }
  
  res.json({ success: true });
});
```

---

## Quick Reference

| Item | Value |
|------|-------|
| API Base URL | https://api.paystack.co |
| Payment Page | https://checkout.paystack.co |
| Currency | NGN (Nigerian Naira) |
| Amount Unit | Kobo (1 NGN = 100 Kobo) |
| Conversion | USD × 1500 ≈ NGN |
| Documentation | https://paystack.com/docs |

