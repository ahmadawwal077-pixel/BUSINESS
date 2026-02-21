import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

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
    setMenuOpen(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav aria-label="Main navigation" style={{
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
          padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Logo (component) */}
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            <Logo className="navbar-logo" />
          </Link>

        {/* Desktop Menu */}
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: 'clamp(0.25rem, 2vw, 0.5rem)',
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
                  padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.6rem, 1.5vw, 1rem)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  background: isActive ? 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 102, 204, 0.3)' : 'none',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                }}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 102, 204, 0.1)';
                    e.currentTarget.style.color = '#0066cc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#333';
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
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          alignItems: 'center',
        }}>
          {!isAuthenticated ? (
            <>
              {location.pathname.startsWith('/courses') && (
                <>
                  <Link to="/login" style={{
                    color: '#0066cc',
                    textDecoration: 'none',
                    fontWeight: '600',
                    padding: 'clamp(0.5rem, 1vw, 0.7rem) clamp(0.8rem, 2vw, 1.3rem)',
                    borderRadius: '8px',
                    border: '2px solid #0066cc',
                    transition: 'all 0.3s ease',
                    display: 'inline-block',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 102, 204, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}>
                    Login
                  </Link>
                  <Link to="/register" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                    padding: 'clamp(0.5rem, 1vw, 0.7rem) clamp(0.8rem, 2vw, 1.3rem)',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                    transition: 'all 0.3s ease',
                    display: 'inline-block',
                    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 102, 204, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.3)';
                  }}>
                    Sign Up
                  </Link>
                </>
              )}
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="user-dropdown"
                style={{
                  width: 'clamp(38px, 8vw, 44px)',
                  height: 'clamp(38px, 8vw, 44px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
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
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setDropdownOpen(false);
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  minWidth: '220px',
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease',
                  border: '1px solid rgba(0, 102, 204, 0.1)',
                  zIndex: 1001,
                }}>
                  {/* Header */}
                  <div style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    background: 'rgba(0, 102, 204, 0.05)',
                    borderBottom: '1px solid rgba(0, 102, 204, 0.1)',
                  }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>
                      {user?.name}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)' }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.5rem 0' }}>
                    {[
                      { icon: '📊', name: 'Dashboard', path: '/dashboard' },
                      { icon: '', name: 'Profile', path: '/profile' },
                      ...(user?.isAdmin ? [{ icon: '⚙️', name: 'Admin Dashboard', path: '/admin/dashboard' }] : []),
                      ...(user?.isAdmin ? [{ icon: '✍️', name: 'Create Blog Post', path: '/admin/blog' }] : []),
                    ].map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                          padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.25rem)',
                          color: '#333',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
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
                        <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>{item.icon}</span>
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
                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.25rem)',
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>🚪</span>
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
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '5px',
            padding: 'clamp(0.4rem, 1vw, 0.6rem)',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            boxShadow: menuOpen ? '0 4px 12px rgba(0, 102, 204, 0.4)' : '0 2px 8px rgba(0, 102, 204, 0.2)',
            transform: menuOpen ? 'scale(1.08)' : 'scale(1)',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = menuOpen ? '0 4px 12px rgba(0, 102, 204, 0.4)' : '0 2px 8px rgba(0, 102, 204, 0.2)';
          }}
        >
          <span style={{
            width: '22px',
            height: '2.5px',
            background: 'white',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: menuOpen ? 'rotate(45deg) translate(10px, 10px)' : 'rotate(0) translate(0, 0)',
            borderRadius: '2px',
          }} />
          <span style={{
            width: menuOpen ? '0px' : '22px',
            height: '2.5px',
            background: 'white',
            transition: 'opacity 0.3s ease, width 0.3s ease',
            opacity: menuOpen ? 0 : 1,
            borderRadius: '2px',
          }} />
          <span style={{
            width: '22px',
            height: '2.5px',
            background: 'white',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: menuOpen ? 'rotate(-45deg) translate(9px, -10px)' : 'rotate(0) translate(0, 0)',
            borderRadius: '2px',
          }} />
        </button>
      </div>

      {/* Mobile Menu Overlay & Menu */}
      {menuOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(3px)',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={() => setMenuOpen(false)}
          />
          <div id="mobile-menu" aria-hidden={!menuOpen} style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderTop: '2px solid rgba(0, 102, 204, 0.1)',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            display: 'block',
            animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
              {[
                { icon: '🏠', name: 'Home', path: '/' },
                { icon: 'ℹ️', name: 'About', path: '/about' },
                { icon: '⚡', name: 'Services', path: '/services' },
                { icon: '📂', name: 'Projects', path: '/projects' },
                { icon: '📚', name: 'Courses', path: '/courses' },
                { icon: '📝', name: 'Blog', path: '/blog' },
                { icon: '📞', name: 'Contact', path: '/contact' },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.75rem, 2vw, 1rem)',
                    padding: 'clamp(0.85rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem)',
                    color: '#1f2937',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                    borderRadius: '10px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'transparent',
                    borderLeft: '3px solid transparent',
                    animation: `slideInLeft 0.4s ease ${index * 0.05}s both`,
                  }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 102, 204, 0.08)';
                    e.currentTarget.style.borderLeftColor = '#0066cc';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)' }}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu Items (if authenticated) */}
            {isAuthenticated && (
              <div style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)', borderTop: '1px solid rgba(0, 102, 204, 0.1)', paddingTop: 'clamp(1rem, 2vw, 1.5rem)' }}>
                <p style={{ 
                  color: '#666', 
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', 
                  fontWeight: '600',
                  marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>Account</p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                  {[
                    { icon: '📊', name: 'Dashboard', path: '/dashboard' },
                    // { icon: '📅', name: 'Appointments', path: '/appointments' },
                    // { icon: '💳', name: 'Payments', path: '/payments' },
                    { icon: '👤', name: 'Profile', path: '/profile' },
                    ...(user?.isAdmin ? [{ icon: '⚙️', name: 'Admin Panel', path: '/admin/dashboard' }] : []),
                  ].map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(0.75rem, 2vw, 1rem)',
                        padding: 'clamp(0.75rem, 1.5vw, 0.9rem) clamp(1rem, 2vw, 1.25rem)',
                        color: '#1f2937',
                        textDecoration: 'none',
                        fontWeight: '500',
                        fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                        borderRadius: '10px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'transparent',
                        borderLeft: '3px solid transparent',
                        animation: `slideInLeft 0.4s ease ${(7 + index) * 0.05}s both`,
                      }}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 102, 204, 0.08)';
                        e.currentTarget.style.borderLeftColor = '#00b4d8';
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeftColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)' }}>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    marginTop: 'clamp(1rem, 1.5vw, 1.25rem)',
                    padding: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                    animation: 'slideInLeft 0.4s ease 0.4s both',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                  }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}

            {/* Guest CTA */}
            {!isAuthenticated && location.pathname.startsWith('/courses') && (
              <div style={{ marginTop: 'clamp(1.5rem, 2.5vw, 2rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1.5vw, 1rem)', animation: 'slideInLeft 0.4s ease 0.35s both' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'block',
                    padding: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                    background: 'rgba(0, 102, 204, 0.1)',
                    color: '#0066cc',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: 'clamp(0.9rem, 1.7vw, 1rem)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    border: '2px solid #0066cc',
                  }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0066cc';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 102, 204, 0.1)';
                    e.currentTarget.style.color = '#0066cc';
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: 'block',
                    padding: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                    background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: 'clamp(0.9rem, 1.7vw, 1rem)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
                  }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          nav ul {
            display: none !important;
          }
          nav button {
            display: flex !important;
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </nav>
    </>
  );
};

export default Navbar;
