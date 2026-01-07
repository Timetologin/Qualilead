import express from 'express';
import { Lead, User, Category, LeadHistory, Notification, DeliveryLog } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendLeadEmail, sendLeadSMS } from '../utils/notifications.js';

const router = express.Router();

// Get all leads
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, assigned_to, priority, search, page = 1, limit = 20 } = req.query;

    let query = {};

    // If not admin, only show user's leads
    if (req.user.role !== 'admin') {
      query.assigned_to = req.user.id;
    } else if (assigned_to) {
      query.assigned_to = assigned_to;
    }

    if (status) query.status = status;
    if (category) query.category_id = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_phone: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('category_id')
      .populate('assigned_to', 'name email company_name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

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
    const lead = await Lead.findById(req.params.id)
      .populate('category_id')
      .populate('assigned_to', 'name email company_name phone');

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && lead.assigned_to?._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get lead history
    const history = await LeadHistory.find({ lead_id: lead._id })
      .populate('performed_by', 'name')
      .sort({ createdAt: -1 });

    res.json({ ...lead.toObject(), history });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Failed to get lead' });
  }
});

// Create new lead (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, category_id, priority, service_area, notes } = req.body;

    if (!customer_name || !customer_phone || !category_id) {
      return res.status(400).json({ error: 'Customer name, phone, and category are required' });
    }

    const lead = await Lead.create({
      customer_name,
      customer_phone,
      customer_email: customer_email || '',
      category_id,
      priority: priority || 'normal',
      service_area: service_area || '',
      notes: notes || '',
      status: 'new'
    });

    // Log history
    await LeadHistory.create({
      lead_id: lead._id,
      action: 'created',
      new_value: 'Lead created',
      performed_by: req.user.id
    });

    const newLead = await Lead.findById(lead._id).populate('category_id');

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update lead
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && lead.assigned_to?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = { ...req.body };
    const oldStatus = lead.status;

    // Handle category_id - convert to ObjectId or set to null
    if (updates.category_id !== undefined) {
      if (updates.category_id && updates.category_id.length === 24) {
        const mongoose = await import('mongoose');
        updates.category_id = new mongoose.default.Types.ObjectId(updates.category_id);
      } else if (!updates.category_id || updates.category_id === '') {
        updates.category_id = null;
      }
    }

    // Use updateOne to bypass Mongoose validation issues for landing page leads
    updates.updated_at = new Date();
    await Lead.updateOne({ _id: req.params.id }, { $set: updates });

    // Log status change
    if (updates.status && updates.status !== oldStatus) {
      await LeadHistory.create({
        lead_id: lead._id,
        action: 'status_changed',
        old_value: oldStatus,
        new_value: updates.status,
        performed_by: req.user.id
      });
    }

    const updatedLead = await Lead.findById(req.params.id)
      .populate('category_id')
      .populate('assigned_to', 'name email');

    res.json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Assign lead to user (admin only)
router.post('/:id/assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, send_via } = req.body;

    const lead = await Lead.findById(req.params.id).populate('category_id');
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has reached limit
    if (user.monthly_lead_limit !== -1 && user.leads_received_this_month >= user.monthly_lead_limit) {
      return res.status(400).json({ error: 'User has reached monthly lead limit' });
    }

    // Update lead
    lead.assigned_to = user._id;
    lead.status = 'sent';
    lead.sent_at = new Date();
    lead.sent_via = send_via || 'email';
    await lead.save();

    // Update user's lead count
    user.leads_received_this_month += 1;
    await user.save();

    // Log history
    await LeadHistory.create({
      lead_id: lead._id,
      action: 'assigned',
      new_value: user.name,
      performed_by: req.user.id
    });

    // Send notification to user
    await Notification.create({
      user_id: user._id,
      title: 'ליד חדש!',
      message: `קיבלת ליד חדש: ${lead.customer_name}`,
      type: 'lead',
      link: `/client/leads/${lead._id}`
    });

    // Send email/SMS
    try {
      if (send_via === 'email' || send_via === 'both') {
        await sendLeadEmail(user, lead);
        await DeliveryLog.create({
          lead_id: lead._id,
          user_id: user._id,
          delivery_method: 'email',
          status: 'success'
        });
      }
      if (send_via === 'sms' || send_via === 'both') {
        await sendLeadSMS(user, lead);
        await DeliveryLog.create({
          lead_id: lead._id,
          user_id: user._id,
          delivery_method: 'sms',
          status: 'success'
        });
      }
    } catch (notifyError) {
      console.error('Notification error:', notifyError);
    }

    const updatedLead = await Lead.findById(lead._id)
      .populate('category_id')
      .populate('assigned_to', 'name email');

    res.json(updatedLead);
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ error: 'Failed to assign lead' });
  }
});

// Return lead (client)
router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && lead.assigned_to?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    lead.status = 'returned';
    lead.return_reason = reason || '';
    await lead.save();

    // Log history
    await LeadHistory.create({
      lead_id: lead._id,
      action: 'returned',
      new_value: reason,
      performed_by: req.user.id
    });

    // Refund lead to user
    if (lead.assigned_to) {
      await User.findByIdAndUpdate(lead.assigned_to, {
        $inc: { leads_received_this_month: -1 }
      });
    }

    res.json({ message: 'Lead returned successfully' });
  } catch (error) {
    console.error('Return lead error:', error);
    res.status(500).json({ error: 'Failed to return lead' });
  }
});

// Mark lead as converted (client)
router.post('/:id/convert', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && lead.assigned_to?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    lead.status = 'converted';
    lead.converted_at = new Date();
    await lead.save();

    // Log history
    await LeadHistory.create({
      lead_id: lead._id,
      action: 'converted',
      performed_by: req.user.id
    });

    res.json({ message: 'Lead marked as converted' });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({ error: 'Failed to convert lead' });
  }
});

// Delete lead (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(req.params.id);
    await LeadHistory.deleteMany({ lead_id: req.params.id });

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;
