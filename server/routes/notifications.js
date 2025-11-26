import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;

    let notifications = dbHelpers.getNotifications(req.user.id, unread_only === 'true');
    
    const total = notifications.length;
    const unreadCount = dbHelpers.getNotifications(req.user.id, true).length;
    
    const offset = (page - 1) * limit;
    notifications = notifications.slice(offset, offset + parseInt(limit));

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
    const notification = db.data.notifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await dbHelpers.markNotificationRead(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await dbHelpers.markAllNotificationsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Send notification to specific user (admin only)
router.post('/send', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, title, message, type = 'info' } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' });
    }

    const user = dbHelpers.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await dbHelpers.createNotification({
      user_id,
      title,
      message,
      type
    });

    res.status(201).json({ 
      message: 'Notification sent successfully',
      notificationId: notification.id 
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Broadcast notification to all clients or VIP clients (admin only)
router.post('/broadcast', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, message, type = 'info', vip_only = false } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    let clients = dbHelpers.getUsers({ role: 'client' }).filter(u => u.is_active);
    
    if (vip_only) {
      clients = clients.filter(u => u.is_vip);
    }

    let sentCount = 0;
    for (const client of clients) {
      await dbHelpers.createNotification({
        user_id: client.id,
        title,
        message,
        type: vip_only ? 'vip' : type
      });
      sentCount++;
    }

    res.json({ 
      message: `Notification broadcast to ${sentCount} clients`,
      sent_count: sentCount 
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
});

// Send VIP message (admin only)
router.post('/vip-message', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, title, message } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' });
    }

    const user = dbHelpers.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.is_vip) {
      return res.status(400).json({ error: 'User is not a VIP client' });
    }

    const notification = await dbHelpers.createNotification({
      user_id,
      title,
      message,
      type: 'vip'
    });

    res.status(201).json({ 
      message: 'VIP message sent successfully',
      notificationId: notification.id 
    });
  } catch (error) {
    console.error('VIP message error:', error);
    res.status(500).json({ error: 'Failed to send VIP message' });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = db.data.notifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await dbHelpers.deleteNotification(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Clear all read notifications
router.delete('/clear/read', authenticateToken, async (req, res) => {
  try {
    db.data.notifications = db.data.notifications.filter(
      n => n.user_id !== req.user.id || !n.is_read
    );
    await db.write();

    res.json({ message: 'Read notifications cleared' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

export default router;
