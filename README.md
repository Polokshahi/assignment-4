SkillBridge – Backend API

This is the backend for SkillBridge. It manages user login, roles, tutor data, and session bookings.

Project Links

API Live URL: [Backend Live Link]

Frontend Repository: [Frontend GitHub Link]

Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
Prisma ORM

What It Does

Users & Roles: Student, Tutor, Admin
Tutor Profiles: Bio, hourly rate, ratings
Bookings: Uses Prisma transactions to prevent double booking by automatically locking time slots

Main API Endpoints

POST /api/auth/register – Create an account
GET /api/tutors – View tutors with filters
POST /api/bookings – Book a session
GET /api/bookings/my-bookings – View your bookings

How to Run Locally

Clone the repo

Install packages: npm install

Set up .env with DATABASE_URL and JWT_SECRET

Run Prisma: npx prisma generate && npx prisma db push
