import { Request, Response } from "express";
import { AdminService } from "./admin.service";


export const AdminController = {
  // Get all users
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await AdminService.getUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Delete a user by ID
  deleteUser: async (req: Request, res: Response) => {
    try {
      const user = await AdminService.deleteUser(req.params.id as string);
      res.json({ success: true, message: "User deleted", data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
