import fs from "node:fs";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { cloudinaryUploadImage, cloudinaryDeleteImage } from "../utils/cloudinary.ts";
import Post from "../models/post.model.ts";

/**
 * @desc    Create a new post
 * @Route   POST /api/v1/auth/posts
 * @access  Private (logged in user)
 */
export const createPost = asyncHandler(async(req, res, next)=> {
    const { title, description, category } = req.body;
    const { id } = req.user!;

    if(!req.file) {
        return next(new ApiError("No post image provided", 400));
    }

    const imagePath = req.file.path;

    const { secure_url, public_id } = await cloudinaryUploadImage(imagePath);

    const post = await Post.create({
        title,
        description,
        category,
        user: id,
        image: {
            url: secure_url,
            publicId: public_id
        }
    });

    if(!post) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(201).json({
        title: post.title,
        description: post.description,
        category: post.category,
        user: post.user,
        image: post.image
    })

    fs.unlinkSync(imagePath);
})
