import { z } from 'zod';

// Registration Validation
// Registration Validation
const registrationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'), 
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['STUDENT', 'TUTOR', 'ADMIN']).optional().default('STUDENT'),
  }),
});

// Login Validation
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Booking Validation
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