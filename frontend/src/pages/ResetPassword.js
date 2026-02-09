import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, {
        newPassword: formData.newPassword,
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Card Container */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
              Reset Password
            </h1>
            <p style={{ margin: 0, opacity: 0.95, fontSize: '0.95rem' }}>
              Create a new password for your account
            </p>
          </div>

          {/* Form Container */}
          <div style={{ padding: '3rem 2rem' }}>
            {error && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                ❌ {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem',
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  disabled={loading || !!success}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    opacity: loading || success ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    if (!loading && !success) {
                      e.target.style.borderColor = '#0066cc';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading || !!success}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    opacity: loading || success ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    if (!loading && !success) {
                      e.target.style.borderColor = '#0066cc';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!success}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: loading || success 
                    ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                    : 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '1rem',
                }}
                onMouseEnter={(e) => {
                  if (!loading && !success) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 102, 204, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              {/* Links */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '1rem',
                }}
              >
                <Link
                  to="/login"
                  style={{
                    color: '#0066cc',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#00b4d8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#0066cc';
                  }}
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
