import { v2 as cloudinary } from 'cloudinary';
import resellRequestModel from '../models/M_resellRequestModel.js';
import resellItemModel from '../models/M_resellItemModel.js';

// Submit resell request
const submitResellRequest = async (req, res) => {
    try {
        const { 
            userId, 
            userName, 
            userEmail, 
            itemName, 
            description, 
            price, 
            category, 
            subCategory, 
            condition, 
            contactNumber 
        } = req.body;

        // Handle image uploads if any
        let imagesUrl = [];
        if (req.files && Object.keys(req.files).length > 0) {
            const imageFiles = Object.values(req.files).flat();
            imagesUrl = await Promise.all(
                imageFiles.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        const resellRequest = new resellRequestModel({
            userId,
            userName,
            userEmail,
            itemName,
            description,
            price: Number(price),
            category,
            subCategory,
            condition,
            contactNumber,
            images: imagesUrl,
            date: Date.now()
        });

        await resellRequest.save();

        res.json({ 
            success: true, 
            message: "Resell request submitted successfully",
            requestId: resellRequest._id
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all resell requests (admin only)
const getAllResellRequests = async (req, res) => {
    try {
        const requests = await resellRequestModel.find({}).sort({ date: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get resell requests by user
const getUserResellRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await resellRequestModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Approve resell request (admin only)
const approveResellRequest = async (req, res) => {
    try {
        const { requestId, adminNotes } = req.body;
        
        const request = await resellRequestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        // Update request status
        request.status = 'approved';
        request.adminNotes = adminNotes || '';
        await request.save();

        // Create resell item
        const resellItem = new resellItemModel({
            originalRequestId: request._id,
            userId: request.userId,
            userName: request.userName,
            userEmail: request.userEmail,
            itemName: request.itemName,
            description: request.description,
            price: request.price,
            category: request.category,
            subCategory: request.subCategory,
            condition: request.condition,
            contactNumber: request.contactNumber,
            images: request.images,
            date: Date.now()
        });

        await resellItem.save();

        res.json({ 
            success: true, 
            message: "Resell request approved and item listed",
            resellItemId: resellItem._id
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reject resell request (admin only)
const rejectResellRequest = async (req, res) => {
    try {
        const { requestId, adminNotes } = req.body;
        
        const request = await resellRequestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        request.status = 'rejected';
        request.adminNotes = adminNotes || '';
        await request.save();

        res.json({ 
            success: true, 
            message: "Resell request rejected"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all resell items
const getAllResellItems = async (req, res) => {
    try {
        const items = await resellItemModel.find({ isSold: false }).sort({ date: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get resell items by category
const getResellItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await resellItemModel.find({ 
            category, 
            isSold: false 
        }).sort({ date: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark resell item as sold
const markItemAsSold = async (req, res) => {
    try {
        const { itemId } = req.body;
        
        const item = await resellItemModel.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }

        item.isSold = true;
        await item.save();

        res.json({ 
            success: true, 
            message: "Item marked as sold"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    submitResellRequest, 
    getAllResellRequests, 
    getUserResellRequests,
    approveResellRequest, 
    rejectResellRequest, 
    getAllResellItems,
    getResellItemsByCategory,
    markItemAsSold
};
