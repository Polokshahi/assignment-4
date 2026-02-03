import { prisma } from "../../config/prisma";

interface TutorProfilePayload {
  bio: string;
  price: number;
  categoryId?: string;
}

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export const TutorService = {
  // ১. প্রোফাইল তৈরি বা আপডেট
  upsertProfile: async (userId: string, data: any) => {
    const { bio, price, categoryId } = data;

    return prisma.tutorProfile.upsert({
      where: { userId },
      update: { 
        bio, 
        price, 
        categoryId: categoryId || null 
      },
      create: { 
        userId, 
        bio, 
        price, 
        categoryId: categoryId || null
      },
    });
  },

  // ২. প্রোফাইল তথ্য আনা
  getProfile: async (userId: string) => {
    return prisma.tutorProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { name: true, email: true } },
        category: true 
      },
    });
  },

  // ৩. অ্যাভেইল্যাবিলিটি ফিক্স (tutorProfileId ব্যবহার করা হয়েছে)
 setAvailability: async (tutorProfileId: string, slots: AvailabilitySlot[]) => {
  // ১. পুরনো স্লট ডিলিট (সঠিক ID দিয়ে)
  await prisma.availability.deleteMany({ 
    where: { tutorId: tutorProfileId } 
  });

  if (!slots || slots.length === 0) return;

  // ২. নতুন স্লট ম্যাপিং
  const newSlots = slots.map(slot => ({
    tutorId: tutorProfileId, // এটি অবশ্যই TutorProfile-এর নিজস্ব ID হতে হবে
    date: slot.date,
    timeSlot: slot.timeSlot,
  }));

  // ৩. ক্রিয়েট ম্যানি কল
  return prisma.availability.createMany({ data: newSlots });
},

  // ৪. বুকিং লিস্ট
  getBookings: async (tutorProfileId: string) => {
    return prisma.booking.findMany({
      where: { tutorId: tutorProfileId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  },
};