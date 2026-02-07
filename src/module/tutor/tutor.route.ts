import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { authMiddleware } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TutorValidations } from "./tutor.validation";

const router = Router();

// ১. পাবলিক রুট: যেকোনো ইউজার টিউটর লিস্ট দেখতে পারবে (Search & Filter সহ)
router.get("/", TutorController.getAllTutors);

// ২. টিউটর স্পেসিফিক রুটস: এগুলোর জন্য লগইন এবং TUTOR রোল বাধ্যতামূলক
router.use(authMiddleware, (req: any, res, next) => {
  if (req.user.role !== "TUTOR") {
    return res.status(403).json({ success: false, message: "Forbidden: Only tutors can access this." });
  }
  next();
});

// প্রোফাইল তৈরি বা আপডেট করার সময় আগে Zod দিয়ে ভ্যালিডেশন করা হবে
router.post(
  "/profile", 
  validateRequest(TutorValidations.tutorProfileSchema), 
  TutorController.upsertProfile
);

router.get("/profile", TutorController.getProfile);

router.post("/availability", TutorController.setAvailability);

router.get("/bookings", TutorController.getBookings);

export const TutorRoutes = router;