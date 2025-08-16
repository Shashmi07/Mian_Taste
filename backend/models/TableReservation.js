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
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
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

// Export schema for use with custom connection
module.exports = { schema: tableReservationSchema };

// For direct use (will use default connection if imported directly)
module.exports.model = mongoose.model('TableReservation', tableReservationSchema);