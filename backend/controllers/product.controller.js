const Product = require('../models/Product');
const Collection = require('../models/Collection');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
    const { collection, minPrice, maxPrice, sort, isOnSale } = req.query;

    // Build query
    const query = { isActive: true };

    if (collection) {
        query.collection = collection;
    }

    if (isOnSale !== undefined) {
        query.isOnSale = isOnSale === 'true';
        if (query.isOnSale) {
            query.$or = [
                { discountPercentage: { $gt: 0 } },
                { $expr: { $gt: ["$originalPrice", "$price"] } }
            ];
        }
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sortBy = '-createdAt';
    if (sort === 'price-asc') sortBy = 'price';
    if (sort === 'price-desc') sortBy = '-price';
    if (sort === 'popular') sortBy = '-salesCount';

    const products = await Product.find(query)
        .populate('collection', 'name')
        .sort(sortBy)
        .select('-__v');

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('collection', 'name description');

    if (!product || !product.isActive) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        images,
        collection,
        price,
        originalPrice,
        isOnSale,
        discountPercentage,
        sizes,
        colors,
        stock
    } = req.body;

    // Verify collection exists
    const collectionExists = await Collection.findById(collection);
    if (!collectionExists) {
        return res.status(400).json({
            success: false,
            message: 'Invalid collection ID'
        });
    }

    const product = await Product.create({
        title,
        description,
        images: images || [],
        collection,
        price,
        originalPrice,
        isOnSale,
        discountPercentage,
        sizes: sizes || [],
        colors: colors || [],
        stock: stock !== undefined ? stock : 999
    });

    await product.populate('collection', 'name');

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // If collection is being updated, verify it exists
    if (req.body.collection && req.body.collection !== product.collection.toString()) {
        const collectionExists = await Collection.findById(req.body.collection);
        if (!collectionExists) {
            return res.status(400).json({
                success: false,
                message: 'Invalid collection ID'
            });
        }
    }

    // Merge all fields onto the document so cross-field validators work correctly
    const fields = ['title', 'description', 'images', 'collection', 'price',
        'originalPrice', 'isOnSale', 'discountPercentage', 'sizes', 'colors', 'stock', 'isActive'];

    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            product[field] = req.body[field];
        }
    });

    // If isOnSale is false, clear sale-related fields
    if (req.body.isOnSale === false) {
        product.originalPrice = undefined;
        product.discountPercentage = undefined;
    }

    await product.save();
    await product.populate('collection', 'name');

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
