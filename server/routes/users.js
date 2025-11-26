import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../database.js';
import { authenticateToken, requireAdmin, requireAdminOrSelf } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, package_type, search, page = 1, limit = 20 } = req.query;
    
    let users = dbHelpers.getUsers();
    
    if (role) users = users.filter(u => u.role === role);
    if (package_type) users = users.filter(u => u.package_type === package_type);
    if (search) {
      const term = search.toLowerCase();
      users = users.filter(u => 
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.company_name?.toLowerCase().includes(term)
      );
    }

    const total = users.length;
    const offset = (page - 1) * limit;
    users = users.slice(offset, offset + parseInt(limit));

    // Remove passwords and add extra info
    const usersWithDetails = users.map(user => {
      const { password: _, ...safeUser } = user;
      const categories = dbHelpers.getUserCategories(user.id);
      const leads = dbHelpers.getLeads({ assigned_to: user.id });
      
      return {
        ...safeUser,
        category_count: categories.length,
        leads_this_month: leads.filter(l => {
          const sentDate = new Date(l.sent_at || l.created_at);
          const now = new Date();
          return sentDate.getMonth() === now.getMonth() && sentDate.getFullYear() === now.getFullYear();
        }).length
      };
    });

    res.json({
      users: usersWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get single user
router.get('/:id', authenticateToken, requireAdminOrSelf, async (req, res) => {
  try {
    const user = dbHelpers.findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...safeUser } = user;
    const categories = dbHelpers.getUserCategories(user.id);
    const leads = dbHelpers.getLeads({ assigned_to: user.id });

    let manager = null;
    if (user.dedicated_manager_id) {
      const managerUser = dbHelpers.findUserById(user.dedicated_manager_id);
      if (managerUser) {
        manager = { id: managerUser.id, name: managerUser.name, email: managerUser.email, phone: managerUser.phone };
      }
    }

    res.json({
      ...safeUser,
      categories,
      leads_this_month: leads,
      dedicated_manager: manager
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = dbHelpers.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      name, phone, company_name, package_type, monthly_lead_limit,
      categories_allowed, is_vip, is_active, dedicated_manager_id, categories
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (company_name !== undefined) updates.company_name = company_name;
    if (package_type !== undefined) updates.package_type = package_type;
    if (monthly_lead_limit !== undefined) updates.monthly_lead_limit = monthly_lead_limit;
    if (categories_allowed !== undefined) updates.categories_allowed = categories_allowed;
    if (is_vip !== undefined) updates.is_vip = is_vip;
    if (is_active !== undefined) updates.is_active = is_active;
    if (dedicated_manager_id !== undefined) updates.dedicated_manager_id = dedicated_manager_id;

    if (Object.keys(updates).length > 0) {
      await dbHelpers.updateUser(req.params.id, updates);
    }

    if (categories !== undefined) {
      await dbHelpers.setUserCategories(req.params.id, categories);
    }

    // Notify if VIP status changed
    if (is_vip !== undefined && is_vip !== user.is_vip) {
      await dbHelpers.createNotification({
        user_id: req.params.id,
        title: is_vip ? 'Welcome to VIP!' : 'VIP Status Changed',
        message: is_vip ? 'You now have VIP status with dedicated support!' : 'Your VIP status has been updated.',
        type: 'vip'
      });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Reset user password (admin only)
router.post('/:id/reset-password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = dbHelpers.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await dbHelpers.updateUser(req.params.id, { password: hashedPassword });

    await dbHelpers.createNotification({
      user_id: req.params.id,
      title: 'Password Reset',
      message: 'Your password has been reset by an administrator.',
      type: 'warning'
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Delete user (admin only) - soft delete
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = dbHelpers.findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    await dbHelpers.updateUser(req.params.id, { is_active: false });
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user's leads
router.get('/:id/leads', authenticateToken, requireAdminOrSelf, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;

    let leads = dbHelpers.getLeads({ assigned_to: req.params.id });

    if (status) leads = leads.filter(l => l.status === status);
    if (category) leads = leads.filter(l => l.category_id === category);

    const total = leads.length;
    const offset = (page - 1) * limit;
    leads = leads.slice(offset, offset + parseInt(limit));

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user leads error:', error);
    res.status(500).json({ error: 'Failed to get user leads' });
  }
});

export default router;
