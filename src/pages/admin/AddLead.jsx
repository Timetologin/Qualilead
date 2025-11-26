import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, ArrowRight, Save, User, Phone, Mail, MapPin,
  FileText, Tag, AlertCircle, CheckCircle, Send, Users
} from 'lucide-react';

const AddLeadPage = () => {
  const { api, isAdmin } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    category_id: '',
    service_area: '',
    notes: '',
    priority: 'normal',
    assign_to: '',
    send_via: 'email'
  });

  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignNow, setAssignNow] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/client/dashboard');
      return;
    }
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [catsRes, usersRes] = await Promise.all([
        api('/categories'),
        api('/users?role=client&limit=100')
      ]);
      setCategories(catsRes);
      setClients(usersRes.users || []);
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.customer_name || !formData.customer_phone || !formData.category_id) {
      setError(isRTL ? 'נא למלא את כל השדות החובה' : 'Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create lead
      const createRes = await api('/leads', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          category_id: formData.category_id,
          service_area: formData.service_area,
          notes: formData.notes,
          priority: formData.priority
        })
      });

      // If assign now is checked and user selected
      if (assignNow && formData.assign_to) {
        await api(`/leads/${createRes.leadId}/assign`, {
          method: 'POST',
          body: JSON.stringify({
            user_id: formData.assign_to,
            send_via: formData.send_via
          })
        });
        setSuccess(isRTL ? 'ליד נוצר והוקצה בהצלחה!' : 'Lead created and assigned successfully!');
      } else {
        setSuccess(isRTL ? 'ליד נוצר בהצלחה!' : 'Lead created successfully!');
      }

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        category_id: '',
        service_area: '',
        notes: '',
        priority: 'normal',
        assign_to: '',
        send_via: 'email'
      });
      setAssignNow(false);

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      setError(error.message || (isRTL ? 'שגיאה ביצירת הליד' : 'Error creating lead'));
    } finally {
      setLoading(false);
    }
  };

  const getClientCapacity = (client) => {
    if (client.monthly_lead_limit === -1) return '∞';
    const remaining = client.monthly_lead_limit - client.leads_received_this_month;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="add-lead-page">
      <div className="page-container">
        <div className="page-header">
          <Link to="/admin/dashboard" className="back-link">
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {isRTL ? 'חזרה לדשבורד' : 'Back to Dashboard'}
          </Link>
          <h1>{isRTL ? 'הוספת ליד חדש' : 'Add New Lead'}</h1>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert success">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-section">
            <h3>
              <User size={18} />
              {isRTL ? 'פרטי לקוח' : 'Customer Details'}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'שם לקוח' : 'Customer Name'} *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  className="form-input"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'הכנס שם מלא' : 'Enter full name'}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'טלפון' : 'Phone'} *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  className="form-input"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder={isRTL ? '050-000-0000' : '050-000-0000'}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'אימייל' : 'Email'}
                </label>
                <input
                  type="email"
                  name="customer_email"
                  className="form-input"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder={isRTL ? 'email@example.com' : 'email@example.com'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'אזור שירות' : 'Service Area'}
                </label>
                <input
                  type="text"
                  name="service_area"
                  className="form-input"
                  value={formData.service_area}
                  onChange={handleChange}
                  placeholder={isRTL ? 'תל אביב, מרכז' : 'Tel Aviv, Center'}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>
              <Tag size={18} />
              {isRTL ? 'פרטי ליד' : 'Lead Details'}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'קטגוריה' : 'Category'} *
                </label>
                <select
                  name="category_id"
                  className="form-select"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">{isRTL ? 'בחר קטגוריה' : 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {isRTL ? cat.name_he : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'עדיפות' : 'Priority'}
                </label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">{isRTL ? 'נמוכה' : 'Low'}</option>
                  <option value="normal">{isRTL ? 'רגילה' : 'Normal'}</option>
                  <option value="high">{isRTL ? 'גבוהה' : 'High'}</option>
                  <option value="hot">{isRTL ? 'חם!' : 'Hot!'}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'הערות' : 'Notes'}
              </label>
              <textarea
                name="notes"
                className="form-textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder={isRTL ? 'הערות נוספות...' : 'Additional notes...'}
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="assign-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={assignNow}
                  onChange={(e) => setAssignNow(e.target.checked)}
                />
                <span className="toggle-text">
                  <Send size={18} />
                  {isRTL ? 'הקצה ושלח ליד מיד' : 'Assign and send lead now'}
                </span>
              </label>
            </div>

            {assignNow && (
              <div className="assign-section">
                <h3>
                  <Users size={18} />
                  {isRTL ? 'הקצאת ליד' : 'Lead Assignment'}
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      {isRTL ? 'הקצה ללקוח' : 'Assign to Client'} *
                    </label>
                    <select
                      name="assign_to"
                      className="form-select"
                      value={formData.assign_to}
                      onChange={handleChange}
                      required={assignNow}
                    >
                      <option value="">{isRTL ? 'בחר לקוח' : 'Select Client'}</option>
                      {clients
                        .filter(c => c.is_active)
                        .map(client => (
                          <option 
                            key={client.id} 
                            value={client.id}
                            disabled={getClientCapacity(client) === 0}
                          >
                            {client.name} ({client.company_name || 'N/A'}) - 
                            {isRTL ? ' נותרו: ' : ' Remaining: '}{getClientCapacity(client)}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {isRTL ? 'שלח באמצעות' : 'Send Via'}
                    </label>
                    <select
                      name="send_via"
                      className="form-select"
                      value={formData.send_via}
                      onChange={handleChange}
                    >
                      <option value="email">{isRTL ? 'אימייל' : 'Email'}</option>
                      <option value="sms">{isRTL ? 'SMS' : 'SMS'}</option>
                      <option value="both">{isRTL ? 'שניהם' : 'Both'}</option>
                    </select>
                  </div>
                </div>

                {formData.assign_to && (
                  <div className="selected-client-info">
                    {(() => {
                      const client = clients.find(c => c.id === formData.assign_to);
                      if (!client) return null;
                      return (
                        <div className="client-preview">
                          <div className="client-avatar">{client.name?.charAt(0)}</div>
                          <div className="client-details">
                            <span className="client-name">{client.name}</span>
                            <span className="client-meta">
                              {client.company_name} • {client.package_type} • 
                              {isRTL ? ' קיבל החודש: ' : ' This month: '}
                              {client.leads_received_this_month}/{client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/dashboard')}
            >
              {isRTL ? 'ביטול' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <Save size={18} />
                  {assignNow 
                    ? (isRTL ? 'צור והקצה ליד' : 'Create & Assign Lead')
                    : (isRTL ? 'צור ליד' : 'Create Lead')
                  }
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-lead-page {
          min-height: 100vh;
          background: var(--deep-blue);
          padding: var(--space-xl);
        }

        .page-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: var(--space-xl);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--gold);
          margin-bottom: var(--space-md);
          font-size: 0.9rem;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .page-header h1 {
          font-size: 1.75rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-xl);
        }

        .alert.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          color: var(--error);
        }

        .alert.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
          color: #22c55e;
        }

        .lead-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .form-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
          color: var(--gold);
          font-size: 1.1rem;
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

        .form-group {
          margin-bottom: var(--space-md);
        }

        .form-label {
          display: block;
          margin-bottom: var(--space-xs);
          color: var(--silver);
          font-size: 0.9rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: var(--space-md);
          background: var(--navy);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          color: var(--white);
          font-size: 1rem;
          transition: var(--transition-base);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: var(--gold);
          outline: none;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .assign-toggle {
          margin-bottom: var(--space-lg);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          cursor: pointer;
        }

        .toggle-label input {
          width: 20px;
          height: 20px;
          accent-color: var(--gold);
        }

        .toggle-text {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--white);
          font-weight: 500;
        }

        .assign-section {
          margin-top: var(--space-lg);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--slate);
        }

        .selected-client-info {
          margin-top: var(--space-lg);
        }

        .client-preview {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--navy);
          border-radius: var(--radius-md);
          border: 1px solid var(--gold);
        }

        .client-avatar {
          width: 50px;
          height: 50px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--deep-blue);
          font-size: 1.25rem;
        }

        .client-details {
          display: flex;
          flex-direction: column;
        }

        .client-name {
          font-weight: 600;
          color: var(--white);
        }

        .client-meta {
          font-size: 0.85rem;
          color: var(--silver);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
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

export default AddLeadPage;
