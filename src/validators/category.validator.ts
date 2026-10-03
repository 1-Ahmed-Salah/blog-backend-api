import joi from "joi";

export const createCategoryValidate = joi.object({

    title: joi.string().trim().required()
})

