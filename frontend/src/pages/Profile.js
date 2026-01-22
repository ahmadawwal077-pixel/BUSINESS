import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          color: 'white',
          marginBottom: '3rem',
          boxShadow: '0 10px 40px rgba(0, 102, 204, 0.2)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👤</div>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.2rem',
            fontWeight: 'bold',
          }}>
            My Profile
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.05rem',
            opacity: 0.95,
          }}>
            Update your personal and professional information
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2.5rem',
          overflow: 'hidden',
        }}>
          {/* Messages */}
          {message.text && (
            <div style={{
              background: message.type === 'success' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
              color: 'white',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.2rem' }}>
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email Field (Read-only) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                📧 Email Address (Read-only)
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  color: '#9ca3af',
                  background: '#f3f4f6',
                  cursor: 'not-allowed',
                }}
              />
              <p style={{
                margin: '0.5rem 0 0 0',
                color: '#6b7280',
                fontSize: '0.85rem',
              }}>
                Email address cannot be changed for security reasons
              </p>
            </div>

            {/* Phone Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                📞 Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Company Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                🏢 Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(0, 102, 204, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(0, 102, 204, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
                }
              }}
            >
              {loading ? '⏳ Updating...' : '💾 Save Changes'}
            </button>
          </form>

          {/* Info Box */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 102, 204, 0.05)',
            borderLeft: '4px solid #0066cc',
            borderRadius: '8px',
          }}>
            <p style={{
              margin: '0.5rem 0',
              color: '#1f2937',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}>
              <strong>💡 Privacy Note:</strong> Your email address is fixed for security purposes. If you need to change your email, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
