import React, { useState, useEffect } from 'react'
import axios from '../utils/axios';
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Collections from '../components/Collections'
import Products from '../components/Products'
import ProductModal from '../components/ProductModal'
import CartModal from '../components/CartModal'
import CheckoutModal from '../components/CheckoutModal'
import Footer from '../components/Footer'
import './HomePage.css'

function HomePage() {
    const [cart, setCart] = useState([])
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [showCheckout, setShowCheckout] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
        // Load collections
        loadCollections()

        // Add scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed')
                }
            })
        }, observerOptions)

        // Observe all scroll-reveal elements
        const revealElements = document.querySelectorAll('.scroll-reveal')
        revealElements.forEach(el => observer.observe(el))

        return () => {
            revealElements.forEach(el => observer.unobserve(el))
        }
    }, [])

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections')
            setCollections(response.data.data)
        } catch (error) {
            console.error('Error loading collections:', error)
        }
    }

    const handleAddToCart = (cartItem) => {
        setCart(prev => [...prev, cartItem])
        showNotification('تم إضافة المنتج للسلة')
    }

    const handleUpdateCart = (updatedCart) => {
        setCart(updatedCart)
    }

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index))
    }

    const handleFilterByCollection = (collectionId) => {
        setSelectedCollection(collectionId)
    }

    const handleProductClick = (product) => {
        setSelectedProduct(product)
    }

    const handleCheckout = () => {
        setShowCart(false)
        setShowCheckout(true)
    }

    const calculateCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const showNotification = (message) => {
        const notification = document.createElement('div')
        notification.className = 'notification'
        notification.textContent = message
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.classList.add('fade-out')
            setTimeout(() => {
                document.body.removeChild(notification)
            }, 300)
        }, 2000)
    }

    return (
        <div className="homepage">
            <Navbar
                cartCount={calculateCartCount()}
                onCartClick={() => setShowCart(true)}
            />

            <Hero />

            <Products
                selectedCollection={selectedCollection}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                collections={collections}
            />

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            {showCart && (
                <CartModal
                    cart={cart}
                    onClose={() => setShowCart(false)}
                    onUpdateCart={handleUpdateCart}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={handleCheckout}
                />
            )}

            {showCheckout && (
                <CheckoutModal
                    cart={cart}
                    onClose={() => setShowCheckout(false)}
                    onSuccess={() => {
                        setShowCheckout(false)
                        setCart([])
                        setShowSuccess(true)
                        setTimeout(() => setShowSuccess(false), 3000)
                    }}
                />
            )}

            {showSuccess && (
                <div className="modal active">
                    <div className="modal-content success-modal">
                        <div className="success-icon">✓</div>
                        <h2 className="success-title">تم إتمام الطلب بنجاح!</h2>
                        <p className="success-message">
                            شكراً لك! سيتم التواصل معك قريباً لتأكيد الطلب.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowSuccess(false)}
                        >
                            حسناً
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default HomePage
