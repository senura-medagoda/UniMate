import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/unimate';

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully!');
        
        // Test if we can access the database
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Connection test completed');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
