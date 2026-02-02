import { prisma } from "../../config/prisma";

// Payload-e categoryId add kora hoyeche
interface TutorProfilePayload {
  bio: string;
  price: number;
  categoryId?: string; // Optional field
}

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export const TutorService = {
  // Create or update tutor profile
  upsertProfile: async (userId: string, data: TutorProfilePayload) => {
    const { bio, price, categoryId } = data;

    // Prisma-r built-in upsert method use kora holo (agee check korar dorkar nei)
    return prisma.tutorProfile.upsert({
      where: { userId },
      update: { 
        bio, 
        price, 
        categoryId // Update korar somoy categoryId save hobe
      },
      create: { 
        userId, 
        bio, 
        price, 
        categoryId // Create korar somoy categoryId save hobe
      },
    });
  },

  // Get tutor profile with user info and category
  getProfile: async (userId: string) => {
    return prisma.tutorProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { name: true, email: true } },
        category: true // Category details response-e ashar jonno
      },
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