const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Theme Colors - Light Theme
    primaryGold: {
        type: String,
        default: '#C9A961'
    },
    secondaryGold: {
        type: String,
        default: '#B8935E'
    },
    accentGold: {
        type: String,
        default: '#D4AF37'
    },

    // Background Colors
    bgPrimary: {
        type: String,
        default: '#FFFFFF'
    },
    bgSecondary: {
        type: String,
        default: '#F8F7F4'
    },
    bgTertiary: {
        type: String,
        default: '#F5F3EF'
    },

    // Text Colors
    textPrimary: {
        type: String,
        default: '#1A1A1A'
    },
    textSecondary: {
        type: String,
        default: '#4A4A4A'
    },
    textMuted: {
        type: String,
        default: '#8B8B8B'
    },

    // Border Colors
    borderLight: {
        type: String,
        default: '#E8E6E1'
    },
    borderMedium: {
        type: String,
        default: '#D4D2CD'
    },

    // Site Settings
    siteName: {
        type: String,
        default: 'RAHHALAH'
    },
    siteDescription: {
        type: String,
        default: 'Premium Streetwear Collection'
    },

    // Contact Info
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },

    // Social Media
    facebook: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },

    // Typography
    fontFamily: {
        type: String,
        default: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
