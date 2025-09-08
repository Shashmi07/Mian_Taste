const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ 
      success: false, 
      message: 'Duplicate field value' 
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation Error', 
      errors 
    });
  }

  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
};

module.exports = errorHandler;