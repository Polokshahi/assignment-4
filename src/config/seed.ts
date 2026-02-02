import "dotenv/config";
import bcrypt from "bcrypt";
// .ts extension ba puru path-ti kheyal koro
import { prisma } from "../config/prisma"; 

async function main() {
  const email = process.env.ADMIN_EMAIL; 
 const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env file");
  }

  // Admin password hashing
  const adminPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {}, // Jodi thake tobe kichu korbe na
    create: {
      name: "Admin Shaheb",
      email: email,
      password: adminPassword,
      role: "ADMIN", // Tomar enum onujayi uppercase
    },
  });

  console.log("✅ Admin setup complete:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });