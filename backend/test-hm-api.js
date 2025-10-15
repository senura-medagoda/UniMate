async function testHMLogin() {
    try {
        console.log('🧪 Testing HM Login API...\n');

        // First, let's create a test HM account
        console.log('🔧 Creating test HM account...');
        const createResponse = await fetch('http://localhost:5001/api/hm/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hm_email: 'test@hm.com',
                hm_password: 'Test123!',
                hm_fname: 'Test',
                hm_lname: 'Manager',
                hm_phone: '1234567890',
                hm_company: 'Test Company',
                hm_position: 'HR Manager'
            })
        });

        const createResult = await createResponse.json();
        console.log('📥 Create Response:', createResult);

        // Test credentials
        const loginData = {
            hm_email: 'test@hm.com',
            hm_password: 'Test123!'
        };

        console.log('📤 Sending login request...');
        console.log('📧 Email:', loginData.hm_email);
        console.log('🔐 Password:', loginData.hm_password);

        const response = await fetch('http://localhost:5001/api/hm/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log('\n📥 Response Status:', response.status);
        console.log('📥 Response OK:', response.ok);

        const result = await response.json();
        console.log('📥 Response Data:', JSON.stringify(result, null, 2));

        if (response.ok && result.success) {
            console.log('\n✅ HM Login successful!');
            console.log('👤 HM details:');
            console.log('- ID:', result.data.hm.id);
            console.log('- Name:', result.data.hm.hm_fname, result.data.hm.hm_lname);
            console.log('- Email:', result.data.hm.hm_email);
            console.log('- Company:', result.data.hm.hm_company);
            console.log('- Status:', result.data.hm.hm_status);
            console.log('- Last Login:', result.data.hm.lastLogin);
            console.log('- Token received:', result.data.token ? 'Yes' : 'No');
            
            console.log('\n🎉 Login test successful!');
            console.log('\nYou can now use these credentials:');
            console.log('- Email: test@hm.com');
            console.log('- Password: Test123!');
            console.log('- URL: http://localhost:5173/hm/login');
        } else {
            console.log('\n❌ Login failed:', result.message);
            console.log('💡 Make sure:');
            console.log('1. Backend server is running on port 5001');
            console.log('2. MongoDB is running');
            console.log('3. Test HM account exists in database');
        }

    } catch (error) {
        console.error('\n❌ Error testing login:', error.message);
        console.log('💡 Make sure backend server is running on port 5001');
    }
}

// Test with different credentials
async function testMultipleCredentials() {
    console.log('🧪 Testing multiple HM credentials...\n');
    
    const testCredentials = [
        { email: 'test@hm.com', password: 'Test123!' },
        { email: 'admin@hm.com', password: 'admin123' },
        { email: 'manager@hm.com', password: 'manager123' },
        { email: 'hr@hm.com', password: 'hr123' }
    ];
    
    for (const cred of testCredentials) {
        console.log(`\n🔍 Testing: ${cred.email}`);
        try {
            const response = await fetch('http://localhost:5001/api/hm/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hm_email: cred.email, hm_password: cred.password })
            });
            
            const result = await response.json();
            if (response.ok && result.success) {
                console.log(`✅ SUCCESS: ${cred.email}`);
                console.log(`👤 Name: ${result.data.hm.hm_fname} ${result.data.hm.hm_lname}`);
                console.log(`🏢 Company: ${result.data.hm.hm_company}`);
                return; // Found working credentials
            } else {
                console.log(`❌ FAILED: ${result.message}`);
            }
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
    }
    
    console.log('\n💡 No working credentials found. You may need to:');
    console.log('1. Create a test HM account');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify backend server is running');
}

// Run tests
console.log('🚀 Starting HM Login Tests...\n');
testHMLogin().then(() => {
    console.log('\n' + '='.repeat(50));
    testMultipleCredentials();
});
