import express from 'express'
import {deleteUser,getAllUser,updateUser,adminLogout} from '../controller/adminController'
import {isAdmin,verifyToken} from '../middlewares/authMiddleware'

const router = express.Router()


router.get('/users',verifyToken,isAdmin,getAllUser)
router.put('/users/:id',verifyToken,isAdmin,updateUser)
router.delete('/users/:id',verifyToken,isAdmin,deleteUser)
router.post('/logout',adminLogout)

export default router