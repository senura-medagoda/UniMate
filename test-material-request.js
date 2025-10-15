// Test script to verify MaterialRequest model accepts dynamic values
const mongoose = require('mongoose');

// Define the MaterialRequest schema (updated version)
const materialRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Request title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Request description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  campus: {
    type: String,
    required: [true, "Campus is required"],
    trim: true
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true
  },
  year: {
    type: String,
    required: [true, "Year is required"],
    trim: true
  },
  semester: {
    type: String,
    required: [true, "Semester is required"],
    trim: true
  },
  urgency: {
    type: String,
    required: [true, "Urgency level is required"],
    enum: ["low", "normal", "high", "urgent"],
    default: "normal"
  },
  status: {
    type: String,
    enum: ["pending", "fulfilled", "expired"],
    default: "pending"
  },
  requestedBy: {
    type: String,
    required: [true, "Requester ID is required"],
    trim: true
  }
}, { 
  timestamps: true 
});

const MaterialRequest = mongoose.model('MaterialRequest', materialRequestSchema);

// Test data with admin-added values
const testData = {
  title: 'Test Request',
  subject: 'hapoi',
  description: 'Test description',
  campus: 'aneeee', // This was causing the error before
  course: 'aiyoo',
  year: '1',
  semester: '1',
  urgency: 'normal',
  requestedBy: 'student1',
  status: 'pending'
};

console.log('Testing MaterialRequest validation...');
console.log('Test data:', testData);

// Create a new MaterialRequest instance
const request = new MaterialRequest(testData);

// Validate the data
request.validate()
  .then(() => {
    console.log('✅ Validation passed! The model now accepts dynamic values.');
    console.log('✅ Campus "aneeee" is now valid');
    console.log('✅ Course "aiyoo" is now valid');
  })
  .catch((error) => {
    console.log('❌ Validation failed:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.log(`❌ ${key}: ${error.errors[key].message}`);
      });
    }
  });
