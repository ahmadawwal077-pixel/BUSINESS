import React, { useState, useEffect } from 'react';
import { assignmentAPI } from '../services/api';

const AssignmentPopup = ({ assignment, courseId, onClose, onSubmit }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseFiles, setResponseFiles] = useState([]);
  const [responseImages, setResponseImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudentSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment._id]);

  const fetchStudentSubmission = async () => {
    try {
      const res = await assignmentAPI.getMySubmission(assignment._id);
      setSubmission(res.data);
      if (res.data) {
        setResponseText(res.data.submission?.text || '');
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResponseFiles([...responseFiles, ...files]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setResponseImages([...responseImages, ...files]);
  };

  const removeFile = (index) => {
    setResponseFiles(responseFiles.filter((_, i) => i !== index));
  };

  const removeImage = (index) => {
    setResponseImages(responseImages.filter((_, i) => i !== index));
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim() && responseFiles.length === 0 && responseImages.length === 0) {
      setMessage({ type: 'error', text: 'Please provide some response content' });
      return;
    }

    setLoading(true);
    try {
      // Convert file objects to base64 for storage
      let filesWithBase64 = [];
      if (responseFiles && responseFiles.length > 0) {
        filesWithBase64 = await Promise.all(
          responseFiles.map((f) => {
            return new Promise((resolve, reject) => {
              if (f instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    fileName: f.name,
                    fileData: reader.result,
                    fileType: f.type,
                  });
                };
                reader.onerror = () => reject(new Error('File read error'));
                reader.readAsDataURL(f);
              } else {
                resolve({
                  fileName: f.name || 'file',
                  fileData: f.fileUrl || '',
                  fileType: f.type || 'application/octet-stream',
                });
              }
            });
          })
        );
      }

      // Convert image objects to base64 for storage
      let imagesWithBase64 = [];
      if (responseImages && responseImages.length > 0) {
        imagesWithBase64 = await Promise.all(
          responseImages.map((f) => {
            return new Promise((resolve, reject) => {
              if (f instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    imageData: reader.result,
                    caption: '',
                  });
                };
                reader.onerror = () => reject(new Error('Image read error'));
                reader.readAsDataURL(f);
              } else {
                resolve({
                  imageData: f.imageUrl || '',
                  caption: f.caption || '',
                });
              }
            });
          })
        );
      }

      const submissionData = {
        submission: {
          text: responseText,
          files: filesWithBase64,
          images: imagesWithBase64,
        },
      };

      await assignmentAPI.submitResponse(assignment._id, courseId, submissionData);
      setMessage({ type: 'success', text: 'Response submitted successfully!' });
      setResponseText('');
      setResponseFiles([]);
      setResponseImages([]);
      setShowResponseForm(false);
      fetchStudentSubmission();
      if (onSubmit) onSubmit();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit response' });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        width: '90%',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '1rem',
        }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>{assignment.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ✕
          </button>
        </div>

        {/* Assignment Details */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '600', color: '#666' }}>Description</label>
            <p style={{ color: '#333', lineHeight: '1.6' }}>{assignment.description}</p>
          </div>

          {assignment.content?.text && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: '#666' }}>Instructions</label>
              <div style={{ color: '#333', lineHeight: '1.6', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                {assignment.content.text}
              </div>
            </div>
          )}

          {assignment.content?.images && assignment.content.images.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: '#666' }}>Images</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {assignment.content.images.map((img, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <img
                      src={img.imageUrl}
                      alt={img.caption || 'Assignment image'}
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                    />
                    {img.caption && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{img.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignment.content?.files && assignment.content.files.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: '#666' }}>Files</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {assignment.content.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.fileUrl}
                    download
                    style={{
                      color: '#0066cc',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    📎 {file.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '2rem',
            backgroundColor: '#f0f4ff',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
          }}>
            <div>
              <span style={{ color: '#666', fontWeight: '600' }}>Due Date:</span>
              <p style={{ color: '#333', margin: '0.5rem 0 0 0' }}>
                {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <span style={{ color: '#666', fontWeight: '600' }}>Total Points:</span>
              <p style={{ color: '#333', margin: '0.5rem 0 0 0' }}>{assignment.totalPoints}</p>
            </div>
          </div>
        </div>

        {/* Student Submission Status */}
        {submission && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{ color: '#16a34a', margin: '0 0 1rem 0' }}>✓ Submitted</h3>
            <div style={{ color: '#333', fontSize: '0.95rem' }}>
              <p>Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              {submission.isLate && (
                <p style={{ color: '#dc2626' }}>⚠️ Submitted late</p>
              )}
              {submission.grading.status === 'graded' && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#666', margin: '0 0 0.5rem 0' }}>Grade</h4>
                  <div style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '6px',
                  }}>
                    <p style={{ margin: 0 }}>
                      <strong>Score:</strong> {submission.grading.score}/{submission.grading.maxScore} ({submission.grading.percentage.toFixed(1)}%)
                    </p>
                    {submission.grading.comment && (
                      <p style={{ margin: '0.5rem 0 0 0' }}>
                        <strong>Feedback:</strong> {submission.grading.comment}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Form */}
        {!showResponseForm ? (
          <button
            onClick={() => setShowResponseForm(true)}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = '#0052a3'}
            onMouseLeave={(e) => e.target.style.background = '#0066cc'}
          >
            {submission ? 'Edit Response' : 'Submit Response'}
          </button>
        ) : (
          <form onSubmit={handleSubmitResponse} style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Your Response</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Text Response
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response here..."
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
              {responseFiles.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  {responseFiles.map((file, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>📎 {file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
              {responseImages.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {responseImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx}`}
                        style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
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
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message.text && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: message.type === 'success' ? '#065f46' : '#991b1b',
              }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#ccc' : '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResponseForm(false);
                  setMessage({ type: '', text: '' });
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignmentPopup;
