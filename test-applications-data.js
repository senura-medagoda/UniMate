// Test script to check applications data in database
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/UniMate');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('❌ MongoDB connection error:', error.message);
  }
}

// Test function to check applications
async function testApplications() {
  try {
    await connectDB();
    
    // Import models
    const JobApplication = require('./src/models/JobApplication.js').default;
    const Job = require('./src/models/Job.js').default;
    const Student = require('./src/models/Student.js').default;
    
    // Check if there are any applications
    const applicationCount = await JobApplication.countDocuments();
    console.log(`Total applications in database: ${applicationCount}`);
    
    if (applicationCount > 0) {
      // Get first application with populated data
      const application = await JobApplication.findOne()
        .populate('jobId', 'title department location status deadline')
        .populate('studentId', 's_fname s_lname s_email s_phone s_homeaddress s_uni s_faculty s_studyprogram s_gender s_dob s_status');
      
      console.log('First application data:');
      console.log(JSON.stringify(application, null, 2));
      
      console.log('\nStudent data:');
      console.log(JSON.stringify(application.studentId, null, 2));
    } else {
      console.log('No applications found in database');
      
      // Check if there are jobs and students
      const jobCount = await Job.countDocuments();
      const studentCount = await Student.countDocuments();
      
      console.log(`Jobs in database: ${jobCount}`);
      console.log(`Students in database: ${studentCount}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testApplications();
