const express = require('express');
const { testEmailConfig, sendTestEmail } = require('../services/emailService');
const router = express.Router();

// Test email configuration
router.get('/test-config', async (req, res) => {
  try {
    const isConfigValid = await testEmailConfig();
    
    if (isConfigValid) {
      res.json({
        success: true,
        message: '✅ Email configuration is working! You can send emails.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '❌ Email configuration failed. Check your Gmail setup.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing email config',
      error: error.message
    });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const emailSent = await sendTestEmail(email);
    
    if (emailSent) {
      res.json({
        success: true,
        message: `✅ Test email sent successfully to ${email}! Check your inbox.`
      });
    } else {
      res.status(500).json({
        success: false,
        message: '❌ Failed to send test email. Check your Gmail configuration.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
});

module.exports = router;