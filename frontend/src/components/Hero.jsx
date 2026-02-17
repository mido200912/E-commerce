import React, { useState, useEffect } from 'react';
import './Hero.css';

const images = [
    '/hero/hero1.png',
    '/hero/hero2.png'
];

function Hero() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const scrollToProducts = () => {
        const element = document.getElementById('products');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero" id="home">
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`hero-bg ${index === currentImage ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h1 className="hero-title">RAHHALAH</h1>
                <p className="hero-subtitle">Premium Streetwear Collection</p>
                <button className="shop-all-btn" onClick={scrollToProducts}>
                    Discover Collection
                </button>
            </div>
        </section>
    );
}

export default Hero;
