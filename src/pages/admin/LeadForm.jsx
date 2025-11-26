import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, ArrowRight, Save, Send, User, Phone, Mail,
  MapPin, FileText, Tag, AlertCircle, CheckCircle, Users
} from 'lucide-react';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, isAdmin, user } = useAuth();
  const { isRTL } = useLanguage();

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    category_id: '',
    service_area: '',
    notes: '',
    priority: 'normal'
  });

  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // For assigning
  const [showAssign, setShowAssign] = useState(false);
  const [assignTo, setAssignTo] = useState('');
  const [sendVia, setSendVia] = useState('email');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/client/dashboard');
      return;
    }
    fetchCategories();
    fetchClients();
    if (isEditing) {
      fetchLead();
    }
  }, [id, isAdmin]);

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setCategories(res);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api('/users?role=client&limit=100');
      setClients(res.users || []);
    } catch (err) {
      console.error('Fetch clients error:', err);
    }
  };

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await api(`/leads/${id}`);
      setFormData({
        customer_name: res.customer_name || '',
        customer_email: res.customer_email || '',
        customer_phone: res.customer_phone || '',
        category_id: res.category_id || '',
        service_area: res.service_area || '',
        notes: res.notes || '',
        priority: res.priority || 'normal'
      });
    } catch (err) {
      setError(isRTL ? 'שגיאה בטעינת הליד' : 'Error loading lead');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      setError(isRTL ? 'שם הלקוח הוא שדה חובה' : 'Customer name is required');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      setError(isRTL ? 'טלפון הוא שדה חובה' : 'Phone number is required');
      return false;
    }
    if (!formData.category_id) {
      setError(isRTL ? 'יש לבחור קטגוריה' : 'Please select a category');
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
        await api(`/leads/${id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הליד עודכן בהצלחה!' : 'Lead updated successfully!');
      } else {
        const res = await api('/leads', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הליד נוצר בהצלחה!' : 'Lead created successfully!');
        
        // Show assign option for new leads
        if (res.leadId) {
          setShowAssign(true);
        }
      }
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בשמירת הליד' : 'Error saving lead'));
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTo) {
      setError(isRTL ? 'יש לבחור לקוח להקצאה' : 'Please select a client to assign');
      return;
    }

    setLoading(true);
    try {
      // Get the lead ID - for new leads we need to fetch it
      const leadsRes = await api('/leads?status=new&limit=1');
      const leadId = leadsRes.leads?.[0]?.id;
      
      if (!leadId) {
        throw new Error('Lead not found');
      }

      await api(`/leads/${leadId}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: assignTo,
          send_via: sendVia
        })
      });

      setSuccess(isRTL ? 'הליד הוקצה ונשלח בהצלחה!' : 'Lead assigned and sent successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בהקצאת הליד' : 'Error assigning lead'));
    } finally {
      setLoading(false);
    }
  };

  const getClientInfo = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const remaining = client.monthly_lead_limit === -1 
      ? '∞' 
      : client.monthly_lead_limit - client.leads_received_this_month;
    
    return {
      ...client,
      remaining,
      canReceive: client.monthly_lead_limit === -1 || remaining > 0
    };
  };

  const selectedClient = assignTo ? getClientInfo(assignTo) : null;

  return (
    <div className="lead-form-page">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <Link to="/admin/dashboard" className="back-link">
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {isRTL ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'}
          </Link>
          <h1>
            {isEditing 
              ? (isRTL ? 'עריכת ליד' : 'Edit Lead')
              : (isRTL ? 'הוספת ליד חדש' : 'Add New Lead')
            }
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

        {/* Main Form */}
        {!showAssign ? (
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>
                <User size={18} />
                {isRTL ? 'פרטי הלקוח' : 'Customer Details'}
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'שם הלקוח' : 'Customer Name'} *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    className="form-input"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder={isRTL ? 'הכנס שם מלא' : 'Enter full name'}
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
                  />
                </div>
              </div>

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
            </div>

            <div className="form-section">
              <h3>
                <Tag size={18} />
                {isRTL ? 'פרטי השירות' : 'Service Details'}
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
                  >
                    <option value="">{isRTL ? 'בחר קטגוריה' : 'Select category'}</option>
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

              <div className="form-group">
                <label className="form-label">
                  {isRTL ? 'הערות' : 'Notes'}
                </label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={isRTL ? 'פרטים נוספים על הליד...' : 'Additional details about the lead...'}
                  rows={4}
                />
              </div>
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
                    {isEditing 
                      ? (isRTL ? 'עדכן ליד' : 'Update Lead')
                      : (isRTL ? 'שמור ליד' : 'Save Lead')
                    }
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Assign Section */
          <div className="assign-section">
            <h2>
              <Send size={24} />
              {isRTL ? 'הקצה ושלח ליד' : 'Assign & Send Lead'}
            </h2>
            <p className="assign-description">
              {isRTL 
                ? 'הליד נשמר בהצלחה. כעת תוכל להקצות אותו ללקוח ולשלוח אותו מיד.'
                : 'Lead saved successfully. Now you can assign it to a client and send it immediately.'
              }
            </p>

            <div className="form-group">
              <label className="form-label">
                <Users size={16} />
                {isRTL ? 'בחר לקוח' : 'Select Client'}
              </label>
              <select
                className="form-select"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <option value="">{isRTL ? 'בחר לקוח להקצאה' : 'Select client to assign'}</option>
                {clients.filter(c => c.is_active).map(client => {
                  const info = getClientInfo(client.id);
                  return (
                    <option 
                      key={client.id} 
                      value={client.id}
                      disabled={!info?.canReceive}
                    >
                      {client.name} ({client.company_name || 'N/A'}) - 
                      {isRTL ? ` נשארו: ${info?.remaining}` : ` Remaining: ${info?.remaining}`}
                      {!info?.canReceive && (isRTL ? ' (מלא)' : ' (Full)')}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedClient && (
              <div className={`client-preview ${!selectedClient.canReceive ? 'warning' : ''}`}>
                <h4>{selectedClient.name}</h4>
                <p>{selectedClient.company_name}</p>
                <div className="client-stats">
                  <span>
                    {isRTL ? 'חבילה:' : 'Package:'} {selectedClient.package_type}
                  </span>
                  <span>
                    {isRTL ? 'לידים החודש:' : 'Leads this month:'} {selectedClient.leads_received_this_month}
                  </span>
                  <span>
                    {isRTL ? 'נשארו:' : 'Remaining:'} {selectedClient.remaining}
                  </span>
                </div>
                {!selectedClient.canReceive && (
                  <div className="warning-message">
                    <AlertCircle size={16} />
                    {isRTL 
                      ? 'לקוח זה הגיע למגבלת הלידים החודשית'
                      : 'This client has reached their monthly lead limit'
                    }
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {isRTL ? 'שלח באמצעות' : 'Send Via'}
              </label>
              <div className="send-options">
                <label className={`send-option ${sendVia === 'email' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sendVia"
                    value="email"
                    checked={sendVia === 'email'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
                  <Mail size={18} />
                  <span>{isRTL ? 'אימייל' : 'Email'}</span>
                </label>
                <label className={`send-option ${sendVia === 'sms' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sendVia"
                    value="sms"
                    checked={sendVia === 'sms'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
                  <Phone size={18} />
                  <span>SMS</span>
                </label>
                <label className={`send-option ${sendVia === 'both' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sendVia"
                    value="both"
                    checked={sendVia === 'both'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
                  <Send size={18} />
                  <span>{isRTL ? 'שניהם' : 'Both'}</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/admin/dashboard')}
              >
                {isRTL ? 'הקצה מאוחר יותר' : 'Assign Later'}
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleAssign}
                disabled={loading || !assignTo || !selectedClient?.canReceive}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <Send size={18} />
                    {isRTL ? 'הקצה ושלח' : 'Assign & Send'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .lead-form-page {
          min-height: 100vh;
          background: var(--deep-blue);
          padding: var(--space-xl);
        }

        .form-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .form-header {
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

        .form-header h1 {
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

        .form-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-lg);
        }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1.1rem;
          margin-bottom: var(--space-lg);
          color: var(--gold);
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
          margin-bottom: var(--space-lg);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-sm);
          color: var(--silver);
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
          margin-top: var(--space-xl);
        }

        /* Assign Section */
        .assign-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .assign-section h2 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1.25rem;
          margin-bottom: var(--space-md);
        }

        .assign-description {
          color: var(--silver);
          margin-bottom: var(--space-xl);
        }

        .client-preview {
          background: var(--navy);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          margin-bottom: var(--space-lg);
        }

        .client-preview.warning {
          border-color: var(--error);
        }

        .client-preview h4 {
          margin-bottom: var(--space-xs);
        }

        .client-preview p {
          color: var(--silver);
          margin-bottom: var(--space-md);
        }

        .client-stats {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          font-size: 0.875rem;
          color: var(--silver);
        }

        .warning-message {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-md);
          color: var(--error);
          font-size: 0.875rem;
        }

        .send-options {
          display: flex;
          gap: var(--space-md);
        }

        .send-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: var(--navy);
          border: 2px solid var(--slate);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-base);
        }

        .send-option input {
          display: none;
        }

        .send-option:hover {
          border-color: var(--gold);
        }

        .send-option.selected {
          border-color: var(--gold);
          background: rgba(212, 175, 55, 0.1);
          color: var(--gold);
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

export default LeadForm;
