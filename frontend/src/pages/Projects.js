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
          padding: 'clamp(3rem, 8vw, 8rem) 0',
          textAlign: 'center',
          minHeight: 'clamp(400px, 60vh, 600px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Our Projects
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 2rem)', fontWeight: '300', lineHeight: '1.6' }}>
            Success stories from our consulting engagements
          </p>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', opacity: '0.95', lineHeight: '1.6' }}>
            Delivering measurable impact across industries and markets
          </p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)', maxWidth: '700px', margin: '0 auto clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Case Studies & Success Stories</h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: '#666', lineHeight: '1.8' }}>Real-world examples of our consulting impact</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {projects.map((project, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
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
                <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', color: project.color }}>
                  {React.createElement(project.icon, { size: 56, weight: 'bold' })}
                </div>
                <h3 style={{ color: project.color, marginBottom: '0.5rem', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 'bold' }}>
                  {project.title}
                </h3>
                <p style={{ color: '#0066cc', fontWeight: '600', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)' }}>
                  {project.client}
                </p>
                <p style={{ color: '#666', lineHeight: '1.8', marginBottom: 'clamp(1rem, 2vw, 1.5rem)', flex: '1', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                  {project.description}
                </p>
                <div
                  style={{
                    background: '#f0f4ff',
                    borderLeft: `4px solid ${project.color}`,
                    padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
                  }}
                >
                  <CheckCircle size={20} weight="fill" color={project.color} />
                  <p style={{ color: project.color, fontWeight: 'bold', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', margin: '0' }}>
                    {project.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ backgroundColor: 'white', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)', maxWidth: '700px', margin: '0 auto clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Our Project Impact</h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: '#666', lineHeight: '1.8' }}>
              Our projects consistently deliver exceptional results, improving client operations, profitability, and competitive positioning
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'clamp(1.5rem, 2.5vw, 2rem)', marginTop: 'clamp(2rem, 3vw, 3rem)' }}>
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
                  padding: 'clamp(1.25rem, 2.5vw, 2rem)',
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
                <div style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>{metric.icon}</div>
                <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 'bold', color: '#0066cc', marginBottom: '0.5rem' }}>
                  {metric.number}
                </div>
                <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', margin: '0', lineHeight: '1.6' }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Projects Succeed Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Why Our Projects Succeed</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
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
                  padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  borderTop: '4px solid #0066cc',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 102, 204, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>{reason.icon}</div>
                <h4 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 'bold' }}>
                  {reason.title}
                </h4>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)' }}>
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
          padding: 'clamp(2.5rem, 6vw, 5rem) 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Ready to Achieve Your Goals?</h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', marginBottom: 'clamp(1.5rem, 2vw, 2rem)', opacity: '0.95', maxWidth: '600px', margin: '0 auto clamp(1.5rem, 2vw, 2rem)', lineHeight: '1.6' }}>
            Let's discuss how our proven approach can deliver measurable results for your organization
          </p>
          <div style={{ display: 'flex', gap: 'clamp(0.75rem, 1.5vw, 1rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#0066cc', fontWeight: 'bold', padding: 'clamp(0.75rem, 1.5vw, 0.9rem) clamp(1.5rem, 3vw, 2rem)', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', textDecoration: 'none', borderRadius: '8px', minHeight: '44px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.2)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              Start Your Project
            </Link>
            <Link to="/services" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderColor: 'white', color: 'white', fontWeight: 'bold', padding: 'clamp(0.75rem, 1.5vw, 0.9rem) clamp(1.5rem, 3vw, 2rem)', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', textDecoration: 'none', borderRadius: '8px', border: '2px solid white', minHeight: '44px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.transform = 'translateY(0)'; }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
