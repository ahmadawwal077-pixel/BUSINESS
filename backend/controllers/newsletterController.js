const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter',
        });
      } else {
        // Reactivate inactive subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return res.status(200).json({
          success: true,
          message: 'You have been resubscribed to our newsletter',
          data: existingSubscriber,
        });
      }
    }

    // Create new subscriber
    const newsletter = await Newsletter.create({
      email,
      source: 'website',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter! Check your email for confirmation.',
      data: newsletter,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error subscribing to newsletter',
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter',
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error unsubscribing from newsletter',
    });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).select('email subscribedAt source');

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscribers',
    });
  }
};

// @desc    Get subscriber stats
// @route   GET /api/newsletter/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
    const totalUnsubscribed = await Newsletter.countDocuments({ isActive: false });
    const newSubscribersThisMonth = await Newsletter.countDocuments({
      isActive: true,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        totalUnsubscribed,
        newSubscribersThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching newsletter stats',
    });
  }
};
