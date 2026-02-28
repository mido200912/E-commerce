const mongoose = require('mongoose');

// Cache the database connection in serverless environments
let cachedDb = null;

const connectDB = async () => {
    // If we have a cached connection, use it
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('⚡ Using cached MongoDB connection');
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // timeout after 5s instead of default 30s
        });

        cachedDb = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            cachedDb = null;
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
