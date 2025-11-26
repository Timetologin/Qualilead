import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { t, isRTL } = useLanguage();
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError(isRTL ? 'נא למלא את כל השדות' : 'Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <div className="logo-icon">QL</div>
            <span>QualiLead</span>
          </Link>
          <h1>{isRTL ? 'התחברות למערכת' : 'Sign In'}</h1>
          <p>{isRTL ? 'הזן את פרטי ההתחברות שלך' : 'Enter your credentials to access your dashboard'}</p>
        </div>

        {(localError || error) && (
          <div className="login-error">
            <AlertCircle size={20} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">{isRTL ? 'אימייל' : 'Email'}</label>
            <input
              type="email"
              className="form-input"
              placeholder={isRTL ? 'הכנס אימייל' : 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isRTL ? 'סיסמה' : 'Password'}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={isRTL ? 'הכנס סיסמה' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <LogIn size={20} />
                {isRTL ? 'התחבר' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/">{isRTL ? 'חזרה לאתר' : 'Back to Website'}</Link>
        </div>

        <div className="demo-credentials">
          <p><strong>{isRTL ? 'פרטי התחברות לדמו:' : 'Demo Credentials:'}</strong></p>
          <p><small>Admin: admin@qualilead.com / admin123</small></p>
          <p><small>Client: demo@example.com / demo123</small></p>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--deep-blue) 0%, var(--navy) 100%);
          padding: var(--space-xl);
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: var(--space-lg);
        }

        .rtl .login-logo {
          font-family: var(--font-hebrew);
        }

        .login-header h1 {
          font-size: 1.5rem;
          margin-bottom: var(--space-xs);
        }

        .login-header p {
          color: var(--silver);
          font-size: 0.95rem;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-bottom: var(--space-lg);
          color: var(--error);
          font-size: 0.9rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper .form-input {
          padding-right: 45px;
        }

        .rtl .password-input-wrapper .form-input {
          padding-right: var(--space-md);
          padding-left: 45px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--silver);
          padding: var(--space-xs);
          cursor: pointer;
          transition: var(--transition-base);
        }

        .rtl .password-toggle {
          right: auto;
          left: 12px;
        }

        .password-toggle:hover {
          color: var(--gold);
        }

        .login-footer {
          text-align: center;
          margin-top: var(--space-xl);
        }

        .login-footer a {
          color: var(--gold);
          font-size: 0.9rem;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        .demo-credentials {
          margin-top: var(--space-xl);
          padding: var(--space-md);
          background: rgba(212, 175, 55, 0.1);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .demo-credentials p {
          margin: var(--space-xs) 0;
          color: var(--silver);
        }

        .demo-credentials strong {
          color: var(--gold);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
