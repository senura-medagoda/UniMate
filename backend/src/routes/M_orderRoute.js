import express from 'express'
import {
  placeOrder,  allOrders,userOrder, updateStatus,analyticsReport,  deleteOrder, updateOrderLocation
} from '../controllers/M_orderController.js';

import adminAuth from '../middleware/M_adminAuth.js'
import authUser from '../middleware/M_Auth.js'

const orderRouter = express.Router()

//admin functions 
orderRouter.post('/M_list',adminAuth,allOrders)
orderRouter.post('/M_status',adminAuth,updateStatus)
orderRouter.post("/M_analytics", adminAuth, analyticsReport);

//payment functions

orderRouter.post('/M_place',authUser,placeOrder)
orderRouter.post("/M_delete", adminAuth, deleteOrder);
orderRouter.post('/M_updateLocation', updateOrderLocation);

//user funtions

orderRouter.post('/M_userorders',authUser,userOrder)


export default orderRouter

