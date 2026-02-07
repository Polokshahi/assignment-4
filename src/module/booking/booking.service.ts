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

    // ১. চেক করা যে স্লটটি টিউটরের অ্যাভেইল্যাবিলিটি লিস্টে আছে কি না
    const isAvailable = await prisma.availability.findFirst({
      where: { tutorId, date, timeSlot },
    });

    if (!isAvailable) {
      throw new Error("This time slot is no longer available.");
    }

    // ২. ট্রানজ্যাকশন ব্যবহার করে বুকিং করা এবং স্লট ডিলিট করা
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: { studentId, tutorId, date, timeSlot, status: "CONFIRMED" },
      });

      // স্লটটি টিউটরের অ্যাভেইল্যাবিলিটি থেকে সরিয়ে ফেলা
      await tx.availability.delete({
        where: { id: isAvailable.id },
      });

      return booking;
    });
  },

  getUserBookings: async (userId: string, role: UserRole) => {
    if (role === "STUDENT") {
      // স্টুডেন্টের জন্য বুকিং লিস্ট (টিউটর এবং তার ক্যাটাগরি সহ)
      return prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          tutor: {
            include: { 
              user: { select: { name: true, email: true } },
              category: true // এটি মিসিং ছিল, যা ফ্রন্টএন্ডে এরর দিচ্ছিল
            },
          },
        },
        orderBy: {
          date: 'desc' // লেটেস্ট বুকিং আগে দেখাবে
        }
      });
    } else if (role === "TUTOR") {
      // টিউটরের ক্ষেত্রে userId থেকে আগে প্রোফাইল আইডি খুঁজে বের করা
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
      // এডমিনের জন্য সব বুকিং
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