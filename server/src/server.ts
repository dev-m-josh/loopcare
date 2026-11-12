import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { db, pool } from "./db/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./utils/app-error.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", async (req, res) => {
    try {
        await db.execute(sql`SELECT 1`);

        res.status(200).json({
            success: true,
            message: "LoopCare API is running!",
            database: "connected",
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(503).json({
            success: false,
            message: "LoopCare API is running, but the database is unavailable.",
            database: "disconnected",
        });
    }
});
// Handle unknown routes
app.use((req, res, next) => {
    next(
        new AppError(
            `Route ${req.method} ${req.originalUrl} not found.`,
            404
        )
    );
});
// Centralized error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`LoopCare API running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down LoopCare API...`);

    server.close(async () => {
        try {
            await pool.end();
            console.log("Database connections closed.");
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
