import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import './Footer.css'

function Footer() {
    const [email, setEmail] = useState('')
    const { theme } = useTheme()

    const handleNewsletterSubmit = (e) => {
        e.preventDefault()
        // Handle newsletter subscription logic here
        console.log('Newsletter subscription:', email)
        setEmail('')
    }

    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="newsletter-section">
                    <h2 className="newsletter-title">Join our email list</h2>
                    <p className="newsletter-description">
                        Get exclusive deals and early access to new products.
                    </p>
                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            className="newsletter-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="newsletter-btn">
                            →
                        </button>
                    </form>
                </div>

                <div className="footer-bottom">
                    <div className="footer-info">
                        <p>© {currentYear} {theme?.siteName || 'Rahhalah'}. Powered by Rahhalah</p>

                        {/* Display Contact Info if available */}
                        <div className="footer-contacts" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {theme?.email && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <FaEnvelope size={12} />
                                    <a href={`mailto:${theme.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{theme.email}</a>
                                </div>
                            )}
                            {theme?.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaPhone size={12} />
                                    <a href={`tel:${theme.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{theme.phone}</a>
                                </div>
                            )}
                        </div>

                        <Link to="/admin/login" className="admin-link" style={{ marginTop: '1rem', display: 'inline-block' }}>Admin Login</Link>
                    </div>

                    <div className="social-links">
                        {theme?.facebook && (
                            <a href={theme.facebook.startsWith('http') ? theme.facebook : `https://${theme.facebook}`}
                                target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                                <FaFacebook />
                            </a>
                        )}
                        {theme?.instagram && (
                            <a href={theme.instagram.startsWith('http') ? theme.instagram : `https://${theme.instagram}`}
                                target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                                <FaInstagram />
                            </a>
                        )}
                        {theme?.twitter && ( // Using twitter field for TikTok as per discussion
                            <a href={theme.twitter.startsWith('http') ? theme.twitter : `https://${theme.twitter}`}
                                target="_blank" rel="noopener noreferrer" className="social-icon" title="TikTok">
                                <FaTiktok />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
