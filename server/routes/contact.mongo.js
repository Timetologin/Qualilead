import express from 'express';
import mongoose from 'mongoose';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  business: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  notes: { type: String, default: '' }
}, { timestamps: true });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Send notification email using Resend API to MULTIPLE recipients
const sendNotificationEmail = async (contactData) => {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Support multiple emails: ADMIN_EMAILS (comma-separated) or fallback to ADMIN_EMAIL
  const emailsString = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'newnewfifa22@gmail.com';
  
  if (!apiKey) {
    console.log('⚠️ RESEND_API_KEY not configured - email not sent');
    return false;
  }

  // Parse comma-separated emails into array
  const adminEmails = emailsString.split(',').map(email => email.trim()).filter(email => email);

  if (adminEmails.length === 0) {
    console.log('⚠️ No admin emails configured');
    return false;
  }

  const businessLabels = {
    beauty: 'קוסמטיקאיות ואסתטיקה',
    hair: 'מספרות וספרים',
    ac: 'טכנאי מזגנים',
    renovation: 'שיפוצים',
    electrician: 'חשמלאים',
    plumber: 'אינסטלטורים',
    other: 'אחר'
  };

  const htmlContent = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0a1628 0%, #1e2d3d 100%); padding: 30px; border-radius: 10px;">
        <h1 style="color: #d4af37; margin: 0 0 20px 0; text-align: center;">📧 פנייה חדשה מהאתר</h1>
        
        <div style="background: #152238; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #d4af37;">👤 שם:</strong> <span style="color: #e8f1f8;">${contactData.name}</span></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #d4af37;">📧 אימייל:</strong> <a href="mailto:${contactData.email}" style="color: #60a5fa;">${contactData.email}</a></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #d4af37;">📱 טלפון:</strong> <a href="tel:${contactData.phone}" style="color: #60a5fa;">${contactData.phone}</a></p>
          ${contactData.business ? `<p style="margin: 0 0 10px 0;"><strong style="color: #d4af37;">🏢 תחום:</strong> <span style="color: #e8f1f8;">${businessLabels[contactData.business] || contactData.business}</span></p>` : ''}
        </div>

        <div style="background: #152238; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #d4af37;">💬 הודעה:</strong></p>
          <p style="color: #e8f1f8; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${contactData.email}?subject=תגובה לפנייתך ל-QualiLead" 
             style="display: inline-block; background: #d4af37; color: #0a1628; padding: 12px 30px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
          השב לפונה
          </a>
        </div>

        <p style="color: #b8c5d1; text-align: center; margin-top: 20px; font-size: 12px;">
          נשלח מ-QualiLead • ${new Date().toLocaleString('he-IL')}
        </p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'QualiLead <onboarding@resend.dev>',
        to: adminEmails, // Array of emails!
        subject: `🔔 פנייה חדשה מ-${contactData.name}`,
        html: htmlContent
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Notification email sent via Resend to:', adminEmails.join(', '));
      return true;
    } else {
      console.error('❌ Resend API error:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return false;
  }
};

// Submit contact form
router.post('/', validate(schemas.contact), async (req, res) => {
  try {
    const { name, email, phone, business, message } = req.body;

    // Save to MongoDB
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      business: business || '',
      message,
      status: 'new'
    });

    console.log('📧 New contact form submission saved:', {
      id: contactMessage._id,
      name,
      email,
      phone
    });

    // Send email notification (non-blocking)
    sendNotificationEmail({ name, email, phone, business, message });

    res.status(201).json({
      success: true,
      message: 'תודה על פנייתך! נחזור אליך בהקדם.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'שגיאה בשליחת הטופס. נסה שוב.' });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update message status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Update contact message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;