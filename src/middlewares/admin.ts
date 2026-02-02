import { Request, Response, NextFunction } from "express";

// Protect admin routes
export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  // req.user should be set by authMiddleware
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Only allow admins
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }

  next(); // user is admin, continue
};

