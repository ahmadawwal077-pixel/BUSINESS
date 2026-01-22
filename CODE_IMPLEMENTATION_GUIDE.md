# Code Implementation Guide - Paystack Integration

## File Changes Summary

### 1. Backend Environment (.env)
**File**: `backend/.env`

**Before**:
```dotenv
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```

**After**:
```dotenv
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

---

### 2. Payment Controller
**File**: `backend/controllers/paymentController.js`

**Key Function 1: Create Payment Transaction**
```javascript
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, appointmentId, email, fullName } = req.body;

    // Validate required fields
    if (!amount || !appointmentId || !email) {
      return res.status(400).json({ 
        message: 'Amount, appointment ID, and email are required' 
      });
    }

    console.log('Creating Paystack transaction:', { amount, email, appointmentId });

    // Create Paystack transaction
    const response = await axios.post(
      `https://api.paystack.co/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        metadata: {
          appointmentId,
          userId: req.userId,
          fullName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.status) {
      return res.status(400).json({ message: 'Failed to initialize payment' });
    }

    // Save payment record
    const payment = new Payment({
      user: req.userId,
      appointment: appointmentId,
      amount,
      paystackPaymentRef: response.data.data.reference,
      status: 'pending',
      paymentMethod: 'paystack',
    });

    await payment.save();

    console.log('Payment record created:', payment._id);

    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment creation error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.response?.data?.message || error.message,
    });
  }
};
```

**Key Function 2: Verify Payment**
```javascript
exports.confirmPayment = async (req, res) => {
  try {
    const { reference, paymentId } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    console.log('Verifying Paystack payment:', reference);

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.data.status) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const paymentData = response.data.data;

    if (paymentData.status === 'success') {
      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: 'completed',
          paystackPaymentRef: reference,
          paymentMethod: 'paystack',
          verifiedAt: new Date(),
        },
        { new: true }
      );

      console.log('Payment verified successfully:', payment._id);

      return res.json({ message: 'Payment successful', payment });
    } else {
      return res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.response?.data?.message || error.message,
    });
  }
};
```

---

### 3. Payment Model
**File**: `backend/models/Payment.js`

```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'NGN', // Changed to Nigerian Naira
  },
  paystackPaymentRef: {
    type: String, // Paystack transaction reference
  },
  stripePaymentId: {
    type: String, // Kept for backward compatibility
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'stripe', 'card', 'bank_transfer', 'ussd'],
    default: 'paystack',
  },
  verifiedAt: {
    type: Date, // When payment was verified with Paystack
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
```

---

### 4. Frontend Payment Handler
**File**: `frontend/src/pages/MakeAppointment.js`

**Key Changes in Component State**:
```javascript
const [formData, setFormData] = useState({
  service: '',
  appointmentDate: '',
  timeSlot: '',
  description: '',
  userEmail: '',  // Added for Paystack
});

const [cardData, setCardData] = useState({
  cardholderName: '', // Now only stores email, not card details
});
```

**Payment Handler Function**:
```javascript
const handlePayment = async (e) => {
  e.preventDefault();
  setCardError('');
  setLoading(true);

  try {
    // Validate email
    if (!appointmentData.userEmail) {
      setCardError('Email is required for payment');
      setLoading(false);
      return;
    }

    const amount = getServicePrice(appointmentData.service);

    // Create Paystack payment
    const paymentResponse = await paymentAPI.createPaymentIntent({
      amount,
      appointmentId: appointmentData._id,
      email: appointmentData.userEmail,
      fullName: cardData.cardholderName || 'Customer',
    });

    // Redirect to Paystack payment page
    if (paymentResponse.authorization_url) {
      window.location.href = paymentResponse.authorization_url;
    } else {
      setCardError('Failed to initialize payment');
    }
  } catch (err) {
    setCardError(err.response?.data?.message || 'Payment initialization failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Currency Display**:
```javascript
// In header
`Pay ₦${(getServicePrice(appointmentData?.service || 'Strategic Planning') * 1500).toLocaleString()} to secure your appointment`

// In order summary
<span style={{ fontWeight: '700', color: '#0066cc', fontSize: '1.3rem' }}>
  ₦{(getServicePrice(appointmentData.service) * 1500).toLocaleString()}
</span>
```

**Payment Method Info**:
```javascript
<div style={{
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '2rem',
  border: '1px solid #3b82f633',
}}>
  <h4 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1rem', fontWeight: '600' }}>
    🇳🇬 Payment Method
  </h4>
  <p style={{ margin: '0.5rem 0', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
    <strong>Secure Payment via Paystack</strong>
  </p>
  <p style={{ margin: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6' }}>
    We accept: 💳 Card, 🏦 Bank Transfer, 📱 USSD
  </p>
</div>
```

---

## Installation Steps

### Step 1: Install Axios (Backend)
```bash
cd backend
npm install axios --save
```

### Step 2: Update Environment Variables
Edit `backend/.env`:
```bash
# Replace STRIPE_SECRET_KEY with:
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

### Step 3: Restart Backend
```bash
npm start
```

### Step 4: Test the Flow
1. Book an appointment
2. Enter email address
3. Click "Pay with Paystack"
4. Use test card: `4012 3211 1111 1111`
5. Verify payment completes

---

## API Integration Flow

```
User Frontend
    ↓
handlePayment() triggered
    ↓
POST /api/payment/create
{
  amount: 199.99,
  appointmentId: "...",
  email: "user@email.com",
  fullName: "User Name"
}
    ↓
Backend: paymentController.createPaymentIntent()
    ↓
Call Paystack API: /transaction/initialize
    ↓
Paystack returns: authorization_url
    ↓
Save payment record to MongoDB
    ↓
Return response with authorization_url
    ↓
Frontend: window.location.href = authorization_url
    ↓
User redirected to Paystack checkout
    ↓
User completes payment
    ↓
Paystack redirects back
    ↓
POST /api/payment/confirm
{
  reference: "paystack_reference",
  paymentId: "..."
}
    ↓
Backend: confirmPayment()
    ↓
Verify with Paystack: /transaction/verify/{reference}
    ↓
Update payment status to "completed"
    ↓
Appointment marked as paid ✅
```

---

## Database Operations

### Save New Payment
```javascript
const payment = new Payment({
  user: req.userId,              // From auth middleware
  appointment: appointmentId,    // From request
  amount: 199.99,               // USD amount
  paystackPaymentRef: reference, // From Paystack response
  status: 'pending',            // Initially pending
  paymentMethod: 'paystack',    // Payment gateway used
});

await payment.save();
```

### Update Payment Status
```javascript
const payment = await Payment.findByIdAndUpdate(
  paymentId,
  {
    status: 'completed',
    paystackPaymentRef: reference,
    paymentMethod: 'paystack',
    verifiedAt: new Date(),
  },
  { new: true }
);
```

### Query Payments
```javascript
// Get user's payments
const userPayments = await Payment.find({ user: userId })
  .populate('appointment')
  .sort({ createdAt: -1 });

// Get pending payments
const pendingPayments = await Payment.find({ status: 'pending' });

// Get payments by Paystack reference
const payment = await Payment.findOne({ 
  paystackPaymentRef: reference 
});
```

---

## Error Scenarios

### Scenario 1: Missing Email
```
Request: POST /api/payment/create
Body: { amount: 199.99, appointmentId: "..." }
Response: 400 Bad Request
{
  "message": "Amount, appointment ID, and email are required"
}
```

### Scenario 2: Invalid Paystack API Key
```
Response: 401 Unauthorized
{
  "status": false,
  "message": "Invalid Authorization header"
}
```

### Scenario 3: Payment Not Verified
```
Request: POST /api/payment/confirm
Body: { reference: "invalid_ref", paymentId: "..." }
Response: 400 Bad Request
{
  "message": "Payment not completed"
}
```

---

## Success Response Examples

### Create Payment Success
```json
{
  "authorization_url": "https://checkout.paystack.com/7q90j1da...",
  "access_code": "7q90j1da",
  "reference": "7q90j1da",
  "paymentId": "507f1f77bcf86cd799439012"
}
```

### Confirm Payment Success
```json
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
    "verifiedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:25:00.000Z"
  }
}
```

---

## Debugging Tips

1. **Check logs in terminal**:
   ```
   Creating Paystack transaction: { amount: 199.99, email: '...', appointmentId: '...' }
   Payment record created: 507f1f77bcf86cd799439012
   Payment verified successfully: 507f1f77bcf86cd799439012
   ```

2. **Verify in Paystack Dashboard**:
   - Go to Transactions tab
   - Should show your test transactions
   - Reference ID matches backend logs

3. **Check .env is loaded**:
   ```javascript
   console.log('Paystack Key:', process.env.PAYSTACK_SECRET_KEY);
   // Should NOT print "undefined"
   ```

4. **Test with curl**:
   ```bash
   curl -X POST http://localhost:5000/api/payment/create \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "amount": 199.99,
       "appointmentId": "507f1f77bcf86cd799439011",
       "email": "test@example.com",
       "fullName": "Test User"
     }'
   ```

