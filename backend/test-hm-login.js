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
    process.exit(1);
  }
};

const testHMLogin = async () => {
  try {
    await connectDB();
    
    console.log('\n🔍 Testing Hiring Manager Login...\n');
    
    // List all hiring managers
    const allHMs = await HiringManager.find({}).select('hm_email hm_fname hm_lname hm_status');
    console.log('📋 All Hiring Managers in database:');
    if (allHMs.length === 0) {
      console.log('❌ No hiring managers found in database');
      console.log('💡 You may need to register a hiring manager first');
      return;
    }
    
    allHMs.forEach((hm, index) => {
      console.log(`${index + 1}. Email: ${hm.hm_email}, Name: ${hm.hm_fname} ${hm.hm_lname}, Status: ${hm.hm_status}`);
    });
    
    // Test login with first HM
    const testEmail = allHMs[0].hm_email;
    console.log(`\n🧪 Testing login with: ${testEmail}`);
    
    // Find the HM
    const hm = await HiringManager.findOne({ hm_email: testEmail });
    if (!hm) {
      console.log('❌ HM not found');
      return;
    }
    
    console.log('✅ HM found in database');
    console.log(`📧 Email: ${hm.hm_email}`);
    console.log(`👤 Name: ${hm.hm_fname} ${hm.hm_lname}`);
    console.log(`📊 Status: ${hm.hm_status}`);
    console.log(`🔐 Has password: ${!!hm.hm_password}`);
    console.log(`📅 Last login: ${hm.lastLogin || 'Never'}`);
    console.log(`🔢 Login count: ${hm.loginCount || 0}`);
    
    // Test password (you'll need to provide the actual password)
    console.log('\n💡 To test password validation, you can:');
    console.log('1. Try logging in through the frontend');
    console.log('2. Check the backend console logs for password validation results');
    console.log('3. Make sure the password you\'re using matches what was set during registration');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testHMLogin();
