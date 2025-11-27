import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useScrollPosition } from '../hooks/useAnimations';
import { LogIn, LayoutDashboard, UserPlus } from 'lucide-react';
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
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn secondary">
                    <LogIn size={18} />
                    {isRTL ? 'התחברות' : 'Login'}
                  </Link>
                  <Link to="/register" className="login-btn">
                    <UserPlus size={18} />
                    {isRTL ? 'הרשמה' : 'Sign Up'}
                  </Link>
                </div>
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
            <>
              <Link 
                to="/login" 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={18} />
                {isRTL ? 'התחברות' : 'Login'}
              </Link>
              <Link 
                to="/register" 
                className="mobile-nav-link login-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus size={18} />
                {isRTL ? 'הרשמה' : 'Sign Up'}
              </Link>
            </>
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

      <style>{`
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .login-btn.secondary {
          background: transparent;
          border: 1px solid var(--slate);
          color: var(--silver);
        }

        .login-btn.secondary:hover {
          background: var(--slate);
          color: var(--white);
        }

        [data-theme="light"] .login-btn.secondary {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        [data-theme="light"] .login-btn.secondary:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        @media (max-width: 1024px) {
          .auth-buttons {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;