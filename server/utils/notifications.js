import nodemailer from 'nodemailer';

// Email transporter (configure with real SMTP settings in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Send lead notification via email
export async function sendLeadEmail(user, lead) {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email not configured - skipping email notification');
      console.log(`Would send email to ${user.email} about lead: ${lead.customer_name}`);
      return { success: true, message: 'Email not configured (dev mode)' };
    }

    const mailOptions = {
      from: `"QualiLead" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `🎯 New Lead: ${lead.customer_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0a1628 0%, #152238 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; color: #d4af37; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e8eef3; }
            .lead-card { background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #d4af37; margin: 20px 0; }
            .lead-card h2 { margin-top: 0; color: #0a1628; }
            .field { margin: 10px 0; }
            .field-label { font-weight: bold; color: #666; }
            .field-value { color: #0a1628; font-size: 18px; }
            .cta { background: #d4af37; color: #0a1628; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QualiLead</h1>
              <p>New Lead Notification</p>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>Great news! You've received a new lead:</p>
              
              <div class="lead-card">
                <h2>📋 Lead Details</h2>
                <div class="field">
                  <div class="field-label">Customer Name</div>
                  <div class="field-value">${lead.customer_name}</div>
                </div>
                <div class="field">
                  <div class="field-label">Phone Number</div>
                  <div class="field-value">${lead.customer_phone}</div>
                </div>
                ${lead.customer_email ? `
                <div class="field">
                  <div class="field-label">Email</div>
                  <div class="field-value">${lead.customer_email}</div>
                </div>
                ` : ''}
                ${lead.service_area ? `
                <div class="field">
                  <div class="field-label">Service Area</div>
                  <div class="field-value">${lead.service_area}</div>
                </div>
                ` : ''}
                ${lead.notes ? `
                <div class="field">
                  <div class="field-label">Notes</div>
                  <div class="field-value">${lead.notes}</div>
                </div>
                ` : ''}
              </div>
              
              <p>⚡ <strong>Act fast!</strong> Contact this lead as soon as possible for the best results.</p>
              
              <a href="tel:${lead.customer_phone}" class="cta">📞 Call Now</a>
            </div>
            <div class="footer">
              <p>© 2025 QualiLead — All Rights Reserved | Built for Josh O</p>
              <p>You received this email because you're a QualiLead customer.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
    return { success: true, message: 'Email sent' };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: error.message };
  }
}

// Send lead notification via SMS using Twilio
export async function sendLeadSMS(user, lead) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    // Check if Twilio is configured
    if (!accountSid || !authToken || !twilioPhone) {
      console.log('Twilio not configured - SMS notification in dev mode:');
      console.log(`To: ${user.phone}`);
      console.log(`Message: 🎯 ליד חדש מ-QualiLead! ${lead.customer_name} - ${lead.customer_phone}. התקשר עכשיו!`);
      return { success: true, message: 'SMS not configured (dev mode)' };
    }

    // Check if user has a phone number
    if (!user.phone) {
      console.log('User has no phone number - skipping SMS');
      return { success: false, message: 'No phone number' };
    }

    // Format phone number (ensure it has country code)
    let phoneNumber = user.phone.replace(/\D/g, '');
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '972' + phoneNumber.substring(1); // Israel country code
    }
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }

    // Create Twilio client
    const { Twilio } = await import('twilio');
    const client = new Twilio(accountSid, authToken);

    // Build message
    const message = `🎯 ליד חדש מ-QualiLead!

👤 שם: ${lead.customer_name}
📞 טלפון: ${lead.customer_phone}
${lead.service_area ? `📍 אזור: ${lead.service_area}` : ''}

התקשר עכשיו! ⚡`;

    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber
    });

    console.log(`SMS sent to ${phoneNumber}, SID: ${result.sid}`);
    return { success: true, message: 'SMS sent', sid: result.sid };

  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, message: error.message };
  }
}

// Send SMS test message
export async function sendTestSMS(phoneNumber) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      throw new Error('Twilio credentials not configured');
    }

    // Format phone number
    let phone = phoneNumber.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '972' + phone.substring(1);
    }
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const { Twilio } = await import('twilio');
    const client = new Twilio(accountSid, authToken);

    const result = await client.messages.create({
      body: '✅ הודעת בדיקה מ-QualiLead. אם אתה רואה הודעה זו, השירות מוגדר בהצלחה!',
      from: twilioPhone,
      to: phone
    });

    return { success: true, message: 'Test SMS sent', sid: result.sid };
  } catch (error) {
    console.error('Test SMS error:', error);
    return { success: false, message: error.message };
  }
}

// Send bulk SMS to multiple users
export async function sendBulkSMS(users, message) {
  const results = [];
  
  for (const user of users) {
    if (user.phone) {
      const result = await sendLeadSMS(user, { customer_name: 'QualiLead', customer_phone: '' });
      results.push({ userId: user.id, ...result });
    }
  }
  
  return results;
}

// Send welcome email to new user
export async function sendWelcomeEmail(user, password) {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email not configured - skipping welcome email');
      return { success: true, message: 'Email not configured (dev mode)' };
    }

    const mailOptions = {
      from: `"QualiLead" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Welcome to QualiLead! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0a1628 0%, #152238 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; color: #d4af37; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e8eef3; }
            .credentials { background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #d4af37; margin: 20px 0; }
            .cta { background: #d4af37; color: #0a1628; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QualiLead</h1>
              <p>Welcome Aboard! 🚀</p>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>Welcome to QualiLead! Your account has been created and you're ready to start receiving quality leads.</p>
              
              <div class="credentials">
                <h3>Your Login Credentials</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p style="color: #e74c3c; font-size: 12px;">⚠️ Please change your password after first login.</p>
              </div>
              
              <p>What's next?</p>
              <ul>
                <li>Log in to your dashboard</li>
                <li>Review your package details</li>
                <li>Wait for leads to arrive!</li>
              </ul>
              
              <a href="${process.env.APP_URL || 'http://localhost:5173'}/login" class="cta">Go to Dashboard</a>
            </div>
            <div class="footer">
              <p>© 2025 QualiLead — All Rights Reserved | Built for Josh O</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, message: error.message };
  }
}

export default {
  sendLeadEmail,
  sendLeadSMS,
  sendWelcomeEmail
};
