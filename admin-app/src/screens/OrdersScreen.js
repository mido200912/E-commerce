import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, Linking, Alert } from 'react-native';
import axios from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';
import { MessageCircle, FileText, CheckCircle2 } from 'lucide-react-native';

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusModalVisible, setStatusModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    const loadOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            setStatusModalVisible(false);
            loadOrders();
        } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الحالة');
        }
    };

    const sendWhatsApp = (order) => {
        const itemsText = order.items.map(i => `- ${i.product?.title || 'منتج'} (الكمية: ${i.quantity})`).join('\n');
        const text = encodeURIComponent(`مرحباً ${order.customerName}،\nتفاصيل طلبك رقم #${order._id.substring(order._id.length - 8)}:\n${itemsText}\nالإجمالي: ${order.total} ج.م\nتم استلام طلبك وجاري تجهيزه.`);
        const url = `whatsapp://send?phone=2${order.phone}&text=${text}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('خطأ', 'تطبيق واتساب غير مثبت على هذا الجهاز');
            }
        });
    };

    const getStatusInfo = (status) => {
        const statuses = {
            'pending': { label: 'قيد الانتظار', color: '#F59E0B' },
            'confirmed': { label: 'مؤكد', color: '#3B82F6' },
            'processing': { label: 'جاري التجهيز', color: '#6366F1' },
            'shipped': { label: 'تم الشحن', color: '#8B5CF6' },
            'delivered': { label: 'تم التوصيل', color: '#10B981' },
            'cancelled': { label: 'ملغي', color: '#EF4444' }
        };
        return statuses[status] || statuses['pending'];
    };

    const renderItem = ({ item }) => {
        const statusInfo = getStatusInfo(item.status);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardId}>#{item._id.substring(item._id.length - 8)}</Text>
                    <TouchableOpacity
                        style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}
                        onPress={() => { setSelectedOrder(item); setStatusModalVisible(true); }}
                    >
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.infoText}>العميل: {item.customerName}</Text>
                    <Text style={styles.infoText}>رقم الهاتف: {item.phone}</Text>
                    <Text style={styles.infoText}>المحافظة: {item.governorate}</Text>
                    <Text style={styles.infoText}>العنوان: {item.address}</Text>
                    <Text style={[styles.infoText, { marginTop: 8, color: '#D4AF37', fontWeight: 'bold' }]}>الإجمالي: {item.total} ج.م</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366' }]} onPress={() => sendWhatsApp(item)}>
                        <MessageCircle color="#FFF" size={16} />
                        <Text style={styles.actionText}>واتساب</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#D4AF37" /></View>
            ) : orders.length === 0 ? (
                <View style={styles.center}>
                    <FileText color="#333" size={64} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>لا توجد طلبات</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
                />
            )}

            {/* Status Modal */}
            <Modal visible={statusModalVisible} animationType="fade" transparent>
                <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setStatusModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>تحديث حالة الطلب</Text>
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusOption,
                                    selectedOrder?.status === status ? { borderColor: '#D4AF37' } : {}
                                ]}
                                onPress={() => handleStatusChange(selectedOrder._id, status)}
                            >
                                <Text style={[styles.statusOptionText, { color: getStatusInfo(status).color }]}>
                                    {getStatusInfo(status).label}
                                </Text>
                                {selectedOrder?.status === status && <CheckCircle2 color="#D4AF37" size={20} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#888', fontSize: 16, fontWeight: 'bold' },

    card: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
    cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 12 },
    cardId: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    cardBody: { marginBottom: 16 },
    infoText: { color: '#CCC', fontSize: 14, marginBottom: 6, textAlign: 'right' },

    actions: { flexDirection: 'row-reverse', gap: 10 },
    actionBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 6, gap: 8 },
    actionText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

    modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
    modalContent: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: '#333' },
    modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    statusOption: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
    statusOptionText: { fontSize: 16, fontWeight: 'bold' }
});
