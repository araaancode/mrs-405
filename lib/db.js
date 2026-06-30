import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection error:", error);
    }
};

export default connectDB;
