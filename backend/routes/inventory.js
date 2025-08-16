const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple mock inventory to prevent crashes
router.get('/', auth, async (req, res) => {
  try {
    console.log('Getting inventory...');
    
    // Mock data for now
    res.json({
      success: true,
      inventory: [
        { _id: '1', name: 'Rice', quantity: 5000, unit: 'g', status: 'available' },
        { _id: '2', name: 'Chicken', quantity: 500, unit: 'g', status: 'low' },
        { _id: '3', name: 'Vegetables', quantity: 2500, unit: 'g', status: 'available' }
      ]
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id/quantity', auth, async (req, res) => {
  try {
    console.log('Mock inventory update:', req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;