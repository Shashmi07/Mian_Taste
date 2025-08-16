const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['g', 'kg'],
    default: 'g'
  },
  minStock: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'low', 'out of stock'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Update status based on quantity before saving
inventorySchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.status = 'out of stock';
  } else if (this.quantity <= this.minStock * 0.5) {
    this.status = 'low';
  } else {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);