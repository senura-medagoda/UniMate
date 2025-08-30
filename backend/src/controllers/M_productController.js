import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/M_productModel.js';

//function for ADD product
const addProduct = async (req, res) => {
    try {
        
        
        const { name, description, price, category, subCategory, size, bestseller } = req.body

        // Check if files exist before accessing them
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        console.log(name, description, price, category, subCategory, size, bestseller)
        console.log("Images:", images)

        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        console.log("Uploaded images:", imagesUrl);

        // Create product data
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(size), // Assuming size is sent as JSON string
            image: imagesUrl,
            date: Date.now()
        }

        console.log("Product data:", productData);

        // Save to database 
        const product = new productModel(productData);
        await product.save();
        
        console.log("Product saved to MongoDB:", product._id);

        res.json({ 
            success: true, 
            message: "Product added successfully",
            productId: product._id
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//function for list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//function for delete product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//function for single product details
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct }