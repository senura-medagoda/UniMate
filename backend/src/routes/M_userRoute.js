import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/M_userController.js';


const userRouter = express.Router();

userRouter.post('/M_register',registerUser)
userRouter.post('/M_login',loginUser)
userRouter.post('/M_admin',adminLogin)

export default userRouter;
