import React, { useState, useEffect, useCallback } from 'react'
import axios from '../utils/axios'
import { FaSearch, FaTimes } from 'react-icons/fa'
import './Products.css'

function Products({ selectedCollection, searchQuery, onAddToCart, onProductClick }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Reload whenever collection or search changes
    useEffect(() => {
        loadProducts()
    }, [selectedCollection, searchQuery])

    const loadProducts = async () => {
        setLoading(true)
        try {
            let url = '/api/products'
            const params = []
            if (selectedCollection) params.push(`collection=${selectedCollection}`)
            if (params.length) url += '?' + params.join('&')

            const response = await axios.get(url)
            let data = response.data.data || []

            // Client-side search filter
            if (searchQuery && searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase()
                data = data.filter(p =>
                    p.title?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
                )
            }

            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const quickAddToCart = (e, product) => {
        e.stopPropagation()
        if ((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) {
            onProductClick(product)
        } else {
            onAddToCart({ product, quantity: 1, size: null, color: null })
        }
    }

    const PLACEHOLDER = 'https://via.placeholder.com/400x500/171717/D4AF37?text=RAHHALAH'

    // Get active filter label
    const getTitle = () => {
        if (searchQuery?.trim()) return `نتائج البحث عن "${searchQuery}"`
        return 'كل الهوديز'
    }

    const getSubtitle = () => {
        if (searchQuery?.trim()) return `${products.length} منتج`
        return 'تشكيلة كاملة من الهوديز الفاخرة'
    }

    return (
        <section className="products-section" id="products">
            <div className="products-header">
                <h2 className="products-title">{getTitle()}</h2>
                <p className="subtitle">{loading ? '...' : getSubtitle()}</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading"></div>
                </div>
            ) : (
                <div className="products-grid">
                    {products.length === 0 ? (
                        <p className="no-products">
                            {searchQuery ? `لا توجد نتائج لـ "${searchQuery}"` : 'لا توجد منتجات حالياً'}
                        </p>
                    ) : (
                        products.map(product => (
                            <div
                                key={product._id}
                                className="product-card"
                                onClick={() => onProductClick(product)}
                            >
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.images?.[0] || PLACEHOLDER}
                                        alt={product.title}
                                        className="product-image"
                                        onError={(e) => { e.target.src = PLACEHOLDER }}
                                    />
                                    {product.isOnSale && (
                                        <div className="sale-badge">
                                            -{product.discountPercentage
                                                ? product.discountPercentage
                                                : Math.round((1 - product.price / product.originalPrice) * 100)
                                            }%
                                        </div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.title}</h3>
                                    <div className="price-container">
                                        <span className="product-price">LE {product.price}</span>
                                        {product.isOnSale && product.originalPrice && (
                                            <span className="original-price">LE {product.originalPrice}</span>
                                        )}
                                    </div>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={(e) => quickAddToCart(e, product)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'نفذ المخزون' : 'أضف للسلة'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>
    )
}

export default Products
