import type { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError.ts"

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(`not found this route: ${req.originalUrl}`, 404));
}

export const errorMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const message = err.message;
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const isOperational = err.isOperational || false;

    res.status(statusCode).json({
        message,
        status,
        isOperational,
        stack: process.env.NODE_ENV === "development"? err.stack : null
    })
}
