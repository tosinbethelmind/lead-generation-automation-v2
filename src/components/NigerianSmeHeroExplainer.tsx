'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, MessageCircle, Phone, ShieldCheck, CheckCircle2, 
  Volume2, Sparkles, Video, X, Zap, ArrowRight, Clock, RotateCcw, 
  Bot, CheckCheck, Calendar, Star, Headphones, Send, Loader2
} from 'lucide-react';
import OneTapDemoSchedulerModal from '@/components/OneTapDemoSchedulerModal';

interface NigerianSmeHeroExplainerProps {
  businessName: string;
  category?: string;
  area?: string;
  phone?: string;
  previewUrl?: string;
  adminPhone?: string;
}

interface ChatBubble {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function NigerianSmeHeroExplainer({
  businessName,
  category = 'Commercial Enterprise',
  area = 'Lagos',
  phone,
  previewUrl,
  adminPhone = '2348022791227'
}: NigerianSmeHeroExplainerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [isSimPlaying, setIsSimPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // In-Page Interactive Bot Simulator State
  const [interactiveMessages, setInteractiveMessages] = useState<ChatBubble[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: `Good day! 👋 Welcome to *${businessName}* (${category}) in ${area}. How can we assist you today? Tap any option below or type a question to test my 2-second reply!`,
      time: 'Just now'
    }
  ]);
  const [customInput, setCustomInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Phone Capture State
  const [userPhone, setUserPhone] = useState('');
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Automatic Step Progression for the Video Simulation Modal
  useEffect(() => {
    if (!showVideoModal || !isSimPlaying) return;

    const timers: NodeJS.Timeout[] = [];
    setSimStep(0);
    timers.push(setTimeout(() => setSimStep(1), 1200));
    timers.push(setTimeout(() => setSimStep(2), 2600));
    timers.push(setTimeout(() => setSimStep(3), 5200));
    timers.push(setTimeout(() => setSimStep(4), 7000));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [showVideoModal, isSimPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const restartSimulation = () => {
    setIsSimPlaying(false);
    setSimStep(0);
    setTimeout(() => setIsSimPlaying(true), 100);
  };

  const cleanDemoUrl = previewUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.bethelmindanalytics.com');
  const prefillWa = encodeURIComponent(
    `Hello Bethelmind Lagos! I am testing the live 24/7 AI prototype for *${businessName}* in ${area}.\n\nDemo Link: ${cleanDemoUrl}\n\nPlease show me how the 2-second WhatsApp auto-quoter works with our real prices (₦0 Upfront Preview).`
  );
  const waUrl = `https://wa.me/${adminPhone}?text=${prefillWa}`;

  // Interactive In-Page Bot Response Generator
  const handleSendInteractiveMessage = (textToSend: string) => {
    if (!textToSend.trim() || isBotTyping) return;

    const userBubble: ChatBubble = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setInteractiveMessages(prev => [...prev, userBubble]);
    setCustomInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let reply = `Thank you for reaching out to *${businessName}*! 👋 We offer premium ${category} services in ${area}. We are open 24/7 to take your orders and bookings. Would you like to speak directly with our team or schedule a consultation?`;

      if (lower.includes('location') || lower.includes('where') || lower.includes('address')) {
        reply = `We are proudly located in *${area || 'Lagos, Nigeria'}*! 📍 We serve clients across the entire state and offer nationwide dispatch. Would you like our exact directions or delivery details?`;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate')) {
        reply = `For *${businessName}* (${category}), our packages are designed for maximum value with guaranteed 48-hour delivery. 💰 Every service comes with our 24/7 automated quoting assistant. Tap the WhatsApp button below to see the exact price list!`;
      } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('order') || lower.includes('buy')) {
        reply = `Yes, absolutely! 🌟 Our booking calendar is open for this week. We can confirm your slot right now. Tap "Schedule Call" or message our Lagos desk directly to lock your time!`;
      }

      const botBubble: ChatBubble = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Just now'
      };

      setInteractiveMessages(prev => [...prev, botBubble]);
      setIsBotTyping(false);
    }, 1200);
  };

  // Instant Phone Capture & Real WhatsApp Dispatch
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;

    setPhoneSending(true);
    setPhoneError(null);
    setPhoneSuccess(null);

    try {
      const resp = await fetch('/api/preview/send-instant-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhone,
          businessName,
          category,
          area,
          leadId: previewUrl ? previewUrl.split('/').pop() : ''
        })
      });

      const data = await resp.json();
      if (data.success) {
        setPhoneSuccess(`🎉 Live test message sent to ${data.phone}! Open WhatsApp to check your phone now.`);
        setUserPhone('');
      } else {
        setPhoneError(data.error || 'Failed to dispatch test message. Please verify your phone number.');
      }
    } catch (_) {
      setPhoneError('Network error. Please ensure you enter a valid 11-digit Nigerian WhatsApp number.');
    } finally {
      setPhoneSending(false);
    }
  };

  return (
    <section 
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #070b14 0%, #0c1222 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
        color: '#ffffff',
        padding: '28px 16px 36px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      <div 
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Floating Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
          <span>INTERACTIVE PREVIEW FOR: <strong style={{ color: '#ffffff', textTransform: 'uppercase' }}>{businessName}</strong></span>
        </div>

        {/* High-Converting Loss-Aversion Headline */}
        <h1 
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#ffffff',
            margin: '0 0 12px 0',
            maxWidth: '850px'
          }}
        >
          How Many Customers Messaged <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{businessName}</span> After 8:00 PM While You Were Asleep?
        </h1>

        {/* Subtitle Framing the Night Loss */}
        <p 
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: '#94a3b8',
            maxWidth: '720px',
            lineHeight: 1.55,
            margin: '0 0 24px 0'
          }}
        >
          In Nigeria, <strong>42% of serious clients message at night</strong> and buy from whichever business replies first on WhatsApp. Our 24/7 AI Assistant replies in <strong>2 seconds</strong>, calculates quotes, and captures orders while you rest.
        </p>

        {/* Audio Proposal & Quick Action Header */}
        <div 
          style={{
            width: '100%',
            maxWidth: '720px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Audio Capsule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Voice Note' : 'Play 15s Voice Note'}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#022c22',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                flexShrink: 0
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
            </button>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Headphones size={14} style={{ color: '#34d399' }} />
                <span>15s Voice Proposal</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                {isPlaying ? `Playing (${Math.floor(currentTime)}s / ${Math.floor(duration)}s)` : 'Tap to hear personalized note'}
              </div>
            </div>
            <audio ref={audioRef} src="/assets/audio/commercial_turnkey_deployment.mp3" preload="metadata" />
          </div>

          {/* Action Modals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowVideoModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#c7d2fe',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Video size={15} style={{ color: '#818cf8' }} />
              <span>Watch 45s Chat Demo</span>
            </button>

            <button
              onClick={() => setShowSchedulerModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Calendar size={15} style={{ color: '#34d399' }} />
              <span>Schedule Call</span>
            </button>
          </div>
        </div>

        {/* ── CORE HIGH-CONVERSION ENGINE: IN-PAGE 1-TAP WHATSAPP SIMULATOR ── */}
        <div 
          style={{
            width: '100%',
            maxWidth: '720px',
            background: '#090f1e',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            marginBottom: '28px',
            textAlign: 'left'
          }}
        >
          {/* Simulated WhatsApp Header */}
          <div 
            style={{
              background: '#0f172a',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#022c22', fontWeight: 800 }}>
                  <Bot size={20} />
                </div>
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #0f172a' }}></span>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{businessName} 24/7 AI Assistant</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', borderRadius: '6px' }}>LIVE TEST</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                  {isBotTyping ? '⚡ typing... (<2s)' : 'Online · Replies in 2 seconds'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Test Mode (0-Friction)
            </div>
          </div>

          {/* Chat Stream Window */}
          <div 
            style={{
              padding: '16px',
              minHeight: '190px',
              maxHeight: '280px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#040711'
            }}
          >
            {interactiveMessages.map(m => (
              <div 
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? '#1e293b' : 'rgba(6, 78, 59, 0.45)',
                  border: m.sender === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16, 185, 129, 0.35)',
                  color: m.sender === 'user' ? '#f1f5f9' : '#d1fae5',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {m.text}
              </div>
            ))}

            {isBotTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(6, 78, 59, 0.3)', color: '#6ee7b7', padding: '8px 12px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 size={13} className="animate-spin" />
                <span>AI assistant is formulating reply in 1.2s...</span>
              </div>
            )}
          </div>

          {/* 1-Tap Quick Question Chips */}
          <div style={{ padding: '10px 14px', background: '#090f1e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              💡 TAP A QUESTION TO TEST 2-SECOND REPLY:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSendInteractiveMessage(`Where is your office located in ${area}?`)}
                disabled={isBotTyping}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                📍 Where are you located?
              </button>

              <button
                type="button"
                onClick={() => handleSendInteractiveMessage(`How much are your services and package rates?`)}
                disabled={isBotTyping}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                💰 How much are your services?
              </button>

              <button
                type="button"
                onClick={() => handleSendInteractiveMessage(`Can I book an appointment or make an order right now?`)}
                disabled={isBotTyping}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                🌙 Can I book / order right now?
              </button>
            </div>
          </div>

          {/* Interactive Chat Input Bar */}
          <div style={{ padding: '10px 14px', background: '#0f172a', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendInteractiveMessage(customInput); }}
              placeholder={`Ask anything about ${businessName}...`}
              style={{
                flex: 1,
                background: '#040711',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => handleSendInteractiveMessage(customInput)}
              disabled={!customInput.trim() || isBotTyping}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#022c22',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Send size={14} />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* ── LOW-FRICTION PHONE CAPTURE BRIDGE: SEND TEST TO MY WHATSAPP ── */}
        <div 
          style={{
            width: '100%',
            maxWidth: '720px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '20px',
            boxSizing: 'border-box',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>📱</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
              Want to Test This Live on Your Own WhatsApp Right Now?
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Enter your WhatsApp number below. Our Lagos technical desk will automatically dispatch a live 10-second test message directly to your phone.
          </p>

          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="tel"
              value={userPhone}
              onChange={e => setUserPhone(e.target.value)}
              placeholder="e.g. 0802 279 1227"
              required
              style={{
                flex: '1 1 240px',
                maxWidth: '300px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#040711',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={phoneSending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              {phoneSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Dispatching Test...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={16} />
                  <span>Send Test Message to My Phone →</span>
                </>
              )}
            </button>
          </form>

          {phoneSuccess && (
            <div style={{ marginTop: '14px', padding: '16px', background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', borderRadius: '14px', textAlign: 'center', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)' }}>
              <div style={{ color: '#a7f3d0', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>
                {phoneSuccess}
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                <MessageCircle size={18} />
                <span>🟢 Tap Here to Open WhatsApp & Confirm Your Prototype →</span>
              </a>
            </div>
          )}

          {phoneError && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '10px', color: '#fca5a5', fontSize: '0.85rem' }}>
              {phoneError}
            </div>
          )}

          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
            🔒 100% Free Live Test · Zero Commitment · No Spam Guarantee
          </div>
        </div>

        {/* Primary 1-Tap WhatsApp Conversion Hook */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '500px' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '15px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
              boxSizing: 'border-box'
            }}
          >
            <MessageCircle size={20} />
            <span>🟢 Connect with Lagos Desk on WhatsApp →</span>
          </a>

          {/* Value Micro-Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={13} style={{ color: '#34d399' }} /> &lt;2s Instant Reply
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} style={{ color: '#34d399' }} /> ₦0 Upfront Demo
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} style={{ color: '#34d399' }} /> ₦15,000 Pilot Setup
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} style={{ color: '#34d399' }} /> 48h Turnkey Deployment
            </span>
          </div>
        </div>

        {/* Clean Corporate Trust Seal (Zero Premature Payment Shock) */}
        <div 
          style={{
            marginTop: '24px',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <span>Bethelmind Analytics Lagos Desk: <strong style={{ color: '#94a3b8' }}>0802 279 1227</strong></span>
          <span>•</span>
          <span>₦0 Demo / ₦15k Pilot Terms</span>
          <span>•</span>
          <span>Moniepoint & OPay Settlement Verified</span>
        </div>
      </div>

      {/* 45-Second Interactive Video Simulation Modal */}
      {showVideoModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            style={{
              background: '#0f172a',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              boxSizing: 'border-box'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  45s Simulation: {businessName}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={restartSimulation} 
                  title="Restart"
                  style={{ background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setShowVideoModal(false)} 
                  aria-label="Close"
                  style={{ background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Simulation View */}
            <div style={{ background: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '10px 14px', borderRadius: '14px 14px 14px 2px', maxWidth: '85%', fontSize: '0.85rem', alignSelf: 'flex-start', lineHeight: 1.4 }}>
                Hello! I saw {businessName} online. Please how much is your service and do you have availability this week?
              </div>

              {simStep === 1 && (
                <div style={{ color: '#34d399', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '4px' }}>
                  <Bot size={14} />
                  <span>24/7 AI Assistant is replying in 2s...</span>
                </div>
              )}

              {simStep >= 2 && (
                <div style={{ background: 'rgba(6, 78, 59, 0.5)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#d1fae5', padding: '10px 14px', borderRadius: '14px 14px 2px 14px', maxWidth: '88%', fontSize: '0.85rem', alignSelf: 'flex-end', lineHeight: 1.4 }}>
                  <strong style={{ color: '#6ee7b7' }}>Instant Reply:</strong> Good evening! 👋 Welcome to *{businessName}*. Yes, we are available! Here is our current schedule & services:
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '8px', margin: '6px 0', fontSize: '0.75rem' }}>
                    • Complete Service Turnkey Setup<br />
                    • Guaranteed 48-Hour Delivery<br />
                    • 100% Mobile & WhatsApp Integration
                  </div>
                  Would you like to lock in your appointment right now?
                </div>
              )}

              {simStep >= 3 && (
                <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '8px 12px', borderRadius: '14px 14px 14px 2px', maxWidth: '80%', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
                  Yes please, let us proceed!
                </div>
              )}

              {simStep >= 4 && (
                <div style={{ background: 'rgba(6, 78, 59, 0.7)', border: '1px solid #10b981', color: '#a7f3d0', padding: '10px 14px', borderRadius: '14px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
                  🎉 Deal Closed in 10s while you sleep!
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#10b981',
                  color: '#022c22',
                  fontWeight: 800,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              >
                <MessageCircle size={18} />
                <span>Deploy This for {businessName} →</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Scheduler Modal with fixed isOpen prop */}
      {showSchedulerModal && (
        <OneTapDemoSchedulerModal
          isOpen={showSchedulerModal}
          businessName={businessName}
          category={category}
          area={area}
          adminPhone={adminPhone}
          onClose={() => setShowSchedulerModal(false)}
        />
      )}
    </section>
  );
}
