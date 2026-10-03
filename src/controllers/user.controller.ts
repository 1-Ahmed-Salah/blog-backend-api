import fs from "node:fs";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { cloudinaryDeleteImage, cloudinaryDeleteImages, cloudinaryUploadImage } from "../utils/cloudinary.ts";
import User from "../models/user.model.ts";
import Post from "../models/post.model.ts";
import Comment from "../models/comment.model.ts";

/**
 * @desc    Get list of users
 * @Route   GET /api/v1/users
 * @access  Private (admin)
 */
export const getUsers = asyncHandler(async(req, res, next)=> {

    // pagination
    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || 10;
    const skip = (page -1) * limit;

    const [users, totalUsers] = await Promise.all([
        await User.find().skip(skip).limit(limit),
        await User.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        page,
        count: totalUsers,
        data: users
    })
})

/**
 * @desc    Get a user by id
 * @Route   GET /api/v1/users/:id
 * @access  Public
 */
export const getUser = asyncHandler(async(req, res, next)=>{

    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if(!user) {
        return next(new ApiError("User not found", 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * @desc    Update a user data
 * @Route   PUT /api/v1/users/:id
 * @access  Private (user himself)
 */
export const updateUser = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { returnDocument: "after" })
        .select('-password');
    if(!updatedUser) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(200).json({
        success: true,
        data: updatedUser
    })
})

/**
 * @desc    Change password
 * @Route   PUT /api/v1/users/change-password/:id
 * @access  Private (user himself)
 */
export const changePassword = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(id);
    if(!user) {
        return next(new ApiError("User not found", 404));
    }

    if(!(await user.matchPassword(currentPassword))) {
        return next(new ApiError('Invalid current password', 400));
    }

    if(newPassword !== confirmPassword) {
        return next(new ApiError("Invalid confirm password", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
})

/**
 * @desc    Upload profile image
 * @Route   POST /api/v1/users/upload-profile-image
 * @access  Private (user himself)
 */
export const uploadProfileImage = asyncHandler(async(req, res, next)=> {

    if(!req.file) {
        return next(new ApiError("Image required", 400));
    }

    const imagePath = req.file.path;

    const { secure_url , public_id } = await cloudinaryUploadImage(imagePath);
   
    const user = await User.findById(req.user?.id);
    if(!user) {
        return next(new ApiError("User not found", 404));
    }

    if(user.image?.publicId !== null) {
        await cloudinaryDeleteImage(user.image?.publicId!);
    }

    user.image = {
        url: secure_url,
        publicId: public_id
    }

    await user.save();

    res.status(201).json({
        success: true,
        message: "Image uploaded successfully"
    })

    fs.unlinkSync(imagePath);
})

/**
 * @desc    Delete a user
 * @Route   DELETE /api/v1/users/u:id
 * @access  Private (admon or user himself)
 */ 
export const deleteUser = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;
    // 1. Get user from DB
    const user = await User.findById(id);
    if(!user) {
        return next(new ApiError("User not found", 404));
    }

    const posts = await Post.find({ user: user._id });
    
    const public_ids = posts.map(post => post.image.publicId);

    if(public_ids.length > 0) {
        await cloudinaryDeleteImages(public_ids);
    }

    if(user.image?.publicId) {
        await cloudinaryDeleteImage(user.image?.publicId!);
    }

    await Post.deleteMany({ user: user._id });

    await Comment.deleteMany({ user: user._id });

    await User.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})
