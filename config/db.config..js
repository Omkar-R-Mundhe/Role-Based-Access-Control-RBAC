import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const DB_URI = process.env.MONGO_URI;
        await mongoose.connect(DB_URI);
        
        console.log("Connected to database")
    } catch (error) {
        console.error('Error connecting to the database:',error.message);
    }
}

export default connectDB