import { Request, Response } from "express";
import { UserService } from "./user.service";

// Admin functions
export const UserController = {
  getAllUsers: async (req: any, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateUserStatus: async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // ACTIVE | BANNED
      const updatedUser = await UserService.updateUserStatus(id, status);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Student/Tutor: Update profile
  updateProfile: async (req: any, res: Response) => {
    try {
      const userId = req.user.userId;
      const updatedUser = await UserService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
