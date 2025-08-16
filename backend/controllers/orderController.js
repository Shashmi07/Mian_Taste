const Order = require('../models/order');
const { validationResult } = require('express-validator');

// Get all orders with filtering
const getOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name')
      .populate('assignedChef', 'name');
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const order = new Order({
      ...req.body,
      createdBy: req.user.id
    });

    await order.save();
    
    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('createdBy', 'name');

    // Emit socket event for real-time updates
    req.io.emit('new-order', populatedOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cookingStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (cookingStatus) updateData.cookingStatus = cookingStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name')
    .populate('assignedChef', 'name');

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event
    req.io.emit('order-updated', updatedOrder);

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Accept order
const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: 'accepted',
        assignedChef: req.user.id
      },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name')
    .populate('assignedChef', 'name');

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event
    req.io.emit('order-accepted', updatedOrder);

    res.json({
      success: true,
      message: 'Order accepted successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event
    req.io.emit('order-deleted', { orderId: req.params.id });

    res.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  acceptOrder,
  deleteOrder
};