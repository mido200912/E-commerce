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
        const cartItem = {
            product: product,
            quantity: 1,
            size: product.sizes?.[0] || null,
            color: product.colors?.[0] || null
        }
        onAddToCart(cartItem)
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
                            <div className="product-image-wrapper">
                                <img
                                    src={product.images[0] || 'https://via.placeholder.com/400x400/000000/FFD700?text=RAHHALAH'}
                                    alt={product.title}
                                    className="product-image"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x400/000000/FFD700?text=RAHHALAH'}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.title}</h3>
                                <p className="product-price">LE {product.price}.00</p>
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
