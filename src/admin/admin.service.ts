import { prisma } from "../config/prisma";


export const AdminService = {
  getUsers: async () => {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  },

  deleteUser: async (id: string) => {
    return prisma.user.delete({ where: { id } });
  },
};
