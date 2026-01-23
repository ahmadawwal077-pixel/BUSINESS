import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { courseAPI } from '../services/api';

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
    scheduleDays: '',
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

  const [message, setMessage] = useState({ type: '', text: '' });

  // Assignment marking state
  const [assignmentsForCourse, setAssignmentsForCourse] = useState([]);
  const [showMarkAssignmentModal, setShowMarkAssignmentModal] = useState(false);
  const [markForm, setMarkForm] = useState({ assignmentId: '', studentId: '', marks: '' });
  const [showScheduleLiveModal, setShowScheduleLiveModal] = useState(false);
  const [liveForm, setLiveForm] = useState({ title: '', description: '', scheduledAt: '', durationMinutes: 60, meetingUrl: '' });

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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    if (!user?.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate, fetchCourses, fetchStudents]);

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
          days: courseForm.scheduleDays ? courseForm.scheduleDays.split(',').map(d => d.trim()) : ['Monday', 'Wednesday'],
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
          days: courseForm.scheduleDays ? courseForm.scheduleDays.split(',').map(d => d.trim()) : ['Monday', 'Wednesday'],
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
        await courseAPI.deleteCourse(courseId);
        showMessage('success', 'Course deleted successfully!');
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
      scheduleDays: course.schedule?.days?.join(', ') || 'Monday, Wednesday',
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
      scheduleDays: '',
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
        padding: '2rem',
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
          gap: '1rem',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: 'bold',
            }}>
              🛠️ Admin Dashboard
            </h1>
            <p style={{
              margin: '0.5rem 0 0 0',
              opacity: 0.95,
              fontSize: '0.95rem',
            }}>
              Welcome, {user?.name || 'Admin'}
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
          margin: '1rem auto',
          padding: '1rem',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '10px',
          border: `2px solid ${message.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
        }}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          flexWrap: 'wrap',
        }}>
          {['courses', 'assignments', 'attendance', 'students'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 1.5rem',
                background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' : 'white',
                color: activeTab === tab ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '10px 10px 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '-2px',
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
              {tab === 'attendance' && '✓ Attendance'}
              {tab === 'students' && '👥 Students'}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
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
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
              <p style={{ color: '#6b7280', textAlign: 'center' }}>No courses yet. Create your first course!</p>
            ) : (
              <div style={{
                overflowX: 'auto',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                }}>
                  <thead>
                    <tr style={{
                      background: '#f3f4f6',
                      borderBottom: '2px solid #e5e7eb',
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Course Title</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Category</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Level</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Price</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Students</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Actions</th>
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
                        <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '600' }}>{course.title}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{course.category}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: course.level === 'Beginner' ? '#d1fae5' : course.level === 'Intermediate' ? '#fef3c7' : '#fee2e2',
                            color: course.level === 'Beginner' ? '#065f46' : course.level === 'Intermediate' ? '#92400e' : '#991b1b',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}>
                            {course.level}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '600' }}>₦{course.price?.toLocaleString()}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{course.enrolledStudents}/{course.maxStudents}</td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => handleEditCourse(course)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              background: '#dbeafe',
                              color: '#1e40af',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              marginRight: '0.5rem',
                              transition: 'all 0.2s ease',
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
                              padding: '0.4rem 0.8rem',
                              background: '#fee2e2',
                              color: '#991b1b',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
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
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'
          }}>
            <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', maxWidth: '520px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Mark Assignment</h2>
              <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>Course: {selectedCourseForAssignment.title}</p>

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
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Assignment *</label>
                  <select required value={markForm.assignmentId} onChange={(e) => setMarkForm({ ...markForm, assignmentId: e.target.value })} style={{ width: '100%', padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Select assignment...</option>
                    {assignmentsForCourse.map(a => (<option key={a._id} value={a._id}>{a.title} — due {a.dueDate?.split('T')[0]}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Student *</label>
                  <select required value={markForm.studentId} onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })} style={{ width: '100%', padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Select student...</option>
                    {students.map(s => (<option key={s._id} value={s._id}>{s.name} — {s.email}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Marks *</label>
                  <input required type="number" min="0" step="0.1" value={markForm.marks} onChange={(e) => setMarkForm({ ...markForm, marks: e.target.value })} style={{ width: '100%', padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.8rem', background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}>Save</button>
                  <button type="button" onClick={() => { setShowMarkAssignmentModal(false); setMarkForm({ assignmentId: '', studentId: '', marks: '' }); }} style={{ flex: 1, padding: '0.8rem', background: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', fontWeight: '600' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Live Class Modal */}
        {showScheduleLiveModal && selectedCourseForAssignment && (
          <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 }}>
            <div style={{ background:'white', borderRadius:15, padding:'2rem', maxWidth:520, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
              <h2 style={{ margin:'0 0 1rem 0', fontSize:'1.5rem', fontWeight:'bold', color:'#1f2937' }}>Schedule Live Class</h2>
              <p style={{ color:'#6b7280', marginBottom:'1rem' }}>{selectedCourseForAssignment.title}</p>
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
                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600 }}>Title *</label>
                  <input required value={liveForm.title} onChange={(e)=>setLiveForm({...liveForm, title:e.target.value})} style={{ width:'100%', padding:'0.8rem', border:'2px solid #e5e7eb', borderRadius:8 }} />
                </div>
                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600 }}>Scheduled At *</label>
                  <input required type='datetime-local' value={liveForm.scheduledAt} onChange={(e)=>setLiveForm({...liveForm, scheduledAt:e.target.value})} style={{ width:'100%', padding:'0.8rem', border:'2px solid #e5e7eb', borderRadius:8 }} />
                </div>
                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600 }}>Duration (minutes)</label>
                  <input type='number' min='10' value={liveForm.durationMinutes} onChange={(e)=>setLiveForm({...liveForm, durationMinutes:parseInt(e.target.value)})} style={{ width:'100%', padding:'0.8rem', border:'2px solid #e5e7eb', borderRadius:8 }} />
                </div>
                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', marginBottom:6, fontWeight:600 }}>Meeting URL (optional)</label>
                  <input value={liveForm.meetingUrl} onChange={(e)=>setLiveForm({...liveForm, meetingUrl:e.target.value})} placeholder='Zoom/Meet link' style={{ width:'100%', padding:'0.8rem', border:'2px solid #e5e7eb', borderRadius:8 }} />
                </div>
                <div style={{ display:'flex', gap:'1rem' }}>
                  <button type='submit' style={{ flex:1, padding:'0.8rem', background:'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)', color:'white', border:'none', borderRadius:8, fontWeight:600 }}>Schedule</button>
                  <button type='button' onClick={()=>setShowScheduleLiveModal(false)} style={{ flex:1, padding:'0.8rem', background:'#e5e7eb', color:'#1f2937', border:'none', borderRadius:8, fontWeight:600 }}>Cancel</button>
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
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <h2 style={{
              margin: '0 0 2rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Manage Assignments
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}>
              {courses.map((course) => (
                <div key={course._id} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <h3 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}>
                    {course.title}
                  </h3>
                  <p style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                  }}>
                    📚 {course.category} • {course.enrolledStudents} students
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCourseForAssignment(course);
                      setShowAddAssignmentModal(true);
                    }}
                    style={{
                      width: '100%',
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
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.opacity = '1';
                    }}
                  >
                    + Add Assignment
                  </button>
                  <button
                    onClick={async () => {
                      setSelectedCourseForAssignment(course);
                      await fetchAssignments(course._id);
                      setShowMarkAssignmentModal(true);
                    }}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.7rem',
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📝 Mark Assignment
                  </button>
                  <button
                    onClick={async () => {
                      setSelectedCourseForAssignment(course);
                      // open schedule live class modal
                      setShowScheduleLiveModal(true);
                    }}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.7rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🎥 Schedule Live Class
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <h2 style={{
              margin: '0 0 2rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Manage Attendance
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}>
              {courses.map((course) => (
                <div key={course._id} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <h3 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}>
                    {course.title}
                  </h3>
                  <p style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                  }}>
                    👥 {course.enrolledStudents} students enrolled
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCourseForAttendance(course);
                      setShowAttendanceModal(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
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
                    ✓ Mark Attendance
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'students' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <h2 style={{
              margin: '0 0 2rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Student Profiles ({students.length})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}>
              {students.map((s) => (
                <div key={s._id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1rem',
                  background: 'linear-gradient(180deg, #ffffff 0%, #fbfbff 100%)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: 48,
                      height: 48,
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
      </div>

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
          padding: '1rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
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
                gridTemplateColumns: '1fr 1fr 1fr',
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
                    Schedule Days (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monday, Wednesday, Friday"
                    value={courseForm.scheduleDays}
                    onChange={(e) => setCourseForm({ ...courseForm, scheduleDays: e.target.value })}
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
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={courseForm.scheduleStartTime}
                    onChange={(e) => setCourseForm({ ...courseForm, scheduleStartTime: e.target.value })}
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
                    End Time
                  </label>
                  <input
                    type="time"
                    value={courseForm.scheduleEndTime}
                    onChange={(e) => setCourseForm({ ...courseForm, scheduleEndTime: e.target.value })}
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
                    padding: '0.8rem',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
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
              Mark Attendance
            </h2>
            <p style={{
              margin: '0 0 1.5rem 0',
              color: '#6b7280',
            }}>
              👥 {selectedCourseForAttendance.title}
            </p>

            <form onSubmit={handleMarkAttendance}>
              <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}>
                    Student *
                  </label>
                  <select
                    required
                    value={attendanceForm.studentId}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select student...</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} — {s.email}</option>
                    ))}
                  </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
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
                  Status *
                </label>
                <select
                  required
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="present">✓ Present</option>
                  <option value="absent">✗ Absent</option>
                  <option value="late">⏰ Late</option>
                </select>
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
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
