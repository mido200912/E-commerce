import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [customApiUrl, setCustomApiUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadSettings();
        checkAuth();
    }, []);

    const loadSettings = async () => {
        const url = await AsyncStorage.getItem('custom_api_url');
        if (url) {
            setCustomApiUrl(url);
        }
    };

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            if (token) {
                await axios.get('/api/admin/check');
                navigation.replace('Main');
            }
        } catch (err) {
            console.log('Not authenticated');
        }
    };

    const handleLogin = async () => {
        setError('');

        if (customApiUrl) {
            await AsyncStorage.setItem('custom_api_url', customApiUrl);
        } else {
            await AsyncStorage.removeItem('custom_api_url');
        }

        if (!email || !password) {
            setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        setLoading(true);
        try {
            // Set custom base url locally for login
            const response = await axios.post((customApiUrl || axios.defaults.baseURL) + '/api/admin/login', {
                email,
                password
            });

            if (response.data.success) {
                await AsyncStorage.setItem('adminToken', response.data.token);
                navigation.replace('Main');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>RAHHALAH</Text>
                    <Text style={styles.subtitle}>المدير</Text>
                    <Text style={styles.subtitle2}>تسجيل دخول الإدارة</Text>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>البريد الإلكتروني</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="admin@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>كلمة المرور</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>رابط الخادم (Backend URL)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="http://192.168.1.x:3000"
                        value={customApiUrl}
                        onChangeText={setCustomApiUrl}
                        autoCapitalize="none"
                    />
                    <Text style={styles.hintText}>اتركه فارغاً لاستخدام الخادم الأساسي، أو أدخل الـ IP المحلي أثناء التطوير.</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>تسجيل الدخول</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#2D2D2D',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        borderTopWidth: 4,
        borderTopColor: '#D4AF37',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        color: '#D4AF37',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#D4AF37',
        marginBottom: 8,
    },
    subtitle2: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: '600',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#AAA',
        marginBottom: 8,
        fontSize: 14,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 4,
        padding: 12,
        color: '#FFF',
        fontSize: 16,
        textAlign: 'right',
    },
    button: {
        backgroundColor: '#D4AF37',
        padding: 14,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
        textAlign: 'right',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)',
    },
    hintText: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right',
    }
});

export default LoginScreen;
