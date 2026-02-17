import React, { useState } from 'react'
import axios from 'axios'
import './CheckoutModal.css'

const shippingRates = {
    'القاهرة': 60,
    'الجيزة': 65,
    'القاهرة الجديدة': 70,
    'الإسكندرية': 75,
    'الدلتا': 75,
    'الصعيد': 85
}

function CheckoutModal({ cart, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        governorate: '',
        paymentMethod: ''
    })
    const [shippingCost, setShippingCost] = useState(0)

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'governorate') {
            setShippingCost(shippingRates[value] || 0)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const orderData = {
            ...formData,
            shippingCost,
            total: calculateSubtotal() + shippingCost,
            items: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            }))
        }

        try {
            await axios.post('/api/orders', orderData)
            onSuccess()
        } catch (error) {
            console.error('Error submitting order:', error)
            alert('حدث خطأ، حاول مرة أخرى')
        }
    }

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>إتمام الطلب</h2>
                    <button className="close-modal" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label>الاسم الكامل *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>رقم الهاتف *</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>العنوان بالتفصيل *</label>
                        <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>المحافظة *</label>
                        <select
                            className="form-control"
                            name="governorate"
                            value={formData.governorate}
                            onChange={handleChange}
                            required
                        >
                            <option value="">اختر المحافظة</option>
                            <option value="القاهرة">القاهرة - 60 جنيه</option>
                            <option value="الجيزة">الجيزة - 65 جنيه</option>
                            <option value="القاهرة الجديدة">مدن القاهرة الجديدة - 70 جنيه</option>
                            <option value="الإسكندرية">الإسكندرية - 75 جنيه</option>
                            <option value="الدلتا">محافظات الدلتا - 75 جنيه</option>
                            <option value="الصعيد">الصعيد - 85 جنيه</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>طريقة الدفع *</label>
                        <select
                            className="form-control"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="">اختر طريقة الدفع</option>
                            <option value="vodafone-cash">فودافون كاش</option>
                            <option value="cash-on-delivery">الدفع عند الاستلام</option>
                        </select>
                    </div>

                    <div className="order-summary">
                        <div className="summary-row">
                            <span>المنتجات:</span>
                            <span className="summary-value">{calculateSubtotal()} جنيه</span>
                        </div>
                        <div className="summary-row">
                            <span>الشحن:</span>
                            <span className="summary-value">{shippingCost} جنيه</span>
                        </div>
                        <hr className="summary-divider" />
                        <div className="summary-row summary-total">
                            <span>الإجمالي:</span>
                            <span className="summary-value">{calculateSubtotal() + shippingCost} جنيه</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        تأكيد الطلب
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CheckoutModal
