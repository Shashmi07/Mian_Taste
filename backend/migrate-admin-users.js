const { connectAdminDB, getAdminConnection } = require('./config/adminDatabase');
require('dotenv').config();

async function migrateAdminUsers() {
  try {
    await connectAdminDB();
    const adminConn = getAdminConnection();
    
    console.log('Connected to admin database');
    console.log('Database name:', adminConn.db.databaseName);
    
    // Get data from adminusers collection
    const adminusersCollection = adminConn.db.collection('adminusers');
    const existingUsers = await adminusersCollection.find({}).toArray();
    
    console.log(`Found ${existingUsers.length} users in 'adminusers' collection`);
    
    if (existingUsers.length > 0) {
      // Insert data into users collection
      const usersCollection = adminConn.db.collection('users');
      
      // Check if users collection already has data
      const existingInUsers = await usersCollection.countDocuments();
      console.log(`Current documents in 'users' collection: ${existingInUsers}`);
      
      if (existingInUsers === 0) {
        // Insert all admin users into users collection
        const result = await usersCollection.insertMany(existingUsers);
        console.log(`Successfully migrated ${result.insertedCount} users to 'users' collection`);
        
        // Verify the migration
        const newCount = await usersCollection.countDocuments();
        console.log(`Total documents now in 'users' collection: ${newCount}`);
        
        // Drop the old adminusers collection
        await adminusersCollection.drop();
        console.log('Successfully dropped the old "adminusers" collection');
      } else {
        console.log('Users collection already has data. Skipping migration to avoid duplicates.');
      }
    } else {
      console.log('No users found in adminusers collection to migrate');
    }
    
    // List all collections after migration
    const collections = await adminConn.db.listCollections().toArray();
    console.log('\nCollections in admin database after migration:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateAdminUsers();
