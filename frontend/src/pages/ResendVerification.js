import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { Link } from 'react-router-dom';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const resp = await authAPI.resendVerification(email);
      setMessage(resp.data.message || 'Verification email sent');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Resend Verification Email</h2>
        {message && <p style={{ color: '#10b981' }}>{message}</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              width: '100%',
              padding: '0.9rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.95rem',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.95rem',
              background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send Link'}
          </button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/login" style={{ color: '#0066cc' }}>Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
