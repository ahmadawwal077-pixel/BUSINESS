import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const StudentPreviousGrades = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await courseAPI.getMySubmissions();
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
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
        <div style={{ fontSize: '1.5rem', color: '#0066cc' }}>Loading previous grades...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '2rem',
        }}>
          📊 Previous Grades & Assignments
        </h1>

        {submissions.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              You haven't submitted any assignments yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {submissions.map(sub => (
              <div
                key={sub._id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderLeft: `4px solid ${sub.grading?.status === 'graded' ? '#10b981' : '#f59e0b'}`,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {sub.assignment?.title || 'Assignment'}
                    </h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                      📚 {sub.course?.title || 'Course'}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      📅 Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    textAlign: 'right',
                  }}>
                    {sub.grading?.status === 'graded' ? (
                      <div>
                        <div style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          color: '#10b981',
                        }}>
                          {sub.grading.score}/{sub.grading.maxScore}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#666',
                        }}>
                          {sub.grading.percentage}%
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: '#fef3c7',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        color: '#92400e',
                        fontWeight: '600',
                      }}>
                        Pending
                      </div>
                    )}
                  </div>
                </div>

                {sub.isLate && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#fee2e2',
                    borderRadius: '6px',
                    color: '#991b1b',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}>
                    ⚠️ Late Submission
                  </div>
                )}

                {sub.grading?.comment && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f3f4f6',
                    borderRadius: '6px',
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: '600', color: '#1f2937' }}>
                      Instructor Feedback:
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      {sub.grading.comment}
                    </p>
                  </div>
                )}

                {sub.submission?.text && (
                  <details style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}>
                    <summary style={{ fontWeight: '600', color: '#1f2937' }}>
                      View Your Submission
                    </summary>
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'white',
                      borderRadius: '4px',
                      borderLeft: '4px solid #ddd',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: '#666',
                    }}>
                      {sub.submission.text}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPreviousGrades;
