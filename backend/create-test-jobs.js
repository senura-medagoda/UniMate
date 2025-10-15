import mongoose from 'mongoose';
import Job from './src/models/Job.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimate';

async function createTestJobs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing jobs (optional - remove this if you want to keep existing jobs)
        await Job.deleteMany({});
        console.log('🗑️ Cleared existing jobs');

        // Create test jobs
        const testJobs = [
            {
                title: "Senior Software Engineer",
                department: "Engineering",
                jobtype: "Full-time",
                location: "San Francisco, CA",
                compensation: "$120,000 - $150,000",
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                description: "We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining our core platform.",
                requirements: "Bachelor's degree in Computer Science, 5+ years of experience with React, Node.js, and MongoDB",
                responsibilities: "Design and implement new features, mentor junior developers, participate in code reviews",
                benefits: "Health insurance, 401k matching, flexible work hours, remote work options",
                status: "pending",
                postedby: "john.doe@techcorp.com"
            },
            {
                title: "Marketing Manager",
                department: "Marketing",
                jobtype: "Full-time",
                location: "New York, NY",
                compensation: "$80,000 - $100,000",
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
                description: "Join our marketing team as a Marketing Manager to drive growth and brand awareness.",
                requirements: "Bachelor's degree in Marketing or related field, 3+ years of digital marketing experience",
                responsibilities: "Develop marketing strategies, manage social media campaigns, analyze marketing metrics",
                benefits: "Health insurance, dental coverage, paid time off, professional development budget",
                status: "live",
                postedby: "sarah.smith@techcorp.com"
            },
            {
                title: "Data Analyst",
                department: "Analytics",
                jobtype: "Part-time",
                location: "Remote",
                compensation: "$50,000 - $70,000",
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
                description: "We need a Data Analyst to help us make data-driven decisions and improve our business processes.",
                requirements: "Bachelor's degree in Statistics, Mathematics, or related field, experience with SQL and Python",
                responsibilities: "Analyze business data, create reports and dashboards, provide insights to stakeholders",
                benefits: "Flexible schedule, remote work, health insurance",
                status: "pending",
                postedby: "mike.johnson@techcorp.com"
            },
            {
                title: "UX Designer",
                department: "Design",
                jobtype: "Full-time",
                location: "Austin, TX",
                compensation: "$90,000 - $110,000",
                deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
                description: "Join our design team to create amazing user experiences for our products.",
                requirements: "Bachelor's degree in Design or related field, 4+ years of UX/UI design experience, proficiency in Figma",
                responsibilities: "Design user interfaces, conduct user research, create wireframes and prototypes",
                benefits: "Health insurance, 401k, unlimited PTO, design software licenses",
                status: "live",
                postedby: "emma.wilson@techcorp.com"
            },
            {
                title: "Product Manager",
                department: "Product",
                jobtype: "Full-time",
                location: "Seattle, WA",
                compensation: "$130,000 - $160,000",
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
                description: "Lead product development initiatives and work with cross-functional teams to deliver exceptional products.",
                requirements: "MBA or Bachelor's degree in Business/Engineering, 6+ years of product management experience",
                responsibilities: "Define product roadmap, work with engineering and design teams, analyze market trends",
                benefits: "Health insurance, stock options, flexible work arrangements, professional development",
                status: "pending",
                postedby: "alex.brown@techcorp.com"
            },
            {
                title: "Customer Success Manager",
                department: "Customer Success",
                jobtype: "Full-time",
                location: "Chicago, IL",
                compensation: "$70,000 - $90,000",
                deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (should be archived)
                description: "Help our customers achieve success with our platform and build strong relationships.",
                requirements: "Bachelor's degree, 2+ years of customer success or account management experience",
                responsibilities: "Onboard new customers, provide ongoing support, identify upsell opportunities",
                benefits: "Health insurance, dental coverage, performance bonuses",
                status: "live",
                postedby: "lisa.garcia@techcorp.com"
            }
        ];

        console.log('Creating test jobs...');
        const createdJobs = await Job.insertMany(testJobs);
        console.log(`✅ Created ${createdJobs.length} test jobs`);

        // Display summary
        const pendingJobs = createdJobs.filter(job => job.status === 'pending');
        const liveJobs = createdJobs.filter(job => job.status === 'live');
        const archivedJobs = createdJobs.filter(job => job.status === 'archived');

        console.log('\n📊 Job Summary:');
        console.log(`- Pending: ${pendingJobs.length}`);
        console.log(`- Live: ${liveJobs.length}`);
        console.log(`- Archived: ${archivedJobs.length}`);
        console.log(`- Total: ${createdJobs.length}`);

        console.log('\n🎉 Test jobs created successfully!');
        console.log('\nNext Steps:');
        console.log('1. Start the backend server: npm start');
        console.log('2. Navigate to http://localhost:5173/jpadmin-jobs');
        console.log('3. Login with daniel@unimate.com / B/@ck12345');
        console.log('4. You should now see job listings in the JP Admin interface');

    } catch (error) {
        console.error('❌ Error creating test jobs:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

createTestJobs();
