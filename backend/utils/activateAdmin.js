const mongoose = require('mongoose');
require('dotenv').config();
const { model: AdminUser } = require('../models/AdminUser');

const activateAdminUser = async () => {
  try {
    // Connect to Admin MongoDB
    await mongoose.connect(process.env.ADMIN_MONGO_URI);
    console.log('Connected to Admin MongoDB');

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