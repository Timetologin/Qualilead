import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useScrollPosition } from '../hooks/useAnimations';
import { LogIn, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/services', label: t.nav.services },
    { path: '/packages', label: t.nav.packages },
    { path: '/contact', label: t.nav.contact },
  ];

  const isActive = (path) => location.pathname === path;

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/client/dashboard';

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="logo">
              <div className="logo-icon">QL</div>
              <span>QualiLead</span>
            </Link>

            <div className="nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Theme Toggle */}
              <ThemeToggle size="small" />
              
              <div className="lang-toggle">
                <button
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`lang-btn ${language === 'he' ? 'active' : ''}`}
                  onClick={() => setLanguage('he')}
                >
                  עב
                </button>
              </div>

              {isAuthenticated ? (
                <Link to={dashboardPath} className="login-btn">
                  <LayoutDashboard size={18} />
                  {isRTL ? 'לוח בקרה' : 'Dashboard'}
                </Link>
              ) : (
                <Link to="/login" className="login-btn">
                  <LogIn size={18} />
                  {isRTL ? 'התחברות' : 'Login'}
                </Link>
              )}
            </div>

            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Link 
              to={dashboardPath} 
              className="mobile-nav-link login-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              {isRTL ? 'לוח בקרה' : 'Dashboard'}
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="mobile-nav-link login-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              {isRTL ? 'התחברות' : 'Login'}
            </Link>
          )}
          
          {/* Theme & Language Controls */}
          <div className="mobile-nav-controls">
            <ThemeToggle size="medium" />
            
            <div className="lang-toggle">
              <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('en');
                  setMobileMenuOpen(false);
                }}
              >
                EN
              </button>
              <button
                className={`lang-btn ${language === 'he' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('he');
                  setMobileMenuOpen(false);
                }}
              >
                עב
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;