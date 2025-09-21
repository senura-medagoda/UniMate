import express from 'express'

import {addProduct,listProducts,removeProduct,singleProduct,updateProduct} from '../controllers/M_productController.js'
import upload from '../middleware/M_multer.js';
import adminAuth from '../middleware/M_adminAuth.js';


const  productRouter = express.Router();


productRouter.post('/M_add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/M_remove',adminAuth,removeProduct);
productRouter.post('/M_update',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),updateProduct);
productRouter.post('/M_single',singleProduct);
productRouter.get('/M_list',listProducts);

export default  productRouter