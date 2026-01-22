import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardItems = [
    {
      icon: '📅',
      title: 'My Appointments',
      description: 'View and manage your scheduled appointments',
      path: '/appointments',
      color: '#0066cc',
      bgColor: 'rgba(0, 102, 204, 0.1)',
    },
    {
      icon: '✨',
      title: 'Book Appointment',
      description: 'Schedule a new consultation or meeting',
      path: '/make-appointment',
      color: '#00b4d8',
      bgColor: 'rgba(0, 180, 216, 0.1)',
    },
    {
      icon: '💳',
      title: 'My Payments',
      description: 'View your payment history and invoices',
      path: '/payments',
      color: '#0096c7',
      bgColor: 'rgba(0, 150, 199, 0.1)',
    },
    {
      icon: '👤',
      title: 'Profile',
      description: 'Update your profile and account settings',
      path: '/profile',
      color: '#0077b6',
      bgColor: 'rgba(0, 119, 182, 0.1)',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '3rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
          borderRadius: '20px',
          padding: '3rem',
          color: 'white',
          boxShadow: '0 10px 40px rgba(0, 102, 204, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p style={{
              margin: 0,
              fontSize: '1.1rem',
              opacity: 0.95,
            }}>
              Manage your account, appointments, and more from your personal dashboard
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#0066cc';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = 'white';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
      }}>
        {[
          { icon: '📊', label: 'Total Appointments', value: '5' },
          { icon: '✅', label: 'Completed', value: '3' },
          { icon: '⏳', label: 'Upcoming', value: '2' },
          { icon: '💰', label: 'Total Spent', value: '$2,450' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 102, 204, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <p style={{ color: '#94a3b8', margin: '0.5rem 0 0.5rem 0', fontSize: '0.9rem' }}>
              {stat.label}
            </p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#0066cc' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Dashboard Cards */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <h2 style={{
          marginBottom: '2rem',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#1f2937',
        }}>
          Quick Actions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {dashboardItems.map((item, idx) => (
            <Link key={idx} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '18px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderLeft: `6px solid ${item.color}`,
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
                {/* Icon Background */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '15px',
                  background: item.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                }}>
                  {item.icon}
                </div>

                {/* Title and Description */}
                <h3 style={{
                  margin: '0 0 0.8rem 0',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1f2937',
                }}>
                  {item.title}
                </h3>

                <p style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                }}>
                  {item.description}
                </p>

                {/* Arrow Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: item.color,
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }}>
                  <span>Get Started</span>
                  <span style={{ fontSize: '1.2rem' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '4rem auto 0',
        paddingTop: '3rem',
        borderTop: '2px solid rgba(0, 102, 204, 0.1)',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.95rem',
      }}>
        <p>
          Need help? <a href="/contact" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>Contact Support</a> or visit our <a href="/blog" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>Knowledge Base</a>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
