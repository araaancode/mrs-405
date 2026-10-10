// scripts/migrate-documents.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const userSchema = new mongoose.Schema(
    {
        documents: [mongoose.Schema.Types.Mixed],
        avatar: String,
        full_name: String,
        email: String,
    },
    { strict: false, timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function connectDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        console.error("MONGODB_URI in .env.local not found.");
        process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected");
}

async function migrate() {
    await connectDB();

    const users = await User.find({
        "documents.0": { $type: "string" },
    }).lean();

    console.log(`Found ${users.length} users to migrate`);

    if (users.length === 0) {
        console.log("Nothing to migrate.");
        await mongoose.disconnect();
        process.exit(0);
    }

    let migratedCount = 0;

    for (const user of users) {
        const oldDocs = user.documents || [];

        const newDocs = oldDocs
            .filter((d) => typeof d === "string" && d.trim())
            .map((url) => {
                const filename = url.split("/").pop() || "unknown";
                const ext = (filename.split(".").pop() || "").toLowerCase();

                let type = "application/octet-stream";
                if (["jpg", "jpeg"].includes(ext)) type = "image/jpeg";
                else if (ext === "png") type = "image/png";
                else if (ext === "webp") type = "image/webp";
                else if (ext === "gif") type = "image/gif";
                else if (ext === "pdf") type = "application/pdf";
                else if (["doc", "docx"].includes(ext))
                    type =
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                return {
                    url,
                    name: filename,
                    size: 0,
                    type,
                    uploaded_at: new Date(),
                };
            });

        await User.collection.updateOne(
            { _id: user._id },
            { $set: { documents: newDocs } }
        );

        migratedCount++;
        console.log(`  OK ${user.email || user.full_name || user._id} -> ${newDocs.length} docs`);
    }

    console.log(`\nMigration complete: ${migratedCount} users updated`);
    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch((err) => {
    console.error("Migration error:", err);
    mongoose.disconnect().finally(() => process.exit(1));
});
