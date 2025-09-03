const mongoose = require('mongoose');
const Order = require('../models/order');

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chef-dashboard');
    console.log('✅ Connected to chef-dashboard database');
    
    const orders = await Order.find({});
    console.log(`📊 Found ${orders.length} existing orders:`);
    console.log('');
    
    if (orders.length === 0) {
      console.log('ℹ️ No orders found in the collection');
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.orderId || 'No ID'}`);
        console.log(`   Customer: ${order.customerName}`);
        console.log(`   Table: ${order.table}`);
        console.log(`   Items: ${order.items.length} items`);
        console.log(`   Total: $${order.totalAmount}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('   ---');
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkOrders();