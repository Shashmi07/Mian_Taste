const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
    // Remove required: true since it's auto-generated
  },
  table: {
    type: String,
    required: function() {
      return this.orderType === 'dine-in';
    }
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    default: 'dine-in'
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  },
  customerPhone: {
    type: String
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
  customerName: {
    type: String,
    required: true
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
    enum: ['pending', 'accepted', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  cookingStatus: {
    type: String,
    enum: ['not started', 'preparing', 'cooking', 'plating', 'ready'],
    default: 'not started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedTime: {
    type: String,
    default: '30 min'
  },
  orderTime: {
    type: String,
    default: function() {
      return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedChef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);