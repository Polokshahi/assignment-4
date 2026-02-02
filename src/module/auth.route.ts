import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected route
router.get("/me", authMiddleware, AuthController.me);

export const AuthRoutes = router;
