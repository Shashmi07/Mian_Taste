const mongoose = require('mongoose');

const tableReservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  selectedTables: [{
    type: Number,
    required: true
  }],
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Food order details (optional)
  hasFood: {
    type: Boolean,
    default: false
  },
  foodItems: [{
    name: {
      type: String,
      required: function() { return this.hasFood; }
    },
    quantity: {
      type: Number,
      required: function() { return this.hasFood; }
    },
    price: {
      type: Number,
      required: function() { return this.hasFood; }
    }
  }],
  foodTotal: {
    type: Number,
    default: 0
  },
  tableTotal: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed'],
    default: 'confirmed'
  },
  reservationId: {
    type: String,
    unique: true
    // Remove required: true since it's auto-generated
  }
}, {
  timestamps: true
});

// Generate unique reservation ID before saving
tableReservationSchema.pre('save', function(next) {
  if (this.isNew && !this.reservationId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reservationId = `RES${timestamp}${random}`;
  }
  next();
});

// Export only the schema - the model should only be created in customer database
module.exports = { schema: tableReservationSchema };