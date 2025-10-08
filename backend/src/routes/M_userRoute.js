import express from 'express';
import { loginUser,registerUser,adminLogin,getUser } from '../controllers/M_userController.js';


const userRouter = express.Router();

userRouter.post('/M_register',registerUser)
userRouter.post('/M_login',loginUser)
userRouter.post('/M_admin',adminLogin)
userRouter.post('/M_getUser',getUser)

export default userRouter;
