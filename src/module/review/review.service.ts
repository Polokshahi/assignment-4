import { prisma } from "../../config/prisma";

interface ReviewPayload {
  tutorId: string;
  rating: number;
  comment: string;
}

export const ReviewService = {

  createReview: async (studentId: string, data: ReviewPayload) => {
    const { tutorId, rating, comment } = data;

  
    const booking = await prisma.booking.findFirst({
      where: { studentId, tutorId, status: "COMPLETED" },
    });

    if (!booking) {
      throw new Error("You can only review tutors after completing a session");
    }

   
    const review = await prisma.review.create({
      data: { studentId, tutorId, rating, comment },
    });

    
    const reviews = await prisma.review.findMany({ where: { tutorId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.tutorProfile.update({
      where: { userId: tutorId },
      data: { rating: avgRating },
    });

    return review;
  },

  getTutorReviews: async (tutorId: string) => {
    return prisma.review.findMany({
      where: { tutorId },
      include: { student: { select: { id: true, name: true, email: true } } },
    });
  },
};
