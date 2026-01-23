import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBar,
  Rocket,
  MagnifyingGlass,
  Buildings,
  DesktopTower,
  Lightning,
  Globe,
  Users,
  CheckCircle,
  Target,
  TrendUp,
  Handshake,
  Sparkle,
  Phone,
} from 'phosphor-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          padding: '8rem 0',
          textAlign: 'center',
          minHeight: '700px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Transform Your Business
          </h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '300' }}>
            Expert consulting solutions for sustainable growth
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', opacity: '0.95' }}>
            Partner with industry leaders to achieve measurable results and lasting success
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary" style={{ display: 'inline-block', background: 'white', color: '#0066cc', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
              Explore Services
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{ display: 'inline-block', borderColor: 'white', color: 'white', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>Our Services</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Comprehensive solutions tailored to your business needs</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {[
              {
                icon: ChartBar,
                title: 'Strategic Planning',
                description: 'Develop long-term strategies for sustainable growth',
                color: '#0066cc',
              },
              {
                icon: Rocket,
                title: 'Business Development',
                description: 'Expand your market presence and revenue streams',
                color: '#00b4d8',
              },
              {
                icon: MagnifyingGlass,
                title: 'Market Analysis',
                description: 'In-depth market research and competitive analysis',
                color: '#0096c7',
              },
              {
                icon: Buildings,
                title: 'Organizational Design',
                description: 'Optimize your organizational structure',
                color: '#0077b6',
              },
              {
                icon: DesktopTower,
                title: 'Digital Transformation',
                description: 'Modernize your business processes',
                color: '#00b4d8',
              },
              {
                icon: Lightning,
                title: 'Change Management',
                description: 'Guide your organization through transformation',
                color: '#0096c7',
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: `3px solid ${service.color}`,
                  cursor: 'pointer',
                  textAlign: 'center',
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
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', color: service.color }}>
                  <Icon size={48} weight="bold" />
                </div>
                <h3 style={{ color: service.color, marginBottom: '0.75rem', fontSize: '1.3rem' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {service.description}
                </p>
              </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-primary" style={{ display: 'inline-block' }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: '#0066cc', marginBottom: '1.5rem', fontSize: '2.2rem', fontWeight: 'bold' }}>About Our Company</h2>
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1rem', fontSize: '1rem' }}>
                PositiveHills is a leading management consulting firm with over 10 years of experience helping businesses transform and grow. Our team of expert consultants brings industry-leading knowledge and proven methodologies to every engagement.
              </p>
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1rem' }}>
                We partner with organizations across diverse industries—from startups to Fortune 500 companies—to unlock their potential and drive sustainable success. Our commitment to excellence and client success has earned us a 95% satisfaction rate.
              </p>
              <Link to="/about" style={{
                display: 'inline-block',
                padding: '0.85rem 1.8rem',
                background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                Learn More About Us
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop" 
                alt="About" 
                style={{ borderRadius: '12px', width: '100%', height: 'auto', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.2rem' }}>Featured Projects</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>See how we've helped businesses achieve their goals</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: 'Digital Transformation Initiative',
                company: 'TechCorp Solutions',
                result: '40% Efficiency Gain',
                icon: DesktopTower,
              },
              {
                title: 'Market Expansion Strategy',
                company: 'Global Retail Group',
                result: '3 New Markets',
                icon: Globe,
              },
              {
                title: 'Organizational Restructuring',
                company: 'Finance Plus Inc',
                result: '25% Cost Reduction',
                icon: Buildings,
              },
              {
                title: 'Change Management Program',
                company: 'Innovation Labs',
                result: '95% Employee Adoption',
                icon: Rocket,
              },
            ].map((project, idx) => {
              const ProjectIcon = project.icon;
              return (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  borderTop: '4px solid #0066cc',
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
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0066cc' }}>
                  <ProjectIcon size={40} weight="bold" />
                </div>
                <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  {project.title}
                </h4>
                <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {project.company}
                </p>
                <div style={{
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }}>
                  {project.result}
                </div>
              </div>
            );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/projects" style={{
              display: 'inline-block',
              padding: '0.85rem 1.8rem',
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.2rem' }}>Latest Insights</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Expert articles on business strategy and transformation</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: 'The Future of Digital Transformation',
                author: 'Sarah Johnson',
                date: 'Jan 20, 2024',
                excerpt: 'Explore how digital transformation is reshaping industries and what businesses need to know.',
                category: 'Strategy',
              },
              {
                title: 'Strategic Planning for Growth',
                author: 'Michael Chen',
                date: 'Jan 18, 2024',
                excerpt: 'Learn essential strategies for planning and executing sustainable business growth.',
                category: 'Planning',
              },
              {
                title: 'Change Management Best Practices',
                author: 'Emma Williams',
                date: 'Jan 15, 2024',
                excerpt: 'Discover proven methodologies for managing organizational change successfully.',
                category: 'Management',
              },
            ].map((article, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
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
                <div style={{
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  padding: '1rem',
                  color: 'white',
                }}>
                  <span style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: '600', opacity: 0.9 }}>
                    {article.category}
                  </span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: '#1f2937', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                    {article.title}
                  </h4>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {article.excerpt}
                  </p>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/blog" style={{
              display: 'inline-block',
              padding: '0.85rem 1.8rem',
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              Read All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem' }}>Why Choose PositiveHills?</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              We combine industry expertise with innovative solutions to deliver exceptional results
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: CheckCircle, title: '500+ Projects', text: 'Successfully delivered across multiple industries', color: '#10b981' },
              { icon: Users, title: '50+ Experts', text: 'Experienced consultants with proven track records', color: '#0066cc' },
              { icon: Target, title: 'Results Driven', text: 'Focus on measurable outcomes and ROI', color: '#f59e0b' },
              { icon: Sparkle, title: 'Fast Delivery', text: 'Quick turnaround without compromising quality', color: '#dc2626' },
              { icon: Handshake, title: 'Partnership', text: 'We work as an extension of your team', color: '#8b5cf6' },
              { icon: TrendUp, title: 'Proven Success', text: '95% client satisfaction and retention rate', color: '#06b6d4' },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
              <div
                key={idx}
                style={{
                  padding: '2rem',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${item.color}`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: item.color }}>
                  <ItemIcon size={40} weight="bold" />
                </div>
                <h4 style={{ color: item.color, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {item.text}
                </p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
          color: 'white',
          padding: '4rem 0',
          marginBottom: '4rem',
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            {[
              { number: '500+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Expertise' },
              { number: '15+', label: 'Industry Sectors' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {stat.number}
                </div>
                <p style={{ fontSize: '1.1rem', opacity: '0.95' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Contact Preview Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
          color: 'white',
          padding: '5rem 2rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', opacity: 0.95 }}>
            Get in touch with our expert consultants today
          </p>
          <p style={{ fontSize: '1rem', marginBottom: '3rem', opacity: 0.9 }}>
            We're here to help you achieve your business goals with tailored solutions
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/contact" style={{
              display: 'inline-block',
              padding: '0.95rem 2rem',
              background: 'white',
              color: '#0066cc',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              Contact Us
            </Link>
            <Link to="/make-appointment" style={{
              display: 'inline-block',
              padding: '0.95rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              border: '2px solid white',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}>
              Book Appointment
            </Link>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', opacity: 0.95, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={20} weight="bold" /> Call us: +1 (555) 123-4567
              </span>
              <span style={{ opacity: 0.7 }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MagnifyingGlass size={20} weight="bold" /> Email: hello@positivehills.com
              </span>
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
              Available Monday - Friday, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
