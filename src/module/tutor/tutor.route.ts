import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.get("/", TutorController.getAllTutors);

// All routes require authentication and role = TUTOR
router.use(authMiddleware, (req: any, res, next) => {
  if (req.user.role !== "TUTOR") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
});

router.post("/profile", TutorController.upsertProfile);
router.get("/profile", TutorController.getProfile);
router.post("/availability", TutorController.setAvailability);
router.get("/bookings", TutorController.getBookings);

export const TutorRoutes = router;
