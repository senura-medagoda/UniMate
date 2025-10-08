import express from 'express'
import { addToCart,getUserCart,updateCart } from '../controllers/M_CartController.js'
import authUser from '../middleware/M_Auth.js'



const cartRouter = express.Router()


cartRouter.post('/MU_get',authUser,getUserCart)
cartRouter.post('/MU_add',authUser,addToCart)
cartRouter.post('/MU_update',authUser,updateCart)


export default cartRouter