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

//// Get All Shops for Admin (Admin Dashboard)
export const getAllShopsForAdmin = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            status,
            approvalStatus,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Admin can see ALL shops (including inactive and pending)
        const query = {};

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by active status
        if (status) {
            query.isActive = status === 'active';
        }

        // Filter by approval status
        if (approvalStatus) {
            query.approvalStatus = approvalStatus;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const shops = await ShopModel.find(query)
            .populate('vendorId', 'businessName ownerName email phone')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ShopModel.countDocuments(query);

        // Get summary counts for admin dashboard
        const summary = {
            total: await ShopModel.countDocuments({}),
            active: await ShopModel.countDocuments({ isActive: true }),
            inactive: await ShopModel.countDocuments({ isActive: false }),
            approved: await ShopModel.countDocuments({ approvalStatus: 'approved' }),
            pending: await ShopModel.countDocuments({ approvalStatus: 'pending' }),
            rejected: await ShopModel.countDocuments({ approvalStatus: 'rejected' })
        };

        res.status(200).json({
            success: true,
            data: {
                shops,
                summary,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get all shops for admin error:", error);
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

/// Approve Shop (Admin only)
export const approveShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const adminId = req.adminId; // From adminAuth middleware

        const shop = await ShopModel.findByIdAndUpdate(
            shopId,
            {
                isApproved: true,
                approvalStatus: 'approved',
                approvedAt: new Date(),
                approvedBy: adminId,
                rejectionReason: '' // Clear any previous rejection reason
            },
            { new: true }
        ).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        // Send notification to vendor about shop approval
        try {
            await createAdminNotification(
                'shop_approved',
                'Shop Approved',
                `Your shop "${shop.businessName}" has been approved and is now visible to customers.`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: shop.vendorId._id,
                    vendorName: shop.vendorId.businessName || shop.vendorId.ownerName,
                    approvedAt: shop.approvedAt
                },
                'high',
                `/vendor/shop/dashboard`
            );
            console.log('Shop approval notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending shop approval notification:', notificationError);
            // Don't fail the approval if notification fails
        }

        res.status(200).json({
            success: true,
            message: "Shop approved successfully",
            data: shop
        });

    } catch (error) {
        console.error("Approve shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/// Reject Shop (Admin only)
export const rejectShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.adminId; // From adminAuth middleware

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const shop = await ShopModel.findByIdAndUpdate(
            shopId,
            {
                isApproved: false,
                approvalStatus: 'rejected',
                rejectionReason: rejectionReason.trim(),
                approvedBy: adminId
            },
            { new: true }
        ).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        // Send notification to vendor about shop rejection
        try {
            await createAdminNotification(
                'shop_rejected',
                'Shop Rejected',
                `Your shop "${shop.businessName}" has been rejected. Reason: ${rejectionReason}`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: shop.vendorId._id,
                    vendorName: shop.vendorId.businessName || shop.vendorId.ownerName,
                    rejectionReason: rejectionReason,
                    rejectedAt: new Date()
                },
                'high',
                `/vendor/shop/edit`
            );
            console.log('Shop rejection notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending shop rejection notification:', notificationError);
            // Don't fail the rejection if notification fails
        }

        res.status(200).json({
            success: true,
            message: "Shop rejected successfully",
            data: shop
        });

    } catch (error) {
        console.error("Reject shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/// Toggle Shop Active Status (Admin only)
export const toggleShopActiveStatus = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { isActive } = req.body;
        const adminId = req.adminId; // From adminAuth middleware

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "isActive field is required and must be a boolean"
            });
        }

        const shop = await ShopModel.findByIdAndUpdate(
            shopId,
            { isActive },
            { new: true }
        ).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        // Send notification to vendor about status change
        try {
            await createAdminNotification(
                isActive ? 'shop_activated' : 'shop_deactivated',
                isActive ? 'Shop Activated' : 'Shop Deactivated',
                `Your shop "${shop.businessName}" has been ${isActive ? 'activated' : 'deactivated'} by admin.`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: shop.vendorId._id,
                    vendorName: shop.vendorId.businessName || shop.vendorId.ownerName,
                    isActive: isActive,
                    changedAt: new Date()
                },
                'medium',
                `/vendor/shop/dashboard`
            );
            console.log(`Shop ${isActive ? 'activation' : 'deactivation'} notification sent successfully`);
        } catch (notificationError) {
            console.error('Error sending shop status notification:', notificationError);
            // Don't fail the status change if notification fails
        }

        res.status(200).json({
            success: true,
            message: `Shop ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                shopId: shop._id,
                businessName: shop.businessName,
                isActive: shop.isActive,
                vendor: shop.vendorId
            }
        });

    } catch (error) {
        console.error("Toggle shop active status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete Shop (Admin only)
export const deleteShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await ShopModel.findById(shopId);

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        // Delete the shop
        await ShopModel.findByIdAndDelete(shopId);

        res.status(200).json({
            success: true,
            message: "Shop deleted successfully"
        });

    } catch (error) {
        console.error("Delete shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Add Shop (Admin only) - Create shop for a vendor
export const addShop = async (req, res) => {
    try {
        console.log('Add shop request body:', req.body);
        const {
            vendorId,
            shopName,
            description,
            address,
            phone,
            email,
            openingHours,
            category
        } = req.body;

        // Validate required fields
        if (!vendorId || !shopName || !description || !address || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if vendor exists
        const VendorModel = (await import('../models/VendorModel.js')).default;
        const vendor = await VendorModel.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        // Check if vendor already has a shop
        const existingShop = await ShopModel.findOne({ vendorId });
        if (existingShop) {
            return res.status(400).json({
                success: false,
                message: "Vendor already has a shop"
            });
        }

        // Create new shop
        const shopData = {
            vendorId,
            businessName: shopName, // Map shopName to businessName for the model
            description,
            address: {
                street: address,
                city: 'Unknown' // Default city since frontend sends only address string
            },
            contactInfo: {
                phone,
                email
            },
            openingHours: openingHours ? (typeof openingHours === 'string' ? JSON.parse(openingHours) : openingHours) : {},
            category: category || 'General',
            isActive: true,
            isApproved: true,
            approvalStatus: 'approved' // Auto-approve admin-created shops
        };
        
        console.log('Creating shop with data:', shopData);
        const shop = new ShopModel(shopData);

        await shop.save();
        console.log('Shop saved successfully:', shop._id);

        res.status(201).json({
            success: true,
            message: "Shop added successfully",
            data: shop
        });

    } catch (error) {
        console.error("Add shop error:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors
            });
        }
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Rate Shop (Admin)
export const rateShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { rating, comment } = req.body;
        const adminId = req.adminId;

        console.log(`[RateShop] Attempting to rate shop: ${shopId} by admin: ${adminId} with rating: ${rating}, comment: ${comment}`);

        // Validate adminId
        if (!adminId) {
            console.error("[RateShop] Error: adminId is missing from request. Unauthorized access attempt.");
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Admin ID not found."
            });
        }

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            console.error(`[RateShop] Error: Invalid rating value: ${rating}. Rating must be between 1 and 5.`);
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find the shop
        const shop = await ShopModel.findById(shopId);
        if (!shop) {
            console.error(`[RateShop] Error: Shop not found with ID: ${shopId}`);
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }
        console.log(`[RateShop] Found shop: ${shop.businessName} (${shopId})`);

        // Initialize adminRatings array if it doesn't exist
        if (!shop.adminRatings) {
            shop.adminRatings = [];
        }

        // Check if admin has already rated this shop
        const existingRatingIndex = shop.adminRatings.findIndex(
            (r) => r.adminId.toString() === adminId.toString()
        );

        if (existingRatingIndex > -1) {
            // Update existing rating
            shop.adminRatings[existingRatingIndex].rating = rating;
            shop.adminRatings[existingRatingIndex].comment = comment || '';
            shop.adminRatings[existingRatingIndex].ratedAt = new Date();
            console.log(`[RateShop] Updated existing rating for shop ${shopId} by admin ${adminId}`);
        } else {
            // Add new rating
            shop.adminRatings.push({ 
                adminId: adminId, 
                rating: rating, 
                comment: comment || '',
                ratedAt: new Date()
            });
            console.log(`[RateShop] Added new rating for shop ${shopId} by admin ${adminId}`);
        }

        // Calculate new average rating from admin ratings only
        const totalRatings = shop.adminRatings.reduce((sum, r) => sum + r.rating, 0);
        shop.averageRating = shop.adminRatings.length > 0 ? totalRatings / shop.adminRatings.length : 0;
        shop.totalReviews = shop.adminRatings.length;
        
        console.log(`[RateShop] New average rating for shop ${shopId}: ${shop.averageRating}`);

        await shop.save();
        console.log(`[RateShop] Shop ${shopId} saved successfully after rating.`);

        // Try to create notification for vendor (with error handling)
        try {
            await createAdminNotification({
                type: 'shop_rated',
                title: 'Shop Rated',
                message: `Your shop "${shop.businessName}" has been rated ${rating} stars by admin`,
                recipientId: shop.vendorId,
                data: { shopId: shop._id, rating: rating }
            });
            console.log(`[RateShop] Notification sent to vendor ${shop.vendorId}`);
        } catch (notificationError) {
            console.warn(`[RateShop] Failed to send notification to vendor: ${notificationError.message}`);
            // Don't fail the entire operation if notification fails
        }

        res.status(200).json({
            success: true,
            message: "Shop rated successfully",
            data: {
                shopId: shop._id,
                averageRating: shop.averageRating,
                totalReviews: shop.totalReviews
            }
        });

    } catch (error) {
        console.error("[RateShop] CRITICAL ERROR rating shop:", error);
        console.error("[RateShop] Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

