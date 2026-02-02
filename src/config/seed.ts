import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

async function main() {
  // 1️⃣ Admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL as string },
    update: {},
    create: {
      name: "Admin Shaheb",
      email: process.env.ADMIN_EMAIL as string,
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
