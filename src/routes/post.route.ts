import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { createPost } from "../controllers/post.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { createPostValidate } from "../validators/post.validator.ts";

const router = Router();

router.route('/')
    .post(protect, upload.single("image"), validateRequest(createPostValidate), createPost)

export default router;
