const Feedback = require('../models/Feedback');
const { validationResult } = require('express-validator');

// Submit feedback for an order
const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const feedback = new Feedback(req.body);
    await feedback.save();

    console.log('✅ Feedback submitted successfully:', {
      orderNumber: feedback.orderNumber,
      averageRating: feedback.averageRating,
      itemCount: feedback.itemFeedback.length
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        _id: feedback._id,
        orderNumber: feedback.orderNumber,
        averageRating: feedback.averageRating,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all feedback (for admin dashboard)
const getAllFeedback = async (req, res) => {
  try {
    const { limit = 50, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const feedback = await Feedback.find()
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .populate('orderId', 'orderId table createdAt');
    
    res.json({
      success: true,
      feedback,
      count: feedback.length
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get feedback by order ID
const getFeedbackByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const feedback = await Feedback.findOne({ orderId })
      .populate('orderId', 'orderId table createdAt');
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this order'
      });
    }

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    
    const averageRatingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$averageRating' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = await Feedback.aggregate([
      { $unwind: '$itemFeedback' },
      {
        $group: {
          _id: '$itemFeedback.rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalFeedback,
      averageRating: averageRatingResult.length > 0 ? Math.round(averageRatingResult[0].avgRating * 10) / 10 : 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item._id,
        count: item.count
      }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackByOrder,
  getFeedbackStats
};