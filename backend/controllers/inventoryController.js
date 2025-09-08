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
    
    // Determine status based on quantity (convert to base unit for comparison)
    let quantityInBaseUnit = Number(quantity);
    let minStockInBaseUnit = Number(minStock);
    
    if (unit === 'kg') {
      quantityInBaseUnit = quantityInBaseUnit * 1000;
      minStockInBaseUnit = minStockInBaseUnit * 1000;
    } else if (unit === 'l') {
      quantityInBaseUnit = quantityInBaseUnit * 1000;
      minStockInBaseUnit = minStockInBaseUnit * 1000;
    }
    
    let status = 'available';
    if (quantityInBaseUnit === 0) {
      status = 'out of stock';
    } else if (quantityInBaseUnit <= minStockInBaseUnit * 0.5) {
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
    
    // Convert both current quantity and operation amount to same base unit for calculation
    let currentQuantityInBaseUnit = item.quantity;
    let operationAmountInBaseUnit = Number(amount);
    
    // Convert current item quantity to base unit (grams/ml)
    if (item.unit === 'kg') {
      currentQuantityInBaseUnit = item.quantity * 1000;
    } else if (item.unit === 'l') {
      currentQuantityInBaseUnit = item.quantity * 1000;
    }
    
    // Convert operation amount to base unit (grams/ml)  
    if (unit === 'kg') {
      operationAmountInBaseUnit = operationAmountInBaseUnit * 1000;
    } else if (unit === 'l') {
      operationAmountInBaseUnit = operationAmountInBaseUnit * 1000;
    }
    
    // Update quantity based on operation
    const originalQuantityInBaseUnit = currentQuantityInBaseUnit;
    let newQuantityInBaseUnit;
    
    if (operation === 'add') {
      newQuantityInBaseUnit = currentQuantityInBaseUnit + operationAmountInBaseUnit;
    } else if (operation === 'reduce') {
      newQuantityInBaseUnit = Math.max(0, currentQuantityInBaseUnit - operationAmountInBaseUnit);
    }
    
    // Convert back to item's original unit for storage
    if (item.unit === 'kg') {
      item.quantity = newQuantityInBaseUnit / 1000;
    } else if (item.unit === 'l') {
      item.quantity = newQuantityInBaseUnit / 1000;
    } else {
      item.quantity = newQuantityInBaseUnit;
    }
    
    // Update status based on new quantity (convert to base unit for comparison)
    let finalQuantityInBaseUnit = item.quantity;
    if (item.unit === 'kg') {
      finalQuantityInBaseUnit = item.quantity * 1000;
    } else if (item.unit === 'l') {
      finalQuantityInBaseUnit = item.quantity * 1000;
    }
    
    // Convert minStock to base unit for comparison
    let minStockInBaseUnit = item.minStock;
    if (item.unit === 'kg') {
      minStockInBaseUnit = item.minStock * 1000;
    } else if (item.unit === 'l') {
      minStockInBaseUnit = item.minStock * 1000;
    }
    
    if (finalQuantityInBaseUnit === 0) {
      item.status = 'out of stock';
    } else if (finalQuantityInBaseUnit <= minStockInBaseUnit * 0.5) {
      item.status = 'low';
    } else {
      item.status = 'available';
    }
    
    await item.save();
    
    console.log('✅ Inventory updated:');
    console.log(`- Item: ${item.name}`);
    console.log(`- Operation: ${operation}`);
    console.log(`- Amount: ${amount} ${unit}`);
    console.log(`- Original quantity: ${item.unit === 'kg' ? (originalQuantityInBaseUnit/1000) : originalQuantityInBaseUnit}${item.unit}`);
    console.log(`- New quantity: ${item.quantity}${item.unit}`);
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