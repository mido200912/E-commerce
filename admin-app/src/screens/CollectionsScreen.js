import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react-native';

export default function CollectionsScreen() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadCollections();
        }, [])
    );

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections');
            setCollections(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadCollections();
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '' });
        setModalVisible(true);
    };

    const openEditModal = (item) => {
        setEditingId(item._id);
        setFormData({ name: item.name, description: item.description || '' });
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            Alert.alert('خطأ', 'يرجى إدخال اسم المجموعة');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`/api/collections/${editingId}`, formData);
            } else {
                await axios.post('/api/collections', formData);
            }
            setModalVisible(false);
            loadCollections();
        } catch (error) {
            Alert.alert('خطأ', error.response?.data?.message || 'تعذر حفظ المجموعة');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id, name) => {
        Alert.alert('تأكيد الحذف', `هل أنت متأكد من حذف مجموعة "${name}"؟`, [
            { text: 'إلغاء', style: 'cancel' },
            {
                text: 'حذف', style: 'destructive', onPress: async () => {
                    try {
                        await axios.delete(`/api/collections/${id}`);
                        loadCollections();
                    } catch (error) {
                        Alert.alert('خطأ', error.response?.data?.message || 'تعذر الحذف');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                    <Folder color="#D4AF37" size={20} />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
                        <Edit2 color="#FFF" size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id, item.name)}>
                        <Trash2 color="#FFF" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
            {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.fab} onPress={openAddModal}>
                <Plus color="#000" size={24} />
            </TouchableOpacity>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#D4AF37" /></View>
            ) : collections.length === 0 ? (
                <View style={styles.center}>
                    <Folder color="#333" size={64} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>لا توجد مجموعات</Text>
                </View>
            ) : (
                <FlatList
                    data={collections}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingId ? 'تعديل موديل' : 'إضافة موديل/مجموعة'}</Text>

                        <Text style={styles.label}>اسم الموديل/المجموعة</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={text => setFormData({ ...formData, name: text })}
                            placeholder="مثال: تيشرتات صيفي"
                            placeholderTextColor="#666"
                            textAlign="right"
                        />

                        <Text style={styles.label}>الوصف</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.description}
                            onChangeText={text => setFormData({ ...formData, description: text })}
                            placeholder="وصف إضافي (اختياري)"
                            placeholderTextColor="#666"
                            multiline
                            textAlign="right"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={saving}>
                                <Text style={styles.cancelBtnText}>إلغاء</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                                {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>حفظ</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
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
    card: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
    cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardInfo: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
    cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    cardDesc: { color: '#AAA', fontSize: 14, textAlign: 'right', marginTop: 8 },
    actions: { flexDirection: 'row-reverse', gap: 10 },
    actionBtn: { padding: 8, backgroundColor: '#333', borderRadius: 4 },
    deleteBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },

    modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'right' },
    label: { color: '#AAA', marginBottom: 8, textAlign: 'right' },
    input: { backgroundColor: '#2D2D2D', borderWidth: 1, borderColor: '#444', borderRadius: 6, color: '#FFF', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    cancelBtn: { flex: 1, padding: 14, alignItems: 'center', marginRight: 10, borderRadius: 6, backgroundColor: '#333' },
    cancelBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    saveBtn: { flex: 1, padding: 14, alignItems: 'center', marginLeft: 10, borderRadius: 6, backgroundColor: '#D4AF37' },
    saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
