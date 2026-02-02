import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { prisma } from "../../config/prisma";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const TutorController = {

   getAllTutors: async(req: Request, res: Response) => {

    try{

      const tutors = await prisma.tutorProfile.findMany({
       include: {
    user: { select: { id: true, name: true, email: true, role: true } }
 }
      });
      res.status(200).json({ success: true, data: tutors });



    }catch(err:any){
      res.status(400).json({ success: false, message: err.message });
    }

  },

    
  // Create/update profile
  upsertProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const profile = await TutorService.upsertProfile(req.user.userId, req.body);
      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Get profile
  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const profile = await TutorService.getProfile(req.user.userId);
      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Set availability slots
  setAvailability: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const slots = req.body.slots;
      await TutorService.setAvailability(req.user.userId, slots);
      res.status(200).json({ success: true, message: "Availability updated" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Get bookings for tutor
  getBookings: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const bookings = await TutorService.getBookings(req.user.userId);
      res.status(200).json({ success: true, data: bookings });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
