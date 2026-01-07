import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Lead Schema (same as in leads.mongo.js)
const leadSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_email: { type: String, default: '' },
  customer_phone: { type: String, required: true },
  customer_address: { type: String, default: '' },
  category_id: { type: String, default: '' },
  category_name: { type: String, default: '' },
  source: { type: String, default: 'landing_page' },
  landing_page: { type: String, default: '' },
  status: { type: String, default: 'new' },
  priority: { type: String, default: 'normal' },
  notes: { type: String, default: '' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assigned_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Use existing model or create new one
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// Send notification email via Resend
const sendNotificationEmail = async (leadData) => {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.log('⚠️ Email not configured - skipping notification');
    return false;
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
      <div style="background: linear-gradient(135deg, #0a1929 0%, #1a365d 100%); padding: 30px; border-radius: 12px;">
        <h1 style="color: #c9a227; margin: 0 0 10px 0; font-size: 24px;">🎯 ליד חדש מדף נחיתה!</h1>
        <p style="color: #a0aec0; margin: 0; font-size: 14px;">התקבל ליד חדש מ: ${leadData.landing_page || 'לא ידוע'}</p>
        
        <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #c9a227; margin: 0 0 15px 0; font-size: 16px;">פרטי הליד:</h3>
          
          <p style="color: #fff; margin: 8px 0;">
            <strong>👤 שם:</strong> ${leadData.customer_name}
          </p>
          <p style="color: #fff; margin: 8px 0;">
            <strong>📱 טלפון:</strong> 
            <a href="tel:${leadData.customer_phone}" style="color: #c9a227;">${leadData.customer_phone}</a>
          </p>
          ${leadData.customer_email ? `
          <p style="color: #fff; margin: 8px 0;">
            <strong>📧 אימייל:</strong> 
            <a href="mailto:${leadData.customer_email}" style="color: #c9a227;">${leadData.customer_email}</a>
          </p>
          ` : ''}
          ${leadData.customer_address ? `
          <p style="color: #fff; margin: 8px 0;">
            <strong>📍 עיר:</strong> ${leadData.customer_address}
          </p>
          ` : ''}
          ${leadData.category_name ? `
          <p style="color: #fff; margin: 8px 0;">
            <strong>📂 קטגוריה:</strong> ${leadData.category_name}
          </p>
          ` : ''}
          ${leadData.notes ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="color: #c9a227; margin: 0 0 8px 0;"><strong>📝 פרטים נוספים:</strong></p>
            <p style="color: #e2e8f0; margin: 0; white-space: pre-line;">${leadData.notes}</p>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://qualilead-five.vercel.app/admin/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #a68420 100%); 
                    color: #0a1929; padding: 12px 30px; border-radius: 8px; text-decoration: none; 
                    font-weight: bold; font-size: 14px;">
            צפה בלידים בדשבורד
          </a>
        </div>

        <p style="color: #718096; text-align: center; margin-top: 20px; font-size: 12px;">
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
        subject: `🎯 ליד חדש: ${leadData.customer_name} | ${leadData.landing_page || 'דף נחיתה'}`,
        html: htmlContent
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Lead notification email sent to:', adminEmail);
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

// Public endpoint for landing page submissions
router.post('/submit', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      city,
      category,
      category_name,
      landing_page,
      notes 
    } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({ 
        error: 'שם וטלפון הם שדות חובה' 
      });
    }

    // Phone validation
    const phoneRegex = /^[\d\-+() ]{9,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        error: 'מספר טלפון לא תקין' 
      });
    }

    // Create the lead
    const lead = await Lead.create({
      customer_name: name,
      customer_phone: phone,
      customer_email: email || '',
      customer_address: city || '',
      category_id: category || '',
      category_name: category_name || '',
      source: 'landing_page',
      landing_page: landing_page || '',
      notes: notes || '',
      status: 'new',
      priority: 'normal'
    });

    console.log('🎯 New lead from landing page:', {
      id: lead._id,
      name: lead.customer_name,
      phone: lead.customer_phone,
      landing_page: lead.landing_page
    });

    // Send email notification (non-blocking)
    sendNotificationEmail({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      customer_address: city,
      category_name: category_name,
      landing_page: landing_page,
      notes: notes
    });

    res.status(201).json({
      success: true,
      message: 'תודה! נחזור אליך בהקדם.',
      leadId: lead._id
    });

  } catch (error) {
    console.error('Landing page submission error:', error);
    res.status(500).json({ 
      error: 'שגיאה בשליחת הטופס. נסה שוב.' 
    });
  }
});

export default router;