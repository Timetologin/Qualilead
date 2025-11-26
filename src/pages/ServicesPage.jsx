import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedSection, SectionHeader, AnimatedCard } from '../components/AnimatedComponents';
import { 
  Sparkles, Scissors, Wind, Hammer, Plug, Droplet, Store, Building,
  CheckCircle
} from 'lucide-react';

const ServicesPage = () => {
  const { t, isRTL } = useLanguage();

  const services = [
    {
      icon: Sparkles,
      title: t.services.beautyTitle,
      desc: t.services.beautyDesc,
      features: [t.services.beautyFeature1, t.services.beautyFeature2, t.services.beautyFeature3, t.services.beautyFeature4]
    },
    {
      icon: Scissors,
      title: t.services.hairTitle,
      desc: t.services.hairDesc,
      features: [t.services.hairFeature1, t.services.hairFeature2, t.services.hairFeature3, t.services.hairFeature4]
    },
    {
      icon: Wind,
      title: t.services.acTitle,
      desc: t.services.acDesc,
      features: [t.services.acFeature1, t.services.acFeature2, t.services.acFeature3, t.services.acFeature4]
    },
    {
      icon: Hammer,
      title: t.services.renovationTitle,
      desc: t.services.renovationDesc,
      features: [t.services.renovationFeature1, t.services.renovationFeature2, t.services.renovationFeature3, t.services.renovationFeature4]
    },
    {
      icon: Plug,
      title: t.services.electricianTitle,
      desc: t.services.electricianDesc,
      features: [t.services.electricianFeature1, t.services.electricianFeature2, t.services.electricianFeature3, t.services.electricianFeature4]
    },
    {
      icon: Droplet,
      title: t.services.plumberTitle,
      desc: t.services.plumberDesc,
      features: [t.services.plumberFeature1, t.services.plumberFeature2, t.services.plumberFeature3, t.services.plumberFeature4]
    },
    {
      icon: Store,
      title: t.services.smallBizTitle,
      desc: t.services.smallBizDesc,
      features: [t.services.smallBizFeature1, t.services.smallBizFeature2, t.services.smallBizFeature3, t.services.smallBizFeature4]
    },
    {
      icon: Building,
      title: t.services.localTitle,
      desc: t.services.localDesc,
      features: [t.services.localFeature1, t.services.localFeature2, t.services.localFeature3, t.services.localFeature4]
    },
  ];

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <AnimatedSection>
              <h1 className="page-title">{t.services.pageTitle}</h1>
              <p className="page-description">{t.services.pageDesc}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto var(--space-3xl)', textAlign: 'center' }}>
            <AnimatedSection>
              <h2 style={{ marginBottom: 'var(--space-md)' }}>{t.services.introTitle}</h2>
              <p style={{ color: 'var(--silver)', fontSize: '1.1rem' }}>{t.services.introText}</p>
            </AnimatedSection>
          </div>

          <div className="services-detail-grid">
            {services.map((service, index) => (
              <AnimatedCard 
                key={index} 
                className="service-detail-card" 
                delay={index * 100}
              >
                <div className="service-detail-header">
                  <div className="service-detail-icon">
                    <service.icon size={32} />
                  </div>
                  <h3 className="service-detail-title">{service.title}</h3>
                </div>
                <p className="service-detail-description">{service.desc}</p>
                <div className="service-detail-features">
                  {service.features.map((feature, i) => (
                    <div key={i} className="service-feature-item">
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--navy)', textAlign: 'center' }}>
        <div className="container">
          <AnimatedSection>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>{t.packages.ctaTitle}</h2>
            <p style={{ color: 'var(--silver)', marginBottom: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto var(--space-xl)' }}>
              {t.packages.ctaText}
            </p>
            <Link to="/contact" className="btn btn-primary btn-large">
              {t.packages.ctaButton}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
