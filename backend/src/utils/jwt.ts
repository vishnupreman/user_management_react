import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;


export const generateAccessToken = (userId: string, isAdmin: boolean): string => {
  return jwt.sign({ id: userId, isAdmin }, ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

export const generateRefreshToken = (userId: string, isAdmin: boolean): string => {
  return jwt.sign({ id: userId, isAdmin }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};


export const verifyAccessToken = (
  token: string
): { id: string; isAdmin: boolean } | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; isAdmin: boolean };
  } catch (error) {
    return null;
  }
};


export const verifyRefreshToken = (
  token: string
): { id: string; isAdmin: boolean } | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string; isAdmin: boolean };
  } catch (error) {
    return null;
  }
};
