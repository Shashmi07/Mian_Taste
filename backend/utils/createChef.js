const mongoose = require('mongoose');
require('dotenv').config();
const { schema: AdminUserSchema } = require('../models/AdminUser');

const createChefUser = async () => {
  try {
    // Connect to Admin MongoDB
    const adminConnection = await mongoose.createConnection(process.env.ADMIN_MONGO_URI);
    console.log('Connected to Admin MongoDB');
    
    // Create AdminUser model on correct connection
    const AdminUser = adminConnection.model('AdminUser', AdminUserSchema, 'users');

    // Delete existing chef user if exists
    await AdminUser.deleteOne({ email: 'chef@restaurant.com' });
    
    // Create new chef user
    const chefUser = new AdminUser({
      username: 'chef_maria',
      email: 'chef@restaurant.com',
      password: 'chef123', // This will be hashed automatically
      fullName: 'Maria Rodriguez',
      role: 'chef',
      phoneNumber: '+1234567890',
      address: '123 Restaurant Street',
      isActive: true
    });

    await chefUser.save();
    console.log('\n✅ Chef user created successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('Email: chef@restaurant.com');
    console.log('Password: chef123');
    console.log('Role: chef');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating chef user:', error);
    process.exit(1);
  }
};

createChefUser();