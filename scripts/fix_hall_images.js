// scripts/fix_hall_images.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Hall from "../models/Hall.js";

dotenv.config();

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/mrsapp";

async function fixHallImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const halls = await Hall.find({}).select("_id title images");
        console.log(`📦 Found ${halls.length} halls`);

        let updatedCount = 0;
        let totalFixed = 0;

        for (const hall of halls) {
            let needsUpdate = false;
            const newImages = (hall.images || []).map((img) => {
                if (typeof img === "string" && img.startsWith("./")) {
                    needsUpdate = true;
                    totalFixed++;
                    return "/" + img.slice(2); // "./x" → "/x"
                }
                return img;
            });

            if (needsUpdate) {
                await Hall.updateOne(
                    { _id: hall._id },
                    { $set: { images: newImages } }
                );
                updatedCount++;
            }
        }

        console.log(`\n✅ Done!`);
        console.log(`   Updated halls: ${updatedCount}`);
        console.log(`   Fixed image paths: ${totalFixed}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

fixHallImages();