import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import Category from "../models/category.model.ts";

/**
 * @desc    get categories
 * @Route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async(req, res, next)=> {

    const categories = await Category.find();

    res.status(200).json({
        success: true,
        data: categories
    })
})

/**
 * @desc    Create a category
 * @Route   POST /api/v1/categories
 * @access  Private (only admin)
 */
export const createCategory = asyncHandler(async(req, res, next)=> {

    const category = await Category.create({
        title: req.body.title,
        user: req.user?.id
    });

    if(!category) {
        return next(new ApiError("Something went wrong", 400));
    }

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
    })
})

/**
 * @desc    Delete a category
 * @Route   DELETE /api/v1/categories/:id
 * @access  Private (only admin)
 */
export const deleteCategory = asyncHandler(async(req, res, next)=> {

    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    })
})
