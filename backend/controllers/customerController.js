const getCustomerModel = require('../models/Customer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Register new customer
const registerCustomer = async (req, res) => {
  try {
    // Get Customer model
    const Customer = getCustomerModel();
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, email, password, phoneNumber, address } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create new customer
    const customer = new Customer({
      username,
      email,
      password, // Will be hashed by the pre-save middleware
      phoneNumber,
      address
    });

    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        token,
        user: {
          id: customer._id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          createdAt: customer.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login customer
const loginCustomer = async (req, res) => {
  try {
    // Get Customer model
    const Customer = getCustomerModel();
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await customer.updateLastLogin();

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: customer._id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address
        }
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get customer profile
const getCustomerProfile = async (req, res) => {
  try {
    // Get Customer model
    const Customer = getCustomerModel();
    
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: customer._id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
  try {
    // Get Customer model
    const Customer = getCustomerModel();
    
    const { username, phoneNumber, address } = req.body;
    
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update fields
    if (username) customer.username = username;
    if (phoneNumber) customer.phoneNumber = phoneNumber;
    if (address) customer.address = address;

    await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: customer._id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          updatedAt: customer.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
  try {
    const Customer = getCustomerModel();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiry (1 hour from now)
    customer.resetPasswordToken = resetToken;
    customer.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    await customer.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken, customer.username);
    
    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email address.'
      });
    } else {
      // Clear the reset token if email failed
      customer.resetPasswordToken = null;
      customer.resetPasswordExpires = null;
      await customer.save();
      
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const Customer = getCustomerModel();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { token, newPassword } = req.body;

    // Find customer with valid reset token
    const customer = await Customer.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update password
    customer.password = newPassword; // Will be hashed by pre-save middleware
    customer.resetPasswordToken = null;
    customer.resetPasswordExpires = null;
    
    await customer.save();

    // Generate new JWT token
    const jwtToken = generateToken(customer._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You are now logged in.',
      data: {
        token: jwtToken,
        user: {
          id: customer._id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address
        }
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  forgotPassword,
  resetPassword
};
