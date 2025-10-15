import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/M_productModel.js';

//function for ADD product
const addProduct = async (req, res) => {
    try {
        
        
        const { name, description, price, stock, category, subCategory, size, bestseller } = req.body

        // Validate required fields
        if (!name || !description || !price || stock === undefined || !category || !subCategory) {
            return res.json({ 
                success: false, 
                message: "All required fields must be provided" 
            });
        }

        // Check if files exist before accessing them
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        console.log("Product data received:", { name, description, price, stock, category, subCategory, size, bestseller })
        console.log("Images:", images)

        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        console.log("Uploaded images:", imagesUrl);

        // Validate price value
        const priceValue = Number(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            return res.json({ 
                success: false, 
                message: "Price must be greater than 0" 
            });
        }

        // Validate stock value
        const stockValue = Number(stock);
        if (isNaN(stockValue) || stockValue < 0) {
            return res.json({ 
                success: false, 
                message: "Stock must be a valid non-negative number" 
            });
        }

        // Create product data
        const productData = {
            name,
            description,
            category,
            price: priceValue,
            stock: stockValue,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(size), // Assuming size is sent as JSON string
            image: imagesUrl,
            date: Date.now()
        }

        console.log("Product data to save:", productData);
        console.log("Stock value:", productData.stock, "Type:", typeof productData.stock);

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

//function for update product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, stock, category, subCategory, size, bestseller } = req.body

        // Validate required fields
        if (!productId || !name || !description || !price || stock === undefined || !category || !subCategory) {
            return res.json({ 
                success: false, 
                message: "All required fields must be provided" 
            });
        }

        // Check if files exist before accessing them
        const image1 = req.files?.image1 && req.files.image1[0]
        const image2 = req.files?.image2 && req.files.image2[0]
        const image3 = req.files?.image3 && req.files.image3[0]
        const image4 = req.files?.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        // Validate stock value
        const stockValue = Number(stock);
        if (isNaN(stockValue) || stockValue < 0) {
            return res.json({ 
                success: false, 
                message: "Stock must be a valid non-negative number" 
            });
        }

        let updateData = {
            name,
            description,
            category,
            price: Number(price),
            stock: stockValue,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(size),
        }

        console.log("Update data:", updateData);
        console.log("Stock value for update:", updateData.stock, "Type:", typeof updateData.stock);

        // Only update images if new ones are provided
        if (images.length > 0) {
            let imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url
                })
            )
            updateData.image = imagesUrl
        }

        const product = await productModel.findByIdAndUpdate(productId, updateData, { new: true });
        
        res.json({ 
            success: true, 
            message: "Product updated successfully",
            product
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct }