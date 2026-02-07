import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../middlewares/auth";

import { AuthValidations } from "./auth.validation";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/register", 
  validateRequest(AuthValidations.registrationSchema), 
  AuthController.register
);

router.post(
  "/login", 
  validateRequest(AuthValidations.loginSchema), 
  AuthController.login
);


router.get("/me", authMiddleware, AuthController.me);

export const AuthRoutes = router;