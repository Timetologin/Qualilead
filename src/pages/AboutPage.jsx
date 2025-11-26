import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedSection, SectionHeader, AnimatedCard, CountUpNumber } from '../components/AnimatedComponents';
import { 
  CheckCircle, Award, Lightbulb, Heart, Users,
  Target, TrendingUp
} from 'lucide-react';

const AboutPage = () => {
  const { t, isRTL } = useLanguage();

  const values = [
    { icon: Award, text: t.about.value1 },
    { icon: Target, text: t.about.value2 },
    { icon: Lightbulb, text: t.about.value3 },
    { icon: Heart, text: t.about.value4 },
  ];

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <AnimatedSection>
              <h1 className="page-title">{t.about.pageTitle}</h1>
              <p className="page-description">{t.about.pageDesc}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section">
        <div className="container">
          <div className="about-content">
            <AnimatedSection className="about-image" animation="fade-in-left">
              <div className="about-image-wrapper">
                <div className="about-image-placeholder">
                  <TrendingUp size={80} />
                </div>
              </div>
              <div className="about-badge">
                <div className="about-badge-number">{t.about.yearsExperience}</div>
                <div className="about-badge-text">{t.about.yearsLabel}</div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="about-text" animation="fade-in-right" delay={200}>
              <h2>{t.about.title}</h2>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>

              <div className="about-values">
                {values.map((value, index) => (
                  <div key={index} className="value-item">
                    <value.icon size={20} />
                    <span>{value.text}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section founder-section">
        <div className="container">
          <SectionHeader
            badge={t.about.founderTitle}
            title=""
          />

          <div className="founder-content">
            <AnimatedSection className="founder-image" animation="fade-in-left">
              <div className="founder-avatar">JO</div>
            </AnimatedSection>

            <AnimatedSection className="founder-text" animation="fade-in-right" delay={200}>
              <h3>{t.about.founderName}</h3>
              <p className="founder-role">{t.about.founderRole}</p>
              <p className="founder-bio">{t.about.founderBio}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection>
              <span className="section-badge">{t.about.missionBadge}</span>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>{t.about.missionTitle}</h2>
              <p style={{ color: 'var(--silver)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {t.about.missionText}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div className="hero-stats" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 0 }}>
            <AnimatedCard className="stat-item" delay={0}>
              <div className="stat-number">
                <CountUpNumber value="12000" suffix="+" />
              </div>
              <div className="stat-label">{t.hero.stat1Label}</div>
            </AnimatedCard>
            <AnimatedCard className="stat-item" delay={100}>
              <div className="stat-number">
                <CountUpNumber value="500" suffix="+" />
              </div>
              <div className="stat-label">{t.hero.stat2Label}</div>
            </AnimatedCard>
            <AnimatedCard className="stat-item" delay={200}>
              <div className="stat-number">
                <CountUpNumber value="98" suffix="%" />
              </div>
              <div className="stat-label">{t.hero.stat3Label}</div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
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

export default AboutPage;
