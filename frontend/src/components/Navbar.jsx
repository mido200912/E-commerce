import React, { useState } from 'react'
import { FaShoppingCart, FaSearch, FaTimes, FaBars } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ cartCount, onCartClick, collections = [], onCollectionSelect, onSearch }) {
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const handleCollectionClick = (collectionId) => {
        if (onCollectionSelect) onCollectionSelect(collectionId)
        if (onSearch) onSearch('')
        setShowSearch(false)
        setSearchValue('')
        setShowMobileMenu(false)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (onSearch) onSearch(searchValue.trim())
        if (onCollectionSelect) onCollectionSelect('')
        setShowMobileMenu(false)
    }

    const handleSearchClear = () => {
        setSearchValue('')
        if (onSearch) onSearch('')
        setShowSearch(false)
    }

    const toggleSearch = () => {
        setShowSearch(prev => {
            if (prev) { setSearchValue(''); if (onSearch) onSearch('') }
            return !prev
        })
    }

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setShowMobileMenu(false)
    }

    return (
        <>
            <div className="top-banner">
                <p>رحالة • هوديز فاخرة 100% قطن • شحن لكل مصر</p>
            </div>

            <nav className="navbar">
                <div className="navbar-content">

                    {/* Left: Standard Nav Links */}
                    <ul className="nav-links desktop-nav-links">
                        <li><a onClick={() => scrollToSection('hero')}>الرئيسية</a></li>
                        <li><a onClick={() => scrollToSection('sale')} style={{ color: 'var(--accent-gold)' }}>التخفيضات</a></li>
                        <li><a onClick={() => scrollToSection('best-sellers')}>الأكثر مبيعاً</a></li>
                        <li><a onClick={() => scrollToSection('collections')}>المجموعات</a></li>
                        <li><a onClick={() => scrollToSection('products')}>المنتجات</a></li>
                    </ul>

                    {/* Center: Logo */}
                    <a href="/" className="logo">
                        <span className="logo-text">rahhalah</span>
                    </a>

                    {/* Right: Search + Cart + Mobile Menu */}
                    <ul className="nav-links">
                        <li>
                            <span className="nav-icon" onClick={toggleSearch} title="بحث">
                                {showSearch ? <FaTimes /> : <FaSearch />}
                            </span>
                        </li>
                        <li>
                            <div className="cart-icon" onClick={onCartClick}>
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </div>
                        </li>
                        <li className="mobile-menu-btn">
                            <span className="nav-icon" onClick={() => setShowMobileMenu(true)}>
                                <FaBars />
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Expanding search bar */}
                {showSearch && (
                    <form className="navbar-search" onSubmit={handleSearchSubmit}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="ابحث عن هودي..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            dir="rtl"
                            className="navbar-search-input"
                        />
                        <button type="submit" className="navbar-search-btn">بحث</button>
                        {searchValue && (
                            <button type="button" className="navbar-search-clear" onClick={handleSearchClear}>
                                <FaTimes />
                            </button>
                        )}
                    </form>
                )}
            </nav>

            {/* Mobile Menu Drawer */}
            {showMobileMenu && <div className="overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1999 }} onClick={() => setShowMobileMenu(false)} />}
            <div className={`mobile-drawer ${showMobileMenu ? 'active' : ''}`}>
                <div className="drawer-header">
                    <button className="close-drawer" onClick={() => setShowMobileMenu(false)}><FaTimes /></button>
                    <span className="logo-text" style={{ fontSize: '1.5rem' }}>rahhalah</span>
                </div>
                <ul className="drawer-links">
                    <li><a onClick={() => scrollToSection('hero')}>الرئيسية</a></li>
                    <li><a onClick={() => scrollToSection('sale')} className="sale-link">التخفيضات</a></li>
                    <li><a onClick={() => scrollToSection('best-sellers')}>الأكثر مبيعاً</a></li>
                    <li><a onClick={() => scrollToSection('collections')}>المجموعات</a></li>
                    <li><a onClick={() => scrollToSection('products')}>المنتجات</a></li>
                </ul>
            </div>
        </>
    )
}

export default Navbar
