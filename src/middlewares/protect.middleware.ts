import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import User from "../models/user.model.ts";

export const protect = asyncHandler(async(req, res, next)=> {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(" ")[1];
        try {
            
            const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

            const user = await User.findById(userId).select('-password');
            if(!user) {
                return next(new ApiError("User not found", 404));
            }

            req.user = user;

            next();

        } catch (error) {
            return next(new ApiError("Not authorized, invalid token", 401));
        }

    } else {
        return next(new ApiError('Not authorized, no token', 401))
    }
})

