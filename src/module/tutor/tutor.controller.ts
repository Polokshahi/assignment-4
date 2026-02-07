import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { prisma } from "../../config/prisma";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const TutorController = {

  getAllTutors: async (req: Request, res: Response) => {
    try {
  
      const tutors = await TutorService.getAllTutors(req.query);

      res.status(200).json({
        success: true,
        message: "Tutors retrieved successfully",
        data: tutors,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to load tutors",
        error: error.message
      });
    }
  },


  upsertProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const profile = await TutorService.upsertProfile(req.user.userId, req.body);
      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },


  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const profile = await TutorService.getProfile(req.user.userId);
      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },



setAvailability: async (req: AuthRequest, res: Response) => {
  try {
    const uId = req.user?.userId;
    if (!uId) return res.status(401).json({ success: false, message: "Unauthorized" });

   
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: uId }
    });

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: "Tutor profile not found. Please save bio/price first." 
      });
    }

    const { slots } = req.body;

    await TutorService.setAvailability(profile.id, slots);
    
    res.status(200).json({ success: true, message: "Availability updated" });
  } catch (err: any) {
    console.error("Availability Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
},

  getBookings: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: req.user.userId }
      });

      if (!tutorProfile) return res.status(404).json({ success: false, message: "Profile not found" });

      const bookings = await TutorService.getBookings(tutorProfile.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};