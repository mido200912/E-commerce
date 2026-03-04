// ============================
// Admin Reset Script
// Run: node reset-admin.js
// ============================
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function resetAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        // Delete ALL existing admins
        const deleted = await Admin.deleteMany({});
        console.log(`🗑️  Deleted ${deleted.deletedCount} existing admin(s)`);

        // Create fresh admin from .env
        const email = process.env.ADMIN_EMAIL || 'admin@rahhalah.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        const admin = await Admin.create({
            email,
            password,
            role: 'super_admin'
        });

        console.log('');
        console.log('✅ Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email:    ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('👉 Now go to http://localhost:5173/admin/login and use these credentials.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

resetAdmin();
