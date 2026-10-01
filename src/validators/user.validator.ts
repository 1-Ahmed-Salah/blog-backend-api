import joi from "joi";

export const registerValidate = joi.object({
    username: joi.string().trim().min(2).max(20).required(),
    email: joi.string().email().trim().min(2).max(50).required(),
    password: joi.string().trim().min(6).required(),
    bio: joi.string().trim().optional(),
});

export const loginValidate = joi.object({
    email: joi.string().email().trim().min(2).max(50).required(),
    password: joi.string().trim().min(6).required(),
});

export const updateValidate = joi.object({
    username: joi.string().trim().min(2).max(20),
    email: joi.string().email().trim().min(2).max(50),
    bio: joi.string().trim()
})


