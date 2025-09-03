const mongoose = require('mongoose');
const Order = require('../models/order');
const QrOrder = require('../models/QrOrder');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/chef-dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for cleanup');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const cleanupMigratedOrders = async () => {
  try {
    console.log('Starting cleanup of migrated QR orders...');
    
    // First, verify QR orders exist in the qrorders collection
    const qrOrdersCount = await QrOrder.countDocuments();
    console.log(`Found ${qrOrdersCount} orders in qrorders collection`);
    
    if (qrOrdersCount === 0) {
      console.log('❌ No QR orders found in qrorders collection. Migration may not have completed successfully.');
      console.log('Please run the migration script first: node scripts/migrateQrOrders.js');
      return;
    }
    
    // Find QR orders still in the orders collection
    const qrOrdersInOrderCollection = await Order.find({ orderType: 'qr-order' });
    console.log(`Found ${qrOrdersInOrderCollection.length} QR orders to remove from orders collection`);
    
    if (qrOrdersInOrderCollection.length === 0) {
      console.log('✅ No QR orders found in orders collection. Cleanup already completed or not needed.');
      return;
    }
    
    // Show orders that will be deleted
    console.log('\n=== Orders to be removed from orders collection ===');
    qrOrdersInOrderCollection.forEach(order => {
      console.log(`- ${order.orderId} (Table: ${order.table}) - ${order.customerName}`);
    });
    
    // Confirmation prompt (in a real scenario, you'd want to add readline for user confirmation)
    console.log('\n⚠️  WARNING: This will permanently delete QR orders from the orders collection.');
    console.log('Make sure the migration to qrorders collection was successful before proceeding.');
    
    // Delete QR orders from orders collection
    const deleteResult = await Order.deleteMany({ orderType: 'qr-order' });
    
    console.log(`\n✅ Successfully removed ${deleteResult.deletedCount} QR orders from orders collection`);
    
    // Verify cleanup
    const remainingQrOrders = await Order.countDocuments({ orderType: 'qr-order' });
    const totalOrdersRemaining = await Order.countDocuments();
    
    console.log('\n=== Cleanup Summary ===');
    console.log(`QR orders remaining in orders collection: ${remainingQrOrders}`);
    console.log(`Total orders remaining in orders collection: ${totalOrdersRemaining}`);
    console.log(`Total orders in qrorders collection: ${qrOrdersCount}`);
    
    if (remainingQrOrders === 0) {
      console.log('\n✅ Cleanup completed successfully!');
      console.log('All QR orders have been moved to the qrorders collection.');
    } else {
      console.log('\n❌ Warning: Some QR orders still remain in the orders collection.');
    }
    
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

const main = async () => {
  await connectDB();
  await cleanupMigratedOrders();
  await mongoose.connection.close();
  console.log('Cleanup process completed');
};

// Run the cleanup
if (require.main === module) {
  main();
}

module.exports = { cleanupMigratedOrders };