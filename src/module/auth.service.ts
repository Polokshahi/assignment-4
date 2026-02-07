import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export type RoleType = "STUDENT" | "TUTOR" | "ADMIN";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const AuthService = {
  register: async (payload: RegisterPayload) => {
    const { name, email, password, role } = payload;

  
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return user;
  },

  login: async (payload: LoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    if (user.status === "BANNED") {
      throw new Error("Your account has been banned. Please contact admin.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "10d" });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  },

  me: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  },
};
