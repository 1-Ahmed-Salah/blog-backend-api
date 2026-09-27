import { Router } from "express";
import { register } from "../controllers/auth.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { registerValidate } from "../validators/user.validator.ts";

const router = Router();

router.post('/register', validateRequest(registerValidate), register);

export default router;
