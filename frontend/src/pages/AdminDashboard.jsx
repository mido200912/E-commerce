import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios';
import AdminSidebar from '../components/admin/AdminSidebar'
import Dashboard from '../components/admin/Dashboard'
import CollectionsManager from '../components/admin/CollectionsManager'
import ProductsManager from '../components/admin/ProductsManager'
import OrdersManager from '../components/admin/OrdersManager'
import ThemeSettings from '../components/admin/ThemeSettings'
import './AdminDashboard.css'

function AdminDashboard() {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('dashboard')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    // ... (checkAuth, handleLogout remain same) ...
    const checkAuth = async () => {
        try {
            await axios.get('/api/admin/check')
            setIsAuthenticated(true)
        } catch (error) {
            navigate('/admin/login')
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post('/api/admin/logout')
            navigate('/admin/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (!isAuthenticated) return <div className="loading-container"><div className="loading"></div></div>

    // Close sidebar when active section changes on mobile
    const handleSectionChange = (section) => {
        setActiveSection(section)
        setIsSidebarOpen(false)
    }

    return (
        <div className="admin-layout">
            {/* Mobile Header Toggle */}
            <div className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                ☰
            </div>

            {/* Sidebar Backdrop for Mobile */}
            {isSidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <AdminSidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="main-content">
                {activeSection === 'dashboard' && <Dashboard />}
                {activeSection === 'collections' && <CollectionsManager />}
                {activeSection === 'products' && <ProductsManager />}
                {activeSection === 'orders' && <OrdersManager />}
                {activeSection === 'theme' && <ThemeSettings />}
            </main>
        </div>
    )
}


export default AdminDashboard
