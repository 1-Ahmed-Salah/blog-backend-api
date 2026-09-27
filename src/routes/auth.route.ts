import { Router } from "express";
import { login, register } from "../controllers/auth.controller.ts";
import { validateRequest } from "../middlewares/validateRequest.middleware.ts";
import { loginValidate, registerValidate } from "../validators/user.validator.ts";

const router = Router();

router.post('/register', validateRequest(registerValidate), register);
router.post('/login', validateRequest(loginValidate), login);

export default router;
