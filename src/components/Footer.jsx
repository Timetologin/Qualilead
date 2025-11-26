import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">QL</div>
              <span>QualiLead</span>
            </Link>
            <p>{t.footer.description}</p>
            <div className="footer-social">
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

          <div className="footer-column">
            <h4 className="footer-title">{t.footer.quickLinks}</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">{t.nav.home}</Link>
              <Link to="/about" className="footer-link">{t.nav.about}</Link>
              <Link to="/services" className="footer-link">{t.nav.services}</Link>
              <Link to="/packages" className="footer-link">{t.nav.packages}</Link>
              <Link to="/contact" className="footer-link">{t.nav.contact}</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">{t.footer.services}</h4>
            <div className="footer-links">
              <Link to="/services" className="footer-link">{t.leadCategories.cat1}</Link>
              <Link to="/services" className="footer-link">{t.leadCategories.cat2}</Link>
              <Link to="/services" className="footer-link">{t.leadCategories.cat3}</Link>
              <Link to="/services" className="footer-link">{t.leadCategories.cat4}</Link>
              <Link to="/services" className="footer-link">{t.leadCategories.cat5}</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">{t.footer.support}</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">{t.footer.terms}</a>
              <a href="#" className="footer-link">{t.footer.privacy}</a>
              <a href={`mailto:${t.contact.emailAddress}`} className="footer-link">
                <Mail size={16} style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0, verticalAlign: 'middle' }} />
                {t.contact.emailAddress}
              </a>
              <a href={`tel:${t.contact.phoneNumber}`} className="footer-link">
                <Phone size={16} style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0, verticalAlign: 'middle' }} />
                {t.contact.phoneNumber}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
