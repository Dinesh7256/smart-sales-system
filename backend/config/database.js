import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect  = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};
export { connect };