import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import User from "../models/user.model.ts";

/**
 * @desc    Register a new user
 * @Route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler( async(req, res, next)=> {

    const { email } = req.body;
    const userExists = await User.findOne({email});
    if(userExists) {
        return next(new ApiError("user already exists", 400));
    }

    const user = await User.create(req.body);
    if(!user) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(201).json({
        success: true,
        message: "user registerd successfully"
    })
})