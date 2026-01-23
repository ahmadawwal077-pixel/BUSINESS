import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      marginTop: '5rem',
      borderTop: '2px solid rgba(0, 102, 204, 0.2)',
    }}>
      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
      }}>
        {/* Brand Section */}
        <div>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            PositiveHills
          </h3>
          <p style={{
            color: '#cbd5e1',
            lineHeight: '1.7',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
          }}>
            Transforming businesses through strategic consulting and expert guidance. We empower companies to achieve sustainable growth and competitive advantage.
          </p>
          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { icon: '🔗', url: '#', name: 'LinkedIn' },
              { icon: '𝕏', url: '#', name: 'Twitter' },
              { icon: '📘', url: '#', name: 'Facebook' },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                title={social.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0, 102, 204, 0.1)',
                  border: '2px solid rgba(0, 102, 204, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  color: '#0066cc',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)';
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 102, 204, 0.1)';
                  e.target.style.borderColor = 'rgba(0, 102, 204, 0.3)';
                  e.target.style.color = '#0066cc';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { name: 'Strategic Planning', path: '/services' },
              { name: 'Digital Transformation', path: '/services' },
              { name: 'Market Analysis', path: '/services' },
              { name: 'Team Development', path: '/services' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.75rem' }}>
                <Link
                  to={item.path}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#0066cc';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#cbd5e1';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ color: '#0066cc' }}>→</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Company
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about' },
              { name: 'Blog', path: '/blog' },
              { name: 'Contact', path: '/contact' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.75rem' }}>
                <Link
                  to={item.path}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#0066cc';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#cbd5e1';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ color: '#0066cc' }}>→</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Get In Touch
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { icon: '✉️', label: 'Email', value: 'info@positivehills.com', href: 'mailto:info@positivehills.com' },
              { icon: '📞', label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
              { icon: '📍', label: 'Location', value: '123 Business St, City, State 12345', href: '#' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1.25rem' }}>
                <a
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    transition: 'color 0.3s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0066cc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: '500' }}>{item.value}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 102, 204, 0.3) 50%, transparent 100%)',
        margin: '0 2rem',
      }} />

      {/* Footer Bottom */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
          &copy; {currentYear} PositiveHills. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { name: 'Privacy Policy', path: '#' },
            { name: 'Terms of Service', path: '#' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontSize: '0.9rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#0066cc';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#94a3b8';
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
