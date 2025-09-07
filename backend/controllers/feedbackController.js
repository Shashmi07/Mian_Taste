const Feedback = require('../models/Feedback');
const QrOrder = require('../models/QrOrder');
const PreOrder = require('../models/PreOrder');
const { model: TableReservation } = require('../models/TableReservation');
const { validationResult } = require('express-validator');

// Submit feedback for any order type
const submitFeedback = async (req, res) => {
  try {
    const { orderId, orderType, ratings, comment } = req.body;

    // For legacy QR feedback system
    if (req.body.itemFeedback) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const feedback = new Feedback(req.body);
      await feedback.save();

      console.log('✅ Legacy feedback submitted successfully:', {
        orderNumber: feedback.orderNumber,
        averageRating: feedback.averageRating,
        itemCount: feedback.itemFeedback.length
      });

      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        feedback: {
          _id: feedback._id,
          orderNumber: feedback.orderNumber,
          averageRating: feedback.averageRating,
          createdAt: feedback.createdAt
        }
      });
    }

    // New universal feedback system
    if (!orderId || !orderType || !ratings || !ratings.overall) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: orderId, orderType, and overall rating'
      });
    }

    // Verify order exists and get customer info
    let order = null;
    let orderModel = '';
    let customerInfo = {};

    switch (orderType) {
      case 'qr':
        order = await QrOrder.findOne({ orderId: orderId.toUpperCase() });
        orderModel = 'QrOrder';
        if (order) {
          customerInfo = {
            name: order.customerName,
            phone: order.customerPhone
          };
        }
        break;
      
      case 'pre':
        order = await PreOrder.findOne({ orderId: orderId.toUpperCase() });
        orderModel = 'PreOrder';
        if (order) {
          customerInfo = {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone
          };
        }
        break;
      
      case 'reservation':
        order = await TableReservation.findOne({ reservationId: orderId.toUpperCase() });
        orderModel = 'TableReservation';
        if (order) {
          customerInfo = {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone
          };
        }
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid order type'
        });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ orderId: orderId.toUpperCase() });
    if (existingFeedback) {
      return res.status(409).json({
        success: false,
        message: 'Feedback has already been submitted for this order'
      });
    }

    // Create feedback
    const feedback = new Feedback({
      orderId: orderId.toUpperCase(),
      orderType,
      ratings,
      comment: comment || '',
      customerInfo,
      orderRef: order._id,
      orderModel
    });

    await feedback.save();

    console.log('✅ Feedback submitted successfully:', {
      orderId: feedback.orderId,
      orderType: feedback.orderType,
      averageRating: feedback.averageRating
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        orderId: feedback.orderId,
        orderType: feedback.orderType,
        ratings: feedback.ratings,
        comment: feedback.comment,
        averageRating: feedback.averageRating,
        submittedAt: feedback.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Feedback has already been submitted for this order'
      });
    }
    
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

// Get order details for feedback page
const getOrderForFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    let order = null;
    let orderType = '';

    // Try different order types based on orderId format
    if (orderId.toUpperCase().startsWith('PRE')) {
      order = await PreOrder.findOne({ orderId: orderId.toUpperCase() });
      orderType = 'pre';
    } else if (orderId.toUpperCase().startsWith('RES')) {
      order = await TableReservation.findOne({ reservationId: orderId.toUpperCase() });
      orderType = 'reservation';
    } else {
      order = await QrOrder.findOne({ orderId: orderId.toUpperCase() });
      orderType = 'qr';
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your Order ID.'
      });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed orders.'
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ orderId: orderId.toUpperCase() });
    if (existingFeedback) {
      return res.status(200).json({
        success: true,
        message: 'Feedback already submitted',
        order,
        orderType,
        feedbackExists: true,
        feedback: existingFeedback
      });
    }

    res.json({
      success: true,
      order,
      orderType,
      feedbackExists: false
    });

  } catch (error) {
    console.error('Error fetching order for feedback:', error);
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
  getFeedbackStats,
  getOrderForFeedback
};