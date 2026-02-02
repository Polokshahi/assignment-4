import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// @prisma/client/index.js theke specific bhabe import koro
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL; // 

// PostgreSQL pool setup
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Prisma Client initialization
const prisma = new PrismaClient({ adapter });

export { prisma };