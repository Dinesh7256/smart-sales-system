const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connect  = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
    }
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
    }
module.exports = { connect };