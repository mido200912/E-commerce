const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    images: [{
        type: String,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL for the image'
        }
    }],
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: [true, 'Product must belong to a collection']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
        max: [1000000, 'Price is too high']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative'],
        validate: {
            validator: function (v) {
                return !v || v > this.price;
            },
            message: 'Original price must be greater than current price'
        }
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    sizes: [{
        type: String,
        trim: true,
        uppercase: true
    }],
    colors: [{
        type: String,
        trim: true
    }],
    stock: {
        type: Number,
        default: 999,
        min: [0, 'Stock cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    salesCount: {
        type: Number,
        default: 0
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
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Indexes for performance
productSchema.index({ collection: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
