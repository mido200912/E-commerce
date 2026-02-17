import React, { useState } from 'react'
import './ProductModal.css'

function ProductModal({ product, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
    const [mainImage, setMainImage] = useState(product?.images?.[0] || '')

    if (!product) return null

    const handleAddToCart = () => {
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

                    <p className="product-price-large">{product.price} جنيه</p>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="form-group">
                            <label>المقاس:</label>
                            <select
                                className="form-control"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
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
                                {product.colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>الكمية:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                        />
                    </div>

                    <button className="btn btn-primary" onClick={handleAddToCart}>
                        أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
