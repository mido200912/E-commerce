import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LogOut, Save, Bell, Eye } from 'lucide-react-native';

export default function ThemeSettingsScreen() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        primaryGold: '#000000',
        secondaryGold: '#171717',
        accentGold: '#D4AF37',
        bgPrimary: '#0A0A0A',
        bgSecondary: '#171717',
        bgTertiary: '#222222',
        textPrimary: '#F5F0E8',
        textSecondary: '#B8A98A',
        textMuted: '#6B6050',
        borderLight: 'rgba(212, 175, 55, 0.12)',
        borderMedium: 'rgba(212, 175, 55, 0.35)',
        siteName: 'RAHHALAH',
        siteDescription: 'Premium Streetwear Collection',
        phone: '',
        email: '',
        address: '',
        facebook: '',
        instagram: '',
        twitter: '',
        whatsappNumber: '',
        facebookPixelId: '',
        heroTitle: 'NEW COLLECTION',
        heroSubtitle: 'Explore our latest arrivals'
    });

    const navigation = useNavigation();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await axios.get('/api/settings');
            if (res.data?.data) {
                setSettings(res.data.data);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await axios.put('/api/settings', settings);
            Alert.alert('نجاح', 'تم حفظ الإعدادات بنجاح');
        } catch (error) {
            Alert.alert('خطأ', 'تعذر حفظ الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleLogout = async () => {
        Alert.alert('تسجيل الخروج', 'هل تريد بالفعل تسجيل الخروج من لوحة التحكم؟', [
            { text: 'إلغاء', style: 'cancel' },
            {
                text: 'تسجيل الخروج', style: 'destructive', onPress: async () => {
                    try {
                        await axios.post('/api/admin/logout');
                    } catch (e) { }
                    await AsyncStorage.removeItem('adminToken');
                    navigation.replace('Login');
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>معلومات الموقع</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>اسم الموقع</Text>
                    <TextInput style={styles.input} value={settings.siteName} onChangeText={(t) => handleChange('siteName', t)} textAlign="right" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>وصف الموقع</Text>
                    <TextInput style={styles.input} value={settings.siteDescription} onChangeText={(t) => handleChange('siteDescription', t)} textAlign="right" multiline />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>إعدادات العرض (Hero Section)</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>العنوان الرئيسي (البانر)</Text>
                    <TextInput style={styles.input} value={settings.heroTitle} onChangeText={(t) => handleChange('heroTitle', t)} textAlign="right" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>نص البانر الفرعي</Text>
                    <TextInput style={styles.input} value={settings.heroSubtitle} onChangeText={(t) => handleChange('heroSubtitle', t)} textAlign="right" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>معلومات التواصل</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>رقم الهاتف</Text>
                    <TextInput style={styles.input} value={settings.phone} onChangeText={(t) => handleChange('phone', t)} textAlign="right" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>البريد الإلكتروني</Text>
                    <TextInput style={styles.input} value={settings.email} onChangeText={(t) => handleChange('email', t)} textAlign="right" autoCapitalize="none" keyboardType="email-address" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>العنوان</Text>
                    <TextInput style={styles.input} value={settings.address} onChangeText={(t) => handleChange('address', t)} textAlign="right" multiline />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>رقم الواتساب للطلبات</Text>
                    <TextInput style={styles.input} value={settings.whatsappNumber} onChangeText={(t) => handleChange('whatsappNumber', t)} textAlign="right" keyboardType="numeric" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>وسائل التواصل الاجتماعي</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>فيسبوك</Text>
                    <TextInput style={styles.input} value={settings.facebook} onChangeText={(t) => handleChange('facebook', t)} textAlign="left" autoCapitalize="none" keyboardType="url" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>إنستغرام</Text>
                    <TextInput style={styles.input} value={settings.instagram} onChangeText={(t) => handleChange('instagram', t)} textAlign="left" autoCapitalize="none" keyboardType="url" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>تيك توك / تويتر</Text>
                    <TextInput style={styles.input} value={settings.twitter} onChangeText={(t) => handleChange('twitter', t)} textAlign="left" autoCapitalize="none" keyboardType="url" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ألوان الموقع</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>اللون الأساسي المميز (Accent Gold)</Text>
                    <TextInput style={styles.input} value={settings.accentGold} onChangeText={(t) => handleChange('accentGold', t)} textAlign="left" autoCapitalize="none" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>الخلفية الأساسية</Text>
                    <TextInput style={styles.input} value={settings.bgPrimary} onChangeText={(t) => handleChange('bgPrimary', t)} textAlign="left" autoCapitalize="none" />
                </View>
            </View>

            <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveSettings}
                disabled={saving}
            >
                {saving ? <ActivityIndicator color="#000" /> : (
                    <>
                        <Save color="#000" size={20} />
                        <Text style={styles.saveBtnText}>حفظ الإعدادات</Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut color="#EF4444" size={20} />
                <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    section: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    sectionTitle: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'right' },
    formGroup: { marginBottom: 16 },
    label: { color: '#AAA', fontSize: 14, marginBottom: 8, textAlign: 'right' },
    input: { backgroundColor: '#2D2D2D', borderWidth: 1, borderColor: '#444', borderRadius: 6, color: '#FFF', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
    saveBtn: { backgroundColor: '#D4AF37', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, gap: 10, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#333', marginVertical: 24 },
    logoutBtn: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 14, borderRadius: 8, gap: 10, marginTop: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' }
});
