import express from 'express';
import { Notification } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { unread_only, page = 1, limit = 20 } = req.query;

    let query = { user_id: req.user.id };
    if (unread_only === 'true') {
      query.is_read = false;
    }

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user_id: req.user.id, is_read: false });

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      notifications,
      unread_count: unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, is_read: false },
      { is_read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Create notification (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, title, message, type, link } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' });
    }

    const notification = await Notification.create({
      user_id,
      title,
      message,
      type: type || 'info',
      link: link || ''
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Send notification to all clients (admin only)
router.post('/broadcast', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    // Get all active clients
    const User = (await import('../models/index.js')).User;
    const clients = await User.find({ role: 'client', is_active: true }).select('_id');

    // Create notifications for all clients
    const notifications = clients.map(client => ({
      user_id: client._id,
      title,
      message,
      type: type || 'info'
    }));

    await Notification.insertMany(notifications);

    res.json({ message: `Notification sent to ${clients.length} clients` });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
