import nodemailer from 'nodemailer';

// Email transporter setup
let transporter = null;

function getTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

// Send lead notification via email
export async function sendLeadEmail(user, lead) {
  const transport = getTransporter();
  
  if (!transport) {
    console.log('📧 Email not configured - skipping email notification');
    return { success: false, reason: 'Email not configured' };
  }

  try {
    const categoryName = lead.category_id?.name_he || 'לא מוגדר';
    
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0a1628, #152238); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .lead-info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .label { color: #64748b; font-size: 12px; margin-bottom: 4px; }
          .value { color: #1e293b; font-size: 16px; font-weight: bold; }
          .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .cta { display: inline-block; background: #d4af37; color: #0a1628; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ליד חדש מ-QualiLead!</h1>
          </div>
          <div class="content">
            <p>שלום ${user.name},</p>
            <p>קיבלת ליד חדש במערכת!</p>
            
            <div class="lead-info">
              <div class="label">שם הלקוח</div>
              <div class="value">${lead.customer_name}</div>
            </div>
            
            <div class="lead-info">
              <div class="label">טלפון</div>
              <div class="value">${lead.customer_phone}</div>
            </div>
            
            ${lead.customer_email ? `
            <div class="lead-info">
              <div class="label">אימייל</div>
              <div class="value">${lead.customer_email}</div>
            </div>
            ` : ''}
            
            <div class="lead-info">
              <div class="label">קטגוריה</div>
              <div class="value">${categoryName}</div>
            </div>
            
            ${lead.service_area ? `
            <div class="lead-info">
              <div class="label">אזור שירות</div>
              <div class="value">${lead.service_area}</div>
            </div>
            ` : ''}
            
            ${lead.notes ? `
            <div class="lead-info">
              <div class="label">הערות</div>
              <div class="value">${lead.notes}</div>
            </div>
            ` : ''}
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="cta">
                צפה בליד במערכת
              </a>
            </p>
          </div>
          <div class="footer">
            © 2025 QualiLead — All Rights Reserved<br>
            ליד זה נשלח אליך כחלק מהמנוי שלך
          </div>
        </div>
      </body>
      </html>
    `;

    await transport.sendMail({
      from: `"QualiLead" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `🎯 ליד חדש: ${lead.customer_name}`,
      html: emailHtml
    });

    console.log(`📧 Email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// Send lead notification via SMS (Twilio)
export async function sendLeadSMS(user, lead) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('📱 SMS not configured - skipping SMS notification');
    return { success: false, reason: 'SMS not configured' };
  }

  try {
    // Dynamic import of Twilio
    const twilio = await import('twilio');
    const client = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const categoryName = lead.category_id?.name_he || 'לא מוגדר';
    
    const message = `🎯 ליד חדש מ-QualiLead!
שם: ${lead.customer_name}
טלפון: ${lead.customer_phone}
קטגוריה: ${categoryName}
${lead.service_area ? `אזור: ${lead.service_area}` : ''}

היכנס למערכת לפרטים נוספים`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone
    });

    console.log(`📱 SMS sent to ${user.phone}`);
    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
}

export default { sendLeadEmail, sendLeadSMS };
