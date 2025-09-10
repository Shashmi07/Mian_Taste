const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  // Universal order identifier (PRE001, RES123456, QR001, etc.)
  orderId: {
    type: String,
    required: true,
    index: true
  },
  orderType: {
    type: String,
    enum: ['qr', 'pre', 'reservation'],
    required: true
  },
  // Ratings for different aspects
  ratings: {
    service: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  // Individual food item ratings
  itemRatings: {
    type: Map,
    of: {
      type: Number,
      min: 1,
      max: 5
    },
    default: new Map()
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true,
    default: ''
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  // Legacy fields for backward compatibility with QR orders
  orderNumber: {
    type: String
  },
  table: {
    type: String
  },
  itemFeedback: [{
    itemIndex: {
      type: Number
    },
    itemName: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  overallComment: {
    type: String,
    default: ''
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Reference to the original order (optional)
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'orderModel'
  },
  orderModel: {
    type: String,
    enum: ['QrOrder', 'PreOrder', 'TableReservation']
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
feedbackSchema.pre('save', function(next) {
  // For new rating system with individual item ratings
  if (this.itemRatings && this.itemRatings.size > 0) {
    const validRatings = [];
    
    // Add all individual food item ratings
    for (const rating of this.itemRatings.values()) {
      if (rating > 0) validRatings.push(rating);
    }
    
    // Add service rating
    if (this.ratings && this.ratings.service > 0) {
      validRatings.push(this.ratings.service);
    }
    
    if (validRatings.length > 0) {
      const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
      this.averageRating = Math.round((sum / validRatings.length) * 10) / 10;
    } else {
      this.averageRating = 0;
    }
  }
  
  // Legacy calculation for backward compatibility
  else if (this.itemFeedback && this.itemFeedback.length > 0) {
    const ratingsWithValues = this.itemFeedback.filter(item => item.rating > 0);
    if (ratingsWithValues.length > 0) {
      const totalRating = ratingsWithValues.reduce((sum, item) => sum + item.rating, 0);
      this.averageRating = Math.round((totalRating / ratingsWithValues.length) * 10) / 10;
    }
  }
  
  next();
});

// Compound index for efficient queries
feedbackSchema.index({ orderId: 1, orderType: 1 });

// Ensure only one feedback per order (but allow multiple for legacy system)
feedbackSchema.index({ orderId: 1 }, { 
  unique: true, 
  partialFilterExpression: { orderType: { $exists: true } } 
});

// Export schema for use with custom connection
module.exports = { schema: feedbackSchema };

// For direct use (will use default connection if imported directly)
module.exports.model = mongoose.model('Feedback', feedbackSchema);