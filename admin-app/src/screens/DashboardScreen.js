import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Platform, Alert, TouchableOpacity } from 'react-native';
import axios from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';
import { ShoppingBag, Users, DollarSign, Shirt } from 'lucide-react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function DashboardScreen() {
    const [overview, setOverview] = useState({
        visits: 0,
        orders: 0,
        revenue: 0,
        productsCount: 0,
    });
    const [filter, setFilter] = useState('week');
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                axios.put('/api/admin/push-token', { pushToken: token })
                    .catch(err => console.log('Failed to update push token', err));
            }
        });
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#D4AF37',
            });
        }
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                return;
            }
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            try {
                token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            } catch (e) {
                console.log('Error getting push token', e);
            }
        }
        return token;
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadData();
        }, [filter])
    );

    const loadData = async () => {
        try {
            const [analyticsRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`/api/analytics/dashboard?range=${filter}`),
                axios.get('/api/orders'),
                axios.get('/api/products')
            ]);
            const analytics = analyticsRes.data.data;
            setOverview({
                visits: analytics.summary.visits || 0,
                orders: analytics.summary.orders || 0,
                revenue: analytics.summary.revenue || 0,
                productsCount: productsRes.data.count || productsRes.data.data.length || 0,
            });
            setRecentOrders(ordersRes.data.data.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>الاحصائيات</Text>
                <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => setFilter('month')} style={[styles.filterBtn, filter === 'month' && styles.filterBtnActive]}>
                        <Text style={[styles.filterText, filter === 'month' && styles.filterTextActive]}>شهر</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter('week')} style={[styles.filterBtn, filter === 'week' && styles.filterBtnActive]}>
                        <Text style={[styles.filterText, filter === 'week' && styles.filterTextActive]}>أسبوع</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter('today')} style={[styles.filterBtn, filter === 'today' && styles.filterBtnActive]}>
                        <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>اليوم</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <StatCard title="الزيارات" value={overview.visits} icon={<Users color="#D4AF37" />} />
                <StatCard title="الطلبات" value={overview.orders} icon={<ShoppingBag color="#D4AF37" />} />
                <StatCard title="المبيعات" value={formatCurrency(overview.revenue)} icon={<DollarSign color="#D4AF37" />} />
                <StatCard title="المنتجات" value={overview.productsCount} icon={<Shirt color="#D4AF37" />} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>آخر الطلبات</Text>
                {recentOrders.length === 0 ? (
                    <Text style={styles.emptyText}>لا توجد طلبات بعد</Text>
                ) : (
                    recentOrders.map(order => (
                        <View key={order._id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderId}>#{order._id.slice(-6)}</Text>
                                <Text style={[styles.badge, getStatusStyle(order.status)]}>
                                    {getStatusText(order.status)}
                                </Text>
                            </View>
                            <Text style={styles.orderText}>{order.customerName} - {order.governorate}</Text>
                            <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const StatCard = ({ title, value, icon }) => (
    <View style={styles.statCard}>
        <View style={styles.statHeader}>
            <Text style={styles.statTitle}>{title}</Text>
            {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const getStatusText = (status) => {
    const map = { pending: 'انتظار', confirmed: 'مؤكد', processing: 'تجهيز', shipped: 'شحن', delivered: 'تم', cancelled: 'ملغي' };
    return map[status] || status;
};

const getStatusStyle = (status) => {
    if (status === 'delivered') return { backgroundColor: '#10B981', color: '#FFF' };
    if (status === 'cancelled') return { backgroundColor: '#EF4444', color: '#FFF' };
    return { backgroundColor: '#F59E0B', color: '#FFF' };
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    header: { marginBottom: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    filterContainer: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 8, padding: 4 },
    filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    filterBtnActive: { backgroundColor: '#D4AF37' },
    filterText: { color: '#AAA', fontSize: 12, fontWeight: 'bold' },
    filterTextActive: { color: '#000' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    statCard: {
        backgroundColor: '#1E1E1E', borderRadius: 8, padding: 16, width: '48%', marginBottom: 16,
        borderWidth: 1, borderColor: '#333'
    },
    statHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    statTitle: { color: '#AAA', fontSize: 14, fontWeight: 'bold' },
    statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'right' },
    section: { marginVertical: 10 },
    sectionTitle: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'right' },
    emptyText: { color: '#888', textAlign: 'center', padding: 20 },
    orderCard: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
    orderHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { color: '#D4AF37', fontWeight: 'bold', fontFamily: 'monospace' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
    orderText: { color: '#CCC', marginBottom: 8, textAlign: 'right' },
    orderTotal: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16, textAlign: 'right' },
});
