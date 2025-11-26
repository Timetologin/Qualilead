import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, ArrowRight, Settings, Mail, Phone, Bell,
  Save, AlertCircle, CheckCircle, RefreshCw, Key, Globe,
  MessageSquare, Send, TestTube, Shield
} from 'lucide-react';

const SettingsPage = () => {
  const { api, isAdmin, user } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Email Settings
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    email_from_name: 'QualiLead',
    email_from_address: '',
    
    // SMS Settings (Twilio)
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: '',
    sms_enabled: false,
    
    // Notification Settings
    notify_admin_new_lead: true,
    notify_admin_lead_returned: true,
    notify_client_lead_assigned: true,
    
    // System Settings
    monthly_reset_day: '1',
    default_package: 'starter',
    allow_lead_returns: true,
    max_return_days: '7'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSMS, setTestingSMS] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/client/dashboard');
      return;
    }
    // In a real app, you'd fetch settings from the API
    // For now, we use local state
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, save to backend
      // await api('/settings', { method: 'PUT', body: JSON.stringify(settings) });
      
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(isRTL ? 'ההגדרות נשמרו בהצלחה!' : 'Settings saved successfully!');
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בשמירת ההגדרות' : 'Error saving settings'));
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setTestingEmail(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, test the email connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(isRTL ? 'חיבור האימייל תקין!' : 'Email connection successful!');
    } catch (err) {
      setError(isRTL ? 'שגיאה בחיבור לשרת האימייל' : 'Email connection failed');
    } finally {
      setTestingEmail(false);
    }
  };

  const testSMSConnection = async () => {
    setTestingSMS(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, test SMS via Twilio
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(isRTL ? 'חיבור ה-SMS תקין!' : 'SMS connection successful!');
    } catch (err) {
      setError(isRTL ? 'שגיאה בחיבור לשירות ה-SMS' : 'SMS connection failed');
    } finally {
      setTestingSMS(false);
    }
  };

  const resetMonthlyLeads = async () => {
    if (!confirm(isRTL 
      ? 'האם אתה בטוח? פעולה זו תאפס את מונה הלידים החודשי לכל הלקוחות.'
      : 'Are you sure? This will reset the monthly lead counter for all clients.'
    )) return;

    try {
      // In a real app, call the reset endpoint
      setSuccess(isRTL ? 'מונה הלידים אופס בהצלחה!' : 'Monthly leads reset successfully!');
    } catch (err) {
      setError(isRTL ? 'שגיאה באיפוס המונה' : 'Error resetting counter');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <Link to="/admin/dashboard" className="back-link">
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {isRTL ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'}
          </Link>
          <h1>
            <Settings size={28} />
            {isRTL ? 'הגדרות מערכת' : 'System Settings'}
          </h1>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        <div className="settings-grid">
          {/* Email Settings */}
          <div className="settings-card">
            <div className="card-header">
              <Mail size={22} />
              <h3>{isRTL ? 'הגדרות אימייל (SMTP)' : 'Email Settings (SMTP)'}</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isRTL ? 'שרת SMTP' : 'SMTP Host'}</label>
                <input
                  type="text"
                  name="smtp_host"
                  className="form-input"
                  value={settings.smtp_host}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isRTL ? 'פורט' : 'Port'}</label>
                <input
                  type="text"
                  name="smtp_port"
                  className="form-input"
                  value={settings.smtp_port}
                  onChange={handleChange}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isRTL ? 'שם משתמש' : 'Username'}</label>
                <input
                  type="email"
                  name="smtp_user"
                  className="form-input"
                  value={settings.smtp_user}
                  onChange={handleChange}
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isRTL ? 'סיסמא' : 'Password'}</label>
                <input
                  type="password"
                  name="smtp_pass"
                  className="form-input"
                  value={settings.smtp_pass}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isRTL ? 'שם השולח' : 'From Name'}</label>
                <input
                  type="text"
                  name="email_from_name"
                  className="form-input"
                  value={settings.email_from_name}
                  onChange={handleChange}
                  placeholder="QualiLead"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isRTL ? 'כתובת השולח' : 'From Address'}</label>
                <input
                  type="email"
                  name="email_from_address"
                  className="form-input"
                  value={settings.email_from_address}
                  onChange={handleChange}
                  placeholder="noreply@qualilead.com"
                />
              </div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={testEmailConnection}
              disabled={testingEmail}
            >
              {testingEmail ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <TestTube size={18} />
                  {isRTL ? 'בדוק חיבור' : 'Test Connection'}
                </>
              )}
            </button>
          </div>

          {/* SMS Settings (Twilio) */}
          <div className="settings-card">
            <div className="card-header">
              <MessageSquare size={22} />
              <h3>{isRTL ? 'הגדרות SMS (Twilio)' : 'SMS Settings (Twilio)'}</h3>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sms_enabled"
                  checked={settings.sms_enabled}
                  onChange={handleChange}
                />
                {isRTL ? 'הפעל שליחת SMS' : 'Enable SMS sending'}
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Account SID</label>
              <input
                type="text"
                name="twilio_account_sid"
                className="form-input"
                value={settings.twilio_account_sid}
                onChange={handleChange}
                placeholder="ACxxxxxxxxxxxxxxxx"
                disabled={!settings.sms_enabled}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Auth Token</label>
              <input
                type="password"
                name="twilio_auth_token"
                className="form-input"
                value={settings.twilio_auth_token}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={!settings.sms_enabled}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isRTL ? 'מספר טלפון' : 'Phone Number'}</label>
              <input
                type="tel"
                name="twilio_phone_number"
                className="form-input"
                value={settings.twilio_phone_number}
                onChange={handleChange}
                placeholder="+1234567890"
                disabled={!settings.sms_enabled}
              />
            </div>

            <div className="info-box">
              <Globe size={16} />
              <span>
                {isRTL 
                  ? 'הירשם ב-twilio.com לקבלת פרטי החיבור'
                  : 'Sign up at twilio.com to get your credentials'
                }
              </span>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={testSMSConnection}
              disabled={testingSMS || !settings.sms_enabled}
            >
              {testingSMS ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <TestTube size={18} />
                  {isRTL ? 'בדוק חיבור' : 'Test Connection'}
                </>
              )}
            </button>
          </div>

          {/* Notification Settings */}
          <div className="settings-card">
            <div className="card-header">
              <Bell size={22} />
              <h3>{isRTL ? 'הגדרות התראות' : 'Notification Settings'}</h3>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notify_admin_new_lead"
                  checked={settings.notify_admin_new_lead}
                  onChange={handleChange}
                />
                {isRTL ? 'התראה לאדמין על ליד חדש' : 'Notify admin on new lead'}
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notify_admin_lead_returned"
                  checked={settings.notify_admin_lead_returned}
                  onChange={handleChange}
                />
                {isRTL ? 'התראה לאדמין על החזרת ליד' : 'Notify admin on lead return'}
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notify_client_lead_assigned"
                  checked={settings.notify_client_lead_assigned}
                  onChange={handleChange}
                />
                {isRTL ? 'התראה ללקוח על ליד חדש' : 'Notify client on lead assignment'}
              </label>
            </div>
          </div>

          {/* System Settings */}
          <div className="settings-card">
            <div className="card-header">
              <Shield size={22} />
              <h3>{isRTL ? 'הגדרות מערכת' : 'System Settings'}</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isRTL ? 'יום איפוס חודשי' : 'Monthly Reset Day'}</label>
                <select
                  name="monthly_reset_day"
                  className="form-select"
                  value={settings.monthly_reset_day}
                  onChange={handleChange}
                >
                  {[...Array(28)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{isRTL ? 'חבילת ברירת מחדל' : 'Default Package'}</label>
                <select
                  name="default_package"
                  className="form-select"
                  value={settings.default_package}
                  onChange={handleChange}
                >
                  <option value="starter">{isRTL ? 'התחלתי' : 'Starter'}</option>
                  <option value="professional">{isRTL ? 'מקצועי' : 'Professional'}</option>
                  <option value="enterprise">{isRTL ? 'ארגוני' : 'Enterprise'}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allow_lead_returns"
                  checked={settings.allow_lead_returns}
                  onChange={handleChange}
                />
                {isRTL ? 'אפשר החזרת לידים' : 'Allow lead returns'}
              </label>
            </div>

            {settings.allow_lead_returns && (
              <div className="form-group">
                <label className="form-label">{isRTL ? 'ימים להחזרה' : 'Days to return'}</label>
                <input
                  type="number"
                  name="max_return_days"
                  className="form-input"
                  value={settings.max_return_days}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  style={{ maxWidth: '100px' }}
                />
              </div>
            )}

            <div className="danger-zone">
              <h4>{isRTL ? 'אזור מסוכן' : 'Danger Zone'}</h4>
              <button 
                className="btn btn-danger"
                onClick={resetMonthlyLeads}
              >
                <RefreshCw size={18} />
                {isRTL ? 'אפס מונה חודשי' : 'Reset Monthly Counter'}
              </button>
              <small>
                {isRTL 
                  ? 'פעולה זו תאפס את מספר הלידים שהתקבלו החודש לכל הלקוחות'
                  : 'This will reset the leads received this month for all clients'
                }
              </small>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-footer">
          <button 
            className="btn btn-primary btn-large"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <Save size={20} />
                {isRTL ? 'שמור הגדרות' : 'Save Settings'}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .settings-page {
          min-height: 100vh;
          background: var(--deep-blue);
          padding: var(--space-xl);
        }

        .settings-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: var(--space-xl);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          margin-bottom: var(--space-md);
          transition: var(--transition-base);
        }

        .back-link:hover {
          color: var(--gold);
        }

        .settings-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1.75rem;
        }

        .message {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
        }

        .message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          color: var(--error);
        }

        .message.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
          color: #22c55e;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-xl);
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        .settings-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--slate);
          color: var(--gold);
        }

        .card-header h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          cursor: pointer;
          padding: var(--space-sm) 0;
          color: var(--light-silver);
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: var(--gold);
        }

        .info-box {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: var(--navy);
          border-radius: var(--radius-md);
          color: var(--silver);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);
        }

        .danger-zone {
          margin-top: var(--space-xl);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--error);
        }

        .danger-zone h4 {
          color: var(--error);
          margin-bottom: var(--space-md);
        }

        .danger-zone small {
          display: block;
          margin-top: var(--space-sm);
          color: var(--silver);
          font-size: 0.8rem;
        }

        .btn-danger {
          background: var(--error);
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-large {
          padding: var(--space-md) var(--space-2xl);
          font-size: 1rem;
        }

        .settings-footer {
          display: flex;
          justify-content: center;
          margin-top: var(--space-2xl);
          padding-top: var(--space-xl);
          border-top: 1px solid var(--slate);
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
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

export default SettingsPage;
