const mongoose = require('mongoose');
const Order = require('../models/order');
const QrOrder = require('../models/QrOrder');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chef-dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const migrateOrders = async () => {
  try {
    console.log('🚀 Starting order migration...');
    
    // Get all existing orders from the old Order collection
    const existingOrders = await Order.find({});
    console.log(`📊 Found ${existingOrders.length} existing orders to migrate`);
    
    if (existingOrders.length === 0) {
      console.log('ℹ️ No orders to migrate');
      return;
    }
    
    let migratedCount = 0;
    
    for (const order of existingOrders) {
      try {
        // Create new QR order with existing data
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
        
        const qrOrder = new QrOrder(qrOrderData);
        await qrOrder.save();
        
        migratedCount++;
        console.log(`✅ Migrated order: ${order.orderId} → ${qrOrder.orderId}`);
        
      } catch (error) {
        console.error(`❌ Error migrating order ${order.orderId}:`, error.message);
      }
    }
    
    console.log(`\n📈 Migration Summary:`);
    console.log(`   • Total orders found: ${existingOrders.length}`);
    console.log(`   • Successfully migrated: ${migratedCount}`);
    console.log(`   • Failed migrations: ${existingOrders.length - migratedCount}`);
    
    if (migratedCount === existingOrders.length) {
      console.log('\n🎉 All orders migrated successfully!');
      console.log('⚠️ Please verify the migration and then manually drop the old "orders" collection');
      console.log('⚠️ Command: db.orders.drop()');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

const main = async () => {
  await connectDB();
  await migrateOrders();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
};

// Run migration
main().catch(error => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});