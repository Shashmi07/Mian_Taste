const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getAdminConnection } = require('../config/adminDatabase');
const AdminUserSchema = require('../models/AdminUser').schema;

// Get AdminUser model
const getAdminUserModel = () => {
  const adminConn = getAdminConnection();
  return adminConn.model('AdminUser', AdminUserSchema);
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const AdminUser = getAdminUserModel();
    
    // Find user by email
    const user = await AdminUser.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        permissions: user.permissions
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        permissions: user.permissions,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Create first admin (for initial setup)
const createFirstAdmin = async (req, res) => {
  try {
    const AdminUser = getAdminUserModel();
    
    // Check if any admin exists
    const existingAdmin = await AdminUser.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. Use regular user creation endpoint.'
      });
    }

    const {
      username,
      email,
      password,
      fullName,
      phoneNumber,
      address
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create first admin
    const admin = new AdminUser({
      username,
      email,
      password,
      fullName,
      role: 'admin',
      phoneNumber,
      address
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'First admin created successfully',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
        address: admin.address,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Create first admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create first admin',
      error: error.message
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const AdminUser = getAdminUserModel();
    const user = await AdminUser.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

// Routes
router.post('/login', adminLogin);
router.post('/create-first-admin', createFirstAdmin);
// router.get('/me', auth, getCurrentUser); // Uncomment when auth middleware is ready

module.exports = router;
