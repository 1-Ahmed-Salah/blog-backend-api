import joi from "joi";

export const createCommentValidate = joi.object({
    postId: joi.string().required(),
    text: joi.string().trim().required()
})

export const updateCommentValidate = joi.object({
    text: joi.string().trim().required()
})
