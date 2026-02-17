import React from 'react'
import './CartModal.css'

function CartModal({ cart, onClose, onRemoveItem, onCheckout }) {
    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    }

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>السلة</h2>
                    <button className="close-modal" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="empty-cart-message">السلة فارغة</p>
                    ) : (
                        <>
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <img
                                        src={item.product.images?.[0] || 'https://via.placeholder.com/80x80/1a1a1a/d4af37?text=رحاله'}
                                        alt={item.product.title}
                                        className="cart-item-image"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/80x80/1a1a1a/d4af37?text=رحاله'}
                                    />
                                    <div className="cart-item-info">
                                        <h4 className="cart-item-title">{item.product.title}</h4>
                                        {item.size && <p className="cart-item-detail">المقاس: {item.size}</p>}
                                        {item.color && <p className="cart-item-detail">اللون: {item.color}</p>}
                                        <p className="cart-item-detail">الكمية: {item.quantity}</p>
                                        <p className="cart-item-price">{item.product.price * item.quantity} جنيه</p>
                                    </div>
                                    <button
                                        className="btn btn-remove"
                                        onClick={() => onRemoveItem(index)}
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}

                            <div className="cart-total">
                                <p className="total-label">المجموع: <span className="total-amount">{calculateTotal()} جنيه</span></p>
                                <button className="btn btn-primary" onClick={onCheckout}>
                                    إتمام الطلب
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartModal
