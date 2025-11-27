import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  LogOut,
  Crown,
  Package,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Home,
  ChevronRight,
  ChevronLeft,
  Eye,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Leads View Component
const LeadsView = ({ leads, isRTL, onReturn, onExport }) => {
  const [filter, setFilter] = useState('all');

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      sent: '#3b82f6',
      converted: '#22c55e',
      returned: '#f59e0b',
      invalid: '#ef4444'
    };
    return colors[status] || '#888';
  };

  return (
    <div className="leads-view">
      <div className="view-header">
        <div className="filter-tabs">
          {['all', 'sent', 'converted', 'returned'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? (isRTL ? 'הכל' : 'All') : status}
              <span className="filter-count">
                {status === 'all' ? leads.length : leads.filter(l => l.status === status).length}
              </span>
            </button>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={onExport}>
          <Download size={18} />
          <span className="btn-text">{isRTL ? 'ייצוא' : 'Export'}</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="table-container desktop-only">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isRTL ? 'שם' : 'Name'}</th>
              <th>{isRTL ? 'טלפון' : 'Phone'}</th>
              <th>{isRTL ? 'אימייל' : 'Email'}</th>
              <th>{isRTL ? 'קטגוריה' : 'Category'}</th>
              <th>{isRTL ? 'סטטוס' : 'Status'}</th>
              <th>{isRTL ? 'תאריך' : 'Date'}</th>
              <th>{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.customer_name}</td>
                <td dir="ltr">{lead.customer_phone}</td>
                <td>{lead.customer_email || '-'}</td>
                <td>{isRTL ? lead.category_name_he : lead.category_name_en}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>{new Date(lead.received_at || lead.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {lead.status === 'sent' && (
                      <button 
                        className="action-btn return" 
                        onClick={() => onReturn(lead.id)}
                        title={isRTL ? 'בקש החזרה' : 'Request Return'}
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only">
        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>{isRTL ? 'אין לידים להצגה' : 'No leads to display'}</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead.id} className="lead-card">
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
                  <a href={`tel:${lead.customer_phone}`} dir="ltr">{lead.customer_phone}</a>
                </div>
                {lead.customer_email && (
                  <div className="lead-detail">
                    <Mail size={14} />
                    <a href={`mailto:${lead.customer_email}`}>{lead.customer_email}</a>
                  </div>
                )}
                {lead.customer_address && (
                  <div className="lead-detail">
                    <MapPin size={14} />
                    <span>{lead.customer_address}</span>
                  </div>
                )}
              </div>
              <div className="lead-card-footer">
                <span className="lead-date">
                  <Calendar size={14} />
                  {new Date(lead.received_at || lead.created_at).toLocaleDateString()}
                </span>
                {lead.status === 'sent' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => onReturn(lead.id)}>
                    <RefreshCw size={14} />
                    {isRTL ? 'החזרה' : 'Return'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Notifications View Component
const NotificationsView = ({ notifications, isRTL, onMarkRead, isVIP }) => {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-view">
      <div className="view-header">
        <div className="header-info">
          <h3>{isRTL ? 'התראות' : 'Notifications'}</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} {isRTL ? 'חדשות' : 'new'}</span>
          )}
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>{isRTL ? 'אין התראות' : 'No notifications'}</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
              onClick={() => !notification.is_read && onMarkRead(notification.id)}
            >
              <div className={`notification-icon ${notification.type}`}>
                {notification.type === 'lead' && <FileText size={18} />}
                {notification.type === 'system' && <Bell size={18} />}
                {notification.type === 'vip' && <Crown size={18} />}
              </div>
              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              {!notification.is_read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Profile View Component
const ProfileView = ({ user, isRTL, isVIP, packageInfo }) => {
  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {isVIP && <Crown size={16} className="vip-crown" />}
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.company_name || (isRTL ? 'לא צוין' : 'Not specified')}</p>
            {isVIP && (
              <span className="vip-badge">
                <Crown size={14} />
                VIP
              </span>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'אימייל' : 'Email'}</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'טלפון' : 'Phone'}</span>
            <span className="detail-value" dir="ltr">{user?.phone || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'חבילה' : 'Package'}</span>
            <span className="detail-value" style={{ color: packageInfo.color }}>{packageInfo.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'מגבלת לידים' : 'Lead Limit'}</span>
            <span className="detail-value">{packageInfo.limit}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{isRTL ? 'סטטוס' : 'Status'}</span>
            <span className="detail-value">
              {user?.is_active ? (
                <span className="status-active">
                  <CheckCircle size={14} />
                  {isRTL ? 'פעיל' : 'Active'}
                </span>
              ) : (
                <span className="status-inactive">
                  <XCircle size={14} />
                  {isRTL ? 'לא פעיל' : 'Inactive'}
                </span>
              )}
            </span>
          </div>
        </div>

        {user?.categories && user.categories.length > 0 && (
          <div className="profile-categories">
            <h4>{isRTL ? 'קטגוריות' : 'Categories'}</h4>
            <div className="categories-list">
              {user.categories.map((cat, index) => (
                <span key={index} className="category-tag">{cat}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Client Dashboard Component
const ClientDashboard = () => {
  const { user, logout, api } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState({ used: 0, limit: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isVIP = user?.package_type === 'vip';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, notificationsRes, usageRes] = await Promise.all([
        api('/leads/my'),
        api('/notifications'),
        api('/users/me/usage')
      ]);

      setLeads(leadsRes.leads || []);
      setNotifications(notificationsRes.notifications || []);
      setMonthlyUsage({
        used: usageRes.leads_received_this_month || 0,
        limit: usageRes.monthly_lead_limit || 0
      });

      // Generate chart data from leads
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString(isRTL ? 'he' : 'en', { month: 'short' });
        const monthLeads = (leadsRes.leads || []).filter(lead => {
          const leadDate = new Date(lead.received_at || lead.created_at);
          return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
        });
        last6Months.push({ month: monthName, count: monthLeads.length });
      }
      setChartData(last6Months);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestReturn = async (leadId) => {
    try {
      await api(`/leads/${leadId}/return`, { method: 'POST' });
      fetchDashboardData();
    } catch (error) {
      console.error('Return request error:', error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api(`/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const exportLeadsCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Category', 'Status', 'Date'];
    const rows = leads.map(lead => [
      lead.customer_name,
      lead.customer_phone,
      lead.customer_email || '',
      isRTL ? lead.category_name_he : lead.category_name_en,
      lead.status,
      new Date(lead.received_at || lead.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const packageInfo = (() => {
    switch (user?.package_type) {
      case 'vip':
        return { name: isRTL ? 'VIP פרימיום' : 'VIP Premium', limit: '∞', color: '#d4af37' };
      case 'basic':
        return { name: isRTL ? 'בסיסי' : 'Basic', limit: user?.monthly_lead_limit || 10, color: '#3b82f6' };
      case 'pro':
        return { name: isRTL ? 'מקצועי' : 'Professional', limit: user?.monthly_lead_limit || 50, color: '#8b5cf6' };
      default:
        return { name: isRTL ? 'משלם לפי ליד' : 'Pay Per Lead', limit: '-', color: '#22c55e' };
    }
  })();

  const usagePercent = monthlyUsage.limit === -1 || monthlyUsage.limit === 0 
    ? 0 
    : Math.min((monthlyUsage.used / monthlyUsage.limit) * 100, 100);

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>{isRTL ? 'טוען...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className={`client-dashboard ${isRTL ? 'rtl' : 'ltr'}`}>
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
    <button className="icon-btn notification-btn" onClick={() => handleTabChange('notifications')}>
      <Bell size={20} />
      {unreadNotifications > 0 && <span className="notification-dot"></span>}
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
            <span>{isRTL ? 'הלידים שלי' : 'My Leads'}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            <Bell size={20} />
            <span>{isRTL ? 'התראות' : 'Notifications'}</span>
            {unreadNotifications > 0 && (
              <span className="nav-badge">{unreadNotifications}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <User size={20} />
            <span>{isRTL ? 'פרופיל' : 'Profile'}</span>
          </button>
          <Link to="/" className="nav-item home-link" onClick={() => setSidebarOpen(false)}>
  <Home size={20} />
  <span>{isRTL ? 'חזרה לאתר' : 'Back to Site'}</span>
</Link>
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
        {/* Desktop Header */}
        <header className="dashboard-header desktop-only">
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
  <ThemeToggle size="medium" />
  <button className="btn btn-secondary" onClick={exportLeads}>
    <Download size={18} />
    {isRTL ? 'ייצוא לידים' : 'Export Leads'}
  </button>
</div>
        </header>

        {/* Mobile Tab Title */}
        <div className="mobile-tab-title mobile-only">
          <h1>
            {activeTab === 'overview' && (isRTL ? 'סקירה כללית' : 'Overview')}
            {activeTab === 'leads' && (isRTL ? 'הלידים שלי' : 'My Leads')}
            {activeTab === 'notifications' && (isRTL ? 'התראות' : 'Notifications')}
            {activeTab === 'profile' && (isRTL ? 'פרופיל' : 'Profile')}
          </h1>
        </div>

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
                      {packageInfo.name}
                    </p>
                  </div>
                  <div className="usage-numbers">
                    <span className="current">{monthlyUsage.used}</span>
                    <span className="separator">/</span>
                    <span className="limit">{monthlyUsage.limit === -1 ? '∞' : monthlyUsage.limit}</span>
                  </div>
                </div>
                <div className="usage-bar">
                  <div 
                    className="usage-fill" 
                    style={{ 
                      width: `${usagePercent}%`,
                      background: usagePercent > 80 ? '#ef4444' : packageInfo.color
                    }}
                  ></div>
                </div>
                <div className="usage-footer">
                  <span>{isRTL ? 'נשארו:' : 'Remaining:'} <strong>{monthlyUsage.limit === -1 ? '∞' : Math.max(0, monthlyUsage.limit - monthlyUsage.used)}</strong></span>
                  <span>{isRTL ? 'מתאפס ב-1 לחודש' : 'Resets on the 1st'}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <FileText size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{leads.length}</span>
                    <span className="stat-label">{isRTL ? 'סה"כ לידים' : 'Total Leads'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">
                    <CheckCircle size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{leads.filter(l => l.status === 'converted').length}</span>
                    <span className="stat-label">{isRTL ? 'הומרו' : 'Converted'}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon gold">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {leads.length > 0 
                        ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) 
                        : 0}%
                    </span>
                    <span className="stat-label">{isRTL ? 'אחוז המרה' : 'Conversion'}</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="chart-card">
                  <h3>{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={250}>
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
                          stroke={packageInfo.color} 
                          fill={`${packageInfo.color}30`}
                          name={isRTL ? 'לידים' : 'Leads'}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Recent Leads */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>{isRTL ? 'לידים אחרונים' : 'Recent Leads'}</h3>
                  <button className="view-all-btn" onClick={() => setActiveTab('leads')}>
                    {isRTL ? 'הצג הכל' : 'View All'}
                    {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
                <div className="recent-leads">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="recent-lead-item">
                      <div className="lead-avatar">{lead.customer_name.charAt(0)}</div>
                      <div className="lead-info">
                        <span className="lead-name">{lead.customer_name}</span>
                        <span className="lead-category">{isRTL ? lead.category_name_he : lead.category_name_en}</span>
                      </div>
                      <span 
                        className="status-badge small"
                        style={{ background: `${lead.status === 'converted' ? '#22c55e' : '#3b82f6'}20`, color: lead.status === 'converted' ? '#22c55e' : '#3b82f6' }}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
        /* ===================================
           Client Dashboard - Fully Responsive
           =================================== */
        
        .client-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--deep-blue);
        }

        .client-dashboard.rtl {
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

        .notification-btn {
          position: relative;
        }

        .notification-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          background: var(--error);
          border-radius: 50%;
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

        .nav-badge {
          position: absolute;
          right: 16px;
          background: var(--error);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .rtl .nav-badge {
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

        .mobile-tab-title {
          display: none;
          margin-bottom: var(--space-lg);
        }

        .mobile-tab-title h1 {
          font-size: 1.5rem;
          color: var(--white);
        }

        .icon-btn {
          padding: var(--space-sm);
          color: var(--silver);
          background: var(--charcoal);
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
        }

        /* Usage Card */
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
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .usage-header h3 {
          color: var(--white);
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
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .usage-footer strong {
          color: var(--white);
        }

        /* Stats Grid */
        .stats-grid {
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
          flex-shrink: 0;
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

        /* Chart Card */
        .chart-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .chart-card h3 {
          color: var(--white);
          margin-bottom: var(--space-lg);
        }

        .chart-container {
          width: 100%;
        }

        /* Recent Section */
        .recent-section {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .section-header h3 {
          color: var(--white);
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

        .recent-leads {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .recent-lead-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--slate);
          border-radius: var(--radius-md);
        }

        .lead-avatar {
          width: 36px;
          height: 36px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--deep-blue);
          flex-shrink: 0;
        }

        .lead-info {
          flex: 1;
          min-width: 0;
        }

        .lead-name {
          display: block;
          color: var(--white);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lead-category {
          display: block;
          color: var(--silver);
          font-size: 0.8rem;
        }

        /* Status Badge */
        .status-badge {
          display: inline-block;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .status-badge.small {
          padding: 2px 8px;
          font-size: 0.7rem;
        }

        /* Leads View */
        .leads-view .view-header,
        .notifications-view .view-header {
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
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-full);
          background: var(--charcoal);
          color: var(--silver);
          border: 1px solid var(--slate);
          cursor: pointer;
          transition: var(--transition-base);
          text-transform: capitalize;
          font-size: 0.85rem;
        }

        .filter-tab:hover {
          border-color: var(--gold);
        }

        .filter-tab.active {
          background: var(--gold);
          color: var(--deep-blue);
          border-color: var(--gold);
        }

        .filter-count {
          background: rgba(0,0,0,0.2);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .filter-tab.active .filter-count {
          background: rgba(0,0,0,0.3);
        }

        /* Table */
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
          background: var(--charcoal);
        }

        .data-table td {
          color: var(--light-silver);
        }

        .data-table a {
          color: var(--gold);
        }

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
        }

        .action-btn:hover {
          color: var(--white);
        }

        .action-btn.return:hover {
          background: #f59e0b;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .lead-card {
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .lead-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-md);
          border-bottom: 1px solid var(--slate);
        }

        .lead-card-header .lead-info h4 {
          color: var(--white);
          font-size: 1rem;
          margin-bottom: var(--space-xs);
        }

        .lead-card-header .lead-category {
          color: var(--silver);
          font-size: 0.85rem;
        }

        .lead-card-body {
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

        .lead-detail a {
          color: var(--gold);
        }

        .lead-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          border-top: 1px solid var(--slate);
          background: rgba(0, 0, 0, 0.1);
        }

        .lead-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--silver);
          font-size: 0.8rem;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl);
          color: var(--silver);
          text-align: center;
        }

        .empty-state svg {
          margin-bottom: var(--space-lg);
          opacity: 0.5;
        }

        /* Notifications */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--charcoal);
          border: 1px solid var(--slate);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-base);
          position: relative;
        }

        .notification-item:hover {
          background: var(--slate);
        }

        .notification-item.unread {
          border-color: var(--gold);
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

        .notification-icon.lead { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .notification-icon.system { background: rgba(107, 114, 128, 0.2); color: #6b7280; }
        .notification-icon.vip { background: rgba(212, 175, 55, 0.2); color: #d4af37; }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          color: var(--white);
          font-weight: 500;
          margin-bottom: var(--space-xs);
        }

        .notification-message {
          color: var(--silver);
          font-size: 0.9rem;
          margin-bottom: var(--space-xs);
        }

        .notification-time {
          color: var(--silver);
          font-size: 0.75rem;
        }

        .unread-dot {
          width: 10px;
          height: 10px;
          background: var(--gold);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .unread-badge {
          background: var(--error);
          color: white;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Profile View */
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
          background: var(--slate);
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
          flex-shrink: 0;
        }

        .profile-avatar .vip-crown {
          position: absolute;
          top: -8px;
          right: -4px;
          color: var(--gold);
          background: var(--charcoal);
          border-radius: 50%;
          padding: 2px;
        }

        .profile-info h2 {
          color: var(--white);
          margin-bottom: var(--space-xs);
        }

        .profile-info p {
          color: var(--silver);
        }

        .vip-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: var(--space-sm);
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

        .status-active, .status-inactive {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .status-active {
          color: #22c55e;
        }

        .status-inactive {
          color: #ef4444;
        }

        .profile-categories {
          padding: 0 var(--space-xl) var(--space-xl);
        }

        .profile-categories h4 {
          color: var(--silver);
          margin-bottom: var(--space-md);
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

        .btn-secondary {
          background: var(--slate);
          color: var(--light-silver);
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

        /* Utilities */
        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        /* ===================================
           Responsive Breakpoints
           =================================== */

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
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
            display: block;
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

          /* Stats grid */
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-sm);
          }

          .stat-card {
            padding: var(--space-md);
            flex-direction: column;
            text-align: center;
            gap: var(--space-sm);
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-value {
            font-size: 1.25rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }

          /* Usage card */
          .usage-card {
            padding: var(--space-md);
          }

          .usage-numbers .current {
            font-size: 2rem;
          }

          .usage-numbers .limit {
            font-size: 1.25rem;
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

          /* Profile */
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          /* Button text */
          .btn-text {
            display: none;
          }

          .view-header .btn .btn-text {
            display: inline;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-direction: row;
            text-align: left;
          }

          .rtl .stat-card {
            text-align: right;
          }

          .detail-row {
            flex-direction: column;
            gap: var(--space-xs);
          }

          .view-header {
            flex-direction: column;
            align-items: stretch;
          }

          .view-header .btn {
            width: 100%;
            justify-content: center;
          }

          .view-header .btn .btn-text {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;