import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AnalyticsChart from './AnalyticsChart'
import './Dashboard.css'

function Dashboard() {
    const [filter, setFilter] = useState('week') // 'today', 'week', 'month'
    const [overview, setOverview] = useState({
        visits: 0,
        orders: 0,
        revenue: 0,
        productsCount: 0,
        chartData: []
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [filter])

    const loadData = async () => {
        setLoading(true)
        try {
            const [analyticsRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`/api/analytics/dashboard?range=${filter}`),
                axios.get('/api/orders'),
                axios.get('/api/products')
            ])

            const analytics = analyticsRes.data.data

            setOverview({
                visits: analytics.summary.visits,
                orders: analytics.summary.orders,
                revenue: analytics.summary.revenue,
                productsCount: productsRes.data.count || productsRes.data.data.length,
                chartData: analytics.chartData
            })

            // Get last 5 orders
            const allOrders = ordersRes.data.data
            setRecentOrders(allOrders.slice(0, 5))

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount)
    }

    return (
        <section className="dashboard-section">
            <div className="admin-header">
                <h1>لوحة التحكم</h1>
                <div className="date-filters">
                    <button
                        className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
                        onClick={() => setFilter('today')}
                    >
                        اليوم
                    </button>
                    <button
                        className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
                        onClick={() => setFilter('week')}
                    >
                        آخر أسبوع
                    </button>
                    <button
                        className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
                        onClick={() => setFilter('month')}
                    >
                        آخر شهر
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>الزيارات</h3>
                            <div className="stat-value">{overview.visits}</div>
                            <div className="stat-trend">زائر</div>
                        </div>
                        <div className="stat-card">
                            <h3>الطلبات</h3>
                            <div className="stat-value">{overview.orders}</div>
                            <div className="stat-trend">طلب جديد</div>
                        </div>
                        <div className="stat-card">
                            <h3>المبيعات</h3>
                            <div className="stat-value">{formatCurrency(overview.revenue)}</div>
                            <div className="stat-trend" style={{ color: 'var(--primary-gold)' }}>إجمالي الدخل</div>
                        </div>
                        <div className="stat-card">
                            <h3>المنتجات</h3>
                            <div className="stat-value">{overview.productsCount}</div>
                            <div className="stat-trend">منتج نشط</div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="charts-container">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>إحصائيات الزوار</h3>
                            </div>
                            {overview.chartData && overview.chartData.length > 0 ? (
                                <AnalyticsChart data={overview.chartData} dataKey="visits" color="#0ea5e9" />
                            ) : (
                                <p className="empty-message">لا توجد بيانات للعرض</p>
                            )}
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>إحصائيات المبيعات والطلبات</h3>
                            </div>
                            {overview.chartData && overview.chartData.length > 0 ? (
                                <AnalyticsChart data={overview.chartData} dataKey="orders" color="#eab308" />
                            ) : (
                                <p className="empty-message">لا توجد بيانات للعرض</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="table-container">
                        <h2 className="section-title">آخر الطلبات</h2>
                        {recentOrders.length === 0 ? (
                            <p className="empty-message">لا توجد طلبات بعد</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>رقم الطلب</th>
                                        <th>العميل</th>
                                        <th>المحافظة</th>
                                        <th>الإجمالي</th>
                                        <th>التاريخ</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td style={{ fontFamily: 'monospace' }}>#{order._id.slice(-6)}</td>
                                            <td>{order.customerName}</td>
                                            <td>{order.governorate}</td>
                                            <td className="text-gold">{formatCurrency(order.total)}</td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>
                                                <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                                        order.status === 'cancelled' ? 'badge-danger' :
                                                            'badge-warning'
                                                    }`}>
                                                    {order.status === 'pending' ? 'انتظار' :
                                                        order.status === 'delivered' ? 'تم' :
                                                            order.status === 'shipped' ? 'شحن' : order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default Dashboard
