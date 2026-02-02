import { prisma } from "../../config/prisma";

interface BookingPayload {
  tutorId: string;
  date: string;
  timeSlot: string;
}

type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export const BookingService = {
  // Create a new booking (Student only)
  createBooking: async (studentId: string, data: BookingPayload) => {
    const { tutorId, date, timeSlot } = data;

    // Check if the slot is already booked
    const existingBooking = await prisma.booking.findFirst({
      where: { tutorId, date, timeSlot, status: "CONFIRMED" },
    });

    if (existingBooking) {
      throw new Error("This time slot is already booked");
    }

    return prisma.booking.create({
      data: { studentId, tutorId, date, timeSlot, status: "CONFIRMED" },
    });
  },

  // Get all bookings for a user (student or tutor)
  getUserBookings: async (userId: string, role: UserRole) => {
    if (role === "STUDENT") {
      return prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          tutor: {
            select: {
              user: { select: { name: true, email: true } },
              price: true,
            },
          },
        },
      });
    } else if (role === "TUTOR") {
      return prisma.booking.findMany({
        where: { tutorId: userId },
        include: {
          student: { select: { id: true, name: true, email: true } },
        },
      });
    } else {
      // Admin: return all bookings
      return prisma.booking.findMany({
        include: {
          student: { select: { id: true, name: true, email: true } },
          tutor: {
            select: {
              user: { select: { id: true, name: true, email: true } },
              price: true,
            },
          },
        },
      });
    }
  },

  // Get booking by ID (any role)
  getBookingById: async (bookingId: string) => {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { user: { select: { id: true, name: true, email: true } }, price: true } },
      },
    });
  },
};
