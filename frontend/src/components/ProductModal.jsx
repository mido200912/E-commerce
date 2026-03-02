import React, { useState } from 'react'
import './ProductModal.css'

function ProductModal({ product, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [mainImage, setMainImage] = useState(product?.images?.[0] || '')

    if (!product) return null

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('يرجى اختيار المقاس');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert('يرجى اختيار اللون');
            return;
        }
        if (product.stock !== undefined && quantity > product.stock) {
            alert('عذراً، الكمية المطلوبة غير متوفرة في المخزن');
            return;
        }

        const cartItem = {
            product: product,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        }
        onAddToCart(cartItem)
        onClose()
    }

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product.title}</h2>
                    <button className="close-modal" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-product-content">
                    <div className="product-images">
                        <img
                            src={mainImage || 'https://via.placeholder.com/600x700/1a1a1a/d4af37?text=رحاله'}
                            alt={product.title}
                            className="main-image"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/600x700/1a1a1a/d4af37?text=رحاله'}
                        />

                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-images">
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                                        onClick={() => setMainImage(img)}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="product-description-full">{product.description}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <p className="product-price-large" style={{ margin: 0 }}>{product.price} جنيه</p>
                        {product.isOnSale && product.originalPrice && (
                            <p className="product-original-price" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>
                                {product.originalPrice} جنيه
                            </p>
                        )}
                        {product.isOnSale && (
                            <span className="discount-badge" style={{ background: 'var(--primary-gold)', color: 'var(--bg-primary)', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                التخفيضات
                            </span>
                        )}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="form-group">
                            <label>المقاس:</label>
                            <select
                                className="form-control"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                <option value="">اختر المقاس</option>
                                {product.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div className="form-group">
                            <label>اللون:</label>
                            <select
                                className="form-control"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            >
                                <option value="">اختر اللون</option>
                                {product.colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>الكمية:</span>
                            {product.stock !== undefined && (
                                <span style={{ color: product.stock > 0 ? 'var(--primary-gold)' : 'var(--text-danger)', fontSize: '0.85rem' }}>
                                    {product.stock > 0 ? `متوفر في المخزن: ${product.stock}` : 'نفذت الكمية'}
                                </span>
                            )}
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1)))}
                            min="1"
                            max={product.stock}
                            disabled={!product.stock || product.stock <= 0}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                        disabled={!product.stock || product.stock <= 0}
                    >
                        {product.stock > 0 ? 'أضف للسلة' : 'غير متوفر حالياً'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
