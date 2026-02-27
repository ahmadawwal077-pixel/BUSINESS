const crypto = require('crypto');

/**
 * Generate a secure random token and its hash
 * Tokens are generated with crypto.randomBytes and then hashed with SHA256
 * This follows the pattern of hashing before storage for security
 * 
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {Promise<{token: string, hash: string, expires: Date}>}
 */
const generateVerificationToken = (bytes = 32) => {
  // Generate random token
  const token = crypto.randomBytes(bytes).toString('hex');

  // Hash token for storage (one-way encryption)
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Set expiration to 24 hours from now
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    token,    // Send to user
    hash,     // Store in database
    expires,  // Token expiration time
  };
};

/**
 * Generate a password reset token (shorter lifetime: 1 hour)
 * 
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {Promise<{token: string, hash: string, expires: Date}>}
 */
const generateResetToken = (bytes = 32) => {
  const token = crypto.randomBytes(bytes).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Set expiration to 1 hour from now
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return {
    token,
    hash,
    expires,
  };
};

module.exports = {
  generateVerificationToken,
  generateResetToken,
};
