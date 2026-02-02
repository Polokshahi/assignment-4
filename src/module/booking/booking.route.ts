import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.use(authMiddleware);

// Only students can create bookings
router.post("/", (req: any, res, next) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ success: false, message: "Only students can create bookings" });
  }
  next();
}, BookingController.createBooking);

// Students/Tutors/Admin can get their bookings
router.get("/", BookingController.getUserBookings);

// Get booking by ID
router.get("/:id", BookingController.getBookingById);

export const BookingRoutes = router;
