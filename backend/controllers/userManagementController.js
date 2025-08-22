const { getAdminConnection } = require('../config/adminDatabase');
const { getCustomerConnection } = require('../config/customerDatabase');
const AdminUserSchema = require('../models/AdminUser').schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Cache models to prevent recompilation errors
let adminUserModel = null;
let customerModel = null;

// Get models for different connections
const getAdminUserModel = () => {
  if (!adminUserModel) {
    const adminConn = getAdminConnection();
    adminUserModel = adminConn.model('AdminUser', AdminUserSchema, 'users'); // Force collection name to be 'users'
  }
  return adminUserModel;
};

const getCustomerModel = () => {
  if (!customerModel) {
    const customerConn = getCustomerConnection();
    // Check if model already exists
    try {
      customerModel = customerConn.model('customer-details');
    } catch (error) {
      // Model doesn't exist, create it
      const customerSchema = new require('mongoose').Schema({
        username: String,
        email: String,
        password: String,
        phoneNumber: String,
        address: String,
        isActive: { type: Boolean, default: true },
        orders: [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Order' }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        __v: { type: Number, default: 0 }
      });
      customerModel = customerConn.model('customer-details', customerSchema);
    }
  }
  return customerModel;
};

// Get all users (customers, admins, chefs, waiters)
const getAllUsers = async (req, res) => {
  try {
    const AdminUser = getAdminUserModel();
    const Customer = getCustomerModel();

    // Get all admin users (admin, chef, waiter)
    const adminUsers = await AdminUser.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // Get all customers
    const customers = await Customer.find({})
      .sort({ createdAt: -1 });

    // Format the response
    const formattedAdminUsers = adminUsers.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isActive: user.isActive,
      permissions: user.permissions,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userType: 'staff' // To distinguish from customers
    }));

    const formattedCustomers = customers.map(customer => ({
      _id: customer._id,
      username: customer.username,
      email: customer.email,
      fullName: customer.username, // Use username as display name since fullName doesn't exist
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      isActive: customer.isActive,
      role: 'customer',
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userType: 'customer',
      hasPassword: !!customer.password, // Indicate if customer has password
      orderCount: customer.orders ? customer.orders.length : 0
    }));

    const allUsers = [...formattedAdminUsers, ...formattedCustomers];

    res.status(200).json({
      success: true,
      data: {
        users: allUsers,
        totalUsers: allUsers.length,
        staffCount: formattedAdminUsers.length,
        customerCount: formattedCustomers.length,
        adminCount: adminUsers.filter(u => u.role === 'admin').length,
        chefCount: adminUsers.filter(u => u.role === 'chef').length,
        waiterCount: adminUsers.filter(u => u.role === 'waiter').length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (role === 'customer') {
      const Customer = getCustomerModel();
      const customers = await Customer.find({ isActive: true })
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        data: customers.map(customer => ({
          ...customer.toObject(),
          role: 'customer',
          userType: 'customer'
        }))
      });
    }

    const AdminUser = getAdminUserModel();
    const users = await AdminUser.find({ role, isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users.map(user => ({
        ...user.toObject(),
        userType: 'staff'
      }))
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users by role',
      error: error.message
    });
  }
};

// Create new admin user (admin, chef, waiter)
const createAdminUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      role,
      phoneNumber,
      address
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !fullName || !role || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate role
    if (!['admin', 'chef', 'waiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, chef, or waiter'
      });
    }

    const AdminUser = getAdminUserModel();

    // Check if user already exists
    const existingUser = await AdminUser.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const newUser = new AdminUser({
      username,
      email,
      password,
      fullName,
      role,
      phoneNumber,
      address,
      createdBy: req.user ? req.user._id : null
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        isActive: newUser.isActive,
        permissions: newUser.permissions,
        createdAt: newUser.createdAt,
        userType: 'staff'
      }
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query; // 'staff' or 'customer'
    const updateData = req.body;

    // Remove sensitive fields from update
    delete updateData.password;
    delete updateData._id;
    delete updateData.__v;

    if (userType === 'customer') {
      const Customer = getCustomerModel();
      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: {
          ...updatedCustomer.toObject(),
          role: 'customer',
          userType: 'customer'
        }
      });
    }

    const AdminUser = getAdminUserModel();
    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      { 
        ...updateData, 
        updatedBy: req.user ? req.user._id : null 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        ...updatedUser.toObject(),
        userType: 'staff'
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (soft delete - set isActive to false)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;

    if (userType === 'customer') {
      const Customer = getCustomerModel();
      const customer = await Customer.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Customer deactivated successfully'
      });
    }

    const AdminUser = getAdminUserModel();
    const user = await AdminUser.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        updatedBy: req.user ? req.user._id : null 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
      error: error.message
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;

    if (userType === 'customer') {
      const Customer = getCustomerModel();
      const customer = await Customer.findById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      customer.isActive = !customer.isActive;
      customer.updatedAt = new Date();
      await customer.save();

      return res.status(200).json({
        success: true,
        message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          ...customer.toObject(),
          role: 'customer',
          userType: 'customer'
        }
      });
    }

    const AdminUser = getAdminUserModel();
    const user = await AdminUser.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    user.updatedBy = req.user ? req.user._id : null;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        ...user.toObject(),
        userType: 'staff'
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const AdminUser = getAdminUserModel();
    const Customer = getCustomerModel();

    const [adminUsers, customers] = await Promise.all([
      AdminUser.find({}),
      Customer.find({})
    ]);

    const stats = {
      totalUsers: adminUsers.length + customers.length,
      staffCount: adminUsers.length,
      customerCount: customers.length,
      adminCount: adminUsers.filter(u => u.role === 'admin').length,
      chefCount: adminUsers.filter(u => u.role === 'chef').length,
      waiterCount: adminUsers.filter(u => u.role === 'waiter').length,
      activeStaff: adminUsers.filter(u => u.isActive).length,
      activeCustomers: customers.filter(c => c.isActive).length,
      inactiveStaff: adminUsers.filter(u => !u.isActive).length,
      inactiveCustomers: customers.filter(c => !c.isActive).length
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUsersByRole,
  createAdminUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
};
