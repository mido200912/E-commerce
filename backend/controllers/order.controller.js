const Order = require('../models/Order');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { generateOrderPDF } = require('../utils/pdfGenerator');

const SHIPPING_RATES = {
    'القاهرة': 60,
    'الجيزة': 65,
    'القاهرة الجديدة': 70,
    'الإسكندرية': 75,
    'الدلتا': 75,
    'الصعيد': 85
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = asyncHandler(async (req, res) => {
    const { status, startDate, endDate } = req.query;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
        .populate('items.product', 'title images')
        .sort({ createdAt: -1 })
        .select('-__v');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin)
exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('items.product', 'title images price');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res) => {
    const { customerName, phone, address, governorate, items, paymentMethod } = req.body;

    // Validate shipping rate
    const shippingCost = SHIPPING_RATES[governorate];
    if (!shippingCost) {
        return res.status(400).json({
            success: false,
            message: 'Invalid governorate'
        });
    }

    // Validate and process items
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Order must contain at least one item'
        });
    }

    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product || !product.isActive) {
            return res.status(400).json({
                success: false,
                message: `Product ${item.product} not found or unavailable`
            });
        }

        // Check stock
        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${product.title}`
            });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
            product: product._id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            priceAtPurchase: product.price
        });

        // Update stock and sales count
        product.stock -= item.quantity;
        product.salesCount += item.quantity;
        await product.save();
    }

    const total = subtotal + shippingCost;

    // Create order with security info
    const order = await Order.create({
        customerName,
        phone,
        address,
        governorate,
        items: processedItems,
        paymentMethod,
        shippingCost,
        total,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
    });

    // Update Analytics
    try {
        const Analytics = require('../models/Analytics');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await Analytics.findOneAndUpdate(
            { date: today },
            {
                $inc: {
                    ordersCount: 1,
                    revenue: total
                }
            },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error updating analytics:', error);
    }

    await order.populate('items.product', 'title images');

    res.status(201).json({
        success: true,
        data: order
    });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

// @desc    Get order receipt PDF
// @route   GET /api/orders/:id/pdf
// @access  Private (Admin)
exports.getOrderPDF = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('items.product', 'title');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Generate PDF
    const pdfStream = await generateOrderPDF(order);

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order-${order._id}.pdf`);

    // Pipe PDF to response
    pdfStream.pipe(res);
    pdfStream.end();
});

// @desc    Calculate shipping cost
// @route   POST /api/orders/calculate-shipping
// @access  Public
exports.calculateShipping = asyncHandler(async (req, res) => {
    const { governorate } = req.body;

    const cost = SHIPPING_RATES[governorate];

    if (!cost) {
        return res.status(400).json({
            success: false,
            message: 'Invalid governorate'
        });
    }

    res.status(200).json({
        success: true,
        cost
    });
});
