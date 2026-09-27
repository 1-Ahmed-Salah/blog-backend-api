import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.ts";

export const checkAdmin: RequestHandler = (req, res, next) => {
    if(req.user && !req.user.isAdmin) {
        return next(new ApiError("Not authorized", 403))
    }

    next();
}

