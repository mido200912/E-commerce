import React, { useState, useEffect } from 'react'
import axios from '../utils/axios';
import './Collections.css'

function Collections({ onFilterByCollection }) {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCollections()
    }, [])

    const loadCollections = async () => {
        try {
            const response = await axios.get('/api/collections')
            setCollections(response.data.data)
        } catch (error) {
            console.error('Error loading collections:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCollectionClick = (collectionId) => {
        onFilterByCollection(collectionId)
        const element = document.getElementById('products')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <section className="container" id="collections">
                <div className="section-header">
                    <h2>المجموعات</h2>
                    <p>اختر من مجموعاتنا المميزة</p>
                </div>
                <div className="loading-container">
                    <div className="loading"></div>
                </div>
            </section>
        )
    }

    return (
        <section className="container" id="collections">
            <div className="section-header">
                <h2>المجموعات</h2>
                <p>اختر من مجموعاتنا المميزة</p>
            </div>
            <div className="product-grid">
                {collections.length === 0 ? (
                    <p className="empty-message">لا توجد مجموعات متاحة حالياً</p>
                ) : (
                    collections.map(collection => (
                        <div
                            key={collection._id}
                            className="product-card collection-card"
                            onClick={() => handleCollectionClick(collection._id)}
                        >
                            <div className="product-info">
                                <h3 className="product-title">{collection.name}</h3>
                                <p className="product-description">{collection.description || ''}</p>
                                <button className="btn btn-secondary">عرض المنتجات</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default Collections
