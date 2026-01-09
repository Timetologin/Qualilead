import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Save,
  AlertCircle,
  Check,
  Key,
  Globe,
  Smartphone,
  User,
  Building,
  Layout,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

const SettingsPage = () => {
  const { user, api } = useAuth();
  const { isRTL } = useLanguage();

  // Check if super admin (only admin@qualilead.com)
  const isSuperAdmin = user?.email === 'admin@qualilead.com';

  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: user?.company_name || ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_new_lead: true,
    email_lead_assigned: true,
    email_lead_returned: true,
    sms_new_lead: false,
    sms_urgent: true
  });

  // System settings (admin only)
  const [systemSettings, setSystemSettings] = useState({
    default_lead_limit: 10,
    return_window_hours: 24,
    auto_assign: false
  });

  // Landing Pages (super admin only)
  const [landingPages, setLandingPages] = useState([
    {
      id: 'tattoo',
      name_he: 'קעקועים',
      name_en: 'Tattoo',
      url: '/tattoo-landing.html',
      description_he: 'דף נחיתה לסטודיו קעקועים - עיצוב כהה עם אפקט ציור דיו',
      description_en: 'Landing page for tattoo studio - dark design with ink drawing effect',
      is_active: true,
      color: '#c9a227'
    },
    {
      id: 'security',
      name_he: 'מצלמות אבטחה',
      name_en: 'Security Cameras',
      url: '/security-landing.html',
      description_he: 'דף נחיתה להתקנת מצלמות אבטחה - עיצוב טכנולוגי',
      description_en: 'Landing page for security cameras installation - tech design',
      is_active: true,
      color: '#00b4d8'
    }
  ]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleLandingPage = (pageId) => {
    setLandingPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, is_active: !page.is_active } : page
    ));
    setMessage({
      type: 'success',
      text: isRTL ? 'סטטוס דף הנחיתה עודכן!' : 'Landing page status updated!'
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: isRTL ? 'ההגדרות נשמרו בהצלחה!' : 'Settings saved successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: isRTL ? 'שגיאה בשמירת ההגדרות' : 'Error saving settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Build sections array - include landing pages only for super admin
  const sections = [
    { id: 'profile', icon: User, label: isRTL ? 'פרופיל' : 'Profile' },
    { id: 'notifications', icon: Bell, label: isRTL ? 'התראות' : 'Notifications' },
    { id: 'security', icon: Shield, label: isRTL ? 'אבטחה' : 'Security' },
    { id: 'system', icon: Database, label: isRTL ? 'מערכת' : 'System' },
    ...(isSuperAdmin ? [{ id: 'landing-pages', icon: Layout, label: isRTL ? 'דפי נחיתה' : 'Landing Pages' }] : [])
  ];

  return (
    <div className={`settings-page ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="settings-header">
        <Link to="/admin/dashboard" className="back-link">
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isRTL ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'}
        </Link>
        <h1>
          <Settings size={28} />
          {isRTL ? 'הגדרות' : 'Settings'}
        </h1>
      </header>

      {/* Messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {message.text}
        </div>
      )}

      <div className="settings-container">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={20} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="settings-content">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <User size={24} />
                <div>
                  <h2>{isRTL ? 'פרטי פרופיל' : 'Profile Details'}</h2>
                  <p>{isRTL ? 'עדכן את פרטי החשבון שלך' : 'Update your account information'}</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{isRTL ? 'שם מלא' : 'Full Name'}</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{isRTL ? 'אימייל' : 'Email'}</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{isRTL ? 'טלפון' : 'Phone'}</label>
                  <div className="input-wrapper">
                    <Smartphone size={18} className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{isRTL ? 'שם חברה' : 'Company Name'}</label>
                  <div className="input-wrapper">
                    <Building size={18} className="input-icon" />
                    <input
                      type="text"
                      name="company_name"
                      className="form-input"
                      value={profileData.company_name}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <Bell size={24} />
                <div>
                  <h2>{isRTL ? 'הגדרות התראות' : 'Notification Settings'}</h2>
                  <p>{isRTL ? 'בחר איך תרצה לקבל התראות' : 'Choose how you want to receive notifications'}</p>
                </div>
              </div>

              <div className="notification-group">
                <h3>
                  <Mail size={18} />
                  {isRTL ? 'התראות אימייל' : 'Email Notifications'}
                </h3>
                <div className="toggle-list">
                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'ליד חדש' : 'New Lead'}</span>
                      <span className="toggle-desc">{isRTL ? 'קבל התראה כשמתקבל ליד חדש' : 'Get notified when a new lead arrives'}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-input"
                      checked={notifications.email_new_lead}
                      onChange={() => handleNotificationChange('email_new_lead')}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'ליד הוקצה' : 'Lead Assigned'}</span>
                      <span className="toggle-desc">{isRTL ? 'קבל התראה כשליד מוקצה ללקוח' : 'Get notified when a lead is assigned'}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-input"
                      checked={notifications.email_lead_assigned}
                      onChange={() => handleNotificationChange('email_lead_assigned')}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'ליד הוחזר' : 'Lead Returned'}</span>
                      <span className="toggle-desc">{isRTL ? 'קבל התראה כשליד מוחזר' : 'Get notified when a lead is returned'}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-input"
                      checked={notifications.email_lead_returned}
                      onChange={() => handleNotificationChange('email_lead_returned')}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>
              </div>

              <div className="notification-group">
                <h3>
                  <Smartphone size={18} />
                  {isRTL ? 'התראות SMS' : 'SMS Notifications'}
                </h3>
                <div className="toggle-list">
                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'ליד חדש' : 'New Lead'}</span>
                      <span className="toggle-desc">{isRTL ? 'קבל SMS כשמתקבל ליד חדש' : 'Get SMS when a new lead arrives'}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-input"
                      checked={notifications.sms_new_lead}
                      onChange={() => handleNotificationChange('sms_new_lead')}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'התראות דחופות' : 'Urgent Alerts'}</span>
                      <span className="toggle-desc">{isRTL ? 'קבל SMS להתראות דחופות בלבד' : 'Get SMS for urgent alerts only'}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-input"
                      checked={notifications.sms_urgent}
                      onChange={() => handleNotificationChange('sms_urgent')}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <Shield size={24} />
                <div>
                  <h2>{isRTL ? 'אבטחה וסיסמה' : 'Security & Password'}</h2>
                  <p>{isRTL ? 'נהל את אבטחת החשבון שלך' : 'Manage your account security'}</p>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <Key size={24} />
                </div>
                <div className="security-info">
                  <h4>{isRTL ? 'שינוי סיסמה' : 'Change Password'}</h4>
                  <p>{isRTL ? 'מומלץ לשנות סיסמה כל 3 חודשים' : 'We recommend changing your password every 3 months'}</p>
                </div>
                <button className="btn btn-secondary">
                  {isRTL ? 'שנה סיסמה' : 'Change Password'}
                </button>
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <Globe size={24} />
                </div>
                <div className="security-info">
                  <h4>{isRTL ? 'סשנים פעילים' : 'Active Sessions'}</h4>
                  <p>{isRTL ? 'צפה בכל ההתחברויות הפעילות שלך' : 'View all your active login sessions'}</p>
                </div>
                <button className="btn btn-secondary">
                  {isRTL ? 'צפה בסשנים' : 'View Sessions'}
                </button>
              </div>
            </div>
          )}

          {/* System Section */}
          {activeSection === 'system' && (
            <div className="settings-section">
              <div className="section-header">
                <Database size={24} />
                <div>
                  <h2>{isRTL ? 'הגדרות מערכת' : 'System Settings'}</h2>
                  <p>{isRTL ? 'הגדרות כלליות של המערכת' : 'General system configuration'}</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{isRTL ? 'מגבלת לידים ברירת מחדל' : 'Default Lead Limit'}</label>
                  <input
                    type="number"
                    name="default_lead_limit"
                    className="form-input"
                    value={systemSettings.default_lead_limit}
                    onChange={handleSystemChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isRTL ? 'חלון החזרה (שעות)' : 'Return Window (hours)'}</label>
                  <input
                    type="number"
                    name="return_window_hours"
                    className="form-input"
                    value={systemSettings.return_window_hours}
                    onChange={handleSystemChange}
                    min="1"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="toggle-item standalone">
                    <div className="toggle-info">
                      <span className="toggle-label">{isRTL ? 'הקצאה אוטומטית' : 'Auto-Assign'}</span>
                      <span className="toggle-desc">{isRTL ? 'הקצה לידים אוטומטית ללקוחות לפי קטגוריה' : 'Automatically assign leads to clients by category'}</span>
                    </div>
                    <input
                      type="checkbox"
                      name="auto_assign"
                      className="toggle-input"
                      checked={systemSettings.auto_assign}
                      onChange={handleSystemChange}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Landing Pages Section - SUPER ADMIN ONLY */}
          {activeSection === 'landing-pages' && isSuperAdmin && (
            <div className="settings-section">
              <div className="section-header">
                <Layout size={24} />
                <div>
                  <h2>{isRTL ? 'ניהול דפי נחיתה' : 'Landing Pages Management'}</h2>
                  <p>{isRTL ? 'צפה, הפעל או כבה דפי נחיתה' : 'View, enable or disable landing pages'}</p>
                </div>
              </div>

              <div className="landing-pages-grid">
                {landingPages.map(page => (
                  <div key={page.id} className={`landing-page-card ${!page.is_active ? 'disabled' : ''}`}>
                    <div className="landing-page-header" style={{ borderBottomColor: page.color }}>
                      <div className="landing-page-status">
                        <span 
                          className={`status-dot ${page.is_active ? 'active' : 'inactive'}`}
                          style={{ background: page.is_active ? '#22c55e' : '#ef4444' }}
                        ></span>
                        <span className="status-text">
                          {page.is_active 
                            ? (isRTL ? 'פעיל' : 'Active') 
                            : (isRTL ? 'כבוי' : 'Disabled')
                          }
                        </span>
                      </div>
                      <button 
                        className="landing-toggle-btn"
                        onClick={() => toggleLandingPage(page.id)}
                        title={page.is_active ? 'Disable' : 'Enable'}
                      >
                        {page.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>

                    <div className="landing-page-body">
                      <h3 style={{ color: page.color }}>{isRTL ? page.name_he : page.name_en}</h3>
                      <p>{isRTL ? page.description_he : page.description_en}</p>
                      <div className="landing-page-url">
                        <Globe size={14} />
                        <code>{page.url}</code>
                      </div>
                    </div>

                    <div className="landing-page-actions">
                      <a 
                        href={page.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="preview-btn"
                        style={{ background: page.color }}
                      >
                        <ExternalLink size={16} />
                        {isRTL ? 'תצוגה מקדימה' : 'Preview'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="landing-pages-info">
                <AlertCircle size={18} />
                <span>
                  {isRTL 
                    ? 'דפי נחיתה מכובים לא יקבלו לידים חדשים. הלידים יועברו לדף שגיאה.' 
                    : 'Disabled landing pages will not receive new leads. Leads will be redirected to an error page.'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="settings-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner small"></span>
              ) : (
                <>
                  <Save size={18} />
                  {isRTL ? 'שמור שינויים' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </main>
      </div>

      <style>{`
        /* ===================================
           Settings Page - Fully Responsive
           =================================== */
        
        .settings-page {
          min-height: 100vh;
          background: var(--deep-blue);
          padding: var(--space-xl);
        }

        .settings-page.rtl {
          direction: rtl;
        }

        /* Header */
        .settings-header {
          max-width: 1200px;
          margin: 0 auto var(--space-xl);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--silver);
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
          transition: var(--transition-base);
        }

        .back-link:hover {
          color: var(--gold);
        }

        .settings-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          color: var(--white);
          font-size: 1.75rem;
        }

        /* Messages */
        .message {
          max-width: 1200px;
          margin: 0 auto var(--space-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          border-radius: var(--radius-md);
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

        /* Container */
        .settings-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: var(--space-xl);
        }

        /* Sidebar */
        .settings-sidebar {
          background: var(--charcoal);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          height: fit-content;
          position: sticky;
          top: var(--space-xl);
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .settings-nav .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          color: var(--silver);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-base);
          font-size: 0.95rem;
          text-align: inherit;
        }

        .settings-nav .nav-item:hover {
          background: var(--slate);
          color: var(--white);
        }

        .settings-nav .nav-item.active {
          background: var(--gold);
          color: var(--deep-blue);
        }

        /* Content */
        .settings-content {
          background: var(--charcoal);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .settings-section {
          margin-bottom: var(--space-xl);
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid var(--slate);
        }

        .section-header svg {
          color: var(--gold);
          flex-shrink: 0;
        }

        .section-header h2 {
          color: var(--white);
          font-size: 1.25rem;
          margin-bottom: var(--space-xs);
        }

        .section-header p {
          color: var(--silver);
          font-size: 0.9rem;
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          color: var(--light-silver);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: var(--silver);
        }

        .rtl .input-icon {
          right: var(--space-md);
        }

        .ltr .input-icon {
          left: var(--space-md);
        }

        .form-input {
          width: 100%;
          padding: var(--space-md);
          background: var(--slate);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          color: var(--white);
          font-size: 0.95rem;
          transition: var(--transition-base);
        }

        .rtl .input-wrapper .form-input {
          padding-right: calc(var(--space-md) * 2 + 18px);
        }

        .ltr .input-wrapper .form-input {
          padding-left: calc(var(--space-md) * 2 + 18px);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: var(--charcoal);
        }

        /* Notification Groups */
        .notification-group {
          margin-bottom: var(--space-xl);
        }

        .notification-group:last-child {
          margin-bottom: 0;
        }

        .notification-group h3 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--white);
          font-size: 1rem;
          margin-bottom: var(--space-md);
        }

        .notification-group h3 svg {
          color: var(--gold);
        }

        /* Toggle Items */
        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .toggle-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--slate);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-base);
        }

        .toggle-item:hover {
          background: rgba(42, 63, 84, 0.8);
        }

        .toggle-item.standalone {
          background: var(--slate);
          padding: var(--space-lg);
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-label {
          display: block;
          color: var(--white);
          font-weight: 500;
          margin-bottom: var(--space-xs);
        }

        .toggle-desc {
          display: block;
          color: var(--silver);
          font-size: 0.85rem;
        }

        .toggle-input {
          display: none;
        }

        .toggle-switch {
          width: 48px;
          height: 26px;
          background: var(--charcoal);
          border-radius: var(--radius-full);
          position: relative;
          transition: var(--transition-base);
          flex-shrink: 0;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: var(--silver);
          border-radius: 50%;
          transition: var(--transition-base);
        }

        .toggle-input:checked + .toggle-switch {
          background: var(--gold);
        }

        .toggle-input:checked + .toggle-switch::after {
          transform: translateX(22px);
          background: var(--deep-blue);
        }

        /* Security Cards */
        .security-card {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-lg);
          background: var(--slate);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-md);
        }

        .security-card:last-child {
          margin-bottom: 0;
        }

        .security-icon {
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.2);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
        }

        .security-info {
          flex: 1;
        }

        .security-info h4 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .security-info p {
          color: var(--silver);
          font-size: 0.9rem;
        }

        /* ===================================
           Landing Pages Section
           =================================== */
        
        .landing-pages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
        }

        .landing-page-card {
          background: var(--slate);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition-base);
        }

        .landing-page-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .landing-page-card.disabled {
          opacity: 0.6;
        }

        .landing-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 3px solid;
        }

        .landing-page-status {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-dot.active {
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--silver);
        }

        .landing-toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: var(--radius-md);
          padding: var(--space-sm);
          cursor: pointer;
          color: var(--silver);
          transition: var(--transition-base);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--white);
        }

        .landing-page-body {
          padding: var(--space-lg);
        }

        .landing-page-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }

        .landing-page-body p {
          font-size: 0.9rem;
          color: var(--silver);
          line-height: 1.5;
          margin-bottom: var(--space-md);
        }

        .landing-page-url {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.8rem;
          color: var(--text-muted, #64748b);
        }

        .landing-page-url code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-family: monospace;
        }

        .landing-page-actions {
          padding: 0 var(--space-lg) var(--space-lg);
        }

        .preview-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition-base);
        }

        .preview-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
          filter: brightness(1.1);
        }

        .landing-pages-info {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.3);
          border-radius: var(--radius-md);
          color: #eab308;
          font-size: 0.9rem;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-base);
          border: none;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .btn-primary {
          background: var(--gold);
          color: var(--deep-blue);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--gold-light);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--charcoal);
          color: var(--light-silver);
          border: 1px solid var(--slate);
        }

        .btn-secondary:hover {
          background: var(--slate);
          color: var(--white);
        }

        /* Actions */
        .settings-actions {
          display: flex;
          justify-content: flex-end;
        }

        /* Loading */
        .loading-spinner {
          display: inline-block;
          border: 3px solid var(--slate);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-spinner.small {
          width: 18px;
          height: 18px;
          border-width: 2px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ===================================
           Responsive Breakpoints
           =================================== */

        @media (max-width: 1024px) {
          .settings-container {
            grid-template-columns: 200px 1fr;
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: var(--space-md);
          }

          .settings-header h1 {
            font-size: 1.5rem;
          }

          .settings-container {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            position: static;
            padding: var(--space-md);
          }

          .settings-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: var(--space-sm);
            gap: var(--space-sm);
          }

          .settings-nav .nav-item {
            flex-shrink: 0;
            padding: var(--space-sm) var(--space-md);
          }

          .settings-nav .nav-item span {
            display: none;
          }

          .settings-section {
            padding: var(--space-lg);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            text-align: center;
          }

          .security-card {
            flex-direction: column;
            text-align: center;
          }

          .security-card .btn {
            width: 100%;
          }

          .toggle-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .toggle-switch {
            align-self: flex-end;
          }

          .settings-actions {
            justify-content: stretch;
          }

          .settings-actions .btn {
            width: 100%;
          }

          .landing-pages-grid {
            grid-template-columns: 1fr;
          }

          .landing-pages-info {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .settings-nav .nav-item {
            padding: var(--space-sm);
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;