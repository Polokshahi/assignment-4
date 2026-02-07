import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { authMiddleware } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TutorValidations } from "./tutor.validation";

const router = Router();


router.get("/", TutorController.getAllTutors);

router.use(authMiddleware, (req: any, res, next) => {
  if (req.user.role !== "TUTOR") {
    return res.status(403).json({ success: false, message: "Forbidden: Only tutors can access this." });
  }
  next();
});

router.post(
  "/profile", 
  validateRequest(TutorValidations.tutorProfileSchema), 
  TutorController.upsertProfile
);

router.get("/profile", TutorController.getProfile);

router.post("/availability", TutorController.setAvailability);

router.get("/bookings", TutorController.getBookings);

export const TutorRoutes = router;