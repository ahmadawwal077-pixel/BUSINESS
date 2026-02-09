import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBar,
  Rocket,
  MagnifyingGlass,
  Buildings,
  DesktopTower,
  Globe,
  Users,
  CheckCircle,
  Target,
  TrendUp,
  Handshake,
  Sparkle,
  Phone,
} from 'phosphor-react';
import ScheduleConsultationPopup from '../components/ScheduleConsultationPopup';

const Carousel = ({ onOpenConsultation }) => {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop',
      title: 'Scale Your Business with Mathematical Certainty',
      subtitle: 'Expert consulting solutions for sustainable growth',
      text: 'Partner with industry leaders to achieve measurable results and lasting success',
      primary: { to: '/services', label: 'Schedule Consultation' },
      secondary: { to: '/contact', label: 'Get Started' },
    },
    {
      image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=1600&h=900&fit=crop',
      title: 'Accelerate Growth',
      subtitle: 'Data-driven strategies for measurable outcomes',
      text: 'We combine analytics and execution to push your KPIs forward',
      primary: { to: '/services', label: 'Schedule Consultation' },
      secondary: { to: '/contact', label: 'Contact Us' },
    },
    {
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&h=900&fit=crop',
      title: 'Empower Your Team',
      subtitle: 'Training and implementation for real results',
      text: 'Practical upskilling and hands-on guidance to ensure adoption',
      primary: { to: '/services', label: 'Schedule Consultation' },
      secondary: { to: '/contact', label: 'Get A Demo' },
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(intervalRef.current);
  }, [paused, slides.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  const goTo = (i) => setIndex(i % slides.length);

  return (
    <section
      aria-label="Homepage hero carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', overflow: 'hidden', minHeight: 'clamp(500px, 80vh, 700px)', color: 'white' }}
    >
      <style>{`/* Carousel styles */
        .ph-slides { position:absolute; inset:0; }
        .ph-slide { position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transition:opacity 900ms ease; }
        .ph-slide--visible { opacity:1; }
        .ph-overlay { position:absolute; inset:0; background:linear-gradient(135deg, rgba(0,102,204,0.45) 0%, rgba(0,82,163,0.45) 100%); z-index:1 }
        .ph-content { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; min-height:inherit; padding:clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem); text-align:center; }
        .ph-indicators { position:absolute; left:50%; transform:translateX(-50%); bottom:clamp(1rem,2vw,1.5rem); display:flex; gap:0.5rem; z-index:3; }
        .ph-dot { width:11px; height:11px; border-radius:50%; background:rgba(255,255,255,0.5); border:none; cursor:pointer; }
        .ph-dot--active { background:white; transform:scale(1.12); }
        @media (prefers-reduced-motion: reduce) { .ph-slide { transition: none !important; } }
      `}</style>

      <div className="ph-slides" aria-hidden="true">
        {slides.map((s, i) => {
          // build a srcset for responsive loading
          const srcBase = s.image;
          const makeSrc = (w) => srcBase.replace(/w=\d+/, `w=${w}`);
          const srcSet = `${makeSrc(800)} 800w, ${makeSrc(1200)} 1200w, ${makeSrc(1600)} 1600w`;
          return (
            <picture key={i} style={{ position: 'absolute', inset: 0 }}>
              <img
                id={`slide-${i + 1}`}
                src={makeSrc(1600)}
                srcSet={srcSet}
                sizes="100vw"
                alt={`${s.title} — ${s.subtitle}`}
                loading={i === index ? 'eager' : 'lazy'}
                decoding="async"
                className={`ph-slide ${i === index ? 'ph-slide--visible' : ''}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: i === index ? 0 : -1 }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slides.length}`}
              />
            </picture>
          );
        })}
        <div className="ph-overlay" aria-hidden="true" />
      </div>

      <div className="ph-content" aria-live="polite">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: '800', letterSpacing: '-0.5px' }}>{slides[index].title}</h1>
          <p style={{ fontSize: 'clamp(1rem, 2.6vw, 1.3rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)', fontWeight: '400', opacity: 0.95 }}>{slides[index].subtitle}</p>
          <p style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)', marginBottom: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'rgba(255,255,255,0.95)' }}>{slides[index].text}</p>
          <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onOpenConsultation} style={{ display: 'inline-block', background: 'white', color: '#0066cc', fontWeight: '700', padding: 'clamp(0.6rem,1vw,0.8rem) clamp(1rem,2vw,1.6rem)', borderRadius: '8px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>{slides[index].primary.label}</button>
            <Link to={slides[index].secondary.to} style={{ display: 'inline-block', color: 'white', border: '2px solid rgba(255,255,255,0.9)', padding: 'clamp(0.6rem,1vw,0.8rem) clamp(1rem,2vw,1.6rem)', borderRadius: '8px', textDecoration: 'none' }}>{slides[index].secondary.label}</Link>
          </div>
        </div>
      </div>

      <div className="ph-indicators" role="tablist" aria-label="Slide selection">
        {slides.map((_, i) => (
          <button key={i} className={`ph-dot ${i === index ? 'ph-dot--active' : ''}`} aria-label={`Go to slide ${i + 1}`} aria-current={i === index} aria-controls={`slide-${i + 1}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const [consultationPopupOpen, setConsultationPopupOpen] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <Carousel onOpenConsultation={() => setConsultationPopupOpen(true)} />

      {/* Services Preview */}
      <section className="section" style={{ 
        backgroundColor: '#f8f9fa',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h2 style={{ 
              color: '#0066cc', 
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.5rem)',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
            }}>Our Services</h2>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
              color: '#666',
              lineHeight: '1.5',
            }}>Comprehensive solutions tailored to your business needs</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 90vw, 340px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
            {[
              {
                icon: ChartBar,
                title: 'Fractional FP&A',
                description: 'Budgeting & Forecasting, Cash Flow Management, and Variance Analysis to strengthen financial controls and forecasting.',
                color: '#0066cc',
              },
              {
                icon: DesktopTower,
                title: 'Business Performance Reporting (BPR)',
                description: 'Interactive dashboards, KPI tracking and monthly management reporting packs for real-time visibility.',
                color: '#00b4d8',
              },
              {
                icon: Rocket,
                title: 'Data Analytics Capacity Building (Training)',
                description: 'Corporate training, the "Data to Insights" cohort, and practical financial modeling workshops.',
                color: '#8b5cf6',
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
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
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', color: service.color }}>
                  <Icon size={Math.min(56, Math.max(40, window.innerWidth * 0.1))} weight="bold" />
                </div>
                <h3 style={{ 
                  color: service.color, 
                  marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', 
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                  fontWeight: '700',
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                }}>
                  {service.description}
                </p>
              </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 2.5rem)' }}>
            <Link to="/services" style={{
              display: 'inline-block',
              padding: 'clamp(0.7rem, 1.5vw, 0.85rem) clamp(1.2rem, 3vw, 1.8rem)',
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.3)';
            }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section" style={{ 
        backgroundColor: 'white',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 90vw, 450px), 1fr))', 
            gap: 'clamp(2rem, 5vw, 3rem)', 
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ 
                color: '#0066cc', 
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)', 
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 'bold',
              }}>About Our Company</h2>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.8', 
                marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', 
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              }}>
                PositiveHills is a leading management consulting firm with over 10 years of experience helping businesses transform and grow. Our team of expert consultants brings industry-leading knowledge and proven methodologies to every engagement.
              </p>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.8', 
                marginBottom: 'clamp(1.5rem, 2vw, 2rem)', 
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              }}>
                We partner with organizations across diverse industries—from startups to Fortune 500 companies—to unlock their potential and drive sustainable success. Our commitment to excellence and client success has earned us a 95% satisfaction rate.
              </p>
              <Link to="/about" style={{
                display: 'inline-block',
                padding: 'clamp(0.7rem, 1.5vw, 0.85rem) clamp(1.2rem, 3vw, 1.8rem)',
                background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                Learn More About Us
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop" 
                alt="About" 
                style={{ 
                  borderRadius: '12px', 
                  width: '100%', 
                  height: 'auto', 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  maxWidth: '500px',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="section" style={{ 
        backgroundColor: '#f8f9fa',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h2 style={{ 
              color: '#0066cc', 
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.5rem)', 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 'bold',
            }}>Featured Projects</h2>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
              color: '#666',
              lineHeight: '1.5',
            }}>See how we've helped businesses achieve their goals</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 90vw, 320px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
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
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
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
                <div style={{ 
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                  marginBottom: 'clamp(0.75rem, 2vw, 1rem)', 
                  color: '#0066cc',
                }}>
                  <ProjectIcon size={Math.min(48, Math.max(36, window.innerWidth * 0.1))} weight="bold" />
                </div>
                <h4 style={{ 
                  color: '#1f2937', 
                  marginBottom: 'clamp(0.5rem, 1vw, 0.5rem)', 
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  fontWeight: '700',
                }}>
                  {project.title}
                </h4>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', 
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                }}>
                  {project.company}
                </p>
                <div style={{
                  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
                  color: 'white',
                  padding: 'clamp(0.6rem, 1.2vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                }}>
                  {project.result}
                </div>
              </div>
            );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 2.5rem)' }}>
            <Link to="/projects" style={{
              display: 'inline-block',
              padding: 'clamp(0.7rem, 1.5vw, 0.85rem) clamp(1.2rem, 3vw, 1.8rem)',
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.3)';
            }}>
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section" style={{ 
        backgroundColor: 'white',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h2 style={{ 
              color: '#0066cc', 
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.5rem)', 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 'bold',
            }}>Latest Insights</h2>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
              color: '#666',
              lineHeight: '1.5',
            }}>Expert articles on business strategy and transformation</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 90vw, 330px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
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
                  padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                  color: 'white',
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', 
                    fontWeight: '600', 
                    opacity: 0.9 
                  }}>
                    {article.category}
                  </span>
                </div>
                <div style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
                  <h4 style={{ 
                    color: '#1f2937', 
                    marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)', 
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    fontWeight: '700',
                  }}>
                    {article.title}
                  </h4>
                  <p style={{ 
                    color: '#666', 
                    marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', 
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', 
                    lineHeight: '1.6' 
                  }}>
                    {article.excerpt}
                  </p>
                  <div style={{ 
                    color: '#6b7280', 
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 2.5rem)' }}>
            <Link to="/blog" style={{
              display: 'inline-block',
              padding: 'clamp(0.7rem, 1.5vw, 0.85rem) clamp(1.2rem, 3vw, 1.8rem)',
              background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.3)';
            }}>
              Read All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{ 
        backgroundColor: '#f8f9fa',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h2 style={{ 
              color: '#0066cc', 
              marginBottom: 'clamp(1rem, 2vw, 1rem)',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 'bold',
            }}>Why Choose PositiveHills?</h2>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
              color: '#666', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.5',
            }}>
              We combine industry expertise with innovative solutions to deliver exceptional results
            </p>
          </div>

          <div className="why-choose-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 90vw, 1fr), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
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
                  padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                  background: 'white',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${item.color}`,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{ 
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                  marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)', 
                  color: item.color 
                }}>
                  <ItemIcon size={Math.min(44, Math.max(32, window.innerWidth * 0.08))} weight="bold" />
                </div>
                <h4 style={{ 
                  color: item.color, 
                  marginBottom: 'clamp(0.5rem, 1vw, 0.5rem)', 
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                }}>
                  {item.title}
                </h4>
                <p style={{ 
                  color: '#666', 
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', 
                  lineHeight: '1.6' 
                }}>
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
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 90vw, 280px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)', 
            textAlign: 'center',
          }}>
            {[
              { number: '500+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Expertise' },
              { number: '15+', label: 'Industry Sectors' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div style={{ 
                  fontSize: 'clamp(2rem, 6vw, 3rem)', 
                  fontWeight: 'bold', 
                  marginBottom: 'clamp(0.5rem, 1vw, 0.5rem)',
                  lineHeight: '1',
                }}>
                  {stat.number}
                </div>
                <p style={{ 
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
                  opacity: '0.95',
                  lineHeight: '1.4',
                }}>{stat.label}</p>
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
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
          textAlign: 'center',
          marginTop: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
            fontWeight: 'bold',
            lineHeight: '1.2',
          }}>Ready to Transform Your Business?</h2>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
            marginBottom: 'clamp(0.5rem, 1vw, 0.5rem)', 
            opacity: 0.95,
            lineHeight: '1.5',
          }}>
            Get in touch with our expert consultants today
          </p>
          <p style={{ 
            fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', 
            marginBottom: 'clamp(2rem, 4vw, 3rem)', 
            opacity: 0.9,
            lineHeight: '1.5',
          }}>
            We're here to help you achieve your business goals with tailored solutions
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(1rem, 2vw, 1.5rem)', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}>
            <Link to="/contact" style={{
              display: 'inline-block',
              padding: 'clamp(0.7rem, 1.5vw, 0.95rem) clamp(1.2rem, 3vw, 2rem)',
              background: 'white',
              color: '#0066cc',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Contact Us
            </Link>
            <Link to="/make-appointment" style={{
              display: 'inline-block',
              padding: 'clamp(0.7rem, 1.5vw, 0.95rem) clamp(1.2rem, 3vw, 2rem)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              border: '2px solid white',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Book Appointment
            </Link>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <p style={{ 
              fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', 
              marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', 
              opacity: 0.95, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 'clamp(0.5rem, 1vw, 1rem)', 
              flexWrap: 'wrap',
              lineHeight: '1.5',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                <Phone size={Math.min(18, Math.max(14, window.innerWidth * 0.04))} weight="bold" /> Call us: +1 (555) 123-4567
              </span>
              <span style={{ opacity: 0.7 }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                <MagnifyingGlass size={Math.min(18, Math.max(14, window.innerWidth * 0.04))} weight="bold" /> Email: hello@positivehills.com
              </span>
            </p>
            <p style={{ 
              fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', 
              opacity: 0.85,
              lineHeight: '1.4',
            }}>
              Available Monday - Friday, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Consultation Popup */}
      <ScheduleConsultationPopup
        isOpen={consultationPopupOpen}
        onClose={() => setConsultationPopupOpen(false)}
      />
    </div>
  );
};

export default Home;
