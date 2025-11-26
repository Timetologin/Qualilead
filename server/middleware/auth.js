import jwt from 'jsonwebtoken';
import db, { dbHelpers } from '../database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'qualilead-super-secret-key-change-in-production';

// Verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = dbHelpers.findUserById(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Remove password from user object
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if user is admin or accessing their own data
export const requireAdminOrSelf = (req, res, next) => {
  const requestedUserId = req.params.userId || req.params.id;
  
  if (req.user.role !== 'admin' && req.user.id !== requestedUserId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Check if user is VIP (professional or enterprise package)
export const requireVIP = (req, res, next) => {
  if (!['professional', 'enterprise'].includes(req.user.package_type) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'VIP access required' });
  }
  next();
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export default {
  authenticateToken,
  requireAdmin,
  requireAdminOrSelf,
  requireVIP,
  generateToken
};
