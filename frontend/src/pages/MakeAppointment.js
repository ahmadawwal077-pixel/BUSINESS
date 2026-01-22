import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  User,
  Lock,
  X,
  CheckCircle,
  ListChecks,
  Hourglass,
  ShieldCheck,
  Lightbulb,
  EnvelopeSimple,
} from 'phosphor-react';
import { appointmentAPI, paymentAPI } from '../services/api';

const MakeAppointment = () => {
  const [formData, setFormData] = useState({
    service: '',
    appointmentDate: '',
    timeSlot: '',
    description: '',
    userEmail: '',
  });
  const [step, setStep] = useState('form'); // 'form' or 'payment'
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cardError, setCardError] = useState('');
  const [cardData, setCardData] = useState({
    cardholderName: '',
  });

  const services = [
    'Strategic Planning',
    'Business Development',
    'Market Analysis',
    'Organizational Design',
    'Digital Transformation',
    'Change Management',
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const createdAppointment = await appointmentAPI.createAppointment(formData);
      const appointmentWithEmail = {
        ...createdAppointment.data.appointment,
        userEmail: formData.userEmail || createdAppointment.data.appointment.userEmail,
      };
      setAppointmentData(appointmentWithEmail);
      setStep('payment');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setCardError('');
    setLoading(true);

    try {
      // Validate email
      if (!appointmentData.userEmail) {
        setCardError('Email is required for payment');
        setLoading(false);
        return;
      }

      const amount = getServicePrice(appointmentData.service);

      // Create Paystack payment
      const paymentResponse = await paymentAPI.createPaymentIntent({
        amount,
        appointmentId: appointmentData._id,
        email: appointmentData.userEmail,
        fullName: cardData.cardholderName || 'Customer',
      });

      // Redirect to Paystack payment page
      if (paymentResponse.authorization_url) {
        window.location.href = paymentResponse.authorization_url;
      } else {
        setCardError('Failed to initialize payment');
      }
    } catch (err) {
      setCardError(err.response?.data?.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getServicePrice = (service) => {
    const prices = {
      'Strategic Planning': 199.99,
      'Business Development': 179.99,
      'Market Analysis': 149.99,
      'Organizational Design': 189.99,
      'Digital Transformation': 229.99,
      'Change Management': 169.99,
    };
    return prices[service] || 199.99;
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
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            {step === 'form' ? <Calendar size={56} weight="fill" /> : <CreditCard size={56} weight="fill" />}
          </div>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.2rem',
            fontWeight: 'bold',
          }}>
            {step === 'form' ? 'Book Your Consultation' : 'Complete Payment'}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.05rem',
            opacity: 0.95,
          }}>
            {step === 'form' 
              ? 'Schedule a personalized session with our expert consultants'
              : `Pay ₦${(getServicePrice(appointmentData?.service || 'Strategic Planning') * 1500).toLocaleString()} to secure your appointment`}
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
          {step === 'form' && error && (
            <div style={{
              background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
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
              <X size={20} weight="bold" style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {step === 'payment' && cardError && (
            <div style={{
              background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
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
              <X size={20} weight="bold" style={{ flexShrink: 0 }} />
              {cardError}
            </div>
          )}

          {success && (
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              <CheckCircle size={20} weight="fill" style={{ flexShrink: 0 }} />
              {success}
            </div>
          )}

          {/* FORM STEP */}
          {step === 'form' && (
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <EnvelopeSimple size={18} weight="bold" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
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

              {/* Service Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
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
                    backgroundColor: 'white',
                    color: formData.service ? '#333' : '#9ca3af',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0066cc';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">-- Choose a service --</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
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

              {/* Time Slot Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
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
                    backgroundColor: 'white',
                    color: formData.timeSlot ? '#333' : '#9ca3af',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0066cc';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">-- Select a time --</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business goals, challenges, or specific needs..."
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    minHeight: '120px',
                    resize: 'vertical',
                    color: '#333',
                    lineHeight: '1.6',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {loading ? <Hourglass size={20} weight="bold" /> : <CreditCard size={20} weight="bold" />}
                  {loading ? 'Preparing Payment...' : 'Proceed to Payment'}
                </div>
              </button>
            </form>
          )}

          {/* PAYMENT STEP */}
          {step === 'payment' && appointmentData && (
            <form onSubmit={handlePayment}>
              {/* Order Summary */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #0066cc33',
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.05rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ListChecks size={20} weight="bold" />
                  Order Summary
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Service:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{appointmentData.service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Date:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {new Date(appointmentData.appointmentDate).toLocaleDateString('en-US')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #0066cc33', paddingTop: '1rem', marginTop: '1rem' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.05rem' }}>Total:</span>
                  <span style={{ fontWeight: '700', color: '#0066cc', fontSize: '1.3rem' }}>
                    ₦{(getServicePrice(appointmentData.service) * 1500).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <EnvelopeSimple size={18} weight="bold" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={cardData.cardholderName || ''}
                  onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                  placeholder="your.email@example.com"
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

              {/* Payment Method Info */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #3b82f633',
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} weight="bold" />
                  Payment Method
                </h4>
                <p style={{ margin: '0.5rem 0', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <strong>Secure Payment via Paystack</strong>
                </p>
                <p style={{ margin: '0.5rem 0', color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  We accept: <CreditCard size={16} weight="bold" style={{ display: 'inline', marginRight: '0.25rem' }} /> Card, <User size={16} weight="bold" style={{ display: 'inline', marginRight: '0.25rem' }} /> Bank Transfer, <Lock size={16} weight="bold" style={{ display: 'inline', marginRight: '0.25rem' }} /> USSD
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setCardError('');
                  }}
                  disabled={loading}
                  style={{
                    padding: '1rem',
                    background: 'white',
                    color: '#0066cc',
                    border: '2px solid #0066cc',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#f0f9ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {loading ? <Hourglass size={20} weight="bold" /> : <ShieldCheck size={20} weight="bold" />}
                    {loading ? 'Processing...' : 'Pay with Paystack'}
                  </div>
                </button>
              </div>
            </form>
          )}

          {/* Info Box */}
          {step === 'form' && (
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
                <Lightbulb size={16} weight="fill" style={{ display: 'inline', marginRight: '0.5rem' }} />
                <strong>Pro Tip:</strong> After payment, our consultants will contact you within 24 hours to confirm your appointment and discuss your specific needs.
              </p>
            </div>
          )}

          {step === 'payment' && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(16, 185, 129, 0.05)',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px',
            }}>
              <p style={{
                margin: '0.5rem 0',
                color: '#1f2937',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}>
                <Lock size={18} weight="fill" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Secure Payment:</strong> Your payment is processed securely through Paystack, Nigeria's leading payment gateway. Your card details are never stored on our servers.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAppointment;
