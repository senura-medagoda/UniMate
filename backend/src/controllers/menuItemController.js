import MenuItemModel from "../models/MenuItemModel.js";
import ShopModel from "../models/ShopModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Create Menu Item
export const createMenuItem = async (req, res) => {
    try {
        if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
            !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            console.error('❌ Cloudinary validation failed in createMenuItem:');
            console.error('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME);
            console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
            console.error('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set');
            
            return res.status(500).json({
                success: false,
                message: "Cloudinary is not properly configured. Please check your environment variables.",
                error: "Missing Cloudinary configuration",
                details: {
                    cloudName: process.env.CLOUDINARY_NAME || 'Not set',
                    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
                    apiSecret: process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set'
                }
            });
        }

        const vendorId = req.vendorId;
        let menuData = { ...req.body };

        console.log('=== CREATE MENU ITEM DEBUG ===');
        console.log('Request Headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');
        console.log('Body fields:', Object.keys(req.body));
        console.log('================================');

       
        const shop = await ShopModel.findOne({ vendorId });
        if (!shop) {
            return res.status(400).json({
                success: false,
                message: "Please create a shop first"
            });
        }

        if (menuData.allergens) {
            if (typeof menuData.allergens === 'string') {
                try {
                    menuData.allergens = JSON.parse(menuData.allergens);
                } catch (e) {
                    console.log('Failed to parse allergens JSON, setting to empty array');
                    menuData.allergens = [];
                }
            } else if (!Array.isArray(menuData.allergens)) {
                menuData.allergens = [];
            }
        } else {
            menuData.allergens = [];
        }
        
        if (menuData.ingredients) {
            if (typeof menuData.ingredients === 'string') {
                try {
                    menuData.ingredients = JSON.parse(menuData.ingredients);
                } catch (e) {
                    console.log('Failed to parse ingredients JSON, setting to empty array');
                    menuData.ingredients = [];
                }
            } else if (!Array.isArray(menuData.ingredients)) {
                menuData.ingredients = [];
            }
        } else {
            menuData.ingredients = [];
        }

        if (menuData.price) {
            menuData.price = parseFloat(menuData.price);
        }

        if (menuData.preparationTime) {
            menuData.preparationTime = parseInt(menuData.preparationTime);
        }

        if (req.files && req.files.image && req.files.image[0]) {
            try {
            
                const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                    folder: 'menu-items',
                    width: 800,
                    height: 600,
                    crop: "fill",
                    quality: 'auto'
                });
                menuData.image = result.secure_url;
                console.log('Image uploaded successfully to Cloudinary:', result.secure_url);

                fs.unlinkSync(req.files.image[0].path);
            } catch (imageError) {
                console.error('Image upload error:', imageError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image to Cloudinary",
                    error: imageError.message
                });
            }
        }

        if (req.files && req.files.images && req.files.images.length > 0) {
            try {
   
                const imagePromises = req.files.images.map(file => 
                    cloudinary.uploader.upload(file.path, {
                        folder: 'menu-items',
                        width: 800,
                        height: 600,
                        crop: "fill",
                        quality: 'auto'
                    })
                );
                const imageResults = await Promise.all(imagePromises);
                menuData.images = imageResults.map(result => result.secure_url);
                console.log('Multiple images uploaded successfully to Cloudinary');
                
           
                req.files.images.forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.log('Failed to delete local file:', file.path);
                    }
                });
            } catch (imageError) {
                console.error('Multiple images upload error:', imageError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload images to Cloudinary",
                    error: imageError.message
                });
            }
        }


        if (!menuData.image && (!menuData.images || menuData.images.length === 0)) {
            console.log('No images provided, setting default placeholder');
            menuData.image = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=🍽️+No+Image';
        }

     
        const cleanMenuData = {
            name: menuData.name,
            description: menuData.description,
            price: menuData.price,
            category: menuData.category,
            isAvailable: menuData.isAvailable === 'true' || menuData.isAvailable === true,
            isPopular: menuData.isPopular === 'true' || menuData.isPopular === false,
            isVegetarian: menuData.isVegetarian === 'true' || menuData.isVegetarian === false,
            isVegan: menuData.isVegan === 'true' || menuData.isVegan === false,
            isGlutenFree: menuData.isGlutenFree === 'true' || menuData.isGlutenFree === false,
            isSpicy: menuData.isSpicy === 'true' || menuData.isSpicy === false,
            preparationTime: menuData.preparationTime,
            calories: menuData.calories,
            allergens: menuData.allergens || [],
            ingredients: menuData.ingredients || [],
            image: menuData.image || '',
            images: menuData.images || []
        };

        console.log('Clean menu data:', cleanMenuData);

        const menuItem = new MenuItemModel({
            ...cleanMenuData,
            vendorId,
            shopId: shop._id
        });

        await menuItem.save();

        console.log('Menu item saved successfully:', menuItem);

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem
        });

    } catch (error) {
        console.error("Create menu item error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get All Menu Items for Vendor
export const getVendorMenuItems = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const { 
            page = 1, 
            limit = 10, 
            category, 
            isAvailable,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = { vendorId };

        if (category) {
            query.category = category;
        }

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const menuItems = await MenuItemModel.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MenuItemModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                menuItems,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get vendor menu items error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Menu Item by ID
export const getMenuItemById = async (req, res) => {
    try {
        const { itemId } = req.params;
        const vendorId = req.vendorId;

        const menuItem = await MenuItemModel.findOne({ _id: itemId, vendorId });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });

    } catch (error) {
        console.error("Get menu item by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Update Menu Item
export const updateMenuItem = async (req, res) => {
    try {
   
        if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
            !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            console.error('❌ Cloudinary validation failed in updateMenuItem:');
            console.error('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME);
            console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
            console.error('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set');
            
            return res.status(500).json({
                success: false,
                message: "Cloudinary is not properly configured. Please check your environment variables.",
                error: "Missing Cloudinary configuration",
                details: {
                    cloudName: process.env.CLOUDINARY_NAME || 'Not set',
                    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
                    apiSecret: process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set'
                }
            });
        }

        const { itemId } = req.params;
        const vendorId = req.vendorId;
        const updates = req.body;
        
        console.log('=== UPDATE MENU ITEM DEBUG ===');
        console.log('Item ID:', itemId);
        console.log('Vendor ID:', vendorId);
        console.log('Request Headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');
        console.log('Body fields:', Object.keys(req.body));
        console.log('existingImages field:', req.body.existingImages);
        console.log('================================');

     
        const shop = await ShopModel.findOne({ vendorId });
        if (!shop) {
            return res.status(400).json({
                success: false,
                message: "Please create a shop first"
            });
        }
        
       
        updates.shopId = shop._id;

     
        if (req.files && req.files.image && req.files.image[0]) {
            try {
              
                const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                    folder: 'menu-items',
                    width: 800,
                    height: 600,
                    crop: "fill",
                    quality: 'auto'
                });
                updates.image = result.secure_url;
                console.log('Image uploaded successfully to Cloudinary:', result.secure_url);
           
                fs.unlinkSync(req.files.image[0].path);
            } catch (imageError) {
                console.error('Image upload error:', imageError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image to Cloudinary",
                    error: imageError.message
                });
            }
        }

            
        if (req.files && req.files.images && req.files.images.length > 0) {
            try {
         
                const imagePromises = req.files.images.map(file => 
                    cloudinary.uploader.upload(file.path, {
                        folder: 'menu-items',
                        width: 800,
                        height: 600,
                        crop: "fill",
                        quality: 'auto'
                    })
                );
                const imageResults = await Promise.all(imagePromises);
                updates.images = imageResults.map(result => result.secure_url);
                console.log('Multiple images uploaded successfully to Cloudinary');
                
          
                req.files.images.forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.log('Failed to delete local file:', file.path);
                    }
                });
            } catch (imageError) {
                console.error('Multiple images upload error:', imageError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload images to Cloudinary",
                    error: imageError.message
                });
            }
        }

       
        if (updates.existingImages !== undefined) {
            try {
                const existingImages = JSON.parse(updates.existingImages);
                if (Array.isArray(existingImages)) {
                   
                    if (updates.images && Array.isArray(updates.images)) {
                        updates.images = [...existingImages, ...updates.images];
                    } else if (updates.image) {
                       
                        updates.images = [...existingImages, updates.image];
                        delete updates.image;
                    } else {
                       
                        updates.images = existingImages;
                    }
                }
            } catch (e) {
                console.log('Failed to parse existingImages JSON, treating as string');
                if (updates.images && Array.isArray(updates.images)) {
                    updates.images = [updates.existingImages, ...updates.images];
                } else if (updates.image) {
                    updates.images = [updates.existingImages, updates.image];
                    delete updates.image;
                } else {
                    updates.images = [updates.existingImages];
                }
            }
         
            delete updates.existingImages;
        } else {
           
            if (updates.image && !updates.images) {
                updates.images = [updates.image];
                delete updates.image;
            }
        }

     
        if (!updates.image && (!updates.images || updates.images.length === 0)) {
            console.log('No images provided in update, setting default placeholder');
            updates.image = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=🍽️+No+Image';
        }

      
        if (updates.allergens) {
            if (typeof updates.allergens === 'string') {
                try {
                    updates.allergens = JSON.parse(updates.allergens);
                } catch (e) {
                    console.log('Failed to parse allergens JSON in update, setting to empty array');
                    updates.allergens = [];
                }
            } else if (!Array.isArray(updates.allergens)) {
                updates.allergens = [];
            }
        }
        
        if (updates.ingredients) {
            if (typeof updates.ingredients === 'string') {
                try {
                    updates.ingredients = JSON.parse(updates.ingredients);
                } catch (e) {
                    console.log('Failed to parse ingredients JSON in update, setting to empty array');
                    updates.ingredients = [];
                }
            } else if (!Array.isArray(updates.ingredients)) {
                updates.ingredients = [];
            }
        }

      
        if (updates.price) {
            updates.price = parseFloat(updates.price) || 0;
        }
        if (updates.preparationTime) {
            updates.preparationTime = parseInt(updates.preparationTime) || 15;
        }
        if (updates.calories) {
            updates.calories = parseFloat(updates.calories) || 0;
        }

       
        if (updates.isAvailable !== undefined) {
            updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;
        }
        if (updates.isPopular !== undefined) {
            updates.isPopular = updates.isPopular === 'true' || updates.isPopular === true;
        }
        if (updates.isVegetarian !== undefined) {
            updates.isVegetarian = updates.isVegetarian === 'true' || updates.isVegetarian === true;
        }
        if (updates.isVegan !== undefined) {
            updates.isVegan = updates.isVegan === 'true' || updates.isVegan === true;
        }
        if (updates.isGlutenFree !== undefined) {
            updates.isGlutenFree = updates.isGlutenFree === 'true' || updates.isGlutenFree === true;
        }
        if (updates.isSpicy !== undefined) {
            updates.isSpicy = updates.isSpicy === 'true' || updates.isSpicy === true;
        }

        console.log('Database update query:', { _id: itemId, vendorId });
        console.log('Processed update data:', updates);
        console.log('Final images field:', updates.images);
        
        const menuItem = await MenuItemModel.findOneAndUpdate(
            { _id: itemId, vendorId },
            updates,
            { new: true, runValidators: true }
        );

        console.log('Update result:', menuItem);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: menuItem
        });

    } catch (error) {
        console.error("Update menu item error:", error);
        console.error("Error stack:", error.stack);
        console.error("Request body:", req.body);
        console.error("Request files:", req.files);
        console.error("Request params:", req.params);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Delete Menu Item
export const deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const vendorId = req.vendorId;

        const menuItem = await MenuItemModel.findOneAndDelete({ _id: itemId, vendorId });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully"
        });

    } catch (error) {
        console.error("Delete menu item error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Toggle Menu Item Availability
export const toggleMenuItemAvailability = async (req, res) => {
    try {
        const { itemId } = req.params;
        const vendorId = req.vendorId;
        const { isAvailable } = req.body;

        const menuItem = await MenuItemModel.findOneAndUpdate(
            { _id: itemId, vendorId },
            { isAvailable },
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Menu item ${isAvailable ? 'made available' : 'made unavailable'}`,
            data: { isAvailable: menuItem.isAvailable }
        });

    } catch (error) {
        console.error("Toggle menu item availability error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Toggle Menu Item Popular Status
export const toggleMenuItemPopular = async (req, res) => {
    try {
        const { itemId } = req.params;
        const vendorId = req.vendorId;
        const { isPopular } = req.body;

        const menuItem = await MenuItemModel.findOneAndUpdate(
            { _id: itemId, vendorId },
            { isPopular },
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Menu item ${isPopular ? 'marked as popular' : 'unmarked as popular'}`,
            data: { isPopular: menuItem.isPopular }
        });

    } catch (error) {
        console.error("Toggle menu item popular error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Menu Items by Shop (Public)
export const getMenuItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { 
            category, 
            isAvailable = true,
            sortBy = 'sortOrder',
            sortOrder = 'asc'
        } = req.query;

        const query = { shopId, isAvailable: true };

        if (category) {
            query.category = category;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const menuItems = await MenuItemModel.find(query)
            .sort(sortOptions)
            .select('-vendorId -shopId');

        res.status(200).json({
            success: true,
            data: menuItems
        });

    } catch (error) {
        console.error("Get menu items by shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Menu Categories
export const getMenuCategories = async (req, res) => {
    try {
        const vendorId = req.vendorId;

        const categories = await MenuItemModel.aggregate([
            { $match: { vendorId: vendorId } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error("Get menu categories error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Bulk Update Menu Items
export const bulkUpdateMenuItems = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const { items } = req.body;

        const updatePromises = items.map(item => 
            MenuItemModel.findOneAndUpdate(
                { _id: item._id, vendorId },
                { $set: item.updates },
                { new: true }
            )
        );

        const updatedItems = await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Menu items updated successfully",
            data: updatedItems
        });

    } catch (error) {
        console.error("Bulk update menu items error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get All Menu Items (Public)
export const getAllMenuItems = async (req, res) => {
    try {
        const { 
            category, 
            isAvailable = true,
            sortBy = 'sortOrder',
            sortOrder = 'asc',
            limit = 20,
            page = 1
        } = req.query;

        const query = { isAvailable: true };

        if (category) {
            query.category = category;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const menuItems = await MenuItemModel.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip)
            .select('-vendorId')
            .populate('vendorId', 'businessName')
            .populate('shopId', 'businessName address.city address.street');

        
        const processedMenuItems = menuItems.map(item => {
            const itemObj = item.toObject();
            
           
            if (!itemObj.image && (!itemObj.images || itemObj.images.length === 0)) {
                itemObj.image = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=🍽️+No+Image';
            }
            
           
            if (!itemObj.images || itemObj.images.length === 0) {
                itemObj.images = [itemObj.image || 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=🍽️+No+Image'];
            }
            
            return itemObj;
        });

        // Get total count for pagination
        const total = await MenuItemModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: processedMenuItems,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error("Get all menu items error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

