import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import './Products.css'

function BestSellers({ onProductClick }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadBestSellers()
    }, [])

    const loadBestSellers = async () => {
        try {
            const response = await axios.get('/api/products?sort=popular&limit=4')
            const data = response.data.data || []
            setProducts(data)
        } catch (error) {
            console.error('Error loading best sellers:', error)
        } finally {
            setLoading(false)
        }
    }

    // Completely disappear if no products or loading
    if (loading || products.length === 0) return null

    return (
        <section className="products-section best-sellers">
            <div className="products-header">
                <h2 className="products-title">أكثر المنتجات مبيعاً</h2>
                <p className="subtitle">اكتشف تشكيلتنا الأكثر رواجاً</p>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => onProductClick(product)}
                    >
                        <div className="product-image-wrapper">
                            <img
                                src={product.images[0] || 'https://via.placeholder.com/400x500/171717/D4AF37?text=RAHHALAH'}
                                alt={product.title}
                                className="product-image"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500/171717/D4AF37?text=RAHHALAH' }}
                            />
                            {product.isOnSale && <div className="sale-badge">SALE</div>}
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.title}</h3>
                            <div className="price-container">
                                <span className="product-price">LE {product.price}.00</span>
                                {product.isOnSale && product.originalPrice && (
                                    <span className="original-price">LE {product.originalPrice}.00</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BestSellers
