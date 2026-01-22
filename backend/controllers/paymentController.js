const Payment = require('../models/Payment');
const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = 'https://api.paystack.co';

// Create payment transaction (Paystack)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, appointmentId, email, fullName } = req.body;

    // Validate required fields
    if (!amount || !appointmentId || !email) {
      return res.status(400).json({ message: 'Amount, appointment ID, and email are required' });
    }

    console.log('Creating Paystack transaction:', { amount, email, appointmentId });

    // Create Paystack transaction
    const response = await axios.post(
      `${PAYSTACK_API}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo (1 kobo = 0.01 NGN)
        metadata: {
          appointmentId,
          userId: req.userId,
          fullName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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

// Verify payment (Paystack)
exports.confirmPayment = async (req, res) => {
  try {
    const { reference, paymentId } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    console.log('Verifying Paystack payment:', reference);

    // Verify with Paystack
    const response = await axios.get(
      `${PAYSTACK_API}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
