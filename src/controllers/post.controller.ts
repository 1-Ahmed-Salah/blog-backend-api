import fs from "node:fs";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { cloudinaryUploadImage, cloudinaryDeleteImage } from "../utils/cloudinary.ts";
import Post from "../models/post.model.ts";
import Comment from "../models/comment.model.ts";

/**
 * @desc    Get list of posts
 * @Route   GET /api/v1/posts
 * @access  Public
 */
export const getPosts = asyncHandler(async(req, res, next)=> {

    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || 10;
    const skip = (page - 1) * limit;

    const [ posts, totalPosts ] = await Promise.all([
        await Post.find().sort({ createdAt: -1 })
            .skip(skip).limit(limit)
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments" }),
        await Post.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        page,
        count: totalPosts,
        data: posts
    });
})

/**
 * @desc    Get a post
 * @Route   GET /api/v1/posts/:id
 * @access  Public
 */
export const getPost = asyncHandler(async(req, res, next)=> {
    
    const { id } = req.params;

    const post = await Post.findById(id)
        .populate({ path: "user", select: "-password" })
        .populate({ path: "comments" });
    if(!post) {
        return next(new ApiError('Post not found', 404));
    }

    res.status(200).json({
        success: true,
        data: post
    })
})

/**
 * @desc    Create a new post
 * @Route   POST /api/v1/posts
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

/**
 * @desc    Update a post
 * @Route   PUT /api/v1/posts/:id
 * @access  Private (user himself)
 */
export const updatePost = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;

    const post = await Post.findById(id);
    if(!post) {
        return next(new ApiError("Post not found", 404));
    }

    if(req.user?.id !== post.user.toString()) {
        return next(new ApiError("Access denied", 403));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
    if(!updatedPost) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost
    }) 
})

/**
 * @desc    Update post image
 * @Route   PUT /api/v1/posts/upload-image/:id
 * @access  Private (user himself)
 */
export const updatePostImage = asyncHandler(async(req, res, next)=> {

    if(!req.file) {
        return next(new ApiError("No post image provided", 400));
    }

    const { id } = req.params;
    const imagePath = req.file.path;

    const post = await Post.findById(id);
    if(!post) {
        return next(new ApiError("Post not found", 404));
    }

    if(req.user?.id !== post.user.toString()) {
        return next(new ApiError("Access denied", 403));
    }

    await cloudinaryDeleteImage(post.image.publicId);

    const { secure_url, public_id } = await cloudinaryUploadImage(imagePath);

    post.image = {
        url: secure_url,
        publicId: public_id
    }

    await post.save();

    res.status(200).json({
        success: true,
        message: "Post image updated successfully"
    })

    fs.unlinkSync(imagePath);
})

/**
 * @desc    Toggle like on post
 * @Route   POST /api/v1/posts/like/:id
 * @access  Private (logged in user)
 */
export const toggleLike = asyncHandler(async(req, res, next)=> {
    
    const { id } = req.params;

    const post = await Post.findById(id);
    if(!post) {
        return next(new ApiError("Post not found", 404));
    }

    const userId = req.user?.id;

    if(!userId) {
        return next(new ApiError("User not found", 404));
    }

    const isLiked = post.likes.some(like => like.toString() === userId);

    let updatedPost;

    if(isLiked) {
        // unlike
        //post.likes = post.likes.filter(like => like.toString() !== userId);
        updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { returnDocument: "after" })
    } else {
        // add like
        // post.likes.push(userId);
        updatedPost = await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { returnDocument: "after" });
    }

    res.status(200).json({
        success: true,
        message: isLiked? "Post unliked successfully" : "Post liked successfully",
        isLiked: !isLiked,
        likesCount: updatedPost?.likes.length ?? 0
    })
})

/**
 * @desc    Delete a post
 * @Route   DELETE /api/v1/posts/:id
 * @access  Private (admin or user himself)
 */
export const deletePost = asyncHandler(async(req, res, next)=> {


    const { id } = req.params;

    const post = await Post.findById(id);
    if(!post) {
        return next(new ApiError("Post not found", 404));
    }

    if(!req.user?.isAdmin && post.user.toString() !== req.user?.id) {
        return next(new ApiError("Access denied", 403))
    }

    await cloudinaryDeleteImage(post.image.publicId);

    await Post.findByIdAndDelete(id);

    // @TODO 1. Delete all comment thar belong to this post
    await Comment.deleteMany({ postId: post._id });

    res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    })
})
