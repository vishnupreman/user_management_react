import { Router, Response, NextFunction } from 'express';
import {verifyToken} from "../middlewares/authMiddleware";
import { getProfile } from '../controller/userController';



const router = Router()

router.get('/profile',verifyToken,getProfile)

export default router