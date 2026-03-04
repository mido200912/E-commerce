import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LogOut, Save, Smartphone, Bell, Eye } from 'lucide-react-native';

export default function ThemeSettingsScreen() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        theme: {
            primaryColor: '#D4AF37',
            backgroundColor: '#1A1D20',
            heroOverlay: 'rgba(0,0,0,0.6)',
            cardBackground: '#1E1E1E',
            textPrimary: '#FFFFFF'
        },
        hero: {
            title: 'استكشف مسارك',
            subtitle: 'اكتشف مجموعتنا الحصرية من الملابس المتميزة',
            videoUrl: '',
            imageUrl: '',
            buttonText: 'تسوق الآن'
        },
        features: [],
        socialMedia: {}
    });

    const navigation = useNavigation();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await axios.get('/api/settings/public');
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
            {/* Settings Sections */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>إعدادات العرض (Hero Section)</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>العنوان الرئيسي</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.hero.title}
                        onChangeText={(t) => setSettings({ ...settings, hero: { ...settings.hero, title: t } })}
                        textAlign="right"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>العنوان الفرعي</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.hero.subtitle}
                        onChangeText={(t) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: t } })}
                        textAlign="right"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>نص الزر</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.hero.buttonText}
                        onChangeText={(t) => setSettings({ ...settings, hero: { ...settings.hero, buttonText: t } })}
                        textAlign="right"
                    />
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

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>تفاصيل إضافية</Text>
                <TouchableOpacity style={styles.secondaryMenuBtn}>
                    <Bell color="#FFF" size={20} />
                    <Text style={styles.secondaryMenuText}>إعدادات الإشعارات للتطبيق</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryMenuBtn}>
                    <Eye color="#FFF" size={20} />
                    <Text style={styles.secondaryMenuText}>معاينة المتجر</Text>
                </TouchableOpacity>
            </View>

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
    secondaryMenuBtn: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#333', gap: 12 },
    secondaryMenuText: { color: '#FFF', fontSize: 16 },
    logoutBtn: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 14, borderRadius: 8, gap: 10, marginTop: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' }
});
