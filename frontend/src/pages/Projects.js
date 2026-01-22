import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Globe,
  DesktopTower,
  TrendUp,
  Users,
  Lightbulb,
  CheckCircle,
} from 'phosphor-react';

const Projects = () => {
  const projects = [
    {
      icon: Rocket,
      title: 'Tech Startup Growth',
      client: 'TechStart Inc.',
      description: 'Helped a tech startup scale from 50 to 500 employees through strategic planning and organizational design.',
      result: '300% growth in 2 years',
      color: '#0066cc',
    },
    {
      icon: Globe,
      title: 'Market Entry Strategy',
      client: 'Global Retail Corp',
      description: 'Developed and executed market entry strategy for a global retailer entering new geographic markets.',
      result: '5 new markets launched',
      color: '#00b4d8',
    },
    {
      icon: DesktopTower,
      title: 'Digital Transformation',
      client: 'Manufacturing Inc.',
      description: 'Led digital transformation initiative including ERP implementation and process redesign.',
      result: '40% efficiency improvement',
      color: '#0096c7',
    },
    {
      icon: Users,
      title: 'Organizational Restructuring',
      client: 'Financial Services Ltd.',
      description: 'Redesigned organizational structure to improve agility and reduce operational costs.',
      result: '25% cost reduction',
      color: '#0077b6',
    },
    {
      icon: Lightbulb,
      title: 'M&A Integration',
      client: 'Consumer Goods Corp',
      description: 'Managed integration of two major companies, ensuring seamless transition and synergy realization.',
      result: '$50M synergies identified',
      color: '#0066cc',
    },
    {
      icon: CheckCircle,
      title: 'Change Management',
      client: 'Healthcare Provider',
      description: 'Implemented comprehensive change management program for major system implementation.',
      result: '95% user adoption',
      color: '#00b4d8',
    },
  ];

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
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Our Projects
          </h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', fontWeight: '300' }}>
            Success stories from our consulting engagements
          </p>
          <p style={{ fontSize: '1.1rem', opacity: '0.95' }}>
            Delivering measurable impact across industries and markets
          </p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Case Studies & Success Stories</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Real-world examples of our consulting impact</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            {projects.map((project, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: `3px solid ${project.color}`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', color: project.color }}>
                  {React.createElement(project.icon, { size: 56, weight: 'bold' })}
                </div>
                <h3 style={{ color: project.color, marginBottom: '0.5rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                  {project.title}
                </h3>
                <p style={{ color: '#0066cc', fontWeight: '600', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  {project.client}
                </p>
                <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '1.5rem', flex: '1' }}>
                  {project.description}
                </p>
                <div
                  style={{
                    background: '#f0f4ff',
                    borderLeft: `4px solid ${project.color}`,
                    padding: '1rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle size={20} weight="fill" color={project.color} />
                  <p style={{ color: project.color, fontWeight: 'bold', fontSize: '1.1rem', margin: '0' }}>
                    {project.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '2.5rem' }}>Our Project Impact</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
              Our projects consistently deliver exceptional results, improving client operations, profitability, and competitive positioning
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {[
              { number: '6+', label: 'Case Studies', icon: '📁' },
              { number: '100M+', label: 'Value Created', icon: '💰' },
              { number: '1000+', label: 'People Impacted', icon: '👥' },
              { number: '99%', label: 'On-Time Delivery', icon: '⏱️' },
            ].map((metric, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '2px solid #e0e7ff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0066cc';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e7ff';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{metric.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066cc', marginBottom: '0.5rem' }}>
                  {metric.number}
                </div>
                <p style={{ color: '#666', fontSize: '1.05rem', margin: '0' }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Projects Succeed Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '2.5rem' }}>Why Our Projects Succeed</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🎯', title: 'Clear Objectives', description: 'Well-defined goals and success metrics from day one' },
              { icon: '👥', title: 'Expert Teams', description: 'Dedicated teams with industry-specific expertise' },
              { icon: '📊', title: 'Data-Driven Approach', description: 'Decisions backed by rigorous analysis and insights' },
              { icon: '🔄', title: 'Agile Execution', description: 'Flexible methodologies to adapt to changing needs' },
              { icon: '💬', title: 'Strong Communication', description: 'Transparent updates and stakeholder engagement' },
              { icon: '📈', title: 'Sustained Results', description: 'Focus on long-term value and lasting impact' },
            ].map((reason, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  borderTop: '4px solid #0066cc',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{reason.icon}</div>
                <h4 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                  {reason.title}
                </h4>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
          color: 'white',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Ready to Achieve Your Goals?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: '0.95', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Let's discuss how our proven approach can deliver measurable results for your organization
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-block', background: 'white', color: '#0066cc', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem', textDecoration: 'none', borderRadius: '6px' }}>
              Start Your Project
            </Link>
            <Link to="/services" className="btn btn-secondary" style={{ display: 'inline-block', borderColor: 'white', color: 'white', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem', textDecoration: 'none', borderRadius: '6px', border: '2px solid white' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
