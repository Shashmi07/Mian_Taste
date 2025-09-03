const mongoose = require('mongoose');

const preOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
    // Auto-generated
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String
  },
  deliveryAddress: {
    type: String,
    required: function() {
      return this.orderType === 'delivery';
    }
  },
  table: {
    type: String,
    required: function() {
      return this.orderType === 'dine-in';
    }
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'upi'],
    default: 'card'
  },
  notes: String,
  orderTime: {
    type: String,
    default: function() {
      return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }
}, {
  timestamps: true
});

// Generate order ID before saving
preOrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderId) {
    const count = await mongoose.model('PreOrder').countDocuments();
    this.orderId = `PRE${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('PreOrder', preOrderSchema);