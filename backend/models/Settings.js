const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Theme Colors - Light Theme
    primaryGold: {
        type: String,
        default: '#000000'
    },
    secondaryGold: {
        type: String,
        default: '#171717'
    },
    accentGold: {
        type: String,
        default: '#D4AF37'
    },

    // Background Colors
    bgPrimary: {
        type: String,
        default: '#0A0A0A'
    },
    bgSecondary: {
        type: String,
        default: '#171717'
    },
    bgTertiary: {
        type: String,
        default: '#222222'
    },

    // Text Colors
    textPrimary: {
        type: String,
        default: '#F5F0E8'
    },
    textSecondary: {
        type: String,
        default: '#B8A98A'
    },
    textMuted: {
        type: String,
        default: '#6B6050'
    },

    // Border Colors
    borderLight: {
        type: String,
        default: 'rgba(212, 175, 55, 0.12)'
    },
    borderMedium: {
        type: String,
        default: 'rgba(212, 175, 55, 0.35)'
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
    whatsappNumber: {
        type: String,
        default: ''
    },

    // Marketing
    facebookPixelId: {
        type: String,
        default: ''
    },

    // Frontend Text
    heroTitle: {
        type: String,
        default: 'NEW COLLECTION'
    },
    heroSubtitle: {
        type: String,
        default: 'Explore our latest arrivals'
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
