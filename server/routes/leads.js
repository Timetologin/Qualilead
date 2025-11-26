import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendLeadEmail, sendLeadSMS } from '../utils/notifications.js';

const router = express.Router();

// Get all leads
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, assigned_to, priority, search, page = 1, limit = 20 } = req.query;

    let leads = dbHelpers.getLeads();

    // If not admin, only show user's leads
    if (req.user.role !== 'admin') {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    } else if (assigned_to) {
      leads = leads.filter(l => l.assigned_to === assigned_to);
    }

    if (status) leads = leads.filter(l => l.status === status);
    if (category) leads = leads.filter(l => l.category_id === category);
    if (priority) leads = leads.filter(l => l.priority === priority);
    if (search) {
      const term = search.toLowerCase();
      leads = leads.filter(l => 
        l.customer_name?.toLowerCase().includes(term) ||
        l.customer_phone?.includes(term) ||
        l.customer_email?.toLowerCase().includes(term)
      );
    }

    const total = leads.length;
    const offset = (page - 1) * limit;
    leads = leads.slice(offset, offset + parseInt(limit));

    res.json({
      leads,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to get leads' });
  }
});

// Get single lead
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = dbHelpers.findLeadById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (req.user.role !== 'admin' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const history = dbHelpers.getLeadHistory(req.params.id);
    res.json({ ...lead, history });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Failed to get lead' });
  }
});

// Create new lead (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, category_id, service_area, notes, priority = 'normal' } = req.body;

    if (!customer_name || !customer_phone || !category_id) {
      return res.status(400).json({ error: 'Customer name, phone, and category are required' });
    }

    const category = dbHelpers.findCategoryById(category_id);
    if (!category || !category.is_active) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const lead = await dbHelpers.createLead({
      customer_name, customer_email, customer_phone, category_id, service_area, notes, priority
    });

    await dbHelpers.addLeadHistory({
      lead_id: lead.id,
      action: 'created',
      new_status: 'new',
      performed_by: req.user.id,
      notes: 'Lead created'
    });

    res.status(201).json({ message: 'Lead created successfully', leadId: lead.id });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update lead (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const lead = dbHelpers.findLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const { customer_name, customer_email, customer_phone, category_id, service_area, notes, status, priority } = req.body;

    const updates = {};
    if (customer_name !== undefined) updates.customer_name = customer_name;
    if (customer_email !== undefined) updates.customer_email = customer_email;
    if (customer_phone !== undefined) updates.customer_phone = customer_phone;
    if (category_id !== undefined) updates.category_id = category_id;
    if (service_area !== undefined) updates.service_area = service_area;
    if (notes !== undefined) updates.notes = notes;
    if (priority !== undefined) updates.priority = priority;

    if (status !== undefined && status !== lead.status) {
      updates.status = status;
      await dbHelpers.addLeadHistory({
        lead_id: req.params.id,
        action: 'status_changed',
        old_status: lead.status,
        new_status: status,
        performed_by: req.user.id
      });
    }

    if (Object.keys(updates).length > 0) {
      await dbHelpers.updateLead(req.params.id, updates);
    }

    res.json({ message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Assign lead to user (admin only)
router.post('/:id/assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Accept both naming conventions
    const user_id = req.body.user_id || req.body.userId;
    const send_via = req.body.send_via || req.body.sendVia || 'email';

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const lead = dbHelpers.findLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const user = dbHelpers.findUserById(user_id);
    if (!user || user.role !== 'client' || !user.is_active) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    // Check monthly limit
    if (user.monthly_lead_limit !== -1 && user.leads_received_this_month >= user.monthly_lead_limit) {
      return res.status(400).json({ 
        error: 'User has reached their monthly lead limit',
        limit: user.monthly_lead_limit,
        received: user.leads_received_this_month
      });
    }

    // Check category access
    if (user.categories_allowed !== -1) {
      const hasCategory = dbHelpers.userHasCategory(user_id, lead.category_id);
      if (!hasCategory) {
        return res.status(400).json({ error: 'Lead category is not in user\'s allowed categories' });
      }
    }

    // Update lead
    await dbHelpers.updateLead(req.params.id, {
      assigned_to: user_id,
      status: 'sent',
      sent_at: new Date().toISOString(),
      sent_via: send_via
    });

    // Update user's lead count
    await dbHelpers.updateUser(user_id, {
      leads_received_this_month: user.leads_received_this_month + 1
    });

    // Add history
    await dbHelpers.addLeadHistory({
      lead_id: req.params.id,
      action: 'assigned',
      old_status: lead.status,
      new_status: 'sent',
      performed_by: req.user.id,
      notes: `Assigned to ${user.name}`
    });

    // Send notification
    await dbHelpers.createNotification({
      user_id: user_id,
      title: 'New Lead!',
      message: `You received a new lead: ${lead.customer_name} - ${lead.customer_phone}`,
      type: 'success'
    });

    // Log delivery
    await dbHelpers.addDeliveryLog({
      lead_id: req.params.id,
      user_id: user_id,
      delivery_type: send_via,
      recipient: send_via === 'email' ? user.email : user.phone,
      status: 'sent'
    });

    // Send email/SMS (async)
    if (send_via === 'email' || send_via === 'both') {
      sendLeadEmail(user, lead).catch(console.error);
    }
    if (send_via === 'sms' || send_via === 'both') {
      sendLeadSMS(user, lead).catch(console.error);
    }

    res.json({ message: 'Lead assigned successfully' });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ error: 'Failed to assign lead' });
  }
});

// Bulk assign leads (admin only)
router.post('/bulk-assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { lead_ids, user_id, send_via = 'email' } = req.body;

    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      return res.status(400).json({ error: 'Lead IDs are required' });
    }

    const user = dbHelpers.findUserById(user_id);
    if (!user || user.role !== 'client' || !user.is_active) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const remainingCapacity = user.monthly_lead_limit === -1 
      ? Infinity 
      : user.monthly_lead_limit - user.leads_received_this_month;

    if (lead_ids.length > remainingCapacity) {
      return res.status(400).json({ 
        error: `User can only receive ${remainingCapacity} more leads this month`,
        requested: lead_ids.length,
        remaining_capacity: remainingCapacity
      });
    }

    let assigned = 0;
    let skipped = 0;

    for (const leadId of lead_ids) {
      const lead = dbHelpers.findLeadById(leadId);
      if (!lead || lead.status !== 'new') {
        skipped++;
        continue;
      }

      // Check category
      if (user.categories_allowed !== -1 && !dbHelpers.userHasCategory(user_id, lead.category_id)) {
        skipped++;
        continue;
      }

      await dbHelpers.updateLead(leadId, {
        assigned_to: user_id,
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_via: send_via
      });

      await dbHelpers.addLeadHistory({
        lead_id: leadId,
        action: 'assigned',
        old_status: 'new',
        new_status: 'sent',
        performed_by: req.user.id
      });

      assigned++;
    }

    // Update user's lead count
    await dbHelpers.updateUser(user_id, {
      leads_received_this_month: user.leads_received_this_month + assigned
    });

    if (assigned > 0) {
      await dbHelpers.createNotification({
        user_id: user_id,
        title: 'New Leads!',
        message: `You received ${assigned} new leads!`,
        type: 'success'
      });
    }

    res.json({ message: `Assigned ${assigned} leads, skipped ${skipped}`, assigned, skipped });
  } catch (error) {
    console.error('Bulk assign error:', error);
    res.status(500).json({ error: 'Failed to bulk assign leads' });
  }
});

// Mark lead as returned
router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    const lead = dbHelpers.findLeadById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (req.user.role !== 'admin' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await dbHelpers.updateLead(req.params.id, { status: 'returned' });

    await dbHelpers.addLeadHistory({
      lead_id: req.params.id,
      action: 'returned',
      old_status: lead.status,
      new_status: 'returned',
      performed_by: req.user.id,
      notes: reason || 'Lead returned'
    });

    // Notify admins
    const admins = dbHelpers.getUsers({ role: 'admin' });
    for (const admin of admins) {
      await dbHelpers.createNotification({
        user_id: admin.id,
        title: 'Lead Returned',
        message: `Lead "${lead.customer_name}" was returned. Reason: ${reason || 'Not specified'}`,
        type: 'warning'
      });
    }

    res.json({ message: 'Lead marked as returned' });
  } catch (error) {
    console.error('Return lead error:', error);
    res.status(500).json({ error: 'Failed to return lead' });
  }
});

// Delete lead (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const lead = dbHelpers.findLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await dbHelpers.deleteLead(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Export leads as CSV
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    let leads = dbHelpers.getLeads();

    if (req.user.role !== 'admin') {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    }

    const headers = ['Customer Name', 'Email', 'Phone', 'Category', 'Service Area', 'Status', 'Priority', 'Sent At', 'Created At'];
    const csv = [
      headers.join(','),
      ...leads.map(l => [
        `"${l.customer_name}"`,
        `"${l.customer_email || ''}"`,
        `"${l.customer_phone}"`,
        `"${l.category_name_en || ''}"`,
        `"${l.service_area || ''}"`,
        l.status,
        l.priority,
        l.sent_at || '',
        l.created_at
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({ error: 'Failed to export leads' });
  }
});

export default router;
