const mongoose = require('mongoose');
const getMenuItemModel = require('../models/MenuItem');
const { connectCustomerDB } = require('../config/customerDatabase');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('CUSTOMER_MONGO_URI:', process.env.CUSTOMER_MONGO_URI);
    
    await connectCustomerDB();
    console.log('Connected to customer database');
    
    // Wait a bit for connection to establish
    setTimeout(async () => {
      try {
        const MenuItem = getMenuItemModel();
        
        // Count items in database
        const count = await MenuItem.countDocuments();
        console.log(`Found ${count} menu items in database`);
        
        // Get a few items to verify
        const items = await MenuItem.find().limit(3);
        console.log('Sample items:');
        items.forEach(item => {
          console.log(`- ${item.name} (${item.category}): $${item.price}`);
        });
        
        process.exit(0);
      } catch (error) {
        console.error('Error querying database:', error);
        process.exit(1);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Run the test
testConnection();
