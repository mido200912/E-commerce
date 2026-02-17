const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true // One entry per day
    },
    visits: {
        type: Number,
        default: 0
    },
    uniqueVisitors: {
        type: Number, // Optional: count unique IPs if needed
        default: 0
    },
    ordersCount: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    topProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        count: Number
    }]
}, { timestamps: true });

// Create compound index for date lookups
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
