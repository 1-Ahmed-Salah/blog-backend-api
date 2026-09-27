import type { RequestHandler } from "express";
import type { ObjectSchema } from "joi";
import { ApiError } from "../utils/apiError.ts";

export const validateRequest = <T>(schema: ObjectSchema<T>): RequestHandler => 
    (req, res, next) => {
        const { error } = schema.required().validate(req.body, { abortEarly: true });

        console.log(req.body)
        console.log(error);

        if(error) {
            return next(new ApiError(error.message, 400));
        }

        next();
} 

