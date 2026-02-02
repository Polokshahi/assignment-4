

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { AdminController } from "./admin.controller";




const router = Router();

router.use(authMiddleware, (req: any, res, next)=>{
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }

    next();
} );

router.get("/users", AdminController.getUsers);
router.patch("/users/:id/status", AdminController.updateUserStatus);
router.delete("/users/:id", AdminController.deleteUser);

export const AdminRoutes = router;