import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios';
import './AdminCommon.css'

function ProductsManager() {
    const [products, setProducts] = useState([])
    const [collections, setCollections] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        collection: '',
        price: '',
        originalPrice: '',
        isOnSale: false,
        discountPercentage: '',
        images: [''],
        sizes: '',
        colors: ''
    })

    useEffect(() => {
        loadProducts()
        loadCollections()
    }, [])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/products')
            setProducts(response.data.data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections')
            setCollections(response.data.data)
        } catch (error) {
            console.error('Error loading collections:', error)
        }
    }

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData({ ...formData, images: newImages })
    }

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] })
    }

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        setFormData({ ...formData, images: newImages })
    }

    // Auto-calculate discount
    useEffect(() => {
        if (formData.isOnSale && formData.originalPrice && formData.discountPercentage) {
            // If percentage changes, update price
            const original = parseFloat(formData.originalPrice);
            const percent = parseFloat(formData.discountPercentage);
            if (!isNaN(original) && !isNaN(percent)) {
                // Don't auto-update if we are just loading form data
                // This is complex, so let's keep it simple: manual entry
            }
        }
    }, [formData.discountPercentage]);

    const handleEdit = (product) => {
        setEditMode(true)
        setCurrentId(product._id)
        setFormData({
            title: product.title,
            description: product.description,
            collection: product.collection?._id || product.collection,
            price: product.price,
            originalPrice: product.originalPrice || '',
            isOnSale: product.isOnSale || false,
            discountPercentage: product.discountPercentage || '',
            images: product.images && product.images.length > 0 ? product.images : [''],
            sizes: product.sizes ? product.sizes.join(', ') : '',
            colors: product.colors ? product.colors.join(', ') : ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Validate required fields
            if (!formData.title || !formData.price || !formData.collection) {
                alert('يرجى ملء جميع الحقول المطلوبة')
                return
            }

            const productData = {
                title: formData.title,
                description: formData.description,
                collection: formData.collection,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                isOnSale: formData.isOnSale,
                discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
                images: formData.images.filter(img => img && img.trim() !== ''),
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [],
                colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c !== '') : []
            }

            if (editMode && currentId) {
                await axios.put(`/api/products/${currentId}`, productData)
            } else {
                await axios.post('/api/products', productData)
            }

            setShowModal(false)
            resetForm()
            loadProducts()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('حدث خطأ أثناء حفظ المنتج')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
        try {
            await axios.delete(`/api/products/${id}`)
            loadProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const resetForm = () => {
        setEditMode(false)
        setCurrentId(null)
        setFormData({
            title: '',
            description: '',
            collection: '',
            price: '',
            originalPrice: '',
            isOnSale: false,
            discountPercentage: '',
            images: [''],
            sizes: '',
            colors: ''
        })
    }

    return (
        <section className="admin-section">
            <div className="section-header">
                <h2>إدارة المنتجات</h2>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + إضافة منتج جديد
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <h3>لا يوجد منتجات حالياً</h3>
                    <p>قم بإضافة منتجك الأول لبدء البيع</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {products.map(product => (
                        <div className="card" key={product._id}>
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300?text=No+Image'}
                                alt={product.title}
                                className="card-image"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error' }}
                            />
                            {product.isOnSale && (
                                <div style={{
                                    position: 'absolute', top: '10px', left: '10px',
                                    background: 'var(--primary-gold)', color: '#fff',
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    خصم
                                </div>
                            )}
                            <div className="card-content">
                                <h3 className="card-title">{product.title}</h3>
                                <div className="card-description">
                                    <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>
                                        {product.collection?.name || 'غير مصنف'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                            {product.price} ج.م
                                        </span>
                                        {product.isOnSale && product.originalPrice && (
                                            <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '8px' }}>
                                                {product.originalPrice} ج.م
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {product.sizes?.length || 0} مقاسات
                                    </span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleEdit(product)}
                                >
                                    تعديل
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(product._id)}
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
                            <h3>{editMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>عنوان المنتج *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="مثال: تيشيرت قطني فاخر"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.isOnSale}
                                            onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                                            style={{ width: 'auto', marginLeft: '0.5rem' }}
                                        />
                                        تفعيل الخصم (Sale)
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>السعر النهائي (بعد الخصم) *</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {formData.isOnSale && (
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>السعر الأصلي (قبل الخصم)</label>
                                            <input
                                                type="number"
                                                value={formData.originalPrice}
                                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                                min="0"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>المجموعة *</label>
                                    <select
                                        value={formData.collection}
                                        onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                                        required
                                    >
                                        <option value="">اختر المجموعة</option>
                                        {collections.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>الوصف</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        placeholder="تفاصيل المنتج..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>روابط الصور</label>
                                    {formData.images.map((img, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input
                                                type="url"
                                                value={img}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeImageField(index)}
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={addImageField}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        + إضافة رابط صورة
                                    </button>

                                    {formData.images[0] && (
                                        <img
                                            src={formData.images[0]}
                                            className="product-image-preview"
                                            alt="Preview"
                                            onError={(e) => e.target.style.display = 'none'}
                                            onLoad={(e) => e.target.style.display = 'block'}
                                        />
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>المقاسات (مفصولة بفاصلة)</label>
                                    <input
                                        type="text"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                        placeholder="S, M, L, XL, XXL"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>الألوان (مفصولة بفاصلة)</label>
                                    <input
                                        type="text"
                                        value={formData.colors}
                                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                        placeholder="أسود, أبيض, رمادي"
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
                                    {editMode ? 'حفظ التعديلات' : 'حفظ المنتج'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ProductsManager
