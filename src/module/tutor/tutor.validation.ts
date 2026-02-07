import { z } from 'zod';

const tutorProfileSchema = z.object({
  body: z.object({
    bio: z.string().min(20, 'Bio must be at least 20 characters long'),
    price: z.number().positive('Price must be a positive number'),
    categoryId: z.string().optional(),
  }),
});

export const TutorValidations = {
  tutorProfileSchema,
};