import joi from "joi";

export const createPostValidate = joi.object({
    title: joi.string().trim().min(2).max(100).required(),
    description: joi.string().trim().min(10).required(),
    category: joi.string().trim().required(),
});

export const updatePostValidate = joi.object({
    title: joi.string().trim().min(2).max(100),
    description: joi.string().trim().min(10),
    category: joi.string().trim(),
})
