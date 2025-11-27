import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, User, Mail, Phone, Building } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const RegisterPage = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(isRTL ? 'שם מלא הוא שדה חובה' : 'Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError(isRTL ? 'אימייל הוא שדה חובה' : 'Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(isRTL ? 'אימייל לא תקין' : 'Invalid email format');
      return false;
    }
    if (!formData.password) {
      setError(isRTL ? 'סיסמה היא שדה חובה' : 'Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError(isRTL ? 'סיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'הסיסמאות לא תואמות' : 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company_name: formData.company_name
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || (isRTL ? 'שגיאה בהרשמה' : 'Registration failed'));
      }
    } catch (err) {
      setError(isRTL ? 'שגיאת רשת' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="success-message">
            <CheckCircle size={60} />
            <h2>{isRTL ? 'ההרשמה הושלמה בהצלחה!' : 'Registration Successful!'}</h2>
            <p>{isRTL ? 'מועבר לדף ההתחברות...' : 'Redirecting to login...'}</p>
          </div>
        </div>

        <style>{`
          .success-message {
            text-align: center;
            padding: var(--space-2xl);
          }
          .success-message svg {
            color: var(--success);
            margin-bottom: var(--space-lg);
          }
          .success-message h2 {
            color: var(--white);
            margin-bottom: var(--space-md);
          }
          .success-message p {
            color: var(--silver);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`register-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="register-logo">
            <div className="logo-icon">QL</div>
            <span>QualiLead</span>
          </Link>
          <h1>{isRTL ? 'הרשמה למערכת' : 'Create Account'}</h1>
          <p>{isRTL ? 'הצטרף אלינו והתחל לקבל לידים איכותיים' : 'Join us and start receiving quality leads'}</p>
        </div>

        {error && (
          <div className="register-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {isRTL ? 'שם מלא' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder={isRTL ? 'ישראל ישראלי' : 'John Doe'}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                {isRTL ? 'אימייל' : 'Email'} *
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                dir="ltr"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                {isRTL ? 'טלפון' : 'Phone'}
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="050-000-0000"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                dir="ltr"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Building size={16} />
                {isRTL ? 'שם החברה' : 'Company Name'}
              </label>
              <input
                type="text"
                name="company_name"
                className="form-input"
                placeholder={isRTL ? 'שם העסק שלך' : 'Your Business Name'}
                value={formData.company_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{isRTL ? 'סיסמה' : 'Password'} *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder={isRTL ? 'לפחות 6 תווים' : 'At least 6 characters'}
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="form-group">
              <label className="form-label">{isRTL ? 'אישור סיסמה' : 'Confirm Password'} *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder={isRTL ? 'הזן שוב את הסיסמה' : 'Re-enter password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                <UserPlus size={20} />
                {isRTL ? 'הרשמה' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            {isRTL ? 'כבר יש לך חשבון?' : 'Already have an account?'}
            {' '}
            <Link to="/login">{isRTL ? 'התחבר כאן' : 'Sign in here'}</Link>
          </p>
          <Link to="/">{isRTL ? 'חזרה לאתר' : 'Back to Website'}</Link>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--deep-blue) 0%, var(--navy) 100%);
          padding: var(--space-xl);
        }

        .register-container {
          width: 100%;
          max-width: 600px;
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
        }

        .register-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .register-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: var(--space-lg);
        }

        .rtl .register-logo {
          font-family: var(--font-hebrew);
        }

        .register-header h1 {
          font-size: 1.5rem;
          margin-bottom: var(--space-xs);
          color: var(--white);
        }

        .register-header p {
          color: var(--silver);
          font-size: 0.95rem;
        }

        .register-error {
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

        .register-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--light-silver);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-label svg {
          color: var(--gold);
        }

        .form-input {
          width: 100%;
          padding: var(--space-md);
          background: var(--slate);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          color: var(--white);
          font-size: 1rem;
          transition: var(--transition-base);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--gold);
        }

        .form-input::placeholder {
          color: var(--silver);
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
          background: none;
          border: none;
        }

        .rtl .password-toggle {
          right: auto;
          left: 12px;
        }

        .password-toggle:hover {
          color: var(--gold);
        }

        .register-footer {
          text-align: center;
          margin-top: var(--space-xl);
        }

        .register-footer p {
          color: var(--silver);
          margin-bottom: var(--space-md);
        }

        .register-footer a {
          color: var(--gold);
          font-size: 0.9rem;
        }

        .register-footer a:hover {
          text-decoration: underline;
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

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .register-container {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;