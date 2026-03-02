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
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Mobile Close Button */}
            <div className="sidebar-close-btn" onClick={toggleSidebar}>
                &times;
            </div>

            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <h2>RAHHALAH</h2>
                    <p className="sidebar-tagline">لوحة التحكم</p>
                </div>
            </div>

            <div className="sidebar-nav">
                {menuItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <IconComponent />
                            <span>{item.label}</span>
                        </div>
                    );
                })}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout}>
                        <FaSignOutAlt />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default AdminSidebar
