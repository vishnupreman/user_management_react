import { Router } from "express";
import { login , register, logout} from "../controller/authController";
import { refreshAccessToken} from "../controller/refreshController";
import { upload } from "../middlewares/uploads";
const router = Router()

router.post('/refresh', refreshAccessToken);
router.post('/register',upload.single('image'),register)
router.post('/login',login)
router.post('/logout',logout)


export default router