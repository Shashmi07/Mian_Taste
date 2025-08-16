const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI (existing variable name)
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Chef Database Connected: ${conn.connection.host}/${conn.connection.name}`);
    
  } catch (error) {
    console.error('Chef database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;