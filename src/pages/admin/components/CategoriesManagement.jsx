import React, { useState, useEffect } from 'react';
import { Plus, Tags } from 'lucide-react';

const CategoriesManagement = ({ api, isRTL }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <button className="btn btn-primary" aria-label={isRTL ? 'הוסף קטגוריה חדשה' : 'Add new category'}>
          <Plus size={18} aria-hidden="true" />
          <span className="btn-text">{isRTL ? 'קטגוריה חדשה' : 'New Category'}</span>
        </button>
      </div>

      <div className="categories-grid" role="list" aria-label={isRTL ? 'רשימת קטגוריות' : 'Categories list'}>
        {categories.map(cat => (
          <article key={cat.id} className="category-card" role="listitem">
            <div className="category-icon" aria-hidden="true">
              <Tags size={24} />
            </div>
            <div className="category-info">
              <h4>{isRTL ? cat.name_he : cat.name_en}</h4>
              <p>{isRTL ? cat.description_he : cat.description_en}</p>
            </div>
            <div className="category-status">
              <span className={`status-dot ${cat.is_active ? 'active' : ''}`} aria-hidden="true"></span>
              <span>{cat.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManagement;
