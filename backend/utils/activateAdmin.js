const mongoose = require('mongoose');
require('dotenv').config();
const { schema: AdminUserSchema } = require('../models/AdminUser');

const activateAdminUser = async () => {
  try {
    // Connect to Admin MongoDB
    const adminConnection = await mongoose.createConnection(process.env.ADMIN_MONGO_URI);
    console.log('Connected to Admin MongoDB');
    
    // Create AdminUser model on correct connection
    const AdminUser = adminConnection.model('AdminUser', AdminUserSchema, 'users');

    // Find and activate the admin user
    const adminUser = await AdminUser.findOneAndUpdate(
      { email: 'jeewananda@gmail.com' },
      { isActive: true },
      { new: true }
    );

    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\n✅ Admin user activated successfully!');
    console.log('\n🔐 Admin Login credentials:');
    console.log('Email: jeewananda@gmail.com');
    console.log('Password: [Your original password]');
    console.log('Role: admin');
    console.log('Status: Active');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error activating admin user:', error);
    process.exit(1);
  }
};

activateAdminUser();