const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const VendorModel = require('./src/models/VendorModel.js').default;

async function testVendorApprovalRefresh() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unimate');
        console.log('✅ Connected to MongoDB');

        // Find a vendor with pending status
        const pendingVendor = await VendorModel.findOne({ approvalStatus: 'pending' });
        
        if (!pendingVendor) {
            console.log('❌ No pending vendors found');
            return;
        }

        console.log('📋 Found pending vendor:', {
            id: pendingVendor._id,
            businessName: pendingVendor.businessName,
            email: pendingVendor.email,
            approvalStatus: pendingVendor.approvalStatus
        });

        // Approve the vendor
        pendingVendor.approvalStatus = 'approved';
        pendingVendor.isApproved = true;
        pendingVendor.approvedAt = new Date();
        await pendingVendor.save();

        console.log('✅ Vendor approved successfully');

        // Verify the approval
        const updatedVendor = await VendorModel.findById(pendingVendor._id);
        console.log('🔍 Updated vendor status:', {
            id: updatedVendor._id,
            businessName: updatedVendor.businessName,
            approvalStatus: updatedVendor.approvalStatus,
            isApproved: updatedVendor.isApproved,
            approvedAt: updatedVendor.approvedAt
        });

        console.log('✅ Test completed successfully!');
        console.log('💡 Now test the vendor dashboard - it should show "Account Approved" status');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

testVendorApprovalRefresh();
