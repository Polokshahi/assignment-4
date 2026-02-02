import { Request, Response } from "express";
import { ReviewService } from "./review.service";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const ReviewController = {
  createReview: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const review = await ReviewService.createReview(req.user.userId, req.body);
      res.status(201).json({ success: true, data: review });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getTutorReviews: async (req: Request, res: Response) => {
    try {
      const tutorId = req.params.tutorId;
      const reviews = await ReviewService.getTutorReviews(tutorId as string);
      res.status(200).json({ success: true, data: reviews });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
