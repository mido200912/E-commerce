import React, { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaPlus, FaFolder } from 'react-icons/fa'
import axios from '../../utils/axios';
import './AdminCommon.css'

function CollectionsManager() {
    const [collections, setCollections] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [formData, setFormData] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        loadCollections()
    }, [])

    const loadCollections = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/collections')
            setCollections(response.data.data)
        } catch (error) {
            console.error('Error loading collections:', error)
        } finally {
            setLoading(false)
        }
    }

    const openAddModal = () => {
        setEditMode(false)
        setEditId(null)
        setFormData({ name: '', description: '' })
        setErrorMsg('')
        setShowModal(true)
    }

    const openEditModal = (collection) => {
        setEditMode(true)
        setEditId(collection._id)
        setFormData({ name: collection.name, description: collection.description || '' })
        setErrorMsg('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setErrorMsg('')
        setFormData({ name: '', description: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        try {
            if (editMode) {
                await axios.put(`/api/collections/${editId}`, {
                    name: formData.name,
                    description: formData.description
                })
                showSuccess('تم تعديل المجموعة بنجاح ✅')
            } else {
                await axios.post('/api/collections', {
                    name: formData.name,
                    description: formData.description
                })
                showSuccess('تم إضافة المجموعة بنجاح ✅')
            }
            closeModal()
            loadCollections()
        } catch (error) {
            const msg = error.response?.data?.message || 'حدث خطأ، حاول مرة أخرى'
            setErrorMsg(msg)
        }
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`هل أنت متأكد من حذف مجموعة "${name}"؟`)) return
        try {
            await axios.delete(`/api/collections/${id}`)
            showSuccess('تم حذف المجموعة بنجاح ✅')
            loadCollections()
        } catch (error) {
            const msg = error.response?.data?.message || 'حدث خطأ أثناء الحذف'
            // Show the backend error (e.g. "cannot delete collection with X products")
            alert('❌ ' + msg)
        }
    }

    const showSuccess = (msg) => {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <section className="admin-section">
            <div className="section-header">
                <h2>إدارة المجموعات</h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <FaPlus /> إضافة مجموعة جديدة
                </button>
            </div>

            {/* Success Message */}
            {successMsg && (
                <div style={{
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.4)',
                    color: '#4caf50',
                    padding: '0.9rem 1.25rem',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {successMsg}
                </div>
            )}

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : collections.length === 0 ? (
                <div className="empty-state">
                    <FaFolder style={{ fontSize: '3rem', color: 'rgba(212,175,55,0.2)', marginBottom: '1rem', display: 'block' }} />
                    <h3>لا يوجد مجموعات حالياً</h3>
                    <p>قم بإضافة مجموعة جديدة لبدء تنظيم منتجاتك</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {collections.map(collection => (
                        <div className="card" key={collection._id}>
                            <div className="card-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <FaFolder style={{ color: '#D4AF37', fontSize: '1.2rem', flexShrink: 0 }} />
                                    <h3 className="card-title" style={{ margin: 0 }}>{collection.name}</h3>
                                </div>
                                <p className="card-description">{collection.description || 'لا يوجد وصف'}</p>
                                <div className="order-date" style={{ marginTop: '1rem' }}>
                                    تم الإنشاء: {formatDate(collection.createdAt)}
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => openEditModal(collection)}
                                    title="تعديل المجموعة"
                                >
                                    <FaEdit /> تعديل
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(collection._id, collection.name)}
                                    title="حذف المجموعة"
                                >
                                    <FaTrash /> حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}</h3>
                        </div>

                        {errorMsg && (
                            <div style={{
                                background: 'rgba(220,38,38,0.1)',
                                border: '1px solid rgba(220,38,38,0.3)',
                                color: '#ef4444',
                                padding: '0.8rem 1rem',
                                borderRadius: '2px',
                                marginBottom: '1.5rem',
                                fontSize: '0.85rem'
                            }}>
                                ❌ {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>اسم المجموعة</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="مثال: ملابس شتوية"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الوصف (اختياري)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="وصف مختصر للمجموعة..."
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    إلغاء
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editMode ? '💾 حفظ التعديلات' : '✚ حفظ المجموعة'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default CollectionsManager
