import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  X, Tag, Save, AlertCircle, CheckCircle,
  Sparkles, Scissors, Wind, Hammer, Plug, Droplet, Store, Building,
  Heart, Car, Camera, Utensils, Briefcase, Home, Zap, Palette
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Scissors', icon: Scissors },
  { name: 'Wind', icon: Wind },
  { name: 'Hammer', icon: Hammer },
  { name: 'Plug', icon: Plug },
  { name: 'Droplet', icon: Droplet },
  { name: 'Store', icon: Store },
  { name: 'Building', icon: Building },
  { name: 'Heart', icon: Heart },
  { name: 'Car', icon: Car },
  { name: 'Camera', icon: Camera },
  { name: 'Utensils', icon: Utensils },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Home', icon: Home },
  { name: 'Zap', icon: Zap },
  { name: 'Palette', icon: Palette },
  { name: 'Tag', icon: Tag },
];

const CategoryFormModal = ({ category, onClose, onSave }) => {
  const { api } = useAuth();
  const { isRTL } = useLanguage();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name_en: '',
    name_he: '',
    description_en: '',
    description_he: '',
    icon: 'Tag',
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name_en: category.name_en || '',
        name_he: category.name_he || '',
        description_en: category.description_en || '',
        description_he: category.description_he || '',
        icon: category.icon || 'Tag',
        is_active: category.is_active !== false
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name_en.trim()) {
      setError(isRTL ? 'שם באנגלית הוא שדה חובה' : 'English name is required');
      return false;
    }
    if (!formData.name_he.trim()) {
      setError(isRTL ? 'שם בעברית הוא שדה חובה' : 'Hebrew name is required');
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
        await api(`/categories/${category.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הקטגוריה עודכנה בהצלחה!' : 'Category updated successfully!');
      } else {
        await api('/categories', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הקטגוריה נוצרה בהצלחה!' : 'Category created successfully!');
      }

      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בשמירת הקטגוריה' : 'Error saving category'));
    } finally {
      setLoading(false);
    }
  };

  const SelectedIcon = AVAILABLE_ICONS.find(i => i.name === formData.icon)?.icon || Tag;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>
          <SelectedIcon size={24} />
          {isEditing 
            ? (isRTL ? 'עריכת קטגוריה' : 'Edit Category')
            : (isRTL ? 'הוספת קטגוריה חדשה' : 'Add New Category')
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
          {/* Names */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'שם באנגלית' : 'English Name'} *
              </label>
              <input
                type="text"
                name="name_en"
                className="form-input"
                value={formData.name_en}
                onChange={handleChange}
                placeholder="e.g., Beauty Services"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'שם בעברית' : 'Hebrew Name'} *
              </label>
              <input
                type="text"
                name="name_he"
                className="form-input"
                value={formData.name_he}
                onChange={handleChange}
                placeholder="לדוגמא: שירותי יופי"
                dir="rtl"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'תיאור באנגלית' : 'English Description'}
              </label>
              <textarea
                name="description_en"
                className="form-textarea"
                value={formData.description_en}
                onChange={handleChange}
                placeholder="Short description of this category..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'תיאור בעברית' : 'Hebrew Description'}
              </label>
              <textarea
                name="description_he"
                className="form-textarea"
                value={formData.description_he}
                onChange={handleChange}
                placeholder="תיאור קצר של הקטגוריה..."
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="form-group">
            <label className="form-label">
              {isRTL ? 'בחר אייקון' : 'Select Icon'}
            </label>
            <div className="icons-grid">
              {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className={`icon-option ${formData.icon === name ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                  title={name}
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              {isRTL ? 'קטגוריה פעילה' : 'Active Category'}
            </label>
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
                    : (isRTL ? 'צור קטגוריה' : 'Create Category')
                  }
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          .modal-content h2 {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            margin-bottom: var(--space-lg);
            padding-right: var(--space-xl);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-lg);
          }

          @media (max-width: 600px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }

          .icons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            gap: var(--space-sm);
          }

          .icon-option {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-md);
            background: var(--navy);
            border: 2px solid var(--slate);
            border-radius: var(--radius-md);
            color: var(--silver);
            transition: var(--transition-base);
          }

          .icon-option:hover {
            border-color: var(--gold);
            color: var(--gold);
          }

          .icon-option.selected {
            border-color: var(--gold);
            background: rgba(212, 175, 55, 0.2);
            color: var(--gold);
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

export default CategoryFormModal;
