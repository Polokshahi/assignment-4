import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma"; // Prisma instance import koro

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Authorization header ache kina check
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const JWT_SECRET = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables!");
    return res.status(500).json({ success: false, message: "Server configuration error" });
  }

  try {
    // 2. Token verify kora
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Type guard: ensure decoded has userId and role
    if (!decoded || typeof decoded === "string" || !("userId" in decoded) || !("role" in decoded)) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // 3. Database theke User status check kora (Security Boost)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { status: true }
    });

    // Jodi user na thake ba user BANNED thake
    if (!user || user.status === "BANNED") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Your account is banned or does not exist." 
      });
    }

    // 4. Request object-e user data assign kora
    req.user = {
      userId: decoded.userId as string,
      role: decoded.role as string,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token or expired" });
  }
};