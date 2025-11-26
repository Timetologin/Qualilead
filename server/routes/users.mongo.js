import express from 'express';
import bcrypt from 'bcryptjs';
import { User, Lead, Notification } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, package_type, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (role) query.role = role;
    if (package_type) query.package_type = package_type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company_name: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('categories')
      .populate('dedicated_manager_id', 'name email')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get single user (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('categories')
      .populate('dedicated_manager_id', 'name email phone')
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const leadsCount = await Lead.countDocuments({ assigned_to: user._id });

    res.json({ ...user.toObject(), total_leads: leadsCount });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, name, phone, company_name, role, package_type, monthly_lead_limit, categories_allowed, categories, is_vip } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'default123', 10);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone: phone || '',
      company_name: company_name || '',
      role: role || 'client',
      package_type: package_type || 'starter',
      monthly_lead_limit: monthly_lead_limit || 20,
      categories_allowed: categories_allowed || 1,
      categories: categories || [],
      is_vip: is_vip || false
    });

    // Create welcome notification
    await Notification.create({
      user_id: user._id,
      title: 'ברוכים הבאים ל-QualiLead!',
      message: 'החשבון שלך נוצר בהצלחה.',
      type: 'success'
    });

    const newUser = await User.findById(user._id)
      .populate('categories')
      .select('-password');

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password, ...updates } = req.body;

    // If password provided, hash it
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )
      .populate('categories')
      .populate('dedicated_manager_id', 'name email')
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete/Deactivate user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin user' });
    }

    // Soft delete
    await User.findByIdAndUpdate(req.params.id, { is_active: false });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user's leads
router.get('/:id/leads', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, page = 1, limit = 20 } = req.query;

    let query = { assigned_to: req.params.id };
    if (status) query.status = status;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('category_id')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      leads,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get user leads error:', error);
    res.status(500).json({ error: 'Failed to get user leads' });
  }
});

// Reset monthly leads count (admin only)
router.post('/:id/reset-monthly', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { leads_received_this_month: 0 });
    res.json({ message: 'Monthly leads count reset successfully' });
  } catch (error) {
    console.error('Reset monthly error:', error);
    res.status(500).json({ error: 'Failed to reset monthly count' });
  }
});

export default router;
