import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import Comment from "../models/comment.model.ts";
import User from "../models/user.model.ts";

/**
 * @desc    Get list of comments
 * @Route   GET /api/v1/comments
 * @access  Private (admin)
 */
export const getComments = asyncHandler(async(req, res, next)=> {

    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || 10;
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
        await Comment.find().sort({ createdAt: -1 })
            .skip(skip).limit(limit).populate({ path: "user", select: "-password" }),
        await Comment.countDocuments()
    ]);

    if(!comments) {
        return next(new ApiError("No commint yet!", 404));
    }

    res.status(200).json({
        success: true,
        count:totalComments,
        page,
        data: comments
    })
})


/**
 * @desc    Create a comment
 * @Route   POST /api/v1/comments
 * @access  Private (logged in user)
 */
export const createComment = asyncHandler(async(req, res, next)=> {

    const userId = req.user?.id;
    const { postId, text } = req.body;


    const user = await User.findById(userId);
    
    const comment = await Comment.create({
        postId,
        user: user?.id,
        text,
        username: user?.username
    });
    
    if(!comment) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment
    })
})

/**
 * @desc    Update a comment
 * @Route   PUT /api/v1/comments/:id
 * @access  Private (user himself)
 */
export const updateComment = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;

    const comment = await Comment.findById(id);
    if(!comment) {
        return next(new ApiError("Comment not found", 404));
    }

    if(req.user?.id !== comment.user.toString()) {
        return next(new ApiError("Access denied", 403))
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
    if(!updatedComment) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(200).json({
        success: true,
        data: updatedComment
    })
})

/**
 * @desc    Delete a comment
 * @Route   DELETE /api/v1/comments/:id
 * @access  Private (admin and user himself)
 */
export const deleteComment = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;

    const comment = await Comment.findById(id);

    if(!comment) {
        return next(new ApiError("Comment not found", 404));
    }

    if(!req.user?.isAdmin && comment.user.toString() !== req.user?.id) {
        return next(new ApiError("Access denied", 403));
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully"
    })
})
