import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample blog data for demonstration
  const sampleBlogs = {
    'digital-transformation-future': {
      title: 'The Future of Digital Transformation',
      author: { name: 'Sarah Johnson' },
      category: 'Digital Strategy',
      createdAt: '2024-01-20',
      featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      excerpt: 'Explore how digital transformation is reshaping industries and what businesses need to know to stay competitive.',
      content: `
        <h2>Understanding Digital Transformation</h2>
        <p>Digital transformation is no longer a luxury—it's a necessity for businesses that want to remain competitive in today's rapidly evolving marketplace. Organizations across all industries are embracing digital technologies to streamline operations, enhance customer experiences, and drive innovation.</p>

        <h3>Key Drivers of Digital Transformation</h3>
        <p>Several factors are pushing businesses toward digital transformation:</p>
        <ul>
          <li><strong>Customer Expectations:</strong> Modern consumers expect seamless digital experiences across all touchpoints.</li>
          <li><strong>Competitive Pressure:</strong> Companies that don't digitize risk falling behind more agile competitors.</li>
          <li><strong>Operational Efficiency:</strong> Digital tools can significantly reduce costs and improve productivity.</li>
          <li><strong>Data-Driven Insights:</strong> Digital systems generate valuable data that can inform strategic decisions.</li>
        </ul>

        <h3>Strategies for Successful Implementation</h3>
        <p>Successful digital transformation requires more than just investing in technology. It demands a comprehensive approach that includes:</p>
        <ul>
          <li>Clear vision and leadership commitment</li>
          <li>Change management and employee training</li>
          <li>Phased implementation approach</li>
          <li>Regular assessment and optimization</li>
          <li>Investment in cybersecurity and data protection</li>
        </ul>

        <h3>The Road Ahead</h3>
        <p>As we look to the future, emerging technologies like artificial intelligence, blockchain, and the Internet of Things will continue to reshape the business landscape. Organizations that embrace these technologies while maintaining a focus on customer value will be best positioned for success.</p>

        <p>Digital transformation is not a destination but a continuous journey. The most successful organizations are those that view it as an ongoing process of evolution and improvement, always seeking new ways to leverage technology to create value for their customers and stakeholders.</p>
      `,
      color: '#0066cc',
    },
    'strategic-planning-growth': {
      title: 'Strategic Planning for Growth',
      author: { name: 'Michael Chen' },
      category: 'Strategy',
      createdAt: '2024-01-18',
      featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      excerpt: 'Learn essential strategies for planning and executing sustainable business growth in competitive markets.',
      content: `
        <h2>Strategic Planning for Sustainable Growth</h2>
        <p>Strategic planning is the foundation for sustainable business growth. It provides direction, aligns stakeholders, and creates a roadmap for achieving organizational objectives. In this article, we'll explore the key elements of effective strategic planning.</p>

        <h3>The Strategic Planning Process</h3>
        <p>Effective strategic planning involves several critical steps:</p>
        <ul>
          <li><strong>Assess Current Position:</strong> Conduct a thorough SWOT analysis to understand your strengths, weaknesses, opportunities, and threats.</li>
          <li><strong>Define Vision and Mission:</strong> Clearly articulate what your organization aims to achieve and why.</li>
          <li><strong>Set Strategic Objectives:</strong> Establish specific, measurable, achievable, relevant, and time-bound goals.</li>
          <li><strong>Develop Action Plans:</strong> Create detailed plans for achieving each strategic objective.</li>
          <li><strong>Monitor and Adjust:</strong> Continuously track progress and adjust strategies as needed.</li>
        </ul>

        <h3>Growth Strategies</h3>
        <p>There are several strategies for achieving growth:</p>
        <p><strong>Market Penetration:</strong> Increase market share in existing markets through improved marketing, pricing, or product positioning.</p>
        <p><strong>Market Development:</strong> Enter new markets or customer segments with existing products or services.</p>
        <p><strong>Product Development:</strong> Create new products or services to serve existing markets.</p>
        <p><strong>Diversification:</strong> Enter new markets with new products, either related to existing offerings or completely different.</p>

        <h3>Overcoming Growth Challenges</h3>
        <p>Growth comes with challenges. Organizations must be prepared to address:</p>
        <ul>
          <li>Resource constraints and capital requirements</li>
          <li>Organizational capability gaps</li>
          <li>Market competition and changing customer preferences</li>
          <li>Execution risk and implementation complexity</li>
        </ul>

        <p>Successful growth is achieved through careful planning, disciplined execution, and continuous learning. Organizations that invest in strategic planning are better equipped to navigate uncertainty and capitalize on opportunities.</p>
      `,
      color: '#00b4d8',
    },
    'change-management-best-practices': {
      title: 'Change Management Best Practices',
      author: { name: 'Emma Williams' },
      category: 'Management',
      createdAt: '2024-01-15',
      featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      excerpt: 'Discover proven methodologies for managing organizational change and ensuring successful implementation.',
      content: `
        <h2>Managing Organizational Change Effectively</h2>
        <p>Change is inevitable in modern organizations. Whether driven by market conditions, technology adoption, or strategic initiatives, successful change management is critical for organizational success. This article explores best practices for managing change effectively.</p>

        <h3>The Change Management Framework</h3>
        <p>Effective change management follows a structured approach:</p>
        <ul>
          <li><strong>Assess Readiness:</strong> Evaluate the organization's readiness for change and identify potential resistance.</li>
          <li><strong>Develop Strategy:</strong> Create a comprehensive change management strategy aligned with the change initiative.</li>
          <li><strong>Build Awareness:</strong> Communicate the rationale for change and its expected benefits.</li>
          <li><strong>Develop Capability:</strong> Provide training and support to help people adapt to the change.</li>
          <li><strong>Implement Change:</strong> Execute the change according to the planned approach.</li>
          <li><strong>Sustain Change:</strong> Reinforce new behaviors and address emerging issues.</li>
        </ul>

        <h3>Key Success Factors</h3>
        <p>Several factors contribute to successful change management:</p>
        <ul>
          <li><strong>Leadership Commitment:</strong> Visible and consistent support from organizational leaders</li>
          <li><strong>Clear Communication:</strong> Transparent, frequent, and timely communication with all stakeholders</li>
          <li><strong>Employee Engagement:</strong> Involving employees in the change process and valuing their input</li>
          <li><strong>Adequate Resources:</strong> Providing necessary budget, tools, and expertise</li>
          <li><strong>Resistance Management:</strong> Addressing concerns and working with resistors to overcome barriers</li>
        </ul>

        <h3>Common Pitfalls to Avoid</h3>
        <p>Organizations often struggle with change due to preventable mistakes:</p>
        <ul>
          <li>Underestimating the complexity and time required for change</li>
          <li>Failing to communicate the vision and rationale effectively</li>
          <li>Not addressing employee concerns and resistance</li>
          <li>Lacking clear accountability for change outcomes</li>
          <li>Premature declaration of success without sustained reinforcement</li>
        </ul>

        <p>Successful change management requires a disciplined approach, strong leadership, and genuine engagement with employees. Organizations that master change management are better positioned for continuous improvement and competitive advantage.</p>
      `,
      color: '#0096c7',
    },
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const response = await blogAPI.getBlogBySlug(slug);
          setBlog(response.data);
        } catch (apiError) {
          // Fall back to sample data
          if (sampleBlogs[slug]) {
            setBlog(sampleBlogs[slug]);
          } else {
            setError('Blog post not found');
          }
        }
      } catch (err) {
        setError('Error loading blog post');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0066cc', marginBottom: '1rem' }}>Post Not Found</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link
            to="/blog"
            style={{
              display: 'inline-block',
              background: '#0066cc',
              color: 'white',
              padding: '0.9rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url("${blog.featuredImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          padding: '6rem 0',
          textAlign: 'center',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <span
              style={{
                background: blog.color || '#0066cc',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              {blog.category}
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            {blog.title}
          </h1>
          <div style={{ fontSize: '1.1rem', opacity: '0.95' }}>
            By <strong>{blog.author?.name || 'Admin'}</strong> • {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Featured Image */}
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '3rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Blog Content */}
            <div
              style={{
                fontSize: '1.05rem',
                lineHeight: '1.85',
                color: '#333',
              }}
              dangerouslySetInnerHTML={{
                __html: blog.content || blog.excerpt,
              }}
            />

            {/* Divider */}
            <div style={{ borderTop: '2px solid #eee', margin: '3rem 0', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#0066cc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  {(blog.author?.name || 'A')[0]}
                </div>
                <div>
                  <h4 style={{ color: '#0066cc', marginBottom: '0.25rem', fontSize: '1.2rem' }}>
                    {blog.author?.name || 'Admin'}
                  </h4>
                  <p style={{ color: '#666', margin: '0', fontSize: '0.95rem' }}>
                    Expert consultant and thought leader in business strategy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles / CTA Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '2.5rem' }}>Continue Reading</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Explore more insights from our blog</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: 'The Future of Digital Transformation',
                category: 'Digital Strategy',
                slug: 'digital-transformation-future',
                icon: '💻',
              },
              {
                title: 'Strategic Planning for Growth',
                category: 'Strategy',
                slug: 'strategic-planning-growth',
                icon: '📈',
              },
              {
                title: 'Change Management Best Practices',
                category: 'Management',
                slug: 'change-management-best-practices',
                icon: '🔄',
              },
            ]
              .filter((item) => item.slug !== slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  to={`/blog/${item.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '2rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                    <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.category}</p>
                    <span style={{ color: '#0066cc', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-block',
                background: 'white',
                border: '2px solid #0066cc',
                color: '#0066cc',
                padding: '0.9rem 2rem',
                borderRadius: '6px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0066cc';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#0066cc';
              }}
            >
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
