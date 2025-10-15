import mongoose from 'mongoose';
import HiringManager from './src/models/HiringManager.js';
import bcrypt from 'bcryptjs';

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unimate');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Make sure MongoDB is running or use MongoDB Atlas');
    process.exit(1);
  }
};

const createTestHM = async () => {
  try {
    await connectDB();
    
    console.log('\n🔧 Creating Test Hiring Manager...\n');
    
    // Check if HM already exists
    const existingHM = await HiringManager.findOne({ hm_email: 'test@hm.com' });
    if (existingHM) {
      console.log('✅ Test HM already exists!');
      console.log('📧 Email: test@hm.com');
      console.log('🔐 Password: Test123!');
      console.log('👤 Name:', existingHM.hm_fname, existingHM.hm_lname);
      console.log('📊 Status:', existingHM.hm_status);
      return;
    }
    
    // Create test HM
    const testHM = new HiringManager({
      hm_email: 'test@hm.com',
      hm_password: 'Test123!',
      hm_fname: 'Test',
      hm_lname: 'Manager',
      hm_phone: '1234567890',
      hm_company: 'Test Company',
      hm_position: 'HR Manager',
      hm_status: 'active',
      hm_verified: true,
      lastLogin: null,
      loginCount: 0
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    testHM.hm_password = await bcrypt.hash(testHM.hm_password, salt);
    
    await testHM.save();
    
    console.log('✅ Test HM created successfully!');
    console.log('📧 Email: test@hm.com');
    console.log('🔐 Password: Test123!');
    console.log('👤 Name: Test Manager');
    console.log('🏢 Company: Test Company');
    console.log('📊 Status: active');
    console.log('\n🎉 You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error creating test HM:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

createTestHM();
