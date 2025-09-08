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
    console.log('MongoDB connected for migration');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const migrateQrOrders = async () => {
  try {
    console.log('Starting QR order migration...');
    
    // Find all QR orders in the orders collection
    const qrOrdersInOrderCollection = await Order.find({ orderType: 'qr-order' });
    console.log(`Found ${qrOrdersInOrderCollection.length} QR orders to migrate`);
    
    if (qrOrdersInOrderCollection.length === 0) {
      console.log('No QR orders found to migrate');
      return;
    }
    
    // Migrate each QR order
    const migratedOrders = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const order of qrOrdersInOrderCollection) {
      try {
        // Create new QR order document
        const qrOrderData = {
          table: order.table,
          customerName: order.customerName,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          cookingStatus: order.cookingStatus,
          priority: order.priority,
          estimatedTime: order.estimatedTime,
          orderTime: order.orderTime,
          notes: order.notes,
          createdBy: order.createdBy,
          assignedChef: order.assignedChef,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        };
        
        // Create the QR order (orderId will be auto-generated)
        const newQrOrder = new QrOrder(qrOrderData);
        await newQrOrder.save();
        
        migratedOrders.push({
          oldId: order._id,
          oldOrderId: order.orderId,
          newId: newQrOrder._id,
          newOrderId: newQrOrder.orderId,
          table: order.table
        });
        
        successCount++;
        console.log(`✅ Migrated order ${order.orderId} -> ${newQrOrder.orderId} (Table: ${order.table})`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating order ${order.orderId}:`, error.message);
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Total QR orders found: ${qrOrdersInOrderCollection.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\n=== Migrated Orders ===');
      migratedOrders.forEach(order => {
        console.log(`${order.oldOrderId} -> ${order.newOrderId} (Table: ${order.table})`);
      });
      
      // Ask for confirmation before deleting original records
      console.log('\n⚠️  IMPORTANT: Migration completed successfully!');
      console.log('To complete the migration, run the cleanup script to remove QR orders from the orders collection.');
      console.log('Command: node scripts/cleanupMigratedOrders.js');
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  }
};

const main = async () => {
  await connectDB();
  await migrateQrOrders();
  await mongoose.connection.close();
  console.log('Migration process completed');
};

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { migrateQrOrders };