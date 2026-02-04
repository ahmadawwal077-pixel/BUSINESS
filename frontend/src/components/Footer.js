import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      marginTop: 'clamp(3rem, 8vw, 5rem)',
      borderTop: '2px solid rgba(0, 102, 204, 0.2)',
    }}>
      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 3vw, 3rem) clamp(1rem, 4vw, 2rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 90vw, 280px), 1fr))',
        gap: 'clamp(1.5rem, 3vw, 2.5rem)',
      }}>
        {/* Brand Section */}
        <div>
          <Logo className="site-logo" style={{ marginBottom: 'clamp(0.6rem, 1.5vw, 0.8rem)' }} />
          <h3 style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
            fontWeight: 'bold',
            marginBottom: 'clamp(0.6rem, 1.5vw, 0.8rem)',
            background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            PositiveHills
          </h3>
          <p style={{
            color: '#cbd5e1',
            lineHeight: '1.6',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
          }}>
            Transforming businesses through strategic consulting and expert guidance. We empower companies to achieve sustainable growth and competitive advantage.
          </p>
          {/* Social Links */}
          <div style={{ display: 'flex', gap: 'clamp(0.6rem, 2vw, 0.8rem)' }}>
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
                  width: 'clamp(36px, 8vw, 40px)',
                  height: 'clamp(36px, 8vw, 40px)',
                  borderRadius: '50%',
                  background: 'rgba(0, 102, 204, 0.1)',
                  border: '2px solid rgba(0, 102, 204, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
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
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '700',
            marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { name: 'Strategic Planning', path: '/services' },
              { name: 'Digital Transformation', path: '/services' },
              { name: 'Market Analysis', path: '/services' },
              { name: 'Team Development', path: '/services' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: 'clamp(0.4rem, 1vw, 0.6rem)' }}>
                <Link
                  to={item.path}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.3rem, 1vw, 0.5rem)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
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
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '700',
            marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Company
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about' },
              { name: 'Blog', path: '/blog' },
              { name: 'Contact', path: '/contact' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: 'clamp(0.4rem, 1vw, 0.6rem)' }}>
                <Link
                  to={item.path}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.3rem, 1vw, 0.5rem)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
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
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '700',
            marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Get In Touch
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { icon: '✉️', label: 'Email', value: 'Hillspositive@gmail.com', href: 'mailto:Hillspositive@gmail.com' },
              { icon: '📞', label: 'Phone', value: '+234 (0) 902-701-5123', href: 'tel:+234 902 701 5123' },
              { icon: '📍', label: 'Location', value: '16, Olaiya street Sabo-Oniba Ojo Lagos ', href: '#' },
            ].map((item, idx) => (
              <li key={idx} style={{ marginBottom: 'clamp(0.6rem, 1.5vw, 0.8rem)' }}>
                <a
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
                    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
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
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#94a3b8', marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: '500', fontSize: 'clamp(0.8rem, 1.7vw, 0.9rem)' }}>{item.value}</div>
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
        margin: '0 clamp(1rem, 4vw, 2rem)',
      }} />

      {/* Footer Bottom */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
      }}>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)' }}>
          &copy; {currentYear} PositiveHills. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
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
                transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
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
