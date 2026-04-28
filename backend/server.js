import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";
import dns from 'node:dns';

dotenv.config();
dns.setServers(["1.1.1.1","8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in backend/.env");
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    if (
      error.message.includes("querySrv") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error(
        "Atlas SRV DNS lookup failed. Your current DNS/network is not resolving the mongodb+srv address."
      );
      console.error(
        "Use a standard mongodb:// connection string from MongoDB Atlas, or switch your DNS to a public resolver like 8.8.8.8 / 1.1.1.1."
      );
    }

    process.exit(1);
  }
};

startServer();
