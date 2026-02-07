import { z } from 'zod';


const registrationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'), 
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['STUDENT', 'TUTOR', 'ADMIN']).optional().default('STUDENT'),
  }),
});


const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});


const bookingSchema = z.object({
  body: z.object({
    tutorId: z.string().uuid('Invalid Tutor ID'),
    date: z.string().min(1, 'Date is required'),
    timeSlot: z.string().min(1, 'Time slot is required'),
  }),
});

export const AuthValidations = {
  registrationSchema,
  loginSchema,
};

export const BookingValidations = {
  bookingSchema,
};