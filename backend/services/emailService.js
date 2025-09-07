const nodemailer = require('nodemailer');

// Gmail email transporter
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your restaurant's Gmail
      pass: process.env.GMAIL_APP_PASSWORD // App password (not your regular password)
    }
  });
};

// Send feedback request email to customers
const sendFeedbackEmail = async (orderData) => {
  try {
    const transporter = createGmailTransporter();
    
    const { orderId, orderType, customerName, customerEmail } = orderData;
    
    if (!customerEmail) {
      console.warn(`⚠️ No email for order ${orderId} - cannot send feedback email`);
      return false;
    }

    const feedbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${orderId}`;
    
    let orderTypeText = '';
    switch (orderType) {
      case 'pre':
        orderTypeText = 'Pre-Order';
        break;
      case 'reservation':
        orderTypeText = 'Table Reservation';
        break;
      case 'qr':
        orderTypeText = 'Order';
        break;
      default:
        orderTypeText = 'Order';
    }

    const mailOptions = {
      from: `"Mian Taste Restaurant" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `🍜 How was your experience at Mian Taste? - ${orderTypeText} ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 28px;">🍜 Mian Taste</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Authentic Asian Cuisine</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${customerName}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for choosing Mian Taste! Your ${orderTypeText.toLowerCase()} <strong>${orderId}</strong> has been completed.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
              We hope you enjoyed your meal! We'd love to hear about your experience to help us serve you better in the future.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${feedbackUrl}" 
                 style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                ⭐ Rate Your Experience
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
              Your feedback helps us improve our service and ensures every customer has an amazing dining experience.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                Thank you for dining with us!<br>
                <strong>The Mian Taste Team</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 11px;">
              This email was sent because your ${orderTypeText.toLowerCase()} was marked as completed.
            </p>
          </div>
        </div>
      `,
      text: `
Hi ${customerName}!

Thank you for choosing Mian Taste! Your ${orderTypeText.toLowerCase()} ${orderId} has been completed.

We hope you enjoyed your meal! Please take a moment to rate your experience:
${feedbackUrl}

Your feedback helps us improve our service.

Thank you for dining with us!
The Mian Taste Team
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Feedback email sent successfully:', {
      orderId,
      email: customerEmail,
      messageId: result.messageId
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error sending feedback email:', error);
    return false;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    console.log('✅ Gmail email configuration is working!');
    return true;
  } catch (error) {
    console.error('❌ Gmail configuration error:', error.message);
    console.log('💡 Make sure you have set up your Gmail App Password correctly');
    return false;
  }
};

// Send test email
const sendTestEmail = async (testEmail) => {
  try {
    const transporter = createGmailTransporter();
    
    const mailOptions = {
      from: `"Mian Taste Restaurant" <${process.env.GMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 Test Email from Mian Taste Restaurant System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">🍜 Mian Taste Restaurant</h1>
          <p>This is a test email to verify your email system is working correctly!</p>
          <p>✅ If you received this email, your Gmail integration is working perfectly.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Test sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully to:', testEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return false;
  }
};

module.exports = {
  sendFeedbackEmail,
  testEmailConfig,
  sendTestEmail
};