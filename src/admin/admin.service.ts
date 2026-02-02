// src/module/admin/admin.service.ts

import { prisma } from "../config/prisma";


export const AdminService = {
  getUsers: async () => {
    return await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
    });
  },


  updateUserStatus: async (id: string, status: "ACTIVE" | "BANNED") => {
    return await prisma.user.update({
      where: { id },
      data: { status }
    });
  },

  deleteUser: async (id: string) => {
    return await prisma.user.delete({ where: { id } });
  },
};