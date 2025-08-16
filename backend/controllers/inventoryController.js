const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({}).sort({ name: 1 });
    
    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create inventory item
const createInventoryItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const item = new Inventory(req.body);
    await item.save();
    
    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      item
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update inventory quantity (add/reduce)
const updateInventoryQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { operation, amount, unit } = req.body;

    if (!operation || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation or amount'
      });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    // Convert amount to grams
    let amountInGrams = amount;
    if (unit === 'kg') {
      amountInGrams = amount * 1000;
    }

    if (operation === 'add') {
      item.quantity += amountInGrams;
    } else if (operation === 'reduce') {
      item.quantity = Math.max(0, item.quantity - amountInGrams);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add" or "reduce"'
      });
    }

    await item.save(); // This will trigger the pre-save middleware to update status

    // Emit socket event for real-time updates
    req.io.emit('inventory-updated', item);

    res.json({
      success: true,
      message: `Inventory ${operation === 'add' ? 'increased' : 'decreased'} successfully`,
      item
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getInventory,
  createInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem
};