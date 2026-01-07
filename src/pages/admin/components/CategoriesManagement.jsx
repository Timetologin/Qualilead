import React, { useState, useEffect } from 'react';
import { Plus, Tags, Edit, X, Tag, Save, AlertCircle, CheckCircle,
  Sparkles, Scissors, Wind, Hammer, Plug, Droplet, Store, Building,
  Heart, Car, Camera, Utensils, Briefcase, Home, Zap, Palette } from 'lucide-react';

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

const CategoriesManagement = ({ api, isRTL }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setCategories(res.categories || res || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSave = () => {
    fetchCategories();
    handleCloseModal();
  };

  // Get icon component by name
  const getIconComponent = (iconName) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.icon : Tags;
  };

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-label={isRTL ? 'טוען...' : 'Loading...'}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="categories-management">
      <div className="management-header">
        <h3>{isRTL ? 'קטגוריות שירות' : 'Service Categories'}</h3>
        <button 
          className="btn btn-primary" 
          onClick={handleAdd}
          aria-label={isRTL ? 'הוסף קטגוריה חדשה' : 'Add new category'}
        >
          <Plus size={18} aria-hidden="true" />
          <span className="btn-text">{isRTL ? 'קטגוריה חדשה' : 'New Category'}</span>
        </button>
      </div>

      <div className="categories-grid" role="list" aria-label={isRTL ? 'רשימת קטגוריות' : 'Categories list'}>
        {categories.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--silver)' }}>
            {isRTL ? 'אין קטגוריות להצגה' : 'No categories to display'}
          </div>
        ) : (
          categories.map(cat => {
            const IconComponent = getIconComponent(cat.icon);
            return (
              <article key={cat.id || cat._id} className="category-card" role="listitem">
                <div className="category-icon" aria-hidden="true">
                  <IconComponent size={24} />
                </div>
                <div className="category-info">
                  <h4>{isRTL ? cat.name_he : cat.name_en}</h4>
                  <p>{isRTL ? cat.description_he : cat.description_en}</p>
                </div>
                <div className="category-actions">
                  <div className="category-status">
                    <span className={`status-dot ${cat.is_active ? 'active' : ''}`} aria-hidden="true"></span>
                    <span>{cat.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}</span>
                  </div>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(cat)}
                    aria-label={isRTL ? `ערוך ${cat.name_he}` : `Edit ${cat.name_en}`}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Category Form Modal */}
      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSave={handleSave}
          api={api}
          isRTL={isRTL}
        />
      )}

      <style>{`
        .categories-management {
          width: 100%;
        }

        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .management-header h3 {
          font-size: 1.25rem;
          color: var(--white);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .category-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          transition: var(--transition-base);
        }

        .category-card:hover {
          border-color: var(--gold);
        }

        .category-icon {
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }

        .category-info h4 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .category-info p {
          color: var(--silver);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .category-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: var(--space-md);
          border-top: 1px solid var(--slate);
        }

        .category-status {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--silver);
          font-size: 0.85rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--silver);
        }

        .status-dot.active {
          background: #22c55e;
        }

        .action-btn {
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          transition: var(--transition-base);
        }

        .action-btn.edit {
          background: rgba(212, 175, 55, 0.1);
          color: var(--gold);
        }

        .action-btn.edit:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .management-header {
            flex-direction: column;
            align-items: stretch;
          }

          .management-header .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Category Form Modal Component
const CategoryFormModal = ({ category, onClose, onSave, api, isRTL }) => {
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
      const categoryId = category?.id || category?._id;
      
      if (isEditing) {
        await api(`/categories/${categoryId}`, {
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
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--space-md);
          }

          .modal-content {
            background: var(--charcoal);
            border: 1px solid var(--slate);
            border-radius: var(--radius-xl);
            padding: var(--space-xl);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
          }

          .modal-close {
            position: absolute;
            top: var(--space-md);
            ${isRTL ? 'left' : 'right'}: var(--space-md);
            background: none;
            border: none;
            color: var(--silver);
            cursor: pointer;
            padding: var(--space-xs);
          }

          .modal-close:hover {
            color: var(--white);
          }

          .modal-content h2 {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            margin-bottom: var(--space-lg);
            color: var(--white);
            padding-${isRTL ? 'left' : 'right'}: var(--space-xl);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-lg);
            margin-bottom: var(--space-md);
          }

          @media (max-width: 600px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }

          .form-group {
            margin-bottom: var(--space-md);
          }

          .form-label {
            display: block;
            margin-bottom: var(--space-xs);
            color: var(--light-silver);
            font-size: 0.9rem;
          }

          .form-input,
          .form-textarea {
            width: 100%;
            padding: var(--space-sm) var(--space-md);
            background: var(--slate);
            border: 1px solid var(--slate);
            border-radius: var(--radius-md);
            color: var(--white);
            font-size: 1rem;
          }

          .form-textarea {
            resize: vertical;
            min-height: 80px;
          }

          .form-input:focus,
          .form-textarea:focus {
            outline: none;
            border-color: var(--gold);
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
            cursor: pointer;
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
            color: var(--light-silver);
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

          @media (max-width: 600px) {
            .modal-content {
              padding: var(--space-md);
            }

            .form-actions {
              flex-direction: column;
            }

            .form-actions .btn {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CategoriesManagement;
