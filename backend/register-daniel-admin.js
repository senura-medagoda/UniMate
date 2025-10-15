async function registerDanielAdmin() {
    try {
        console.log('Registering Daniel Admin via API...\n');

        const adminData = {
            jpa_fname: 'Daniel',
            jpa_lname: 'Johnson',
            jpa_email: 'daniel@unimate.com',
            jpa_password: 'B/@ck12345',
            jpa_workID: 'JPA003',
            jpa_phone: '9876543210',
            department: 'Job Portal Administration',
            position: 'Senior Job Portal Administrator',
            bio: 'Experienced administrator with 8+ years in job portal management. Specializes in hiring manager oversight and job posting quality control.'
        };

        const response = await fetch('http://localhost:5001/api/jpadmin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Daniel Admin registered successfully!');
            console.log('Admin details:');
            console.log('- ID:', result.data.admin.id);
            console.log('- Name:', result.data.admin.name);
            console.log('- Email:', result.data.admin.email);
            console.log('- Work ID:', result.data.admin.workID);
            console.log('- Status:', result.data.admin.status);
            console.log('- Department:', result.data.admin.department);
            console.log('- Position:', result.data.admin.position);
            console.log('- Token received:', result.data.token ? 'Yes' : 'No');
            
            console.log('\n🎉 Registration complete!');
            console.log('\nLogin credentials for testing:');
            console.log('- Email: daniel@unimate.com');
            console.log('- Password: B/@ck12345');
            console.log('- URL: http://localhost:5173/jpadmin-login');
        } else {
            console.log('❌ Registration failed:', result.message);
            if (result.errors) {
                console.log('Validation errors:', result.errors);
            }
        }

    } catch (error) {
        console.error('❌ Error registering admin:', error.message);
        console.log('\nMake sure the backend server is running on http://localhost:5001');
    }
}

registerDanielAdmin();

