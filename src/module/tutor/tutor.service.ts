import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export const TutorService = {
  getAllTutors: async (query: any) => {
    const { searchTerm, categoryId, minPrice, maxPrice, sortBy, sortOrder } = query;

    const whereConditions: Prisma.TutorProfileWhereInput = {};

    if (searchTerm) {
      whereConditions.OR = [
        { bio: { contains: searchTerm as string, mode: "insensitive" } },
        { user: { name: { contains: searchTerm as string, mode: "insensitive" } } },
      ];
    }

    if (categoryId) {
      whereConditions.categoryId = categoryId as string;
    }

    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    if ((min !== undefined && !isNaN(min)) || (max !== undefined && !isNaN(max))) {
      whereConditions.price = {
        ...(min !== undefined && !isNaN(min) && { gte: min }),
        ...(max !== undefined && !isNaN(max) && { lte: max }),
      };
    }
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
        availability: true, 
      },
      orderBy: {
        [sortField]: order,
      },
    });
  },

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


  setAvailability: async (tutorProfileId: string, slots: AvailabilitySlot[]) => {

    await prisma.availability.deleteMany({ 
      where: { tutorId: tutorProfileId } 
    });

    if (!slots || slots.length === 0) return;


    const newSlots = slots.map(slot => ({
      tutorId: tutorProfileId,
      date: slot.date,
      timeSlot: slot.timeSlot,
    }));

    return prisma.availability.createMany({ data: newSlots });
  },


  getBookings: async (tutorProfileId: string) => {
    return prisma.booking.findMany({
      where: { tutorId: tutorProfileId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  },
};