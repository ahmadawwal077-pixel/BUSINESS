import React, { useState } from 'react';
import { newsletterAPI } from '../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Call the newsletter API
      await newsletterAPI.subscribe(email);
      
      setEmail('');
      setMessage({ 
        type: 'success', 
        text: 'Successfully subscribed! Check your email for confirmation.' 
      });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message.text && (
        <div
          style={{
            marginBottom: '0.7rem',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            border: `2px solid ${message.type === 'success' ? '#28a745' : '#e74c3c'}`,
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            fontSize: '0.85rem',
            fontWeight: '500',
          }}
        >
          {message.type === 'success' ? '✓' : '⚠'} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            gap: '0.7rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                color: '#333',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed';
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem 1.8rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              opacity: loading ? '0.7' : '1',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#5b21b6';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 16px rgba(124, 58, 237, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#7c3aed';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Newsletter;
