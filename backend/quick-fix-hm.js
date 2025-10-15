// Quick fix for HM login - Create a simple test account
import mongoose from 'mongoose';
import HiringManager from './src/models/HiringManager.js';
import bcrypt from 'bcryptjs';

// Try to connect to MongoDB Atlas or local
const connectDB = async () => {
  try {
    // Try local first
    await mongoose.connect('mongodb://localhost:27017/unimate');
    console.log('✅ Connected to local MongoDB');
    return true;
  } catch (error) {
    console.log('❌ Local MongoDB failed, trying Atlas...');
    try {
      // Try Atlas with a public connection string
      await mongoose.connect('mongodb+srv://unimate:unimate123@cluster0.mongodb.net/unimate?retryWrites=true&w=majority');
      console.log('✅ Connected to MongoDB Atlas');
      return true;
    } catch (atlasError) {
      console.log('❌ MongoDB Atlas failed:', atlasError.message);
      return false;
    }
  }
};

const createQuickTestHM = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.log('❌ Cannot connect to any database');
      console.log('💡 Please start MongoDB locally or check internet connection');
      return;
    }
    
    console.log('\n🔧 Creating Quick Test HM Account...\n');
    
    // Check if test HM exists
    let testHM = await HiringManager.findOne({ hm_email: 'test@hm.com' });
    
    if (testHM) {
      console.log('✅ Test HM already exists!');
      console.log('📧 Email: test@hm.com');
      console.log('🔐 Password: Test123!');
      console.log('👤 Name:', testHM.hm_fname, testHM.hm_lname);
      console.log('📊 Status:', testHM.hm_status);
    } else {
      // Create new test HM
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      
      testHM = new HiringManager({
        hm_email: 'test@hm.com',
        hm_password: hashedPassword,
        hm_fname: 'Test',
        hm_lname: 'Manager',
        hm_phone: '1234567890',
        hm_company: 'Test Company',
        hm_company_address: '123 Test Street, Test City, Test Country',
        hm_workID: 'HM001',
        hm_NIC: '123456789V',
        position: 'HR Manager',
        hm_status: 'Verified',
        proof_document: 'test-document.pdf',
        proof_document_original_name: 'test-document.pdf',
        lastLogin: null,
        loginCount: 0
      });
      
      await testHM.save();
      console.log('✅ Test HM created successfully!');
      console.log('📧 Email: test@hm.com');
      console.log('🔐 Password: Test123!');
      console.log('👤 Name: Test Manager');
      console.log('🏢 Company: Test Company');
    }
    
    console.log('\n🎉 You can now login with:');
    console.log('📧 Email: test@hm.com');
    console.log('🔐 Password: Test123!');
    console.log('🌐 URL: http://localhost:5173/hm/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
};

createQuickTestHM();
