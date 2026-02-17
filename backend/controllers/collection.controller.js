const Collection = require('../models/Collection');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
exports.getAllCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select('-__v');

    res.status(200).json({
        success: true,
        count: collections.length,
        data: collections
    });
});

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Public
exports.getCollection = asyncHandler(async (req, res) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection || !collection.isActive) {
        return res.status(404).json({
            success: false,
            message: 'Collection not found'
        });
    }

    res.status(200).json({
        success: true,
        data: collection
    });
});

// @desc    Create collection
// @route   POST /api/collections
// @access  Private (Admin)
exports.createCollection = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Check for duplicate name
    const existingCollection = await Collection.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCollection) {
        return res.status(400).json({
            success: false,
            message: 'Collection with this name already exists'
        });
    }

    const collection = await Collection.create({
        name,
        description
    });

    res.status(201).json({
        success: true,
        data: collection
    });
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private (Admin)
exports.updateCollection = asyncHandler(async (req, res) => {
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
        return res.status(404).json({
            success: false,
            message: 'Collection not found'
        });
    }

    collection = await Collection.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        data: collection
    });
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private (Admin)
exports.deleteCollection = asyncHandler(async (req, res) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        return res.status(404).json({
            success: false,
            message: 'Collection not found'
        });
    }

    // Check if collection has products
    const productsCount = await Product.countDocuments({ collection: req.params.id });

    if (productsCount > 0) {
        return res.status(400).json({
            success: false,
            message: `Cannot delete collection with ${productsCount} product(s). Please delete products first.`
        });
    }

    await collection.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Collection deleted successfully'
    });
});
