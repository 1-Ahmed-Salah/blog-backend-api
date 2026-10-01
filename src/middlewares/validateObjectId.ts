import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { ApiError } from "../utils/apiError.ts";

export const validateObjectId: RequestHandler = (req, res, next) => {

    const { id } = req.params;

    if(!Types.ObjectId.isValid(id)) {
        return next(new ApiError("ID is not valid", 400))
    }

    next();
}
