import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard, Users, FileText, Tags, BarChart3, Bell,
  Plus, Search, Filter, MoreVertical, ChevronRight, TrendingUp,
  TrendingDown, Package, Zap, Clock, CheckCircle, XCircle,
  RefreshCw, LogOut, Settings, Send, Eye, Edit, Trash2, UserPlus
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ClientFormModal from '../../components/admin/ClientFormModal';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

const AdminDashboard = () => {
  const { user, logout, api, isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      
      const [statsRes, leadsRes, usersRes, chartRes, categoryRes, statusRes, activityRes] = await Promise.all([
        api('/analytics/dashboard'),
        api('/leads?limit=10'),
        api('/users?role=client&limit=10'),
        api('/analytics/leads-over-time?months=6'),
        api('/analytics/leads-by-category'),
        api('/analytics/leads-by-status'),
        api('/analytics/recent-activity?limit=10')
      ]);

      setStats(statsRes);
      setLeads(leadsRes.leads || []);
      setClients(usersRes.users || []);
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

  const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];

  const statusColors = {
    new: '#3b82f6',
    sent: '#22c55e',
    converted: '#d4af37',
    returned: '#f59e0b',
    invalid: '#ef4444'
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
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">QL</div>
            <span>QualiLead</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            <span>{isRTL ? 'סקירה כללית' : 'Overview'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <FileText size={20} />
            <span>{isRTL ? 'לידים' : 'Leads'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={20} />
            <span>{isRTL ? 'לקוחות' : 'Clients'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tags size={20} />
            <span>{isRTL ? 'קטגוריות' : 'Categories'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={20} />
            <span>{isRTL ? 'אנליטיקס' : 'Analytics'}</span>
          </button>
          <Link to="/admin/settings" className="nav-item">
            <Settings size={20} />
            <span>{isRTL ? 'הגדרות' : 'Settings'}</span>
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
        {/* Header */}
        <header className="dashboard-header">
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
            <button className="icon-btn" onClick={fetchDashboardData}>
              <RefreshCw size={20} />
            </button>
            <Link to="/admin/leads/new" className="btn btn-primary">
              <Plus size={18} />
              {isRTL ? 'הוסף ליד' : 'Add Lead'}
            </Link>
          </div>
        </header>

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
                    <Send size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.sent_this_month || 0}</span>
                    <span className="stat-label">{isRTL ? 'נשלחו החודש' : 'Sent This Month'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <Users size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.total_clients || 0}</span>
                    <span className="stat-label">{isRTL ? 'לקוחות פעילים' : 'Active Clients'}</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="charts-row">
                <div className="chart-card large">
                  <h3>{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                      <XAxis dataKey="period" stroke="#b8c5d1" />
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
                        dataKey="total" 
                        stroke="#d4af37" 
                        fillOpacity={1} 
                        fill="url(#colorTotal)" 
                        name={isRTL ? 'סה"כ' : 'Total'}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sent" 
                        stroke="#22c55e" 
                        fillOpacity={1} 
                        fill="url(#colorSent)"
                        name={isRTL ? 'נשלחו' : 'Sent'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>{isRTL ? 'לפי סטטוס' : 'By Status'}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="status"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={statusColors[entry.status] || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: '#1e2d3d', 
                          border: '1px solid #2a3f54',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Leads & Activity */}
              <div className="tables-row">
                <div className="table-card">
                  <div className="table-header">
                    <h3>{isRTL ? 'לידים אחרונים' : 'Recent Leads'}</h3>
                    <Link to="/admin/leads" className="view-all">
                      {isRTL ? 'הצג הכל' : 'View All'} <ChevronRight size={16} />
                    </Link>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isRTL ? 'שם' : 'Name'}</th>
                        <th>{isRTL ? 'טלפון' : 'Phone'}</th>
                        <th>{isRTL ? 'קטגוריה' : 'Category'}</th>
                        <th>{isRTL ? 'סטטוס' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map(lead => (
                        <tr key={lead.id}>
                          <td>{lead.customer_name}</td>
                          <td>{lead.customer_phone}</td>
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
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--deep-blue);
        }

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
          z-index: 100;
        }

        .rtl .dashboard-sidebar {
          left: auto;
          right: 0;
          border-right: none;
          border-left: 1px solid var(--slate);
        }

        .sidebar-header {
          padding: var(--space-lg);
          border-bottom: 1px solid var(--slate);
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

        .sidebar-nav {
          flex: 1;
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
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
          transition: var(--transition-base);
        }

        .logout-btn:hover {
          color: var(--error);
        }

        .dashboard-main {
          flex: 1;
          margin-left: 260px;
          padding: var(--space-xl);
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
        }

        .icon-btn:hover {
          color: var(--gold);
        }

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
        }

        .stat-icon.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .stat-icon.green { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .stat-icon.gold { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--white);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--silver);
        }

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

        .chart-card h3 {
          margin-bottom: var(--space-lg);
          font-size: 1.1rem;
        }

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
          font-size: 1.1rem;
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--gold);
          font-size: 0.875rem;
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
          font-size: 0.85rem;
        }

        .data-table td {
          color: var(--light-silver);
          font-size: 0.9rem;
        }

        .status-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.new { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .status-badge.sent { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .status-badge.converted { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .status-badge.returned { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .status-badge.invalid { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

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
          background: var(--slate);
          color: var(--silver);
        }

        .activity-icon.created { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .activity-icon.assigned { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .activity-icon.status_changed { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .activity-icon.returned { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .activity-info {
          display: flex;
          flex-direction: column;
        }

        .activity-text {
          font-size: 0.9rem;
          color: var(--light-silver);
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--silver);
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: var(--space-lg);
        }

        .loading-spinner.large {
          width: 50px;
          height: 50px;
          border: 3px solid var(--slate);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

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
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 60px;
          }
          
          .sidebar-logo span,
          .nav-item span,
          .user-details {
            display: none;
          }
          
          .dashboard-main {
            margin-left: 60px;
          }
          
          .rtl .dashboard-main {
            margin-right: 60px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Sub-components
const LeadsManagement = ({ api, isRTL }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Assign form
  const [assignTo, setAssignTo] = useState('');
  const [sendVia, setSendVia] = useState('email');
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeads();
    fetchCategories();
    fetchClients();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      let query = '/leads?limit=50';
      if (filter.status) query += `&status=${filter.status}`;
      if (filter.category) query += `&category=${filter.category}`;
      
      const res = await api(query);
      setLeads(res.leads || []);
    } catch (error) {
      console.error('Fetch leads error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api('/categories');
      setCategories(res);
    } catch (error) {
      console.error('Fetch categories error:', error);
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

  const handleView = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleEdit = (lead) => {
    navigate(`/admin/leads/${lead.id}/edit`);
  };

  const handleAssignClick = (lead) => {
    setSelectedLead(lead);
    setAssignTo('');
    setSendVia('email');
    setMessage({ type: '', text: '' });
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!assignTo) {
      setMessage({ type: 'error', text: isRTL ? 'בחר לקוח' : 'Select a client' });
      return;
    }

    setAssigning(true);
    setMessage({ type: '', text: '' });

    try {
      await api(`/leads/${selectedLead.id}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          userId: assignTo,
          sendVia: sendVia
        })
      });

      setMessage({ type: 'success', text: isRTL ? 'הליד הוקצה בהצלחה!' : 'Lead assigned successfully!' });
      
      setTimeout(() => {
        setShowAssignModal(false);
        fetchLeads();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || (isRTL ? 'שגיאה בהקצאת הליד' : 'Error assigning lead') });
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async (lead) => {
    if (!confirm(isRTL ? 'האם אתה בטוח שברצונך למחוק ליד זה?' : 'Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await api(`/leads/${lead.id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (error) {
      alert(error.message || 'Error deleting lead');
    }
  };

  const getClientRemaining = (client) => {
    if (client.monthly_lead_limit === -1) return '∞';
    const remaining = client.monthly_lead_limit - (client.leads_received_this_month || 0);
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="leads-management">
      <div className="filters-bar">
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="form-select"
        >
          <option value="">{isRTL ? 'כל הסטטוסים' : 'All Statuses'}</option>
          <option value="new">{isRTL ? 'חדש' : 'New'}</option>
          <option value="sent">{isRTL ? 'נשלח' : 'Sent'}</option>
          <option value="converted">{isRTL ? 'הומר' : 'Converted'}</option>
          <option value="returned">{isRTL ? 'הוחזר' : 'Returned'}</option>
        </select>
        <select 
          value={filter.category} 
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="form-select"
        >
          <option value="">{isRTL ? 'כל הקטגוריות' : 'All Categories'}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {isRTL ? cat.name_he : cat.name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isRTL ? 'שם לקוח' : 'Customer'}</th>
              <th>{isRTL ? 'טלפון' : 'Phone'}</th>
              <th>{isRTL ? 'קטגוריה' : 'Category'}</th>
              <th>{isRTL ? 'סטטוס' : 'Status'}</th>
              <th>{isRTL ? 'הוקצה ל' : 'Assigned To'}</th>
              <th>{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.customer_name}</td>
                <td>{lead.customer_phone}</td>
                <td>{isRTL ? lead.category_name_he : lead.category_name_en}</td>
                <td><span className={`status-badge ${lead.status}`}>{lead.status.toUpperCase()}</span></td>
                <td>{lead.assigned_to_name || '-'}</td>
                <td>
                  <div className="action-buttons">
                    {lead.status === 'new' && (
                      <button 
                        className="icon-btn small gold" 
                        title={isRTL ? 'הקצה' : 'Assign'}
                        onClick={() => handleAssignClick(lead)}
                      >
                        <Send size={16} />
                      </button>
                    )}
                    <button 
                      className="icon-btn small" 
                      title={isRTL ? 'ערוך' : 'Edit'}
                      onClick={() => handleEdit(lead)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="icon-btn small" 
                      title={isRTL ? 'צפה' : 'View'}
                      onClick={() => handleView(lead)}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Lead Modal */}
      {showViewModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowViewModal(false)}>
              <XCircle size={24} />
            </button>
            <h2>{isRTL ? 'פרטי ליד' : 'Lead Details'}</h2>
            
            <div className="lead-details">
              <div className="detail-row">
                <span className="detail-label">{isRTL ? 'שם:' : 'Name:'}</span>
                <span className="detail-value">{selectedLead.customer_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{isRTL ? 'טלפון:' : 'Phone:'}</span>
                <span className="detail-value">
                  <a href={`tel:${selectedLead.customer_phone}`}>{selectedLead.customer_phone}</a>
                </span>
              </div>
              {selectedLead.customer_email && (
                <div className="detail-row">
                  <span className="detail-label">{isRTL ? 'אימייל:' : 'Email:'}</span>
                  <span className="detail-value">
                    <a href={`mailto:${selectedLead.customer_email}`}>{selectedLead.customer_email}</a>
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">{isRTL ? 'קטגוריה:' : 'Category:'}</span>
                <span className="detail-value">{isRTL ? selectedLead.category_name_he : selectedLead.category_name_en}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{isRTL ? 'סטטוס:' : 'Status:'}</span>
                <span className={`status-badge ${selectedLead.status}`}>{selectedLead.status.toUpperCase()}</span>
              </div>
              {selectedLead.service_area && (
                <div className="detail-row">
                  <span className="detail-label">{isRTL ? 'אזור:' : 'Area:'}</span>
                  <span className="detail-value">{selectedLead.service_area}</span>
                </div>
              )}
              {selectedLead.notes && (
                <div className="detail-row">
                  <span className="detail-label">{isRTL ? 'הערות:' : 'Notes:'}</span>
                  <span className="detail-value">{selectedLead.notes}</span>
                </div>
              )}
              {selectedLead.assigned_to_name && (
                <div className="detail-row">
                  <span className="detail-label">{isRTL ? 'הוקצה ל:' : 'Assigned To:'}</span>
                  <span className="detail-value">{selectedLead.assigned_to_name}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">{isRTL ? 'נוצר:' : 'Created:'}</span>
                <span className="detail-value">{new Date(selectedLead.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                {isRTL ? 'סגור' : 'Close'}
              </button>
              <button className="btn btn-primary" onClick={() => { setShowViewModal(false); handleEdit(selectedLead); }}>
                <Edit size={18} />
                {isRTL ? 'ערוך' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAssignModal(false)}>
              <XCircle size={24} />
            </button>
            <h2>
              <Send size={24} />
              {isRTL ? 'הקצה ליד' : 'Assign Lead'}
            </h2>

            <div className="assign-lead-info">
              <p><strong>{selectedLead.customer_name}</strong> - {selectedLead.customer_phone}</p>
              <p className="category-tag">{isRTL ? selectedLead.category_name_he : selectedLead.category_name_en}</p>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{isRTL ? 'בחר לקוח' : 'Select Client'}</label>
              <select
                className="form-select"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <option value="">{isRTL ? '-- בחר לקוח --' : '-- Select Client --'}</option>
                {clients.filter(c => c.is_active).map(client => {
                  const remaining = getClientRemaining(client);
                  const isFull = remaining === 0;
                  return (
                    <option key={client.id} value={client.id} disabled={isFull}>
                      {client.name} ({client.company_name || 'N/A'}) - {isRTL ? 'נותרו:' : 'Remaining:'} {remaining}
                      {isFull ? (isRTL ? ' [מלא]' : ' [Full]') : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isRTL ? 'שלח באמצעות' : 'Send Via'}</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sendVia"
                    value="email"
                    checked={sendVia === 'email'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
                  {isRTL ? 'אימייל' : 'Email'}
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sendVia"
                    value="sms"
                    checked={sendVia === 'sms'}
                    onChange={(e) => setSendVia(e.target.value)}
                  />
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
                  {isRTL ? 'שניהם' : 'Both'}
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                {isRTL ? 'ביטול' : 'Cancel'}
              </button>
              <button className="btn btn-primary" onClick={handleAssign} disabled={assigning}>
                {assigning ? (
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
        </div>
      )}

      <style>{`
        .filters-bar {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }
        
        .filters-bar .form-select {
          min-width: 180px;
        }
        
        .action-buttons {
          display: flex;
          gap: var(--space-xs);
        }
        
        .icon-btn.small {
          padding: var(--space-xs);
        }
        
        .icon-btn.gold {
          color: var(--gold);
        }

        .icon-btn.gold:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        .lead-details {
          background: var(--navy);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin: var(--space-lg) 0;
        }

        .detail-row {
          display: flex;
          padding: var(--space-sm) 0;
          border-bottom: 1px solid var(--slate);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          width: 120px;
          color: var(--silver);
          font-weight: 500;
        }

        .detail-value {
          flex: 1;
          color: var(--white);
        }

        .detail-value a {
          color: var(--gold);
        }

        .assign-lead-info {
          background: var(--navy);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .assign-lead-info .category-tag {
          display: inline-block;
          margin-top: var(--space-sm);
          padding: var(--space-xs) var(--space-md);
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
        }

        .radio-group {
          display: flex;
          gap: var(--space-lg);
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          cursor: pointer;
          color: var(--light-silver);
        }

        .radio-label input {
          accent-color: var(--gold);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
          margin-top: var(--space-xl);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--slate);
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

  const handleSave = () => {
    fetchClients();
  };

  return (
    <div className="clients-management">
      <div className="management-header">
        <button className="btn btn-primary" onClick={handleAdd}>
          <UserPlus size={18} />
          {isRTL ? 'הוסף לקוח' : 'Add Client'}
        </button>
      </div>

      <div className="table-card">
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
                <td>
                  <span className={`package-badge ${client.package_type}`}>
                    {client.package_type}
                  </span>
                </td>
                <td>
                  {client.leads_received_this_month || 0} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}
                </td>
                <td>
                  <span className={`status-badge ${client.is_active ? 'sent' : 'invalid'}`}>
                    {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn small" title="Edit" onClick={() => handleEdit(client)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ClientFormModal
          client={editingClient}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <style>{`
        .management-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--space-lg);
        }

        .package-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .package-badge.starter { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .package-badge.professional { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .package-badge.enterprise { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
        .package-badge.pay_per_lead { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
      `}</style>
    </div>
  );
};

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
      const res = await api('/categories/all');
      setCategories(res);
    } catch (error) {
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleSave = () => {
    fetchCategories();
  };

  return (
    <div className="categories-management">
      <div className="management-header">
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          {isRTL ? 'הוסף קטגוריה' : 'Add Category'}
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isRTL ? 'שם (עברית)' : 'Name (Hebrew)'}</th>
              <th>{isRTL ? 'שם (אנגלית)' : 'Name (English)'}</th>
              <th>{isRTL ? 'סה"כ לידים' : 'Total Leads'}</th>
              <th>{isRTL ? 'לקוחות' : 'Clients'}</th>
              <th>{isRTL ? 'סטטוס' : 'Status'}</th>
              <th>{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name_he}</td>
                <td>{cat.name_en}</td>
                <td>{cat.lead_count || 0}</td>
                <td>{cat.user_count || 0}</td>
                <td>
                  <span className={`status-badge ${cat.is_active ? 'sent' : 'invalid'}`}>
                    {cat.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn small" title="Edit" onClick={() => handleEdit(cat)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AnalyticsView = ({ api, isRTL, chartData, categoryData, statusData }) => {
  const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];

  return (
    <div className="analytics-view">
      <div className="charts-row">
        <div className="chart-card large">
          <h3>{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
              <XAxis dataKey="period" stroke="#b8c5d1" />
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
                dataKey="total" 
                stroke="#d4af37" 
                fillOpacity={1} 
                fill="url(#colorTotal2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>{isRTL ? 'לפי קטגוריה' : 'By Category'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
              <XAxis type="number" stroke="#b8c5d1" />
              <YAxis dataKey={isRTL ? "name_he" : "name_en"} type="category" stroke="#b8c5d1" width={120} />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e2d3d', 
                  border: '1px solid #2a3f54',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#d4af37" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>{isRTL ? 'לפי סטטוס' : 'By Status'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
