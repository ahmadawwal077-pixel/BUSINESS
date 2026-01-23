import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { blogAPI } from '../services/api';
import {
  Plus,
  Check,
  Warning,
  Lock,
} from 'phosphor-react';

const AdminBlog = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Strategy',
    author: '',
    slug: '',
    featuredImage: '',
    color: '#0066cc',
    icon: 'TrendUp',
  });

  const iconOptions = [
    { value: 'DesktopTower', label: 'Desktop Tower (Technology)' },
    { value: 'TrendUp', label: 'Trend Up (Growth)' },
    { value: 'ArrowClockwise', label: 'Arrow Clockwise (Change)' },
    { value: 'MagnifyingGlass', label: 'Magnifying Glass (Research)' },
    { value: 'Users', label: 'Users (Team)' },
    { value: 'Gear', label: 'Gear (Operations)' },
  ];

  const categories = [
    'Digital Strategy',
    'Strategy',
    'Management',
    'Market Research',
    'Team Development',
    'Operations',
  ];

  const colorOptions = [
    { value: '#0066cc', label: 'Blue' },
    { value: '#00b4d8', label: 'Cyan' },
    { value: '#0096c7', label: 'Teal' },
    { value: '#0077b6', label: 'Dark Blue' },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      // Handle file upload
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          featuredImage: event.target.result, // Base64 encoded image
        }));
      };
      
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Auto-generate slug from title
      if (name === 'title') {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setFormData(prev => ({
          ...prev,
          slug: slug,
        }));
      }
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await blogAPI.deleteBlog(blogId);
      setMessage({ type: 'success', text: 'Blog post deleted successfully!' });
      // Remove from list
      setBlogs(blogs.filter(b => b._id !== blogId));
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting blog post. Please try again.' });
    }
  };

  // Load blogs on mount
  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await blogAPI.getAllBlogs(1, 100);
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error('Error loading blogs:', error);
      }
    };
    loadBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || !formData.author.trim()) {
        setMessage({ type: 'error', text: 'Please fill in all required fields: Title, Author, Excerpt, and Content' });
        setLoading(false);
        return;
      }

      // Check image size - Base64 images should not be too large
      if (formData.featuredImage && formData.featuredImage.startsWith('data:image')) {
        const sizeInMB = (formData.featuredImage.length * 3) / (4 * 1024 * 1024);
        if (sizeInMB > 5) {
          setMessage({ type: 'error', text: 'Image is too large. Please upload an image smaller than 5MB.' });
          setLoading(false);
          return;
        }
      }

      // Build blog data with image and author
      const imageData = formData.featuredImage || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop';
      
      const blogData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        author: formData.author.trim(),
        featuredImage: imageData,
        published: true,
      };

      console.log('Submitting blog data:', blogData);
      console.log('Author:', blogData.author);
      console.log('Image length:', blogData.featuredImage.length);
      
      const response = await blogAPI.createBlog(blogData);
      console.log('Blog created successfully:', response);
      console.log('Response blog data:', response.data.blog);
      
      setMessage({ 
        type: 'success', 
        text: 'Blog post created successfully! Redirecting...' 
      });

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Strategy',
        author: '',
        slug: '',
        featuredImage: '',
        color: '#0066cc',
        icon: 'TrendUp',
      });

      // Redirect to blog page after 2 seconds
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
    } catch (error) {
      console.error('Error creating blog:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Error creating blog post. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '4rem', paddingBottom: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#ef4444' }}>
              <Lock size={64} weight="bold" />
            </div>
            <h1 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '2rem' }}>Access Denied</h1>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Sorry, only administrators can create blog posts. If you believe this is an error, please contact the site administrator.
            </p>
            <button
              onClick={() => navigate('/blog')}
              style={{
                padding: '0.9rem 2rem',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
              onMouseEnter={(e) => e.target.style.background = '#0052a3'}
              onMouseLeave={(e) => e.target.style.background = '#0066cc'}
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
            <Plus size={32} weight="bold" style={{ display: 'inline-block', marginRight: '1rem', verticalAlign: 'middle' }} />
            Create New Blog Post
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Add a new article to share your insights with our audience</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div style={{
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: message.type === 'success' ? '#d1f4e0' : '#fee2e2',
            border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#059669' : '#dc2626',
          }}>
            {message.type === 'success' ? (
              <Check size={24} weight="bold" />
            ) : (
              <Warning size={24} weight="bold" />
            )}
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}>
            {/* Title */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                Blog Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog post title"
                required
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Author */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Two Column Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
            }}>
              {/* Category */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Icon */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                }}>
                  Icon *
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                }}>
                  Color *
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slug */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                URL Slug (auto-generated) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated-from-title"
                required
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  backgroundColor: '#f9fafb',
                  boxSizing: 'border-box',
                }}
                disabled
              />
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Auto-generated from title. Can be edited manually.
              </p>
            </div>

            {/* Featured Image */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                Featured Image (Upload)
              </label>
              <input
                type="file"
                name="featuredImage"
                onChange={handleChange}
                accept="image/*"
                placeholder="Select an image..."
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Recommended size: 400x250px. Supported formats: JPG, PNG, GIF, WebP
              </p>
              
              {/* Image Preview */}
              {formData.featuredImage && formData.featuredImage.startsWith('data:image') && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                    Image Preview:
                  </p>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                  }}>
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                Excerpt (Short Summary) *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Write a compelling 2-3 sentence summary..."
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Content */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}>
                Full Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the full blog post content here. You can use markdown or plain text."
                required
                rows="12"
                style={{
                  width: '100%',
                  padding: '0.95rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              paddingTop: '2rem',
              borderTop: '2px solid #e5e7eb',
            }}>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                style={{
                  padding: '0.9rem 2rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.9rem 2rem',
                  background: loading ? '#9ca3af' : '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.background = '#0052a3';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.background = '#0066cc';
                }}
              >
                <Plus size={20} weight="bold" />
                {loading ? 'Creating...' : 'Create Blog Post'}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Blog Posts Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ color: '#0066cc', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Your Blog Posts
          </h2>
          
          {blogs.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>No blog posts yet. Create your first post above!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {blogs.map(blog => (
                <div key={blog._id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                      {blog.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      {blog.excerpt}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#999' }}>
                      <span>{blog.category}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span style={{ color: blog.published ? '#10b981' : '#f59e0b' }}>
                        {blog.published ? '✓ Published' : '○ Draft'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                    <button
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#0052a3'}
                      onMouseLeave={(e) => e.target.style.background = '#0066cc'}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#ecf0ff',
          borderRadius: '12px',
          borderLeft: '4px solid #0066cc',
        }}>
          <h3 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '1.2rem' }}>Tips for Creating Great Blog Posts</h3>
          <ul style={{ color: '#555', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Use a clear, descriptive title that captures the main topic</li>
            <li>Write a concise excerpt (2-3 sentences) to entice readers</li>
            <li>Keep content well-structured with clear paragraphs</li>
            <li>Use relevant categories to help readers find your content</li>
            <li>Choose an icon and color that match your blog's theme</li>
            <li>The slug is auto-generated from the title but can be customized</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
