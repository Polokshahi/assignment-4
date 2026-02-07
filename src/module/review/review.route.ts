import { Router } from "express";
import { ReviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();


router.use(authMiddleware);


router.post("/", (req: any, res, next) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ success: false, message: "Only students can review tutors" });
  }
  next();
}, ReviewController.createReview);


router.get("/tutor/:tutorId", ReviewController.getTutorReviews);

export const ReviewRoutes = router;
