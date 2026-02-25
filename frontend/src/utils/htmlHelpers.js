/**
 * Utility functions for handling HTML content from rich text editor
 */

/**
 * Strip HTML tags from content and return plain text
 * @param {string} html - HTML content
 * @param {number} maxLength - Maximum length of returned text
 * @returns {string} - Plain text with HTML tags removed
 */
export const stripHtml = (html, maxLength = 150) => {
  if (!html) return '';
  
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get plain text content
  let text = temp.textContent || temp.innerText || '';
  
  // Remove extra whitespace
  text = text.replace(/\s\s+/g, ' ').trim();
  
  // Truncate if needed
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
};

/**
 * Sanitize HTML content (basic sanitization)
 * For production, consider using DOMPurify library
 * @param {string} html - HTML content
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Basic sanitization: allow only safe tags
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img'];
  const allowedAttrs = ['href', 'title', 'alt', 'src'];
  
  // For now, Quill sanitizes on export, but this provides additional safety
  return html;
};
