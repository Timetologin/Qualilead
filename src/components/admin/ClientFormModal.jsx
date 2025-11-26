import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  X, User, Mail, Phone, Building, Package, Crown,
  Save, AlertCircle, CheckCircle, Eye, EyeOff
} from 'lucide-react';

const ClientFormModal = ({ client, onClose, onSave }) => {
  const { api } = useAuth();
  const { isRTL } = useLanguage();
  const isEditing = !!client;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    package_type: 'starter',
    monthly_lead_limit: 20,
    categories_allowed: 1,
    is_vip: false,
    is_active: true,
    categories: []
  });

  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        password: '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        package_type: client.package_type || 'starter',
        monthly_lead_limit: client.monthly_lead_limit || 20,
        categories_allowed: client.categories_allowed || 1,
        is_vip: client.is_vip || false,
        is_active: client.is_active !== false,
        categories: client.categories?.map(c => c.id) || []
      });
    }
  }, [client]);

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setAllCategories(res);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handlePackageChange = (e) => {
    const packageType = e.target.value;
    let limit = 20;
    let catAllowed = 1;
    let vip = false;

    switch (packageType) {
      case 'professional':
        limit = 50;
        catAllowed = 3;
        vip = true;
        break;
      case 'enterprise':
        limit = -1;
        catAllowed = -1;
        vip = true;
        break;
      case 'pay_per_lead':
        limit = 0;
        catAllowed = -1;
        break;
    }

    setFormData(prev => ({
      ...prev,
      package_type: packageType,
      monthly_lead_limit: limit,
      categories_allowed: catAllowed,
      is_vip: vip
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(isRTL ? 'שם הלקוח הוא שדה חובה' : 'Client name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError(isRTL ? 'אימייל הוא שדה חובה' : 'Email is required');
      return false;
    }
    if (!isEditing && !formData.password) {
      setError(isRTL ? 'סיסמא היא שדה חובה' : 'Password is required');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setError(isRTL ? 'סיסמא חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
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
      if (isEditing) {
        // Update existing client
        await api(`/users/${client.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            company_name: formData.company_name,
            package_type: formData.package_type,
            monthly_lead_limit: formData.monthly_lead_limit,
            categories_allowed: formData.categories_allowed,
            is_vip: formData.is_vip,
            is_active: formData.is_active,
            categories: formData.categories
          })
        });

        // Reset password if provided
        if (formData.password) {
          await api(`/users/${client.id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ newPassword: formData.password })
          });
        }

        setSuccess(isRTL ? 'הלקוח עודכן בהצלחה!' : 'Client updated successfully!');
      } else {
        // Create new client
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            company_name: formData.company_name,
            package_type: formData.package_type,
            categories: formData.categories
          })
        });

        setSuccess(isRTL ? 'הלקוח נוצר בהצלחה!' : 'Client created successfully!');
      }

      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בשמירת הלקוח' : 'Error saving client'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>
          <User size={24} />
          {isEditing 
            ? (isRTL ? 'עריכת לקוח' : 'Edit Client')
            : (isRTL ? 'הוספת לקוח חדש' : 'Add New Client')
          }
        </h2>

        {error && (
          <div className="message error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-section">
              <h4>{isRTL ? 'פרטים בסיסיים' : 'Basic Information'}</h4>
              
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  {isRTL ? 'שם מלא' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'ישראל ישראלי' : 'John Doe'}
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
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isEditing}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'סיסמא' : 'Password'} {!isEditing && '*'}
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditing 
                      ? (isRTL ? 'השאר ריק לשמור על הקיימת' : 'Leave empty to keep current')
                      : (isRTL ? 'לפחות 6 תווים' : 'At least 6 characters')
                    }
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  {isRTL ? 'טלפון' : 'Phone'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="050-000-0000"
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
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'שם העסק' : 'Business name'}
                />
              </div>
            </div>

            {/* Package & Settings */}
            <div className="form-section">
              <h4>{isRTL ? 'חבילה והגדרות' : 'Package & Settings'}</h4>

              <div className="form-group">
                <label className="form-label">
                  <Package size={16} />
                  {isRTL ? 'סוג חבילה' : 'Package Type'}
                </label>
                <select
                  name="package_type"
                  className="form-select"
                  value={formData.package_type}
                  onChange={handlePackageChange}
                >
                  <option value="starter">{isRTL ? 'התחלתי (20 לידים)' : 'Starter (20 leads)'}</option>
                  <option value="professional">{isRTL ? 'מקצועי (50 לידים)' : 'Professional (50 leads)'}</option>
                  <option value="enterprise">{isRTL ? 'ארגוני (ללא הגבלה)' : 'Enterprise (Unlimited)'}</option>
                  <option value="pay_per_lead">{isRTL ? 'תשלום לפי ליד' : 'Pay Per Lead'}</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'מגבלת לידים' : 'Lead Limit'}
                  </label>
                  <input
                    type="number"
                    name="monthly_lead_limit"
                    className="form-input"
                    value={formData.monthly_lead_limit}
                    onChange={handleChange}
                    min="-1"
                  />
                  <small>{isRTL ? '-1 = ללא הגבלה' : '-1 = Unlimited'}</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'קטגוריות מותרות' : 'Categories Allowed'}
                  </label>
                  <input
                    type="number"
                    name="categories_allowed"
                    className="form-input"
                    value={formData.categories_allowed}
                    onChange={handleChange}
                    min="-1"
                  />
                  <small>{isRTL ? '-1 = הכל' : '-1 = All'}</small>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_vip"
                    checked={formData.is_vip}
                    onChange={handleChange}
                  />
                  <Crown size={16} />
                  {isRTL ? 'לקוח VIP' : 'VIP Client'}
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  {isRTL ? 'לקוח פעיל' : 'Active Client'}
                </label>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="form-section full-width">
            <h4>{isRTL ? 'קטגוריות' : 'Categories'}</h4>
            <div className="categories-grid">
              {allCategories.map(cat => (
                <label 
                  key={cat.id} 
                  className={`category-checkbox ${formData.categories.includes(cat.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  />
                  <span>{isRTL ? cat.name_he : cat.name_en}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {isRTL ? 'ביטול' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing 
                    ? (isRTL ? 'שמור שינויים' : 'Save Changes')
                    : (isRTL ? 'צור לקוח' : 'Create Client')
                  }
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          .modal-content.large {
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-content h2 {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            margin-bottom: var(--space-lg);
            padding-right: var(--space-xl);
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xl);
          }

          @media (max-width: 700px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
          }

          .form-section {
            background: var(--navy);
            border: 1px solid var(--slate);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);
          }

          .form-section.full-width {
            grid-column: 1 / -1;
            margin-top: var(--space-lg);
          }

          .form-section h4 {
            margin-bottom: var(--space-lg);
            color: var(--gold);
            font-size: 1rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
          }

          .form-group small {
            display: block;
            margin-top: var(--space-xs);
            color: var(--silver);
            font-size: 0.75rem;
          }

          .password-input {
            position: relative;
          }

          .password-input .form-input {
            padding-right: 45px;
          }

          .rtl .password-input .form-input {
            padding-right: var(--space-md);
            padding-left: 45px;
          }

          .toggle-password {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--silver);
            padding: var(--space-xs);
          }

          .rtl .toggle-password {
            right: auto;
            left: 12px;
          }

          .toggle-password:hover {
            color: var(--white);
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            cursor: pointer;
            padding: var(--space-sm) 0;
          }

          .checkbox-label input {
            width: 18px;
            height: 18px;
            accent-color: var(--gold);
          }

          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: var(--space-sm);
          }

          .category-checkbox {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: var(--space-sm) var(--space-md);
            background: var(--charcoal);
            border: 2px solid var(--slate);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition-base);
          }

          .category-checkbox:hover {
            border-color: var(--gold);
          }

          .category-checkbox.selected {
            border-color: var(--gold);
            background: rgba(212, 175, 55, 0.1);
          }

          .category-checkbox input {
            accent-color: var(--gold);
          }

          .message {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: var(--space-md);
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

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: var(--space-md);
            margin-top: var(--space-xl);
            padding-top: var(--space-lg);
            border-top: 1px solid var(--slate);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ClientFormModal;
