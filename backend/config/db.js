const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(connStr);
    
    // Log success without exposing full URI credentials
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Redact password from error message if it appears
    let cleanMessage = error.message;
    if (cleanMessage && cleanMessage.includes('@')) {
      cleanMessage = cleanMessage.replace(/:([^:@]+)@/, ':****@');
    }
    console.error(`Database connection failed: ${cleanMessage}`);
    process.exit(1);
  }
};

module.exports = connectDB;
