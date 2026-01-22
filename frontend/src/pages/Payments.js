import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getUserPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: 'white', icon: '✅' },
      pending: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: 'white', icon: '⏳' },
      failed: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', text: 'white', icon: '❌' },
    };
    return colors[status] || colors.pending;
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
            ⏳ Loading your payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
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
        }}>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }}>
            💳 My Payments
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.05rem',
            opacity: 0.95,
          }}>
            View and manage your payment history
          </p>
        </div>

        {payments.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧾</div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
              No Payment History
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
            }}>
              You haven't made any payments yet. Your payment history will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}>
              {[
                { icon: '📊', label: 'Total Payments', value: payments.length },
                { icon: '✅', label: 'Completed', value: payments.filter(p => p.status === 'completed').length },
                { icon: '💰', label: 'Total Amount', value: `$${totalAmount.toFixed(2)}` },
                { icon: '🎯', label: 'Completed Amount', value: `$${completedAmount.toFixed(2)}` },
              ].map((stat, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
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

            {/* Payments Table */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}>
              <div style={{
                overflowX: 'auto',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                      color: 'white',
                    }}>
                      <th style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}>
                        📅 Date
                      </th>
                      <th style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}>
                        💵 Amount
                      </th>
                      <th style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}>
                        📌 Service
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, idx) => {
                      const statusColor = getStatusColor(payment.status);
                      return (
                        <tr key={payment._id} style={{
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}>
                          <td style={{
                            padding: '1.25rem',
                            color: '#1f2937',
                            fontWeight: '500',
                          }}>
                            {new Date(payment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td style={{
                            padding: '1.25rem',
                            fontWeight: '600',
                            color: '#0066cc',
                            fontSize: '1.05rem',
                          }}>
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td style={{
                            padding: '1.25rem',
                          }}>
                            <span style={{
                              background: statusColor.bg,
                              color: statusColor.text,
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'inline-block',
                            }}>
                              {statusColor.icon} {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td style={{
                            padding: '1.25rem',
                            color: '#4b5563',
                          }}>
                            {payment.appointment?.service || 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
