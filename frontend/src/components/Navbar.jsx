import React from 'react'
import { FaShoppingCart, FaSearch } from 'react-icons/fa'
import './Navbar.css'

function Navbar({ cartCount, onCartClick }) {
    const logoUrl = 'C:/Users/mido2/.gemini/antigravity/brain/55ff0f4d-8c1b-4852-b3ad-7567544a2cec/uploaded_media_1771265308057.png'

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            <div className="top-banner">
                <p>Welcome to our store</p>
            </div>
            <nav className="navbar">
                <div className="navbar-content">
                    <ul className="nav-links">
                        <li><a onClick={() => scrollToSection('home')}>Home</a></li>
                        <li><a onClick={() => scrollToSection('collections')}>Catalog</a></li>
                        <li><a onClick={() => scrollToSection('products')}>Contact</a></li>
                    </ul>

                    <a href="/" className="logo">
                        <span className="logo-text">rahhalah</span>
                    </a>

                    <ul className="nav-links">
                        <li><FaSearch style={{ cursor: 'pointer' }} /></li>
                        <li>
                            <div className="cart-icon" onClick={onCartClick}>
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar
