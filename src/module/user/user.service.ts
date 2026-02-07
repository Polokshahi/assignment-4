import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";

export const UserService = {
  getAllUsers: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },


  updateUserStatus: async (userId: string, status: "ACTIVE" | "BANNED") => {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  },


  updateProfile: async (userId: string, data: any) => {
    const { name, password } = data;
    const updateData: any = { name };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },
};
