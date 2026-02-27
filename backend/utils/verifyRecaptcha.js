const axios = require('axios');

/**
 * Verify Google reCAPTCHA token with Google servers
 * Supports both reCAPTCHA v2 and v3
 * 
 * @param {string} token - The reCAPTCHA token from frontend
 * @returns {Promise<{success: boolean, score?: number, action?: string, error?: string}>}
 */
const verifyRecaptcha = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        error: 'No reCAPTCHA token provided',
      };
    }

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      console.error('❌ RECAPTCHA_SECRET not configured in environment');
      return {
        success: false,
        error: 'reCAPTCHA is not properly configured',
      };
    }

    // Call Google's reCAPTCHA verification API
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret,
          response: token,
        },
      }
    );

    const { success, score, action, challenge_ts, hostname, error_codes } = response.data;

    if (!success) {
      console.error('❌ reCAPTCHA verification failed:', response.data);
      // include the raw response so we can see errors like invalid-input-response,
      // invalid-input-secret, timeout-or-duplicate, etc.
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        error_codes,
        raw: response.data,
      };
    }

    // For v3: check score (0.0 to 1.0, higher = less likely to be bot)
    // Typically accept score > 0.5
    if (score !== undefined) {
      console.log(`✅ reCAPTCHA v3: score=${score}, action=${action}, trusted=${score > 0.5}`);
      if (score < 0.5) {
        return {
          success: false,
          score,
          error: 'reCAPTCHA score too low (suspicious activity)',
        };
      }
    } else {
      // v2 checkbox
      console.log(`✅ reCAPTCHA v2: verified`);
    }

    return {
      success: true,
      score,
      action,
      challenge_ts,
      hostname,
    };
  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = verifyRecaptcha;
