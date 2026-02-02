import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Admin-only routes
router.get("/", authMiddleware, (req: any, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
}, UserController.getAllUsers);

router.patch("/:id", authMiddleware, (req: any, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
}, UserController.updateUserStatus);

// Student/Tutor route
router.put("/profile", authMiddleware, UserController.updateProfile);

export const UserRoutes = router;
