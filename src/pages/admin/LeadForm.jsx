import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Tag,
  Send,
  Users,
  AlertCircle,
  Check,
  MessageSquare,
  Smartphone
} from 'lucide-react';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const { isRTL } = useLanguage();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    category_id: '',
    notes: '',
    status: 'new'
  });

  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [sendVia, setSendVia] = useState('email');

  useEffect(() => {
    fetchCategories();
    fetchClients();
    if (isEditing) {
      fetchLead();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setCategories(res.categories || res || []);
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
        customer_phone: res.customer_phone || '',
        customer_email: res.customer_email || '',
        customer_address: res.customer_address || '',
        category_id: res.category_id || '',
        notes: res.notes || '',
        status: res.status || 'new'
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.customer_name || !formData.customer_phone || !formData.category_id) {
      setError(isRTL ? 'יש למלא את כל השדות הנדרשים' : 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await api(`/leads/${id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הליד עודכן בהצלחה!' : 'Lead updated successfully!');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        await api('/leads', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess(isRTL ? 'הליד נוצר בהצלחה!' : 'Lead created successfully!');
        setShowAssign(true);
      }
    } catch (err) {
      setError(err.message || (isRTL ? 'שגיאה בשמירת הליד' : 'Error saving lead'));
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedClient) {
      setError(isRTL ? 'יש לבחור לקוח להקצאה' : 'Please select a client to assign');
      return;
    }

    try {
      setLoading(true);
      // Get the latest lead
      const leadsRes = await api('/leads?status=new&limit=1');
      const leadId = leadsRes.leads?.[0]?.id;

      if (!leadId) {
        throw new Error('Lead not found');
      }

      await api(`/leads/${leadId}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: selectedClient,
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

  const selectedClientInfo = selectedClient ? getClientInfo(selectedClient) : null;

  if (loading && isEditing) {
    return (
      <div className="lead-form-loading">
        <div className="loading-spinner large"></div>
        <p>{isRTL ? 'טוען...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className={`lead-form-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <Link to="/admin/dashboard" className="back-link">
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {isRTL ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'}
          </Link>
          <h1>{isEditing ? (isRTL ? 'עריכת ליד' : 'Edit Lead') : (isRTL ? 'הוספת ליד חדש' : 'Add New Lead')}</h1>
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
            <Check size={20} />
            {success}
          </div>
        )}

        {/* Assign Section (after save) */}
        {showAssign ? (
          <div className="assign-section">
            <div className="assign-header">
              <Send size={24} />
              <h2>{isRTL ? 'הקצה ושלח ליד' : 'Assign & Send Lead'}</h2>
            </div>
            <p className="assign-description">
              {isRTL 
                ? 'הליד נשמר בהצלחה. כעת תוכל להקצות אותו ללקוח ולשלוח אותו מיד.'
                : 'Lead saved successfully. Now you can assign it to a client and send it immediately.'}
            </p>

            <div className="form-group">
              <label className="form-label">
                <Users size={16} />
                {isRTL ? 'בחר לקוח' : 'Select Client'}
              </label>
              <select
                className="form-select"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
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

            {selectedClientInfo && (
              <div className={`client-preview ${selectedClientInfo.canReceive ? '' : 'warning'}`}>
                <h4>{selectedClientInfo.name}</h4>
                <p>{selectedClientInfo.company_name}</p>
                <div className="client-stats">
                  <span>{isRTL ? 'חבילה:' : 'Package:'} {selectedClientInfo.package_type}</span>
                  <span>{isRTL ? 'לידים החודש:' : 'Leads this month:'} {selectedClientInfo.leads_received_this_month}</span>
                  <span>{isRTL ? 'נשארו:' : 'Remaining:'} {selectedClientInfo.remaining}</span>
                </div>
                {!selectedClientInfo.canReceive && (
                  <div className="warning-message">
                    <AlertCircle size={16} />
                    {isRTL ? 'לקוח זה הגיע למגבלת הלידים החודשית' : 'This client has reached their monthly lead limit'}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{isRTL ? 'שלח באמצעות' : 'Send Via'}</label>
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
                  <span>Email</span>
                </label>
                <label className={`send-option ${sendVia === 'sms' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sendVia"
                    value="sms"
                    checked={sendVia === 'sms'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
                  <Smartphone size={18} />
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
                disabled={loading || !selectedClient || !selectedClientInfo?.canReceive}
              >
                {loading ? (
                  <span className="loading-spinner small"></span>
                ) : (
                  <>
                    <Send size={18} />
                    {isRTL ? 'הקצה ושלח' : 'Assign & Send'}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Lead Form */
          <form onSubmit={handleSubmit}>
            {/* Customer Details Section */}
            <div className="form-section">
              <h3>
                <User size={18} />
                {isRTL ? 'פרטי הלקוח' : 'Customer Details'}
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'שם הלקוח' : 'Customer Name'} *
                  </label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="customer_name"
                      className="form-input"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder={isRTL ? 'הכנס שם מלא' : 'Enter full name'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'טלפון' : 'Phone'} *
                  </label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      name="customer_phone"
                      className="form-input"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="050-0000000"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'אימייל' : 'Email'}
                  </label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="customer_email"
                      className="form-input"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'כתובת' : 'Address'}
                  </label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      name="customer_address"
                      className="form-input"
                      value={formData.customer_address}
                      onChange={handleChange}
                      placeholder={isRTL ? 'עיר, רחוב' : 'City, Street'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Details Section */}
            <div className="form-section">
              <h3>
                <FileText size={18} />
                {isRTL ? 'פרטי הליד' : 'Lead Details'}
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {isRTL ? 'קטגוריה' : 'Category'} *
                  </label>
                  <div className="input-wrapper">
                    <Tag size={18} className="input-icon" />
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
                </div>

                {isEditing && (
                  <div className="form-group">
                    <label className="form-label">
                      {isRTL ? 'סטטוס' : 'Status'}
                    </label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="new">{isRTL ? 'חדש' : 'New'}</option>
                      <option value="sent">{isRTL ? 'נשלח' : 'Sent'}</option>
                      <option value="converted">{isRTL ? 'הומר' : 'Converted'}</option>
                      <option value="returned">{isRTL ? 'הוחזר' : 'Returned'}</option>
                      <option value="invalid">{isRTL ? 'לא תקין' : 'Invalid'}</option>
                    </select>
                  </div>
                )}

                <div className="form-group full-width">
                  <label className="form-label">
                    {isRTL ? 'הערות' : 'Notes'}
                  </label>
                  <div className="input-wrapper">
                    <MessageSquare size={18} className="input-icon textarea-icon" />
                    <textarea
                      name="notes"
                      className="form-textarea"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder={isRTL ? 'הערות נוספות...' : 'Additional notes...'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                  <span className="loading-spinner small"></span>
                ) : (
                  <>
                    <Check size={18} />
                    {isEditing 
                      ? (isRTL ? 'עדכן ליד' : 'Update Lead')
                      : (isRTL ? 'צור ליד' : 'Create Lead')
                    }
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        /* ===================================
           Lead Form - Fully Responsive
           =================================== */
        
        .lead-form-page {
          min-height: 100vh;
          background: var(--deep-blue);
          padding: var(--space-xl);
        }

        .lead-form-page.rtl {
          direction: rtl;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Header */
        .form-header {
          margin-bottom: var(--space-xl);
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

        .form-header h1 {
          color: var(--white);
          font-size: 1.75rem;
        }

        /* Messages */
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

        /* Form Sections */
        .form-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--white);
          font-size: 1.1rem;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--slate);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--light-silver);
          font-size: 0.9rem;
          margin-bottom: var(--space-sm);
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--silver);
          pointer-events: none;
        }

        .rtl .input-icon {
          left: auto;
          right: var(--space-md);
        }

        .textarea-icon {
          top: var(--space-md);
          transform: none;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: var(--space-md);
          padding-left: calc(var(--space-md) * 2 + 18px);
          background: var(--slate);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          color: var(--white);
          font-size: 1rem;
          transition: var(--transition-base);
        }

        .rtl .form-input,
        .rtl .form-select,
        .rtl .form-textarea {
          padding-left: var(--space-md);
          padding-right: calc(var(--space-md) * 2 + 18px);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23b8c5d1' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right var(--space-md) center;
        }

        .rtl .form-select {
          background-position: left var(--space-md) center;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          padding-top: var(--space-md);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--gold);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--silver);
        }

        /* Assign Section */
        .assign-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .assign-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .assign-header svg {
          color: var(--gold);
        }

        .assign-header h2 {
          color: var(--white);
          font-size: 1.25rem;
        }

        .assign-description {
          color: var(--silver);
          margin-bottom: var(--space-xl);
        }

        .client-preview {
          background: var(--slate);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          margin-bottom: var(--space-lg);
        }

        .client-preview.warning {
          border: 1px solid var(--error);
        }

        .client-preview h4 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .client-preview p {
          color: var(--silver);
          margin-bottom: var(--space-md);
        }

        .client-stats {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-lg);
          color: var(--light-silver);
          font-size: 0.9rem;
        }

        .warning-message {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--error);
          margin-top: var(--space-md);
          font-size: 0.9rem;
        }

        /* Send Options */
        .send-options {
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .send-option {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          background: var(--slate);
          border: 2px solid var(--slate);
          border-radius: var(--radius-md);
          color: var(--silver);
          cursor: pointer;
          transition: var(--transition-base);
          flex: 1;
          min-width: 120px;
          justify-content: center;
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

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
          margin-top: var(--space-xl);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--slate);
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
          font-size: 1rem;
          min-width: 140px;
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
          background: var(--slate);
          color: var(--light-silver);
        }

        .btn-secondary:hover {
          background: var(--silver);
          color: var(--deep-blue);
        }

        /* Loading */
        .lead-form-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: var(--space-lg);
          color: var(--silver);
        }

        .loading-spinner {
          display: inline-block;
          border: 3px solid var(--slate);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-spinner.large {
          width: 50px;
          height: 50px;
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

        @media (max-width: 768px) {
          .lead-form-page {
            padding: var(--space-md);
          }

          .form-header h1 {
            font-size: 1.5rem;
          }

          .form-section {
            padding: var(--space-lg);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .send-options {
            flex-direction: column;
          }

          .send-option {
            min-width: auto;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }

          .client-stats {
            flex-direction: column;
            gap: var(--space-sm);
          }
        }

        @media (max-width: 480px) {
          .form-section h3 {
            font-size: 1rem;
          }

          .assign-header h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LeadForm;