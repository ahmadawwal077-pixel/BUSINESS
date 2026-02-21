import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { courseAPI } from '../services/api';
import AssignmentPopup from '../components/AssignmentPopup';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({
    activeCourses: 0,
    completedCourses: 0,
    averageGrade: 0,
    upcomingAssignments: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showCongratulationModal, setShowCongratulationModal] = useState(false);

  // Check for payment status in URL parameters
  useEffect(() => {
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    
    if (status === 'success') {
      setPaymentStatus('success');
      setPaymentMessage(message || 'Congratulations! Your enrollment is now active!');
      setShowCongratulationModal(true);
      
      // Clear the URL parameters
      setSearchParams({});
    } else if (status === 'failed') {
      setPaymentStatus('failed');
      setPaymentMessage(message || 'Payment failed. Please try again.');
    }
  }, [searchParams, setSearchParams]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsRes = await courseAPI.getStudentDashboardStats();
      setStats(statsRes.data);

      // Fetch enrolled courses
      const coursesRes = await courseAPI.getMyEnrolledCourses();
      const enrollments = coursesRes.data || [];

      // Filter out invalid enrollments that have no course or malformed data
      const filteredEnrollments = enrollments.filter(e => e && e.course && (e.course._id || typeof e.course === 'string'));

      // For each enrollment fetch student-specific course details (assignments with marks + attendance)
      // also fetch course live-classes so enrolled students can see scheduled classes
      const detailed = await Promise.all(filteredEnrollments.map(async (enr) => {
        try {
          const [detailRes, liveRes] = await Promise.all([
            courseAPI.getStudentCourseDetail(enr.course._id),
            courseAPI.getCourseLiveClasses(enr.course._id).catch(() => ({ data: [] })),
          ]);

          return { ...enr, detail: detailRes.data, liveClasses: liveRes.data || [], deleted: false };
        } catch (e) {
          // If course is deleted (404) or details can't be fetched, mark as deleted
          if (e.response?.status === 404) {
            return { ...enr, detail: null, liveClasses: [], deleted: true };
          }
          return { ...enr, detail: null, liveClasses: [], deleted: false };
        }
      }));

      // Filter out deleted courses
      const validCourses = detailed.filter(course => !course.deleted && course.course);
      setEnrolledCourses(validCourses);

      // Ensure activeCourses count reflects actual valid enrollments
      setStats(prev => ({ ...(statsRes.data || {}), activeCourses: validCourses.length }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let intervalId = null;
    // Initial fetch
    fetchDashboardData();
    // Poll every 30 seconds
    intervalId = setInterval(fetchDashboardData, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, fetchDashboardData]);

  // Listen for enrollment updates and course deletion events
  useEffect(() => {
    if (!user) return;

    const handleEnrollmentUpdate = (ev) => {
      // ev may be a StorageEvent or a CustomEvent
      try {
        // Small debounce: call fetch once
        fetchDashboardData();
      } catch (e) {
        console.error('Error handling enrollment update event', e);
      }
    };

    const handleCourseDelete = (ev) => {
      // When a course is deleted, refetch dashboard to remove it
      try {
        fetchDashboardData();
      } catch (e) {
        console.error('Error handling course delete event', e);
      }
    };

    const storageHandler = (e) => {
      if (e.key === 'enrollment_update') handleEnrollmentUpdate(e);
      if (e.key === 'course_deleted') handleCourseDelete(e);
    };

    window.addEventListener('storage', storageHandler);
    window.addEventListener('enrollment_update', handleEnrollmentUpdate);
    window.addEventListener('course_deleted', handleCourseDelete);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('enrollment_update', handleEnrollmentUpdate);
      window.removeEventListener('course_deleted', handleCourseDelete);
    };
  }, [user, fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefreshEnrollment = async (enrollmentId) => {
    try {
      const enr = enrolledCourses.find(e => e._id === enrollmentId);
      if (!enr) return;
      const [detailRes, liveRes] = await Promise.all([
        courseAPI.getStudentCourseDetail(enr.course._id),
        courseAPI.getCourseLiveClasses(enr.course._id).catch(() => ({ data: [] })),
      ]);

      const updated = enrolledCourses.map(e => e._id === enrollmentId ? { ...e, detail: detailRes.data, liveClasses: liveRes.data || [] } : e);
      setEnrolledCourses(updated);
    } catch (error) {
      console.error('Error refreshing enrollment:', error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const consultationActions = [
    {
      icon: '📅',
      title: 'My Consultations',
      description: 'View and manage your scheduled consultations',
      path: '/appointments',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
    {
      icon: '✨',
      title: 'Book Consultation',
      description: 'Schedule a new consultation or expert meeting',
      path: '/make-appointment',
      color: '#f43f5e',
      bgColor: 'rgba(244, 63, 94, 0.1)',
    },
  ];

  const profileAction = {
    icon: '👤',
    title: 'Profile',
    description: 'Update your profile and account settings',
    path: '/profile',
    color: '#0077b6',
    bgColor: 'rgba(0, 119, 182, 0.1)',
  };

  const renderActionCard = (item) => (
    <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
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
  );

  return (
    <>
      {/* Congratulation Modal on Payment Success */}
      {showCongratulationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
            animation: 'scaleIn 0.4s ease-out',
          }}>
            {/* Animated Checkmark */}
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              animation: 'bounce 0.6s ease-out 0.3s both',
            }}>
              ✅
            </div>
            
            <h2 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Congratulations! 🎉
            </h2>
            
            <p style={{
              margin: '0 0 2rem 0',
              fontSize: '1.1rem',
              color: '#6b7280',
              lineHeight: '1.7',
            }}>
              {paymentMessage}
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.95rem',
              lineHeight: '1.8',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                ✓ Enrollment activated successfully
              </p>
              <p style={{ margin: 0 }}>
                You now have full access to all course materials, assignments, and live classes. Start learning now!
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowCongratulationModal(false);
                window.location.reload();
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }}
            >
              Continue to Dashboard
            </button>
          </div>
          
          <style>{`
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
        </div>
      )}

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
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                opacity: 0.95,
              }}>
                Manage your courses and consultations all in one place
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

        {/* Payment Failure Alert */}
        {paymentStatus === 'failed' && (
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '2rem',
            background: '#fee2e2',
            border: '2px solid #fca5a5',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div style={{ fontSize: '1.8rem' }}>❌</div>
              <div>
                <p style={{ margin: '0 0 0.3rem 0', fontWeight: '600', color: '#991b1b' }}>
                  Payment Failed
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d' }}>
                  {paymentMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setPaymentMessage('');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#991b1b',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fee2e2';
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Course Stats Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            marginBottom: '1.5rem',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            📚 Your Course Progress
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            {[
              { icon: '📚', label: 'Active Courses', value: loading ? '...' : stats.activeCourses },
              { icon: '🎓', label: 'Completed', value: loading ? '...' : stats.completedCourses },
              { icon: '📊', label: 'Average Grade', value: loading ? '...' : `${stats.averageGrade}%` },
              { icon: '📋', label: 'Upcoming Assignments', value: loading ? '...' : stats.upcomingAssignments },
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

          {/* View Previous Grades Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '3rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
          }}
          onClick={() => navigate('/student-previous-grades')}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                  📜 View Previous Grades
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}>
                  Review all your submitted assignments and their grades
                </p>
              </div>
              <div style={{
                fontSize: '2.5rem',
                opacity: 0.8,
              }}>
                →
              </div>
            </div>
          </div>

          {/* My Enrolled Courses */}
          {enrolledCourses.length > 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '18px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              marginBottom: '3rem',
              borderTop: '4px solid #0066cc',
            }}>
              <h3 style={{
                margin: '0 0 1.5rem 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#1f2937',
              }}>
                My Active Courses
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
              }}>
                {enrolledCourses.map((enrollment) => (
                  <div key={enrollment._id} style={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 102, 204, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 102, 204, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                  }}>
                    {enrollment.course?.image && (
                      <div style={{
                        height: '150px',
                        background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                        backgroundImage: `url(${enrollment.course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                      }}>
                        {enrollment.course?.title}
                      </h4>
                      <p style={{
                        margin: '0.3rem 0',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                      }}>
                        <strong>Level:</strong> {enrollment.course?.level}
                      </p>
                      <p style={{
                        margin: '0.3rem 0',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                      }}>
                        <strong>Duration:</strong> {enrollment.course?.duration} weeks
                      </p>
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(0, 102, 204, 0.1)',
                      }}>
                        <p style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '0.8rem',
                          color: '#0066cc',
                          fontWeight: 'bold',
                        }}>
                          Attendance
                        </p>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #0066cc, #00b4d8)',
                            width: `${enrollment.totalAttendance > 0 ? ((enrollment.presentDays / enrollment.totalAttendance) * 100) : 0}%`,
                          }} />
                        </div>
                        <p style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          transition: 'color 0.6s ease-in-out',
                        }}>
                          {enrollment.totalAttendance > 0 ? ((enrollment.presentDays / enrollment.totalAttendance) * 100).toFixed(0) : 0}% Attended
                        </p>
                        {/* Student-specific details: classes, assignments, attendance */}
                        {enrollment.detail && (
                          <div style={{ marginTop: '1rem' }}>
                            {/* Classes/Schedule */}
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Classes</p>
                            <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.85rem' }}>
                              {enrollment.course?.schedule?.days?.join(', ') || 'Schedule not set'} • {enrollment.course?.schedule?.startTime || '--'} - {enrollment.course?.schedule?.endTime || '--'}
                            </p>

                            {/* Assignments */}
                            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Assignments</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                              {enrollment.detail.assignments.length === 0 && (
                                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>No assignments yet</div>
                              )}
                              {enrollment.detail.assignments.map((a) => (
                                <div
                                  key={a._id}
                                  onClick={() => {
                                    setSelectedAssignment(a);
                                    setSelectedCourseId(enrollment.course._id);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f4ff';
                                    e.currentTarget.style.borderLeft = '3px solid #0066cc';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderLeft = 'none';
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>{a.title}</div>
                                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Due: {a.dueDate ? a.dueDate.split('T')[0] : 'TBD'}</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: '#0066cc' }}>
                                      {a.submission?.status === 'graded' ? `${a.submission.score}/${a.submission.maxScore}` : 'Not graded'}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                      {a.submission ? (a.submission.status === 'graded' ? 'Graded' : 'Submitted') : 'Pending'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Attendance details (recent) */}
                            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Attendance</p>
                            <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.85rem' }}>
                              <div>Attendance: {enrollment.detail.attendance.attendancePercentage}%</div>
                              <div style={{ marginTop: '0.5rem' }}>
                                {enrollment.detail.attendance.records.slice(0,3).map((r) => (
                                  <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280' }}>
                                    <div>{new Date(r.date).toLocaleDateString()}</div>
                                    <div>{r.status}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Upcoming Live Classes */}
                              {enrollment.liveClasses && enrollment.liveClasses.length > 0 && (
                                <div style={{ marginTop: '0.75rem' }}>
                                  <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>🎓 Upcoming Live Classes</div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {enrollment.liveClasses.slice(0,3).map((lc) => (
                                      <div key={lc._id} style={{
                                        background: new Date(lc.scheduledAt) < new Date() ? '#f3f4f6' : '#e0f2fe',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        border: lc.meetingUrl ? '1px solid #0066cc' : 'none',
                                      }}>
                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{lc.title}</div>
                                        <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                          📅 {new Date(lc.scheduledAt).toLocaleString()}
                                        </div>
                                        {lc.durationMinutes && (
                                          <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                            ⏱️ {lc.durationMinutes} minutes
                                          </div>
                                        )}
                                        {lc.meetingUrl && new Date(lc.scheduledAt) > new Date() && (
                                          <a
                                            href={lc.meetingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              display: 'inline-block',
                                              marginTop: '0.5rem',
                                              padding: '0.4rem 0.8rem',
                                              background: '#0066cc',
                                              color: 'white',
                                              borderRadius: '4px',
                                              textDecoration: 'none',
                                              fontSize: '0.8rem',
                                              fontWeight: '600',
                                            }}
                                          >
                                            🔗 Join Zoom
                                          </a>
                                        )}
                                        {lc.meetingUrl && new Date(lc.scheduledAt) <= new Date() && (
                                          <div style={{
                                            marginTop: '0.5rem',
                                            padding: '0.4rem 0.8rem',
                                            background: '#f3f4f6',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                          }}>
                                            Class ended
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                          onClick={() => handleRefreshEnrollment(enrollment._id)}
                          style={{
                            padding: '0.5rem 0.9rem',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Refresh
                        </button>
                        <Link
                          to={`/course/${enrollment.course?._id}`}
                          style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            padding: '0.6rem 1.2rem',
                            background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Course Management Section 
        // <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            marginBottom: '2rem',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            Course Management
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {courseActions.map((item) => renderActionCard(item))}
          </div>
        </div> 



        {/* Profile Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: '3rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {renderActionCard(profileAction)}
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '3rem auto 0',
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

        {/* Assignment Popup */}
        {selectedAssignment && selectedCourseId && (
          <AssignmentPopup
            assignment={selectedAssignment}
            courseId={selectedCourseId}
            onClose={() => {
              setSelectedAssignment(null);
              setSelectedCourseId(null);
            }}
            onSubmit={() => {
              fetchDashboardData();
            }}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;