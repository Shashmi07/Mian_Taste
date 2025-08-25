const express = require('express');
const { 
  getInventoryForAdmin, 
  getInventoryAlerts,
  getInventoryStats
} = require('../controllers/adminInventoryController');

const router = express.Router();

// Admin inventory routes (read-only)
// GET /api/admin-inventory - Get all inventory items with insights
router.get('/', getInventoryForAdmin);

// GET /api/admin-inventory/alerts - Get low stock and out of stock alerts
router.get('/alerts', getInventoryAlerts);

// GET /api/admin-inventory/stats - Get inventory statistics
router.get('/stats', getInventoryStats);

module.exports = router;