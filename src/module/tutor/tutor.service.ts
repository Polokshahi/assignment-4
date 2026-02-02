import { prisma } from "../../config/prisma";

interface TutorProfilePayload {
  bio: string;
  price: number;
}

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export const TutorService = {
  // Create or update tutor profile
  upsertProfile: async (userId: string, data: TutorProfilePayload) => {
    const { bio, price } = data;

    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return prisma.tutorProfile.update({
        where: { userId },
        data: { bio, price },
      });
    } else {
      return prisma.tutorProfile.create({
        data: { userId, bio, price },
      });
    }
  },

  // Get tutor profile with user info
  getProfile: async (userId: string) => {
    return prisma.tutorProfile.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true } } },
    });
  },

  // Set availability slots
  setAvailability: async (userId: string, slots: AvailabilitySlot[]) => {
    // Remove existing slots
    await prisma.availability.deleteMany({ where: { tutorId: userId } });

    if (!slots || slots.length === 0) return;

    const newSlots = slots.map(slot => ({
      tutorId: userId,
      date: slot.date,
      timeSlot: slot.timeSlot,
    }));

    return prisma.availability.createMany({ data: newSlots });
  },

  // Get bookings for tutor
  getBookings: async (userId: string) => {
    return prisma.booking.findMany({
      where: { tutorId: userId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
