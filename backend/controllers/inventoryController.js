const Inventory = require('../models/Inventory');

const getInventory = async (req, res) => {
  try {
    console.log('=== GET INVENTORY ===');
    const inventory = await Inventory.find().sort({ name: 1 });
    console.log('Found inventory items:', inventory.length);
    
    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const addInventoryItem = async (req, res) => {
  try {
    console.log('=== ADD INVENTORY ITEM ===');
    console.log('Request body:', req.body);
    
    const { name, quantity, unit, minStock = 10 } = req.body;
    
    // Check if item already exists
    const existingItem = await Inventory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already exists'
      });
    }
    
    // Determine status based on quantity
    let status = 'available';
    if (quantity === 0) {
      status = 'out of stock';
    } else if (quantity <= minStock * 0.5) {
      status = 'low';
    }
    
    const newItem = new Inventory({
      name: name.trim(),
      quantity: Number(quantity),
      unit,
      minStock: Number(minStock),
      status
    });
    
    await newItem.save();
    console.log('✅ Item created:', newItem);
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('inventory-updated', newItem);
    }
    
    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error('❌ Error adding inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const updateInventoryQuantity = async (req, res) => {
  try {
    console.log('=== UPDATE INVENTORY QUANTITY ===');
    console.log('Item ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    const { operation, amount, unit } = req.body;
    
    if (!['add', 'reduce'].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Operation must be "add" or "reduce"'
      });
    }
    
    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    // Convert amount to base unit (grams)
    let convertedAmount = Number(amount);
    if (unit === 'kg') {
      convertedAmount = convertedAmount * 1000;
    } else if (unit === 'l') {
      convertedAmount = convertedAmount * 1000; // Convert to ml
    }
    
    // Update quantity based on operation
    const originalQuantity = item.quantity;
    if (operation === 'add') {
      item.quantity += convertedAmount;
    } else if (operation === 'reduce') {
      item.quantity = Math.max(0, item.quantity - convertedAmount);
    }
    
    // Update status based on new quantity
    if (item.quantity === 0) {
      item.status = 'out of stock';
    } else if (item.quantity <= item.minStock * 0.5) {
      item.status = 'low';
    } else {
      item.status = 'available';
    }
    
    await item.save();
    
    console.log('✅ Inventory updated:');
    console.log(`- Item: ${item.name}`);
    console.log(`- Operation: ${operation}`);
    console.log(`- Amount: ${amount} ${unit}`);
    console.log(`- Old quantity: ${originalQuantity}g`);
    console.log(`- New quantity: ${item.quantity}g`);
    console.log(`- Status: ${item.status}`);
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('inventory-updated', item);
    }
    
    res.json({
      success: true,
      message: `Inventory ${operation === 'add' ? 'restocked' : 'used'} successfully`,
      item
    });
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    console.log('=== DELETE INVENTORY ITEM ===');
    console.log('Item ID:', req.params.id);
    
    const { id } = req.params;
    
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    console.log('✅ Item deleted:', deletedItem.name);
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('inventory-item-deleted', { itemId: id, itemName: deletedItem.name });
    }
    
    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  getInventory,
  addInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem
};