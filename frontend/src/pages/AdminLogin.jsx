import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AdminLogin.css'

function AdminLogin() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const logoUrl = 'https://placehold.co/400x400/D4AF37/000000?text=R'

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.post('/api/admin/login', formData)
            navigate('/admin')
        } catch (err) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <img src={logoUrl} alt="Rahhalah" />
                    <h1>RAHHALAH</h1>
                    <p>لوحة تحكم الأدمن</p>
                </div>

                {error && (
                    <div className="error-message active">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-button">
                        تسجيل الدخول
                    </button>
                </form>

                <div className="back-link">
                    <a href="/">← العودة للموقع</a>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
