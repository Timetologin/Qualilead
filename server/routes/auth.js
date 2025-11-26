import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbHelpers.findUserByEmail(email);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await dbHelpers.updateUser(user.id, { last_login: new Date().toISOString() });

    // Generate token
    const token = generateToken(user.id);

    // Get user's categories
    const categories = dbHelpers.getUserCategories(user.id);

    // Get unread notifications count
    const unreadCount = dbHelpers.getNotifications(user.id, true).length;

    // Remove password from response
    const { password: _, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      token,
      user: {
        ...safeUser,
        categories,
        unread_notifications: unreadCount
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register (admin only creates clients)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create users' });
    }

    const { 
      email, 
      password, 
      name, 
      phone, 
      company_name, 
      package_type = 'starter',
      categories = []
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if email exists
    const existingUser = dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Set limits based on package
    let monthlyLimit = 20;
    let categoriesAllowed = 1;
    let isVip = false;
    let dedicatedManagerId = null;

    switch (package_type) {
      case 'professional':
        monthlyLimit = 50;
        categoriesAllowed = 3;
        isVip = true;
        dedicatedManagerId = req.user.id;
        break;
      case 'enterprise':
        monthlyLimit = -1;
        categoriesAllowed = -1;
        isVip = true;
        dedicatedManagerId = req.user.id;
        break;
      case 'pay_per_lead':
        monthlyLimit = 0;
        categoriesAllowed = -1;
        break;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await dbHelpers.createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      company_name,
      role: 'client',
      package_type,
      monthly_lead_limit: monthlyLimit,
      leads_received_this_month: 0,
      categories_allowed: categoriesAllowed,
      is_vip: isVip,
      is_active: true,
      dedicated_manager_id: dedicatedManagerId
    });

    // Assign categories
    if (categories.length > 0) {
      await dbHelpers.setUserCategories(newUser.id, categories);
    }

    // Send welcome notification
    await dbHelpers.createNotification({
      user_id: newUser.id,
      title: 'Welcome to QualiLead!',
      message: `Your ${package_type} account has been created. Start receiving quality leads today!`,
      type: 'success'
    });

    res.status(201).json({ 
      message: 'User created successfully',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = dbHelpers.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's categories
    const categories = dbHelpers.getUserCategories(user.id);

    // Get dedicated manager info if exists
    let manager = null;
    if (user.dedicated_manager_id) {
      const managerUser = dbHelpers.findUserById(user.dedicated_manager_id);
      if (managerUser) {
        manager = {
          id: managerUser.id,
          name: managerUser.name,
          email: managerUser.email,
          phone: managerUser.phone
        };
      }
    }

    // Get unread notifications count
    const unreadCount = dbHelpers.getNotifications(user.id, true).length;

    // Remove password
    const { password: _, ...safeUser } = user;

    res.json({
      ...safeUser,
      categories,
      dedicated_manager: manager,
      current_usage: {
        leads_sent: user.leads_received_this_month,
        leads_limit: user.monthly_lead_limit
      },
      unread_notifications: unreadCount
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = dbHelpers.findUserById(req.user.id);
    
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await dbHelpers.updateUser(req.user.id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
