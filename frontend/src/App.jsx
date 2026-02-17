import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import axios from 'axios'
import './App.css'

function App() {
  useEffect(() => {
    // Basic visit tracking
    if (!sessionStorage.getItem('visited')) {
      axios.post('/api/analytics/visit')
        .then(() => sessionStorage.setItem('visited', 'true'))
        .catch(err => console.error(err));
    }
  }, [])

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
