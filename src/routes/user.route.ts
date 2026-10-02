import { Router } from "express";
import { protect } from "../middlewares/protect.middleware.ts";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.ts";
import { changePassword, deleteUser, getUser, getUsers, updateUser, uploadProfileImage } from "../controllers/user.controller.ts";
import { validateObjectId } from "../middlewares/validateObjectId.ts";
import { checkUserHimself } from "../middlewares/checkUserHimself.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { checkAdminOrUserHimself } from "../middlewares/checkAdminOrUserHimself.ts";

const router = Router();

router.route('/')
    .get(protect, checkAdmin, getUsers);

router.route('/:id')
    .get(protect, validateObjectId, getUser)
    .put(protect, validateObjectId, checkUserHimself, updateUser)
    .delete(protect, validateObjectId, checkAdminOrUserHimself, deleteUser);

router.post('/upload-profile-image', protect, upload.single('avatar'), uploadProfileImage);

router.put("/change-password/:id", protect, validateObjectId, checkUserHimself, changePassword);

export default router;
