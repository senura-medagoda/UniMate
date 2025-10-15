async function testJPAdminJobs() {
    try {
        console.log('Testing JP Admin Jobs Management...\n');

        // First, login as JP Admin to get token
        console.log('1. Logging in as JP Admin...');
        const loginResponse = await fetch('http://localhost:5001/api/jpadmin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jpa_email: 'daniel@unimate.com',
                jpa_password: 'B/@ck12345'
            })
        });

        const loginResult = await loginResponse.json();
        
        if (!loginResponse.ok || !loginResult.success) {
            console.log('❌ Login failed:', loginResult.message);
            return;
        }

        const token = loginResult.data.token;
        console.log('✅ Login successful, token received');

        // Test 2: Get all jobs for admin
        console.log('\n2. Testing get all jobs for admin...');
        const jobsResponse = await fetch('http://localhost:5001/api/job/admin/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const jobsResult = await jobsResponse.json();
        
        if (jobsResponse.ok && jobsResult.success) {
            console.log('✅ Jobs fetched successfully!');
            console.log(`Found ${jobsResult.data.length} jobs`);
            
            // Categorize jobs
            const pendingJobs = jobsResult.data.filter(job => job.status === 'pending');
            const liveJobs = jobsResult.data.filter(job => job.status === 'live');
            const archivedJobs = jobsResult.data.filter(job => job.status === 'archived' || job.status === 'rejected');
            
            console.log(`- Pending: ${pendingJobs.length}`);
            console.log(`- Live: ${liveJobs.length}`);
            console.log(`- Archived/Rejected: ${archivedJobs.length}`);
            
            // Test 3: Update job status (approve a pending job if available)
            if (pendingJobs.length > 0) {
                const jobToApprove = pendingJobs[0];
                console.log(`\n3. Testing approve job (${jobToApprove._id})...`);
                
                const approveResponse = await fetch(`http://localhost:5001/api/job/admin/${jobToApprove._id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'live' })
                });

                const approveResult = await approveResponse.json();
                
                if (approveResponse.ok && approveResult.success) {
                    console.log('✅ Job approved successfully!');
                    console.log(`Job status changed from ${jobToApprove.status} to ${approveResult.data.status}`);
                } else {
                    console.log('❌ Job approval failed:', approveResult.message);
                }
            } else {
                console.log('\n3. No pending jobs to approve');
            }

            // Test 4: Reject a job (if we have another pending job)
            if (pendingJobs.length > 1) {
                const jobToReject = pendingJobs[1];
                console.log(`\n4. Testing reject job (${jobToReject._id})...`);
                
                const rejectResponse = await fetch(`http://localhost:5001/api/job/admin/${jobToReject._id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'rejected' })
                });

                const rejectResult = await rejectResponse.json();
                
                if (rejectResponse.ok && rejectResult.success) {
                    console.log('✅ Job rejected successfully!');
                    console.log(`Job status changed from ${jobToReject.status} to ${rejectResult.data.status}`);
                } else {
                    console.log('❌ Job rejection failed:', rejectResult.message);
                }
            } else {
                console.log('\n4. No additional pending jobs to reject');
            }

            // Test 5: Test automatic archiving (check if any jobs have past deadlines)
            console.log('\n5. Testing automatic archiving...');
            const now = new Date();
            const jobsWithPastDeadlines = jobsResult.data.filter(job => 
                new Date(job.deadline) < now && 
                (job.status === 'live' || job.status === 'pending')
            );
            
            if (jobsWithPastDeadlines.length > 0) {
                console.log(`Found ${jobsWithPastDeadlines.length} jobs with past deadlines that should be archived`);
                console.log('These will be automatically archived on the next API call');
            } else {
                console.log('No jobs with past deadlines found');
            }

        } else {
            console.log('❌ Failed to fetch jobs:', jobsResult.message);
        }

        console.log('\n🎉 JP Admin Jobs Management Test Complete!');
        console.log('\nNext Steps:');
        console.log('1. Navigate to http://localhost:5173/jpadmin-jobs');
        console.log('2. Login with daniel@unimate.com / B/@ck12345');
        console.log('3. Test the approve, reject, and delete actions in the UI');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testJPAdminJobs();

