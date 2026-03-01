import React, { useState, useEffect } from 'react'
import axios from '../utils/axios';
import './Products.css'

function Products({ selectedCollection, onAddToCart, onProductClick, collections }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterCollection, setFilterCollection] = useState(selectedCollection || '')

    useEffect(() => {
        loadProducts(filterCollection)
    }, [filterCollection])

    useEffect(() => {
        if (selectedCollection !== filterCollection) {
            setFilterCollection(selectedCollection)
        }
    }, [selectedCollection])

    const loadProducts = async (collectionId = '') => {
        setLoading(true)
        try {
            const url = collectionId ? `/api/products?collection=${collectionId}` : '/api/products'
            const response = await axios.get(url)
            setProducts(response.data.data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const quickAddToCart = (e, product) => {
        e.stopPropagation()
        if ((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) {
            // Open modal to choose size and color
            onProductClick(product)
        } else {
            const cartItem = {
                product: product,
                quantity: 1,
                size: null,
                color: null
            }
            onAddToCart(cartItem)
        }
    }

    if (loading) {
        return (
            <section className="products-section" id="products">
                <div className="products-header">
                    <div className="products-background-text">HOODIE</div>
                    <h2 className="products-title">رحله في عالم الأنيمي</h2>
                </div>
                <div className="loading-container">
                    <div className="loading"></div>
                </div>
            </section>
        )
    }

    return (
        <section className="products-section" id="products">
            <div className="products-header">
                <div className="products-background-text">HOODIE</div>
                <h2 className="products-title">رحله في عالم الأنيمي</h2>
            </div>

            <div className="products-grid">
                {products.length === 0 ? (
                    <p className="no-products">لا توجد منتجات متاحة حالياً</p>
                ) : (
                    products.map(product => (
                        <div
                            key={product._id}
                            className="product-card"
                            onClick={() => onProductClick(product)}
                        >
                            <div className="product-image-wrapper" style={{ position: 'relative' }}>
                                <img
                                    src={product.images[0] || 'https://via.placeholder.com/400x400/000000/FFD700?text=RAHHALAH'}
                                    alt={product.title}
                                    className="product-image"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x400/000000/FFD700?text=RAHHALAH'}
                                />
                                {product.isOnSale && (
                                    <div style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        background: 'var(--primary-gold)', color: 'var(--bg-primary)',
                                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 1
                                    }}>
                                        خصم
                                    </div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.title}</h3>
                                {product.description && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        margin: '0.25rem 0 0.5rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {product.description}
                                    </p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <p className="product-price" style={{ margin: 0 }}>LE {product.price}.00</p>
                                    {product.isOnSale && product.originalPrice && (
                                        <p style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                            LE {product.originalPrice}.00
                                        </p>
                                    )}
                                </div>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={(e) => quickAddToCart(e, product)}
                                >
                                    Add to cart
                                </button>
                                <div className="product-barcode">
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                    <div className="barcode-line"></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default Products
