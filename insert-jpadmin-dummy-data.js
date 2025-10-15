import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JPAdmin Schema (matching the backend model)
const jpAdminSchema = new mongoose.Schema(
    {
        jpa_fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"]
        },
        jpa_lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },
        jpa_email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        jpa_password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        jpa_workID: {
            type: String,
            required: [true, "Work ID is required"],
            trim: true,
            unique: true,
            maxlength: [50, "Work ID cannot exceed 50 characters"]
        },
        jpa_phone: {
            type: String,
            required: false,
            trim: true,
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
        },
        jpa_status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended", "Banned"],
            default: "Active"
        },
        lastLogin: {
            type: Date
        },
        loginCount: {
            type: Number,
            default: 0
        },
        profilePicture: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },
        department: {
            type: String,
            trim: true,
            maxlength: [100, "Department cannot exceed 100 characters"]
        },
        position: {
            type: String,
            trim: true,
            maxlength: [100, "Position cannot exceed 100 characters"]
        }
    }, 
    { timestamps: true }
);

// Hash password before saving
jpAdminSchema.pre('save', async function(next) {
    if (!this.isModified('jpa_password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.jpa_password = await bcrypt.hash(this.jpa_password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const JPAdmin = mongoose.model("JPAdmin", jpAdminSchema);

async function insertDummyData() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unimate';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await JPAdmin.findOne({ jpa_email: 'daniel@unimate.com' });
        if (existingAdmin) {
            console.log('ℹ️ Admin with email daniel@unimate.com already exists');
            console.log('Admin details:');
            console.log('- ID:', existingAdmin._id);
            console.log('- Name:', `${existingAdmin.jpa_fname} ${existingAdmin.jpa_lname}`);
            console.log('- Email:', existingAdmin.jpa_email);
            console.log('- Work ID:', existingAdmin.jpa_workID);
            console.log('- Status:', existingAdmin.jpa_status);
            console.log('- Department:', existingAdmin.department);
            console.log('- Position:', existingAdmin.position);
            return;
        }

        // Create dummy JP Admin data
        const dummyAdmin = new JPAdmin({
            jpa_fname: 'Daniel',
            jpa_lname: 'Johnson',
            jpa_email: 'daniel@unimate.com',
            jpa_password: 'B/@ck12345',
            jpa_workID: 'JPA003',
            jpa_phone: '9876543210',
            jpa_status: 'Active',
            department: 'Job Portal Administration',
            position: 'Senior Job Portal Administrator',
            bio: 'Experienced administrator with 8+ years in job portal management. Specializes in hiring manager oversight and job posting quality control.',
            loginCount: 0
        });

        // Save to database
        await dummyAdmin.save();
        console.log('✅ JP Admin dummy data inserted successfully!');
        console.log('Admin details:');
        console.log('- ID:', dummyAdmin._id);
        console.log('- Name:', `${dummyAdmin.jpa_fname} ${dummyAdmin.jpa_lname}`);
        console.log('- Email:', dummyAdmin.jpa_email);
        console.log('- Work ID:', dummyAdmin.jpa_workID);
        console.log('- Status:', dummyAdmin.jpa_status);
        console.log('- Department:', dummyAdmin.department);
        console.log('- Position:', dummyAdmin.position);
        console.log('- Bio:', dummyAdmin.bio);
        console.log('- Password hashed:', dummyAdmin.jpa_password ? 'Yes' : 'No');

        // Test login credentials
        console.log('\n🧪 Testing login credentials...');
        const testAdmin = await JPAdmin.findOne({ jpa_email: 'daniel@unimate.com' });
        if (testAdmin) {
            const isPasswordValid = await bcrypt.compare('B/@ck12345', testAdmin.jpa_password);
            console.log('✅ Password verification successful:', isPasswordValid);
        }

        console.log('\n🎉 Dummy data insertion complete!');
        console.log('\nLogin credentials for testing:');
        console.log('- Email: daniel@unimate.com');
        console.log('- Password: B/@ck12345');
        console.log('- URL: http://localhost:5173/jpadmin-login');

    } catch (error) {
        console.error('❌ Error inserting dummy data:', error.message);
        if (error.code === 11000) {
            console.log('ℹ️ Duplicate key error - admin might already exist');
        }
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

insertDummyData();

