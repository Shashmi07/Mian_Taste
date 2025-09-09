const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { schema: AdminUserSchema } = require('../models/AdminUser');

const resetAdminPassword = async () => {
  try {
    // Connect to Admin MongoDB
    const adminConnection = await mongoose.createConnection(process.env.ADMIN_MONGO_URI);
    console.log('Connected to Admin MongoDB');
    
    // Create AdminUser model on correct connection
    const AdminUser = adminConnection.model('AdminUser', AdminUserSchema, 'users');

    // Hash the new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the admin user's password
    const adminUser = await AdminUser.findOneAndUpdate(
      { email: 'jeewananda@gmail.com' },
      { 
        password: hashedPassword,
        isActive: true 
      },
      { new: true }
    );

    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\n✅ Admin password reset successfully!');
    console.log('\n🔐 Updated Admin Login credentials:');
    console.log('Email: jeewananda@gmail.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('Status: Active');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  }
};

resetAdminPassword();