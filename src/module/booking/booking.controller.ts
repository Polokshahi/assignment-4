import { Request, Response } from "express";
import { BookingService } from "./booking.service";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const BookingController = {
  createBooking: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      
      const booking = await BookingService.createBooking(req.user.userId, req.body);
      
      res.status(201).json({ 
        success: true, 
        message: "Tutor booked successfully!", 
        data: booking 
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getUserBookings: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      // সার্ভিসে userId এবং role পাঠানো হচ্ছে
      const bookings = await BookingService.getUserBookings(
        req.user.userId, 
        req.user.role as any
      );

      res.status(200).json({ 
        success: true, 
        message: "Bookings retrieved successfully",
        data: bookings 
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getBookingById: async (req: AuthRequest, res: Response) => {
    try {
      const booking = await BookingService.getBookingById(req.params.id as string);
      res.status(200).json({ success: true, data: booking });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};