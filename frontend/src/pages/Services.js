import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBar,
  Rocket,
  MagnifyingGlass,
  Buildings,
  DesktopTower,
  Lightning,
} from 'phosphor-react';

const Services = () => {
  const services = [
    {
      icon: ChartBar,
      title: 'Strategic Planning',
      description:
        'We help you develop comprehensive business strategies that align with your goals and market opportunities.',
      features: [
        'Market analysis and opportunity identification',
        'Competitive positioning',
        'Growth strategy development',
        'Implementation roadmap',
      ],
      color: '#0066cc',
    },
    {
      icon: Rocket,
      title: 'Business Development',
      description:
        'Expand your market reach and revenue streams with our proven business development methodologies.',
      features: [
        'New market entry strategies',
        'Partnership development',
        'Sales optimization',
        'Revenue diversification',
      ],
      color: '#00b4d8',
    },
    {
      icon: MagnifyingGlass,
      title: 'Market Analysis',
      description:
        'Make informed decisions with our comprehensive market research and competitive intelligence services.',
      features: [
        'Market size and segmentation',
        'Competitor analysis',
        'Trend identification',
        'Customer insights',
      ],
      color: '#0096c7',
    },
    {
      icon: Buildings,
      title: 'Organizational Design',
      description:
        'Optimize your organizational structure for efficiency, agility, and performance.',
      features: [
        'Organizational assessment',
        'Structure redesign',
        'Process optimization',
        'Performance management',
      ],
      color: '#0077b6',
    },
    {
      icon: DesktopTower,
      title: 'Digital Transformation',
      description:
        'Transform your business through strategic implementation of digital technologies.',
      features: [
        'Digital strategy development',
        'Technology implementation',
        'Change management',
        'Training and support',
      ],
      color: '#00b4d8',
    },
    {
      icon: Lightning,
      title: 'Change Management',
      description:
        'Successfully navigate organizational change with our expert change management services.',
      features: [
        'Change assessment',
        'Change strategy',
        'Stakeholder management',
        'Adoption support',
      ],
      color: '#0096c7',
    },
  ];

  return (
    <div>
      <section
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '5rem 0',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Tailored consulting solutions for your business growth
          </p>
          <p style={{ fontSize: '1rem', opacity: '0.95', maxWidth: '600px', margin: '0 auto' }}>
            We deliver world-class consulting services that drive measurable results and sustainable growth
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem' }}>Our Expertise</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
              With years of industry experience, we provide cutting-edge solutions tailored to your specific business needs
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: `4px solid ${service.color}`,
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: service.color }}>
                  {React.createElement(service.icon, { size: 48, weight: 'bold' })}
                </div>
                <h3 style={{ color: service.color, marginBottom: '0.75rem', fontSize: '1.4rem' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  {service.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        padding: '0.5rem 0',
                        color: '#555',
                        borderBottom: i < service.features.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: service.color, marginRight: '0.75rem', fontWeight: 'bold' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '1rem' }}>Why Choose PositiveHills?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: 'Proven Track Record',
                description: '500+ successful projects across multiple industries with measurable results',
              },
              {
                title: 'Expert Team',
                description: '50+ experienced consultants with deep industry expertise and certifications',
              },
              {
                title: 'Tailored Solutions',
                description: 'Custom strategies designed specifically for your business needs and goals',
              },
              {
                title: 'Fast Implementation',
                description: 'Quick turnaround times without compromising on quality and results',
              },
              {
                title: 'Ongoing Support',
                description: 'Continuous guidance and support throughout and after implementation',
              },
              {
                title: 'ROI Focused',
                description: 'All solutions designed to maximize your return on investment',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '2rem',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: `4px solid #0066cc`,
                }}
              >
                <h4 style={{ color: '#0066cc', marginBottom: '0.75rem' }}>{item.title}</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {item.description}
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
          padding: '4rem 0',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Schedule a free consultation with our experts today and discover how we can help your business thrive
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-block', background: 'white', color: '#0066cc', fontWeight: 'bold' }}>
            Get Your Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
