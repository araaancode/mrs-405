import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    if (globalThis.mongoose?.connections?.[0]?.readyState) return;

    const mongoose = (await import("mongoose")).default;
    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection error:", error);
    }
};

export default connectDB;