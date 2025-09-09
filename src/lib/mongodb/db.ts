import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;

  if (!MONGO_URL) {
    throw new Error("Please define the MONGO_URL environment variable");
  }

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  
  try {
    const db = await mongoose.connect(MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected:", db.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
