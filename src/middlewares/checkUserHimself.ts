import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.ts";

export const checkUserHimself: RequestHandler = (req, res, next) => {
    const { id } = req.params;

    if(req.user!.id !== id) {
        return next(new ApiError("Not authorized", 403));
    }

    next();
}

