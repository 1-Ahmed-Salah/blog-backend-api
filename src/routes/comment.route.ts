import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.ts";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { createCommentValidate, updateCommentValidate } from "../validators/comment.validator.ts";
import { validateObjectId } from "../middlewares/validateObjectId.ts";

const router = Router();

router.route("/")
    .get(protect, checkAdmin, getComments)
    .post(protect, validateRequest(createCommentValidate), createComment)

router.route("/:id")
    .put(protect, validateObjectId, validateRequest(updateCommentValidate), updateComment)
    .delete(protect, validateObjectId, deleteComment)

export default router;
