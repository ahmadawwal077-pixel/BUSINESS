import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 4px 20px rgba(0, 102, 204, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '2px solid rgba(0, 102, 204, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textDecoration: 'none',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}>
          PositiveHills
        </Link>

        {/* Desktop Menu */}
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '0.5rem',
          alignItems: 'center',
          margin: 0,
          padding: 0,
        }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Projects', path: '/projects' },
            { name: 'Courses', path: '/courses' },
            { name: 'Blog', path: '/blog' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.name} style={{ margin: 0 }}>
                <Link to={item.path} style={{
                  color: isActive ? 'white' : '#333',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  background: isActive ? 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 102, 204, 0.3)' : 'none',
                }}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(0, 102, 204, 0.1)';
                    e.target.style.color = '#0066cc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#333';
                  }
                }}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Auth Section */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '0.7rem 1.3rem',
                borderRadius: '8px',
                border: '2px solid #0066cc',
                transition: 'all 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 102, 204, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '0.7rem 1.3rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 102, 204, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.3)';
              }}>
                Sign Up
              </Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  minWidth: '220px',
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease',
                  border: '1px solid rgba(0, 102, 204, 0.1)',
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0, 102, 204, 0.05)',
                    borderBottom: '1px solid rgba(0, 102, 204, 0.1)',
                  }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>
                      {user?.name}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.5rem 0' }}>
                    {[
                      { icon: '📊', name: 'Dashboard', path: '/dashboard' },
                      { icon: '📅', name: 'My Appointments', path: '/appointments' },
                      { icon: '💳', name: 'My Payments', path: '/payments' },
                      { icon: '👤', name: 'Profile', path: '/profile' },
                      ...(user?.isAdmin ? [{ icon: '⚙️', name: 'Admin Dashboard', path: '/admin/dashboard' }] : []),
                      ...(user?.isAdmin ? [{ icon: '✍️', name: 'Create Blog Post', path: '/admin/blog' }] : []),
                    ].map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1.25rem',
                          color: '#333',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                        }}
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 102, 204, 0.1)';
                          e.currentTarget.style.color = '#0066cc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#333';
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div style={{
                    borderTop: '1px solid rgba(0, 102, 204, 0.1)',
                    padding: '0.5rem 0',
                  }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(220, 38, 38, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '5px',
            '@media (max-width: 768px)': {
              display: 'flex',
            },
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{
            width: '25px',
            height: '3px',
            background: '#333',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none',
          }} />
          <span style={{
            width: '25px',
            height: '3px',
            background: '#333',
            transition: 'all 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            width: '25px',
            height: '3px',
            background: '#333',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(-45deg) translate(8px, -8px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block',
          },
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          padding: '1rem',
        }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Projects', path: '/projects' },
            { name: 'Courses', path: '/courses' },
            { name: 'Blog', path: '/blog' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                color: '#333',
                textDecoration: 'none',
                fontWeight: '500',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          nav ul {
            display: none !important;
          }
          button { display: flex !important; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
