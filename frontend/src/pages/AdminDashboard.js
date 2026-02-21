import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { courseAPI, liveClassAPI } from '../services/api';
import AssignmentManager from '../components/AssignmentManager';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  
  // Course Management State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: '',
    duration: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    scheduleDays: [],
    scheduleStartTime: '09:00',
    scheduleEndTime: '11:00',
  });

  // Assignment Management State
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: '',
  });

  // Students (for admin views / marking)
  const [students, setStudents] = useState([]);

  // Attendance Management State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({
    studentId: '',
    date: '',
    status: 'present',
  });

  // Live class attendance state
  const [selectedLiveClass, setSelectedLiveClass] = useState(null);
  const [liveClassEnrollments, setLiveClassEnrollments] = useState([]);
  const [liveClassAttendanceState, setLiveClassAttendanceState] = useState({});
  const [showLiveClassAttendanceModal, setShowLiveClassAttendanceModal] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  // Assignment marking state
  const [assignmentsForCourse, setAssignmentsForCourse] = useState([]);
  const [showMarkAssignmentModal, setShowMarkAssignmentModal] = useState(false);
  const [markForm, setMarkForm] = useState({ assignmentId: '', studentId: '', marks: '' });
  const [showScheduleLiveModal, setShowScheduleLiveModal] = useState(false);
  const [liveForm, setLiveForm] = useState({ title: '', description: '', scheduledAt: '', durationMinutes: 60, meetingUrl: '' });
  
  // Upcoming Classes State
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [selectedCourseForClass, setSelectedCourseForClass] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showMessage('error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (courseForm.startDate && courseForm.duration) {
      const startDate = new Date(courseForm.startDate);
      const durationWeeks = parseInt(courseForm.duration) || 0;
      if (durationWeeks > 0) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + durationWeeks * 7);
        const endDateString = endDate.toISOString().split('T')[0];
        setCourseForm(prev => ({ ...prev, endDate: endDateString }));
      }
    }
  }, [courseForm.startDate, courseForm.duration]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await courseAPI.getStudents();
      setStudents(res.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showMessage('error', 'Failed to load students');
    }
  }, []);

  const fetchAssignments = useCallback(async (courseId) => {
    try {
      const res = await courseAPI.getCourseAssignments(courseId);
      setAssignmentsForCourse(res.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showMessage('error', 'Failed to load assignments');
    }
  }, []);

  const fetchUpcomingClasses = useCallback(async () => {
    try {
      const courses = await courseAPI.getAllCourses();
      const allClasses = [];
      
      for (const course of courses.data) {
        try {
          const classes = await liveClassAPI.getCourseLiveClasses(course._id);
          allClasses.push(...classes.data.map(cls => ({ ...cls, courseName: course.title })));
        } catch (err) {
          // Silently ignore errors for individual courses
        }
      }
      
      // Sort by scheduled date
      allClasses.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
      setUpcomingClasses(allClasses);
    } catch (error) {
      console.error('Error fetching upcoming classes:', error);
    }
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchUpcomingClasses();
    if (!user?.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate, fetchCourses, fetchStudents, fetchUpcomingClasses]);

  // Course Management Functions
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!courseForm.title || !courseForm.description || !courseForm.startDate || !courseForm.endDate) {
        showMessage('error', 'Please fill in all required fields (Title, Description, Start Date, End Date)');
        return;
      }

      // Validate price, duration, maxStudents are numbers
      if (!courseForm.price || !courseForm.duration || !courseForm.maxStudents) {
        showMessage('error', 'Please fill in all numeric fields (Price, Duration, Max Students)');
        return;
      }

      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        level: courseForm.level,
        price: parseInt(courseForm.price),
        duration: parseInt(courseForm.duration),
        maxStudents: parseInt(courseForm.maxStudents),
        startDate: new Date(courseForm.startDate),
        endDate: new Date(courseForm.endDate),
        schedule: {
          days: Array.isArray(courseForm.scheduleDays) && courseForm.scheduleDays.length > 0 ? courseForm.scheduleDays : ['Monday', 'Wednesday'],
          startTime: courseForm.scheduleStartTime || '09:00',
          endTime: courseForm.scheduleEndTime || '11:00',
        },
      };

      console.log('Sending course data:', courseData);
      await courseAPI.createCourse(courseData);
      showMessage('success', 'Course added successfully!');
      resetCourseForm();
      setShowAddCourseModal(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add course';
      showMessage('error', errorMsg);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      if (!courseForm.title || !courseForm.description || !courseForm.startDate || !courseForm.endDate) {
        showMessage('error', 'Please fill in all required fields (Title, Description, Start Date, End Date)');
        return;
      }

      if (!courseForm.price || !courseForm.duration || !courseForm.maxStudents) {
        showMessage('error', 'Please fill in all numeric fields (Price, Duration, Max Students)');
        return;
      }

      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        level: courseForm.level,
        price: parseInt(courseForm.price),
        duration: parseInt(courseForm.duration),
        maxStudents: parseInt(courseForm.maxStudents),
        startDate: new Date(courseForm.startDate),
        endDate: new Date(courseForm.endDate),
        schedule: {
          days: Array.isArray(courseForm.scheduleDays) && courseForm.scheduleDays.length > 0 ? courseForm.scheduleDays : ['Monday', 'Wednesday'],
          startTime: courseForm.scheduleStartTime || '09:00',
          endTime: courseForm.scheduleEndTime || '11:00',
        },
      };

      console.log('Updating course data:', courseData);
      await courseAPI.updateCourse(editingCourse._id, courseData);
      showMessage('success', 'Course updated successfully!');
      resetCourseForm();
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update course';
      showMessage('error', errorMsg);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await courseAPI.deleteCourse(courseId);
        showMessage('success', 'Course deleted successfully!');
        
        // Broadcast course deletion event to all tabs/windows
        localStorage.setItem('course_deleted', JSON.stringify({ courseId, timestamp: Date.now() }));
        window.dispatchEvent(new CustomEvent('course_deleted', { detail: { courseId } }));
        
        fetchCourses();
      } catch (error) {
        showMessage('error', 'Failed to delete course');
      }
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      maxStudents: course.maxStudents,
      startDate: course.startDate?.split('T')[0] || '',
      endDate: course.endDate?.split('T')[0] || '',
      scheduleDays: Array.isArray(course.schedule?.days) ? course.schedule.days : (course.schedule?.days ? [course.schedule.days] : ['Monday', 'Wednesday']),
      scheduleStartTime: course.schedule?.startTime || '09:00',
      scheduleEndTime: course.schedule?.endTime || '11:00',
    });
    setShowAddCourseModal(true);
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: 'Web Development',
      level: 'Beginner',
      price: '',
      duration: '',
      maxStudents: '',
      startDate: '',
      endDate: '',
      scheduleDays: [],
      scheduleStartTime: '09:00',
      scheduleEndTime: '11:00',
    });
    setEditingCourse(null);
  };

  // Assignment Management Functions
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!assignmentForm.title || !assignmentForm.description || !assignmentForm.dueDate || !assignmentForm.totalPoints) {
        showMessage('error', 'Please fill in all assignment fields (Title, Description, Due Date, Total Points)');
        return;
      }

      if (!selectedCourseForAssignment) {
        showMessage('error', 'Please select a course');
        return;
      }

      const assignmentData = {
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: new Date(assignmentForm.dueDate),
        totalPoints: parseInt(assignmentForm.totalPoints),
      };

      console.log('Adding assignment for course:', selectedCourseForAssignment._id);
      console.log('Assignment data:', assignmentData);

      await courseAPI.addAssignment(selectedCourseForAssignment._id, assignmentData);
      showMessage('success', 'Assignment added successfully!');
      setAssignmentForm({ title: '', description: '', dueDate: '', totalPoints: '' });
      setShowAddAssignmentModal(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding assignment:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add assignment';
      showMessage('error', errorMsg);
    }
  };

  // Attendance Management Functions
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.markAttendance(selectedCourseForAttendance._id, attendanceForm);
      showMessage('success', 'Attendance marked successfully!');
      setAttendanceForm({ studentId: '', date: '', status: 'present' });
      setShowAttendanceModal(false);
      fetchCourses();
    } catch (error) {
      showMessage('error', 'Failed to mark attendance');
    }
  };

  const handleScheduleLiveClass = async (e) => {
    e.preventDefault();
    if (!selectedCourseForClass) {
      showMessage('error', 'Please select a course');
      return;
    }
    if (!liveForm.title || !liveForm.scheduledAt || !liveForm.meetingUrl) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }
    try {
      // Convert datetime-local value to ISO string
      const scheduledDate = new Date(liveForm.scheduledAt);
      const dataToSend = {
        ...liveForm,
        scheduledAt: scheduledDate.toISOString(),
      };
      await liveClassAPI.addLiveClass(selectedCourseForClass._id, dataToSend);
      showMessage('success', 'Live class scheduled successfully!');
      setLiveForm({ title: '', description: '', scheduledAt: '', durationMinutes: 60, meetingUrl: '' });
      setShowScheduleLiveModal(false);
      fetchUpcomingClasses();
    } catch (error) {
      console.error('Error scheduling live class:', error);
      showMessage('error', error.response?.data?.message || 'Failed to schedule live class');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <div style={{ fontSize: '1.5rem', color: '#0066cc' }}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        padding: 'clamp(1rem, 3vw, 2rem)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.3rem, 4vw, 2rem)',
              fontWeight: 'bold',
            }}>
              🛠️ Admin Dashboard
            </h1>
            <p style={{
              margin: '0.5rem 0 0 0',
              opacity: 0.95,
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            }}>
              Welcome, {user?.name || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '42px',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#7c3aed';
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

      {/* Message Alert */}
      {message.text && (
        <div style={{
          maxWidth: '1400px',
          margin: 'clamp(0.75rem, 2vw, 1rem) auto',
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '10px',
          border: `2px solid ${message.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
          fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
        }}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1rem, 3vw, 2rem)',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          flexWrap: 'wrap',
          overflowX: 'auto',
        }}>
          {['courses', 'assignments', 'upcomingClasses', 'attendance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: 'clamp(0.7rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem)',
                background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' : 'white',
                color: activeTab === tab ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '10px 10px 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '-2px',
                fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = 'white';
                }
              }}
            >
              {tab === 'courses' && '📚 Courses'}
              {tab === 'assignments' && '📋 Assignments'}
              {tab === 'upcomingClasses' && '🎓 Upcoming Classes'}
              {tab === 'attendance' && '✅ Attendance'}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
              flexWrap: 'wrap',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                color: '#1f2937',
              }}>
                Manage Courses ({courses.length})
              </h2>
              <button
                onClick={() => {
                  resetCourseForm();
                  setShowAddCourseModal(true);
                }}
                style={{
                  padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.opacity = '1';
                }}
              >
                + Add New Course
              </button>
            </div>

            {courses.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)' }}>No courses yet. Create your first course!</p>
            ) : (
              <div style={{
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                }}>
                  <thead>
                    <tr style={{
                      background: '#f3f4f6',
                      borderBottom: '2px solid #e5e7eb',
                    }}>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Course Title</th>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Category</th>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Level</th>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Price</th>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Students</th>
                      <th style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', color: '#1f2937', fontWeight: '600' }}>{course.title}</td>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', color: '#6b7280' }}>{course.category}</td>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                          <span style={{
                            background: course.level === 'Beginner' ? '#d1fae5' : course.level === 'Intermediate' ? '#fef3c7' : '#fee2e2',
                            color: course.level === 'Beginner' ? '#065f46' : course.level === 'Intermediate' ? '#92400e' : '#991b1b',
                            padding: 'clamp(0.25rem, 0.5vw, 0.3rem) clamp(0.6rem, 1vw, 0.8rem)',
                            borderRadius: '20px',
                            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                            fontWeight: '600',
                          }}>
                            {course.level}
                          </span>
                        </td>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', color: '#1f2937', fontWeight: '600' }}>₦{course.price?.toLocaleString()}</td>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)', color: '#6b7280' }}>{course.enrolledStudents}/{course.maxStudents}</td>
                        <td style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                          <button
                            onClick={() => handleEditCourse(course)}
                            style={{
                              padding: 'clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.6rem, 1.2vw, 0.8rem)',
                              background: '#dbeafe',
                              color: '#1e40af',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              marginRight: '0.5rem',
                              transition: 'all 0.2s ease',
                              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                              minHeight: '36px',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#bfdbfe';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#dbeafe';
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            style={{
                              padding: 'clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.6rem, 1.2vw, 0.8rem)',
                              background: '#fee2e2',
                              color: '#991b1b',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                              minHeight: '36px',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#fca5a5';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#fee2e2';
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Mark Assignment Modal */}
        {showMarkAssignmentModal && selectedCourseForAssignment && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div style={{ background: 'white', borderRadius: '15px', padding: 'clamp(1.5rem, 3vw, 2rem)', maxWidth: 'clamp(280px, 90vw, 520px)', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
              <h2 style={{ margin: '0 0 clamp(0.75rem, 1.5vw, 1rem) 0', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 'bold', color: '#1f2937' }}>Mark Assignment</h2>
              <p style={{ margin: '0 0 clamp(0.75rem, 1.5vw, 1rem) 0', color: '#6b7280', fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Course: {selectedCourseForAssignment.title}</p>

              <form onSubmit={async (e) => { e.preventDefault();
                try {
                  if (!markForm.assignmentId || !markForm.studentId || markForm.marks === '') {
                    showMessage('error', 'Please select assignment, student and enter marks');
                    return;
                  }
                  await courseAPI.markAssignment(markForm.assignmentId, { studentId: markForm.studentId, marks: parseFloat(markForm.marks) });
                  showMessage('success', 'Assignment marked successfully!');
                  setMarkForm({ assignmentId: '', studentId: '', marks: '' });
                  setShowMarkAssignmentModal(false);
                  fetchAssignments(selectedCourseForAssignment._id);
                } catch (error) {
                  console.error('Error marking assignment:', error);
                  const msg = error.response?.data?.message || error.message || 'Failed to mark assignment';
                  showMessage('error', msg);
                }
              }}>
                <div style={{ marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Assignment *</label>
                  <select required value={markForm.assignmentId} onChange={(e) => setMarkForm({ ...markForm, assignmentId: e.target.value })} style={{ width: '100%', padding: 'clamp(0.6rem, 1.2vw, 0.8rem)', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>
                    <option value="">Select assignment...</option>
                    {assignmentsForCourse.map(a => (<option key={a._id} value={a._id}>{a.title} — due {a.dueDate?.split('T')[0]}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Student *</label>
                  <select required value={markForm.studentId} onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })} style={{ width: '100%', padding: 'clamp(0.6rem, 1.2vw, 0.8rem)', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>
                    <option value="">Select student...</option>
                    {students.map(s => (<option key={s._id} value={s._id}>{s.name} — {s.email}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Marks *</label>
                  <input required type="number" min="0" step="0.1" value={markForm.marks} onChange={(e) => setMarkForm({ ...markForm, marks: e.target.value })} style={{ width: '100%', padding: 'clamp(0.6rem, 1.2vw, 0.8rem)', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', minHeight: '40px' }} />
                </div>
                <div style={{ display: 'flex', gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <button type="submit" style={{ flex: 1, padding: 'clamp(0.6rem, 1.5vw, 0.8rem)', background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', minHeight: '40px' }}>Save</button>
                  <button type="button" onClick={() => { setShowMarkAssignmentModal(false); setMarkForm({ assignmentId: '', studentId: '', marks: '' }); }} style={{ flex: 1, padding: 'clamp(0.6rem, 1.5vw, 0.8rem)', background: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', minHeight: '40px' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Live Class Modal */}
        {showScheduleLiveModal && selectedCourseForAssignment && (
          <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <div style={{ background:'white', borderRadius:15, padding:'clamp(1.5rem, 3vw, 2rem)', maxWidth:'clamp(280px, 90vw, 520px)', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
              <h2 style={{ margin:'0 0 clamp(0.75rem, 1.5vw, 1rem) 0', fontSize:'clamp(1.2rem, 3vw, 1.5rem)', fontWeight:'bold', color:'#1f2937' }}>Schedule Live Class</h2>
              <p style={{ color:'#6b7280', marginBottom:'clamp(0.75rem, 1.5vw, 1rem)', fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>{selectedCourseForAssignment.title}</p>
              <form onSubmit={async (e) => { e.preventDefault();
                try {
                  if (!liveForm.title || !liveForm.scheduledAt) { showMessage('error','Please provide title and scheduled time'); return; }
                  const payload = { ...liveForm };
                  await courseAPI.addLiveClass(selectedCourseForAssignment._id, payload);
                  showMessage('success','Live class scheduled');
                  setLiveForm({ title:'', description:'', scheduledAt:'', durationMinutes:60, meetingUrl:'' });
                  setShowScheduleLiveModal(false);
                } catch (err) { console.error(err); showMessage('error', err.response?.data?.message || err.message || 'Failed to schedule live class'); }
              }}>
                <div style={{ marginBottom:'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600, fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Title *</label>
                  <input required value={liveForm.title} onChange={(e)=>setLiveForm({...liveForm, title:e.target.value})} style={{ width:'100%', padding:'clamp(0.6rem, 1.2vw, 0.8rem)', border:'2px solid #e5e7eb', borderRadius:8, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', minHeight: '40px' }} />
                </div>
                <div style={{ marginBottom:'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600, fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Scheduled At *</label>
                  <input required type='datetime-local' value={liveForm.scheduledAt} onChange={(e)=>setLiveForm({...liveForm, scheduledAt:e.target.value})} style={{ width:'100%', padding:'clamp(0.6rem, 1.2vw, 0.8rem)', border:'2px solid #e5e7eb', borderRadius:8, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', minHeight: '40px' }} />
                </div>
                <div style={{ marginBottom:'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600, fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Duration (minutes)</label>
                  <input type='number' min='10' value={liveForm.durationMinutes} onChange={(e)=>setLiveForm({...liveForm, durationMinutes:parseInt(e.target.value)})} style={{ width:'100%', padding:'clamp(0.6rem, 1.2vw, 0.8rem)', border:'2px solid #e5e7eb', borderRadius:8, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', minHeight: '40px' }} />
                </div>
                <div style={{ marginBottom:'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600, fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Meeting URL (optional)</label>
                  <input value={liveForm.meetingUrl} onChange={(e)=>setLiveForm({...liveForm, meetingUrl:e.target.value})} placeholder='Zoom/Meet link' style={{ width:'100%', padding:'clamp(0.6rem, 1.2vw, 0.8rem)', border:'2px solid #e5e7eb', borderRadius:8, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', minHeight: '40px' }} />
                </div>
                <div style={{ display:'flex', gap:'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <button type='submit' style={{ flex:1, padding:'clamp(0.6rem, 1.5vw, 0.8rem)', background:'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)', color:'white', border:'none', borderRadius:8, fontWeight:600, fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', minHeight: '40px' }}>Schedule</button>
                  <button type='button' onClick={()=>setShowScheduleLiveModal(false)} style={{ flex:1, padding:'clamp(0.6rem, 1.5vw, 0.8rem)', background:'#e5e7eb', color:'#1f2937', border:'none', borderRadius:8, fontWeight:600, fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', minHeight: '40px' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <AssignmentManager />
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'upcomingClasses' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)', flexWrap: 'wrap', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                color: '#1f2937',
              }}>
                🎓 Upcoming Classes
              </h2>
              <button
                onClick={() => {
                  setShowScheduleLiveModal(true);
                  setSelectedCourseForClass(null);
                }}
                style={{
                  padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)',
                  background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  cursor: 'pointer',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                + Schedule Class
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Select Course (Optional - to see only this course's classes):
              </label>
              <select
                value={selectedCourseForClass?._id || ''}
                onChange={(e) => {
                  const course = courses.find(c => c._id === e.target.value);
                  setSelectedCourseForClass(course);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </div>

            {upcomingClasses.filter(cls => !selectedCourseForClass || cls.course === selectedCourseForClass._id).length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                No upcoming classes. Click "Schedule Class" to create one.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {upcomingClasses.filter(cls => !selectedCourseForClass || cls.course === selectedCourseForClass._id).map((liveClass) => (
                  <div
                    key={liveClass._id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      backgroundColor: new Date(liveClass.scheduledAt) < new Date() ? '#f9fafb' : '#fff',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937' }}>
                          {liveClass.title}
                        </h3>
                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                          📚 {liveClass.courseName || 'Course'}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: new Date(liveClass.scheduledAt) < new Date() ? '#f3f4f6' : '#e0f2fe',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: new Date(liveClass.scheduledAt) < new Date() ? '#6b7280' : '#0369a1',
                      }}>
                        {new Date(liveClass.scheduledAt) < new Date() ? 'Past' : 'Upcoming'}
                      </div>
                    </div>

                    {liveClass.description && (
                      <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.95rem' }}>
                        {liveClass.description}
                      </p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>📅 Date & Time:</p>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#1f2937', fontWeight: '500' }}>
                          {new Date(liveClass.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>⏱️ Duration:</p>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#1f2937', fontWeight: '500' }}>
                          {liveClass.durationMinutes} minutes
                        </p>
                      </div>
                    </div>

                    {liveClass.meetingUrl && (
                      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #0066cc' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#0066cc', fontWeight: '600' }}>🔗 Zoom Link:</p>
                        <a
                          href={liveClass.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#0066cc',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            wordBreak: 'break-all',
                            fontWeight: '500',
                          }}
                        >
                          {liveClass.meetingUrl}
                        </a>
                      </div>
                    )}

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={async () => {
                          setSelectedLiveClass(liveClass);
                          try {
                            const r = await courseAPI.getCourseEnrollments(liveClass.course);
                            setLiveClassEnrollments(r.data || []);
                            const state = {};
                            (r.data || []).forEach(e => { state[e.student._id] = 'present' });
                            setLiveClassAttendanceState(state);
                            setShowLiveClassAttendanceModal(true);
                          } catch (err) {
                            showMessage('error', 'Failed to load enrollments');
                          }
                        }}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: '#7c3aed',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          flex: 1,
                        }}
                      >
                        ✅ Mark Attendance
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this live class?')) return;
                          try {
                            await courseAPI.deleteLiveClass(liveClass._id);
                            showMessage('success', 'Live class deleted');
                            fetchUpcomingClasses();
                          } catch (err) {
                            showMessage('error', 'Failed to delete class');
                          }
                        }}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'students' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <h2 style={{
              margin: '0 0 clamp(1.5rem, 2vw, 2rem) 0',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Student Profiles ({students.length})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
              gap: 'clamp(0.75rem, 1.5vw, 1rem)',
            }}>
              {students.map((s) => (
                <div key={s._id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #fbfbff 100%)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: '#4c1d95'
                    }}>{(s.name || '?')[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{s.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{s.email}</div>
                    </div>
                  </div>
                  <p style={{ marginTop: '0.75rem', color: '#6b7280', fontSize: '0.9rem' }}>{s.phone || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <h2 style={{
              margin: '0 0 clamp(1.5rem, 2vw, 2rem) 0',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Mark Attendance for Live Classes
            </h2>

            {upcomingClasses.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)' }}>No upcoming live classes</div>
            ) : (
              <div style={{ display: 'grid', gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                {upcomingClasses.map(lc => (
                  <div key={lc._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f3f4f6',
                    padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    gap: 'clamp(0.5rem, 1vw, 1rem)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 1.8vw, 1rem)' }}>{lc.title}</div>
                      <div style={{ color: '#6b7280', fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)' }}>
                        {lc.courseName} • {new Date(lc.scheduledAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        setSelectedLiveClass(lc);
                        try {
                          const r = await courseAPI.getCourseEnrollments(lc.course);
                          setLiveClassEnrollments(r.data || []);
                          const state = {};
                          (r.data || []).forEach(e => { state[e.student._id] = 'present' });
                          setLiveClassAttendanceState(state);
                          setShowLiveClassAttendanceModal(true);
                        } catch (err) {
                          showMessage('error', 'Failed to load enrollments');
                        }
                      }}
                      style={{
                        padding: 'clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 1.5vw, 1rem)',
                        background: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
                        minHeight: '36px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Mark Attendance
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Class Attendance Modal */}
      {showLiveClassAttendanceModal && selectedLiveClass && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.2)',
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
              Mark Attendance — {selectedLiveClass.title}
            </h3>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
              {selectedLiveClass.courseName} • {new Date(selectedLiveClass.scheduledAt).toLocaleString()}
            </div>

            {liveClassEnrollments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No enrolled students</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {liveClassEnrollments.map(e => (
                  <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9f9f9', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{e.student.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{e.student.email}</div>
                    </div>
                    <select
                      value={liveClassAttendanceState[e.student._id] || 'present'}
                      onChange={(ev) => setLiveClassAttendanceState({ ...liveClassAttendanceState, [e.student._id]: ev.target.value })}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLiveClassAttendanceModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const attendance = Object.keys(liveClassAttendanceState).map(studentId => ({
                    studentId,
                    status: liveClassAttendanceState[studentId],
                  }));
                  try {
                    await courseAPI.markLiveClassAttendance(selectedLiveClass._id, attendance);
                    showMessage('success', 'Attendance marked successfully');
                    setShowLiveClassAttendanceModal(false);
                    setSelectedLiveClass(null);
                  } catch (err) {
                    showMessage('error', 'Failed to mark attendance');
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showAddCourseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: 'clamp(0.5rem, 2vw, 1rem)',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            maxWidth: 'clamp(280px, 90vw, 500px)',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{
              margin: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>

            <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  Description *
                </label>
                <textarea
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Category *
                  </label>
                  <select
                    required
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option>Web Development</option>
                    <option>Server Security</option>
                    <option>Data Science</option>
                    <option>Mobile Development</option>
                    <option>Cloud Computing</option>
                    <option>AI/ML</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Level *
                  </label>
                  <select
                    required
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Max Students *
                  </label>
                  <input
                    type="number"
                    required
                    value={courseForm.maxStudents}
                    onChange={(e) => setCourseForm({ ...courseForm, maxStudents: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={courseForm.startDate}
                  onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={courseForm.endDate}
                  onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                gap: 'clamp(0.75rem, 1.5vw, 1rem)',
                marginBottom: 'clamp(1.5rem, 2vw, 2rem)',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                  }}>
                    Schedule Days *
                  </label>
                  <div style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                    background: '#f9fafb',
                  }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <label key={day} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                      }}>
                        <input
                          type="checkbox"
                          checked={courseForm.scheduleDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCourseForm({ ...courseForm, scheduleDays: [...courseForm.scheduleDays, day] });
                            } else {
                              setCourseForm({ ...courseForm, scheduleDays: courseForm.scheduleDays.filter(d => d !== day) });
                            }
                          }}
                          style={{
                            marginRight: '0.5rem',
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  {courseForm.scheduleDays.length === 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      Select at least one day
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                  }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={courseForm.scheduleStartTime}
                    onChange={(e) => setCourseForm({ ...courseForm, scheduleStartTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                      boxSizing: 'border-box',
                      minHeight: '40px',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                  }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={courseForm.scheduleEndTime}
                    onChange={(e) => setCourseForm({ ...courseForm, scheduleEndTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                      boxSizing: 'border-box',
                      minHeight: '40px',
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 'clamp(0.75rem, 1.5vw, 1rem)',
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '40px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCourseModal(false);
                    resetCourseForm();
                  }}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '40px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && selectedCourseForAssignment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Add Assignment
            </h2>
            <p style={{
              margin: '0 0 1.5rem 0',
              color: '#6b7280',
            }}>
              📚 {selectedCourseForAssignment.title}
            </p>

            <form onSubmit={handleAddAssignment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                }}>
                  Description *
                </label>
                <textarea
                  required
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Total Points *
                  </label>
                  <input
                    type="number"
                    required
                    value={assignmentForm.totalPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, totalPoints: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  Add Assignment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAssignmentModal(false);
                    setSelectedCourseForAssignment(null);
                    setAssignmentForm({ title: '', description: '', dueDate: '', totalPoints: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showAttendanceModal && selectedCourseForAttendance && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: 'clamp(0.5rem, 2vw, 1rem)',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            maxWidth: 'clamp(280px, 90vw, 500px)',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{
              margin: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Mark Attendance
            </h2>
            <p style={{
              margin: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
              color: '#6b7280',
              fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
            }}>
              👥 {selectedCourseForAttendance.title}
            </p>

            <form onSubmit={handleMarkAttendance}>
              <div style={{ marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                  }}>
                    Student *
                  </label>
                  <select
                    required
                    value={attendanceForm.studentId}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                      boxSizing: 'border-box',
                      minHeight: '40px',
                    }}
                  >
                    <option value="">Select student...</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} — {s.email}</option>
                    ))}
                  </select>
              </div>

              <div style={{ marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                    boxSizing: 'border-box',
                    minHeight: '40px',
                  }}
                />
              </div>

              <div style={{ marginBottom: 'clamp(1.5rem, 2vw, 2rem)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                }}>
                  Status *
                </label>
                <select
                  required
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                    minHeight: '40px',
                  }}
                >
                  <option value="present">✓ Present</option>
                  <option value="absent">✗ Absent</option>
                  <option value="late">⏰ Late</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                gap: 'clamp(0.75rem, 1.5vw, 1rem)',
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '40px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  Mark Attendance
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttendanceModal(false);
                    setSelectedCourseForAttendance(null);
                    setAttendanceForm({ studentId: '', date: '', status: 'present' });
                  }}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minHeight: '40px',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Live Class Modal */}
      {showScheduleLiveModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937' }}>
              Schedule Live Class
            </h2>

            <form onSubmit={handleScheduleLiveClass} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Course *
                </label>
                <select
                  value={selectedCourseForClass?._id || ''}
                  onChange={(e) => {
                    const course = courses.find(c => c._id === e.target.value);
                    setSelectedCourseForClass(course);
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Class Title *
                </label>
                <input
                  type="text"
                  value={liveForm.title}
                  onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })}
                  placeholder="e.g., Strategy Session 1"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Description
                </label>
                <textarea
                  value={liveForm.description}
                  onChange={(e) => setLiveForm({ ...liveForm, description: e.target.value })}
                  placeholder="Brief description of the class"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={liveForm.scheduledAt}
                  onChange={(e) => setLiveForm({ ...liveForm, scheduledAt: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={liveForm.durationMinutes}
                  onChange={(e) => setLiveForm({ ...liveForm, durationMinutes: parseInt(e.target.value) })}
                  placeholder="60"
                  min="15"
                  max="480"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Zoom Meeting Link *
                </label>
                <input
                  type="url"
                  value={liveForm.meetingUrl}
                  onChange={(e) => setLiveForm({ ...liveForm, meetingUrl: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Schedule Class
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleLiveModal(false);
                    setLiveForm({ title: '', description: '', scheduledAt: '', durationMinutes: 60, meetingUrl: '' });
                  }}
                  style={{
                    padding: '0.8rem',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
