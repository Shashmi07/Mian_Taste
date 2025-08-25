const Inventory = require('../models/Inventory');

// Get all inventory items for admin view (read-only)
const getInventoryForAdmin = async (req, res) => {
  try {
    console.log('=== GET INVENTORY FOR ADMIN ===');
    
    // Fetch all inventory items sorted by name
    const inventory = await Inventory.find().sort({ name: 1 });
    console.log('Found inventory items:', inventory.length);
    
    // Calculate inventory insights
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.status === 'low');
    const outOfStockItems = inventory.filter(item => item.status === 'out of stock');
    
    console.log('Inventory insights:');
    console.log(`- Total items: ${totalItems}`);
    console.log(`- Low stock items: ${lowStockItems.length}`);
    console.log(`- Out of stock items: ${outOfStockItems.length}`);
    
    res.json({
      success: true,
      data: {
        inventory,
        insights: {
          totalItems,
          lowStockCount: lowStockItems.length,
          outOfStockCount: outOfStockItems.length,
          lowStockItems,
          outOfStockItems
        }
      }
    });
  } catch (error) {
    console.error('Error fetching inventory for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

// Get low stock and out of stock alerts
const getInventoryAlerts = async (req, res) => {
  try {
    console.log('=== GET INVENTORY ALERTS ===');
    
    const lowStockItems = await Inventory.find({ status: 'low' }).sort({ name: 1 });
    const outOfStockItems = await Inventory.find({ status: 'out of stock' }).sort({ name: 1 });
    
    console.log(`Found ${lowStockItems.length} low stock items and ${outOfStockItems.length} out of stock items`);
    
    res.json({
      success: true,
      data: {
        lowStockItems,
        outOfStockItems,
        totalAlerts: lowStockItems.length + outOfStockItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory alerts',
      error: error.message
    });
  }
};

// Get inventory statistics
const getInventoryStats = async (req, res) => {
  try {
    console.log('=== GET INVENTORY STATISTICS ===');
    
    const totalItems = await Inventory.countDocuments();
    const availableItems = await Inventory.countDocuments({ status: 'available' });
    const lowStockItems = await Inventory.countDocuments({ status: 'low' });
    const outOfStockItems = await Inventory.countDocuments({ status: 'out of stock' });
    
    const stats = {
      totalItems,
      availableItems,
      lowStockItems,
      outOfStockItems,
      stockHealth: totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0
    };
    
    console.log('Inventory statistics:', stats);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching inventory statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory statistics',
      error: error.message
    });
  }
};

module.exports = {
  getInventoryForAdmin,
  getInventoryAlerts,
  getInventoryStats
};