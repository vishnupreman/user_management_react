import { Request , Response } from "express";
import User from '../models/User'
import { AuthRequest } from "../types/authRequest";



export const getAllUser = async (req:AuthRequest , res:Response)=>{
    try {
        const users = await User.find().select('-password')
        console.log(users,'userss')
        return res.status(200).json(users)
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUser = async(req:AuthRequest , res:Response)=>{
    const {id} = req.params
    const {name, email , isAdmin} = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {name,email,isAdmin},
            {new :true , runValidators: true }
        ).select('-password');

        if(!updateUser) return res.status(404).json({message:'user not found'})
        
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteUser = async(req:AuthRequest, res:Response)=>{
    const{id} = req.params
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        if(!deleteUser) return res.status(404).json({message:'user not found'})

        res.status(200).json({message:'user deleted successfully'})
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export  const adminLogout = (req:Request,res:Response)=>{
    res.clearCookie("refreshToken")
    return res.status(200).json({ message: 'Admin logged out successfully' });
}