import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Category, Notification } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qualilead-secret-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('categories')
      .populate('dedicated_manager_id', 'name email phone');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      company_name: user.company_name,
      role: user.role,
      package_type: user.package_type,
      monthly_lead_limit: user.monthly_lead_limit,
      leads_received_this_month: user.leads_received_this_month,
      categories_allowed: user.categories_allowed,
      categories: user.categories,
      dedicated_manager: user.dedicated_manager_id,
      is_vip: user.is_vip
    };

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register new client
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, company_name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get default category
    const defaultCategory = await Category.findOne({ is_active: true });

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone: phone || '',
      company_name: company_name || '',
      role: 'client',
      package_type: 'starter',
      monthly_lead_limit: 20,
      categories_allowed: 1,
      categories: defaultCategory ? [defaultCategory._id] : []
    });

    // Create welcome notification
    await Notification.create({
      user_id: user._id,
      title: 'ברוכים הבאים ל-QualiLead!',
      message: 'החשבון שלך נוצר בהצלחה. התחל לקבל לידים איכותיים!',
      type: 'success'
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        package_type: user.package_type
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('categories')
      .populate('dedicated_manager_id', 'name email phone')
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      company_name: user.company_name,
      role: user.role,
      package_type: user.package_type,
      monthly_lead_limit: user.monthly_lead_limit,
      leads_received_this_month: user.leads_received_this_month,
      categories_allowed: user.categories_allowed,
      categories: user.categories,
      dedicated_manager: user.dedicated_manager_id,
      is_vip: user.is_vip
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(current_password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
