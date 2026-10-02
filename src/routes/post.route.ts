import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { createPost, deletePost, getPost, getPosts, toggleLike, updatePost, updatePostImage } from "../controllers/post.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { createPostValidate, updatePostValidate } from "../validators/post.validator.ts";
import { validateObjectId } from "../middlewares/validateObjectId.ts";
import { checkAdminOrUserHimself } from "../middlewares/checkAdminOrUserHimself.ts";

const router = Router();

router.route('/')
    .get(getPosts)
    .post(protect, upload.single("image"), validateRequest(createPostValidate), createPost);

router.route('/:id')
    .get(validateObjectId, getPost)
    .put(protect, validateObjectId, validateRequest(updatePostValidate), updatePost)
    .delete(protect, validateObjectId, deletePost);

router.put('/upload-image/:id', protect, validateObjectId, upload.single('image'), updatePostImage);
router.post('/like/:id', protect, validateObjectId, toggleLike);

export default router;
