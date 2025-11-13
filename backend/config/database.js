import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect  = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        
        if (!dbURI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(dbURI);
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        throw error; // Re-throw to handle in server.js
    }
};
export { connect };