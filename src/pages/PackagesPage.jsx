import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedSection, SectionHeader, AnimatedCard } from '../components/AnimatedComponents';
import { 
  CheckCircle, X, Rocket, Award, Users, Zap
} from 'lucide-react';

const PackagesPage = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('subscription');

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <AnimatedSection>
              <h1 className="page-title">{t.packages.pageTitle}</h1>
              <p className="page-description">{t.packages.pageDesc}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section">
        <div className="container">
          <div className="packages-intro">
            <AnimatedSection>
              <h2 style={{ marginBottom: 'var(--space-md)' }}>{t.packages.introTitle}</h2>
              <p>{t.packages.introText}</p>
            </AnimatedSection>
          </div>

          {/* Tab Buttons */}
          <div className="package-types">
            <button
              className={`package-type-btn ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              {t.packages.subscriptionTab}
            </button>
            <button
              className={`package-type-btn ${activeTab === 'ppl' ? 'active' : ''}`}
              onClick={() => setActiveTab('ppl')}
            >
              {t.packages.payPerLeadTab}
            </button>
          </div>

          {/* Subscription Plans */}
          {activeTab === 'subscription' && (
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
          )}

          {/* Pay Per Lead */}
          {activeTab === 'ppl' && (
            <AnimatedSection>
              <div className="pricing-card featured" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="pricing-icon">
                  <Zap size={32} />
                </div>
                <h3 className="pricing-name">{t.packages.pplTitle}</h3>
                <p className="pricing-description">{t.packages.pplDesc}</p>
                <div className="pricing-price">
                  <span className="pricing-amount">{t.packages.pplPrice}</span>
                  <span className="pricing-period">{t.packages.pplPer}</span>
                </div>
                <div className="pricing-features">
                  {[t.packages.pplFeature1, t.packages.pplFeature2, t.packages.pplFeature3, t.packages.pplFeature4].map((feature, i) => (
                    <div key={i} className="pricing-feature">
                      <CheckCircle size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                  {t.pricing.ctaButton}
                </Link>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <SectionHeader
            title={t.packages.compareTitle}
          />

          <AnimatedSection>
            <div className="comparison-table">
              <div className="comparison-header">
                <div className="comparison-header-cell"></div>
                <div className="comparison-header-cell">
                  <div className="comparison-plan-name">{t.pricing.plan1Name}</div>
                  <div className="comparison-plan-price">{t.pricing.plan1Price}{t.pricing.plan1Period}</div>
                </div>
                <div className="comparison-header-cell">
                  <div className="comparison-plan-name">{t.pricing.plan2Name}</div>
                  <div className="comparison-plan-price">{t.pricing.plan2Price}{t.pricing.plan2Period}</div>
                </div>
                <div className="comparison-header-cell">
                  <div className="comparison-plan-name">{t.pricing.plan3Name}</div>
                  <div className="comparison-plan-price">{t.pricing.plan3Price}{t.pricing.plan3Period}</div>
                </div>
              </div>

              {/* Feature Rows */}
              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureLeads}</div>
                <div className="comparison-cell">{t.packages.starter20}</div>
                <div className="comparison-cell">{t.packages.pro50}</div>
                <div className="comparison-cell">{t.packages.unlimited}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureDelivery}</div>
                <div className="comparison-cell">{t.packages.standard}</div>
                <div className="comparison-cell">{t.packages.priority}</div>
                <div className="comparison-cell">{t.packages.instant}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureSupport}</div>
                <div className="comparison-cell">{t.packages.email}</div>
                <div className="comparison-cell">{t.packages.dedicated}</div>
                <div className="comparison-cell">{t.packages.vip}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureCategories}</div>
                <div className="comparison-cell">{t.packages.one}</div>
                <div className="comparison-cell">{t.packages.three}</div>
                <div className="comparison-cell">{t.packages.all}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureAnalytics}</div>
                <div className="comparison-cell">{t.packages.basic}</div>
                <div className="comparison-cell">{t.packages.full}</div>
                <div className="comparison-cell">{t.packages.advanced}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureManager}</div>
                <div className="comparison-cell"><X size={18} className="x-icon" /></div>
                <div className="comparison-cell"><CheckCircle size={18} /></div>
                <div className="comparison-cell"><CheckCircle size={18} /></div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell">{t.packages.featureAPI}</div>
                <div className="comparison-cell"><X size={18} className="x-icon" /></div>
                <div className="comparison-cell"><X size={18} className="x-icon" /></div>
                <div className="comparison-cell"><CheckCircle size={18} /></div>
              </div>
            </div>
          </AnimatedSection>
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

export default PackagesPage;
