const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^01[0-2,5]{1}[0-9]{8}$/.test(v);
            },
            message: 'Please provide a valid Egyptian phone number'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [10, 'Address must be at least 10 characters'],
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    governorate: {
        type: String,
        required: [true, 'Governorate is required'],
        enum: {
            values: ['القاهرة', 'الجيزة', 'القاهرة الجديدة', 'الإسكندرية', 'الدلتا', 'الصعيد'],
            message: 'Invalid governorate selected'
        }
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            max: [100, 'Quantity cannot exceed 100']
        },
        size: String,
        color: String,
        priceAtPurchase: {
            type: Number,
            required: true
        }
    }],
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['vodafone-cash', 'cash-on-delivery'],
            message: 'Invalid payment method'
        }
    },
    shippingCost: {
        type: Number,
        required: true,
        min: [0, 'Shipping cost cannot be negative']
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'Total cannot be negative']
    },
    status: {
        type: String,
        default: 'pending',
        enum: {
            values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            message: 'Invalid order status'
        }
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    ipAddress: String,
    userAgent: String,
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
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Validate that total matches items + shipping
orderSchema.pre('save', function (next) {
    const itemsTotal = this.items.reduce((sum, item) => {
        return sum + (item.priceAtPurchase * item.quantity);
    }, 0);

    const expectedTotal = itemsTotal + this.shippingCost;

    if (Math.abs(this.total - expectedTotal) > 0.01) {
        return next(new Error('Total price mismatch'));
    }

    next();
});

// Indexes for performance
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerName: 1 });
orderSchema.index({ phone: 1 });

module.exports = mongoose.model('Order', orderSchema);
