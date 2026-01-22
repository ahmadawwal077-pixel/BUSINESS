import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Lightbulb,
  ChartBar,
  Handshake,
  Trophy,
  Users,
  Star,
  Factory,
  Smiley,
} from 'phosphor-react';

const About = () => {
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
            About ConsultPro
          </h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', fontWeight: '300' }}>
            Leading the way in business transformation and strategic consulting
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="section" style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Who We Are</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Dedicated to driving business excellence and sustainable growth</p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '1.5rem', textAlign: 'center' }}>
              ConsultPro is a leading management consulting firm dedicated to helping businesses achieve their strategic objectives. With over a decade of experience, we've worked with hundreds of companies across various industries, delivering transformative solutions that drive growth and create lasting value.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {[
                { icon: Target, title: 'Strategic Focus', description: 'We align strategy with execution for measurable business impact' },
                { icon: Users, title: 'Expert Team', description: 'Industry veterans with proven track records and deep expertise' },
                { icon: Lightbulb, title: 'Innovation Led', description: 'We bring fresh perspectives and cutting-edge solutions' },
                { icon: ChartBar, title: 'Data Driven', description: 'Evidence-based insights and analytics guide our recommendations' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    borderTop: '4px solid #0066cc',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0066cc' }}>
                    {React.createElement(item.icon, { size: 48, weight: 'bold' })}
                  </div>
                  <h4 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: '1.2rem' }}>{item.title}</h4>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            {/* Mission */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0066cc' }}>
                {React.createElement(Target, { size: 48, weight: 'bold' })}
              </div>
              <h3 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Mission</h3>
              <p style={{ color: '#666', lineHeight: '1.8' }}>
                To empower businesses with strategic insights and actionable solutions that drive growth, efficiency, and long-term value creation for sustainable competitive advantage.
              </p>
            </div>

            {/* Vision */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0066cc' }}>
                {React.createElement(Lightbulb, { size: 48, weight: 'bold' })}
              </div>
              <h3 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Vision</h3>
              <p style={{ color: '#666', lineHeight: '1.8' }}>
                To be the trusted partner of choice for organizations seeking transformative consulting solutions that create positive impact and unlock extraordinary business potential.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ color: '#0066cc', textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Core Values</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { icon: Trophy, title: 'Excellence', description: 'We strive for the highest quality in all our work and deliverables' },
                { icon: Handshake, title: 'Integrity', description: 'We conduct business with honesty, transparency, and ethical principles' },
                { icon: Lightbulb, title: 'Innovation', description: 'We embrace new ideas and progressive approaches to problem-solving' },
                { icon: Users, title: 'Collaboration', description: 'We work closely with clients as true partners in their journey' },
                { icon: ChartBar, title: 'Impact', description: 'We focus relentlessly on delivering measurable and lasting results' },
                { icon: Target, title: 'Growth', description: 'We invest in continuous learning and professional development' },
              ].map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '2px solid #e0e7ff',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0066cc';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 102, 204, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e7ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#0066cc' }}>
                    {React.createElement(value.icon, { size: 40, weight: 'bold' })}
                  </div>
                  <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>{value.title}</h4>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Our Team</h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Experienced professionals committed to your success</p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '3rem' }}>
            <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: '1.8', textAlign: 'center' }}>
              Our team consists of seasoned consultants, strategists, and industry experts who bring diverse perspectives and deep expertise to every project. Each team member is committed to continuous learning and professional excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {[
              { icon: Users, title: 'Strategic Consultants', count: '25+', description: 'Senior consultants with 15+ years of experience', color: '#0066cc' },
              { icon: ChartBar, title: 'Business Analysts', count: '15+', description: 'Expert analysts specializing in data and insights', color: '#00b4d8' },
              { icon: Lightbulb, title: 'Tech Specialists', count: '12+', description: 'Digital transformation and technology experts', color: '#0096c7' },
              { icon: Trophy, title: 'Industry Experts', count: '18+', description: 'Sector specialists across various industries', color: '#0077b6' },
            ].map((dept, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: `3px solid ${dept.color}`,
                  transition: 'all 0.3s ease',
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: dept.color }}>
                  {React.createElement(dept.icon, { size: 48, weight: 'bold' })}
                </div>
                <div style={{ fontSize: '2.5rem', color: dept.color, fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dept.count}
                </div>
                <h4 style={{ color: dept.color, marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                  {dept.title}
                </h4>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
          color: 'white',
          padding: '5rem 0',
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            {[
              { number: '500+', label: 'Clients Served', icon: Users },
              { number: '10+', label: 'Years Excellence', icon: Star },
              { number: '15+', label: 'Industry Sectors', icon: Factory },
              { number: '95%', label: 'Client Satisfaction', icon: Smiley },
            ].map((stat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>
                  {React.createElement(stat.icon, { size: 48, weight: 'bold' })}
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {stat.number}
                </div>
                <p style={{ fontSize: '1.1rem', opacity: '0.95' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: '#f8f9fa',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '2.5rem' }}>Let's Work Together</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Ready to partner with us on your transformation journey? Get in touch with our team today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-block', background: '#0066cc', color: 'white', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem', textDecoration: 'none', borderRadius: '6px' }}>
              Contact Us
            </Link>
            <Link to="/services" className="btn btn-secondary" style={{ display: 'inline-block', border: '2px solid #0066cc', color: '#0066cc', fontWeight: 'bold', padding: '0.9rem 2rem', fontSize: '1.05rem', textDecoration: 'none', borderRadius: '6px' }}>
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
