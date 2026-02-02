// src/module/admin/admin.controller.ts
import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export const AdminController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await AdminService.getUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updateUserStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 
      const user = await AdminService.updateUserStatus(id as string, status);
      
      res.json({ success: true, message: `User status updated to ${status}`, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      await AdminService.deleteUser(req.params.id as string);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};