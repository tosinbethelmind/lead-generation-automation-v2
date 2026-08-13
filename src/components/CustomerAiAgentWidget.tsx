'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, X, Send, User, Sparkles, PhoneCall, RefreshCw, CheckCircle2, Shield, Volume2, VolumeX } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'human';
  text: string;
  timestamp: string;
}

interface CustomerAiAgentWidgetProps {
  sector?: string;
  businessName?: string;
  agentTitle?: string;
  initialOpen?: boolean;
  leadData?: any;
}

export default function CustomerAiAgentWidget({
  sector = 'Multi-Sector Lead Automation & AI Guide',
  businessName,
  agentTitle,
  initialOpen = false,
  leadData,
}: CustomerAiAgentWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [handedOver, setHandedOver] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const displayName = agentTitle || (businessName ? `${businessName} AI Concierge` : 'Bethelmind AI Concierge');
  const [agentName, setAgentName] = useState(displayName);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Natural Web Speech Synthesis Audio Voice Synthesizer
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const cleanText = text.replace(/[*_~`]/g, '').replace(/http\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Initialize session ID
    let sid = localStorage.getItem('bethel_ai_session_id');
    if (!sid) {
      sid = `client_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('bethel_ai_session_id', sid);
    }
    setSessionId(sid);

    const welcomeGreeting = leadData
      ? `👋 Hello, **${leadData.name}**! 🌟 Congratulations — your Google Business profile shows you're rated **${leadData.rating}★** with ${leadData.reviews_count} reviews in **${leadData.area || leadData.city || 'Lagos'}**. I've already built a custom AI Lead Generation portal specifically for your **${leadData.category}** business! 🚀 Shall I walk you through how to activate it today with just ₦92,500?`
      : businessName
      ? `👋 Welcome to ${businessName}! I am your 24/7 AI Business Guide & Virtual Assistant. How can I assist you with our services, instant quotes, or custom domain setup today?`
      : `👋 Hello! Welcome to Bethelmind Analytics & Strategy. I am your 24/7 AI Guide & Sales Assistant. How can I help you explore our services, test our sector tools (Solar, Real Estate, Auto, Legal), or view pricing packages today?`;

    // Initial greeting
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'agent',
        text: welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // Auto-speak the personalized welcome greeting to the lead
    if (leadData && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTimeout(() => {
        const cleanText = `Hello ${leadData.name}! Your Google-rated ${leadData.category} business in ${leadData.area || leadData.city || 'Lagos'} is already set up and ready. Let me show you how to activate your 24/7 AI system today.`;
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }, 2500);
    }
  }, [sector, businessName, leadData]);

  // Exit-Intent Mouseleave & Proactive Auto-Pop Trigger
  useEffect(() => {
    let triggered = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 8 && !triggered && !isOpen) {
        triggered = true;
        setIsOpen(true);
        const exitOffer = businessName
          ? `⚡ Wait, ${businessName}! Before you leave, let me show you how to claim your 24/7 AI Chatbot & Lead Tools with just ₦92,500 50% deposit!`
          : `⚡ Wait! Before you leave, test our 1-click sector calculators or speak with our 24/7 AI Guide right now!`;
        
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_exit_${Date.now()}`,
            sender: 'agent',
            text: exitOffer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        speakText(exitOffer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [businessName, isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsgId = `usr_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text.trim(),
          sector,
          businessName,
          leadData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `agt_${Date.now()}`,
            sender: 'agent',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (data.handedOver) setHandedOver(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sender: 'agent',
            text: 'I am experiencing a momentary connection glitch, but your inquiry has been recorded! Please leave your WhatsApp phone number below.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'agent',
          text: 'Thank you for reaching out! Share your mobile phone or email address and our support team will reach out directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic quick-action chips based on scraped lead's business category
  const quickPrompts = leadData ? [
    leadData.category?.toLowerCase().includes('solar')
      ? `☀️ Quote 5kVA Solar System for ${leadData.name}`
      : leadData.category?.toLowerCase().includes('real estate') || leadData.category?.toLowerCase().includes('property')
      ? `🏠 Show ${leadData.name} Real Estate Lead Tools`
      : leadData.category?.toLowerCase().includes('auto') || leadData.category?.toLowerCase().includes('car')
      ? `🚗 Tokunbo Auto Duty Calculator for ${leadData.name}`
      : leadData.category?.toLowerCase().includes('medical') || leadData.category?.toLowerCase().includes('clinic')
      ? `🏥 Clinic Appointment Booking AI for ${leadData.name}`
      : `🎯 How ${leadData.name} Gets 4x More Leads`,
    `🚀 Activate My Portal for ₦92,500`,
    `💳 View Pricing Plans`,
    `📞 How to Send Payment Receipt`,
  ] : [
    '🎯 Explore Business Services',
    '⚡ Test Sector Calculators',
    '🚗 Tokunbo Customs & BOQ Tools',
    '💳 View Pricing & Packages',
    '🚀 How to Activate 24/7 AI System',
  ];

  return (
    <div className="customer-ai-widget-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-widget-trigger"
          aria-label={`Chat with ${displayName}`}
        >
          <div className="trigger-icon-wrap">
            <Bot size={24} />
            <span className="trigger-pulse"></span>
          </div>
          <div className="trigger-text">
            <span className="trigger-title">{businessName ? `Chat with ${businessName}` : 'Chat with AI Concierge'}</span>
            <span className="trigger-sub">24/7 Virtual Assistant</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-info">
              <div className="agent-avatar">
                <Bot size={20} />
                <span className="online-dot"></span>
              </div>
              <div>
                <h4>{agentName}</h4>
                <div className="agent-status-badge">
                  <Sparkles size={12} /> 24/7 AI Active • {sector}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => speakText(messages[messages.length - 1]?.text || '')}
                style={{
                  background: isPlayingAudio ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                title="Listen to AI voice message"
              >
                {isPlayingAudio ? <VolumeX size={12} /> : <Volume2 size={12} />}
                {isPlayingAudio ? 'Speaking...' : 'Listen Voice'}
              </button>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Handover Notice Banner */}
          {handedOver && (
            <div className="handover-banner">
              <PhoneCall size={16} />
              <span>Human agent requested! Live support team notified.</span>
            </div>
          )}

          {/* Messages Body */}
          <div className="ai-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-wrap ${msg.sender === 'user' ? 'user-msg' : 'agent-msg'}`}
              >
                {msg.sender !== 'user' && (
                  <div className="msg-avatar">
                    <Bot size={14} />
                  </div>
                )}
                <div className="bubble-content">
                  <div className="msg-text">{msg.text}</div>
                  <div className="msg-time">{msg.timestamp}</div>
                </div>
                {msg.sender === 'user' && (
                  <div className="msg-avatar user-avatar">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-wrap agent-msg">
                <div className="msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="bubble-content typing-bubble">
                  <RefreshCw className="spin-icon" size={14} /> AI Specialist thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="quick-prompts-bar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="quick-chip"
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="ai-chat-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="input-row"
            >
              <input
                type="text"
                placeholder={leadData ? `Tell me anything — what's on your mind, ${leadData.name?.split(' ')[0] || 'friend'}?` : "Type anything — questions, ideas, concerns... I'm listening 👂"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={!input.trim() || loading} className="send-btn">
                <Send size={16} />
              </button>
            </form>
            <div className="footer-secure-notice">
              <Shield size={11} /> No judgment — say what's on your mind. I'll sort it out or bring in a human if needed.
            </div>
          </div>
        </div>
      )}

      {/* Widget Scoped Styles */}
      <style jsx>{`
        .customer-ai-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99999;
          font-family: var(--font-sans, 'Inter', sans-serif);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          pointer-events: none;
        }

        .ai-widget-trigger, .ai-chat-window {
          pointer-events: auto;
        }

        .ai-widget-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ai-widget-trigger:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 40px rgba(6, 182, 212, 0.6);
        }

        .trigger-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 50%;
        }

        .trigger-pulse {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 0;
          right: 0;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .trigger-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .trigger-title {
          font-weight: 700;
          font-size: 0.9rem;
          line-height: 1.1;
        }

        .trigger-sub {
          font-size: 0.72rem;
          opacity: 0.9;
        }

        .ai-chat-window {
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 540px;
          max-height: calc(100vh - 100px);
          background: rgba(11, 17, 32, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ai-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .agent-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .online-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 9px;
          height: 9px;
          background: #10b981;
          border: 1.5px solid #0b1120;
          border-radius: 50%;
        }

        .header-info h4 {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .agent-status-badge {
          font-size: 0.7rem;
          color: #38bdf8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .handover-banner {
          background: rgba(245, 158, 11, 0.15);
          border-bottom: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
          font-size: 0.75rem;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-bubble-wrap {
          display: flex;
          gap: 8px;
          max-width: 85%;
        }

        .user-msg {
          align-self: flex-end;
          flex-direction: row;
        }

        .agent-msg {
          align-self: flex-start;
        }

        .msg-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.2);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .user-avatar {
          background: rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
        }

        .bubble-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          border-radius: 12px;
          color: #f8fafc;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .user-msg .bubble-content {
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          border: none;
          color: #ffffff;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #38bdf8;
          font-size: 0.8rem;
        }

        :global(.spin-icon) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .msg-time {
          font-size: 0.65rem;
          opacity: 0.6;
          margin-top: 4px;
          text-align: right;
        }

        .quick-prompts-bar {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          overflow-x: auto;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .quick-chip {
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #38bdf8;
          font-size: 0.72rem;
          padding: 5px 10px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-chip:hover {
          background: rgba(6, 182, 212, 0.2);
          border-color: #06b6d4;
        }

        .ai-chat-footer {
          padding: 12px;
          background: rgba(7, 10, 18, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .input-row input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 12px;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
        }

        .input-row input:focus {
          border-color: #06b6d4;
        }

        .send-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          border: none;
          color: #fff;
          padding: 0 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .footer-secure-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 0.65rem;
          color: #64748b;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
