const mongoose = require('mongoose');

// Create a separate connection for admin database
let adminConnection = null;

const connectAdminDB = async () => {
  try {
    const adminMongoURI = process.env.ADMIN_MONGO_URI || 'mongodb://localhost:27017/Admin-dashboard';
    
    adminConnection = await mongoose.createConnection(adminMongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Admin Database Connected: ${adminConnection.host}/${adminConnection.name}`);
    
    // Create indexes for admin database
    await createAdminIndexes();
    
  } catch (error) {
    console.error('Admin database connection error:', error);
    process.exit(1);
  }
};

const createAdminIndexes = async () => {
  try {
    // Get AdminUser model from admin connection using 'users' collection
    const AdminUserSchema = require('../models/AdminUser').schema;
    const AdminUser = adminConnection.model('AdminUser', AdminUserSchema, 'users');
    
    // Index for email lookup (unique)
    await AdminUser.collection.createIndex({
      email: 1
    }, { unique: true });
    
    // Index for username lookup (unique)
    await AdminUser.collection.createIndex({
      username: 1
    }, { unique: true });
    
    // Index for role-based queries
    await AdminUser.collection.createIndex({
      role: 1,
      isActive: 1
    });
    
    console.log('Admin database indexes created successfully');
  } catch (error) {
    console.error('Error creating admin database indexes:', error);
  }
};

const getAdminConnection = () => {
  if (!adminConnection) {
    throw new Error('Admin database not connected');
  }
  return adminConnection;
};

module.exports = { connectAdminDB, getAdminConnection };
