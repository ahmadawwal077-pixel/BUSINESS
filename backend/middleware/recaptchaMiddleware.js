const verifyRecaptcha = require('../utils/verifyRecaptcha');

/**
 * Middleware to verify Google reCAPTCHA token
 * Expects recaptchaToken in request body
 * 
 * Usage:
 *   router.post('/register', recaptchaMiddleware, registerController);
 */
const recaptchaMiddleware = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({
        message: 'reCAPTCHA token is required',
        success: false,
      });
    }

    // Verify the token with Google
    const result = await verifyRecaptcha(recaptchaToken);

    if (!result.success) {
      console.error('🛑 reCAPTCHA middleware detected failure:', result);
      return res.status(400).json({
        message: result.error || 'reCAPTCHA verification failed',
        success: false,
        error_codes: result.error_codes,
        raw: result.raw,
      });
    }

    // Attach result to request for downstream handlers
    req.recaptcha = result;

    next();
  } catch (error) {
    console.error('reCAPTCHA middleware error:', error);
    res.status(500).json({
      message: 'Server error during reCAPTCHA verification',
      error: error.message,
    });
  }
};

module.exports = recaptchaMiddleware;
