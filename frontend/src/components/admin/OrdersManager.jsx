import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios';
import './AdminCommon.css'

function OrdersManager() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/orders')
            setOrders(response.data.data)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus })
            loadOrders()
        } catch (error) {
            console.error('Error updating order status:', error)
            alert('حدث خطأ أثناء تحديث الحالة')
        }
    }

    const handleDownloadPDF = async (orderId) => {
        try {
            const response = await axios.get(`/api/orders/${orderId}/pdf`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `order-${orderId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading PDF:', error)
            alert('حدث خطأ أثناء تحميل الملف')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusInfo = (status) => {
        const statuses = {
            'pending': { label: 'قيد الانتظار', class: 'status-pending' },
            'confirmed': { label: 'مؤكد', class: 'status-process' },
            'processing': { label: 'جاري التجهيز', class: 'status-process' },
            'shipped': { label: 'تم الشحن', class: 'status-process' },
            'delivered': { label: 'تم التوصيل', class: 'status-delivered' },
            'cancelled': { label: 'ملغي', class: 'status-cancelled' }
        }
        return statuses[status] || statuses['pending']
    }

    return (
        <section className="admin-section">
            <div className="section-header">
                <h2>إدارة الطلبات</h2>
                <div className="text-secondary">
                    عدد الطلبات: {orders.length}
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <h3>لا توجد طلبات بعد</h3>
                    <p>الطلبات الجديدة ستظهر هنا</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const statusInfo = getStatusInfo(order.status)
                        return (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>
                                            طلب <span className="order-id">#{order._id.substring(order._id.length - 8)}</span>
                                        </h3>
                                        <div className="order-date">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <span className={`badge ${statusInfo.class}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div className="order-info-grid">
                                    <div className="info-item">
                                        <strong>بيانات العميل</strong>
                                        {order.customerName}<br />
                                        {order.phone}<br />
                                        {order.email && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.email}</span>}
                                    </div>

                                    <div className="info-item">
                                        <strong>عنوان التوصيل</strong>
                                        {order.governorate}<br />
                                        {order.address}<br />
                                        {order.paymentMethod === 'vodafone-cash' ? 'فودافون كاش' : 'الدفع عند الاستلام'}
                                    </div>
                                </div>

                                <div className="order-items">
                                    <div className="order-items-title">المنتجات المطلوبة</div>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                <span>
                                                    <span style={{ fontWeight: '600' }}>{item.product?.title || 'منتج غير متوفر'}</span>
                                                    {(item.size || item.color) && (
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                                                            ({item.size} {item.color && `- ${item.color}`})
                                                        </span>
                                                    )}
                                                </span>
                                                <span>
                                                    {item.quantity} × {item.price} ج.م
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="order-totals">
                                    الإجمالي: {order.total} ج.م
                                </div>

                                <div className="order-actions">
                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="confirmed">مؤكد</option>
                                        <option value="processing">جاري التجهيز</option>
                                        <option value="shipped">تم الشحن</option>
                                        <option value="delivered">تم التوصيل</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>

                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => {
                                            const itemsText = order.items.map(i => `- ${i.product?.title} (الكمية: ${i.quantity})`).join('\n');
                                            const text = encodeURIComponent(`مرحباً ${order.customerName}،\nتفاصيل طلبك رقم #${order._id.substring(order._id.length - 8)}:\n${itemsText}\nالإجمالي: ${order.total} ج.م\nتم استلام طلبك وجاري تجهيزه.`);
                                            window.open(`https://wa.me/2${order.phone}?text=${text}`, '_blank');
                                        }}
                                        title="إرسال فاتورة واتساب للعميل"
                                        style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
                                    >
                                        💬 واتساب
                                    </button>

                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleDownloadPDF(order._id)}
                                        title="طباعة الفاتورة"
                                    >
                                        📄 طباعة
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default OrdersManager
