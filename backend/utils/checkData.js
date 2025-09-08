require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.CUSTOMER_MONGO_URI;
const client = new MongoClient(uri);

async function checkData() {
  try {
    await client.connect();
    const db = client.db('customer-dashboard');
    const collection = db.collection('menu-items');
    
    console.log('=== CATEGORY BREAKDOWN ===');
    const categories = ['Ramen', 'Rice', 'Soup', 'Drinks', 'More'];
    
    for (const category of categories) {
      const count = await collection.countDocuments({ category: category });
      console.log(`${category}: ${count} items`);
    }
    
    const total = await collection.countDocuments({});
    console.log(`Total: ${total} items`);
    
    console.log('\n=== SAMPLE PRICES ===');
    const sampleItems = await collection.find({}).limit(3).toArray();
    sampleItems.forEach(item => {
      console.log(`${item.name}: ${item.price}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkData();
