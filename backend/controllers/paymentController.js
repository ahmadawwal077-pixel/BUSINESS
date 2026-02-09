const Payment = require('../models/Payment');
const axios = require('axios');
const crypto = require('crypto');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = 'https://api.paystack.co';

// Create payment transaction (Paystack)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, appointmentId, enrollmentId, email, fullName } = req.body;

    // Validate required fields
    if (!amount || !email || (!appointmentId && !enrollmentId)) {
      return res.status(400).json({ message: 'Amount, email, and appointmentId or enrollmentId are required' });
    }

    console.log('Creating Paystack transaction:', { amount, email, appointmentId, enrollmentId });

    // Create Paystack transaction
    const response = await axios.post(
      `${PAYSTACK_API}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo
        metadata: {
          appointmentId,
          enrollmentId,
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
      appointment: appointmentId || undefined,
      enrollment: enrollmentId || undefined,
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
      let payment;
      if (paymentId) {
        payment = await Payment.findByIdAndUpdate(
          paymentId,
          {
            status: 'completed',
            paystackPaymentRef: reference,
            paymentMethod: 'paystack',
            verifiedAt: new Date(),
          },
          { new: true }
        );
      } else {
        payment = await Payment.findOneAndUpdate(
          { paystackPaymentRef: reference },
          {
            status: 'completed',
            paymentMethod: 'paystack',
            verifiedAt: new Date(),
          },
          { new: true }
        );
      }

      console.log('Payment verified successfully:', payment._id);

      // If payment is for an enrollment, activate the enrollment
      if (payment && payment.enrollment) {
        const CourseEnrollment = require('../models/CourseEnrollment');
        const Course = require('../models/Course');
        const enrollment = await CourseEnrollment.findById(payment.enrollment);
        if (enrollment) {
          enrollment.paymentStatus = 'completed';
          enrollment.paymentDate = new Date();
          enrollment.status = 'active';
          await enrollment.save();

          // Update course enrolled students count
          const course = await Course.findById(enrollment.course);
          if (course) {
            course.enrolledStudents = (course.enrolledStudents || 0) + 1;
            await course.save();
          }
        }
      }

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

// Paystack webhook handler
exports.paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const secret = PAYSTACK_SECRET_KEY;

    // Use raw body captured by server middleware when available
    const raw = req.rawBody ? req.rawBody : Buffer.from(JSON.stringify(req.body));

    const hash = crypto.createHmac('sha512', secret).update(raw).digest('hex');

    if (hash !== signature) {
      console.warn('Invalid Paystack webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(raw.toString());
    console.log('Paystack webhook received:', event.event);

    const data = event.data;
    const reference = data?.reference;

    if (!reference) {
      return res.status(400).send('No reference provided');
    }

    // Only handle successful transactions
    if (data.status === 'success') {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { paystackPaymentRef: reference },
        { status: 'completed', paymentMethod: 'paystack', verifiedAt: new Date() },
        { new: true }
      );

      if (payment && payment.enrollment) {
        const CourseEnrollment = require('../models/CourseEnrollment');
        const Course = require('../models/Course');
        const enrollment = await CourseEnrollment.findById(payment.enrollment);
        if (enrollment) {
          enrollment.paymentStatus = 'completed';
          enrollment.paymentDate = new Date();
          enrollment.status = 'active';
          await enrollment.save();

          // Update course count
          const course = await Course.findById(enrollment.course);
          if (course) {
            course.enrolledStudents = (course.enrolledStudents || 0) + 1;
            await course.save();
          }
        }
      }
    }

    // Acknowledge receipt
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Server error');
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
