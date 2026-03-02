import React, { useState, useRef, useEffect } from 'react'
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa'
import axios from '../utils/axios'
import './AIChat.css'

function AIChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'مرحباً بك في رحلة! كيف يمكنني مساعدتك في اختيار عطرك المفضل اليوم؟' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post('/api/ai/chat', { message: input })
            setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }])
        } catch (error) {
            console.error('AI Error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء التحدث معي. حاول مرة أخرى لاحقاً.' }])
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button className="ai-chat-bubble" onClick={() => setIsOpen(true)}>
                <FaRobot />
                <span className="pulse"></span>
            </button>
        )
    }

    return (
        <div className={`ai-chat-window ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
                <div className="header-info">
                    <FaRobot className="bot-icon" />
                    <span>Rahhalah AI</span>
                </div>
                <div className="header-actions">
                    <button onClick={() => setIsMinimized(!isMinimized)}><FaMinus /></button>
                    <button onClick={() => setIsOpen(false)}><FaTimes /></button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message assistant loading">
                                <div className="dot-typing"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="اسألني أي شيء..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" disabled={loading}><FaPaperPlane /></button>
                    </form>
                </>
            )}
        </div>
    )
}

export default AIChat
