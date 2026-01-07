import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Home,
  Menu,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Sub-components for different tabs
const LeadsManagement = ({ api, isRTL }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [viewLead, setViewLead] = useState(null);
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
        <div className={`message ${message.type}`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {message.text}
        </div>
      )}

      <div className="management-header">
        <div className="filter-tabs">
          {['all', 'new', 'sent', 'converted', 'returned'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? (isRTL ? 'הכל' : 'All') : status}
            </button>
          ))}
        </div>
        <Link to="/admin/leads/new" className="btn btn-primary">
          <Plus size={18} />
          <span className="btn-text">{isRTL ? 'ליד חדש' : 'New Lead'}</span>
        </Link>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-container desktop-only">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isRTL ? 'שם' : 'Name'}</th>
                  <th>{isRTL ? 'טלפון' : 'Phone'}</th>
                  <th>{isRTL ? 'קטגוריה' : 'Category'}</th>
                  <th>{isRTL ? 'סטטוס' : 'Status'}</th>
                  <th>{isRTL ? 'תאריך' : 'Date'}</th>
                  <th>{isRTL ? 'פעולות' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} onClick={() => setViewLead(lead)} style={{ cursor: 'pointer' }}>
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
                          <button className="action-btn assign" onClick={() => handleAssign(lead)} title={isRTL ? 'הקצה' : 'Assign'}>
                            <Send size={16} />
                          </button>
                        )}
                        <Link to={`/admin/leads/${lead.id}/edit`} className="action-btn edit" title={isRTL ? 'ערוך' : 'Edit'}>
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards mobile-only">
            {leads.map(lead => (
              <div key={lead.id} className="lead-card" onClick={() => setViewLead(lead)} style={{ cursor: 'pointer' }}>
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
                    <Phone size={14} />
                    <span dir="ltr">{lead.customer_phone}</span>
                  </div>
                  <div className="lead-detail">
                    <Mail size={14} />
                    <span>{lead.customer_email || '-'}</span>
                  </div>
                </div>
                <div className="lead-card-footer">
                  <span className="lead-date">{new Date(lead.created_at).toLocaleDateString()}</span>
                  <div className="action-buttons">
                    {lead.status === 'new' && (
                      <button className="action-btn assign" onClick={() => handleAssign(lead)}>
                        <Send size={16} />
                        <span>{isRTL ? 'הקצה' : 'Assign'}</span>
                      </button>
                    )}
                    <Link to={`/admin/leads/${lead.id}/edit`} className="action-btn edit">
                      <Edit size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isRTL ? 'הקצה ליד ללקוח' : 'Assign Lead to Client'}</h3>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                <X size={20} />
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
                <label>{isRTL ? 'בחר לקוח' : 'Select Client'}</label>
                <select 
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

              <div className="form-group">
                <label>{isRTL ? 'שלח באמצעות' : 'Send Via'}</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="email"
                      checked={sendVia === 'email'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Mail size={16} />
                    Email
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="sms"
                      checked={sendVia === 'sms'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Phone size={16} />
                    SMS
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="both"
                      checked={sendVia === 'both'}
                      onChange={(e) => setSendVia(e.target.value)}
                    />
                    <Send size={16} />
                    {isRTL ? 'שניהם' : 'Both'}
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                {isRTL ? 'ביטול' : 'Cancel'}
              </button>
              <button className="btn btn-primary" onClick={submitAssignment}>
                <Send size={18} />
                {isRTL ? 'הקצה ושלח' : 'Assign & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lead Details Modal */}
      {viewLead && (
        <div className="modal-overlay" onClick={() => setViewLead(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%' }}>
            <div className="modal-header">
              <h3>{isRTL ? 'פרטי ליד' : 'Lead Details'}</h3>
              <button className="close-btn" onClick={() => setViewLead(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} /> {isRTL ? 'פרטי לקוח' : 'Customer Info'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'שם' : 'Name'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.customer_name}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'טלפון' : 'Phone'}</div>
                    <a href={`tel:${viewLead.customer_phone}`} style={{ color: 'var(--gold)' }} dir="ltr">{viewLead.customer_phone}</a>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'אימייל' : 'Email'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.customer_email || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'עיר' : 'City'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.customer_address || '-'}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} /> {isRTL ? 'פרטי ליד' : 'Lead Info'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'קטגוריה / דף נחיתה' : 'Category / Landing'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.landing_page || viewLead.category_name_he || viewLead.category_name_en || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'מקור' : 'Source'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.source || 'direct'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'סטטוס' : 'Status'}</div>
                    <span className={`status-badge ${viewLead.status}`} style={{ background: `${getStatusColor(viewLead.status)}20`, color: getStatusColor(viewLead.status) }}>{viewLead.status}</span>
                  </div>
                  <div>
                    <div style={{ color: 'var(--silver)', fontSize: '12px' }}>{isRTL ? 'תאריך' : 'Date'}</div>
                    <div style={{ color: 'var(--white)' }}>{viewLead.created_at ? new Date(viewLead.created_at).toLocaleDateString('he-IL') : '-'}</div>
                  </div>
                </div>
              </div>

              {viewLead.notes && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} /> {isRTL ? 'הערות' : 'Notes'}
                  </h4>
                  <div style={{ 
                    background: 'var(--deep-blue)', 
                    border: '1px solid var(--slate)', 
                    borderRadius: '8px', 
                    padding: '12px',
                    color: 'var(--light-silver)',
                    whiteSpace: 'pre-line',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {viewLead.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setViewLead(null)}>
                {isRTL ? 'סגור' : 'Close'}
              </button>
              <Link to={`/admin/leads/${viewLead.id || viewLead._id}/edit`} className="btn btn-primary">
                <Edit size={16} />
                {isRTL ? 'ערוך' : 'Edit'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientsManagement = ({ api, isRTL, clients: initialClients }) => {
  const [clients, setClients] = useState(initialClients || []);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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

  return (
    <div className="clients-management">
      <div className="management-header">
        <h3>{isRTL ? 'ניהול לקוחות' : 'Client Management'}</h3>
        <button className="btn btn-primary" onClick={handleAdd}>
          <UserPlus size={18} />
          <span className="btn-text">{isRTL ? 'לקוח חדש' : 'New Client'}</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="table-container desktop-only">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isRTL ? 'שם' : 'Name'}</th>
              <th>{isRTL ? 'חברה' : 'Company'}</th>
              <th>{isRTL ? 'חבילה' : 'Package'}</th>
              <th>{isRTL ? 'לידים החודש' : 'Leads This Month'}</th>
              <th>{isRTL ? 'סטטוס' : 'Status'}</th>
              <th>{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.company_name || '-'}</td>
                <td>{client.package_type}</td>
                <td>{client.leads_received_this_month} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</td>
                <td>
                  <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                    {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit" onClick={() => handleEdit(client)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only">
        {clients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-card-header">
              <div className="client-avatar">{client.name?.charAt(0) || 'C'}</div>
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
                <span className="stat-value">{client.leads_received_this_month} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</span>
              </div>
            </div>
            <div className="client-card-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(client)}>
                <Edit size={14} />
                {isRTL ? 'עריכה' : 'Edit'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  return (
    <div className="categories-management">
      <div className="management-header">
        <h3>{isRTL ? 'קטגוריות שירות' : 'Service Categories'}</h3>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span className="btn-text">{isRTL ? 'קטגוריה חדשה' : 'New Category'}</span>
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-icon">
              <Tags size={24} />
            </div>
            <div className="category-info">
              <h4>{isRTL ? cat.name_he : cat.name_en}</h4>
              <p>{isRTL ? cat.description_he : cat.description_en}</p>
            </div>
            <div className="category-status">
              <span className={`status-dot ${cat.is_active ? 'active' : ''}`}></span>
              {cat.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsView = ({ api, isRTL, chartData, categoryData, statusData }) => {
  const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];

  return (
    <div className="analytics-view">
      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3>{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                <XAxis dataKey="month" stroke="#b8c5d1" />
                <YAxis stroke="#b8c5d1" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e2d3d', 
                    border: '1px solid #2a3f54',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#d4af37" 
                  fill="rgba(212, 175, 55, 0.2)"
                  name={isRTL ? 'לידים' : 'Leads'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>{isRTL ? 'לידים לפי קטגוריה' : 'Leads by Category'}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>{isRTL ? 'לידים לפי סטטוס' : 'Leads by Status'}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                <XAxis dataKey="status" stroke="#b8c5d1" />
                <YAxis stroke="#b8c5d1" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e2d3d', 
                    border: '1px solid #2a3f54',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const { user, logout, api, isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/client/dashboard');
      return;
    }
    fetchDashboardData();
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes, clientsRes, chartRes, categoryRes, statusRes, activityRes] = await Promise.all([
        api('/analytics/dashboard'),
        api('/leads?limit=10'),
        api('/users?role=client&limit=10'),
        api('/analytics/leads-over-time?months=6'),
        api('/analytics/leads-by-category'),
        api('/analytics/leads-by-status'),
        api('/analytics/recent-activity?limit=10')
      ]);

      setStats(statsRes);
      setRecentLeads(leadsRes.leads || []);
      setClients(clientsRes.users || []);
      setChartData(chartRes);
      setCategoryData(categoryRes);
      setStatusData(statusRes);
      setRecentActivity(activityRes);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile Header */}
<header className="mobile-header">
  <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
    <Menu size={24} />
  </button>
  <div className="mobile-logo">
    <div className="logo-icon">QL</div>
    <span>QualiLead</span>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <ThemeToggle size="small" />
    <button className="icon-btn" onClick={fetchDashboardData}>
      <RefreshCw size={20} />
    </button>
  </div>
</header>

      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">QL</div>
            <span>QualiLead</span>
          </Link>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <LayoutDashboard size={20} />
            <span>{isRTL ? 'סקירה כללית' : 'Overview'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => handleTabChange('leads')}
          >
            <FileText size={20} />
            <span>{isRTL ? 'לידים' : 'Leads'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => handleTabChange('clients')}
          >
            <Users size={20} />
            <span>{isRTL ? 'לקוחות' : 'Clients'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => handleTabChange('categories')}
          >
            <Tags size={20} />
            <span>{isRTL ? 'קטגוריות' : 'Categories'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleTabChange('analytics')}
          >
            <BarChart3 size={20} />
            <span>{isRTL ? 'אנליטיקס' : 'Analytics'}</span>
          </button>
          <Link to="/admin/settings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Settings size={20} />
            <span>{isRTL ? 'הגדרות' : 'Settings'}</span>
          </Link>
          <Link to="/" className="nav-item home-link" onClick={() => setSidebarOpen(false)}>
  <Home size={20} />
  <span>{isRTL ? 'חזרה לאתר' : 'Back to Site'}</span>
</Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{isRTL ? 'מנהל' : 'Admin'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Desktop Header */}
<header className="dashboard-header desktop-only">
  <div className="header-left">
    <h1>
      {activeTab === 'overview' && (isRTL ? 'סקירה כללית' : 'Dashboard Overview')}
      {activeTab === 'leads' && (isRTL ? 'ניהול לידים' : 'Lead Management')}
      {activeTab === 'clients' && (isRTL ? 'ניהול לקוחות' : 'Client Management')}
      {activeTab === 'categories' && (isRTL ? 'קטגוריות שירות' : 'Service Categories')}
      {activeTab === 'analytics' && (isRTL ? 'אנליטיקס ודוחות' : 'Analytics & Reports')}
    </h1>
  </div>
  <div className="header-right">
    <ThemeToggle size="medium" />
    <button className="icon-btn" onClick={fetchDashboardData}>
      <RefreshCw size={20} />
    </button>
    <Link to="/admin/leads/new" className="btn btn-primary">
      <Plus size={18} />
      {isRTL ? 'הוסף ליד' : 'Add Lead'}
    </Link>
  </div>
</header>

        {/* Mobile Tab Title */}
        <div className="mobile-tab-title mobile-only">
          <h1>
            {activeTab === 'overview' && (isRTL ? 'סקירה כללית' : 'Overview')}
            {activeTab === 'leads' && (isRTL ? 'לידים' : 'Leads')}
            {activeTab === 'clients' && (isRTL ? 'לקוחות' : 'Clients')}
            {activeTab === 'categories' && (isRTL ? 'קטגוריות' : 'Categories')}
            {activeTab === 'analytics' && (isRTL ? 'אנליטיקס' : 'Analytics')}
          </h1>
          {activeTab === 'leads' && (
            <Link to="/admin/leads/new" className="btn btn-primary btn-sm">
              <Plus size={16} />
            </Link>
          )}
        </div>

        {/* Content based on active tab */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <FileText size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.total_leads || 0}</span>
                    <span className="stat-label">{isRTL ? 'סה"כ לידים' : 'Total Leads'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">
                    <Zap size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.new_leads || 0}</span>
                    <span className="stat-label">{isRTL ? 'לידים חדשים' : 'New Leads'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon gold">
                    <Users size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.active_clients || 0}</span>
                    <span className="stat-label">{isRTL ? 'לקוחות פעילים' : 'Active Clients'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.conversion_rate || 0}%</span>
                    <span className="stat-label">{isRTL ? 'אחוז המרה' : 'Conversion'}</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="charts-row">
                <div className="chart-card main-chart">
                  <div className="chart-header">
                    <h3>{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                        <XAxis dataKey="month" stroke="#b8c5d1" />
                        <YAxis stroke="#b8c5d1" />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#1e2d3d', 
                            border: '1px solid #2a3f54',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#d4af37" 
                          fill="rgba(212, 175, 55, 0.2)"
                          name={isRTL ? 'לידים' : 'Leads'}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card side-chart">
                  <div className="chart-header">
                    <h3>{isRTL ? 'לפי קטגוריה' : 'By Category'}</h3>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="count"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tables Row */}
              <div className="tables-row">
                <div className="table-card">
                  <div className="table-header">
                    <h3>{isRTL ? 'לידים אחרונים' : 'Recent Leads'}</h3>
                    <button className="view-all-btn" onClick={() => setActiveTab('leads')}>
                      {isRTL ? 'הצג הכל' : 'View All'}
                      {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                  
                  {/* Desktop Table */}
                  <div className="desktop-only">
                    <table className="data-table compact">
                      <thead>
                        <tr>
                          <th>{isRTL ? 'שם' : 'Name'}</th>
                          <th>{isRTL ? 'קטגוריה' : 'Category'}</th>
                          <th>{isRTL ? 'סטטוס' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentLeads.slice(0, 5).map(lead => (
                          <tr key={lead.id}>
                            <td>{lead.customer_name}</td>
                            <td>{isRTL ? lead.category_name_he : lead.category_name_en}</td>
                            <td>
                              <span className={`status-badge ${lead.status}`}>
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List */}
                  <div className="mobile-only recent-list">
                    {recentLeads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="recent-item">
                        <div className="recent-info">
                          <span className="recent-name">{lead.customer_name}</span>
                          <span className="recent-category">{isRTL ? lead.category_name_he : lead.category_name_en}</span>
                        </div>
                        <span className={`status-badge ${lead.status}`}>{lead.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="table-card">
                  <div className="table-header">
                    <h3>{isRTL ? 'פעילות אחרונה' : 'Recent Activity'}</h3>
                  </div>
                  <div className="activity-list">
                    {recentActivity.slice(0, 5).map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className={`activity-icon ${activity.action}`}>
                          {activity.action === 'created' && <Plus size={14} />}
                          {activity.action === 'assigned' && <Send size={14} />}
                          {activity.action === 'status_changed' && <RefreshCw size={14} />}
                          {activity.action === 'returned' && <XCircle size={14} />}
                        </div>
                        <div className="activity-info">
                          <span className="activity-text">
                            {activity.customer_name} - {activity.action}
                          </span>
                          <span className="activity-time">
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'leads' && (
            <LeadsManagement api={api} isRTL={isRTL} />
          )}

          {activeTab === 'clients' && (
            <ClientsManagement api={api} isRTL={isRTL} clients={clients} />
          )}

          {activeTab === 'categories' && (
            <CategoriesManagement api={api} isRTL={isRTL} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              api={api} 
              isRTL={isRTL} 
              chartData={chartData}
              categoryData={categoryData}
              statusData={statusData}
            />
          )}
        </div>
      </main>

      <style>{`
        /* ===================================
           Admin Dashboard - Fully Responsive
           =================================== */
        
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--deep-blue);
        }

        .admin-dashboard.rtl {
          direction: rtl;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--charcoal);
          border-bottom: 1px solid var(--slate);
          padding: 0 var(--space-md);
          align-items: center;
          justify-content: space-between;
          z-index: 200;
        }

        .mobile-header .menu-toggle {
          padding: var(--space-sm);
          color: var(--white);
          background: none;
          border: none;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 700;
          color: var(--white);
        }

        .mobile-logo .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--gold);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: var(--deep-blue);
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 250;
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 260px;
          background: var(--charcoal);
          border-right: 1px solid var(--slate);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 300;
          transition: transform 0.3s ease;
        }

        .rtl .dashboard-sidebar {
          left: auto;
          right: 0;
          border-right: none;
          border-left: 1px solid var(--slate);
        }

        .close-sidebar {
          display: none;
          padding: var(--space-sm);
          color: var(--silver);
          background: none;
          border: none;
        }

        .sidebar-header {
          padding: var(--space-lg);
          border-bottom: 1px solid var(--slate);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--white);
        }

        .rtl .sidebar-logo {
          font-family: var(--font-hebrew);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--gold);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: var(--deep-blue);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          color: var(--silver);
          transition: var(--transition-base);
          text-align: left;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .rtl .nav-item {
          text-align: right;
        }

        .nav-item:hover {
          background: var(--slate);
          color: var(--white);
        }

        .nav-item.active {
          background: rgba(212, 175, 55, 0.1);
          color: var(--gold);
        }

        .sidebar-footer {
          padding: var(--space-lg);
          border-top: 1px solid var(--slate);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .user-avatar {
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

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: var(--white);
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--silver);
        }

        .logout-btn {
          padding: var(--space-sm);
          color: var(--silver);
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .logout-btn:hover {
          color: var(--error);
        }

        /* Main Content */
        .dashboard-main {
          flex: 1;
          margin-left: 260px;
          padding: var(--space-xl);
          min-height: 100vh;
        }

        .rtl .dashboard-main {
          margin-left: 0;
          margin-right: 260px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
        }

        .dashboard-header h1 {
          font-size: 1.75rem;
          color: var(--white);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .icon-btn {
          padding: var(--space-sm);
          color: var(--silver);
          background: var(--charcoal);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
          border: none;
          cursor: pointer;
        }

        .icon-btn:hover {
          color: var(--gold);
        }

        .mobile-tab-title {
          display: none;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .mobile-tab-title h1 {
          font-size: 1.5rem;
          color: var(--white);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .stat-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .stat-icon.green { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .stat-icon.gold { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

        .stat-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--white);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--silver);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Charts */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .chart-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .chart-card h3, .chart-header h3 {
          color: var(--white);
          font-size: 1rem;
          margin-bottom: var(--space-lg);
        }

        .chart-container {
          width: 100%;
          min-height: 250px;
        }

        /* Tables */
        .tables-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }

        .table-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .table-header h3 {
          color: var(--white);
          font-size: 1rem;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--gold);
          font-size: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: var(--space-md);
          text-align: left;
          border-bottom: 1px solid var(--slate);
        }

        .rtl .data-table th,
        .rtl .data-table td {
          text-align: right;
        }

        .data-table th {
          color: var(--silver);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .data-table td {
          color: var(--light-silver);
        }

        .data-table.compact td {
          padding: var(--space-sm) var(--space-md);
        }

        /* Status Badge */
        .status-badge {
          display: inline-block;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.new { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .status-badge.sent { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .status-badge.converted { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .status-badge.returned { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .status-badge.invalid { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .status-badge.active { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .status-badge.inactive { background: rgba(107, 114, 128, 0.2); color: #6b7280; }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: var(--space-sm);
        }

        .action-btn {
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
          color: var(--silver);
          background: var(--slate);
          border: none;
          cursor: pointer;
          transition: var(--transition-base);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .action-btn:hover {
          color: var(--white);
        }

        .action-btn.assign:hover { background: #3b82f6; }
        .action-btn.edit:hover { background: #d4af37; }
        .action-btn.delete:hover { background: #ef4444; }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .activity-item:hover {
          background: var(--slate);
        }

        .activity-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.created { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .activity-icon.assigned { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .activity-icon.status_changed { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .activity-icon.returned { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .activity-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .activity-text {
          font-size: 0.9rem;
          color: var(--light-silver);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--silver);
        }

        /* Recent List (Mobile) */
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: var(--slate);
          border-radius: var(--radius-md);
        }

        .recent-info {
          display: flex;
          flex-direction: column;
        }

        .recent-name {
          color: var(--white);
          font-weight: 500;
        }

        .recent-category {
          color: var(--silver);
          font-size: 0.8rem;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .lead-card, .client-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .lead-card-header, .client-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-md);
          border-bottom: 1px solid var(--slate);
        }

        .lead-info h4, .client-info h4 {
          color: var(--white);
          font-size: 1rem;
          margin-bottom: var(--space-xs);
        }

        .lead-category, .client-company {
          color: var(--silver);
          font-size: 0.85rem;
        }

        .lead-card-body, .client-card-body {
          padding: var(--space-md);
        }

        .lead-detail {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--silver);
          font-size: 0.9rem;
          margin-bottom: var(--space-sm);
        }

        .lead-card-footer, .client-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          border-top: 1px solid var(--slate);
          background: rgba(0, 0, 0, 0.1);
        }

        .lead-date {
          color: var(--silver);
          font-size: 0.8rem;
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
          margin-right: var(--space-sm);
        }

        .rtl .client-avatar {
          margin-right: 0;
          margin-left: var(--space-sm);
        }

        .client-stat {
          display: flex;
          justify-content: space-between;
          padding: var(--space-sm) 0;
          border-bottom: 1px solid var(--slate);
        }

        .client-stat:last-child {
          border-bottom: none;
        }

        /* Management Header */
        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .filter-tabs {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-full);
          background: var(--charcoal);
          color: var(--silver);
          border: 1px solid var(--slate);
          cursor: pointer;
          transition: var(--transition-base);
          text-transform: capitalize;
          font-size: 0.875rem;
        }

        .filter-tab:hover {
          border-color: var(--gold);
        }

        .filter-tab.active {
          background: var(--gold);
          color: var(--deep-blue);
          border-color: var(--gold);
        }

        /* Categories Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-lg);
        }

        .category-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .category-icon {
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.2);
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

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-lg);
        }

        .charts-grid .full-width {
          grid-column: 1 / -1;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-lg);
        }

        .modal {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg);
          border-bottom: 1px solid var(--slate);
        }

        .modal-header h3 {
          color: var(--white);
        }

        .close-btn {
          padding: var(--space-sm);
          color: var(--silver);
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal-body {
          padding: var(--space-lg);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
          padding: var(--space-lg);
          border-top: 1px solid var(--slate);
        }

        .assign-lead-info {
          background: var(--slate);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .assign-lead-info strong {
          color: var(--white);
          display: block;
          margin-bottom: var(--space-sm);
        }

        .category-tag {
          display: inline-block;
          padding: var(--space-xs) var(--space-md);
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
        }

        .form-group {
          margin-bottom: var(--space-lg);
        }

        .form-group label {
          display: block;
          color: var(--light-silver);
          margin-bottom: var(--space-sm);
          font-weight: 500;
        }

        .form-select {
          width: 100%;
          padding: var(--space-md);
          background: var(--slate);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          color: var(--white);
          font-size: 1rem;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--gold);
        }

        .radio-group {
          display: flex;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--light-silver);
          cursor: pointer;
        }

        .radio-label input {
          accent-color: var(--gold);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-base);
          border: none;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: var(--gold);
          color: var(--deep-blue);
        }

        .btn-primary:hover {
          background: var(--gold-light);
        }

        .btn-secondary {
          background: var(--slate);
          color: var(--light-silver);
        }

        .btn-secondary:hover {
          background: var(--silver);
          color: var(--deep-blue);
        }

        .btn-sm {
          padding: var(--space-sm) var(--space-md);
          font-size: 0.85rem;
        }

        /* Loading */
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: var(--space-lg);
          color: var(--silver);
        }

        .loading-container {
          display: flex;
          justify-content: center;
          padding: var(--space-3xl);
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--slate);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-spinner.large {
          width: 50px;
          height: 50px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Message */
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

        /* Utilities */
        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        .table-container {
          overflow-x: auto;
        }

        /* ===================================
           Responsive Breakpoints
           =================================== */

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-row {
            grid-template-columns: 1fr;
          }

          .tables-row {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          /* Show mobile elements */
          .mobile-header {
            display: flex;
          }

          .sidebar-overlay {
            display: block;
          }

          .mobile-only {
            display: block;
          }

          .desktop-only {
            display: none;
          }

          .mobile-tab-title {
            display: flex;
          }

          /* Hide sidebar by default, show when open */
          .dashboard-sidebar {
            transform: translateX(-100%);
          }

          .rtl .dashboard-sidebar {
            transform: translateX(100%);
          }

          .dashboard-sidebar.open {
            transform: translateX(0);
          }

          .close-sidebar {
            display: block;
          }

          /* Adjust main content */
          .dashboard-main {
            margin-left: 0;
            margin-right: 0;
            padding: var(--space-md);
            padding-top: calc(60px + var(--space-md));
          }

          .rtl .dashboard-main {
            margin-right: 0;
          }

          /* Stats grid 2 columns */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
          }

          .stat-card {
            padding: var(--space-md);
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-value {
            font-size: 1.25rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          /* Filter tabs scroll */
          .filter-tabs {
            overflow-x: auto;
            padding-bottom: var(--space-sm);
            flex-wrap: nowrap;
          }

          .filter-tab {
            white-space: nowrap;
            flex-shrink: 0;
          }

          /* Categories */
          .categories-grid {
            grid-template-columns: 1fr;
          }

          /* Charts */
          .chart-container {
            min-height: 200px;
          }

          /* Modal full width on mobile */
          .modal {
            max-width: 100%;
            margin: var(--space-md);
            max-height: calc(100vh - var(--space-xl));
          }

          /* Radio group stack on mobile */
          .radio-group {
            flex-direction: column;
            gap: var(--space-md);
          }

          /* Button text hide on small screens */
          .btn-text {
            display: none;
          }

          .management-header {
            flex-direction: column;
            align-items: stretch;
          }

          .management-header .btn {
            width: 100%;
            justify-content: center;
          }

          .management-header .btn .btn-text {
            display: inline;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-direction: row;
          }

          .action-buttons {
            flex-wrap: wrap;
          }

          .lead-card-footer .action-btn span {
            display: none;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;