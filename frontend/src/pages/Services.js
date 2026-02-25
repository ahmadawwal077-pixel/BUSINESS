import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBar,
  Rocket,
  DesktopTower,
} from 'phosphor-react';

const Services = () => {
  const services = [
    {
      icon: ChartBar,
      title: 'Fractional FP&A',
      description:
        'Financial Planning & Analysis support that gives you accurate forecasts and actionable insights without the overhead of a full-time hire.',
      features: [
        'Budgeting & Forecasting: Developing robust financial roadmaps to guide business decisions.',
        'Cash Flow Management: Monitoring inflows and outflows to ensure business liquidity and stability.',
        'Variance Analysis: Comparing actual performance against budgets to identify and fix "leaks."',
      ],
      color: '#0066cc',
    },
    {
      icon: DesktopTower,
      title: 'Business Performance Reporting (BPR)',
      description:
        'Automated reporting and KPI tracking that gives leadership real-time visibility into performance.',
      features: [
        'Interactive Dashboards: Building automated Power BI and Excel dashboards for real-time visibility.',
        'KPI Tracking: Identifying and monitoring the metrics that actually move the needle for your industry.',
        'Management Reporting Packs: Preparing monthly insights for stakeholders and board meetings.',
      ],
      color: '#00b4d8',
    },
    {
      icon: Rocket,
      title: 'Data Analytics Capacity Building (Training)',
      description:
        'Hands-on training programs to develop practical data skills across your finance and operations teams.',
      features: [
        'Corporate Training: Custom data literacy programs for finance and operations teams.',
        'The "Data to Insights" Cohort: Intensive training in Power BI, SQL, and Advanced Excel.',
        'Financial Modeling: Teaching professionals how to build flexible, error-free financial models.',
      ],
      color: '#8b5cf6',
    },
  ];

  return (
    <div>
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
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Our Services</h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', fontWeight: '300', lineHeight: '1.6' }}>
            Tailored consulting solutions for your business growth
          </p>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', opacity: '0.95', maxWidth: '600px', margin: '0 auto' }}>
            We deliver world-class consulting services that drive measurable results and sustainable growth
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#f8f9fa', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)', maxWidth: '700px', margin: '0 auto clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Our Expertise</h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: '#666', lineHeight: '1.8' }}>
              With years of industry experience, we provide cutting-edge solutions tailored to your specific business needs
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
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
                <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', color: service.color }}>
                  {React.createElement(service.icon, { size: 56, weight: 'bold' })}
                </div>
                <h3 style={{ color: service.color, marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 'bold' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#666', marginBottom: 'clamp(1rem, 2vw, 1.5rem)', lineHeight: '1.8', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)' }}>
                  {service.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        padding: 'clamp(0.5rem, 1vw, 0.75rem) 0',
                        color: '#555',
                        borderBottom: i < service.features.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{ color: service.color, marginRight: 'clamp(0.5rem, 1vw, 0.75rem)', fontWeight: 'bold' }}>✓</span>
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
      <section className="section" style={{ backgroundColor: 'white', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{ color: '#0066cc', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Why Choose PositiveHills?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
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
                  padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: `4px solid #0066cc`,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#0066cc', marginBottom: '0.75rem', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 'bold' }}>{item.title}</h4>
                <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 1.6vw, 1rem)', lineHeight: '1.6' }}>
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
          padding: 'clamp(2.5rem, 6vw, 5rem) 0',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', marginBottom: 'clamp(1.5rem, 2vw, 2rem)', maxWidth: '600px', margin: '0 auto clamp(1.5rem, 2vw, 2rem)', lineHeight: '1.6' }}>
            Schedule a free consultation with our experts today and discover how we can help your business thrive
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#0066cc', fontWeight: 'bold', padding: 'clamp(0.75rem, 1.5vw, 0.9rem) clamp(1.5rem, 3vw, 2rem)', fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', textDecoration: 'none', borderRadius: '8px', minHeight: '44px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.2)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
            Get Your Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
