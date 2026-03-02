import React, { useRef, useState, useEffect } from 'react'
import axios from '../utils/axios'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './CollectionSlider.css'

function CollectionSlider({ collection, onProductClick }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const scrollContainerRef = useRef(null)

    useEffect(() => {
        loadCollectionProducts()

        // Auto-scroll logic
        const interval = setInterval(() => {
            const container = scrollContainerRef.current
            if (container) {
                if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' })
                } else {
                    container.scrollBy({ left: 300, behavior: 'smooth' })
                }
            }
        }, 4000)

        return () => clearInterval(interval)
    }, [collection])

    const loadCollectionProducts = async () => {
        try {
            const response = await axios.get(`/api/products?collection=${collection._id}`)
            setProducts(response.data.data)
        } catch (error) {
            console.error('Error loading collection products:', error)
        } finally {
            setLoading(false)
        }
    }

    const scroll = (direction) => {
        const container = scrollContainerRef.current
        const scrollAmount = 300 // Slightly more than card width + gap
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (loading || products.length === 0) return null

    return (
        <div className="collection-slider-section">
            <div className="slider-header">
                <div className="title-wrapper">
                    <span className="collection-label">COLLECTION</span>
                    <h2 className="collection-title">{collection.name}</h2>
                </div>
                <div className="slider-controls">
                    <button className="slider-btn prev" onClick={() => scroll('left')}>
                        <FaChevronLeft />
                    </button>
                    <button className="slider-btn next" onClick={() => scroll('right')}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            <div className="slider-outer">
                <div className="slider-container" ref={scrollContainerRef}>
                    {products.map(product => (
                        <div
                            key={product._id}
                            className="slider-item"
                            onClick={() => onProductClick(product)}
                        >
                            <div className="slider-image-wrapper">
                                <img
                                    src={product.images[0] || 'https://via.placeholder.com/400x400/00332B/C9A961?text=RAHHALAH'}
                                    alt={product.title}
                                    onLoad={(e) => e.target.classList.add('loaded')}
                                />
                                {product.isOnSale && <div className="sale-tag">SALE</div>}
                            </div>
                            <div className="slider-info">
                                <h3 className="slider-name">{product.title}</h3>
                                <p className="slider-price">LE {product.price}.00</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CollectionSlider
