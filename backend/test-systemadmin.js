// Test script for SystemAdmin addSA endpoint
// Run this with: node test-systemadmin.js

const testData = {
    sa_fname: "John",
    sa_lname: "Doe", 
    sa_email: "john.doe@example.com",
    sa_password: "password123",
    sa_NIC: "123456789V",
    sa_phone: "0771234567"
};

const testAddSA = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/SystemAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));
        
        if (response.ok) {
            console.log('✅ System Admin created successfully!');
        } else {
            console.log('❌ Error creating System Admin');
        }
        
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
};

// Test with missing required fields
const testValidation = async () => {
    console.log('\n--- Testing validation with missing fields ---');
    try {
        const response = await fetch('http://localhost:5000/api/SystemAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sa_fname: "Jane",
                // Missing sa_lname, sa_email, sa_password
            })
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
};

// Test with invalid email
const testInvalidEmail = async () => {
    console.log('\n--- Testing validation with invalid email ---');
    try {
        const response = await fetch('http://localhost:5000/api/SystemAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sa_fname: "Jane",
                sa_lname: "Smith",
                sa_email: "invalid-email",
                sa_password: "password123"
            })
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
};

// Run all tests
const runTests = async () => {
    console.log('🚀 Testing SystemAdmin addSA endpoint...\n');
    
    await testAddSA();
    await testValidation();
    await testInvalidEmail();
    
    console.log('\n✅ All tests completed!');
};

runTests();

