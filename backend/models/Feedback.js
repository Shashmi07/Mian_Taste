const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QrOrder',
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  table: {
    type: String,
    required: true
  },
  itemFeedback: [{
    itemIndex: {
      type: Number,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
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
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
feedbackSchema.pre('save', function(next) {
  if (this.itemFeedback && this.itemFeedback.length > 0) {
    const ratingsWithValues = this.itemFeedback.filter(item => item.rating > 0);
    if (ratingsWithValues.length > 0) {
      const totalRating = ratingsWithValues.reduce((sum, item) => sum + item.rating, 0);
      this.averageRating = Math.round((totalRating / ratingsWithValues.length) * 10) / 10;
    }
  }
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);