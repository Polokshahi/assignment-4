import { prisma } from "../../config/prisma";

interface BookingPayload {
  tutorId: string;
  date: string;
  timeSlot: string;
}

type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

export const BookingService = {
  createBooking: async (studentId: string, data: BookingPayload) => {
    const { tutorId, date, timeSlot } = data;

   
    const isAvailable = await prisma.availability.findFirst({
      where: { tutorId, date, timeSlot },
    });

    if (!isAvailable) {
      throw new Error("This time slot is no longer available.");
    }

 
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: { studentId, tutorId, date, timeSlot, status: "CONFIRMED" },
      });

      
      await tx.availability.delete({
        where: { id: isAvailable.id },
      });

      return booking;
    });
  },

  getUserBookings: async (userId: string, role: UserRole) => {
    if (role === "STUDENT") {
      
      return prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          tutor: {
            include: { 
              user: { select: { name: true, email: true } },
              category: true 
            },
          },
        },
        orderBy: {
          date: 'desc' 
        }
      });
    } else if (role === "TUTOR") {
   
      const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
      if (!profile) return [];

      return prisma.booking.findMany({
        where: { tutorId: profile.id },
        include: {
          student: { select: { name: true, email: true } },
        },
        orderBy: {
          date: 'desc'
        }
      });
    } else {
  
      return prisma.booking.findMany({
        include: {
          student: { select: { name: true, email: true } },
          tutor: { 
            include: { 
              user: { select: { name: true } },
              category: true 
            } 
          },
        },
      });
    }
  },

  getBookingById: async (bookingId: string) => {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { 
          include: { 
            user: { select: { name: true, email: true } },
            category: true 
          } 
        },
      },
    });
  },
};