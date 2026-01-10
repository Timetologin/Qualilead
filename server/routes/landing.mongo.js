import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Send notification email via Resend to MULTIPLE recipients
const sendNotificationEmail = async (leadData) => {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Support multiple emails: ADMIN_EMAILS (comma-separated) or fallback to ADMIN_EMAIL
  const emailsString = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL;
  
  if (!apiKey || !emailsString) {
    console.log('⚠️ Email not configured - skipping notification');
    return false;
  }

  // Parse comma-separated emails into array
  const adminEmails = emailsString.split(',').map(email => email.trim()).filter(email => email);

  if (adminEmails.length === 0) {
    console.log('⚠️ No admin emails configured');
    return false;
  }

  // Light theme - works perfectly in Gmail dark mode
  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a365d; border-radius: 12px 12px 0 0;">
          <tr>
            <td style="padding: 25px; text-align: center;">
              <h1 style="color: #ffd700; margin: 0; font-size: 22px;">🎯 ליד חדש מדף נחיתה!</h1>
              <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px;">התקבל ליד חדש מ: <strong>${leadData.landing_page || 'לא ידוע'}</strong></p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #1a365d; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #ffd700; padding-bottom: 10px;">פרטי הליד:</h3>
              
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666666; font-size: 14px; width: 100px;">👤 שם:</td>
                  <td style="color: #333333; font-size: 16px; font-weight: bold;">${leadData.customer_name}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px;">📱 טלפון:</td>
                  <td style="font-size: 16px;"><a href="tel:${leadData.customer_phone}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${leadData.customer_phone}</a></td>
                </tr>
                ${leadData.customer_email ? `
                <tr>
                  <td style="color: #666666; font-size: 14px;">📧 אימייל:</td>
                  <td style="font-size: 15px;"><a href="mailto:${leadData.customer_email}" style="color: #2563eb; text-decoration: none;">${leadData.customer_email}</a></td>
                </tr>
                ` : ''}
                ${leadData.customer_address ? `
                <tr>
                  <td style="color: #666666; font-size: 14px;">📍 עיר:</td>
                  <td style="color: #333333; font-size: 15px;">${leadData.customer_address}</td>
                </tr>
                ` : ''}
                ${leadData.notes ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; vertical-align: top;">📝 פרטים:</td>
                  <td style="color: #333333; font-size: 14px; white-space: pre-line;">${leadData.notes}</td>
                </tr>
                ` : ''}
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="tel:${leadData.customer_phone}" style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      📞 התקשר עכשיו
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 0 0 12px 12px;">
          <tr>
            <td style="padding: 15px; text-align: center;">
              <p style="color: #999999; margin: 0; font-size: 12px;">
                נשלח מ-QualiLead • ${new Date().toLocaleString('he-IL')}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'QualiLead <noreply@qualilead.online>',
        to: adminEmails, // Array of emails!
        subject: `🎯 ליד חדש: ${leadData.customer_name} | ${leadData.landing_page || 'דף נחיתה'}`,
        html: htmlContent
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Lead notification email sent to:', adminEmails.join(', '));
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

    // Insert directly to MongoDB to bypass Mongoose schema validation
    const db = mongoose.connection.db;
    const leadsCollection = db.collection('leads');
    
    // Generate ObjectId for both _id and id field
    const objectId = new mongoose.Types.ObjectId();
    
    const leadDoc = {
      _id: objectId,
      id: objectId.toString(),
      customer_name: name,
      customer_phone: phone,
      customer_email: email || '',
      customer_address: city || '',
      source: 'landing_page',
      landing_page: landing_page || '',
      notes: notes || '',
      status: 'new',
      priority: 'normal',
      assigned_to: null,
      assigned_at: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await leadsCollection.insertOne(leadDoc);

    console.log('🎯 New lead from landing page:', {
      id: result.insertedId,
      name: leadDoc.customer_name,
      phone: leadDoc.customer_phone,
      landing_page: leadDoc.landing_page
    });

    // Send email notification (non-blocking)
    sendNotificationEmail({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      customer_address: city,
      landing_page: landing_page,
      notes: notes
    });

    res.status(201).json({
      success: true,
      message: 'תודה! נחזור אליך בהקדם.',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Landing page submission error:', error);
    res.status(500).json({ 
      error: 'שגיאה בשליחת הטופס. נסה שוב.' 
    });
  }
});

// Health check for landing routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'landing' });
});

export default router;
