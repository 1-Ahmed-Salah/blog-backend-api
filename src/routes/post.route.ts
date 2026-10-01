import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { createPost, deletePost, getPost, getPosts } from "../controllers/post.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { createPostValidate } from "../validators/post.validator.ts";
import { validateObjectId } from "../middlewares/validateObjectId.ts";
import { checkAdminOrUserHimself } from "../middlewares/checkAdminOrUserHimself.ts";

const router = Router();

router.route('/')
    .get(getPosts)
    .post(protect, upload.single("image"), validateRequest(createPostValidate), createPost);

router.route('/:id')
    .get(validateObjectId, getPost)
    .delete(protect, validateObjectId, deletePost);

export default router;
