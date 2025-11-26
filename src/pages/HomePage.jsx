import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useInView } from '../hooks/useAnimations';
import { AnimatedSection, SectionHeader, AnimatedCard, CountUpNumber } from '../components/AnimatedComponents';
import { 
  Zap, Target, Shield, MapPin, FileCheck, HeadphonesIcon,
  Sparkles, Scissors, Wind, Hammer, Plug, Droplet, Store, Building,
  Users, TrendingUp, Clock, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Star, Package, Award, Rocket
} from 'lucide-react';

const HomePage = () => {
  const { t, isRTL } = useLanguage();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const testimonials = [
    { text: t.testimonials.t1Text, name: t.testimonials.t1Name, role: t.testimonials.t1Role, initials: 'RM' },
    { text: t.testimonials.t2Text, name: t.testimonials.t2Name, role: t.testimonials.t2Role, initials: 'MK' },
    { text: t.testimonials.t3Text, name: t.testimonials.t3Name, role: t.testimonials.t3Role, initials: 'YB' },
  ];

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="hero-content">
            <AnimatedSection className="hero-text" animation="fade-in-left">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                {t.hero.badge}
              </div>
              
              <h1 className="hero-title">
                {t.hero.title} <span className="highlight">{t.hero.titleHighlight}</span>
              </h1>
              
              <p className="hero-description">
                {t.hero.description}
              </p>

              <div className="hero-cta">
                <Link to="/contact" className="btn btn-primary btn-large">
                  {t.hero.cta1}
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-large">
                  {t.hero.cta2}
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">
                    <CountUpNumber value="12000" suffix="+" />
                  </div>
                  <div className="stat-label">{t.hero.stat1Label}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">
                    <CountUpNumber value="500" suffix="+" />
                  </div>
                  <div className="stat-label">{t.hero.stat2Label}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">
                    <CountUpNumber value="98" suffix="%" />
                  </div>
                  <div className="stat-label">{t.hero.stat3Label}</div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="hero-visual" animation="fade-in-right" delay={200}>
              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon">
                    <Zap size={24} />
                  </div>
                  <h3 className="hero-card-title">{t.hero.cardTitle}</h3>
                </div>

                <div className="hero-card-leads">
                  <div className="lead-item">
                    <div className="lead-avatar">SC</div>
                    <div className="lead-info">
                      <div className="lead-name">{t.hero.lead1Name}</div>
                      <div className="lead-type">{t.hero.lead1Type}</div>
                    </div>
                    <span className="lead-status new">{t.hero.lead1Status}</span>
                  </div>

                  <div className="lead-item">
                    <div className="lead-avatar">DL</div>
                    <div className="lead-info">
                      <div className="lead-name">{t.hero.lead2Name}</div>
                      <div className="lead-type">{t.hero.lead2Type}</div>
                    </div>
                    <span className="lead-status hot">{t.hero.lead2Status}</span>
                  </div>

                  <div className="lead-item">
                    <div className="lead-avatar">MB</div>
                    <div className="lead-info">
                      <div className="lead-name">{t.hero.lead3Name}</div>
                      <div className="lead-type">{t.hero.lead3Type}</div>
                    </div>
                    <span className="lead-status warm">{t.hero.lead3Status}</span>
                  </div>
                </div>

                <div className="floating-badge top-right">
                  <div className="floating-badge-icon">
                    <Clock size={16} />
                  </div>
                  <span className="floating-badge-text">{t.hero.floatingBadge1}</span>
                </div>

                <div className="floating-badge bottom-left">
                  <div className="floating-badge-icon">
                    <CheckCircle size={16} />
                  </div>
                  <span className="floating-badge-text">{t.hero.floatingBadge2}</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works">
        <div className="container">
          <SectionHeader
            badge={t.howItWorks.badge}
            title={t.howItWorks.title}
            description={t.howItWorks.description}
          />

          <div className="steps-grid">
            {[
              { icon: Package, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
              { icon: MapPin, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
              { icon: Zap, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
              { icon: TrendingUp, title: t.howItWorks.step4Title, desc: t.howItWorks.step4Desc },
            ].map((step, index) => (
              <AnimatedCard key={index} className="step-card" delay={index * 100}>
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">
                  <step.icon size={32} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge={t.whyChoose.badge}
            title={t.whyChoose.title}
            description={t.whyChoose.description}
          />

          <div className="features-grid">
            {[
              { icon: Target, title: t.whyChoose.feature1Title, desc: t.whyChoose.feature1Desc },
              { icon: Zap, title: t.whyChoose.feature2Title, desc: t.whyChoose.feature2Desc },
              { icon: Shield, title: t.whyChoose.feature3Title, desc: t.whyChoose.feature3Desc },
              { icon: MapPin, title: t.whyChoose.feature4Title, desc: t.whyChoose.feature4Desc },
              { icon: FileCheck, title: t.whyChoose.feature5Title, desc: t.whyChoose.feature5Desc },
              { icon: HeadphonesIcon, title: t.whyChoose.feature6Title, desc: t.whyChoose.feature6Desc },
            ].map((feature, index) => (
              <AnimatedCard key={index} className="feature-card" delay={index * 100}>
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Categories Section */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <SectionHeader
            badge={t.leadCategories.badge}
            title={t.leadCategories.title}
            description={t.leadCategories.description}
          />

          <div className="services-grid">
            {[
              { icon: Sparkles, title: t.leadCategories.cat1, desc: t.leadCategories.cat1Desc },
              { icon: Scissors, title: t.leadCategories.cat2, desc: t.leadCategories.cat2Desc },
              { icon: Wind, title: t.leadCategories.cat3, desc: t.leadCategories.cat3Desc },
              { icon: Hammer, title: t.leadCategories.cat4, desc: t.leadCategories.cat4Desc },
              { icon: Plug, title: t.leadCategories.cat5, desc: t.leadCategories.cat5Desc },
              { icon: Droplet, title: t.leadCategories.cat6, desc: t.leadCategories.cat6Desc },
              { icon: Store, title: t.leadCategories.cat7, desc: t.leadCategories.cat7Desc },
              { icon: Building, title: t.leadCategories.cat8, desc: t.leadCategories.cat8Desc },
            ].map((category, index) => (
              <AnimatedCard key={index} className="service-card" delay={index * 50}>
                <div className="service-icon">
                  <category.icon size={28} />
                </div>
                <h3 className="service-title">{category.title}</h3>
                <p className="service-description">{category.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials">
        <div className="container">
          <SectionHeader
            badge={t.testimonials.badge}
            title={t.testimonials.title}
            description={t.testimonials.description}
          />

          <div className="testimonials-slider">
            <AnimatedSection className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {testimonials[activeTestimonial].initials}
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">{testimonials[activeTestimonial].name}</div>
                  <div className="testimonial-role">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </AnimatedSection>

            <div className="slider-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="slider-arrows">
              <button className="slider-arrow" onClick={prevTestimonial} aria-label="Previous testimonial">
                {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
              <button className="slider-arrow" onClick={nextTestimonial} aria-label="Next testimonial">
                {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge={t.pricing.badge}
            title={t.pricing.title}
            description={t.pricing.description}
          />

          <div className="pricing-grid">
            {/* Starter Plan */}
            <AnimatedCard className="pricing-card" delay={0}>
              <div className="pricing-icon">
                <Rocket size={32} />
              </div>
              <h3 className="pricing-name">{t.pricing.plan1Name}</h3>
              <p className="pricing-description">{t.pricing.plan1Desc}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{t.pricing.plan1Price}</span>
                <span className="pricing-period">{t.pricing.plan1Period}</span>
              </div>
              <div className="pricing-features">
                {[t.pricing.plan1Feature1, t.pricing.plan1Feature2, t.pricing.plan1Feature3, t.pricing.plan1Feature4].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <CheckCircle size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-secondary" style={{ width: '100%' }}>
                {t.pricing.ctaButton}
              </Link>
            </AnimatedCard>

            {/* Professional Plan */}
            <AnimatedCard className="pricing-card featured" delay={100}>
              <span className="pricing-badge">{t.pricing.popularBadge}</span>
              <div className="pricing-icon">
                <Award size={32} />
              </div>
              <h3 className="pricing-name">{t.pricing.plan2Name}</h3>
              <p className="pricing-description">{t.pricing.plan2Desc}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{t.pricing.plan2Price}</span>
                <span className="pricing-period">{t.pricing.plan2Period}</span>
              </div>
              <div className="pricing-features">
                {[t.pricing.plan2Feature1, t.pricing.plan2Feature2, t.pricing.plan2Feature3, t.pricing.plan2Feature4, t.pricing.plan2Feature5].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <CheckCircle size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                {t.pricing.ctaButton}
              </Link>
            </AnimatedCard>

            {/* Enterprise Plan */}
            <AnimatedCard className="pricing-card" delay={200}>
              <div className="pricing-icon">
                <Users size={32} />
              </div>
              <h3 className="pricing-name">{t.pricing.plan3Name}</h3>
              <p className="pricing-description">{t.pricing.plan3Desc}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{t.pricing.plan3Price}</span>
                <span className="pricing-period">{t.pricing.plan3Period}</span>
              </div>
              <div className="pricing-features">
                {[t.pricing.plan3Feature1, t.pricing.plan3Feature2, t.pricing.plan3Feature3, t.pricing.plan3Feature4, t.pricing.plan3Feature5, t.pricing.plan3Feature6].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <CheckCircle size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-secondary" style={{ width: '100%' }}>
                {t.pricing.ctaButton}
              </Link>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <SectionHeader
            badge={t.faq.badge}
            title={t.faq.title}
            description={t.faq.description}
          />

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <AnimatedCard 
                key={index} 
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                delay={index * 50}
              >
                <div 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h4>{faq.q}</h4>
                  <div className="faq-icon">
                    <ChevronDown size={20} />
                  </div>
                </div>
                <div className="faq-answer">
                  <div className="faq-answer-content">
                    {faq.a}
                  </div>
                </div>
              </AnimatedCard>
            ))}
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

export default HomePage;
