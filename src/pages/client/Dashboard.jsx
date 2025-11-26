import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard, FileText, Download, Bell, User, LogOut,
  ChevronRight, Phone, Mail, Clock, CheckCircle, XCircle,
  AlertCircle, Star, Crown, MessageCircle, TrendingUp, Package
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ClientDashboard = () => {
  const { user, logout, api, isClient, isVIP } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, leadsRes, notifRes, usageRes] = await Promise.all([
        api('/analytics/dashboard'),
        api('/leads?limit=50'),
        api('/notifications?limit=10'),
        api('/analytics/usage-history')
      ]);

      setStats(statsRes);
      setLeads(leadsRes.leads || []);
      setNotifications(notifRes.notifications || []);
      setUsageHistory(usageRes);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api(`/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const exportLeadsCSV = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leads/export/csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qualilead-token')}`
        }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-leads.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const requestReturn = async (leadId, reason) => {
    try {
      await api(`/leads/${leadId}/return`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Return request error:', error);
    }
  };

  const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444'];

  const getPackageInfo = () => {
    switch (user?.package_type) {
      case 'starter':
        return { name: isRTL ? 'סטארטר' : 'Starter', limit: 20, color: '#3b82f6' };
      case 'professional':
        return { name: isRTL ? 'מקצועי' : 'Professional', limit: 50, color: '#d4af37' };
      case 'enterprise':
        return { name: isRTL ? 'ארגוני' : 'Enterprise', limit: '∞', color: '#8b5cf6' };
      default:
        return { name: isRTL ? 'משלם לפי ליד' : 'Pay Per Lead', limit: '-', color: '#22c55e' };
    }
  };

  const packageInfo = getPackageInfo();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>{isRTL ? 'טוען...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
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
            <span>{isRTL ? 'הלידים שלי' : 'My Leads'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} />
            <span>{isRTL ? 'התראות' : 'Notifications'}</span>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="badge">{notifications.filter(n => !n.is_read).length}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>{isRTL ? 'פרופיל' : 'Profile'}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {isVIP && <Crown size={12} className="vip-crown" />}
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-package" style={{ color: packageInfo.color }}>
                {packageInfo.name}
              </span>
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
              {isRTL ? `שלום, ${user?.name}` : `Hello, ${user?.name}`}
              {isVIP && <Crown size={24} className="vip-icon" />}
            </h1>
            <p className="header-subtitle">
              {isRTL ? user?.company_name || 'ברוך הבא למערכת' : user?.company_name || 'Welcome to your dashboard'}
            </p>
          </div>
          <div className="header-right">
            <button className="btn btn-secondary" onClick={exportLeadsCSV}>
              <Download size={18} />
              {isRTL ? 'ייצוא לידים' : 'Export Leads'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <>
              {/* Usage Card */}
              <div className="usage-card">
                <div className="usage-header">
                  <div>
                    <h3>{isRTL ? 'שימוש החודש' : 'Monthly Usage'}</h3>
                    <p className="package-name" style={{ color: packageInfo.color }}>
                      <Package size={16} />
                      {isRTL ? 'חבילת' : ''} {packageInfo.name}
                    </p>
                  </div>
                  <div className="usage-numbers">
                    <span className="current">{stats?.leads_this_month || 0}</span>
                    <span className="separator">/</span>
                    <span className="limit">{user?.monthly_lead_limit === -1 ? '∞' : user?.monthly_lead_limit}</span>
                  </div>
                </div>
                
                {user?.monthly_lead_limit !== -1 && (
                  <div className="usage-bar">
                    <div 
                      className="usage-fill"
                      style={{ 
                        width: `${Math.min(100, ((stats?.leads_this_month || 0) / user?.monthly_lead_limit) * 100)}%`,
                        background: packageInfo.color
                      }}
                    />
                  </div>
                )}

                <div className="usage-footer">
                  <span>
                    {isRTL ? 'נותרו:' : 'Remaining:'} 
                    <strong>
                      {user?.monthly_lead_limit === -1 
                        ? (isRTL ? 'ללא הגבלה' : 'Unlimited')
                        : Math.max(0, user?.monthly_lead_limit - (stats?.leads_this_month || 0))
                      }
                    </strong>
                  </span>
                  <span>
                    {isRTL ? 'קטגוריות:' : 'Categories:'} 
                    <strong>{stats?.categories_count || 0}</strong>
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid client">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <FileText size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.leads_received || 0}</span>
                    <span className="stat-label">{isRTL ? 'סה"כ לידים' : 'Total Leads'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.leads_this_month || 0}</span>
                    <span className="stat-label">{isRTL ? 'החודש' : 'This Month'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon gold">
                    <Star size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{user?.categories?.length || stats?.categories_count || 0}</span>
                    <span className="stat-label">{isRTL ? 'קטגוריות' : 'Categories'}</span>
                  </div>
                </div>
              </div>

              {/* VIP Manager Card */}
              {isVIP && user?.dedicated_manager && (
                <div className="vip-manager-card">
                  <div className="vip-badge">
                    <Crown size={16} />
                    {isRTL ? 'לקוח VIP' : 'VIP Client'}
                  </div>
                  <h3>{isRTL ? 'המנהל האישי שלך' : 'Your Dedicated Manager'}</h3>
                  <div className="manager-info">
                    <div className="manager-avatar">
                      {user.dedicated_manager.name?.charAt(0)}
                    </div>
                    <div className="manager-details">
                      <span className="manager-name">{user.dedicated_manager.name}</span>
                      <a href={`mailto:${user.dedicated_manager.email}`} className="manager-contact">
                        <Mail size={14} />
                        {user.dedicated_manager.email}
                      </a>
                      {user.dedicated_manager.phone && (
                        <a href={`tel:${user.dedicated_manager.phone}`} className="manager-contact">
                          <Phone size={14} />
                          {user.dedicated_manager.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Leads */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>{isRTL ? 'לידים אחרונים' : 'Recent Leads'}</h3>
                  <button 
                    className="view-all-btn"
                    onClick={() => setActiveTab('leads')}
                  >
                    {isRTL ? 'הצג הכל' : 'View All'}
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="leads-list">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="lead-card">
                      <div className="lead-info">
                        <h4>{lead.customer_name}</h4>
                        <p className="lead-phone">
                          <Phone size={14} />
                          <a href={`tel:${lead.customer_phone}`}>{lead.customer_phone}</a>
                        </p>
                        {lead.customer_email && (
                          <p className="lead-email">
                            <Mail size={14} />
                            <a href={`mailto:${lead.customer_email}`}>{lead.customer_email}</a>
                          </p>
                        )}
                      </div>
                      <div className="lead-meta">
                        <span className="lead-category">
                          {isRTL ? lead.category_name_he : lead.category_name_en}
                        </span>
                        <span className="lead-date">
                          <Clock size={12} />
                          {new Date(lead.sent_at || lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {leads.length === 0 && (
                    <div className="empty-state">
                      <FileText size={48} />
                      <p>{isRTL ? 'אין לידים עדיין' : 'No leads yet'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage History Chart */}
              {usageHistory.length > 0 && (
                <div className="chart-section">
                  <h3>{isRTL ? 'היסטוריית שימוש' : 'Usage History'}</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={usageHistory}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                        dataKey="leads_sent" 
                        stroke="#d4af37" 
                        fillOpacity={1} 
                        fill="url(#colorUsage)"
                        name={isRTL ? 'לידים' : 'Leads'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {activeTab === 'leads' && (
            <LeadsView 
              leads={leads} 
              isRTL={isRTL} 
              onReturn={requestReturn}
              onExport={exportLeadsCSV}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView 
              notifications={notifications}
              isRTL={isRTL}
              onMarkRead={markNotificationRead}
              isVIP={isVIP}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              user={user}
              isRTL={isRTL}
              isVIP={isVIP}
              packageInfo={packageInfo}
            />
          )}
        </div>
      </main>

      <style>{`
        .client-dashboard {
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
          position: relative;
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

        .nav-item .badge {
          position: absolute;
          right: 16px;
          background: var(--error);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }

        .rtl .nav-item .badge {
          right: auto;
          left: 16px;
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
          position: relative;
        }

        .vip-crown {
          position: absolute;
          top: -8px;
          right: -4px;
          color: var(--gold);
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

        .user-package {
          font-size: 0.75rem;
          font-weight: 600;
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
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }

        .dashboard-header h1 {
          font-size: 1.75rem;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .vip-icon {
          color: var(--gold);
        }

        .header-subtitle {
          color: var(--silver);
          margin-top: var(--space-xs);
        }

        .usage-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-lg);
        }

        .usage-header h3 {
          margin-bottom: var(--space-xs);
        }

        .package-name {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .usage-numbers {
          text-align: right;
        }

        .usage-numbers .current {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--gold);
        }

        .usage-numbers .separator {
          color: var(--silver);
          margin: 0 var(--space-xs);
        }

        .usage-numbers .limit {
          font-size: 1.5rem;
          color: var(--silver);
        }

        .usage-bar {
          height: 8px;
          background: var(--slate);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-md);
        }

        .usage-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .usage-footer {
          display: flex;
          justify-content: space-between;
          color: var(--silver);
          font-size: 0.9rem;
        }

        .usage-footer strong {
          color: var(--white);
          margin-left: var(--space-xs);
        }

        .stats-grid.client {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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

        .vip-manager-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid var(--gold);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
          position: relative;
        }

        .vip-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: var(--gold);
          color: var(--deep-blue);
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .rtl .vip-badge {
          right: auto;
          left: 20px;
        }

        .vip-manager-card h3 {
          margin-bottom: var(--space-lg);
          color: var(--gold);
        }

        .manager-info {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .manager-avatar {
          width: 60px;
          height: 60px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--deep-blue);
        }

        .manager-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .manager-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--white);
        }

        .manager-contact {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          font-size: 0.9rem;
        }

        .manager-contact:hover {
          color: var(--gold);
        }

        .recent-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--gold);
          font-size: 0.9rem;
        }

        .leads-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .lead-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg);
          background: var(--navy);
          border-radius: var(--radius-md);
          border: 1px solid var(--slate);
          transition: var(--transition-base);
        }

        .lead-card:hover {
          border-color: var(--gold);
        }

        .lead-info h4 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .lead-phone, .lead-email {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          font-size: 0.9rem;
        }

        .lead-phone a, .lead-email a {
          color: var(--gold);
        }

        .lead-meta {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .lead-category {
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
        }

        .lead-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-2xl);
          color: var(--silver);
        }

        .empty-state svg {
          margin-bottom: var(--space-md);
          opacity: 0.5;
        }

        .chart-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .chart-section h3 {
          margin-bottom: var(--space-lg);
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .stats-grid.client {
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
        }
      `}</style>
    </div>
  );
};

// Sub-components
const LeadsView = ({ leads, isRTL, onReturn, onExport }) => {
  const [filter, setFilter] = useState({ status: '', search: '' });
  
  const filteredLeads = leads.filter(lead => {
    if (filter.status && lead.status !== filter.status) return false;
    if (filter.search) {
      const search = filter.search.toLowerCase();
      return lead.customer_name.toLowerCase().includes(search) ||
             lead.customer_phone.includes(search);
    }
    return true;
  });

  return (
    <div className="leads-view">
      <div className="view-header">
        <h2>{isRTL ? 'הלידים שלי' : 'My Leads'}</h2>
        <button className="btn btn-secondary" onClick={onExport}>
          <Download size={18} />
          {isRTL ? 'ייצוא CSV' : 'Export CSV'}
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="form-input"
          placeholder={isRTL ? 'חיפוש...' : 'Search...'}
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <select
          className="form-select"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">{isRTL ? 'כל הסטטוסים' : 'All Statuses'}</option>
          <option value="sent">{isRTL ? 'נשלח' : 'Sent'}</option>
          <option value="converted">{isRTL ? 'הומר' : 'Converted'}</option>
          <option value="returned">{isRTL ? 'הוחזר' : 'Returned'}</option>
        </select>
      </div>

      <div className="leads-grid">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="lead-detail-card">
            <div className="lead-header">
              <h3>{lead.customer_name}</h3>
              <span className={`status-badge ${lead.status}`}>{lead.status}</span>
            </div>
            <div className="lead-body">
              <p><Phone size={14} /> <a href={`tel:${lead.customer_phone}`}>{lead.customer_phone}</a></p>
              {lead.customer_email && (
                <p><Mail size={14} /> <a href={`mailto:${lead.customer_email}`}>{lead.customer_email}</a></p>
              )}
              <p className="lead-category-tag">
                {isRTL ? lead.category_name_he : lead.category_name_en}
              </p>
              {lead.notes && <p className="lead-notes">{lead.notes}</p>}
            </div>
            <div className="lead-footer">
              <span className="lead-date">
                <Clock size={12} />
                {new Date(lead.sent_at || lead.created_at).toLocaleDateString()}
              </span>
              {lead.status === 'sent' && (
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    const reason = prompt(isRTL ? 'סיבת ההחזרה:' : 'Return reason:');
                    if (reason) onReturn(lead.id, reason);
                  }}
                >
                  {isRTL ? 'בקש החזרה' : 'Request Return'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .leads-view {
          padding: var(--space-md);
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
        }

        .filters-bar {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .filters-bar .form-input {
          flex: 1;
          max-width: 300px;
        }

        .leads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-lg);
        }

        .lead-detail-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .lead-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          background: var(--navy);
          border-bottom: 1px solid var(--slate);
        }

        .lead-header h3 {
          font-size: 1rem;
        }

        .lead-body {
          padding: var(--space-lg);
        }

        .lead-body p {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
          color: var(--silver);
        }

        .lead-body a {
          color: var(--gold);
        }

        .lead-category-tag {
          display: inline-block;
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold) !important;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          margin-top: var(--space-sm);
        }

        .lead-notes {
          margin-top: var(--space-md);
          padding: var(--space-sm);
          background: var(--navy);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .lead-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--slate);
        }

        .lead-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          font-size: 0.85rem;
        }

        .btn-sm {
          padding: var(--space-xs) var(--space-md);
          font-size: 0.85rem;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--gold);
          color: var(--gold);
        }

        .btn-outline:hover {
          background: var(--gold);
          color: var(--deep-blue);
        }

        .status-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.sent { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .status-badge.converted { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .status-badge.returned { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
      `}</style>
    </div>
  );
};

const NotificationsView = ({ notifications, isRTL, onMarkRead, isVIP }) => {
  return (
    <div className="notifications-view">
      <h2>{isRTL ? 'התראות' : 'Notifications'}</h2>

      <div className="notifications-list">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`notification-card ${notif.is_read ? 'read' : ''} ${notif.type}`}
            onClick={() => !notif.is_read && onMarkRead(notif.id)}
          >
            <div className="notification-icon">
              {notif.type === 'success' && <CheckCircle size={20} />}
              {notif.type === 'warning' && <AlertCircle size={20} />}
              {notif.type === 'error' && <XCircle size={20} />}
              {notif.type === 'vip' && <Crown size={20} />}
              {notif.type === 'info' && <Bell size={20} />}
            </div>
            <div className="notification-content">
              <h4>{notif.title}</h4>
              <p>{notif.message}</p>
              <span className="notification-time">
                {new Date(notif.created_at).toLocaleString()}
              </span>
            </div>
            {!notif.is_read && <div className="unread-dot" />}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="empty-state">
            <Bell size={48} />
            <p>{isRTL ? 'אין התראות' : 'No notifications'}</p>
          </div>
        )}
      </div>

      <style>{`
        .notifications-view {
          padding: var(--space-md);
        }

        .notifications-view h2 {
          margin-bottom: var(--space-xl);
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .notification-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition-base);
          position: relative;
        }

        .notification-card:hover {
          border-color: var(--gold);
        }

        .notification-card.read {
          opacity: 0.6;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-card.success .notification-icon {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .notification-card.warning .notification-icon {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .notification-card.error .notification-icon {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .notification-card.vip .notification-icon {
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
        }

        .notification-card.info .notification-icon {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .notification-content p {
          color: var(--silver);
          font-size: 0.9rem;
          margin-bottom: var(--space-sm);
        }

        .notification-time {
          color: var(--silver);
          font-size: 0.8rem;
        }

        .unread-dot {
          width: 10px;
          height: 10px;
          background: var(--gold);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-2xl);
          color: var(--silver);
        }
      `}</style>
    </div>
  );
};

const ProfileView = ({ user, isRTL, isVIP, packageInfo }) => {
  return (
    <div className="profile-view">
      <h2>{isRTL ? 'פרופיל' : 'Profile'}</h2>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {isVIP && <Crown size={16} className="vip-crown" />}
            {user?.name?.charAt(0)}
          </div>
          <div className="profile-info">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className="package-tag" style={{ background: `${packageInfo.color}20`, color: packageInfo.color }}>
              {packageInfo.name}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'טלפון' : 'Phone'}</span>
            <span className="detail-value">{user?.phone || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'חברה' : 'Company'}</span>
            <span className="detail-value">{user?.company_name || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'מגבלת לידים חודשית' : 'Monthly Lead Limit'}</span>
            <span className="detail-value">
              {user?.monthly_lead_limit === -1 ? (isRTL ? 'ללא הגבלה' : 'Unlimited') : user?.monthly_lead_limit}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'קטגוריות מותרות' : 'Categories Allowed'}</span>
            <span className="detail-value">
              {user?.categories_allowed === -1 ? (isRTL ? 'הכל' : 'All') : user?.categories_allowed}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'סטטוס VIP' : 'VIP Status'}</span>
            <span className="detail-value">
              {isVIP ? (
                <span className="vip-status">
                  <Crown size={14} />
                  {isRTL ? 'כן' : 'Yes'}
                </span>
              ) : (isRTL ? 'לא' : 'No')}
            </span>
          </div>
        </div>

        {user?.categories && user.categories.length > 0 && (
          <div className="profile-categories">
            <h4>{isRTL ? 'הקטגוריות שלי' : 'My Categories'}</h4>
            <div className="categories-list">
              {user.categories.map(cat => (
                <span key={cat.id} className="category-tag">
                  {isRTL ? cat.name_he : cat.name_en}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-view {
          padding: var(--space-md);
        }

        .profile-view h2 {
          margin-bottom: var(--space-xl);
        }

        .profile-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl);
          background: var(--navy);
          border-bottom: 1px solid var(--slate);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--deep-blue);
          position: relative;
        }

        .profile-avatar .vip-crown {
          position: absolute;
          top: -8px;
          right: -4px;
          color: var(--gold);
          background: var(--deep-blue);
          padding: 4px;
          border-radius: 50%;
        }

        .profile-info h3 {
          font-size: 1.25rem;
          margin-bottom: var(--space-xs);
        }

        .profile-info p {
          color: var(--silver);
          margin-bottom: var(--space-sm);
        }

        .package-tag {
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .profile-details {
          padding: var(--space-xl);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-md) 0;
          border-bottom: 1px solid var(--slate);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: var(--silver);
        }

        .detail-value {
          color: var(--white);
          font-weight: 500;
        }

        .vip-status {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--gold);
        }

        .profile-categories {
          padding: 0 var(--space-xl) var(--space-xl);
        }

        .profile-categories h4 {
          margin-bottom: var(--space-md);
          color: var(--silver);
        }

        .categories-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .category-tag {
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
