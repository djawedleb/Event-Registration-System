import mongoose from 'mongoose';
import dotenv from 'dotenv';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/event-registration');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 