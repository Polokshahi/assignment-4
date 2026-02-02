import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

const router = Router();

// All routes require auth + admin check
router.use(authMiddleware, adminMiddleware);

router.get("/users", AdminController.getUsers);
router.delete("/users/:id", AdminController.deleteUser);

export const AdminRoutes = router;
