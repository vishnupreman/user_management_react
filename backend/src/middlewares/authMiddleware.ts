import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access only" });
  }
  next();
};
