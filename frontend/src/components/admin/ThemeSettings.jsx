import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
    FaPalette,
    FaSave,
    FaUndo,
    FaEyeDropper,
    FaFont,
    FaGlobe,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaTiktok
} from 'react-icons/fa';
import './ThemeSettings.css';

function ThemeSettings() {
    const [settings, setSettings] = useState({
        // Gold Colors
        primaryGold: '#C9A961',
        secondaryGold: '#B8935E',
        accentGold: '#D4AF37',

        // Background Colors
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F8F7F4',
        bgTertiary: '#F5F3EF',

        // Text Colors
        textPrimary: '#1A1A1A',
        textSecondary: '#4A4A4A',
        textMuted: '#8B8B8B',

        // Border Colors
        borderLight: '#E8E6E1',
        borderMedium: '#D4D2CD',

        // Site Info
        siteName: 'RAHHALAH',
        siteDescription: 'Premium Streetwear Collection',

        // Contact
        phone: '',
        email: '',
        address: '',

        // Social
        facebook: '',
        instagram: '',
        twitter: '',

        // Typography
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await axios.get('/api/settings');
            setSettings(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading settings:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put('/api/settings', settings, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('تم حفظ الإعدادات بنجاح! ✅');

            // Apply theme immediately
            applyTheme(settings);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('خطأ في حفظ الإعدادات ❌');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post('/api/settings/reset', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSettings(response.data.data);
            setMessage('تم إعادة تعيين الإعدادات بنجاح! ✅');

            // Apply default theme
            applyTheme(response.data.data);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error resetting settings:', error);
            setMessage('خطأ في إعادة تعيين الإعدادات ❌');
        } finally {
            setSaving(false);
        }
    };

    const applyTheme = (themeSettings) => {
        const root = document.documentElement;

        // Gold colors
        if (themeSettings.primaryGold) root.style.setProperty('--primary-gold', themeSettings.primaryGold);
        if (themeSettings.secondaryGold) root.style.setProperty('--secondary-gold', themeSettings.secondaryGold);
        if (themeSettings.accentGold) root.style.setProperty('--accent-gold', themeSettings.accentGold);

        // Background colors
        if (themeSettings.bgPrimary) root.style.setProperty('--bg-primary', themeSettings.bgPrimary);
        if (themeSettings.bgSecondary) root.style.setProperty('--bg-secondary', themeSettings.bgSecondary);
        if (themeSettings.bgTertiary) root.style.setProperty('--bg-tertiary', themeSettings.bgTertiary);

        // Text colors
        if (themeSettings.textPrimary) root.style.setProperty('--text-primary', themeSettings.textPrimary);
        if (themeSettings.textSecondary) root.style.setProperty('--text-secondary', themeSettings.textSecondary);
        if (themeSettings.textMuted) root.style.setProperty('--text-muted', themeSettings.textMuted);

        // Border colors
        if (themeSettings.borderLight) root.style.setProperty('--border-light', themeSettings.borderLight);
        if (themeSettings.borderMedium) root.style.setProperty('--border-medium', themeSettings.borderMedium);

        // Typography
        if (themeSettings.fontFamily) {
            document.body.style.fontFamily = themeSettings.fontFamily;
        }
    };

    if (loading) {
        return (
            <div className="theme-settings">
                <div className="loading-spinner">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="theme-settings">
            <div className="settings-header">
                <div className="header-title">
                    <FaPalette className="header-icon" />
                    <h1>إعدادات الموقع والألوان</h1>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                        disabled={saving}
                    >
                        <FaUndo /> إعادة تعيين
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <FaSave /> {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="settings-grid">
                {/* Gold Colors Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaEyeDropper /> ألوان الذهبي
                    </h2>
                    <div className="color-grid">
                        <div className="color-input-group">
                            <label>اللون الذهبي الأساسي</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="primaryGold"
                                    value={settings.primaryGold}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.primaryGold}
                                    onChange={handleChange}
                                    name="primaryGold"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>اللون الذهبي الثانوي</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="secondaryGold"
                                    value={settings.secondaryGold}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.secondaryGold}
                                    onChange={handleChange}
                                    name="secondaryGold"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>اللون الذهبي المميز</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="accentGold"
                                    value={settings.accentGold}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.accentGold}
                                    onChange={handleChange}
                                    name="accentGold"
                                    className="color-text"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Colors Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaEyeDropper /> ألوان الخلفية
                    </h2>
                    <div className="color-grid">
                        <div className="color-input-group">
                            <label>الخلفية الأساسية</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="bgPrimary"
                                    value={settings.bgPrimary}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.bgPrimary}
                                    onChange={handleChange}
                                    name="bgPrimary"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>الخلفية الثانوية</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="bgSecondary"
                                    value={settings.bgSecondary}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.bgSecondary}
                                    onChange={handleChange}
                                    name="bgSecondary"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>الخلفية الثالثة</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="bgTertiary"
                                    value={settings.bgTertiary}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.bgTertiary}
                                    onChange={handleChange}
                                    name="bgTertiary"
                                    className="color-text"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Colors Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaFont /> ألوان النصوص
                    </h2>
                    <div className="color-grid">
                        <div className="color-input-group">
                            <label>النص الأساسي</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="textPrimary"
                                    value={settings.textPrimary}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.textPrimary}
                                    onChange={handleChange}
                                    name="textPrimary"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>النص الثانوي</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="textSecondary"
                                    value={settings.textSecondary}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.textSecondary}
                                    onChange={handleChange}
                                    name="textSecondary"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>النص الخافت</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="textMuted"
                                    value={settings.textMuted}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.textMuted}
                                    onChange={handleChange}
                                    name="textMuted"
                                    className="color-text"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Border Colors Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaEyeDropper /> ألوان الحدود
                    </h2>
                    <div className="color-grid">
                        <div className="color-input-group">
                            <label>الحدود الفاتحة</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="borderLight"
                                    value={settings.borderLight}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.borderLight}
                                    onChange={handleChange}
                                    name="borderLight"
                                    className="color-text"
                                />
                            </div>
                        </div>

                        <div className="color-input-group">
                            <label>الحدود المتوسطة</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    name="borderMedium"
                                    value={settings.borderMedium}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    value={settings.borderMedium}
                                    onChange={handleChange}
                                    name="borderMedium"
                                    className="color-text"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Site Information Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaGlobe /> معلومات الموقع
                    </h2>
                    <div className="form-group">
                        <label>
                            <FaFont /> اسم الموقع
                        </label>
                        <input
                            type="text"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            placeholder="RAHHALAH"
                        />
                    </div>
                    <div className="form-group">
                        <label>وصف الموقع</label>
                        <textarea
                            name="siteDescription"
                            value={settings.siteDescription}
                            onChange={handleChange}
                            placeholder="Premium Streetwear Collection"
                            rows="3"
                        />
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaPhone /> معلومات التواصل
                    </h2>
                    <div className="form-group">
                        <label>
                            <FaPhone /> رقم الهاتف
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            placeholder="+966 XX XXX XXXX"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaEnvelope /> البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="info@rahhalah.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaMapMarkerAlt /> العنوان
                        </label>
                        <textarea
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            placeholder="الرياض، المملكة العربية السعودية"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="settings-section">
                    <h2 className="section-title">
                        <FaFacebook /> وسائل التواصل الاجتماعي
                    </h2>
                    <div className="form-group">
                        <label>
                            <FaFacebook /> فيسبوك
                        </label>
                        <input
                            type="url"
                            name="facebook"
                            value={settings.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaInstagram /> إنستغرام
                        </label>
                        <input
                            type="url"
                            name="instagram"
                            value={settings.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/yourpage"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaTiktok /> تيك توك
                        </label>
                        <input
                            type="url"
                            name="twitter"
                            value={settings.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/yourpage"
                        />
                    </div>
                </div>
            </div>

            <div className="settings-footer">
                <button
                    className="btn btn-primary btn-large"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <FaSave /> {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
                </button>
            </div>
        </div>
    );
}

export default ThemeSettings;
