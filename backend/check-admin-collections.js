const { connectAdminDB, getAdminConnection } = require('./config/adminDatabase');
const AdminUserSchema = require('./models/AdminUser').schema;
require('dotenv').config();

async function checkAdminCollections() {
  try {
    await connectAdminDB();
    const adminConn = getAdminConnection();
    
    console.log('Connected to admin database');
    console.log('Database name:', adminConn.db.databaseName);
    
    // List all collections
    const collections = await adminConn.db.listCollections().toArray();
    console.log('\nAll collections in admin database:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
    // Check AdminUser collection specifically
    const AdminUser = adminConn.model('AdminUser', AdminUserSchema);
    const adminUsers = await AdminUser.find({}).select('-password');
    
    console.log(`\nFound ${adminUsers.length} admin users in 'AdminUser' model:`);
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.role}) - ${user.email} - Active: ${user.isActive}`);
    });
    
    // Also check if there's anything in a 'users' collection
    try {
      const usersCollection = adminConn.db.collection('users');
      const usersCount = await usersCollection.countDocuments();
      console.log(`\nDocuments in 'users' collection: ${usersCount}`);
      
      if (usersCount > 0) {
        const usersData = await usersCollection.find({}).limit(5).toArray();
        console.log('Sample users data:', usersData);
      }
    } catch (error) {
      console.log('\nNo users collection found or error accessing it');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdminCollections();
