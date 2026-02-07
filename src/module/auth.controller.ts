import { Request, Response } from "express";
import { AuthService } from "./auth.service";


interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, message: "User registered", data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await AuthService.login(req.body);
      res.json({ success: true, message: "Login successful", data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  me: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) throw new Error("Unauthorized");
      const user = await AuthService.me(req.user.userId);
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
