import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({
    path: './.env',
});

const mb = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        // console.log("Connecting to MongoDB with URI: ", mb);
        const connectionInstance = await mongoose.connect(mb);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;
