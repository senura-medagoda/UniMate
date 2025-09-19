import mongoose from "mongoose";

const resellItemSchema = new mongoose.Schema({
    originalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'resellRequest', required: true },
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
    isSold: { type: Boolean, default: false },
    date: { type: Number, required: true }
});

const resellItemModel = mongoose.models.resellItem || mongoose.model("resellItem", resellItemSchema);

export default resellItemModel;
