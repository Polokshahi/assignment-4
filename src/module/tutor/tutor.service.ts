import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export const TutorService = {
  // ১. সকল টিউটর আনা (Fixed: Availability Include করা হয়েছে)
  getAllTutors: async (query: any) => {
    const { searchTerm, categoryId, minPrice, maxPrice, sortBy, sortOrder } = query;

    const whereConditions: Prisma.TutorProfileWhereInput = {};

    // Search logic
    if (searchTerm) {
      whereConditions.OR = [
        { bio: { contains: searchTerm as string, mode: "insensitive" } },
        { user: { name: { contains: searchTerm as string, mode: "insensitive" } } },
      ];
    }

    // Category Filter
    if (categoryId) {
      whereConditions.categoryId = categoryId as string;
    }

    // Price Range Filter
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    if ((min !== undefined && !isNaN(min)) || (max !== undefined && !isNaN(max))) {
      whereConditions.price = {
        ...(min !== undefined && !isNaN(min) && { gte: min }),
        ...(max !== undefined && !isNaN(max) && { lte: max }),
      };
    }

    // Sorting logic
    const validSortFields = ["price", "rating", "id"]; 
    const sortField = validSortFields.includes(sortBy) ? sortBy : "id";
    const order = sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

    return prisma.tutorProfile.findMany({
      where: whereConditions,
      include: {
        user: { 
          select: { 
            name: true, 
            email: true 
          } 
        },
        category: true,
        availability: true, // এটিই মূল ফিক্স, যা ফ্রন্টএন্ডে স্লট ডাটা পাঠাবে
      },
      orderBy: {
        [sortField]: order,
      },
    });
  },

  // ২. প্রোফাইল তৈরি বা আপডেট
  upsertProfile: async (userId: string, data: any) => {
    const { bio, price, categoryId } = data;

    return prisma.tutorProfile.upsert({
      where: { userId },
      update: { 
        bio, 
        price: Number(price), 
        categoryId: categoryId || null 
      },
      create: { 
        userId, 
        bio, 
        price: Number(price), 
        categoryId: categoryId || null
      },
    });
  },

  // ৩. প্রোফাইল তথ্য আনা
  getProfile: async (userId: string) => {
    return prisma.tutorProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { name: true, email: true } },
        category: true,
        availability: true 
      },
    });
  },

  // ৪. অ্যাভেইল্যাবিলিটি সেট করা
  setAvailability: async (tutorProfileId: string, slots: AvailabilitySlot[]) => {
    // পুরনো স্লট ডিলিট করা
    await prisma.availability.deleteMany({ 
      where: { tutorId: tutorProfileId } 
    });

    if (!slots || slots.length === 0) return;

    // নতুন স্লট তৈরি
    const newSlots = slots.map(slot => ({
      tutorId: tutorProfileId,
      date: slot.date,
      timeSlot: slot.timeSlot,
    }));

    return prisma.availability.createMany({ data: newSlots });
  },

  // ৫. টিউটরের নিজস্ব বুকিং লিস্ট
  getBookings: async (tutorProfileId: string) => {
    return prisma.booking.findMany({
      where: { tutorId: tutorProfileId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  },
};