import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidations } from "../auth.validation";

const router = Router();

router.use(authMiddleware);

// ১. স্টুডেন্টদের জন্য বুকিং তৈরি করার রাউট
router.post(
  "/", 
  (req: any, res, next) => {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ success: false, message: "Only students can create bookings" });
    }
    next();
  }, 
  validateRequest(BookingValidations.bookingSchema), 
  BookingController.createBooking
);

// ২. ফ্রন্টএন্ডের সাথে মিল রেখে এই রাউটটি যোগ করা হলো
router.get("/my-bookings", BookingController.getUserBookings);

// ৩. জেনারেল রুট (বিকল্প হিসেবে রাখা হলো)
router.get("/", BookingController.getUserBookings);

// ৪. আইডি দিয়ে বুকিং দেখা
router.get("/:id", BookingController.getBookingById);

export const BookingRoutes = router;