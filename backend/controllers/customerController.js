const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Register new customer
const registerCustomer = async (req, res) => {
  try {
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

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile
};
