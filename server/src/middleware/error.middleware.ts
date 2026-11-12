import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("Application error:", err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });

        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
};
