import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Send,
  Edit,
  X,
  Mail,
  Phone,
  AlertCircle,
  Check
} from 'lucide-react';

const LeadsManagement = ({ api, isRTL }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [sendVia, setSendVia] = useState('email');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeads();
    fetchClients();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api(`/leads${params}`);
      setLeads(res.leads || []);
    } catch (error) {
      console.error('Fetch leads error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api('/users?role=client&limit=100');
      setClients(res.users || []);
    } catch (error) {
      console.error('Fetch clients error:', error);
    }
  };

  const handleAssign = (lead) => {
    setSelectedLead(lead);
    setShowAssignModal(true);
  };

  const submitAssignment = async () => {
    if (!selectedClient) {
      setMessage({ type: 'error', text: isRTL ? 'יש לבחור לקוח' : 'Please select a client' });
      return;
    }

    try {
      await api(`/leads/${selectedLead.id}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: selectedClient,
          send_via: sendVia
        })
      });
      setMessage({ type: 'success', text: isRTL ? 'הליד הוקצה בהצלחה!' : 'Lead assigned successfully!' });
      setShowAssignModal(false);
      fetchLeads();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6',
      sent: '#22c55e',
      converted: '#d4af37',
      returned: '#f59e0b',
      invalid: '#ef4444'
    };
    return colors[status] || '#888';
  };

  return (
    <div className="leads-management">
      {message.text && (
        <div className={`message ${message.type}`} role="alert">
          {message.type === 'error' ? <AlertCircle size={20} aria-hidden="true" /> : <Check size={20} aria-hidden="true" />}
          {message.text}
        </div>
      )}

      <div className="management-header">
        <div className="filter-tabs" role="tablist" aria-label={isRTL ? 'סינון לידים' : 'Filter leads'}>
          {['all', 'new', 'sent', 'converted', 'returned'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              role="tab"
              aria-selected={filter === status}
              aria-controls="leads-panel"
            >
              {status === 'all' ? (isRTL ? 'הכל' : 'All') : status}
            </button>
          ))}
        </div>
        <Link to="/admin/leads/new" className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          <span className="btn-text">{isRTL ? 'ליד חדש' : 'New Lead'}</span>
        </Link>
      </div>

      {loading ? (
        <div className="loading-container" role="status" aria-label={isRTL ? 'טוען...' : 'Loading...'}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div id="leads-panel" role="tabpanel">
          {/* Desktop Table */}
          <div className="table-container desktop-only">
            <table className="data-table" aria-label={isRTL ? 'טבלת לידים' : 'Leads table'}>
              <thead>
                <tr>
                  <th scope="col">{isRTL ? 'שם' : 'Name'}</th>
                  <th scope="col">{isRTL ? 'טלפון' : 'Phone'}</th>
                  <th scope="col">{isRTL ? 'קטגוריה' : 'Category'}</th>
                  <th scope="col">{isRTL ? 'סטטוס' : 'Status'}</th>
                  <th scope="col">{isRTL ? 'תאריך' : 'Date'}</th>
                  <th scope="col">{isRTL ? 'פעולות' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.customer_name}</td>
                    <td dir="ltr">{lead.customer_phone}</td>
                    <td>{isRTL ? lead.category_name_he : lead.category_name_en}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {lead.status === 'new' && (
                          <button
                            className="action-btn assign"
                            onClick={() => handleAssign(lead)}
                            aria-label={isRTL ? `הקצה ${lead.customer_name}` : `Assign ${lead.customer_name}`}
                          >
                            <Send size={16} aria-hidden="true" />
                          </button>
                        )}
                        <Link
                          to={`/admin/leads/${lead.id}/edit`}
                          className="action-btn edit"
                          aria-label={isRTL ? `ערוך ${lead.customer_name}` : `Edit ${lead.customer_name}`}
                        >
                          <Edit size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards mobile-only" role="list" aria-label={isRTL ? 'רשימת לידים' : 'Leads list'}>
            {leads.map(lead => (
              <article key={lead.id} className="lead-card" role="listitem">
                <div className="lead-card-header">
                  <div className="lead-info">
                    <h4>{lead.customer_name}</h4>
                    <span className="lead-category">{isRTL ? lead.category_name_he : lead.category_name_en}</span>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}
                  >
                    {lead.status}
                  </span>
                </div>
                <div className="lead-card-body">
                  <div className="lead-detail">
                    <Phone size={14} aria-hidden="true" />
                    <span dir="ltr">{lead.customer_phone}</span>
                  </div>
                  <div className="lead-detail">
                    <Mail size={14} aria-hidden="true" />
                    <span>{lead.customer_email || '-'}</span>
                  </div>
                </div>
                <div className="lead-card-footer">
                  <span className="lead-date">{new Date(lead.created_at).toLocaleDateString()}</span>
                  <div className="action-buttons">
                    {lead.status === 'new' && (
                      <button className="action-btn assign" onClick={() => handleAssign(lead)}>
                        <Send size={16} aria-hidden="true" />
                        <span>{isRTL ? 'הקצה' : 'Assign'}</span>
                      </button>
                    )}
                    <Link to={`/admin/leads/${lead.id}/edit`} className="action-btn edit">
                      <Edit size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAssignModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-modal-title"
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="assign-modal-title">{isRTL ? 'הקצה ליד ללקוח' : 'Assign Lead to Client'}</h3>
              <button
                className="close-btn"
                onClick={() => setShowAssignModal(false)}
                aria-label={isRTL ? 'סגור' : 'Close'}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body">
              <div className="assign-lead-info">
                <strong>{selectedLead?.customer_name}</strong>
                <span className="category-tag">
                  {isRTL ? selectedLead?.category_name_he : selectedLead?.category_name_en}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="client-select">{isRTL ? 'בחר לקוח' : 'Select Client'}</label>
                <select
                  id="client-select"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="form-select"
                >
                  <option value="">{isRTL ? 'בחר לקוח...' : 'Select client...'}</option>
                  {clients.filter(c => c.is_active).map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.company_name || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="form-group">
                <legend>{isRTL ? 'שלח באמצעות' : 'Send Via'}</legend>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sendVia"
                      value="email"
                      checked={sendVia === 'email'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Mail size={16} aria-hidden="true" />
                    Email
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sendVia"
                      value="sms"
                      checked={sendVia === 'sms'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Phone size={16} aria-hidden="true" />
                    SMS
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sendVia"
                      value="both"
                      checked={sendVia === 'both'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Send size={16} aria-hidden="true" />
                    {isRTL ? 'שניהם' : 'Both'}
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                {isRTL ? 'ביטול' : 'Cancel'}
              </button>
              <button className="btn btn-primary" onClick={submitAssignment}>
                <Send size={18} aria-hidden="true" />
                {isRTL ? 'הקצה ושלח' : 'Assign & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;
