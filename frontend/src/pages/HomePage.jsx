import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BestSellers from '../components/BestSellers'
import CollectionSlider from '../components/CollectionSlider'
import Collections from '../components/Collections'
import Products from '../components/Products'
import AIChat from '../components/AIChat'
import ProductModal from '../components/ProductModal'
import CartModal from '../components/CartModal'
import CheckoutModal from '../components/CheckoutModal'
import Footer from '../components/Footer'
import './HomePage.css'

function HomePage() {
    const [cart, setCart] = useState([])
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [showCheckout, setShowCheckout] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) setCart(JSON.parse(savedCart))
        loadCollections()
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections')
            setCollections(response.data.data || [])
        } catch (error) {
            console.error('Error loading collections:', error)
        }
    }

    const handleAddToCart = (cartItem) => {
        setCart(prev => [...prev, cartItem])
        showToast('✓ تم إضافة المنتج للسلة')
    }

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpdateCart = (updatedCart) => {
        setCart(updatedCart)
    }

    const handleCollectionSelect = (collectionId) => {
        setSelectedCollection(collectionId)
        setSearchQuery('')
        // scroll to products section
        setTimeout(() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        setSelectedCollection('')
        if (query) {
            setTimeout(() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
    }

    const handleProductClick = (product) => setSelectedProduct(product)

    const handleCheckout = () => {
        setShowCart(false)
        setShowCheckout(true)
    }

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    const showToast = (message) => {
        const toast = document.createElement('div')
        toast.className = 'notification'
        toast.textContent = message
        document.body.appendChild(toast)
        setTimeout(() => {
            toast.classList.add('fade-out')
            setTimeout(() => toast.parentNode?.removeChild(toast), 300)
        }, 2000)
    }

    // Show sliders/bestsellers only when no filter active
    const isFiltered = selectedCollection || searchQuery

    return (
        <div className="homepage">
            <Navbar
                cartCount={cartCount}
                onCartClick={() => setShowCart(true)}
                collections={collections}
                onCollectionSelect={handleCollectionSelect}
                onSearch={handleSearch}
            />

            <Hero />

            {/* Sale Section */}
            {!isFiltered && (
                <CollectionSlider
                    collection={{ _id: 'sale', name: 'التخفيضات 🏷️' }}
                    onProductClick={handleProductClick}
                />
            )}

            {/* Best Sellers – only when no filter */}
            {!isFiltered && (
                <BestSellers onProductClick={handleProductClick} />
            )}

            {/* Collection Categories Horizontal list */}
            {!isFiltered && collections.length > 0 && (
                <Collections onFilterByCollection={handleCollectionSelect} />
            )}

            {/* All Products – always visible */}
            <Products
                selectedCollection={selectedCollection}
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <AIChat />

            {/* Modals */}
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
                        <p className="success-message">شكراً لك! سيتم التواصل معك قريباً 🙏</p>
                        <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
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
