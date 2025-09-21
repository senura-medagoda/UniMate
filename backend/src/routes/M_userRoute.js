import express from 'express';
import { loginUser,registerUser,adminLogin,getUserDetails } from '../controllers/M_userController.js';
import authUser from '../middleware/M_Auth.js';

const userRouter = express.Router();

userRouter.post('/M_register',registerUser)
userRouter.post('/M_login',loginUser)
userRouter.post('/M_admin',adminLogin)
userRouter.post('/M_getUser',authUser,getUserDetails)

export default userRouter;
