import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, RefreshControl, Image, ScrollView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Edit2, Trash2, Tag, ShoppingBag } from 'lucide-react-native';

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', description: '', collection: '', price: '', originalPrice: '',
        isOnSale: false, discountPercentage: '', images: [''], sizes: '', colors: '', stock: '1'
    });
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadProducts();
            loadCollections();
        }, [])
    );

    const loadProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections');
            setCollections(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadProducts();
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            title: '', description: '', collection: (collections.length > 0 ? collections[0]._id : ''), price: '', originalPrice: '',
            isOnSale: false, discountPercentage: '', images: [''], sizes: '', colors: '', stock: '1'
        });
        setModalVisible(true);
    };

    const openEditModal = (item) => {
        setEditingId(item._id);
        setFormData({
            title: item.title, description: item.description, collection: item.collection?._id || item.collection,
            price: String(item.price), originalPrice: item.originalPrice ? String(item.originalPrice) : '',
            isOnSale: item.isOnSale || false, discountPercentage: item.discountPercentage ? String(item.discountPercentage) : '',
            images: item.images && item.images.length > 0 ? item.images : [''],
            sizes: item.sizes ? item.sizes.join(', ') : '', colors: item.colors ? item.colors.join(', ') : '',
            stock: item.stock !== undefined ? String(item.stock) : '1'
        });
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.price || !formData.collection) {
            Alert.alert('خطأ', 'يرجى ملء الحقول المطلوبة (العنوان، السعر، المجموعة)');
            return;
        }
        setSaving(true);
        try {
            const productData = {
                title: formData.title, description: formData.description, collection: formData.collection,
                price: parseFloat(formData.price), originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                isOnSale: formData.isOnSale, discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
                images: formData.images.filter(img => img && img.trim() !== ''),
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [],
                colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c !== '') : [],
                stock: parseInt(formData.stock) || 0
            };

            if (editingId) {
                await axios.put(`/api/products/${editingId}`, productData);
            } else {
                await axios.post('/api/products', productData);
            }
            setModalVisible(false);
            loadProducts();
        } catch (error) {
            Alert.alert('خطأ', error.response?.data?.message || 'تعذر حفظ المنتج');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id, name) => {
        Alert.alert('تأكيد الحذف', `هل أنت متأكد من حذف المنتج "${name}"؟`, [
            { text: 'إلغاء', style: 'cancel' },
            {
                text: 'حذف', style: 'destructive', onPress: async () => {
                    try {
                        await axios.delete(`/api/products/${id}`);
                        loadProducts();
                    } catch (error) {
                        Alert.alert('خطأ', error.response?.data?.message || 'تعذر الحذف');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300/1E1E1E/D4AF37?text=RAHHALAH' }}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.isOnSale && <Text style={styles.saleBadge}>خصم</Text>}
                </View>
                <Text style={styles.cardPrice}>{item.price} ج.م</Text>
                <Text style={styles.cardSubText}>
                    المخزون: {item.stock || 0} | المجموعة: {item.collection?.name || 'غير محدد'}
                </Text>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
                        <Edit2 color="#FFF" size={16} />
                        <Text style={styles.actionText}>تعديل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id, item.title)}>
                        <Trash2 color="#EF4444" size={16} />
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>حذف</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.fab} onPress={openAddModal}>
                <Plus color="#000" size={24} />
            </TouchableOpacity>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#D4AF37" /></View>
            ) : products.length === 0 ? (
                <View style={styles.center}>
                    <ShoppingBag color="#333" size={64} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>لا توجد منتجات</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <ScrollView contentContainerStyle={styles.scrollModal} keyboardShouldPersistTaps="handled">
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{editingId ? 'تعديل المنتج' : 'إضافة منتج'}</Text>

                            <Text style={styles.label}>اسم المنتج *</Text>
                            <TextInput style={styles.input} value={formData.title} onChangeText={t => setFormData({ ...formData, title: t })} textAlign="right" placeholder="مثال: تيشيرت" placeholderTextColor="#666" />

                            <Text style={styles.label}>الوصف</Text>
                            <TextInput style={[styles.input, { height: 80 }]} value={formData.description} multiline onChangeText={t => setFormData({ ...formData, description: t })} textAlign="right" placeholder="تفاصيل المنتج" placeholderTextColor="#666" />

                            <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>السعر *</Text>
                                    <TextInput style={styles.input} value={formData.price} onChangeText={t => setFormData({ ...formData, price: t })} keyboardType="numeric" textAlign="right" placeholder="0.00" placeholderTextColor="#666" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>المخزون المتوفر *</Text>
                                    <TextInput style={styles.input} value={formData.stock} onChangeText={t => setFormData({ ...formData, stock: t })} keyboardType="numeric" textAlign="right" placeholder="10" placeholderTextColor="#666" />
                                </View>
                            </View>

                            <View style={[styles.input, { paddingHorizontal: 0, paddingVertical: 0, marginBottom: 16, overflow: 'hidden' }]}>
                                <Picker
                                    selectedValue={formData.collection}
                                    onValueChange={(itemValue) => setFormData({ ...formData, collection: itemValue })}
                                    style={{ color: '#FFF' }}
                                    dropdownIconColor="#FFF"
                                >
                                    <Picker.Item label="اختر مجموعة *..." value="" />
                                    {collections.map(c => (
                                        <Picker.Item key={c._id} label={c.name} value={c._id} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>روابط الصور</Text>
                            {formData.images.map((img, idx) => (
                                <View key={idx} style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 8 }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                        value={img}
                                        onChangeText={t => {
                                            const arr = [...formData.images];
                                            arr[idx] = t;
                                            setFormData({ ...formData, images: arr });
                                        }}
                                        textAlign="left"
                                        placeholder={`https://example.com/image${idx + 1}.jpg`}
                                        placeholderTextColor="#666"
                                        autoCapitalize="none"
                                        keyboardType="url"
                                    />
                                    {idx > 0 && (
                                        <TouchableOpacity onPress={() => {
                                            const arr = formData.images.filter((_, i) => i !== idx);
                                            setFormData({ ...formData, images: arr });
                                        }} style={{ backgroundColor: '#EF4444', padding: 12, borderRadius: 6, justifyContent: 'center' }}>
                                            <Trash2 color="#FFF" size={20} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                            <TouchableOpacity onPress={() => setFormData({ ...formData, images: [...formData.images, ''] })} style={{ padding: 12, alignItems: 'center', backgroundColor: '#333', borderRadius: 6, marginBottom: 16 }}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+ إضافة صورة أخرى</Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>المقاسات (مفصولة بفاصلة)</Text>
                            <TextInput style={styles.input} value={formData.sizes} onChangeText={t => setFormData({ ...formData, sizes: t })} textAlign="right" placeholder="S, M, L, XL" placeholderTextColor="#666" />

                            <Text style={styles.label}>الألوان (مفصولة بفاصلة)</Text>
                            <TextInput style={styles.input} value={formData.colors} onChangeText={t => setFormData({ ...formData, colors: t })} textAlign="right" placeholder="أسود, أبيض" placeholderTextColor="#666" />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={saving}>
                                    <Text style={styles.cancelBtnText}>إلغاء</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                                    {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>حفظ</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#888', fontSize: 16, fontWeight: 'bold' },
    fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 5 },

    card: { backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
    cardImage: { width: '100%', height: 200, backgroundColor: '#222' },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    saleBadge: { backgroundColor: '#D4AF37', color: '#000', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
    cardPrice: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 4, textAlign: 'right' },
    cardSubText: { color: '#888', fontSize: 14, textAlign: 'right', marginBottom: 16 },

    actions: { flexDirection: 'row-reverse', justifyContent: 'flex-start', gap: 10, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 },
    actionBtn: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#2D2D2D', borderRadius: 4, gap: 6 },
    deleteBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
    actionText: { color: '#FFF', fontSize: 14 },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    scrollModal: { flexGrow: 1, justifyContent: 'flex-end', paddingTop: 60 },
    modalContent: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
    modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'right' },
    label: { color: '#AAA', marginBottom: 8, textAlign: 'right', fontWeight: 'bold' },
    input: { backgroundColor: '#2D2D2D', borderWidth: 1, borderColor: '#444', borderRadius: 6, color: '#FFF', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, fontSize: 16 },
    modalActions: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 16 },
    cancelBtn: { flex: 1, padding: 14, alignItems: 'center', marginLeft: 10, borderRadius: 6, backgroundColor: '#333' },
    cancelBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    saveBtn: { flex: 1, padding: 14, alignItems: 'center', marginRight: 10, borderRadius: 6, backgroundColor: '#D4AF37' },
    saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
