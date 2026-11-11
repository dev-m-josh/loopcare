import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LoopCare API is running!",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LoopCare API running on port ${PORT}`);
});
