import express from 'express';
import db, { dbHelpers } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    
    if (isAdmin) {
      // Admin dashboard stats
      const allLeads = dbHelpers.getLeads();
      const allUsers = dbHelpers.getUsers({ role: 'client' });
      const categories = dbHelpers.getCategories(true);
      
      const now = new Date();
      const thisMonth = allLeads.filter(l => {
        const date = new Date(l.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

      res.json({
        total_leads: allLeads.length,
        new_leads: allLeads.filter(l => l.status === 'new').length,
        sent_leads: allLeads.filter(l => l.status === 'sent').length,
        converted_leads: allLeads.filter(l => l.status === 'converted').length,
        returned_leads: allLeads.filter(l => l.status === 'returned').length,
        total_clients: allUsers.length,
        active_clients: allUsers.filter(u => u.is_active).length,
        vip_clients: allUsers.filter(u => u.is_vip).length,
        total_categories: categories.length,
        leads_this_month: thisMonth.length,
        sent_this_month: thisMonth.filter(l => l.status === 'sent').length
      });
    } else {
      // Client dashboard stats
      const userLeads = dbHelpers.getLeads({ assigned_to: req.user.id });
      const user = dbHelpers.findUserById(req.user.id);
      const categories = dbHelpers.getUserCategories(req.user.id);

      const now = new Date();
      const leadsThisMonth = userLeads.filter(l => {
        const date = new Date(l.sent_at || l.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

      res.json({
        leads_received: userLeads.length,
        leads_this_month: leadsThisMonth.length,
        monthly_limit: user.monthly_lead_limit,
        remaining: user.monthly_lead_limit === -1 ? 'Unlimited' : Math.max(0, user.monthly_lead_limit - user.leads_received_this_month),
        categories_count: categories.length,
        converted: userLeads.filter(l => l.status === 'converted').length,
        returned: userLeads.filter(l => l.status === 'returned').length
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get leads over time
router.get('/leads-over-time', authenticateToken, async (req, res) => {
  try {
    const { period = 'monthly', months = 6 } = req.query;
    const isAdmin = req.user.role === 'admin';
    
    let leads = dbHelpers.getLeads();
    if (!isAdmin) {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    }

    const now = new Date();
    const result = [];

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.created_at);
        return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
      });

      result.push({
        month: `${monthName} ${year}`,
        total: monthLeads.length,
        sent: monthLeads.filter(l => l.status === 'sent').length,
        converted: monthLeads.filter(l => l.status === 'converted').length,
        returned: monthLeads.filter(l => l.status === 'returned').length
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Leads over time error:', error);
    res.status(500).json({ error: 'Failed to get leads over time' });
  }
});

// Get leads by category
router.get('/leads-by-category', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const categories = dbHelpers.getCategories(true);
    
    let leads = dbHelpers.getLeads();
    if (!isAdmin) {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    }

    const result = categories.map(cat => {
      const catLeads = leads.filter(l => l.category_id === cat.id);
      return {
        id: cat.id,
        name_en: cat.name_en,
        name_he: cat.name_he,
        total: catLeads.length,
        sent: catLeads.filter(l => l.status === 'sent').length,
        converted: catLeads.filter(l => l.status === 'converted').length
      };
    }).filter(c => c.total > 0);

    res.json(result);
  } catch (error) {
    console.error('Leads by category error:', error);
    res.status(500).json({ error: 'Failed to get leads by category' });
  }
});

// Get leads by status
router.get('/leads-by-status', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    
    let leads = dbHelpers.getLeads();
    if (!isAdmin) {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    }

    const statuses = ['new', 'sent', 'converted', 'returned', 'invalid'];
    const colors = {
      new: '#3b82f6',
      sent: '#22c55e',
      converted: '#d4af37',
      returned: '#f59e0b',
      invalid: '#ef4444'
    };

    const result = statuses.map(status => ({
      status,
      count: leads.filter(l => l.status === status).length,
      color: colors[status]
    })).filter(s => s.count > 0);

    res.json(result);
  } catch (error) {
    console.error('Leads by status error:', error);
    res.status(500).json({ error: 'Failed to get leads by status' });
  }
});

// Get top clients (admin only)
router.get('/top-clients', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const clients = dbHelpers.getUsers({ role: 'client' });
    
    const clientsWithLeads = clients.map(client => {
      const leads = dbHelpers.getLeads({ assigned_to: client.id });
      return {
        id: client.id,
        name: client.name,
        company_name: client.company_name,
        package_type: client.package_type,
        total_leads: leads.length,
        converted: leads.filter(l => l.status === 'converted').length,
        conversion_rate: leads.length > 0 ? ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1) : 0
      };
    });

    const sorted = clientsWithLeads
      .sort((a, b) => b.total_leads - a.total_leads)
      .slice(0, parseInt(limit));

    res.json(sorted);
  } catch (error) {
    console.error('Top clients error:', error);
    res.status(500).json({ error: 'Failed to get top clients' });
  }
});

// Get monthly report (admin only)
router.get('/monthly-report', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const clients = dbHelpers.getUsers({ role: 'client' });
    const leads = dbHelpers.getLeads();

    const report = clients.map(client => {
      const clientLeads = leads.filter(l => {
        if (l.assigned_to !== client.id) return false;
        const date = new Date(l.sent_at || l.created_at);
        return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
      });

      return {
        client_id: client.id,
        client_name: client.name,
        company_name: client.company_name,
        package_type: client.package_type,
        monthly_limit: client.monthly_lead_limit,
        leads_sent: clientLeads.length,
        leads_converted: clientLeads.filter(l => l.status === 'converted').length,
        leads_returned: clientLeads.filter(l => l.status === 'returned').length,
        usage_percentage: client.monthly_lead_limit === -1 
          ? null 
          : ((clientLeads.length / client.monthly_lead_limit) * 100).toFixed(1)
      };
    });

    res.json({
      month: targetMonth + 1,
      year: targetYear,
      report: report.filter(r => r.leads_sent > 0)
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ error: 'Failed to get monthly report' });
  }
});

// Get usage history for a user
router.get('/usage-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.role === 'admin' && req.query.user_id 
      ? req.query.user_id 
      : req.user.id;

    const leads = dbHelpers.getLeads({ assigned_to: userId });
    const now = new Date();
    const result = [];

    // Get last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.sent_at || l.created_at);
        return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
      });

      result.push({
        month: monthName,
        year: date.getFullYear(),
        leads_sent: monthLeads.length,
        converted: monthLeads.filter(l => l.status === 'converted').length
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Usage history error:', error);
    res.status(500).json({ error: 'Failed to get usage history' });
  }
});

// Get recent activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const isAdmin = req.user.role === 'admin';

    const activity = dbHelpers.getRecentActivity(
      parseInt(limit),
      isAdmin ? null : req.user.id
    );

    res.json(activity);
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to get recent activity' });
  }
});

export default router;
