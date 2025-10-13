const nodemailer = require('nodemailer');

// Gmail email transporter
const createGmailTransporter = () => {
  // Try multiple configurations for better reliability
  const gmailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000      // 60 seconds
  };

  return nodemailer.createTransport(gmailConfig);
};

// Send feedback request email to customers
const sendFeedbackEmail = async (orderData) => {
  try {
    const transporter = createGmailTransporter();
    
    const { orderId, orderType, customerName, customerEmail, preorderOrderType, deliveryAddress } = orderData;
    
    if (!customerEmail) {
      console.warn(`⚠️ No email for order ${orderId} - cannot send feedback email`);
      return false;
    }

    const feedbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${orderId}`;
    
    let orderTypeText = '';
    let isDeliveryOrder = false;
    
    switch (orderType) {
      case 'pre':
        // Check if this is a delivery preorder
        if (preorderOrderType === 'delivery') {
          orderTypeText = 'Delivery Order';
          isDeliveryOrder = true;
        } else {
          orderTypeText = 'Pre-Order';
        }
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
              Thank you for choosing Mian Taste! Your ${orderTypeText.toLowerCase()} <strong>${orderId}</strong> has been ${isDeliveryOrder ? 'delivered' : 'completed'}.
            </p>
            
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
              We hope you enjoyed your ${isDeliveryOrder ? 'delivered meal' : 'meal'}! We'd love to hear about your experience to help us serve you better in the future.
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

Thank you for choosing Mian Taste! Your ${orderTypeText.toLowerCase()} ${orderId} has been ${isDeliveryOrder ? 'delivered' : 'completed'}.

We hope you enjoyed your ${isDeliveryOrder ? 'delivered meal' : 'meal'}! Please take a moment to rate your experience:
${feedbackUrl}

Your feedback helps us improve our service.

Thank you for ${isDeliveryOrder ? 'choosing our delivery service' : 'dining with us'}!
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

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, customerName) => {
  try {
    const transporter = createGmailTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Mian Taste Restaurant" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - Mian Taste Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 28px;">🍜 Mian Taste</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Authentic Asian Cuisine</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${customerName}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Mian Taste account.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to create a new password. This link will expire in 1 hour for security reasons.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                🔐 Reset Password
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                For security reasons, this link will expire in 1 hour.<br>
                <strong>The Mian Taste Team</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 11px;">
              This email was sent because a password reset was requested for your account.
            </p>
          </div>
        </div>
      `,
      text: `
Hi ${customerName}!

We received a request to reset your password for your Mian Taste account.

Click this link to create a new password (expires in 1 hour):
${resetUrl}

If you didn't request a password reset, please ignore this email.

The Mian Taste Team
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', {
      email,
      messageId: result.messageId
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

// Send cancellation notification email to customers
const sendCancellationEmail = async (orderData) => {
  try {
    const transporter = createGmailTransporter();

    const { orderId, orderType, customerName, customerEmail } = orderData;

    if (!customerEmail) {
      console.warn(`⚠️ No email for order ${orderId} - cannot send cancellation email`);
      return false;
    }

    let orderTypeText = '';

    switch (orderType) {
      case 'pre':
        orderTypeText = 'Pre-Order';
        break;
      case 'reservation':
        orderTypeText = 'Table Reservation';
        break;
      default:
        orderTypeText = 'Order';
    }

    const mailOptions = {
      from: `"Mian Taste Restaurant" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `⚠️ Your ${orderTypeText} Has Been Cancelled - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 28px;">🍜 Mian Taste</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Authentic Asian Cuisine</p>
            </div>

            <h2 style="color: #333; margin-bottom: 20px;">Hi ${customerName},</h2>

            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
              <p style="color: #991b1b; margin: 0; font-weight: bold;">⚠️ ${orderTypeText} Cancelled</p>
            </div>

            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that your ${orderTypeText.toLowerCase()} <strong>${orderId}</strong> has been cancelled due to unavoidable circumstances.
            </p>

            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We sincerely apologize for any inconvenience this may have caused. This was an unexpected situation and we deeply regret having to cancel your ${orderTypeText.toLowerCase()}.
            </p>

            <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
              If you have already made a payment, it will be refunded within 3-5 business days. For any questions or concerns, please don't hesitate to contact us.
            </p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Need Assistance?</h3>
              <p style="color: #555; margin: 0; line-height: 1.6;">
                Please contact us if you have any questions:<br>
                📞 Phone: (+94) 76 983 5152<br>
                📧 Email: ${process.env.GMAIL_USER}
              </p>
            </div>

            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We value your patronage and hope to serve you again soon. Thank you for your understanding.
            </p>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                Sorry for any inconvenience caused,<br>
                <strong>The Mian Taste Team</strong>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 11px;">
              This email was sent because your ${orderTypeText.toLowerCase()} was cancelled by our staff.
            </p>
          </div>
        </div>
      `,
      text: `
Hi ${customerName},

We regret to inform you that your ${orderTypeText.toLowerCase()} ${orderId} has been cancelled due to unavoidable circumstances.

We sincerely apologize for any inconvenience this may have caused. This was an unexpected situation and we deeply regret having to cancel your ${orderTypeText.toLowerCase()}.

If you have already made a payment, it will be refunded within 3-5 business days.

For any questions or concerns, please contact us:
Phone: (+94) 76 983 5152
Email: ${process.env.GMAIL_USER}

We value your patronage and hope to serve you again soon.

Sorry for any inconvenience caused,
The Mian Taste Team
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Cancellation email sent successfully:', {
      orderId,
      email: customerEmail,
      messageId: result.messageId
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
    return false;
  }
};

module.exports = {
  sendFeedbackEmail,
  sendPasswordResetEmail,
  sendCancellationEmail,
  testEmailConfig,
  sendTestEmail
};