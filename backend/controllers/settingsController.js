const Settings = require('../models/Settings');

// Get current settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الإعدادات'
        });
    }
};

// Update settings (Admin only)
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        // Update all provided fields
        const allowedFields = Object.keys(Settings.schema.paths).filter(
            key => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)
        );
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                settings[key] = req.body[key];
            }
        });

        await settings.save();

        res.json({
            success: true,
            message: 'تم تحديث الإعدادات بنجاح',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث الإعدادات'
        });
    }
};

// Reset settings to default (Admin only)
exports.resetSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        // Reset to defaults
        settings.primaryGold = '#D4AF37';
        settings.primaryDark = '#0A0A0A';
        settings.secondaryDark = '#1A1A1A';
        settings.textLight = '#FFFFFF';
        settings.textGray = '#B8B8B8';
        settings.accentGold = '#FFD700';
        settings.bgDark = '#000000';
        settings.cardBg = '#151515';
        settings.borderGold = '#A68B2F';
        settings.fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

        await settings.save();

        res.json({
            success: true,
            message: 'تم إعادة تعيين الإعدادات للقيم الافتراضية',
            data: settings
        });
    } catch (error) {
        console.error('Reset settings error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إعادة تعيين الإعدادات'
        });
    }
};
