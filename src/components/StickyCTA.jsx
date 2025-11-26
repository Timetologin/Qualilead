import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MessageCircle } from 'lucide-react';

const StickyCTA = () => {
  const { t } = useLanguage();

  return (
    <div className="sticky-cta">
      <div className="container">
        <div className="sticky-cta-content">
          <Link to="/contact" className="btn btn-primary">
            <MessageCircle size={18} />
            {t.hero.cta1}
          </Link>
          <a href="tel:+972501234567" className="btn btn-secondary">
            <Phone size={18} />
            {t.hero.cta2}
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
