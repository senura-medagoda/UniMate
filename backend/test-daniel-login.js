async function testDanielLogin() {
    try {
        console.log('Testing Daniel Admin Login...\n');

        const loginData = {
            jpa_email: 'daniel@unimate.com',
            jpa_password: 'B/@ck12345'
        };

        const response = await fetch('http://localhost:5001/api/jpadmin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Daniel Admin login successful!');
            console.log('Admin details:');
            console.log('- ID:', result.data.admin.id);
            console.log('- Name:', result.data.admin.name);
            console.log('- Email:', result.data.admin.email);
            console.log('- Work ID:', result.data.admin.workID);
            console.log('- Status:', result.data.admin.status);
            console.log('- Department:', result.data.admin.department);
            console.log('- Position:', result.data.admin.position);
            console.log('- Last Login:', result.data.admin.lastLogin);
            console.log('- Token received:', result.data.token ? 'Yes' : 'No');
            
            console.log('\n🎉 Login test successful!');
            console.log('\nYou can now use these credentials:');
            console.log('- Email: daniel@unimate.com');
            console.log('- Password: B/@ck12345');
            console.log('- URL: http://localhost:5173/jpadmin-login');
        } else {
            console.log('❌ Login failed:', result.message);
        }

    } catch (error) {
        console.error('❌ Error testing login:', error.message);
    }
}

testDanielLogin();

