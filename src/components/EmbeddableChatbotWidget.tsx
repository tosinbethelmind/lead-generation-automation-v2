'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function EmbeddableChatbotWidget({
  sector = 'general',
  businessName = 'Bethelmind Analytics',
}: {
  sector?: string;
  businessName?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize or fetch session
  useEffect(() => {
    let sid = localStorage.getItem('apex_chat_session_id');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('apex_chat_session_id', sid);
    }
    setSessionId(sid);

    fetch(`/api/chatbot?session_id=${sid}&sector=${sector}&business_name=${encodeURIComponent(businessName)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.session) {
          setMessages(data.session.messages || []);
        }
      })
      .catch(console.error);
  }, [sector, businessName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading || !sessionId) return;

    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userText,
          sector,
          business_name: businessName,
        }),
      }).then(r => r.json());

      if (res.success && res.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: res.reply, timestamp: new Date().toISOString() }]);
      }
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-4 py-3 rounded-full shadow-2xl transition transform hover:scale-105"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm">Chat with Us</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{businessName} Assistant</h4>
                <span className="text-[10px] text-indigo-200">Online • Sector AI</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-lg font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 text-xs rounded-2xl px-3 py-2 animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or type phone number..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-full px-3.5 py-2 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
