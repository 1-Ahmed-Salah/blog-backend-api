import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.ts";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.ts";
import { validateObjectId } from "../middlewares/validateObjectId.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { createCategoryValidate } from "../validators/category.validator.ts";

const router = Router();

router.route("/")
    .get(protect, getCategories)
    .post(protect, checkAdmin, validateRequest(createCategoryValidate), createCategory)

router.route("/:id")
    .delete(protect, checkAdmin, validateObjectId, deleteCategory)

export default router;
