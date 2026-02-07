import "dotenv/config";
import bcrypt from "bcrypt";

import { prisma } from "../config/prisma"; 

async function main() {
  const email = process.env.ADMIN_EMAIL; 
 const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env file");
  }

  const adminPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {}, 
    create: {
      name: "Admin Shaheb",
      email: email,
      password: adminPassword,
      role: "ADMIN", 
    },
  });

  console.log("Admin setup complete:", admin.email);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });