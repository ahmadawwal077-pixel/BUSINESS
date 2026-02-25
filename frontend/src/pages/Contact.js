import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Clock,
} from 'phosphor-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the message to your backend
    console.log('Message:', formData);
    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          padding: 'clamp(3rem, 8vw, 8rem) 0',
          textAlign: 'center',
          minHeight: 'clamp(400px, 60vh, 600px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 2rem)', fontWeight: '300', lineHeight: '1.6' }}>
            We'd love to hear from you and discuss how we can help
          </p>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', opacity: '0.95', lineHeight: '1.6' }}>
            Reach out to our team for consultation and inquiries
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: 'white', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'clamp(3rem, 5vw, 4rem)' }}>
              {/* Contact Info Cards */}
              {[
                {
                  icon: MapPin,
                  title: 'Address',
                  content: ['123 Business Street, Suite 100', 'City, State 12345'],
                  color: '#0066cc',
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  content: ['+1 (234) 567-890'],
                  link: 'tel:+1234567890',
                  color: '#00b4d8',
                },
                {
                  icon: EnvelopeSimple,
                  title: 'Email',
                  content: ['info@positivehills.com'],
                  link: 'mailto:info@positivehills.com',
                  color: '#0096c7',
                },
                {
                  icon: Clock,
                  title: 'Business Hours',
                  content: ['Mon-Fri: 9 AM - 6 PM', 'Sat: 10 AM - 4 PM', 'Sun: Closed'],
                  color: '#0077b6',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                    textAlign: 'center',
                    borderLeft: `5px solid ${item.color}`,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', color: item.color }}>
                    {React.createElement(item.icon, { size: 48, weight: 'bold' })}
                  </div>
                  <h4 style={{ color: item.color, marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 'bold' }}>
                    {item.title}
                  </h4>
                  {item.link ? (
                    <a
                      href={item.link}
                      style={{ color: '#666', textDecoration: 'none', lineHeight: '1.8', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}
                    >
                      {item.content[0]}
                    </a>
                  ) : (
                    <div style={{ color: '#666', lineHeight: '1.8', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                      {item.content.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: 'clamp(2rem, 4vw, 3rem)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 'bold' }}>Send Us a Message</h2>
                <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', color: '#666' }}>We'll respond as quickly as possible</p>
              </div>

              {success && (
                <div
                  style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    borderLeft: '5px solid #28a745',
                  }}
                >
                  <strong>✓ Success!</strong> We've received your message and will get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(1rem, 2vw, 1.5rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                      Name <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        minHeight: '44px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0066cc';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                      Email <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        minHeight: '44px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0066cc';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                      Phone <span style={{ color: '#999' }}>(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        minHeight: '44px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0066cc';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                      Subject <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        minHeight: '44px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0066cc';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                    Message <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    style={{
                      width: '100%',
                      padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      minHeight: '150px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0066cc';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ddd';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 'clamp(0.8rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                    background: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#0052a3';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(0, 102, 204, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#0066cc';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Quick answers to common questions</p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
            {[
              {
                question: 'What is your typical response time?',
                answer: 'We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly.',
              },
              {
                question: 'Do you offer free consultations?',
                answer: 'Yes! We offer a complimentary initial consultation to discuss your needs and how we can help.',
              },
              {
                question: 'What services do you specialize in?',
                answer: 'We provide strategic planning, digital transformation, market analysis, organizational design, and change management services.',
              },
              {
                question: 'Can you work with businesses of all sizes?',
                answer: 'Absolutely! We have experience working with startups, SMEs, and large enterprises across various industries.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  borderLeft: '4px solid #0066cc',
                }}
              >
                <h4 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  {item.question}
                </h4>
                <p style={{ color: '#666', lineHeight: '1.7', margin: '0' }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social & CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
          color: 'white',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Connect With Us</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: '0.95', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Follow us on social media and stay updated with the latest insights and updates from PositiveHills
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {[
              { icon: 'f', label: 'Facebook' },
              { icon: '𝕏', label: 'Twitter' },
              { icon: 'in', label: 'LinkedIn' },
              { icon: 'ig', label: 'Instagram' },
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#0066cc';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/services"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#0066cc',
                padding: '0.9rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explore Services
            </Link>
            <Link
              to="/about"
              style={{
                display: 'inline-block',
                border: '2px solid white',
                color: 'white',
                padding: '0.9rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#0066cc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
