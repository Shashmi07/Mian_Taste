const mongoose = require('mongoose');

// Create a separate connection for customer database
let customerConnection = null;

const connectCustomerDB = async () => {
  try {
    const customerMongoURI = process.env.CUSTOMER_MONGO_URI || 'mongodb://localhost:27017/customer-dashboard';
    
    customerConnection = await mongoose.createConnection(customerMongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Customer Database Connected: ${customerConnection.host}/${customerConnection.name}`);
    
    // Create indexes for customer database
    await createCustomerIndexes();
    
  } catch (error) {
    console.error('Customer database connection error:', error);
    process.exit(1);
  }
};

const createCustomerIndexes = async () => {
  try {
    // Get TableReservation model from customer connection
    const TableReservationSchema = require('../models/TableReservation').schema;
    const TableReservation = customerConnection.model('TableReservation', TableReservationSchema);
    
    // Index for checking availability (frequently queried together)
    await TableReservation.collection.createIndex({
      reservationDate: 1,
      timeSlot: 1,
      status: 1
    });
    
    // Index for reservation lookup
    await TableReservation.collection.createIndex({
      reservationId: 1
    }, { unique: true });
    
    // Index for customer email lookup
    await TableReservation.collection.createIndex({
      customerEmail: 1
    });
    
    console.log('Customer database indexes created successfully');
  } catch (error) {
    console.error('Error creating customer database indexes:', error);
  }
};

const getCustomerConnection = () => {
  if (!customerConnection) {
    throw new Error('Customer database not connected');
  }
  return customerConnection;
};

module.exports = { connectCustomerDB, getCustomerConnection };