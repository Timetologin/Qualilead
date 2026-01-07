import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, X, User, Mail, Phone, Building, Package, Crown, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ClientsManagement = ({ api, isRTL, clients: initialClients }) => {
  const [clients, setClients] = useState(initialClients || []);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Update clients when initialClients changes
  useEffect(() => {
    if (initialClients) {
      setClients(initialClients);
    }
  }, [initialClients]);

  const fetchClients = async () => {
    try {
      const res = await api('/users?role=client&limit=100');
      setClients(res.users || []);
    } catch (error) {
      console.error('Fetch clients error:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleSave = () => {
    fetchClients();
    handleCloseModal();
  };

  return (
    <div className="clients-management">
      <div className="management-header">
        <h3>{isRTL ? 'ניהול לקוחות' : 'Client Management'}</h3>
        <button className="btn btn-primary" onClick={handleAdd}>
          <UserPlus size={18} aria-hidden="true" />
          <span className="btn-text">{isRTL ? 'לקוח חדש' : 'New Client'}</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="table-container desktop-only">
        <table className="data-table" aria-label={isRTL ? 'טבלת לקוחות' : 'Clients table'}>
          <thead>
            <tr>
              <th scope="col">{isRTL ? 'שם' : 'Name'}</th>
              <th scope="col">{isRTL ? 'חברה' : 'Company'}</th>
              <th scope="col">{isRTL ? 'חבילה' : 'Package'}</th>
              <th scope="col">{isRTL ? 'לידים החודש' : 'Leads This Month'}</th>
              <th scope="col">{isRTL ? 'סטטוס' : 'Status'}</th>
              <th scope="col">{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--silver)' }}>
                  {isRTL ? 'אין לקוחות להצגה' : 'No clients to display'}
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id || client._id}>
                  <td>{client.name}</td>
                  <td>{client.company_name || '-'}</td>
                  <td>{client.package_type}</td>
                  <td>{client.leads_received_this_month || 0} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</td>
                  <td>
                    <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                      {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(client)}
                        aria-label={isRTL ? `ערוך ${client.name}` : `Edit ${client.name}`}
                      >
                        <Edit size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only" role="list" aria-label={isRTL ? 'רשימת לקוחות' : 'Clients list'}>
        {clients.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--silver)' }}>
            {isRTL ? 'אין לקוחות להצגה' : 'No clients to display'}
          </div>
        ) : (
          clients.map(client => (
            <article key={client.id || client._id} className="client-card" role="listitem">
              <div className="client-card-header">
                <div className="client-avatar" aria-hidden="true">{client.name?.charAt(0) || 'C'}</div>
                <div className="client-info">
                  <h4>{client.name}</h4>
                  <span className="client-company">{client.company_name || '-'}</span>
                </div>
                <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                  {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                </span>
              </div>
              <div className="client-card-body">
                <div className="client-stat">
                  <span className="stat-label">{isRTL ? 'חבילה' : 'Package'}</span>
                  <span className="stat-value">{client.package_type}</span>
                </div>
                <div className="client-stat">
                  <span className="stat-label">{isRTL ? 'לידים החודש' : 'Leads'}</span>
                  <span className="stat-value">{client.leads_received_this_month || 0} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</span>
                </div>
              </div>
              <div className="client-card-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(client)}>
                  <Edit size={14} aria-hidden="true" />
                  {isRTL ? 'עריכה' : 'Edit'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Client Form Modal */}
      {showModal && (
        <ClientFormModal
          client={editingClient}
          onClose={handleCloseModal}
          onSave={handleSave}
          api={api}
          isRTL={isRTL}
        />
      )}

      <style>{`
        .clients-management {
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

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: var(--space-md);
          text-align: ${isRTL ? 'right' : 'left'};
          border-bottom: 1px solid var(--slate);
        }

        .data-table th {
          background: var(--charcoal);
          color: var(--silver);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .data-table td {
          color: var(--light-silver);
        }

        .data-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .action-buttons {
          display: flex;
          gap: var(--space-xs);
        }

        .action-btn {
          padding: var(--space-xs) var(--space-sm);
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

        /* Mobile Cards */
        .mobile-cards {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .client-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
        }

        .client-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .client-avatar {
          width: 40px;
          height: 40px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--deep-blue);
        }

        .client-info {
          flex: 1;
        }

        .client-info h4 {
          margin: 0;
          color: var(--white);
          font-size: 1rem;
        }

        .client-company {
          color: var(--silver);
          font-size: 0.85rem;
        }

        .client-card-body {
          display: flex;
          gap: var(--space-lg);
          padding: var(--space-md) 0;
          border-top: 1px solid var(--slate);
          border-bottom: 1px solid var(--slate);
        }

        .client-stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--silver);
        }

        .stat-value {
          font-weight: 600;
          color: var(--white);
        }

        .client-card-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--space-md);
        }

        @media (max-width: 768px) {
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

// Client Form Modal Component (inline to ensure it's available)
const ClientFormModal = ({ client, onClose, onSave, api, isRTL }) => {
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
        categories: client.categories?.map(c => c.id || c._id || c) || []
      });
    }
  }, [client]);

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setAllCategories(Array.isArray(res) ? res : res.categories || []);
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
      default:
        limit = 20;
        catAllowed = 1;
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
      const clientId = client?.id || client?._id;
      
      if (isEditing) {
        // Update existing client
        await api(`/users/${clientId}`, {
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
          await api(`/users/${clientId}/reset-password`, {
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
            categories: formData.categories,
            role: 'client'
          })
        });

        setSuccess(isRTL ? 'הלקוח נוצר בהצלחה!' : 'Client created successfully!');
      }

      setTimeout(() => {
        onSave();
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
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building size={16} />
                  {isRTL ? 'שם החברה' : 'Company'}
                </label>
                <input
                  type="text"
                  name="company_name"
                  className="form-input"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'שם העסק' : 'Business Name'}
                />
              </div>
            </div>

            {/* Package Settings */}
            <div className="form-section">
              <h4>{isRTL ? 'הגדרות חבילה' : 'Package Settings'}</h4>

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
                  <option value="starter">{isRTL ? 'סטארטר' : 'Starter'}</option>
                  <option value="professional">{isRTL ? 'מקצועי' : 'Professional'}</option>
                  <option value="enterprise">{isRTL ? 'ארגוני' : 'Enterprise'}</option>
                  <option value="pay_per_lead">{isRTL ? 'תשלום לפי ליד' : 'Pay Per Lead'}</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{isRTL ? 'מגבלת לידים חודשית' : 'Monthly Lead Limit'}</label>
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
                  <label className="form-label">{isRTL ? 'מגבלת קטגוריות' : 'Categories Allowed'}</label>
                  <input
                    type="number"
                    name="categories_allowed"
                    className="form-input"
                    value={formData.categories_allowed}
                    onChange={handleChange}
                    min="-1"
                  />
                  <small>{isRTL ? '-1 = ללא הגבלה' : '-1 = Unlimited'}</small>
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
          {allCategories.length > 0 && (
            <div className="form-section full-width">
              <h4>{isRTL ? 'קטגוריות' : 'Categories'}</h4>
              <div className="categories-grid">
                {allCategories.map(cat => {
                  const catId = cat.id || cat._id;
                  return (
                    <label 
                      key={catId} 
                      className={`category-checkbox ${formData.categories.includes(catId) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(catId)}
                        onChange={() => handleCategoryToggle(catId)}
                      />
                      <span>{isRTL ? cat.name_he : cat.name_en}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

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

          .modal-content.large {
            background: var(--charcoal);
            border: 1px solid var(--slate);
            border-radius: var(--radius-xl);
            padding: var(--space-xl);
            max-width: 800px;
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

          .form-group {
            margin-bottom: var(--space-md);
          }

          .form-label {
            display: flex;
            align-items: center;
            gap: var(--space-xs);
            margin-bottom: var(--space-xs);
            color: var(--light-silver);
            font-size: 0.9rem;
          }

          .form-label svg {
            color: var(--gold);
          }

          .form-input,
          .form-select {
            width: 100%;
            padding: var(--space-sm) var(--space-md);
            background: var(--slate);
            border: 1px solid var(--slate);
            border-radius: var(--radius-md);
            color: var(--white);
            font-size: 1rem;
          }

          .form-input:focus,
          .form-select:focus {
            outline: none;
            border-color: var(--gold);
          }

          .form-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .form-group small {
            display: block;
            margin-top: var(--space-xs);
            color: var(--silver);
            font-size: 0.75rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
          }

          .password-input {
            position: relative;
          }

          .password-input .form-input {
            padding-${isRTL ? 'left' : 'right'}: 45px;
          }

          .toggle-password {
            position: absolute;
            ${isRTL ? 'left' : 'right'}: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--silver);
            cursor: pointer;
            padding: var(--space-xs);
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
            color: var(--light-silver);
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
            color: var(--light-silver);
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
            .modal-content.large {
              padding: var(--space-md);
            }

            .form-row {
              grid-template-columns: 1fr;
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

export default ClientsManagement;
