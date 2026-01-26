import React, { useState, useEffect } from 'react';
import { assignmentAPI, courseAPI } from '../services/api';

const AssignmentManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    totalPoints: 100,
    content: { text: '', files: [], images: [] },
  });

  const [gradeData, setGradeData] = useState({
    score: '',
    comment: '',
    feedback: { text: '', files: [], images: [] },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment);
    }
  }, [selectedAssignment]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAllCourses({});
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const res = await assignmentAPI.getCourseAssignments(courseId);
      setAssignments(res.data);
      setSelectedAssignment(null);
      setSubmissions([]);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await assignmentAPI.getSubmissions(assignmentId);
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      showMessage('error', 'Please fill in all required fields (title, description, due date)');
      return;
    }
    
    if (!selectedCourse) {
      showMessage('error', 'Please select a course');
      return;
    }
    
    setLoading(true);
    try {
      // Convert datetime-local to ISO string for proper backend handling
      const dueDateISO = formData.dueDate ? new Date(formData.dueDate).toISOString() : null;
      
      // Convert file objects to base64 for storage (handle empty arrays gracefully)
      let filesWithBase64 = [];
      if (formData.content.files && formData.content.files.length > 0) {
        filesWithBase64 = await Promise.all(
          formData.content.files.map((f) => {
            return new Promise((resolve, reject) => {
              if (f && f.file && f.file instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    fileName: f.fileName || 'file',
                    fileData: reader.result,
                    fileType: f.fileType || 'application/octet-stream',
                  });
                };
                reader.onerror = () => reject(new Error('File read error'));
                reader.readAsDataURL(f.file);
              } else {
                resolve({
                  fileName: f?.fileName || 'file',
                  fileData: f?.fileUrl || '',
                  fileType: f?.fileType || 'application/octet-stream',
                });
              }
            });
          })
        );
      }

      // Convert image objects to base64 for storage (handle empty arrays gracefully)
      let imagesWithBase64 = [];
      if (formData.content.images && formData.content.images.length > 0) {
        imagesWithBase64 = await Promise.all(
          formData.content.images.map((img) => {
            return new Promise((resolve, reject) => {
              if (img && img.file && img.file instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    imageData: reader.result,
                    caption: img.caption || '',
                  });
                };
                reader.onerror = () => reject(new Error('Image read error'));
                reader.readAsDataURL(img.file);
              } else {
                resolve({
                  imageData: img?.imageUrl || '',
                  caption: img?.caption || '',
                });
              }
            });
          })
        );
      }
      
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructions: (formData.instructions || '').trim(),
        dueDate: dueDateISO,
        totalPoints: parseFloat(formData.totalPoints) || 100,
        courseId: selectedCourse,
        content: {
          text: formData.content.text || '',
          files: filesWithBase64 || [],
          images: imagesWithBase64 || [],
        },
      };
      
      console.log('Creating assignment:', { 
        title: data.title,
        courseId: data.courseId,
        dueDate: data.dueDate,
        filesCount: filesWithBase64.length,
        imagesCount: imagesWithBase64.length,
      });
      
      const response = await assignmentAPI.createAssignment(data);
      console.log('Assignment created:', response.data);
      showMessage('success', 'Assignment created successfully!');
      setFormData({
        title: '',
        description: '',
        instructions: '',
        dueDate: '',
        totalPoints: 100,
        content: { text: '', files: [], images: [] },
      });
      setShowCreateForm(false);
      fetchAssignments(selectedCourse);
    } catch (error) {
      console.error('Error creating assignment:', error);
      console.error('Error details:', error.response?.data);
      showMessage('error', error.response?.data?.message || 'Failed to create assignment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await assignmentAPI.gradeSubmission(showGradeForm, {
        score: parseFloat(gradeData.score),
        comment: gradeData.comment,
        feedback: gradeData.feedback,
      });
      showMessage('success', 'Submission graded successfully!');
      setShowGradeForm(null);
      setGradeData({ score: '', comment: '', feedback: { text: '', files: [], images: [] } });
      fetchSubmissions(selectedAssignment);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    try {
      await assignmentAPI.deleteAssignment(assignmentId);
      showMessage('success', 'Assignment deleted successfully!');
      if (selectedAssignment === assignmentId) {
        setSelectedAssignment(null);
        setSubmissions([]);
      }
      fetchAssignments(selectedCourse);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '2rem' }}>Assignment Management</h2>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
        }}>
          {message.text}
        </div>
      )}

      {/* Course Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.95rem',
          }}
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <>
          {/* Create Assignment Button */}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              marginBottom: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {showCreateForm ? 'Cancel' : '+ Create Assignment'}
          </button>

          {/* Create Assignment Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateAssignment} style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Create New Assignment</h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Assignment title"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Assignment description"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Instructions/Content
                </label>
                <textarea
                  value={formData.content.text}
                  onChange={(e) => setFormData({
                    ...formData,
                    content: { ...formData.content, text: e.target.value }
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Detailed instructions"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  📎 Attach Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        files: [
                          ...formData.content.files,
                          ...files.map(f => ({
                            fileName: f.name,
                            file: f, // Store the actual File object
                            fileUrl: URL.createObjectURL(f), // For preview only
                            fileType: f.type,
                          }))
                        ]
                      }
                    });
                  }}
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                {formData.content.files.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {formData.content.files.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>📎 {file.fileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                files: formData.content.files.filter((_, i) => i !== idx)
                              }
                            });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  🖼️ Attach Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        images: [
                          ...formData.content.images,
                          ...files.map(f => ({
                            file: f, // Store the actual File object
                            imageUrl: URL.createObjectURL(f), // For preview only
                            caption: '',
                          }))
                        ]
                      }
                    });
                  }}
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                {formData.content.images.length > 0 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {formData.content.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={img.imageUrl}
                          alt={`Preview ${idx}`}
                          style={{
                            maxWidth: '100px',
                            maxHeight: '100px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                images: formData.content.images.filter((_, i) => i !== idx)
                              }
                            });
                          }}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Total Points
                  </label>
                  <input
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({ ...formData, totalPoints: parseFloat(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                    }}
                    min="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: loading ? '#ccc' : '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
          )}

          {/* Assignments List */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Assignments</h3>
            {assignments.length === 0 ? (
              <p style={{ color: '#666' }}>No assignments yet</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    style={{
                      padding: '1rem',
                      border: selectedAssignment === assignment._id ? '2px solid #0066cc' : '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: selectedAssignment === assignment._id ? '#f0f4ff' : '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      onClick={() => setSelectedAssignment(assignment._id)}
                      style={{
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{assignment.title}</h4>
                      <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        Points: {assignment.totalPoints}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAssignment(assignment._id);
                      }}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        marginLeft: '1rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions List */}
          {selectedAssignment && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Student Submissions ({submissions.length})</h3>
              {submissions.length === 0 ? (
                <p style={{ color: '#666' }}>No submissions yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {submissions.map((submission) => (
                    <div
                      key={submission._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: submission.grading.status === 'graded' ? '#f0fdf4' : '#fef3c7',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: 0 }}>{submission.student.name}</h4>
                          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                          {submission.isLate && <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: 0 }}>Late</p>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {submission.grading.status === 'graded' ? (
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: '#16a34a' }}>
                                {submission.grading.score}/{submission.grading.maxScore}
                              </p>
                              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                                {submission.grading.percentage.toFixed(1)}%
                              </p>
                            </div>
                          ) : (
                            <p style={{ margin: 0, color: '#f59e0b', fontWeight: '600' }}>Pending</p>
                          )}
                        </div>
                      </div>

                      {submission.submission?.text && (
                        <p style={{ color: '#333', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          <strong>Response:</strong> {submission.submission.text.substring(0, 100)}...
                        </p>
                      )}

                      {submission.submission?.files && submission.submission.files.length > 0 && (
                        <div style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          <strong>📎 Files:</strong>
                          <div style={{ marginTop: '0.25rem' }}>
                            {submission.submission.files.map((file, idx) => (
                              <div key={idx} style={{ marginBottom: '0.25rem' }}>
                                <a
                                  href={file.fileUrl}
                                  download={file.fileName}
                                  style={{
                                    color: '#0066cc',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {file.fileName}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {submission.submission?.images && submission.submission.images.length > 0 && (
                        <div style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          <strong>🖼️ Images:</strong>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                            {submission.submission.images.map((img, idx) => (
                              <a
                                key={idx}
                                href={img.imageUrl}
                                download
                                style={{ textDecoration: 'none' }}
                              >
                                <img
                                  src={img.imageUrl}
                                  alt={`Submission ${idx}`}
                                  style={{
                                    maxWidth: '80px',
                                    maxHeight: '80px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    cursor: 'pointer',
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <button
                          onClick={() => {
                            setShowGradeForm(submission._id);
                            setGradeData({
                              score: submission.grading.score || '',
                              comment: submission.grading.comment || '',
                              feedback: submission.feedback || { text: '', files: [], images: [] },
                            });
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#0066cc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          {submission.grading.status === 'graded' ? 'Edit Grade' : 'Grade'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grade Form Modal */}
          {showGradeForm && (
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
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Grade Submission</h2>

                <form onSubmit={handleGradeSubmission}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Score *
                    </label>
                    <input
                      type="number"
                      required
                      value={gradeData.score}
                      onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="Enter score"
                      min="0"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Comment
                    </label>
                    <textarea
                      value={gradeData.comment}
                      onChange={(e) => setGradeData({ ...gradeData, comment: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        minHeight: '100px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="Add feedback comment"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: loading ? '#ccc' : '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Grade'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGradeForm(null)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#f3f4f6',
                        color: '#1f2937',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
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
        </>
      )}
    </div>
  );
};

export default AssignmentManager;
