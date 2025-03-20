import { AuthRequest } from "../types/authRequest"; 
import { Response } from "express";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
