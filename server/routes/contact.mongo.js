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

// Send notification email using Resend API
const sendNotificationEmail = async (contactData) => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️ RESEND_API_KEY not configured - email not sent');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'newnewfifa22@gmail.com';

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
          <h3 style="color: #d4af37; margin: 0 0 15px 0;">פרטי הפונה:</h3>
          <table style="width: 100%; color: #ffffff;">
            <tr>
              <td style="padding: 8px 0; color: #b8c5d1;"><strong>שם:</strong></td>
              <td style="padding: 8px 0;">${contactData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8c5d1;"><strong>אימייל:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${contactData.email}" style="color: #d4af37;">${contactData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8c5d1;"><strong>טלפון:</strong></td>
              <td style="padding: 8px 0;"><a href="tel:${contactData.phone}" style="color: #d4af37;">${contactData.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8c5d1;"><strong>סוג עסק:</strong></td>
              <td style="padding: 8px 0;">${businessLabels[contactData.business] || contactData.business || 'לא צוין'}</td>
            </tr>
          </table>
        </div>

        <div style="background: #152238; padding: 20px; border-radius: 8px;">
          <h3 style="color: #d4af37; margin: 0 0 15px 0;">ההודעה:</h3>
          <p style="color: #ffffff; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${contactData.email}?subject=תודה על פנייתך ל-QualiLead" 
             style="display: inline-block; background: #d4af37; color: #0a1628; padding: 12px 30px; 
                    border-radius: 5px; text-decoration: none; font-weight: bold;">
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
        to: adminEmail,
        subject: `🔔 פנייה חדשה מ-${contactData.name}`,
        html: htmlContent
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Notification email sent via Resend to:', adminEmail);
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
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Update message status (admin only)
router.patch('/:id', async (req, res) => {
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
    console.error('Update message error:', error);
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

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;