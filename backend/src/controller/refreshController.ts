
import { Request, Response } from "express";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt";
import User from "../models/User";

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

   
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const newAccessToken = generateAccessToken(user.id.toString(), user.isAdmin);

    
    return res.status(200).json({
      accessToken: newAccessToken,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
