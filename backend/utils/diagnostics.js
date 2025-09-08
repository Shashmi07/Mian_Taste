const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== MONGODB DIAGNOSTICS ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('CUSTOMER_MONGO_URI:', process.env.CUSTOMER_MONGO_URI);

const runDiagnostics = async () => {
  try {
    // Test customer database connection directly
    console.log('\n=== TESTING CUSTOMER DATABASE ===');
    const customerConn = await mongoose.createConnection(process.env.CUSTOMER_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await new Promise(resolve => {
      customerConn.once('connected', () => {
        console.log('Customer DB Connected successfully');
        resolve();
      });
    });
    
    // List all collections in customer database
    const customerCollections = await customerConn.db.listCollections().toArray();
    console.log('Customer DB Collections:', customerCollections.map(c => c.name));
    
    // Check for menu items specifically
    console.log('\n=== CHECKING MENU ITEMS ===');
    const menuCount = await customerConn.db.collection('menu-items').countDocuments();
    console.log(`menu-items collection count: ${menuCount}`);
    
    if (menuCount > 0) {
      const sampleItems = await customerConn.db.collection('menu-items').find().limit(3).toArray();
      console.log('Sample items:', sampleItems.map(item => ({ name: item.name, category: item.category })));
    }
    
    // Check all collections for any menu-like data
    console.log('\n=== SEARCHING ALL COLLECTIONS ===');
    for (const collection of customerCollections) {
      const count = await customerConn.db.collection(collection.name).countDocuments();
      if (count > 0) {
        console.log(`${collection.name}: ${count} documents`);
        const sample = await customerConn.db.collection(collection.name).findOne();
        if (sample && sample.name && sample.price) {
          console.log(`  -> Looks like menu data: ${sample.name} - $${sample.price}`);
        }
      }
    }
    
    // Close connection
    await customerConn.close();
    
    console.log('\n=== DIAGNOSTICS COMPLETE ===');
    process.exit(0);
    
  } catch (error) {
    console.error('Diagnostics error:', error);
    process.exit(1);
  }
};

runDiagnostics();
