import React from 'react'
import { FaChartLine, FaFolder, FaTshirt, FaShoppingBag, FaPalette, FaSignOutAlt } from 'react-icons/fa'
import './AdminSidebar.css'

function AdminSidebar({ activeSection, onSectionChange, onLogout, isOpen, toggleSidebar }) {
    const logoUrl = 'https://placehold.co/400x400/D4AF37/000000?text=R'

    const menuItems = [
        { id: 'dashboard', icon: FaChartLine, label: 'الرئيسية' },
        { id: 'collections', icon: FaFolder, label: 'المجموعات' },
        { id: 'products', icon: FaTshirt, label: 'المنتجات' },
        { id: 'orders', icon: FaShoppingBag, label: 'الطلبات' },
        { id: 'theme', icon: FaPalette, label: 'إعدادات الموقع' }
    ]

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Mobile Close Button */}
            <div className="sidebar-close-btn" onClick={toggleSidebar}>
                &times;
            </div>

            <div className="sidebar-logo">
                <img src={logoUrl} alt="Rahhalah" />
                <h2>RAHHALAH</h2>
                <p>لوحة التحكم</p>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                        <li key={item.id}>
                            <a
                                href="#"
                                className={activeSection === item.id ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onSectionChange(item.id)
                                }}
                            >
                                <span className="menu-icon"><IconComponent /></span> {item.label}
                            </a>
                        </li>
                    );
                })}
                <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout() }}>
                        <span className="menu-icon"><FaSignOutAlt /></span> تسجيل الخروج
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default AdminSidebar
