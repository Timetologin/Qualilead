import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedSection, SectionHeader, AnimatedCard } from '../components/AnimatedComponents';
import { 
  Phone, Mail, MapPin, MessageCircle, Send,
  Facebook, Instagram, Linkedin, Twitter, ChevronDown
} from 'lucide-react';

const ContactPage = () => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.contact.errorRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.contact.errorRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.errorEmail;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t.contact.errorRequired;
    } else if (!/^[\d\-+() ]{8,}$/.test(formData.phone)) {
      newErrors.phone = t.contact.errorPhone;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.contact.errorRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        business: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <AnimatedSection>
              <h1 className="page-title">{t.contact.pageTitle}</h1>
              <p className="page-description">{t.contact.pageDesc}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="contact-content">
            {/* Contact Info */}
            <div className="contact-info">
              <AnimatedSection>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>{t.contact.infoTitle}</h2>
              </AnimatedSection>

              <AnimatedCard className="contact-card" delay={0}>
                <div className="contact-card-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-card-content">
                  <h4>{t.contact.phoneTitle}</h4>
                  <p>
                    <a href={`tel:${t.contact.phoneNumber}`}>{t.contact.phoneNumber}</a>
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard className="contact-card" delay={100}>
                <div className="contact-card-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-card-content">
                  <h4>{t.contact.emailTitle}</h4>
                  <p>
                    <a href={`mailto:${t.contact.emailAddress}`}>{t.contact.emailAddress}</a>
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard className="contact-card" delay={200}>
                <div className="contact-card-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-card-content">
                  <h4>{t.contact.addressTitle}</h4>
                  <p>{t.contact.addressText}</p>
                </div>
              </AnimatedCard>

              <AnimatedCard className="contact-card" delay={300}>
                <div className="contact-card-icon">
                  <MessageCircle size={24} />
                </div>
                <div className="contact-card-content">
                  <h4>{t.contact.whatsappTitle}</h4>
                  <p>{t.contact.whatsappText}</p>
                  <a 
                    href="https://wa.me/972501234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                  >
                    <MessageCircle size={18} />
                    {t.contact.whatsappButton}
                  </a>
                </div>
              </AnimatedCard>

              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <AnimatedSection className="contact-form-wrapper" animation="fade-in-right" delay={200}>
              <h3 className="contact-form-title">{t.contact.formTitle}</h3>

              {submitted && (
                <div className="form-success">
                  {t.contact.successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder={t.contact.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contact.emailLabel}</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder={t.contact.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.contact.phoneLabel}</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder={t.contact.phonePlaceholder}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contact.businessLabel}</label>
                    <select
                      name="business"
                      className="form-select"
                      value={formData.business}
                      onChange={handleChange}
                    >
                      <option value="">{t.contact.businessPlaceholder}</option>
                      <option value="beauty">{t.contact.businessOption1}</option>
                      <option value="hair">{t.contact.businessOption2}</option>
                      <option value="ac">{t.contact.businessOption3}</option>
                      <option value="renovation">{t.contact.businessOption4}</option>
                      <option value="electrician">{t.contact.businessOption5}</option>
                      <option value="plumber">{t.contact.businessOption6}</option>
                      <option value="other">{t.contact.businessOption7}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.contact.messageLabel}</label>
                  <textarea
                    name="message"
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder={t.contact.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%' }}>
                  <Send size={18} />
                  {t.contact.submitButton}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <SectionHeader
            badge={t.faq.badge}
            title={t.faq.title}
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
    </main>
  );
};

export default ContactPage;
