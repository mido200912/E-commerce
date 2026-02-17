const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true,
        maxlength: [100, 'Collection name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt on modification
collectionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create index for faster queries
collectionSchema.index({ name: 1 });
collectionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
