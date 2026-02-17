import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../utils/axios';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const response = await axios.get('/api/settings');
            const settings = response.data.data;
            applyTheme(settings);
            setTheme(settings);
        } catch (error) {
            console.error('Error loading theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (themeSettings) => {
        if (!themeSettings) return;

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

    const updateTheme = (newTheme) => {
        applyTheme(newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, loading, updateTheme, loadTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
