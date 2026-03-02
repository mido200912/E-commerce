import React, { useState } from 'react'
import { FaShoppingCart, FaSearch, FaTimes } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ cartCount, onCartClick, collections = [], onCollectionSelect, onSearch }) {
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const handleCollectionClick = (collectionId) => {
        if (onCollectionSelect) onCollectionSelect(collectionId)
        if (onSearch) onSearch('')   // clear search when picking collection
        setShowSearch(false)
        setSearchValue('')
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (onSearch) onSearch(searchValue.trim())
        if (onCollectionSelect) onCollectionSelect('')  // clear collection when searching
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

    return (
        <>
            {/* Gold top banner */}
            <div className="top-banner">
                <p>رحالة • هوديز فاخرة 100% قطن • شحن لكل مصر</p>
            </div>

            <nav className="navbar">
                <div className="navbar-content">

                    {/* Left: Collections */}
                    <ul className="nav-links">
                        <li><a onClick={() => handleCollectionClick('')}>الكل</a></li>
                        {collections.slice(0, 3).map(col => (
                            <li key={col._id}>
                                <a onClick={() => handleCollectionClick(col._id)} title={col.name}>
                                    {col.name.length > 14 ? `${col.name.substring(0, 14)}…` : col.name}
                                </a>
                            </li>
                        ))}
                        {collections.length > 3 && (
                            <li className="dropdown">
                                <a>المزيد ▾</a>
                                <ul className="dropdown-content">
                                    {collections.slice(3).map(col => (
                                        <li key={col._id}>
                                            <a onClick={() => handleCollectionClick(col._id)}>{col.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>

                    {/* Center: Logo */}
                    <a href="/" className="logo">
                        <span className="logo-text">rahhalah</span>
                    </a>

                    {/* Right: Search + Cart */}
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
        </>
    )
}

export default Navbar
