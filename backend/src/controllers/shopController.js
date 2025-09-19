import ShopModel from "../models/ShopModel.js";
import { v2 as cloudinary } from "cloudinary";
import { createAdminNotification } from "../services/notificationService.js";

//// Create Shop
export const createShop = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const shopData = req.body;

        // Parse JSON strings for nested objects
        if (shopData.address && typeof shopData.address === 'string') {
            shopData.address = JSON.parse(shopData.address);
        }
        if (shopData.contactInfo && typeof shopData.contactInfo === 'string') {
            shopData.contactInfo = JSON.parse(shopData.contactInfo);
        }
        if (shopData.openingHours && typeof shopData.openingHours === 'string') {
            shopData.openingHours = JSON.parse(shopData.openingHours);
        }

        console.log('Parsed shop data:', shopData);
        
        const existingShop = await ShopModel.findOne({ vendorId });

        if (existingShop) {
            return res.status(400).json({
                success: false,
                message: "Vendor already has a shop"
            });
        }

        
        if (req.files && req.files.logo && req.files.logo[0]) {
            try {
                // Check if Cloudinary is properly configured
                if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
                    !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
                    console.warn('⚠️  Cloudinary not properly configured - skipping image upload');
                    console.warn('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME);
                    console.warn('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
                    console.warn('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set');
                    
                    // Use local file storage as fallback
                    const fs = await import('fs');
                    const path = await import('path');
                    
                    // Create uploads directory if it doesn't exist
                    const uploadsDir = './uploads';
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    
                    // Generate unique filename
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const fileExtension = path.extname(req.files.logo[0].originalname);
                    const filename = `logo-${uniqueSuffix}${fileExtension}`;
                    const filepath = path.join(uploadsDir, filename);
                    
                    // Move file to uploads directory
                    fs.renameSync(req.files.logo[0].path, filepath);
                    
                    // Set the logo URL to the local file path
                    shopData.logo = `/uploads/${filename}`;
                    console.log('Logo saved locally:', shopData.logo);
                    
                    // Logo saved locally, continue with shop creation
                    console.log('ℹ️  Shop will be created with locally stored logo image');
                } else {
                    console.log('Uploading logo to Cloudinary...');
                    console.log('File path:', req.files.logo[0].path);
                    console.log('File size:', req.files.logo[0].size);
                    console.log('File mimetype:', req.files.logo[0].mimetype);

                    const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
                        folder: 'shop-logos',
                        width: 1200,
                        height: 400,
                        crop: "fill",
                        quality: "auto"
                    });
                    
                    shopData.logo = result.secure_url;
                    console.log('Logo uploaded successfully:', result.secure_url);
                    
                    // Clean up the temporary file
                    const fs = await import('fs');
                    try {
                        fs.unlinkSync(req.files.logo[0].path);
                        console.log('Temporary file cleaned up');
                    } catch (cleanupError) {
                        console.warn('Failed to clean up temporary file:', cleanupError.message);
                    }
                }
            } catch (uploadError) {
                console.error('Logo upload error:', uploadError);
                console.error('Error details:', {
                    message: uploadError.message,
                    http_code: uploadError.http_code,
                    name: uploadError.name
                });
                
                // Clean up the temporary file even if upload failed
                try {
                    const fs = await import('fs');
                    fs.unlinkSync(req.files.logo[0].path);
                } catch (cleanupError) {
                    console.warn('Failed to clean up temporary file after error:', cleanupError.message);
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload logo image",
                    error: uploadError.message || "Upload service error"
                });
            }
        }

        
        // Handle multiple images upload
        if (req.files && req.files.images && req.files.images.length > 0) {
            try {
                // Check if Cloudinary is properly configured
                if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
                    !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
                    console.warn('⚠️  Cloudinary not properly configured - using local storage for images');
                    
                    // Use local file storage as fallback
                    const fs = await import('fs');
                    const path = await import('path');
                    
                    // Create uploads directory if it doesn't exist
                    const uploadsDir = './uploads';
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    
                    const imageUrls = [];
                    for (const file of req.files.images) {
                        // Generate unique filename
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const fileExtension = path.extname(file.originalname);
                        const filename = `shop-image-${uniqueSuffix}${fileExtension}`;
                        const filepath = path.join(uploadsDir, filename);
                        
                        // Move file to uploads directory
                        fs.renameSync(file.path, filepath);
                        
                        // Add to images array
                        imageUrls.push(`/uploads/${filename}`);
                    }
                    
                    shopData.images = imageUrls;
                    console.log('Images saved locally:', shopData.images);
                } else {
                    console.log('Uploading images to Cloudinary...');
                    const imagePromises = req.files.images.map(file => 
                        cloudinary.uploader.upload(file.path, {
                            folder: 'shop-images',
                            width: 1200,
                            height: 400,
                            crop: "fill",
                            quality: "auto"
                        })
                    );
                    const imageResults = await Promise.all(imagePromises);
                    shopData.images = imageResults.map(result => result.secure_url);
                    console.log('Images uploaded successfully:', shopData.images);
                    
                    // Clean up temporary files
                    const fs = await import('fs');
                    for (const file of req.files.images) {
                        try {
                            fs.unlinkSync(file.path);
                        } catch (cleanupError) {
                            console.warn('Failed to clean up temporary file:', cleanupError.message);
                        }
                    }
                }
            } catch (uploadError) {
                console.error('Images upload error:', uploadError);
                
                // Clean up temporary files
                try {
                    const fs = await import('fs');
                    for (const file of req.files.images) {
                        fs.unlinkSync(file.path);
                    }
                } catch (cleanupError) {
                    console.warn('Failed to clean up temporary files after error:', cleanupError.message);
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload images",
                    error: uploadError.message || "Upload service error"
                });
            }
        }

        console.log('Creating shop with data:', {
            ...shopData,
            vendorId
        });

        const shop = new ShopModel({
            ...shopData,
            vendorId
        });

        await shop.save();
        console.log('Shop created successfully:', shop._id);

        // Send notification to admins about new shop pending approval
        console.log('Sending notification for new shop:', shop.businessName);
        try {
            await createAdminNotification(
                'shop_pending_approval',
                'New Shop Pending Approval',
                `A new shop "${shop.businessName}" has been created and is waiting for approval.`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: vendorId,
                    createdAt: shop.createdAt
                },
                'high',
                `/admin/shops?status=pending`
            );
            console.log('Notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
            // Don't fail the shop creation if notification fails
        }

        res.status(201).json({
            success: true,
            message: "Shop created successfully and is pending approval",
            data: shop
        });

    } catch (error) {
        console.error("Create shop error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Shop Details
export const getShopDetails = async (req, res) => {
    try {
        const vendorId = req.vendorId;

        const shop = await ShopModel.findOne({ vendorId }).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        console.log('Shop details being returned:', {
            id: shop._id,
            businessName: shop.businessName,
            logo: shop.logo,
            hasLogo: !!shop.logo
        });

        res.status(200).json({
            success: true,
            data: shop
        });

    } catch (error) {
        console.error("Get shop details error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Update Shop Details
export const updateShopDetails = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const updates = req.body;
        
        console.log('Update shop details request:', {
            vendorId,
            updates: Object.keys(updates),
            hasFiles: !!req.files,
            filesCount: req.files ? Object.keys(req.files).length : 0
        });
        
        // Parse JSON strings for nested objects with error handling
        try {
            if (updates.address) {
                if (typeof updates.address === 'string') {
                    updates.address = JSON.parse(updates.address);
                }
                // If it's already an object, keep it as is
            }
            if (updates.contactInfo) {
                if (typeof updates.contactInfo === 'string') {
                    updates.contactInfo = JSON.parse(updates.contactInfo);
                }
                // If it's already an object, keep it as is
            }
            if (updates.openingHours) {
                if (typeof updates.openingHours === 'string') {
                    updates.openingHours = JSON.parse(updates.openingHours);
                }
                // If it's already an object, keep it as is
            }
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
                error: "Failed to parse nested objects"
            });
        }

        // Handle logo upload
        if (req.files && req.files.logo && req.files.logo[0]) {
            try {
                // Check if Cloudinary is properly configured
                if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
                    !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
                    console.warn('⚠️  Cloudinary not properly configured - skipping image upload');
                    console.warn('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME);
                    console.warn('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
                    console.warn('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set');
                    
                    // Use local file storage as fallback
                    const fs = await import('fs');
                    const path = await import('path');
                    
                    // Create uploads directory if it doesn't exist
                    const uploadsDir = './uploads';
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    
                    // Generate unique filename
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const fileExtension = path.extname(req.files.logo[0].originalname);
                    const filename = `logo-${uniqueSuffix}${fileExtension}`;
                    const filepath = path.join(uploadsDir, filename);
                    
                    // Move file to uploads directory
                    fs.renameSync(req.files.logo[0].path, filepath);
                    
                    // Set the logo URL to the local file path
                    updates.logo = `/uploads/${filename}`;
                    console.log('Logo saved locally:', updates.logo);
                    
                    // Logo saved locally, continue with shop update
                    console.log('ℹ️  Shop will be updated with locally stored logo image');
                } else {
                    console.log('Uploading logo to Cloudinary...');
                    console.log('File path:', req.files.logo[0].path);
                    console.log('File size:', req.files.logo[0].size);
                    console.log('File mimetype:', req.files.logo[0].mimetype);

                    const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
                        folder: 'shop-logos',
                        width: 1200,
                        height: 400,
                        crop: "fill",
                        quality: "auto"
                    });
                    
                    updates.logo = result.secure_url;
                    console.log('Logo uploaded successfully:', result.secure_url);
                    
                    // Clean up the temporary file
                    const fs = await import('fs');
                    try {
                        fs.unlinkSync(req.files.logo[0].path);
                        console.log('Temporary file cleaned up');
                    } catch (cleanupError) {
                        console.warn('Failed to clean up temporary file:', cleanupError.message);
                    }
                }
            } catch (uploadError) {
                console.error('Logo upload error:', uploadError);
                console.error('Error details:', {
                    message: uploadError.message,
                    http_code: uploadError.http_code,
                    name: uploadError.name
                });
                
                // Clean up the temporary file even if upload failed
                try {
                    const fs = await import('fs');
                    fs.unlinkSync(req.files.logo[0].path);
                } catch (cleanupError) {
                    console.warn('Failed to clean up temporary file after error:', cleanupError.message);
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload logo image",
                    error: uploadError.message || "Upload service error"
                });
            }
        }

      
        // Handle multiple images upload
        if (req.files && req.files.images && req.files.images.length > 0) {
            try {
                // Check if Cloudinary is properly configured
                if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'demo' || 
                    !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
                    console.warn('⚠️  Cloudinary not properly configured - using local storage for images');
                    
                    // Use local file storage as fallback
                    const fs = await import('fs');
                    const path = await import('path');
                    
                    // Create uploads directory if it doesn't exist
                    const uploadsDir = './uploads';
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    
                    const imageUrls = [];
                    for (const file of req.files.images) {
                        // Generate unique filename
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const fileExtension = path.extname(file.originalname);
                        const filename = `shop-image-${uniqueSuffix}${fileExtension}`;
                        const filepath = path.join(uploadsDir, filename);
                        
                        // Move file to uploads directory
                        fs.renameSync(file.path, filepath);
                        
                        // Add to images array
                        imageUrls.push(`/uploads/${filename}`);
                    }
                    
                    updates.images = imageUrls;
                    console.log('Images saved locally:', updates.images);
                } else {
                    console.log('Uploading images to Cloudinary...');
                    const imagePromises = req.files.images.map(file => 
                        cloudinary.uploader.upload(file.path, {
                            folder: 'shop-images',
                            width: 1200,
                            height: 400,
                            crop: "fill",
                            quality: "auto"
                        })
                    );
                    const imageResults = await Promise.all(imagePromises);
                    updates.images = imageResults.map(result => result.secure_url);
                    console.log('Images uploaded successfully:', updates.images);
                    
                    // Clean up temporary files
                    const fs = await import('fs');
                    for (const file of req.files.images) {
                        try {
                            fs.unlinkSync(file.path);
                        } catch (cleanupError) {
                            console.warn('Failed to clean up temporary file:', cleanupError.message);
                        }
                    }
                }
            } catch (uploadError) {
                console.error('Images upload error:', uploadError);
                
                // Clean up temporary files
                try {
                    const fs = await import('fs');
                    for (const file of req.files.images) {
                        fs.unlinkSync(file.path);
                    }
                } catch (cleanupError) {
                    console.warn('Failed to clean up temporary files after error:', cleanupError.message);
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload images",
                    error: uploadError.message || "Upload service error"
                });
            }
        }

        console.log('Updating shop with data:', updates);
        
        // Validate required fields before updating
        const requiredFields = ['businessName', 'description', 'address', 'contactInfo'];
        const missingFields = requiredFields.filter(field => !updates[field]);
        
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                error: `Required fields missing: ${missingFields.join(', ')}`
            });
        }
        
        // Validate nested objects
        if (updates.address && (!updates.address.street || !updates.address.city)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address data",
                error: "Address must include street and city"
            });
        }
        
        if (updates.contactInfo && (!updates.contactInfo.email || !updates.contactInfo.phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact information",
                error: "Contact info must include email and phone"
            });
        }
        
        const shop = await ShopModel.findOneAndUpdate(
            { vendorId },
            updates,
            { new: true, runValidators: true }
        );

        if (!shop) {
            console.error('Shop not found for vendor:', vendorId);
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        console.log('Shop updated successfully:', shop._id);
        res.status(200).json({
            success: true,
            message: "Shop updated successfully",
            data: shop
        });

    } catch (error) {
        console.error("Update shop details error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "Unknown error occurred"
        });
    }
};

//// Update Opening Hours
export const updateOpeningHours = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const { openingHours } = req.body;

        const shop = await ShopModel.findOneAndUpdate(
            { vendorId },
            { openingHours },
            { new: true, runValidators: true }
        );

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Opening hours updated successfully",
            data: shop.openingHours
        });

    } catch (error) {
        console.error("Update opening hours error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Toggle Shop Status
export const toggleShopStatus = async (req, res) => {
    try {
        const vendorId = req.vendorId;
        const { isOpen } = req.body;

        const shop = await ShopModel.findOneAndUpdate(
            { vendorId },
            { isOpen },
            { new: true }
        );

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Shop ${isOpen ? 'opened' : 'closed'} successfully`,
            data: { isOpen: shop.isOpen }
        });

    } catch (error) {
        console.error("Toggle shop status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Shop Statistics
export const getShopStatistics = async (req, res) => {
    try {
        const vendorId = req.vendorId;

        const shop = await ShopModel.findOne({ vendorId });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        const statistics = {
            averageRating: shop.averageRating,
            totalReviews: shop.totalReviews,
            totalOrders: shop.totalOrders,
            totalRevenue: shop.totalRevenue,
            isOpen: shop.isOpen,
            isActive: shop.isActive
        };

        res.status(200).json({
            success: true,
            data: statistics
        });

    } catch (error) {
        console.error("Get shop statistics error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get All Shops (Public)
export const getAllShops = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            cuisineType, 
            city,
            isOpen,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;

        const query = { isActive: true, isApproved: true };

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }

        if (cuisineType) {
            query.cuisineType = cuisineType;
        }

        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        if (isOpen !== undefined) {
            query.isOpen = isOpen === 'true';
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const shops = await ShopModel.find(query)
            .populate('vendorId', 'businessName ownerName')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ShopModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                shops,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get all shops error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Shop by ID (Public)
export const getShopById = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await ShopModel.findById(shopId)
            .populate('vendorId', 'businessName ownerName email phone');

        if (!shop || !shop.isActive) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        res.status(200).json({
            success: true,
            data: shop
        });

    } catch (error) {
        console.error("Get shop by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

