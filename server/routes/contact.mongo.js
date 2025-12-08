import express from 'express';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Store contact messages (in production, you'd save to database)
const contactMessages = [];

// Submit contact form
router.post('/', validate(schemas.contact), async (req, res) => {
  try {
    const { name, email, phone, business, message } = req.body;

    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      business: business || '',
      message,
      created_at: new Date(),
      status: 'new'
    };

    // In production, save to database and send notification email
    contactMessages.push(contactMessage);

    // Log for now (in production, send email notification to admin)
    console.log('📧 New contact form submission:', {
      name,
      email,
      phone,
      business,
      message: message.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Get all contact messages (admin only - for future use)
router.get('/', async (req, res) => {
  try {
    res.json({ messages: contactMessages });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

export default router;
