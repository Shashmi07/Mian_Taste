const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [50, 'Full name cannot exceed 50 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['admin', 'chef', 'waiter'],
      message: 'Role must be admin, chef, or waiter'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[0-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: null
  },
  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageMenu: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canManageReservations: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageInventory: { type: Boolean, default: false }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Set default permissions based on role
AdminUserSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isNew) {
    switch (this.role) {
      case 'admin':
        this.permissions = {
          canManageUsers: true,
          canManageMenu: true,
          canManageOrders: true,
          canManageReservations: true,
          canViewReports: true,
          canManageInventory: true
        };
        break;
      case 'chef':
        this.permissions = {
          canManageUsers: false,
          canManageMenu: true,
          canManageOrders: true,
          canManageReservations: false,
          canViewReports: false,
          canManageInventory: true
        };
        break;
      case 'waiter':
        this.permissions = {
          canManageUsers: false,
          canManageMenu: false,
          canManageOrders: true,
          canManageReservations: true,
          canViewReports: false,
          canManageInventory: false
        };
        break;
    }
  }
  next();
});

// Hash password before saving
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
AdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
AdminUserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to find active users by role
AdminUserSchema.statics.findActiveByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Export only the schema - the model should only be created in admin database
module.exports = {
  schema: AdminUserSchema
};
