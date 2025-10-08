import mongoose from "mongoose";

const resellRequestSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    condition: { type: String, required: true }, 
    contactNumber: { type: String, required: true },
    images: { type: Array, default: [] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String, default: '' },
    date: { type: Number, required: true }
});

const resellRequestModel = mongoose.models.resellRequest || mongoose.model("resellRequest", resellRequestSchema);

export default resellRequestModel;
