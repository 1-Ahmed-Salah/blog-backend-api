import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.ts";

export const checkAdminOrUserHimself: RequestHandler = (req, res, next) => {
    if(!req.user?.isAdmin &&!( req.user?.id === req.params.id)) {
        return next(new ApiError("Not authorized", 403));
    }

    next();
}
