import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

   
    const user: IUser | null = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

  
    const accessToken = generateAccessToken(user._id.toString(), user.isAdmin);
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.isAdmin
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure:true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image ? `/uploads/${user.image}` : null,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;


    const image = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, image });
    await newUser.save();

    const accessToken = generateAccessToken(newUser._id.toString(), newUser.isAdmin);
    const refreshToken = generateRefreshToken(newUser._id.toString(), newUser.isAdmin);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        image: newUser.image || null,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
