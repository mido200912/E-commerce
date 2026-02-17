import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios';
import './AdminCommon.css'

function CollectionsManager() {
    const [collections, setCollections] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(false)

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/collections', {
                name: formData.name,
                description: formData.description
            })
            setShowModal(false)
            setFormData({ name: '', description: '' })
            loadCollections()
        } catch (error) {
            console.error('Error adding collection:', error)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذه المجموعة؟')) return
        try {
            await axios.delete(`/api/collections/${id}`)
            loadCollections()
        } catch (error) {
            console.error('Error deleting collection:', error)
        }
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
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + إضافة مجموعة جديدة
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : collections.length === 0 ? (
                <div className="empty-state">
                    <h3>لا يوجد مجموعات حالياً</h3>
                    <p>قم بإضافة مجموعة جديدة لبدء تنظيم منتجاتك</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {collections.map(collection => (
                        <div className="card" key={collection._id}>
                            <div className="card-content">
                                <h3 className="card-title">{collection.name}</h3>
                                <p className="card-description">{collection.description || 'لا يوجد وصف'}</p>
                                <div className="order-date" style={{ marginTop: '1rem' }}>
                                    تم الإنشاء: {formatDate(collection.createdAt)}
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(collection._id)}
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>إضافة مجموعة جديدة</h3>
                        </div>
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
                                    onClick={() => setShowModal(false)}
                                >
                                    إلغاء
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    حفظ المجموعة
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
