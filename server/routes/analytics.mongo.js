import express from 'express';
import { Lead, User, Category, LeadHistory } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalLeads,
        newLeads,
        sentLeads,
        convertedLeads,
        returnedLeads,
        totalClients,
        activeClients,
        vipClients,
        totalCategories,
        leadsThisMonth
      ] = await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'new' }),
        Lead.countDocuments({ status: 'sent' }),
        Lead.countDocuments({ status: 'converted' }),
        Lead.countDocuments({ status: 'returned' }),
        User.countDocuments({ role: 'client' }),
        User.countDocuments({ role: 'client', is_active: true }),
        User.countDocuments({ role: 'client', is_vip: true }),
        Category.countDocuments({ is_active: true }),
        Lead.countDocuments({ createdAt: { $gte: startOfMonth } })
      ]);

      res.json({
        total_leads: totalLeads,
        new_leads: newLeads,
        sent_leads: sentLeads,
        converted_leads: convertedLeads,
        returned_leads: returnedLeads,
        total_clients: totalClients,
        active_clients: activeClients,
        vip_clients: vipClients,
        total_categories: totalCategories,
        leads_this_month: leadsThisMonth
      });
    } else {
      // Client dashboard
      const user = await User.findById(req.user.id).populate('categories');
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalLeads, leadsThisMonth, convertedLeads, sentLeads] = await Promise.all([
        Lead.countDocuments({ assigned_to: req.user.id }),
        Lead.countDocuments({ assigned_to: req.user.id, sent_at: { $gte: startOfMonth } }),
        Lead.countDocuments({ assigned_to: req.user.id, status: 'converted' }),
        Lead.countDocuments({ assigned_to: req.user.id, status: 'sent' })
      ]);

      const leadsRemaining = user.monthly_lead_limit === -1 
        ? 'unlimited' 
        : Math.max(0, user.monthly_lead_limit - user.leads_received_this_month);

      res.json({
        leads_received: totalLeads,
        leads_this_month: leadsThisMonth,
        leads_remaining: leadsRemaining,
        converted_leads: convertedLeads,
        pending_leads: sentLeads,
        categories: user.categories,
        package_type: user.package_type,
        monthly_limit: user.monthly_lead_limit
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get leads over time (admin only)
router.get('/leads-over-time', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    }

    const leads = await Lead.find({ createdAt: { $gte: startDate } });

    // Group by month
    const monthlyData = {};
    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { total: 0, sent: 0, converted: 0 };
      }
      monthlyData[key].total++;
      if (lead.status === 'sent') monthlyData[key].sent++;
      if (lead.status === 'converted') monthlyData[key].converted++;
    });

    const result = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data
      }));

    res.json(result);
  } catch (error) {
    console.error('Leads over time error:', error);
    res.status(500).json({ error: 'Failed to get leads over time' });
  }
});

// Get leads by category
router.get('/leads-by-category', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true });
    
    const data = await Promise.all(categories.map(async (cat) => {
      const count = await Lead.countDocuments({ category_id: cat._id });
      return {
        name: cat.name_he,
        name_en: cat.name_en,
        value: count
      };
    }));

    res.json(data.filter(d => d.value > 0));
  } catch (error) {
    console.error('Leads by category error:', error);
    res.status(500).json({ error: 'Failed to get leads by category' });
  }
});

// Get leads by status
router.get('/leads-by-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const statuses = ['new', 'sent', 'converted', 'returned', 'invalid'];
    const statusLabels = {
      new: 'חדש',
      sent: 'נשלח',
      converted: 'הומר',
      returned: 'הוחזר',
      invalid: 'לא תקין'
    };

    const data = await Promise.all(statuses.map(async (status) => {
      const count = await Lead.countDocuments({ status });
      return { 
        name: statusLabels[status], 
        name_en: status,
        value: count 
      };
    }));

    res.json(data.filter(d => d.value > 0));
  } catch (error) {
    console.error('Leads by status error:', error);
    res.status(500).json({ error: 'Failed to get leads by status' });
  }
});

// Get top clients
router.get('/top-clients', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const clients = await User.find({ role: 'client', is_active: true })
      .select('name company_name email leads_received_this_month package_type')
      .sort({ leads_received_this_month: -1 })
      .limit(parseInt(limit));

    res.json(clients);
  } catch (error) {
    console.error('Top clients error:', error);
    res.status(500).json({ error: 'Failed to get top clients' });
  }
});

// Get recent activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    let query = {};
    if (req.user.role !== 'admin') {
      query.performed_by = req.user.id;
    }

    const activities = await LeadHistory.find(query)
      .populate('lead_id', 'customer_name')
      .populate('performed_by', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(activities);
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to get recent activity' });
  }
});

export default router;
