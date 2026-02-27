import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const VerifyEmail = () => {
  const { token } = useParams();
  const { resendVerification } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  // resend form states
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        setVerified(true);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Email verification failed');
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendError('');
    setResendMessage('');
    setResendLoading(true);
    try {
      const resp = await resendVerification(resendEmail);
      setResendMessage(resp?.message || 'Verification email resent');
    } catch (err) {
      setResendError(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  };


  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Verifying your email...</h2>
          <p style={{ color: '#6b7280' }}>Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

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
        {verified ? (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.8rem' }}>
              Email Verified!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                color: 'white',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                fontSize: '1rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(0, 102, 204, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.8rem' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
              {error}
            </p>
            {/* resend section */}
            <div style={{ marginBottom: '1.5rem' }}>
              {!showResendForm ? (
                <button
                  onClick={() => setShowResendForm(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  Resend verification email
                </button>
              ) : (
                <form onSubmit={handleResend} style={{ textAlign: 'center' }}>
                  <input
                    type="email"
                    placeholder="your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      marginRight: '0.5rem',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={resendLoading}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '6px',
                      background: '#0066cc',
                      color: 'white',
                      border: 'none',
                      cursor: resendLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {resendLoading ? 'Sending...' : 'Send'}
                  </button>
                </form>
              )}
              {resendError && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{resendError}</p>}
              {resendMessage && <p style={{ color: '#10b981', marginTop: '0.5rem' }}>{resendMessage}</p>}
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  padding: '0.9rem 2rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(0, 102, 204, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Back to Login
              </Link>
              <Link
                to="/register"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: 'white',
                  padding: '0.9rem 2rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(107, 114, 128, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
