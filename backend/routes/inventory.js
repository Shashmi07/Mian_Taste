const express = require('express');
const auth = require('../middleware/auth');
const { 
  getInventory, 
  addInventoryItem, 
  updateInventoryQuantity, 
  deleteInventoryItem 
} = require('../controllers/inventoryController');

const router = express.Router();

// Get all inventory items
router.get('/', auth, getInventory);

// Add new inventory item  
router.post('/', auth, addInventoryItem);

// Update inventory quantity
router.put('/:id/quantity', auth, updateInventoryQuantity);

// Delete inventory item
router.delete('/:id', auth, deleteInventoryItem);

module.exports = router;