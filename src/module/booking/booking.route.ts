import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidations } from "../auth.validation";

const router = Router();

router.use(authMiddleware);


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


router.get("/my-bookings", BookingController.getUserBookings);


router.get("/", BookingController.getUserBookings);


router.get("/:id", BookingController.getBookingById);

export const BookingRoutes = router;