const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getCategories
} = require('../controllers/menuController');

// Public routes (for customers)
router.get('/test', (req, res) => {
  res.json({ message: 'Menu API is working!', timestamp: new Date() });
});
router.get('/', getAllMenuItems);
router.get('/categories', getCategories);
router.get('/category/:category', getMenuItemsByCategory);
router.get('/:id', getMenuItemById);

// Admin routes (protected - you can add auth middleware later)
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/toggle-availability', toggleAvailability);

module.exports = router;
