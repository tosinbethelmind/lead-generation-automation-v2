'use client';

console.log('Redeploy check - latest build');

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  Settings, 
  FileText, 
  Search, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  Info,
  MapPin,
  ExternalLink,
  Database,
  ArrowRight,
  ShieldCheck,
  Flame,
  UserCheck,
  LogOut,
  Mail,
  Eye,
  EyeOff,
  Palette,
  Sliders,
  Terminal,
  Sun,
  Share2,
  Sparkles,
  Loader2,
  X,
  AlertTriangle,
  AlertCircle,
  Menu,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RuntimeConfig } from '@/lib/localConfig';
import { Lead } from '@/lib/googleSheets';
import TopReviewedLeads from '@/components/TopReviewedLeads';
import ScraperCard from '@/app/dashboard/components/ScraperCard';
import ScrapeControls from '@/app/dashboard/components/ScrapeControls';
import SolarQuoteProOutreachCard from '@/app/dashboard/components/SolarQuoteProOutreachCard';
import Lagos10KOutreachCard from '@/app/dashboard/components/Lagos10KOutreachCard';
import { ProviderCard } from '@/app/components/ProviderCard';
import { useTheme } from './ThemeContext';

const WEBSITE_STYLE_PRESETS = [
  {
    id: 'medical',
    name: '🏥 Medical & Health Clinic',
    categoryKeywords: ['medical', 'doctor', 'clinic', 'hospital', 'health', 'physio', 'chiropractor'],
    theme: {
      primary: '#0891b2', // Cyan 600
      accent: '#0d9488', // Teal 600
      bg: '#f0fdfa', // Light Teal/Minty fresh clean
      text: '#0f172a',
      font: 'Outfit'
    },
    copy: {
      heroTitle: 'Compassionate Care, Advanced Medical Expertise',
      heroSubtitle: 'Your patients can book appointments online 24/7, receive reminders automatically, and pay from their phone — without a single phone call.',
      ctaText: 'Schedule a Consultation',
      aboutText: 'Our clinic is dedicated to offering premium clinical care for you and your family. With a team of board-certified professionals and advanced diagnostics, we prioritize your long-term health and peace of mind.'
    },
    widget: {
      type: 'patient_intake',
      title: 'Quick Patient Registration & Appointment Scheduling',
      description: 'Fill in your details below to request a secure clinical appointment or start your virtual registration.'
    }
  },
  {
    id: 'dental',
    name: '🦷 Dental Practice',
    categoryKeywords: ['dental', 'dentist', 'orthodontist', 'teeth', 'smile'],
    theme: {
      primary: '#2563eb', // Blue 600
      accent: '#38bdf8', // Sky 400
      bg: '#f0f9ff', // Light Sky Blue
      text: '#0f172a',
      font: 'Outfit'
    },
    copy: {
      heroTitle: 'Your Journey to a Bright, Confident Smile Starts Here',
      heroSubtitle: 'Let patients book appointments, choose their procedure, and get reminders automatically — so you fill your calendar without lifting a finger.',
      ctaText: 'Book a Dental Visit',
      aboutText: 'We believe a beautiful smile is a healthy smile. Our modern dental suite is fully equipped to provide gentle cleanings, advanced implants, orthodontic alignment, and pain-free treatments for all ages.'
    },
    widget: {
      type: 'patient_intake',
      title: 'Schedule a Consultation & Smile Assessment',
      description: 'Choose your desired date and request your oral hygiene or dental checkup session with our specialists.'
    }
  },
  {
    id: 'auto',
    name: '🚗 Auto Repair & Service',
    categoryKeywords: ['auto', 'mechanic', 'car', 'repair', 'garage', 'dealer', 'tire', 'vehicle'],
    theme: {
      primary: '#dc2626', // Red 600
      accent: '#1e293b', // Slate 800
      bg: '#f8fafc', // Light Slate
      text: '#0f172a',
      font: 'Chivo'
    },
    copy: {
      heroTitle: 'Professional Auto Repair, Diagnostics & Maintenance',
      heroSubtitle: 'Customers get an instant quote online, book a service slot, and receive a WhatsApp confirmation — no waiting on hold, no missed revenue.',
      ctaText: 'Book Repair Service',
      aboutText: 'From oil changes and brake repairs to complex engine diagnostics, our certified technicians use industry-leading tools to keep your vehicle running at peak performance.'
    },
    widget: {
      type: 'vehicle_valuation',
      title: 'Instant Vehicle Trade-In & Booking Estimate',
      description: 'Enter your vehicle details to get a smart market valuation or schedule an active service diagnostic.'
    }
  },
  {
    id: 'beauty',
    name: '💇 Beauty Salon & Spa',
    categoryKeywords: ['salon', 'hair', 'beauty', 'spa', 'massage', 'nails', 'skin', 'wellness'],
    theme: {
      primary: '#db2777', // Pink 600
      accent: '#fda4af', // Rose 300
      bg: '#fff1f2', // Light Rose
      text: '#1e293b',
      font: 'Playfair Display'
    },
    copy: {
      heroTitle: 'Indulge in Premium Hair, Beauty & Wellness Treatments',
      heroSubtitle: 'Clients book their preferred stylist and time online — you stop missing walk-ins and start filling your diary weeks in advance.',
      ctaText: 'Reserve Your Treatment',
      aboutText: 'Our expert stylists and therapists customize every service—from trendy hair highlights to soothing facial treatments—ensuring you leave feeling radiant, relaxed, and fully confident.'
    },
    widget: {
      type: 'table_reservation',
      title: 'Online Reservation & Appointment Booker',
      description: 'Select your preferred service and beauty professional to lock in your luxury appointment slot.'
    }
  },
  {
    id: 'restaurant',
    name: '🍕 Restaurant & Cafe',
    categoryKeywords: ['restaurant', 'cafe', 'food', 'dining', 'bakery', 'pizza', 'kitchen', 'bar', 'sushi'],
    theme: {
      primary: '#ea580c', // Orange 600
      accent: '#ca8a04', // Yellow 600
      bg: '#fefcf8', // Warm Paper
      text: '#1e293b',
      font: 'Playfair Display'
    },
    copy: {
      heroTitle: 'Crafted Culinary Experiences & Seasonal Flavors',
      heroSubtitle: 'Diners reserve their table online, pre-order food, and receive instant confirmation — so you manage a fully-booked restaurant without a single phone call.',
      ctaText: 'Reserve a Table',
      aboutText: 'We take pride in building a menu that celebrates classic recipes with a modern twist. Whether it is a cozy family dinner or a festive celebration, we make every meal an occasion.'
    },
    widget: {
      type: 'table_reservation',
      title: 'Instant Table & Seat Reservation System',
      description: 'Book your dining table online in real-time. Simply choose your guests count, date, and preferred time.'
    }
  },
  {
    id: 'repairs',
    name: '🔧 Plumbing & Local Repairs',
    categoryKeywords: ['plumber', 'repair', 'handyman', 'electrician', 'roof', 'contractor', 'hvac', 'ac', 'cleaning'],
    theme: {
      primary: '#0d9488', // Teal 600
      accent: '#2563eb', // Blue 600
      bg: '#f8fafc',
      text: '#0f172a',
      font: 'Outfit'
    },
    copy: {
      heroTitle: '24/7 Professional Home Repair & Handyman Services',
      heroSubtitle: 'Customers get an instant repair estimate, book a slot, and receive a WhatsApp confirmation — you never miss a job because they could not reach you by phone.',
      ctaText: 'Request Repair Dispatch',
      aboutText: 'We specialize in prompt plumbing, electrical, and HVAC repairs. No job is too small or too complex. We stand by our work with upfront pricing and lifetime satisfaction guarantees.'
    },
    widget: {
      type: 'quote_estimator',
      title: 'Instant Service Estimate & Invoice Generator',
      description: 'Select the repairs you need to view a smart quote estimate and lock in a dispatch booking.'
    }
  },
  {
    id: 'fitness',
    name: '🏋️ Fitness & Gym Club',
    categoryKeywords: ['gym', 'fitness', 'workout', 'trainer', 'training', 'crossfit', 'yoga'],
    theme: {
      primary: '#2563eb',
      accent: '#1e293b',
      bg: '#ffffff',
      text: '#0f172a',
      font: 'Chivo'
    },
    copy: {
      heroTitle: 'Unleash Your Strength & Reach Your Peak Fitness',
      heroSubtitle: 'Members sign up online, calculate their membership plan, and pay instantly — you grow your gym roster without chasing manual registrations.',
      ctaText: 'Claim Free Day Pass',
      aboutText: 'Our community-focused gym is built to support your unique fitness journey. With dynamic training programs, clean facilities, and modern recovery zones, we help you hit your goals.'
    },
    widget: {
      type: 'quote_estimator',
      title: 'Calculate Membership Plans & Start Registration',
      description: 'Select your goals and premium options to calculate your plan cost and book your initial assessment.'
    }
  },
  {
    id: 'business',
    name: '💼 Legal & Business Consulting',
    categoryKeywords: ['consulting', 'lawyer', 'legal', 'finance', 'agency', 'accountant', 'advisor'],
    theme: {
      primary: '#1e293b', // Slate 800
      accent: '#475569', // Slate 600
      bg: '#fafafa', // Soft Off-White
      text: '#0f172a',
      font: 'Outfit'
    },
    copy: {
      heroTitle: 'Strategic Guidance & Professional Advice You Can Trust',
      heroSubtitle: 'Prospects book a free discovery call online, fill in their brief, and get an instant follow-up — so you convert consultations instead of answering cold enquiries.',
      ctaText: 'Request Strategy Session',
      aboutText: 'Our experienced advisors partner with companies and individuals to navigate complex financial, legal, and operational landscapes, providing clear blueprints to scale safely.'
    },
    widget: {
      type: 'quote_estimator',
      title: 'Schedule a Business Discovery Consultation',
      description: 'Select your practice area or project scope to estimate consultancy terms and reserve a strategic session.'
    }
  }
];

type Tab = 'dashboard' | 'crm' | 'scrapers' | 'scheduler' | 'settings' | 'logs';

function BaileysPairingPanel({ baseUrl }: { baseUrl: string }) {
  const [status, setStatus] = useState<string>('offline');
  const [isProcessRunning, setIsProcessRunning] = useState<boolean>(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [processLoading, setProcessLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isCloudProd = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  const handleProductionRedirect = () => {
    window.open('http://localhost:3006/#whatsapp-settings', '_blank');
  };

  const fetchStatus = async () => {
    try {
      if (isCloudProd) {
        setIsProcessRunning(false);
        setStatus('offline');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/local-trigger/whatsapp');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIsProcessRunning(data.isRunning);
      setStatus(data.isRunning ? data.status : 'offline');
      setQrUrl(data.qrCodeUrl || '');
      setError(null);
    } catch (err: any) {
      setError(`Failed to fetch WhatsApp service status.`);
      setIsProcessRunning(false);
      setStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    if (!isCloudProd) {
      const interval = setInterval(fetchStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [baseUrl, isCloudProd]);

  const handleStartService = async () => {
    if (isCloudProd) {
      handleProductionRedirect();
      return;
    }
    setProcessLoading(true);
    try {
      const res = await fetch('/api/local-trigger/whatsapp', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start');
      }
      await new Promise(r => setTimeout(r, 2000));
      await fetchStatus();
    } catch (err: any) {
      alert("Error starting WhatsApp service: " + err.message);
    } finally {
      setProcessLoading(false);
    }
  };

  const handleStopService = async () => {
    if (isCloudProd) {
      handleProductionRedirect();
      return;
    }
    if (!confirm("Are you sure you want to stop the local WhatsApp service?")) return;
    setProcessLoading(true);
    try {
      const res = await fetch('/api/local-trigger/whatsapp', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to stop');
      }
      await new Promise(r => setTimeout(r, 1000));
      await fetchStatus();
    } catch (err: any) {
      alert("Error stopping WhatsApp service: " + err.message);
    } finally {
      setProcessLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to disconnect WhatsApp and delete the session?")) return;
    setLoading(true);
    try {
      await fetch(`${baseUrl.replace(/\/+$/, '')}/logout`, { method: 'POST' });
      fetchStatus();
    } catch (err: any) {
      alert("Failed to logout: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%', marginTop: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Service Process:</span>
            {isCloudProd ? (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: 'rgba(6, 182, 212, 0.1)',
                color: '#06B6D4',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                ☁️ CLOUD PRODUCTION (MANAGED LOCALLY)
              </span>
            ) : (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: isProcessRunning ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isProcessRunning ? '#10B981' : '#EF4444',
                border: `1px solid ${isProcessRunning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                {isProcessRunning ? '● RUNNING' : '○ STOPPED'}
              </span>
            )}
          </div>
          
          {isCloudProd ? (
            <button
              type="button"
              onClick={handleProductionRedirect}
              style={{ 
                padding: '4px 10px', 
                background: 'rgba(6, 182, 212, 0.15)', 
                border: '1px solid var(--primary)', 
                color: '#fff', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Open Local Dashboard
            </button>
          ) : (
            <button
              type="button"
              disabled={processLoading}
              onClick={isProcessRunning ? handleStopService : handleStartService}
              style={{ 
                padding: '4px 10px', 
                background: isProcessRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
                border: `1px solid ${isProcessRunning ? '#EF4444' : '#10B981'}`, 
                color: isProcessRunning ? '#EF4444' : '#10B981', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                cursor: processLoading ? 'not-allowed' : 'pointer',
                opacity: processLoading ? 0.5 : 1,
                fontWeight: 500
              }}
            >
              {processLoading ? 'Processing...' : isProcessRunning ? 'Stop Service' : 'Start Service'}
            </button>
          )}
        </div>

        {!isCloudProd && isProcessRunning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: status === 'connected' ? '#10B981' : status === 'qr' ? '#F59E0B' : '#EF4444' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                WhatsApp: {status}
              </span>
            </div>
            {status === 'connected' && (
              <button 
                type="button"
                onClick={handleLogout}
                style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Disconnect Phone
              </button>
            )}
          </div>
        )}
      </div>

      {isCloudProd && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            WhatsApp Baileys must run locally to establish connection. Pair and manage your device on your local console.
          </span>
          <button
            type="button"
            onClick={handleProductionRedirect}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)'
            }}
          >
            🖥️ Open Local Console (Port 3006)
          </button>
        </div>
      )}

      {!isCloudProd && !isProcessRunning && !processLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            WhatsApp Baileys service is currently offline. Click "Start Service" above or launch below.
          </span>
          <button
            onClick={handleStartService}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(90deg, #10B981, #059669)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}
          >
            🚀 Launch WhatsApp Service
          </button>
        </div>
      )}

      {!isCloudProd && isProcessRunning && status === 'connecting' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
          <span style={{ fontSize: '0.8rem' }}>Establishing web session connection...</span>
        </div>
      )}

      {!isCloudProd && isProcessRunning && status === 'qr' && qrUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            <img src={qrUrl} alt="WhatsApp QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#F59E0B', textAlign: 'center' }}>
            Open WhatsApp on your phone → Linked Devices → Link a Device, then scan this QR code.
          </span>
          <button
            onClick={fetchStatus}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: 'linear-gradient(90deg, hsl(140,70%,40%), hsl(140,70%,60%))',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
            title="Refresh QR code"
          >
            Refresh QR
          </button>
        </div>
      )}

      {!isCloudProd && isProcessRunning && status === 'connected' && (
        <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '20px' }}>
          <span>✓ WhatsApp Web Session is Linked & Ready</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // Local runner states
  const [runnerStatus, setRunnerStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [testSmsNumber, setTestSmsNumber] = useState('');
  const [testingSms, setTestingSms] = useState(false);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [isProductionEnv, setIsProductionEnv] = useState(false);
  const [localPort, setLocalPort] = useState<string>('3006');

  const [latestLogs, setLatestLogs] = useState<any[]>([]);
  const [lastLeadsCount, setLastLeadsCount] = useState<number | null>(null);
  const hasAutoStartedRef = React.useRef(false);

  const handleCopyText = (text: string, setCopiedState: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleSendTestSms = async () => {
    if (!testSmsNumber) {
      addToast('Please enter a test phone number first.', 'error');
      return;
    }
    setTestingSms(true);
    addToast('Sending test SMS...', 'info');
    try {
      const res = await fetch('/api/config/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testNumber: testSmsNumber, config })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast(`✅ Test SMS Sent: ${data.message || 'Success'}`, 'success');
      } else {
        addToast(`❌ Failed: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setTestingSms(false);
    }
  };

  const checkRunnerStatus = async () => {
    try {
      let res;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const activeRunner = config?.activeRunnerBackend || 'local';
        const isCloud = activeRunner === 'huggingface' || activeRunner === 'github_actions';
        if (isCloud) {
          res = await fetch('/api/local-trigger');
        } else {
          res = await fetch(`http://localhost:${localPort || '3006'}/api/local-trigger`, { signal: controller.signal });
          clearTimeout(timeoutId);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        res = await fetch('/api/local-trigger');
      }

      if (res.ok) {
        const data = await res.json();
        setRunnerStatus(data.isRunning ? 'online' : 'offline');
        setActiveJob(data.currentJob || null);
        setActiveJobs(data.activeJobs || []);
        setCompletedJobs(data.completedJobs || []);
        setIsProductionEnv(!!data.isProduction);
        if (data.port) {
          setLocalPort(data.port);
        }
      } else {
        setRunnerStatus('offline');
        setActiveJob(null);
        setActiveJobs([]);
        setCompletedJobs([]);
      }
    } catch (e) {
      setRunnerStatus('offline');
      setActiveJob(null);
      setActiveJobs([]);
      setCompletedJobs([]);
    }

    try {
      const logsResp = await fetch('/api/logs');
      if (logsResp.ok) {
        const logsData = await logsResp.json();
        setLatestLogs(logsData.slice(0, 3));
        if (Array.isArray(logsData)) {
          setLogs([...logsData].reverse());
        }
      }
    } catch (err) {
      // Ignore background log errors silently
    }

    try {
      const statsResp = await fetch('/api/leads?stats=true');
      if (statsResp.ok) {
        const statsData = await statsResp.json();
        if (statsData && typeof statsData.totalLeads === 'number') {
          setStats(statsData);
        }
      }
    } catch (_) {}
  };

  const handleLocalTrigger = async () => {
    setTriggerLoading(true);
    try {
      const activeRunner = config?.activeRunnerBackend || 'local';
      const isCloud = activeRunner === 'huggingface' || activeRunner === 'github_actions';
      const targetUrl = (isCloud || !isProductionEnv) 
        ? '/api/local-trigger' 
        : `http://localhost:${localPort || '3006'}/api/local-trigger`;
      const res = await fetch(targetUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Local scraper runner started successfully.', 'success');
        setRunnerStatus('online');
      } else {
        addToast(`Error starting local runner: ${data.error || 'Unknown'}`, 'error');
      }
    } catch (e) {
      addToast(`Failed to trigger local runner. Is your local server running on port ${localPort || '3006'}?`, 'error');
    } finally {
      setTriggerLoading(false);
    }
  };

  const handleStopLocalRunner = async () => {
    setTriggerLoading(true);
    try {
      const activeRunner = config?.activeRunnerBackend || 'local';
      const isCloud = activeRunner === 'huggingface' || activeRunner === 'github_actions';
      const targetUrl = (isCloud || !isProductionEnv) 
        ? '/api/local-trigger' 
        : `http://localhost:${localPort || '3006'}/api/local-trigger`;
      const res = await fetch(targetUrl, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Local scraper runner stopped successfully.', 'success');
        setRunnerStatus('offline');
      } else {
        addToast(`Error stopping local runner: ${data.error || 'Unknown'}`, 'error');
      }
    } catch (e) {
      addToast(`Failed to stop local runner. Is your local server running on port ${localPort || '3006'}?`, 'error');
    } finally {
      setTriggerLoading(false);
    }
  };
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  // Scheduler state variables
  const [schedule, setSchedule] = useState<any>(null);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(true);
  const [generatingSchedule, setGeneratingSchedule] = useState<boolean>(false);
  const [triggeringCampaign, setTriggeringCampaign] = useState<boolean>(false);
  const [nicheFocusInput, setNicheFocusInput] = useState<string>('');
  const [locationFocusInput, setLocationFocusInput] = useState<string>('');
  const [savingSchedule, setSavingSchedule] = useState<boolean>(false);

  const fetchSchedule = async () => {
    try {
      setScheduleLoading(true);
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.schedule) {
          setSchedule(data.schedule);
          setNicheFocusInput(data.schedule.nicheFocus || '');
          setLocationFocusInput(data.schedule.locationFocus || '');
        }
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSaveScheduleSettings = async (autoQueue: boolean, interval: number) => {
    if (!schedule) return;
    try {
      setSavingSchedule(true);
      const updated = {
        ...schedule,
        autoQueueEnabled: autoQueue,
        intervalDays: interval
      };
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: updated })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSchedule(updated);
          addToast('Campaign scheduler settings saved successfully.', 'success');
        } else {
          addToast(`Error saving settings: ${data.error}`, 'error');
        }
      }
    } catch (e) {
      addToast('Failed to save scheduler settings.', 'error');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleGenerateAISchedule = async () => {
    try {
      setGeneratingSchedule(true);
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          nicheFocus: nicheFocusInput,
          locationFocus: locationFocusInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.schedule) {
          setSchedule(data.schedule);
          addToast('AI-powered campaign schedule generated successfully.', 'success');
        } else {
          addToast(`AI Generation failed: ${data.error || 'Unknown error'}`, 'error');
        }
      } else {
        addToast('Failed to generate AI schedule.', 'error');
      }
    } catch (e) {
      addToast('Error contacting schedule planner API.', 'error');
    } finally {
      setGeneratingSchedule(false);
    }
  };

  const handleTriggerNextCampaign = async () => {
    try {
      setTriggeringCampaign(true);
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trigger-next',
          force: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.queued) {
          addToast(`Campaign dispatched successfully: "${data.queued.query}"`, 'success');
          fetchSchedule();
        } else {
          addToast(data.message || 'No pending scheduled campaigns available.', 'info');
        }
      }
    } catch (e) {
      addToast('Error triggering campaign.', 'error');
    } finally {
      setTriggeringCampaign(false);
    }
  };

  const [isGmailConnecting, setIsGmailConnecting] = useState<boolean>(false);
  const [config, setConfig] = useState<RuntimeConfig>({
    googleSpreadsheetId: '',
    googlePlacesApiKey: '',
    googleClientId: '',
    googleClientSecret: '',
    googleProjectId: '',
    googleAccessToken: '',
    googleRefreshToken: '',
    googleTokenExpiry: 0,
    googleUserEmail: '',
    dryRun: true,
    businessSignature: 'Bethelmind Analytics & Strategy',
    outreachChannel: 'gmail',
    apifyToken: '',
    apifyDatasetId: '',
    whatsappPhoneNumberId: '',
    whatsappAccessToken: '',
    whatsappTemplateName: 'lead_outreach_1',
    whatsappTemplateLanguageCode: 'en_US',
    whatsappDailyCap: 50,
    whatsappEnabled: false,
    supabaseUrl: '',
    supabaseKey: '',
    geminiApiKey: '',
    storageMode: 'hybrid',
    emailProvider: 'gmail',
    resendApiKey: '',
    resendFromEmail: '',
    brevoApiKey: '',
    brevoSenderName: 'Bethelmind Analytics & Strategy',
    brevoSenderEmail: '',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    smtpSenderName: 'Bethelmind Analytics & Strategy',
    sendgridApiKey: '',
    sendgridFromEmail: '',
    sendgridSenderName: 'Bethelmind Analytics & Strategy',
    whatsappProvider: 'cloud',
    evolutionApiUrl: '',
    evolutionApiKey: '',
    evolutionInstanceName: '',
    whapiToken: '',
    whatsappBaileysUrl: 'http://localhost:3007',
    whatsappMessageTemplate: '',
    jijiEmail: '',
    jijiPassword: '',
    jijiMessageTemplate: '',
    instagramMessageTemplate: '',
    facebookMessageTemplate: '',
    tiktokMessageTemplate: '',
    linkedinMessageTemplate: '',
    smsProvider: 'gateway',
    smsMessageTemplate: '',
    smsGatewayUrl: '',
    termiiApiKey: '',
    termiiSenderId: '',
    africastalkingUsername: '',
    africastalkingApiKey: '',
    africastalkingSenderId: '',
    remoteBrowserWs: '',
    paystackPublicKey: '',
    paystackSecretKey: '',
    claimFeeNGN: 0,
    moniepointBankName: 'Moniepoint Microfinance Bank',
    moniepointAccountNumber: '',
    moniepointAccountName: '',
    opayBankName: 'OPay Digital Services (Merchant)',
    opayAccountNumber: '',
    opayAccountName: '',
    antigravityApiKey: '',
    antigravityApiKeys: [],
    antigravityModels: []
  });
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    dncLeads: 0,
    errorLeads: 0,
    googleLeads: 0,
    jijiLeads: 0,
    mapsFreeLeads: 0,
    duckduckgoLeads: 0,
    osmLeads: 0,
    instagramLeads: 0,
    facebookLeads: 0,
    tiktokLeads: 0,
    linkedinLeads: 0,
    highRatingLeads: 0,
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  
  // Meta Cloud API Connection Helper State
  const [metaConnecting, setMetaConnecting] = useState(false);
  const [metaStatus, setMetaStatus] = useState('');
  const metaIntervalRef = React.useRef<any>(null);
  
  // Scraper Forms
  const [selectedScraper, setSelectedScraper] = useState<'google' | 'jiji' | 'osm' | 'apify' | 'maps-free' | 'duckduckgo' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin'>('google');
  const [gMapsQuery, setGMapsQuery] = useState('Car Dealers Lagos');
  const [gMapsLimit, setGMapsLimit] = useState(10);
  const [runAllConcurrently, setRunAllConcurrently] = useState<boolean>(false);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [queryFilter, setQueryFilter] = useState('ALL');
  const [websiteFilter, setWebsiteFilter] = useState<'ALL' | 'NEW_BUILD' | 'UPGRADE'>('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  
  // Loading states
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Bulk Scaling states
  const [bulkQueuing, setBulkQueuing] = useState(false);
  const [bulkQueuedCount, setBulkQueuedCount] = useState<number | null>(null);

  // Selected Lead for Outreach preview
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  // Dynamic state query param login helper
  const [customLoginProjectId, setCustomLoginProjectId] = useState('');
  const [customClientId, setCustomClientId] = useState('');
  const [customClientSecret, setCustomClientSecret] = useState('');
  const [showClientSecret, setShowClientSecret] = useState(false);

  // Custom Outreach Message overrides
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [customMessageText, setCustomMessageText] = useState('');
  const [customSubjectText, setCustomSubjectText] = useState('');

  // Sheets Sync & Outreach Progress states
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'red' | 'yellow' | 'green'>('red');
  const [sheetsSyncMessage, setSheetsSyncMessage] = useState<string>('Setup Required');
  const [outreachProgress, setOutreachProgress] = useState({
    active: false,
    current: 0,
    total: 0,
    successes: 0,
    failures: 0,
    statusText: ''
  });

  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [outreachLogs, setOutreachLogs] = useState<{ leadName: string; logs: string[]; finalStatus: string; channelResults?: any[] }[]>([]);

  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    success: boolean;
    error: string | null;
  } | null>(null);

  // New UI/UX states
  const mainRef = React.useRef<HTMLElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [crmTableWidth, setCrmTableWidth] = useState(800);
  const [isExporting, setIsExporting] = useState(false);
  const [testingSheets, setTestingSheets] = useState(false);
  const [savingConfigState, setSavingConfigState] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const navigateToSettingsSection = (sectionId: string) => {
    if (sectionId === 'scraper-runner-control') {
      setActiveTab('scrapers');
    } else {
      setActiveTab('settings');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const renderStatusChip = (label: string, value: string, status: 'green' | 'yellow' | 'red', targetSection: string) => {
    const baseColor = status === 'green' ? '16, 185, 129' : status === 'yellow' ? '245, 158, 11' : '239, 68, 68';
    return (
      <div 
        onClick={() => navigateToSettingsSection(targetSection)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `rgba(${baseColor}, 0.15)`;
          e.currentTarget.style.borderColor = `rgba(${baseColor}, 0.35)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `rgba(${baseColor}, 0.06)`;
          e.currentTarget.style.borderColor = `rgba(${baseColor}, 0.15)`;
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid rgba(${baseColor}, 0.15)`,
          background: `rgba(${baseColor}, 0.06)`,
          color: `rgb(${baseColor})`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
      >
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: `rgb(${baseColor})`,
            boxShadow: `0 0 8px rgb(${baseColor})`
          }}></span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    if (activeTab === 'scheduler') {
      fetchSchedule();
    }
  }, [activeTab]);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboarding_complete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);


  const checkSupabaseStatus = async () => {
    try {
      const resp = await fetch('/api/config/test-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await resp.json();
      setSupabaseStatus(data);
    } catch (e: any) {
      setSupabaseStatus({
        configured: false,
        connected: false,
        success: false,
        error: e.message || 'Failed to verify Supabase connection'
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setQueryFilter('ALL');
    setStatusFilter('ALL');
    setWebsiteFilter('ALL');
    setPlatformFilter('ALL');
    setChannelFilter('ALL');
  };

  // Video Demo states
  const [videoPlaying, setVideoPlaying] = useState(false);

  // CRM preview sidebar tabs
  const [crmPreviewTab, setCrmPreviewTab] = useState<'outreach' | 'customizer' | 'tasks' | 'handover'>('outreach');

  // Customizer visual overrides states
  const [overridePrimary, setOverridePrimary] = useState('');
  const [overrideAccent, setOverrideAccent] = useState('');
  const [overrideBg, setOverrideBg] = useState('');
  const [overrideText, setOverrideText] = useState('');
  const [overrideFont, setOverrideFont] = useState('');
  const [overrideHeroTitle, setOverrideHeroTitle] = useState('');
  const [overrideHeroSubtitle, setOverrideHeroSubtitle] = useState('');
  const [overrideCtaText, setOverrideCtaText] = useState('');
  const [overrideAboutText, setOverrideAboutText] = useState('');
  const [overrideShowServices, setOverrideShowServices] = useState(true);
  const [overrideShowTestimonials, setOverrideShowTestimonials] = useState(true);
  const [overrideShowEstimator, setOverrideShowEstimator] = useState(true);
  const [overrideShowAbout, setOverrideShowAbout] = useState(true);
  const [overrideWidgetType, setOverrideWidgetType] = useState('');
  const [overrideWidgetTitle, setOverrideWidgetTitle] = useState('');
  const [overrideWidgetDescription, setOverrideWidgetDescription] = useState('');
  
  // AI Redesign states
  const [aiRedesignPrompt, setAiRedesignPrompt] = useState('');
  const [aiRedesignLoading, setAiRedesignLoading] = useState(false);

  // Antigravity tasks states
  const [taskQueuePrompt, setTaskQueuePrompt] = useState('');
  const [taskQueuePriority, setTaskQueuePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskQueueLoading, setTaskQueueLoading] = useState(false);

  // Turnout state
  const [turnoutMode, setTurnoutMode] = useState<'dynamic' | 'n8n' | 'git'>('dynamic');

  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchLeads();
    fetchLogs();
    checkSheetsStatus();
    checkSupabaseStatus();
    checkRunnerStatus();
    fetchSchedule();

    const isCompleted = localStorage.getItem("onboarding_complete");
    if (isCompleted !== "true") {
      setShowOnboarding(true);
    }

    // Set up local runner polling interval
    const interval = setInterval(checkRunnerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch overrides and turnout settings on Lead select
  useEffect(() => {
    if (!previewLead) return;

    // Reset customization inputs first to prevent bleed from previous lead
    setOverridePrimary('');
    setOverrideAccent('');
    setOverrideBg('');
    setOverrideText('');
    setOverrideFont('');
    setOverrideHeroTitle('');
    setOverrideHeroSubtitle('');
    setOverrideCtaText('');
    setOverrideAboutText('');
    setOverrideShowServices(true);
    setOverrideShowTestimonials(true);
    setOverrideShowEstimator(true);
    setOverrideShowAbout(true);
    setOverrideWidgetType('');
    setOverrideWidgetTitle('');
    setOverrideWidgetDescription('');
    
    // Parse turnout mode from lead's notes using scalingHelper syntax
    let mode: 'dynamic' | 'n8n' | 'git' = 'dynamic';
    if (previewLead.notes) {
      if (previewLead.notes.includes('[scaling: n8n]')) {
        mode = 'n8n';
      } else if (previewLead.notes.includes('[scaling: git]')) {
        mode = 'git';
      }
    }
    setTurnoutMode(mode);

    // Fetch existing overrides
    fetch(`/api/preview/override?leadId=${encodeURIComponent(previewLead.lead_id)}`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch config: ${res.status} ${res.statusText} - ${text.substring(0, 100)}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && !data.error) {
          if (data.theme) {
            setOverridePrimary(data.theme.primary || '');
            setOverrideAccent(data.theme.accent || '');
            setOverrideBg(data.theme.bg || '');
            setOverrideText(data.theme.text || '');
            setOverrideFont(data.theme.font || '');
          }
          if (data.copy) {
            setOverrideHeroTitle(data.copy.heroTitle || '');
            setOverrideHeroSubtitle(data.copy.heroSubtitle || '');
            setOverrideCtaText(data.copy.ctaText || '');
            setOverrideAboutText(data.copy.aboutText || '');
          }
          if (data.visibility) {
            setOverrideShowServices(data.visibility.showServices !== false);
            setOverrideShowTestimonials(data.visibility.showTestimonials !== false);
            setOverrideShowEstimator(data.visibility.showEstimator !== false);
            setOverrideShowAbout(data.visibility.showAbout !== false);
          }
          if (data.pitch) {
            setOverrideWidgetType(data.pitch.widgetType || '');
            setOverrideWidgetTitle(data.pitch.widgetTitle || '');
            setOverrideWidgetDescription(data.pitch.widgetDescription || '');
          }
        }
      })
      .catch(err => console.error('Error fetching overrides:', err));
  }, [previewLead]);

  const saveOverrides = async () => {
    if (!previewLead) return;
    try {
      setStatusMessage('Saving custom website overrides...');
      const response = await fetch('/api/preview/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          overrides: {
            theme: {
              primary: overridePrimary,
              accent: overrideAccent,
              bg: overrideBg,
              text: overrideText,
              font: overrideFont,
            },
            copy: {
              heroTitle: overrideHeroTitle,
              heroSubtitle: overrideHeroSubtitle,
              ctaText: overrideCtaText,
              aboutText: overrideAboutText,
            },
            visibility: {
              showServices: overrideShowServices,
              showTestimonials: overrideShowTestimonials,
              showEstimator: overrideShowEstimator,
              showAbout: overrideShowAbout,
            },
            pitch: {
              widgetType: overrideWidgetType,
              widgetTitle: overrideWidgetTitle,
              widgetDescription: overrideWidgetDescription,
            }
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('Website overrides saved successfully!');
        confetti({ particleCount: 30, spread: 50 });
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const applyPreset = (preset: typeof WEBSITE_STYLE_PRESETS[0]) => {
    if (!preset) return;
    setOverridePrimary(preset.theme.primary);
    setOverrideAccent(preset.theme.accent);
    setOverrideBg(preset.theme.bg);
    setOverrideText(preset.theme.text);
    setOverrideFont(preset.theme.font);
    
    // Add business name if we have a previewLead
    const businessName = previewLead?.name || 'our business';
    
    // Format copy nicely with business name context
    setOverrideHeroTitle(preset.copy.heroTitle);
    setOverrideHeroSubtitle(preset.copy.heroSubtitle);
    setOverrideCtaText(preset.copy.ctaText);
    
    // Customize about text if lead name is available
    const customAbout = preset.copy.aboutText
      .replace(/Our clinic/g, `Our team at ${businessName}`)
      .replace(/Our modern dental suite/g, `${businessName}`)
      .replace(/Our experienced advisors/g, `Our team at ${businessName}`);
    setOverrideAboutText(customAbout);

    // Apply recommended widget
    setOverrideWidgetType(preset.widget.type);
    
    // Customize widget title and description
    setOverrideWidgetTitle(preset.widget.title);
    setOverrideWidgetDescription(preset.widget.description);
    
    setStatusMessage(`Applied ${preset.name} preset!`);
  };

  const autoDetectPreset = () => {
    if (!previewLead) return;
    const category = (previewLead.category || '').toLowerCase();
    const name = (previewLead.name || '').toLowerCase();
    const combined = `${category} ${name}`;
    
    // Find matching preset by keywords
    const match = WEBSITE_STYLE_PRESETS.find(preset => 
      preset.categoryKeywords.some(keyword => combined.includes(keyword))
    ) || WEBSITE_STYLE_PRESETS[WEBSITE_STYLE_PRESETS.length - 1]; // Default to general business
    
    applyPreset(match);
    setStatusMessage(`Auto-detected: Applied ${match.name} based on category "${previewLead.category || 'General'}"!`);
  };

  const handleAiRedesign = async () => {
    if (!previewLead || !aiRedesignPrompt) return;
    try {
      setAiRedesignLoading(true);
      setStatusMessage('Calling Gemini Vertex AI to compile redesign...');
      const response = await fetch('/api/preview/ai-redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          prompt: aiRedesignPrompt
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('AI redesign completed! Reloading overrides...');
        setAiRedesignPrompt('');
        
        // Reload overrides
        const res = await fetch(`/api/preview/override?leadId=${encodeURIComponent(previewLead.lead_id)}`);
        const ov = await res.json();
        if (ov && !ov.error) {
          if (ov.theme) {
            setOverridePrimary(ov.theme.primary || '');
            setOverrideAccent(ov.theme.accent || '');
            setOverrideBg(ov.theme.bg || '');
            setOverrideText(ov.theme.text || '');
            setOverrideFont(ov.theme.font || '');
          }
          if (ov.copy) {
            setOverrideHeroTitle(ov.copy.heroTitle || '');
            setOverrideHeroSubtitle(ov.copy.heroSubtitle || '');
            setOverrideCtaText(ov.copy.ctaText || '');
            setOverrideAboutText(ov.copy.aboutText || '');
          }
          if (ov.visibility) {
            setOverrideShowServices(ov.visibility.showServices !== false);
            setOverrideShowTestimonials(ov.visibility.showTestimonials !== false);
            setOverrideShowEstimator(ov.visibility.showEstimator !== false);
            setOverrideShowAbout(ov.visibility.showAbout !== false);
          }
        }
        confetti({ particleCount: 40, spread: 60 });
      } else {
        setStatusMessage(`AI Error: ${data.error || 'Failed to execute redesign'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setAiRedesignLoading(false);
    }
  };

  const queueTask = async () => {
    if (!previewLead || !taskQueuePrompt) return;
    try {
      setTaskQueueLoading(true);
      setStatusMessage('Logging autonomous coding task to Antigravity queue...');
      const response = await fetch('/api/preview/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          prompt: taskQueuePrompt,
          task: taskQueuePrompt,
          priority: taskQueuePriority
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('Task successfully queued for Antigravity autonomous developer!');
        setTaskQueuePrompt('');
        confetti({ particleCount: 30, spread: 40 });
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to queue task'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setTaskQueueLoading(false);
    }
  };

  const updateTurnoutMode = async (mode: 'dynamic' | 'n8n' | 'git') => {
    if (!previewLead) return;
    try {
      setStatusMessage('Updating turnout mode configuration...');
      setTurnoutMode(mode);
      
      let newNotes = previewLead.notes || '';
      const scalingRegex = /\[scaling:\s*[^\]]+\]/;
      if (scalingRegex.test(newNotes)) {
        newNotes = newNotes.replace(scalingRegex, `[scaling: ${mode}]`);
      } else {
        newNotes = newNotes ? `${newNotes} [scaling: ${mode}]` : `[scaling: ${mode}]`;
      }

      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: previewLead.lead_id,
          notes: newNotes
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage(`Turnout mode updated to ${mode.toUpperCase()}!`);
        setPreviewLead({
          ...previewLead,
          notes: newNotes
        });
        fetchLeads();
      } else {
        setStatusMessage('Failed to update turnout mode.');
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const resp = await fetch('/api/config');
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        if (data.googleProjectId) {
          setCustomLoginProjectId(data.googleProjectId);
        }
        if (data.googleClientId) {
          setCustomClientId(data.googleClientId);
        }
        if (data.googleClientSecret) {
          setCustomClientSecret(data.googleClientSecret);
        }
        if (data.storageMode === 'supabase') {
          checkSupabaseStatus();
        } else {
          setSupabaseStatus(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConfig(false);
    }
  };

  const runDiagnostics = async () => {
    try {
      setCheckingHealth(true);
      addToast('Running channel connectivity diagnostics...', 'info');
      const resp = await fetch('/api/health-check');
      const data = await resp.json();
      if (data.success) {
        setHealthStatus(data.health);
        addToast('Diagnostics complete!', 'success');
        fetchConfig();
      } else {
        addToast('Diagnostics failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      addToast('Diagnostics error: ' + err.message, 'error');
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (config.serviceHealthStatus) {
      try {
        setHealthStatus(JSON.parse(config.serviceHealthStatus));
      } catch (e) {
        console.error("Failed to parse serviceHealthStatus", e);
      }
    } else {
      setHealthStatus(null);
    }
  }, [config.serviceHealthStatus]);

  // Real-Time Automated Live Update Stream (syncs every 3 seconds) + Auto-Start on App Load
  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchLeads();
    fetchLogs();
    checkRunnerStatus();

    // Auto-Start Scraper Pipeline on App Load (Set & Forget Mode)
    if (!hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      setTimeout(() => {
        runLagos10KStandalone();
      }, 1500);
    }

    const liveSyncInterval = setInterval(async () => {
      checkRunnerStatus();
      fetchStats();
      fetchLogs();
      
      try {
        const resp = await fetch('/api/leads');
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data)) {
            setLeads(data);
            setLastLeadsCount(prev => {
              if (prev !== null && data.length > prev) {
                const diff = data.length - prev;
                addToast(`🎉 Live Update: +${diff} new leads extracted & added to CRM!`, 'success');
              }
              return data.length;
            });
          }
        }
      } catch (_) {}
    }, 3000);

    return () => clearInterval(liveSyncInterval);
  }, []);

  const scrollToSectionAndFocus = (id: string, focusSelector?: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const originalBorder = section.style.border;
      const originalBoxShadow = section.style.boxShadow;
      section.style.border = '1px solid var(--success)';
      section.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
      setTimeout(() => {
        section.style.border = originalBorder;
        section.style.boxShadow = originalBoxShadow;
      }, 3000);
      
      if (focusSelector) {
        setTimeout(() => {
          const input = section.querySelector(focusSelector) as HTMLElement;
          if (input) input.focus();
        }, 600);
      }
    } else {
      addToast(`Could not find settings section: ${id}`, 'error');
    }
  };

  const quickRemoveProxy = async (proxyUrl: string) => {
    if (!confirm(`Are you sure you want to remove this proxy from the pool?\n\n${proxyUrl}`)) {
      return;
    }
    const currentPool = config.proxyPool || '';
    const parts = currentPool.split(',').map((p: string) => p.trim()).filter(Boolean);
    const updatedParts = parts.filter(p => p !== proxyUrl);
    const updatedPool = updatedParts.join(', ');
    
    const newConfig = { ...config, proxyPool: updatedPool };
    setConfig(newConfig);
    
    addToast("Removing proxy and updating configuration...", "info");
    try {
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      const data = await resp.json();
      if (data && !data.error) {
        addToast("Proxy removed successfully. Re-running diagnostics...", "success");
        setTimeout(() => {
          runDiagnostics();
        }, 500);
      } else {
        addToast("Failed to update config: " + data.error, "error");
      }
    } catch (e: any) {
      addToast("Failed to remove proxy: " + e.message, "error");
    }
  };

  const verifyProxies = async () => {
    addToast("Saving settings and running proxy diagnostics...", "info");
    try {
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data.config || data);
        addToast("Settings saved. Verifying proxy connection...", "success");
        setTimeout(() => {
          runDiagnostics();
        }, 500);
      } else {
        addToast("Failed to save configuration: " + data.error, "error");
      }
    } catch (e: any) {
      addToast("Failed to verify proxies: " + e.message, "error");
    }
  };

  const startMetaConnection = async () => {
    setMetaConnecting(true);
    setMetaStatus('Initializing...');
    addToast('Starting Meta connection helper...', 'info');

    if (metaIntervalRef.current) {
      clearInterval(metaIntervalRef.current);
    }

    try {
      const res = await fetch('/api/auth/meta/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });
      const data = await res.json();
      if (data.error) {
        setMetaConnecting(false);
        setMetaStatus(`Error: ${data.error}`);
        addToast(`Failed to start: ${data.error}`, 'error');
        return;
      }

      metaIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/auth/meta/connect?action=status');
          const statusData = await statusRes.json();
          if (statusData && statusData.status) {
            setMetaStatus(statusData.status);
            
            if (statusData.status.includes('Success')) {
              clearInterval(metaIntervalRef.current);
              setMetaConnecting(false);
              addToast('Successfully linked Facebook account and retrieved credentials!', 'success');
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
              
              const configRes = await fetch('/api/config');
              const configData = await configRes.json();
              if (configData && !configData.error) {
                setConfig(configData.config || configData);
              }
            } else if (statusData.status.includes('Error')) {
              clearInterval(metaIntervalRef.current);
              setMetaConnecting(false);
              addToast(statusData.status, 'error');
            }
          }
        } catch (pollErr: any) {
          console.error('Polling error:', pollErr);
        }
      }, 1500);

    } catch (e: any) {
      setMetaConnecting(false);
      setMetaStatus(`Error: ${e.message}`);
      addToast(`Error connecting to Meta: ${e.message}`, 'error');
    }
  };

  const stopMetaConnection = async () => {
    if (metaIntervalRef.current) {
      clearInterval(metaIntervalRef.current);
    }
    setMetaConnecting(false);
    setMetaStatus('Stopping browser...');
    addToast('Stopping Meta connection helper...', 'info');

    try {
      const res = await fetch('/api/auth/meta/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });
      const data = await res.json();
      if (data.error) {
        setMetaStatus(`Error stopping: ${data.error}`);
        addToast(`Failed to stop: ${data.error}`, 'error');
      } else {
        setMetaStatus('Stopped');
        addToast('Browser stopped successfully.', 'success');
      }
    } catch (e: any) {
      setMetaStatus(`Error stopping: ${e.message}`);
      addToast(`Error stopping: ${e.message}`, 'error');
    }
  };

  React.useEffect(() => {
    return () => {
      if (metaIntervalRef.current) {
        clearInterval(metaIntervalRef.current);
      }
    };
  }, []);

  const saveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfigState(true);
    try {
      setStatusMessage('Saving configurations...');
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await resp.json();
      if (data && !data.error) {
        const savedConfig = data.config || data;
        setConfig(savedConfig);
        setStatusMessage('Settings updated successfully!');
        addToast('Settings updated successfully!', 'success');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        if (savedConfig.storageMode === 'supabase') {
          checkSupabaseStatus();
        } else {
          setSupabaseStatus(null);
        }
      } else {
        setStatusMessage(`Error: ${data.error}`);
        addToast(`Error: ${data.error}`, 'error');
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
      addToast(`Error: ${e.message}`, 'error');
    } finally {
      setSavingConfigState(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const resp = await fetch('/api/leads?stats=true');
      const data = await resp.json();
      if (data && !data.error) {
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const resp = await fetch('/api/leads');
      const data = await resp.json();
      if (Array.isArray(data)) {
        // Enforce lead order / display
        setLeads(data);
        if (data.length > 0) setPreviewLead(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const resp = await fetch('/api/logs');
      const data = await resp.json();
      if (Array.isArray(data)) {
        setLogs(data.reverse()); // show newest first
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const checkSheetsStatus = async (init = false) => {
    try {
      const resp = await fetch('/api/config/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialize: init })
      });
      const data = await resp.json();
      if (data.status) {
        setSheetsSyncStatus(data.status);
        if (data.status === 'green') {
          setSheetsSyncMessage("Fully Synced");
        } else if (data.status === 'yellow') {
          setSheetsSyncMessage("Connected (Missing Tabs)");
        } else {
          setSheetsSyncMessage(data.error || "Setup Required");
        }
      } else {
        setSheetsSyncStatus('red');
        setSheetsSyncMessage(data.error || "Disconnected");
      }
    } catch (e: any) {
      setSheetsSyncStatus('red');
      setSheetsSyncMessage(e.message || "Connection Error");
    }
  };

  const handleRefreshAll = async () => {
    try {
      addToast('Syncing pipeline data...', 'info');
      await Promise.all([
        fetchStats(),
        fetchLeads(),
        fetchLogs(),
        checkSheetsStatus(),
        checkSupabaseStatus()
      ]);
      addToast('Pipeline synced successfully!', 'success');
    } catch (e: any) {
      addToast(`Sync failed: ${e.message}`, 'error');
    }
  };

  // Run selected Lead Scraper
  const runScraper = async () => {
    try {
      setScraping(true);
      
      const scrapersToRun = runAllConcurrently 
        ? ['google', 'jiji', 'osm', 'maps-free', 'duckduckgo', 'instagram', 'facebook'] 
        : [selectedScraper];

      const queuedJobIds: string[] = [];

      for (const scraper of scrapersToRun) {
        let endpoint = '/api/scrape/maps';
        let payload: any = { query: gMapsQuery, limit: gMapsLimit };
        let scraperName = 'Google Places API';

        if (scraper === 'jiji') {
          endpoint = '/api/scrape/jiji';
          const searchSlug = gMapsQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          payload = { 
            url: gMapsQuery.startsWith('http') ? gMapsQuery : `https://jiji.ng/lagos/${searchSlug}`, 
            limit: gMapsLimit 
          };
          scraperName = 'Jiji.ng Crawler';
        } else if (scraper === 'osm') {
          endpoint = '/api/scrape/osm';
          payload = { query: gMapsQuery, limit: gMapsLimit };
          scraperName = 'OpenStreetMap (OSM)';
        } else if (scraper === 'apify') {
          endpoint = '/api/apify';
          payload = { query: gMapsQuery, limit: gMapsLimit };
          scraperName = 'Apify Google Maps';
        } else if (scraper === 'maps-free') {
          endpoint = '/api/scrape/maps-free';
          payload = { query: gMapsQuery, limit: gMapsLimit };
          scraperName = 'Google Maps Free';
        } else if (scraper === 'duckduckgo') {
          endpoint = '/api/scrape/duckduckgo';
          payload = { query: gMapsQuery, limit: gMapsLimit };
          scraperName = 'DuckDuckGo Scraper';
        } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(scraper)) {
          endpoint = '/api/scrape/social';
          payload = { platform: scraper, query: gMapsQuery, limit: gMapsLimit };
          scraperName = scraper.charAt(0).toUpperCase() + scraper.slice(1) + ' Scraper';
        }

        setStatusMessage(`Executing ${scraperName} scrape for "${payload.query || payload.url}"...`);
        
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          if (data.error) {
            addToast(`[${scraperName}] ${data.error}`, 'error');
          } else if (data.status === 'queued' && data.jobId) {
            addToast(`[${scraperName}] Job queued (ID: ${data.jobId}).`, 'info');
            queuedJobIds.push(data.jobId);
          } else if (data.added !== undefined) {
             // Direct sync-run response
             addToast(`[${scraperName}] Sync execution completed. Added ${data.added} leads.`, 'success');
          }
        } catch (err: any) {
          addToast(`Failed request for ${scraperName}: ${err.message}`, 'error');
        }
      }

      setStatusMessage(runAllConcurrently ? 'All scraping engines initiated.' : 'Scraping request sent.');

      // Auto-start local runner if it is offline
      if (runnerStatus === 'offline' && queuedJobIds.length > 0) {
        const activeRunner = config?.activeRunnerBackend || 'local';
        const isCloud = activeRunner === 'huggingface' || activeRunner === 'github_actions';
        const runnerLabel = activeRunner === 'github_actions'
          ? 'GitHub Actions cloud runner'
          : (activeRunner === 'huggingface' ? 'Hugging Face space' : 'local background worker');
        setStatusMessage(`Queue runner is offline. Auto-starting ${runnerLabel}...`);
        try {
          const targetUrl = (isCloud || !isProductionEnv) 
            ? '/api/local-trigger' 
            : `http://localhost:${localPort || '3006'}/api/local-trigger`;
          await fetch(targetUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors' 
          });
          setRunnerStatus('online');
          addToast(`Auto-started ${runnerLabel} to process queue.`, 'success');
        } catch {
          addToast('Could not start queue runner.', 'error');
        }
      }

      if (queuedJobIds.length === 0) {
        setScraping(false);
        handleRefreshAll();
        setStatusMessage('Sync scrape runs completed.');
        return;
      }

      // Stream job status via SSE with a fallback to HTTP polling
      await new Promise<void>((resolve) => {
        const activeJobs = new Set<string>(queuedJobIds);
        let es: EventSource | null = null;
        let isPolling = false;
        let pollInterval: NodeJS.Timeout | null = null;

        const startPollingFallback = () => {
          if (isPolling) return;
          isPolling = true;
          console.warn('⚠️ SSE stream failed. Falling back to HTTP polling for job updates...');
          
          pollInterval = setInterval(async () => {
            try {
              for (const jobId of Array.from(activeJobs)) {
                const res = await fetch(`/api/scrape/jobs/${jobId}`);
                if (res.ok) {
                  const job = await res.json();
                  if (job.status === 'completed') {
                    activeJobs.delete(jobId);
                    handleRefreshAll();
                    addToast(`Scrape job ${jobId.substring(0, 8)} completed.`, 'success');
                  } else if (job.status === 'failed') {
                    activeJobs.delete(jobId);
                    addToast(`Scrape job ${jobId.substring(0, 8)} failed: ${job.error_message || 'Unknown error'}`, 'error');
                  } else if (job.status === 'running') {
                    const completedCount = queuedJobIds.length - activeJobs.size;
                    setStatusMessage(`Scraping progress: ${completedCount}/${queuedJobIds.length} completed. (Running job ${jobId.substring(0, 8)}...)`);
                  }
                }
              }
              if (activeJobs.size === 0) {
                cleanup();
              }
            } catch (err) {
              console.error('Polling error:', err);
            }
          }, 3000);
        };

        const cleanup = () => {
          if (es) {
            try { es.close(); } catch (_) {}
          }
          if (pollInterval) {
            clearInterval(pollInterval);
          }
          resolve();
        };

        try {
          const streamUrl = `/api/logs/stream?jobIds=${queuedJobIds.join(',')}`;
          es = new EventSource(streamUrl);

          es.addEventListener('status', (e: MessageEvent) => {
            try {
              const { jobId, status, error } = JSON.parse(e.data);
              if (status === 'completed') {
                activeJobs.delete(jobId);
                handleRefreshAll();
                addToast(`Scrape job ${jobId.substring(0, 8)} completed.`, 'success');
              } else if (status === 'failed') {
                activeJobs.delete(jobId);
                addToast(`Scrape job ${jobId.substring(0, 8)} failed: ${error || 'Unknown error'}`, 'error');
              } else if (status === 'running') {
                const completedCount = queuedJobIds.length - activeJobs.size;
                setStatusMessage(`Scraping progress: ${completedCount}/${queuedJobIds.length} completed. (Running job ${jobId.substring(0, 8)}...)`);
              }
            } catch (_) {}
          });

          es.addEventListener('log', (e: MessageEvent) => {
            try {
              const newLines: any[] = JSON.parse(e.data);
              if (newLines.length > 0) {
                const last = newLines[newLines.length - 1];
                const [runId, , step, , status, message] = last;
                const completedCount = queuedJobIds.length - activeJobs.size;
                setStatusMessage(
                  `Scraping (${completedCount}/${queuedJobIds.length} done) | [${runId ?? ''}] [${step ?? ''}/${status ?? ''}] ${message ?? ''}`
                );
              }
            } catch (_) {}
          });

          es.addEventListener('done', () => {
            cleanup();
          });

          es.onerror = () => {
            if (es) {
              try { es.close(); } catch (_) {}
            }
            startPollingFallback();
          };
        } catch (err) {
          startPollingFallback();
        }

        // Safety timeout: close after 11 minutes regardless
        const timeout = setTimeout(() => {
          cleanup();
        }, 11 * 60 * 1000);

        // Also check if all jobs are tracked as finished
        const checkDone = setInterval(() => {
          if (activeJobs.size === 0) {
            clearInterval(checkDone);
            clearTimeout(timeout);
            cleanup();
          }
        }, 2000);
      });

      setStatusMessage('All active scrape runs finalized.');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      handleRefreshAll();
    } catch (e: any) {
      addToast(`Scraper Execution Error: ${e.message}`, 'error');
    } finally {
      setScraping(false);
    }
  };

  // Run Bulk Queuer for 10,000 Daily Leads (Lagos)
  const runBulkQueuer = async () => {
    try {
      setBulkQueuing(true);
      addToast('Dispatching Lagos 10K Multi-Engine Scraper (Google Maps, Jiji, OSM, Social, DuckDuckGo)...', 'info');
      const resp = await fetch('/api/scrape/bulk-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          limit: 100, 
          maxJobsToQueue: 100, 
          targetLagosDaily10k: true,
          scrapers: ['maps-free', 'jiji', 'osm', 'social', 'duckduckgo']
        })
      });
      const data = await resp.json();
      if (data.success) {
        setBulkQueuedCount(data.jobsCount);
        addToast(data.message || `Successfully queued ${data.jobsCount} scraper jobs for Lagos.`, 'success');
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        handleRefreshAll();
      } else {
        addToast(data.error || 'Failed to queue Lagos scraper jobs', 'error');
      }
    } catch (e: any) {
      addToast(`Error queueing bulk jobs: ${e.message}`, 'error');
    } finally {
      setBulkQueuing(false);
    }
  };

  // Standalone Lagos 10K launcher: auto-starts runner if offline, then queues all jobs
  const runLagos10KStandalone = async () => {
    setBulkQueuing(true);
    try {
      // Step 1: Ensure runner process is started automatically
      const activeRunner = config?.activeRunnerBackend || 'local';
      const isHF = activeRunner === 'huggingface';
      const isCloud = activeRunner === 'huggingface' || activeRunner === 'github_actions';
      const runnerLabel = activeRunner === 'github_actions' 
        ? 'GitHub Actions Cloud Runner' 
        : (activeRunner === 'huggingface' ? 'Cloud Space Runner' : 'Local Runner');
      
      addToast(`🚀 Step 1/2: Initializing ${runnerLabel}...`, 'info');
      try {
        const targetUrl = (isCloud || !isProductionEnv) 
          ? '/api/local-trigger' 
          : `http://localhost:${localPort || '3006'}/api/local-trigger`;
        const runnerRes = await fetch(targetUrl, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        });
        if (runnerRes.ok) {
          setRunnerStatus('online');
          addToast(isHF ? '✅ Cloud Space Runner online!' : '✅ Local Runner process active!', 'success');
        } else {
          const d = await runnerRes.json().catch(() => ({}));
          addToast(`⚠️ Runner start notice: ${d.error || 'Dispatching scrapers...'}. Queueing jobs...`, 'info');
        }
      } catch (err: any) {
        addToast(`⚠️ Triggering scraper pipeline...`, 'info');
      }

      // Brief pause so runner process binds
      await new Promise(r => setTimeout(r, 1000));

      // Step 2: Queue all Lagos 10K scraper jobs
      addToast('⚡ Step 2/2: Dispatching 100 Multi-Engine Scraper Jobs (Google Maps, Jiji, OSM, Social, DuckDuckGo)...', 'info');
      const resp = await fetch('/api/scrape/bulk-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          limit: 100, 
          maxJobsToQueue: 100, 
          targetLagosDaily10k: true,
          scrapers: ['maps-free', 'jiji', 'osm', 'social', 'duckduckgo']
        })
      });
      const data = await resp.json();
      if (data.success) {
        setBulkQueuedCount(data.jobsCount);
        addToast(`🎉 ${data.jobsCount} scraper jobs active! Multi-engine pipeline targeting 10,000 Lagos leads.`, 'success');
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
        await checkRunnerStatus();
        handleRefreshAll();
      } else {
        addToast(data.error || 'Failed to queue Lagos scraper jobs', 'error');
      }
    } catch (e: any) {
      addToast(`Lagos 10K Error: ${e.message}`, 'error');
    } finally {
      setBulkQueuing(false);
    }
  };


  // Run Dynamic Outreach Campaign
  const runOutreach = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead from the CRM table.");
      return;
    }
    
    const channel = config.outreachChannel || 'gmail';
    const emailProvider = config.emailProvider || 'gmail';
    
    let endpoint = '/api/outreach';
    let channelName = 'Email';
    
    if (channel === 'whatsapp') {
      endpoint = '/api/whatsapp';
      channelName = 'WhatsApp';
    } else if (channel === 'sms') {
      endpoint = '/api/sms';
      channelName = 'SMS';
    } else if (channel === 'coldcall') {
      endpoint = '/api/calls';
      channelName = 'Twilio Cold Call';
    } else if (channel === 'jiji') {
      endpoint = '/api/jiji';
      channelName = 'Jiji Auto-Message';
    } else if (channel === 'multichannel') {
      endpoint = '/api/outreach/multichannel';
      channelName = 'Multichannel (Email+WhatsApp+SMS)';
    } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(channel)) {
      endpoint = '/api/social-outreach';
      channelName = channel.charAt(0).toUpperCase() + channel.slice(1) + ' Auto-Message';
    } else {
      channelName = `Email (${emailProvider.toUpperCase()})`;
    }

    const leadIdsArray = Array.from(selectedLeads);
    const totalLeads = leadIdsArray.length;
    
    setSendingOutreach(true);
    setOutreachLogs([]);
    setOutreachProgress({
      active: true,
      current: 0,
      total: totalLeads,
      successes: 0,
      failures: 0,
      statusText: `Initializing ${channelName} queue...`
    });

    let localSuccesses = 0;
    let localFailures = 0;

    for (let i = 0; i < totalLeads; i++) {
      const leadId = leadIdsArray[i];
      const leadObj = leads.find(l => l.lead_id === leadId);
      const leadName = leadObj ? leadObj.name : 'Unknown';

      setOutreachProgress(prev => ({
        ...prev,
        current: i + 1,
        statusText: `Sending message ${i + 1} of ${totalLeads} to ${leadName}...`
      }));

      try {
        const payload: any = {
          leadIds: [leadId],
          dryRunOverride: config.dryRun,
          dryRun: config.dryRun
        };

        if (useCustomMessage) {
          payload.customMessage = customMessageText;
          if (channel === 'gmail' || channelName.toLowerCase().includes('email')) {
            payload.customSubject = customSubjectText;
          }
        }

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await resp.json();
        if (data.error) {
          console.error(`Failed for ${leadName}:`, data.error);
          localFailures++;
          setOutreachLogs(prev => [...prev, {
            leadName,
            logs: [`API connection failure: ${data.error}`],
            finalStatus: 'ERROR'
          }]);
        } else {
          const leadResult = data.results && data.results[0];
          if (leadResult) {
            const status = leadResult.status;
            if (status === 'ERROR') {
              localFailures++;
            } else {
              localSuccesses++;
            }
            setOutreachLogs(prev => [...prev, {
              leadName,
              logs: leadResult.logs || [leadResult.details || `Completed outreach`],
              finalStatus: status,
              channelResults: leadResult.channelResults
            }]);
          } else {
            if (data.success) {
              localSuccesses++;
              setOutreachLogs(prev => [...prev, {
                leadName,
                logs: ['Outreach completed successfully.'],
                finalStatus: 'CONTACTED'
              }]);
            } else {
              localFailures++;
              setOutreachLogs(prev => [...prev, {
                leadName,
                logs: ['Unknown failure during dispatch.'],
                finalStatus: 'ERROR'
              }]);
            }
          }
        }
      } catch (e: any) {
        console.error(`Error sending to ${leadName}:`, e);
        localFailures++;
        setOutreachLogs(prev => [...prev, {
          leadName,
          logs: [`System error: ${e.message}`],
          finalStatus: 'ERROR'
        }]);
      }

      setOutreachProgress(prev => ({
        ...prev,
        successes: localSuccesses,
        failures: localFailures
      }));

      if (i < totalLeads - 1) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    const campaignResultMsg = `${channelName} outreach campaign completed! Success: ${localSuccesses}, Failure: ${localFailures}`;
    setStatusMessage(campaignResultMsg);
    if (localSuccesses > 0) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }
    addToast(campaignResultMsg, localFailures === 0 ? 'success' : localSuccesses > 0 ? 'info' : 'error');
    
    setSelectedLeads(new Set());
    setSendingOutreach(false);
    handleRefreshAll();
  };

  const getOutreachDetails = () => {
    const channel = config.outreachChannel || 'gmail';
    const emailProvider = config.emailProvider || 'gmail';
    
    let label = 'Send Email Outreach';
    let isDisabled = false;
    let icon = <Mail size={14} />;
    
    if (channel === 'whatsapp') {
      const whatsappProvider = config.whatsappProvider || 'cloud';
      label = `Send WhatsApp Outreach (${whatsappProvider.toUpperCase()})`;
      icon = <Send size={14} />;
      
      if (whatsappProvider === 'cloud') {
        isDisabled = !config.whatsappAccessToken || !config.whatsappPhoneNumberId;
      } else if (whatsappProvider === 'evolution') {
        isDisabled = !config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstanceName;
      } else if (whatsappProvider === 'whapi') {
        isDisabled = !config.whapiToken;
      }
    } else if (channel === 'sms') {
      const smsProvider = config.smsProvider || 'gateway';
      label = `Send SMS Outreach (${smsProvider.toUpperCase()})`;
      icon = <Send size={14} />;
      
      if (smsProvider === 'gateway') {
        isDisabled = !config.smsGatewayUrl;
      } else if (smsProvider === 'termii') {
        isDisabled = !config.termiiApiKey;
      } else if (smsProvider === 'africastalking') {
        isDisabled = !config.africastalkingUsername || !config.africastalkingApiKey;
      } else if (smsProvider === 'twilio') {
        isDisabled = !config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber;
      }
    } else if (channel === 'coldcall') {
      label = 'Trigger Twilio Calls';
      icon = <Send size={14} />;
      isDisabled = !config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber;
    } else if (channel === 'jiji') {
      label = 'Send Jiji Inbox Messages';
      icon = <Send size={14} />;
      isDisabled = false;
    } else if (channel === 'multichannel') {
      label = 'Send Multichannel Blast (Email + WhatsApp + SMS)';
      icon = <Send size={14} />;
      
      const whatsappProvider = config.whatsappProvider || 'cloud';
      let isWhatsappDisabled = false;
      if (whatsappProvider === 'cloud') {
        isWhatsappDisabled = !config.whatsappAccessToken || !config.whatsappPhoneNumberId;
      } else if (whatsappProvider === 'evolution') {
        isWhatsappDisabled = !config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstanceName;
      } else if (whatsappProvider === 'whapi') {
        isWhatsappDisabled = !config.whapiToken;
      } else if (whatsappProvider === 'baileys') {
        isWhatsappDisabled = !config.whatsappBaileysUrl;
      }

      const smsProvider = config.smsProvider || 'gateway';
      let isSmsDisabled = false;
      if (smsProvider === 'gateway') {
        isSmsDisabled = !config.smsGatewayUrl;
      } else if (smsProvider === 'termii') {
        isSmsDisabled = !config.termiiApiKey;
      } else if (smsProvider === 'africastalking') {
        isSmsDisabled = !config.africastalkingUsername || !config.africastalkingApiKey;
      } else if (smsProvider === 'twilio') {
        isSmsDisabled = !config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber;
      }

      let isEmailDisabled = false;
      if (emailProvider === 'gmail') {
        isEmailDisabled = !config.googleUserEmail;
      } else if (emailProvider === 'resend') {
        isEmailDisabled = !config.resendApiKey;
      } else if (emailProvider === 'brevo') {
        isEmailDisabled = !config.brevoApiKey || !config.brevoSenderEmail;
      } else if (emailProvider === 'smtp') {
        isEmailDisabled = !config.smtpHost || !config.smtpUser || !config.smtpPass;
      } else if (emailProvider === 'sendgrid') {
        isEmailDisabled = !config.sendgridApiKey || !config.sendgridFromEmail;
      }

      isDisabled = isEmailDisabled && isWhatsappDisabled && isSmsDisabled;
    } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(channel)) {
      label = `Send ${channel.charAt(0).toUpperCase() + channel.slice(1)} Message`;
      icon = <Send size={14} />;
      isDisabled = false;
    } else {
      if (emailProvider === 'gmail') {
        label = 'Send Gmail Outreach';
        isDisabled = !config.googleUserEmail;
      } else if (emailProvider === 'resend') {
        label = 'Send Resend Outreach';
        isDisabled = !config.resendApiKey;
      } else if (emailProvider === 'brevo') {
        label = 'Send Brevo Outreach';
        isDisabled = !config.brevoApiKey || !config.brevoSenderEmail;
      }
    }
    
    return { label, isDisabled: isDisabled || sendingOutreach, icon };
  };
  
  const outreachDetails = getOutreachDetails();

  const handleGoogleSignIn = async () => {
    const finalClientId = customClientId || config.googleClientId;
    const finalClientSecret = customClientSecret || config.googleClientSecret;

    if (!finalClientId) {
      alert("Please enter your Google Client ID first.");
      return;
    }

    try {
      setStatusMessage('Saving Google API keys and launching OAuth flow...');
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          googleClientId: finalClientId,
          googleClientSecret: finalClientSecret,
          googleProjectId: customLoginProjectId || config.googleProjectId
        })
      });
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Error saving configurations: ${data.error}`);
        return;
      }
      
      setConfig(data);
      
      const authUrl = `/api/auth/google?state=${encodeURIComponent(customLoginProjectId || data.googleProjectId || '')}`;
      window.location.href = authUrl;
    } catch (e: any) {
      setStatusMessage(`Sign in failed: ${e.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          googleAccessToken: '',
          googleRefreshToken: '',
          googleTokenExpiry: 0,
          googleUserEmail: ''
        })
      });
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        setStatusMessage('Signed out successfully.');
      }
    } catch (e: any) {
      setStatusMessage(`Sign out failed: ${e.message}`);
    }
  };

  // Selection helpers
  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedLeads(next);
  };

  const toggleSelectAll = (filtered: Lead[]) => {
    if (selectedLeads.size === filtered.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filtered.map(l => l.lead_id)));
    }
  };

  // Get unique search queries from loaded leads
  const uniqueQueries = Array.from(new Set(leads.map(l => l.source_query_or_seed).filter(Boolean)));

  // Get unique CMS platforms from loaded leads
  const uniquePlatforms = Array.from(new Set(leads.map(l => l.cms_platform || l.cmsPlatform).filter(Boolean)));

  // Lead filter
  let filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.area && l.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (l.source_query_or_seed && l.source_query_or_seed.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (l.phone_e164 && l.phone_e164.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesQuery = queryFilter === 'ALL' || l.source_query_or_seed === queryFilter;
    
    // Website filter
    const hasWebsite = !!(l.website && l.website.trim() && l.website !== 'None');
    const matchesWebsite = websiteFilter === 'ALL' || 
                          (websiteFilter === 'UPGRADE' && hasWebsite) || 
                          (websiteFilter === 'NEW_BUILD' && !hasWebsite);
                          
    // Platform filter
    const cmsPlatform = l.cms_platform || l.cmsPlatform;
    const matchesPlatform = platformFilter === 'ALL' || cmsPlatform === platformFilter;

    // Channel filter
    let matchesChannel = true;
    if (channelFilter !== 'ALL') {
      const notesLower = (l.notes || '').toLowerCase();
      if (channelFilter === 'whatsapp_success') {
        matchesChannel = notesLower.includes('via whatsapp');
      } else if (channelFilter === 'email_success') {
        matchesChannel = notesLower.includes('via email') || notesLower.includes('via gmail');
      } else if (channelFilter === 'sms_success') {
        matchesChannel = notesLower.includes('via sms');
      } else if (channelFilter === 'jiji_success') {
        matchesChannel = notesLower.includes('via jiji');
      } else if (channelFilter === 'whatsapp_failed') {
        matchesChannel = notesLower.includes('- whatsapp: failed') || notesLower.includes('- whatsapp: skipped') || notesLower.includes('whatsapp failed');
      } else if (channelFilter === 'email_failed') {
        matchesChannel = notesLower.includes('- email: failed') || notesLower.includes('- email: skipped') || notesLower.includes('email failed');
      } else if (channelFilter === 'sms_failed') {
        matchesChannel = notesLower.includes('- sms: failed') || notesLower.includes('- sms: skipped') || notesLower.includes('sms failed');
      } else if (channelFilter === 'jiji_failed') {
        matchesChannel = notesLower.includes('- jiji: failed') || notesLower.includes('- jiji: skipped') || notesLower.includes('jiji failed');
      } else if (channelFilter === 'whatsapp_failed_email_success') {
        const waFailed = notesLower.includes('- whatsapp: failed') || notesLower.includes('- whatsapp: skipped') || notesLower.includes('whatsapp failed');
        const emailSuccess = notesLower.includes('via email') || notesLower.includes('via gmail');
        matchesChannel = waFailed && emailSuccess;
      }
    }
                          
    return matchesSearch && matchesStatus && matchesQuery && matchesWebsite && matchesPlatform && matchesChannel;
  });

  // Fallback: If search term is present but yielded 0 results, fall back to showing all leads for selected query/status
  if (filteredLeads.length === 0 && searchTerm) {
    filteredLeads = leads.filter(l => {
      const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
      const matchesQuery = queryFilter === 'ALL' || l.source_query_or_seed === queryFilter;
      
      const hasWebsite = !!(l.website && l.website.trim() && l.website !== 'None');
      const matchesWebsite = websiteFilter === 'ALL' || 
                            (websiteFilter === 'UPGRADE' && hasWebsite) || 
                            (websiteFilter === 'NEW_BUILD' && !hasWebsite);
                            
      const cmsPlatform = l.cms_platform || l.cmsPlatform;
      const matchesPlatform = platformFilter === 'ALL' || cmsPlatform === platformFilter;

      let matchesChannel = true;
      if (channelFilter !== 'ALL') {
        const notesLower = (l.notes || '').toLowerCase();
        if (channelFilter === 'whatsapp_success') {
          matchesChannel = notesLower.includes('via whatsapp');
        } else if (channelFilter === 'email_success') {
          matchesChannel = notesLower.includes('via email') || notesLower.includes('via gmail');
        } else if (channelFilter === 'sms_success') {
          matchesChannel = notesLower.includes('via sms');
        } else if (channelFilter === 'jiji_success') {
          matchesChannel = notesLower.includes('via jiji');
        } else if (channelFilter === 'whatsapp_failed') {
          matchesChannel = notesLower.includes('- whatsapp: failed') || notesLower.includes('- whatsapp: skipped') || notesLower.includes('whatsapp failed');
        } else if (channelFilter === 'email_failed') {
          matchesChannel = notesLower.includes('- email: failed') || notesLower.includes('- email: skipped') || notesLower.includes('email failed');
        } else if (channelFilter === 'sms_failed') {
          matchesChannel = notesLower.includes('- sms: failed') || notesLower.includes('- sms: skipped') || notesLower.includes('sms failed');
        } else if (channelFilter === 'jiji_failed') {
          matchesChannel = notesLower.includes('- jiji: failed') || notesLower.includes('- jiji: skipped') || notesLower.includes('jiji failed');
        } else if (channelFilter === 'whatsapp_failed_email_success') {
          const waFailed = notesLower.includes('- whatsapp: failed') || notesLower.includes('- whatsapp: skipped') || notesLower.includes('whatsapp failed');
          const emailSuccess = notesLower.includes('via email') || notesLower.includes('via gmail');
          matchesChannel = waFailed && emailSuccess;
        }
      }
                            
      return matchesStatus && matchesQuery && matchesWebsite && matchesPlatform && matchesChannel;
    });
  }

  const renderTemplatePreview = (lead: Lead | null) => {
    if (!lead) return 'Select a lead to see custom outreach message variables';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lead-generation-automation-e0oitxcsi.vercel.app';
    
    if (config.outreachChannel === 'sms') {
      const smsTemplate = config.smsMessageTemplate || 
        "Hello {{lead.name}}, please review the custom landing page designed for your business: {{previewUrl}} - {{signature}}";
      let msg = smsTemplate;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'Bethelmind Analytics & Strategy');
      return msg;
    }

    if (config.outreachChannel === 'jiji') {
      const jijiTemplate = config.jijiMessageTemplate || 
        "Hello {{lead.name}},\n\nI noticed your listing on Jiji with an impressive {{lead.rating}}★ rating! Since you don't currently have a website, I built a personalized landing page preview for you to check out: {{previewUrl}}\n\nLet me know if you would like to go live with this!\n\nBest regards,\n{{signature}}";
      let msg = jijiTemplate;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'Bethelmind Analytics & Strategy');
      return msg;
    }

    if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(config.outreachChannel || '')) {
      const channel = config.outreachChannel || 'instagram';
      let template = '';
      if (channel === 'instagram') {
        template = config.instagramMessageTemplate || "Hi {{lead.name}},\n\nI found your amazing e-commerce profile on Instagram! Since you don't have a standalone website for checkout, I built a personalized landing page preview for you: {{previewUrl}}\n\nLet me know if you would like to launch this!\n\nBest regards,\n{{signature}}";
      } else if (channel === 'facebook') {
        template = config.facebookMessageTemplate || "Hello {{lead.name}},\n\nI saw your store page on Facebook. I put together a custom checkout website preview to help you capture more sales: {{previewUrl}}\n\nCheck it out and let me know your thoughts!\n\nBest,\n{{signature}}";
      } else if (channel === 'tiktok') {
        template = config.tiktokMessageTemplate || "Hey {{lead.name}},\n\nI saw your product videos on TikTok. I created a custom web store preview for your business link-in-bio: {{previewUrl}}\n\nClick the link above to check it out!\n\nCheers,\n{{signature}}";
      } else if (channel === 'linkedin') {
        template = config.linkedinMessageTemplate || "Hi {{lead.name}},\n\nI noticed your professional services profile on LinkedIn. Since you don't have a personal portfolio website listed, I custom-built a landing page preview showcasing your expertise: {{previewUrl}}\n\nWould you like to connect this to your custom domain?\n\nBest regards,\n{{signature}}";
      }
      let msg = template;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'Bethelmind Analytics & Strategy');
      return msg;
    }

    // ── Website-aware email preview (uses same logic as the backend getPitchDetails) ──
    const hasWebsite = !!(lead.website && lead.website.trim());
    const pitchMatch = lead.notes?.match(/\[pitch:\s*([^\]]+)\]/);
    const pitchAngle = pitchMatch ? pitchMatch[1] : (hasWebsite ? 'CRM Integration & WhatsApp Automation' : 'New Website Design');
    const previewUrl = `${origin}/preview/${lead.lead_id}`;
    const webUrl = lead.website || '';
    const sig = config.businessSignature || 'Bethelmind Analytics & Strategy';
    const name = lead.name || 'Team';
    const area = lead.area || 'Lagos';

    if (hasWebsite) {
      return `Subject: Upgrading ${name} — ${pitchAngle}\n\nHi ${name} Team,\n\nWe visited your current website (${webUrl}) and noticed a major growth opportunity — your site is missing ${pitchAngle.toLowerCase()}.\n\nWe built an interactive mockup upgrade preview specifically for your business:\n${previewUrl}\n\nYou can test the new feature live on the preview page. It shows exactly how it would work for your clients, including automated notifications and payment processing.\n\nIf you like what you see, we can deploy this as a full upgrade to your existing site — contact us via the page.\n\nBest regards,\n${sig}`;
    }
    return `Subject: Custom Web Design Proposal for ${name}\n\nHi ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${lead.rating} stars, ${lead.reviews_count} reviews) in ${area}, but does not have a web address connected yet.\n\nTo help you grow, we've custom-designed a landing page for you to review:\n${previewUrl}\n\nThis page was auto-generated by Bethelmind Analytics & Strategy and includes a live interactive ${pitchAngle.toLowerCase()} widget. If you like the design, you can claim it and connect it to your own custom domain.\n\nBest regards,\n${sig}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1001,
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '10px',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          display: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            display: 'none'
          }}
        />
      )}

      {/* Sync Pipeline Confirmation Modal */}
      {showSyncConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
          <div className="glass-panel" style={{
            padding: '28px', maxWidth: '420px', width: '90%', borderRadius: '16px',
            border: '1px solid var(--panel-border)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <RefreshCw size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Sync Pipeline Data?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              This will refresh all leads, stats, logs, and database connection status from your configured storage backend. It may take a few seconds.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSyncConfirm(false)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSyncConfirm(false);
                  handleRefreshAll();
                }}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} /> Confirm Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`app-sidebar glass-panel ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--panel-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', maxHeight: '100vh' }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2' }}>
            <Database size={24} /> Bethelmind Analytics & Strategy
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>B2B Lead Engine</span>
        </div>

        {/* Dynamic Sign-In / Account block */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {config.googleUserEmail ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Google Identity Linked</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {config.googleUserEmail}
              </div>
              <button onClick={handleSignOut} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '6px', justifyContent: 'center', gap: '4px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Google Cloud Integration</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Google Project ID (optional)</label>
                <input 
                  type="text" 
                  value={customLoginProjectId} 
                  onChange={(e) => setCustomLoginProjectId(e.target.value)}
                  placeholder="e.g. vertex-ai-leadgen"
                  style={{ width: '100%', padding: '6px 8px', background: 'var(--input-bg-darker)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Google Client ID</label>
                <input 
                  type="text" 
                  value={customClientId} 
                  onChange={(e) => setCustomClientId(e.target.value)}
                  placeholder="Paste Client ID..."
                  style={{ width: '100%', padding: '6px 8px', background: 'var(--input-bg-darker)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Google Client Secret</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showClientSecret ? "text" : "password"} 
                    value={customClientSecret} 
                    onChange={(e) => setCustomClientSecret(e.target.value)}
                    placeholder="Paste Client Secret..."
                    style={{ width: '100%', padding: '6px 30px 6px 8px', background: 'var(--input-bg-darker)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientSecret(!showClientSecret)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                    title={showClientSecret ? "Hide Client Secret" : "Show Client Secret"}
                  >
                    {showClientSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button 
                onClick={handleGoogleSignIn} 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  fontSize: '0.8rem', 
                  padding: '8px', 
                  justifyContent: 'center', 
                  gap: '6px',
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                  boxShadow: '0 4px 10px rgba(66, 133, 244, 0.25)'
                }}
              >
                <ShieldCheck size={14} /> Sign In with Google
              </button>
            </div>
          )}
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <LayoutDashboard size={18} color={activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)'} /> Console
          </button>
          
          <button 
            onClick={() => setActiveTab('crm')} 
            className={`btn-secondary ${activeTab === 'crm' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'crm' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'crm' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Users size={18} color={activeTab === 'crm' ? 'var(--primary)' : 'var(--text-secondary)'} /> Leads CRM
          </button>

          <button 
            onClick={() => window.location.href = '/admin/solar-pipeline'} 
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', background: 'transparent', borderColor: 'transparent', width: '100%' }}
          >
            <Sun size={18} color="var(--text-secondary)" /> Specialise Solar Pipeline
          </button>
          
          <button 
            onClick={() => setActiveTab('scrapers')} 
            className={`btn-secondary ${activeTab === 'scrapers' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'scrapers' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'scrapers' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Compass size={18} color={activeTab === 'scrapers' ? 'var(--primary)' : 'var(--text-secondary)'} /> Maps Scraper
          </button>
          
          <button 
            onClick={() => setActiveTab('scheduler')} 
            className={`btn-secondary ${activeTab === 'scheduler' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'scheduler' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'scheduler' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Calendar size={18} color={activeTab === 'scheduler' ? 'var(--primary)' : 'var(--text-secondary)'} /> Campaign Scheduler
          </button>
          
          <button 
            onClick={() => setActiveTab('logs')} 
            className={`btn-secondary ${activeTab === 'logs' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'logs' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'logs' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <FileText size={18} color={activeTab === 'logs' ? 'var(--primary)' : 'var(--text-secondary)'} /> Sync Logs
          </button>
          
          <button data-testid="settings-tab" 
            onClick={() => setActiveTab('settings')} 
            className={`btn-secondary ${activeTab === 'settings' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'settings' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'settings' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Settings size={18} color={activeTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)'} /> Settings
          </button>
        </nav>
        
        {/* Theme Toggle Button */}
        <div style={{ padding: '0 4px', marginBottom: '8px' }}>
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              fontSize: '0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--panel-border)',
              background: 'var(--toggle-bg)',
              color: 'var(--toggle-color)',
              boxShadow: 'var(--toggle-shadow)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={16} color="var(--primary)" />
              <span>{!mounted ? 'Dark Mode' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div style={{
              width: '32px',
              height: '18px',
              borderRadius: '10px',
              background: mounted && theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative',
              transition: 'background 0.3s'
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: mounted && theme === 'dark' ? '16px' : '2px',
                transition: 'left 0.3s'
              }} />
            </div>
          </button>
        </div>
        
        {/* Connection status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          {renderStatusChip(
            config.storageMode === 'supabase' ? 'Supabase DB' : 'Sheets DB',
            config.storageMode === 'supabase'
              ? (supabaseStatus ? (supabaseStatus.connected ? (supabaseStatus.success ? 'Connected' : 'Connected (Missing Tables)') : 'Disconnected') : 'Connected')
              : (sheetsSyncStatus === 'green' ? 'Connected' : sheetsSyncStatus === 'yellow' ? 'Warning' : 'Error'),
            config.storageMode === 'supabase'
              ? (supabaseStatus ? (supabaseStatus.connected ? (supabaseStatus.success ? 'green' : 'yellow') : 'red') : 'green')
              : ((sheetsSyncStatus || 'yellow') as 'green' | 'yellow' | 'red'),
            config.storageMode === 'supabase' ? 'db-settings' : 'sheets-settings'
          )}

          {renderStatusChip(
            'Google OAuth',
            config.googleRefreshToken ? (config.googleUserEmail ? `Connected (${config.googleUserEmail})` : 'Connected') : 'Setup Required',
            config.googleRefreshToken ? 'green' : 'red',
            'email-settings'
          )}

          {renderStatusChip(
            'Vertex AI',
            config.googleProjectId ? 'Configured' : 'Fallback Active',
            config.googleProjectId ? 'green' : 'yellow',
            'ai-credentials'
          )}

          {(() => {
            const isOutreachConfigured = () => {
              if (config.dryRun) return 'yellow';
              if (config.outreachChannel === 'whatsapp') {
                if (config.whatsappProvider === 'cloud' && (!config.whatsappPhoneNumberId || !config.whatsappAccessToken)) return 'red';
                if (config.whatsappProvider === 'evolution' && (!config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstanceName)) return 'red';
                if (config.whatsappProvider === 'whapi' && !config.whapiToken) return 'red';
              } else {
                if (config.emailProvider === 'resend' && !config.resendApiKey) return 'red';
                if (config.emailProvider === 'brevo' && !config.brevoApiKey) return 'red';
                if (config.emailProvider === 'smtp' && (!config.smtpHost || !config.smtpUser || !config.smtpPass)) return 'red';
                if (config.emailProvider === 'sendgrid' && !config.sendgridApiKey) return 'red';
              }
              return 'green';
            };
            const status = isOutreachConfigured();
            const value = status === 'green' ? 'Live Campaigns' : status === 'yellow' ? 'Dry Run Sim' : 'Not Configured';
            return renderStatusChip(
              'Campaigns',
              value,
              status,
              config.outreachChannel === 'whatsapp' ? 'whatsapp-settings' : 'email-settings'
            );
          })()}

          {/* Interactive Scraper Runner Widget in Sidebar */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${runnerStatus === 'online' ? 'rgba(16, 185, 129, 0.2)' : runnerStatus === 'loading' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              background: runnerStatus === 'online' ? 'rgba(16, 185, 129, 0.04)' : runnerStatus === 'loading' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(239, 68, 68, 0.04)',
              transition: 'all 0.3s ease'
            }}
          >
            <div 
              onClick={() => navigateToSettingsSection('scraper-runner-control')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              title="Click to view full runner settings"
            >
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, fontWeight: 700, color: 'var(--text-secondary)' }}>
                Scraper Runner
              </span>
              <span style={{ 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                color: runnerStatus === 'online' ? '#10B981' : runnerStatus === 'loading' ? '#F59E0B' : '#EF4444',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: runnerStatus === 'online' ? '#10B981' : runnerStatus === 'loading' ? '#F59E0B' : '#EF4444',
                  boxShadow: runnerStatus === 'online' ? '0 0 6px #10B981' : 'none'
                }}></span>
                {runnerStatus === 'online' ? 'ONLINE' : runnerStatus === 'loading' ? 'CHECKING' : 'OFFLINE'}
              </span>
            </div>

            {/* Live stats integrations */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '6px',
              marginTop: '4px',
              gap: '8px'
            }}>
              <span>Total leads: <strong style={{ color: 'var(--primary)' }}>{stats.totalLeads}</strong></span>
              <span>New leads: <strong style={{ color: '#F59E0B' }}>{stats.newLeads}</strong></span>
            </div>

            {runnerStatus === 'online' && activeJob && (
              <div style={{ 
                fontSize: '0.72rem', 
                color: 'var(--text-secondary)', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '6px 8px', 
                borderRadius: '6px', 
                marginTop: '2px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: '3px solid #3B82F6'
              }}>
                <span style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-dot-blue" style={{ marginRight: 0 }}></span> Scraping: {activeJob.payload?.query || activeJob.payload?.category || 'Task'}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Engine: {activeJob.type.toUpperCase()} · {activeJob.payload?.location || 'Lagos'}
                </span>
              </div>
            )}

            {/* Live Pipeline Activity Logs Feed */}
            {latestLogs && latestLogs.length > 0 && (
              <div style={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '6px 8px',
                borderRadius: '6px',
                marginTop: '4px',
                border: '1px solid rgba(255,255,255,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.62rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>Live Pipeline Feed</span>
                  <span style={{ color: '#10B981', fontSize: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }}></span> LIVE (3s)
                  </span>
                </div>
                {latestLogs.map((log: any, idx: number) => {
                  const [runId, timestamp, step, _, logStatus, message] = log;
                  const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const color = logStatus === 'ERROR' ? '#EF4444' : logStatus === 'SUCCESS' ? '#10B981' : '#3B82F6';
                  return (
                    <div key={idx} style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.6rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{runId}</span>
                        <span>{timeStr}</span>
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', gap: '3px', alignItems: 'center' }}>
                        <span style={{ color, fontSize: '0.6rem', fontWeight: 700 }}>[{logStatus}]</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }} title={message}>{message}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              {runnerStatus === 'online' ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopLocalRunner();
                  }}
                  disabled={triggerLoading}
                  style={{
                    flexGrow: 1,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    padding: '5px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {triggerLoading ? <Loader2 size={12} className="spin-anim" /> : 'Stop Runner'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocalTrigger();
                  }}
                  disabled={triggerLoading || runnerStatus === 'loading'}
                  style={{
                    flexGrow: 1,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '5px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {triggerLoading ? <Loader2 size={12} className="spin-anim" /> : 'Start Runner'}
                </button>
              )}
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  checkRunnerStatus();
                }}
                disabled={triggerLoading || runnerStatus === 'loading'}
                style={{
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Refresh runner status"
              >
                <RefreshCw size={12} className={runnerStatus === 'loading' ? 'spin-anim' : ''} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Panel */}
      <main ref={mainRef} style={{ flexGrow: 1, minWidth: 0, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {config.dryRun && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)', 
            border: '1px solid rgba(245, 158, 11, 0.25)', 
            borderRadius: '12px', 
            padding: '12px 20px', 
            marginBottom: '-8px',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Simulation Mode Active (Dry Run)</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  All outreach channels are simulated. No real messages will be sent. You can disable this in Settings.
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setActiveTab('settings')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', borderColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.05)' }}
            >
              Configure Live Mode
            </button>
          </div>
        )}
        {config.storageMode === 'supabase' && supabaseStatus && !supabaseStatus.success && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)', 
            border: '1px solid rgba(239, 68, 68, 0.25)', 
            borderRadius: '12px', 
            padding: '12px 20px', 
            marginBottom: '-8px',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#f87171', fontSize: '0.9rem' }}>Supabase Schema/Connection Check Failed</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  {supabaseStatus.error || "Some required tables (leads, dnc, logs, scrape_jobs) are missing from your database."} Please verify your Supabase credentials or DB schema.
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setActiveTab('settings')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)' }}
            >
              Verify DB Settings
            </button>
          </div>
        )}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              Lead Generation & Website Builder Console
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '4px 12px', 
                borderRadius: '999px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                background: config.storageMode === 'supabase' ? 'rgba(62, 207, 142, 0.15)' : config.storageMode === 'local' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                color: config.storageMode === 'supabase' ? '#3ecf8e' : config.storageMode === 'local' ? '#60a5fa' : '#f472b6',
                border: `1px solid ${config.storageMode === 'supabase' ? 'rgba(62, 207, 142, 0.3)' : config.storageMode === 'local' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: config.storageMode === 'supabase' ? '#3ecf8e' : config.storageMode === 'local' ? '#60a5fa' : '#f472b6' }}></span>
                {config.storageMode === 'supabase' ? 'Supabase DB' : 
                 config.storageMode === 'local' ? 'Local DB' : 
                 config.storageMode === 'cloud' ? 'Google Sheets DB' : 'Hybrid DB'}
              </span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              B2B website proposal pipeline powered exclusively by <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Google Cloud Workspace APIs</span>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowSyncConfirm(true)} disabled={loadingLeads} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {loadingLeads ? <Loader2 size={16} className="spin-anim" /> : <RefreshCw size={16} />} {loadingLeads ? 'Syncing...' : 'Sync Pipeline'}
            </button>
          </div>
        </header>

        {statusMessage && (
          <div className="glass-panel" style={{ padding: '12px 18px', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Info size={18} color="var(--primary)" />
            <span id="scraper-status-message" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{statusMessage}</span>
            
            {/* Inline Start Local Runner process button when the scraper is running/waiting but the runner is offline */}
            {runnerStatus === 'offline' && (statusMessage.includes('Waiting for local') || statusMessage.includes('Job queued')) && (
              <button 
                type="button"
                onClick={handleLocalTrigger}
                disabled={triggerLoading}
                className="btn-primary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '12px',
                  boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.25)'
                }}
              >
                {triggerLoading ? <Loader2 size={12} className="spin-anim" /> : <Terminal size={12} />}
                Start Local Runner
              </button>
            )}

            <button onClick={() => setStatusMessage('')} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
          </div>
        )}

        <div 
          style={{ display: 'inline-block', marginBottom: '12px' }}
          title={isExporting ? "Export in progress..." : ""}
        >
          <button
            onClick={async () => {
              if (isExporting) return;
              try {
                setIsExporting(true);
                const res = await fetch('/api/export/leads');
                if (res.ok) {
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'leads.xlsx';
                  a.click();
                  window.URL.revokeObjectURL(url);
                  addToast('Leads exported to Excel successfully!', 'success');
                } else {
                  addToast('Failed to export leads. Server returned an error.', 'error');
                }
              } catch (e: any) {
                addToast(`Export failed: ${e.message}`, 'error');
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="btn-primary"
            style={{ 
              fontSize: '0.8rem', 
              opacity: isExporting ? 0.5 : 1, 
              cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isExporting ? <Loader2 size={14} className="spin-anim" /> : null}
            {isExporting ? 'Exporting...' : 'Export Leads (Excel)'}
          </button>
        </div>
        {/* VIDEO DEMO SECTION */}
        {activeTab === 'dashboard' && (
          <div className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: config.googleRefreshToken ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${config.googleRefreshToken ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)'}`,
            borderLeft: `4px solid ${config.googleRefreshToken ? '#10b981' : '#3b82f6'}`,
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>🤖</div>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Google Workspace Automation Center
                  <span className={`badge ${config.googleRefreshToken ? 'badge-success' : 'badge-new'}`}>
                    {config.googleRefreshToken ? 'PERFECTED & ACTIVE' : 'SIGN-IN REQUIRED'}
                  </span>
                </strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                  {config.googleRefreshToken 
                    ? `Successfully synchronized to ${config.googleUserEmail || 'your Google account'}. Click below if you need to re-link or change accounts.`
                    : 'Link your Google account to authorize background sheets sync, automated email outreach, and Gemini key rotation.'}
                </p>
              </div>
            </div>
            <a 
              href="/api/auth/google?prompt=select_account%20consent"
              className="btn btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #1877f2 0%, #06b6d4 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {config.googleRefreshToken ? '🔄 Reconnect Google Account' : '⚡ One-Click Connect Google'}
            </a>
          </div>
        )}

        {/* VIDEO DEMO SECTION */}
        {activeTab === 'dashboard' && (
          <section className="glass-panel" style={{ padding: '24px', marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Platform Walkthrough Demo
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Watch a complete voiced tour of every feature in the Bethelmind Analytics & Strategy Lead Engine
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href="/assets/bethelmind-demo.webm"
                  download="Bethelmind-Platform-Demo.webm"
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Video
                </a>
                <span className="badge badge-new">VOICED DEMO</span>
              </div>
            </div>
            <div
              className="video-demo-wrapper"
              onClick={() => {
                const vid = document.getElementById('demoVideo') as HTMLVideoElement;
                if (vid) {
                  if (vid.paused) {
                    vid.play();
                    setVideoPlaying(true);
                  } else {
                    vid.pause();
                    setVideoPlaying(false);
                  }
                }
              }}
            >
              <video
                id="demoVideo"
                poster="/assets/video-thumbnail.png"
                preload="metadata"
                controls={videoPlaying}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
                style={{ background: '#000', width: '100%', height: '100%' }}
              >
                <source src="/assets/bethelmind-demo.webm" type="video/webm" />
              </video>
              <div className={`video-play-overlay ${videoPlaying ? 'hidden' : ''}`}>
                <div className="video-play-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 1: CONSOLE */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Leads Ingested</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', fontWeight: 700 }}>{stats.totalLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total businesses found on Google Maps
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Ready for Proposal</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--primary)', fontWeight: 700 }}>{stats.newLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Businesses with no website listed
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Outreach Sent</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--success)', fontWeight: 700 }}>{stats.contactedLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Proposals successfully emailed
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Highly Rated Leads</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--warning)', fontWeight: 700 }}>{stats.highRatingLeads || leads.filter(l => l.rating >= 4.0).length}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Google rating floor threshold &gt;= 4.0
                </div>
              </div>
            </div>

            {/* Live Runner Progress & Queue Panel */}
            <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <style>{`
                .pulse-dot-blue {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background-color: #3b82f6;
                  border-radius: 50%;
                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                  animation: pulse-blue 1.5s infinite;
                  margin-right: 6px;
                }
                @keyframes pulse-blue {
                  0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                  }
                  70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
                  }
                  100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                  }
                }
                .progress-bar-anim {
                  position: relative;
                  overflow: hidden;
                }
                .progress-bar-anim::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 100%
                  );
                  animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, margin: 0 }}>
                  <Terminal size={18} color="var(--primary)" /> Scraper Queue & Runner Progress
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 8px', 
                    borderRadius: '20px', 
                    fontWeight: 600,
                    background: runnerStatus === 'online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: runnerStatus === 'online' ? '#10B981' : '#EF4444',
                    border: `1px solid ${runnerStatus === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    Runner: {runnerStatus.toUpperCase()}
                  </span>
                  <button 
                    type="button" 
                    onClick={checkRunnerStatus}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    title="Refresh runner queue"
                  >
                    <RefreshCw size={14} className={runnerStatus === 'loading' ? 'spin-anim' : ''} />
                  </button>
                </div>
              </div>

              {/* Active Task (If any is processing) */}
              {activeJob ? (
                <div style={{ 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)', 
                  borderRadius: '8px', 
                  padding: '14px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      <span className="pulse-dot-blue"></span> ACTIVE SCRAE RUN
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Started: {new Date(activeJob.startedAt || activeJob.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '2px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Search Niche</span>
                      <strong style={{ fontSize: '0.85rem', color: 'white' }}>{activeJob.payload?.query || activeJob.payload?.category || 'Bulk Scraping Niche'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Target Location</span>
                      <strong style={{ fontSize: '0.85rem', color: 'white' }}>{activeJob.payload?.location || 'Lagos, Nigeria'}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                      <div className="progress-bar-anim" style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)', width: '100%' }}></div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#60A5FA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Loader2 size={10} className="spin-anim" /> Scraping...
                    </span>
                  </div>
                </div>
              ) : runnerStatus === 'online' ? (
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.03)', 
                  border: '1px dashed rgba(16, 185, 129, 0.2)', 
                  borderRadius: '8px', 
                  padding: '14px', 
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}>
                  ⚡ Runner is online & idling. Waiting for scheduled campaigns or manual scraper actions.
                </div>
              ) : (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.03)', 
                  border: '1px dashed rgba(239, 68, 68, 0.2)', 
                  borderRadius: '8px', 
                  padding: '14px', 
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem'
                }}>
                  ⚠️ Runner is offline. Launch it from the settings panel below to process queued scrapers.
                </div>
              )}

              {/* Columns for Queue and History */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
                {/* Active & Queued Jobs list */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Sliders size={12} color="var(--primary)" /> Pending Queue ({activeJobs.filter(j => j.status === 'queued').length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                    {activeJobs.length === 0 ? (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending tasks in queue.</span>
                    ) : (
                      activeJobs.map((j) => (
                        <div key={j.id} style={{ 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid rgba(255,255,255,0.03)', 
                          borderRadius: '6px', 
                          padding: '6px 8px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', maxWidth: '75%' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {j.payload?.query || j.payload?.category || 'Scraper Run'}
                            </span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                              Engine: {j.type.toUpperCase()} · Location: {j.payload?.location || 'Lagos'}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '0.6rem', 
                            padding: '2px 5px', 
                            borderRadius: '4px',
                            fontWeight: 600,
                            background: j.status === 'running' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: j.status === 'running' ? '#60A5FA' : 'var(--text-secondary)'
                          }}>
                            {j.status.toUpperCase()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* History / Completed Jobs list */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <CheckCircle size={12} color="var(--success)" /> Recent Scraping Results
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                    {completedJobs.length === 0 ? (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No completed scraper runs yet.</span>
                    ) : (
                      completedJobs.map((j) => (
                        <div key={j.id} style={{ 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid rgba(255,255,255,0.03)', 
                          borderRadius: '6px', 
                          padding: '6px 8px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', maxWidth: '70%' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {j.payload?.query || j.payload?.category || 'Scraper Run'}
                            </span>
                            <span style={{ fontSize: '0.62rem', color: j.status === 'failed' ? '#EF4444' : '#10B981', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={j.status === 'failed' ? j.error_message : undefined}>
                              {j.status === 'failed' ? `Failed: ${j.error_message || 'Timeout'}` : `Ingested: ${j.result?.leadsCount || j.result?.added || 0} leads`}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '0.6rem', 
                            padding: '2px 5px', 
                            borderRadius: '4px',
                            fontWeight: 600,
                            background: j.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: j.status === 'completed' ? '#10B981' : '#EF4444'
                          }}>
                            {j.status.toUpperCase()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="var(--primary)" /> Launch Outreach Campaign
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  {config.outreachChannel === 'whatsapp' 
                    ? `Send personalized WhatsApp messages using your configured ${config.whatsappProvider?.toUpperCase() || 'Meta Cloud'} provider.` 
                    : config.outreachChannel === 'sms'
                    ? `Send bulk text messages (SMS) using your configured ${config.smsProvider?.toUpperCase() || 'Android Gateway'} provider.`
                    : config.outreachChannel === 'coldcall' 
                    ? 'Trigger automated Twilio cold-calls with interactive voice text-to-speech to prospective leads.' 
                    : `Send personalized email proposals using your configured ${config.emailProvider?.toUpperCase() || 'Gmail'} provider.`
                  }
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--input-bg)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Pending B2B website proposals:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{stats.newLeads} leads</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Outreach Channel:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {config.outreachChannel || 'gmail'}
                    </span>
                  </div>
                  {config.outreachChannel === 'gmail' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>Email Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.emailProvider || 'gmail'}
                      </span>
                    </div>
                  )}
                  {config.outreachChannel === 'whatsapp' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>WhatsApp Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.whatsappProvider || 'cloud'}
                      </span>
                    </div>
                  )}
                  {config.outreachChannel === 'sms' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>SMS Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.smsProvider || 'gateway'}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Outreach dispatch mode:</span>
                    <span style={{ color: config.dryRun ? 'var(--warning)' : 'var(--error)', fontWeight: 600 }}>
                      {config.dryRun ? 'SIMULATION (Dry Run)' : 'LIVE OUTREACH (Real dispatch)'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const pending = leads.filter(l => l.status === 'NEW').map(l => l.lead_id);
                    setSelectedLeads(new Set(pending));
                    setActiveTab('crm');
                  }}
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Configure & Launch <ArrowRight size={16} />
                </button>
              </section>

              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} color="var(--success)" /> Pipeline Execution Log</h3>
                <div style={{ height: '380px', overflowY: 'auto', background: 'var(--input-bg-darker)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {loadingLogs && <div style={{ color: 'var(--text-secondary)' }}>Retrieving sync logs...</div>}
                  {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No logs logged in Google Sheets.</div>}
                  {logs.slice(0, 30).map((log, idx) => (
                    <div key={idx} style={{ paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>[{new Date(log[1]).toLocaleTimeString()}]</span>{' '}
                      <span style={{ color: log[4] === 'ERROR' ? 'var(--error)' : log[4] === 'SUCCESS' ? 'var(--success)' : 'var(--primary)' }}>
                        [{log[4]}]
                      </span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>({log[2]}):</span> {log[5]}
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <TopReviewedLeads />
          </>
        )}

        {/* TAB 2: CRM */}
        {activeTab === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexGrow: 1, background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search leads by name, category, area..."
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', width: '100%' }}
                />
              </div>

              <div>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ background: 'var(--input-bg-darker)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Lifecycle Stages</option>
                  <option value="NEW">NEW (Uncontacted)</option>
                  <option value="CONTACTED">CONTACTED (All channels)</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>

              <div>
                <select 
                  value={channelFilter} 
                  onChange={(e) => setChannelFilter(e.target.value)}
                  style={{ background: 'var(--input-bg-darker)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Outreach Channels</option>
                  <option value="whatsapp_success">Reached via WhatsApp</option>
                  <option value="email_success">Reached via Email</option>
                  <option value="sms_success">Reached via SMS</option>
                  <option value="jiji_success">Reached via Jiji</option>
                  <option value="whatsapp_failed">WhatsApp Failed/Skipped</option>
                  <option value="email_failed">Email Failed/Skipped</option>
                  <option value="sms_failed">SMS Failed/Skipped</option>
                  <option value="whatsapp_failed_email_success">Email Sent (WhatsApp Failed)</option>
                </select>
              </div>

              <div>
                <select 
                  value={queryFilter} 
                  onChange={(e) => setQueryFilter(e.target.value)}
                  style={{ background: 'var(--input-bg-darker)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none', maxWidth: '240px' }}
                >
                  <option value="ALL">All Search Queries</option>
                  {uniqueQueries.map((q, idx) => (
                    <option key={idx} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <select 
                  value={websiteFilter} 
                  onChange={(e) => setWebsiteFilter(e.target.value as any)}
                  style={{ background: 'var(--input-bg-darker)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Project Types</option>
                  <option value="NEW_BUILD">New Build Prospects (No Site)</option>
                  <option value="UPGRADE">Modernization & Upgrade-Ready (Has Site)</option>
                </select>
              </div>

              <div>
                <select 
                  value={platformFilter} 
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  style={{ background: 'var(--input-bg-darker)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All CMS Platforms</option>
                  {uniquePlatforms.map((p, idx) => (
                    <option key={idx} value={p}>{String(p).toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {(searchTerm || queryFilter !== 'ALL' || statusFilter !== 'ALL' || websiteFilter !== 'ALL' || platformFilter !== 'ALL' || channelFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0', alignItems: 'start', width: '100%' }}>
              <div className="glass-panel" style={{ overflowX: 'auto', minHeight: '400px', width: `${crmTableWidth}px`, flexShrink: 0 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Leads Directory ({filteredLeads.length} matching)</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <a
                      href="/api/export/leads"
                      download="leads.xlsx"
                      className="btn-secondary"
                      style={{
                        fontSize: '0.85rem',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                      }}
                    >
                      <Database size={14} /> Download Excel Spreadsheet
                    </a>

                    {selectedLeads.size > 0 && (
                      <button 
                        onClick={runOutreach} 
                        disabled={outreachDetails.isDisabled || sendingOutreach} 
                        className="btn-primary" 
                        style={{ 
                          fontSize: '0.85rem', 
                          padding: '8px 16px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          opacity: (outreachDetails.isDisabled || sendingOutreach) ? 0.6 : 1,
                          cursor: (outreachDetails.isDisabled || sendingOutreach) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {sendingOutreach ? <Loader2 size={14} className="spin-anim" /> : outreachDetails.icon} 
                        {sendingOutreach ? 'Sending...' : outreachDetails.label} ({selectedLeads.size})
                      </button>
                    )}
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '14px 20px', width: '40px' }}>
                        <input 
                          type="checkbox" 
                          checked={filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length} 
                          onChange={() => toggleSelectAll(filteredLeads)}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '14px 20px' }}>Business Name</th>
                      <th style={{ padding: '14px' }}>Category</th>
                      <th style={{ padding: '14px' }}>Rating</th>
                      <th style={{ padding: '14px' }}>Area</th>
                      <th style={{ padding: '14px' }}>Email</th>
                      <th style={{ padding: '14px', minWidth: '160px' }}>Website / Offer</th>
                      <th style={{ padding: '14px' }}>Stage</th>
                      <th style={{ padding: '14px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingLeads && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          Retrieving lead directory from Sheets database...
                        </td>
                      </tr>
                    )}
                    {!loadingLeads && filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '60px 40px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🔍</span>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem' }}>No results for this filter</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No leads match your current criteria. Try resetting your search or filter values.</div>
                            <button 
                              type="button"
                              onClick={resetFilters} 
                              className="btn-secondary"
                              style={{ marginTop: '8px', padding: '6px 16px', fontSize: '0.8rem', borderRadius: '20px' }}
                            >
                              Reset Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.lead_id} 
                        onClick={() => setPreviewLead(lead)}
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.02)', 
                          cursor: 'pointer',
                          backgroundColor: previewLead?.lead_id === lead.lead_id ? 'rgba(6, 182, 212, 0.04)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedLeads.has(lead.lead_id)} 
                            onChange={() => toggleSelectLead(lead.lead_id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600, maxWidth: '220px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} title={lead.name}>
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{lead.name}</span>
                            {(lead.isMock || lead.lead_id.startsWith('mock_') || lead.notes?.toLowerCase().includes('sandbox') || lead.notes?.toLowerCase().includes('mock') || lead.notes?.toLowerCase().includes('real scraper failed')) && (
                              <span style={{
                                background: 'rgba(249, 115, 22, 0.15)',
                                color: '#F97316',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                width: 'fit-content',
                                letterSpacing: '0.02em',
                                display: 'inline-block',
                                textTransform: 'uppercase'
                              }}>
                                SIMULATED
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{lead.category}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ color: 'var(--warning)', fontWeight: 600 }}>★ {lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>({lead.reviews_count})</span>
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{lead.area}</td>
                        <td style={{ padding: '14px', fontFamily: 'monospace' }}>{lead.email || 'N/A'}</td>
                        <td style={{ padding: '14px' }}>
                          {(() => {
                            const hasWebsite = !!(lead.website && lead.website.trim());
                            const pitchMatch = lead.notes?.match(/\[pitch:\s*([^\]]+)\]/);
                            const pitchAngle = pitchMatch ? pitchMatch[1] : (hasWebsite ? 'CRM Integration' : 'New Website Design');
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  letterSpacing: '0.04em',
                                  textTransform: 'uppercase',
                                  display: 'inline-block',
                                  width: 'fit-content',
                                  background: hasWebsite ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                  color: hasWebsite ? '#10B981' : '#F59E0B',
                                  border: `1px solid ${hasWebsite ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                                }}>
                                  {hasWebsite ? '✓ Has Website' : '⊕ Needs Site'}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}
                                  title={`Recommended offer: ${pitchAngle}`}>
                                  → {pitchAngle}
                                </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${lead.status === 'NEW' ? 'badge-new' : lead.status === 'CONTACTED' ? 'badge-contacted' : 'badge-error'}`}>
                            {(() => {
                              if (lead.status === 'CONTACTED') {
                                const notesLower = (lead.notes || '').toLowerCase();
                                if (notesLower.includes('via whatsapp')) return 'WHATSAPP';
                                if (notesLower.includes('via email') || notesLower.includes('via gmail')) return 'EMAIL';
                                if (notesLower.includes('via sms')) return 'SMS';
                                if (notesLower.includes('via jiji')) return 'JIJI';
                              }
                              return lead.status;
                            })()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a 
                              href={`/preview/${lead.lead_id}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', borderRadius: '4px' }}
                              title="Open live preview of the generated landing page"
                            >
                              <Eye size={12} /> Preview
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewLead(lead);
                                setCrmPreviewTab('tasks');
                                setTimeout(() => {
                                  const textEl = document.querySelector('textarea[placeholder*="Dentist"]');
                                  if (textEl) (textEl as HTMLTextAreaElement).focus();
                                }, 150);
                              }}
                              className="btn-primary"
                              style={{ 
                                padding: '4px 8px', 
                                fontSize: '0.75rem', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)'
                              }}
                              title="Prompt Antigravity AI to redesign this website"
                            >
                              <Sparkles size={12} /> Agent Redesign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resize Handle Drag Divider */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = crmTableWidth;
                  
                  const onMouseMove = (moveEvent: MouseEvent) => {
                    const newWidth = startWidth + (moveEvent.clientX - startX);
                    setCrmTableWidth(Math.max(400, Math.min(1200, newWidth)));
                  };
                  
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                  };
                  
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
                onMouseEnter={(e) => {
                  const bar = e.currentTarget.querySelector('.resize-bar-handle') as HTMLElement;
                  if (bar) {
                    bar.style.backgroundColor = 'var(--primary)';
                    bar.style.height = '100px';
                  }
                }}
                onMouseLeave={(e) => {
                  const bar = e.currentTarget.querySelector('.resize-bar-handle') as HTMLElement;
                  if (bar) {
                    bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    bar.style.height = '60px';
                  }
                }}
                style={{
                  width: '16px',
                  alignSelf: 'stretch',
                  cursor: 'col-resize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 10,
                  margin: '0 4px',
                  userSelect: 'none'
                }}
              >
                <div 
                  className="resize-bar-handle"
                  style={{
                    width: '2px',
                    height: '60px',
                    borderRadius: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                  }} 
                />
              </div>

              {/* Template Preview Panel */}
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1, minWidth: '320px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', margin: 0 }}>
                  <UserCheck size={18} color="var(--primary)" /> Client Site Customizer & Outreach
                </h3>

                {previewLead ? (
                  <>
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', background: 'var(--input-bg)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('outreach')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'outreach' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'outreach' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Mail size={12} /> Outreach
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('customizer')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'customizer' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'customizer' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Palette size={12} /> Customizer
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('tasks')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'tasks' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'tasks' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Terminal size={12} /> Tasks
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('handover')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'handover' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'handover' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Share2 size={12} /> Handover
                      </button>
                    </div>

                    {/* TAB CONTENT: OUTREACH */}
                    {crmPreviewTab === 'outreach' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Send To:</strong> {previewLead.email || previewLead.phone_raw || previewLead.profile_url || 'N/A'}</div>
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Business:</strong> {previewLead.name}</div>
                          {(previewLead.isMock || previewLead.lead_id.startsWith('mock_') || previewLead.notes?.toLowerCase().includes('sandbox') || previewLead.notes?.toLowerCase().includes('mock') || previewLead.notes?.toLowerCase().includes('real scraper failed')) && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                color: '#F97316',
                                border: '1px solid rgba(249, 115, 22, 0.4)',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                letterSpacing: '0.02em',
                                display: 'inline-block',
                                textTransform: 'uppercase'
                              }}>
                                SIMULATED
                              </span>
                            </div>
                          )}
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Rating:</strong> {previewLead.rating} Stars</div>
                        </div>

                        {/* ── AI Upgrade Intelligence Card ── */}
                        {(() => {
                          const hasWebsite = !!(previewLead.website && previewLead.website.trim());
                          const pitchMatch = previewLead.notes?.match(/\[pitch:\s*([^\]]+)\]/);
                          const aiScoreMatch = previewLead.notes?.match(/AI Relevance Score:\s*(\d+)\/10/);
                          const pitchAngle = pitchMatch ? pitchMatch[1] : (hasWebsite ? 'CRM Integration & WhatsApp Automation' : 'New Website Design');
                          const aiScore = aiScoreMatch ? parseInt(aiScoreMatch[1]) : null;

                          const upgradeOffers: Record<string, { icon: string; desc: string; color: string }> = {
                            'New Website Design':               { icon: '🌐', desc: 'Build a modern professional website with a booking/inquiry widget.', color: '#F59E0B' },
                            'Online Booking & Intake':          { icon: '📅', desc: 'Add patient scheduling, intake forms, and WhatsApp appointment reminders.', color: '#06B6D4' },
                            'Table Reservation System':         { icon: '🍽️', desc: 'Online table booking with kitchen alert notifications and SMS reminders.', color: '#EA580C' },
                            'Trade-In Estimator & CRM':         { icon: '🚗', desc: 'Smart vehicle valuation calculator with sales team WhatsApp routing.', color: '#EF4444' },
                            'Paystack Checkout & E-Commerce':   { icon: '🛒', desc: 'Shopping cart with Paystack/Flutterwave checkout and automated invoices.', color: '#10B981' },
                            'Client Portal & Invoicing':        { icon: '📊', desc: 'Client-facing quote builder, branded PDF invoicing, and Google Sheets CRM sync.', color: '#8B5CF6' },
                            'CRM Integration & WhatsApp Automation': { icon: '🤖', desc: 'AI chatbot, WhatsApp drip campaigns, and lead-to-CRM pipeline automation.', color: '#3B82F6' },
                          };
                          const offer = upgradeOffers[pitchAngle] || upgradeOffers['CRM Integration & WhatsApp Automation'];

                          return (
                            <div style={{
                              background: hasWebsite ? 'rgba(6, 182, 212, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                              border: `1px solid ${hasWebsite ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                              borderRadius: '10px',
                              padding: '12px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '1.1rem' }}>{offer.icon}</span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: offer.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    AI-Recommended Upgrade
                                  </span>
                                </div>
                                {aiScore !== null && (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    background: aiScore >= 8 ? 'rgba(16,185,129,0.15)' : aiScore >= 6 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: aiScore >= 8 ? '#10B981' : aiScore >= 6 ? '#F59E0B' : '#EF4444',
                                    border: `1px solid ${aiScore >= 8 ? 'rgba(16,185,129,0.3)' : aiScore >= 6 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
                                  }}>
                                    Score: {aiScore}/10
                                  </span>
                                )}
                              </div>
                              <div style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                padding: '6px 10px',
                                background: `${offer.color}18`,
                                borderRadius: '6px',
                                border: `1px solid ${offer.color}30`
                              }}>
                                {pitchAngle}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {offer.desc}
                              </div>
                              {hasWebsite && previewLead.website && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current site:</span>
                                  <a href={previewLead.website} target="_blank" rel="noreferrer"
                                    style={{ fontSize: '0.72rem', color: '#06B6D4', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}
                                    title={previewLead.website}>
                                    {previewLead.website.replace(/^https?:\/\/(www\.)?/, '')}
                                  </a>
                                  <ExternalLink size={10} color="#06B6D4" />
                                </div>
                              )}
                              {!hasWebsite && (
                                <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontStyle: 'italic' }}>
                                  💡 No website detected — pitch a brand-new web presence.
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <input 
                            type="checkbox" 
                            id="useCustomMessage" 
                            checked={useCustomMessage} 
                            onChange={(e) => {
                              setUseCustomMessage(e.target.checked);
                              if (e.target.checked && !customMessageText) {
                                setCustomMessageText(renderTemplatePreview(previewLead));
                                const channel = config.outreachChannel || 'gmail';
                                if (['gmail', 'email'].includes(channel)) {
                                  // Use the AI pitch subject if available
                                  const pitchMatchS = previewLead.notes?.match(/\[pitch:\s*([^\]]+)\]/);
                                  const hasWebsiteS = !!(previewLead.website && previewLead.website.trim());
                                  const pitchAngleS = pitchMatchS ? pitchMatchS[1] : (hasWebsiteS ? 'CRM Integration & WhatsApp Automation' : 'New Website Design');
                                  setCustomSubjectText(hasWebsiteS
                                    ? `Upgrading ${previewLead.name} — ${pitchAngleS}`
                                    : `Custom Web Design Proposal for ${previewLead.name}`);
                                }
                              }
                            }}
                            style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          <label htmlFor="useCustomMessage" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', userSelect: 'none' }}>
                            Send a custom message override instead of template
                          </label>
                        </div>

                        {useCustomMessage ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(config.outreachChannel === 'gmail' || !config.outreachChannel) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Custom Subject Line</label>
                                <input 
                                  type="text" 
                                  value={customSubjectText} 
                                  onChange={(e) => setCustomSubjectText(e.target.value)} 
                                  placeholder="e.g. Unique proposal for {{lead.name}}"
                                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                />
                              </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Custom Message Body</label>
                              <textarea 
                                rows={8}
                                value={customMessageText} 
                                onChange={(e) => setCustomMessageText(e.target.value)} 
                                placeholder="Type your custom outreach message here..."
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
                              />
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                              <span>Click tags to insert:</span>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{lead.name}}')}>{"{{lead.name}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{previewUrl}}')}>{"{{previewUrl}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{lead.rating}}')}>{"{{lead.rating}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{signature}}')}>{"{{signature}}"}</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ background: 'var(--input-bg-darker)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '14px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '220px' }}>
                            {renderTemplatePreview(previewLead)}
                          </div>
                        )}
                        
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={12} />
                          {(!config.outreachChannel || config.outreachChannel === 'gmail') && "Make sure the business has an email saved in Google Sheets before clicking Outreach Send."}
                          {config.outreachChannel === 'whatsapp' && "Make sure the business has a valid phone number before clicking Outreach Send."}
                          {config.outreachChannel === 'sms' && "Make sure the business has a valid phone number before clicking Outreach Send."}
                          {config.outreachChannel === 'coldcall' && "Twilio will call the business phone number using synthetic AI voice speech."}
                          {config.outreachChannel === 'jiji' && "Jiji automated dispatcher will open the Jiji profile link and submit the chat."}
                          {config.outreachChannel === 'multichannel' && "Sends Email + WhatsApp + SMS simultaneously. For Jiji leads, it automatically bypasses Email and SMS, sending only WhatsApp and Jiji chat."}
                          {['instagram', 'facebook', 'tiktok', 'linkedin'].includes(config.outreachChannel || '') && "Social outreach will flag lead status contacted and redirect you to the direct chat page."}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: CUSTOMIZER */}
                    {crmPreviewTab === 'customizer' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Gemini AI Redesign Prompt */}
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', margin: 0 }}>
                            <Sparkles size={14} /> AI Web Redesign Prompt (Gemini Vertex)
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <input 
                              type="text" 
                              value={aiRedesignPrompt} 
                              onChange={(e) => setAiRedesignPrompt(e.target.value)} 
                              placeholder="e.g. elegant dark theme with gold accents"
                              style={{ flex: 1, padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                            />
                            <button 
                              type="button" 
                              onClick={handleAiRedesign}
                              disabled={aiRedesignLoading || !aiRedesignPrompt}
                              className="btn-primary"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '10px 14px' }}
                            >
                              {aiRedesignLoading ? <Loader2 className="spin-anim" size={14} /> : <Sparkles size={14} />} Redesign
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets & Features */}
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                            <Palette size={14} /> Quick Niche Presets & Style Matcher
                          </h4>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <select
                                onChange={(e) => {
                                  const pr = WEBSITE_STYLE_PRESETS.find(p => p.id === e.target.value);
                                  if (pr) applyPreset(pr);
                                }}
                                style={{ flex: 1, padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                                defaultValue=""
                              >
                                <option value="" disabled>-- Select a Niche Design Preset --</option>
                                {WEBSITE_STYLE_PRESETS.map((preset) => {
                                  const category = (previewLead?.category || '').toLowerCase();
                                  const isRecommended = preset.categoryKeywords.some(kw => category.includes(kw));
                                  return (
                                    <option key={preset.id} value={preset.id}>
                                      {preset.name} {isRecommended ? '★ (Recommended Match)' : ''}
                                    </option>
                                  );
                                })}
                              </select>

                              <button
                                type="button"
                                onClick={autoDetectPreset}
                                className="btn-secondary"
                                style={{ fontSize: '0.8rem', padding: '10px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                                title="Auto-detect industry and apply colors, font, copy, and matching widget"
                              >
                                <RefreshCw size={12} /> Auto-Detect
                              </button>
                            </div>

                            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                              Applying a preset configures professional, conversion-optimized colors, fonts, hero layouts, and the most relevant business widget with one click.
                            </p>
                          </div>

                          {/* Custom Interactive Automation Widget */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              ⚡ Active Business Feature & Automation Demo
                            </label>
                            
                            <select
                              value={overrideWidgetType}
                              onChange={(e) => {
                                const newType = e.target.value;
                                setOverrideWidgetType(newType);
                                // Autofill default values matching this type if empty
                                const defaults: Record<string, {title: string, desc: string}> = {
                                  ecommerce: {
                                    title: 'Secure Product Order & Paystack Checkout',
                                    desc: 'Select items from our inventory below and complete your order using Paystack secure payments.'
                                  },
                                  patient_intake: {
                                    title: 'New Patient Registration & Scheduling',
                                    desc: 'Provide your basic details to book an intake consultation or register digitally.'
                                  },
                                  vehicle_valuation: {
                                    title: 'Smart Vehicle Valuation Calculator',
                                    desc: 'Input your vehicle details to calculate our trade-in estimate instantly.'
                                  },
                                  table_reservation: {
                                    title: 'Instant Table & Seat Reservation System',
                                    desc: 'Book your table online in real-time. Pick date, guest count, and dining area.'
                                  },
                                  quote_estimator: {
                                    title: 'Interactive Project Quote Estimator',
                                    desc: 'Select repair services to build a real-time price estimate and generate an invoice proposal.'
                                  }
                                };
                                if (defaults[newType]) {
                                  setOverrideWidgetTitle(defaults[newType].title);
                                  setOverrideWidgetDescription(defaults[newType].desc);
                                }
                              }}
                              style={{ padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                            >
                              <option value="">No Active Demo Widget</option>
                              <option value="ecommerce">🛒 Paystack Secure Checkout Shopping Cart</option>
                              <option value="patient_intake">🗓️ Patient Booking & Intake Portal</option>
                              <option value="vehicle_valuation">🚗 Smart Vehicle Trade-In Valuation Calculator</option>
                              <option value="table_reservation">🍽️ Table Reservation & Dining Booker</option>
                              <option value="quote_estimator">📊 Project Quote Estimator & Invoice Generator</option>
                            </select>

                            {overrideWidgetType && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', marginTop: '4px' }}>
                                <div>
                                  <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Widget Header Title</label>
                                  <input
                                    type="text"
                                    value={overrideWidgetTitle}
                                    onChange={(e) => setOverrideWidgetTitle(e.target.value)}
                                    placeholder="Widget title"
                                    style={{ width: '100%', padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Widget Instructions/Description</label>
                                  <textarea
                                    value={overrideWidgetDescription}
                                    onChange={(e) => setOverrideWidgetDescription(e.target.value)}
                                    placeholder="Describe how the widget works..."
                                    rows={2}
                                    style={{ width: '100%', padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Manual Customization Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                            Manual Styles & Content Overrides
                          </h4>

                          {/* Theme Colors Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Primary Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overridePrimary || '#1e3a8a'} 
                                  onChange={(e) => setOverridePrimary(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overridePrimary} 
                                  onChange={(e) => setOverridePrimary(e.target.value)} 
                                  placeholder="#1e3a8a"
                                  style={{ flex: 1, padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Accent Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideAccent || '#60a5fa'} 
                                  onChange={(e) => setOverrideAccent(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideAccent} 
                                  onChange={(e) => setOverrideAccent(e.target.value)} 
                                  placeholder="#60a5fa"
                                  style={{ flex: 1, padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Background Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideBg || '#eff6ff'} 
                                  onChange={(e) => setOverrideBg(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideBg} 
                                  onChange={(e) => setOverrideBg(e.target.value)} 
                                  placeholder="#eff6ff"
                                  style={{ flex: 1, padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Text Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideText || '#1e3a8a'} 
                                  onChange={(e) => setOverrideText(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideText} 
                                  onChange={(e) => setOverrideText(e.target.value)} 
                                  placeholder="#1e3a8a"
                                  style={{ flex: 1, padding: '6px 8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Font Selector */}
                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Typography Font</label>
                            <select 
                              value={overrideFont} 
                              onChange={(e) => setOverrideFont(e.target.value)}
                              style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                            >
                              <option value="">Default theme font</option>
                              <option value="Inter">Inter (Modern Clean)</option>
                              <option value="Space Grotesk">Space Grotesk (Tech Editorial)</option>
                              <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                              <option value="DM Serif Display">DM Serif Display (Classic Bold)</option>
                              <option value="Outfit">Outfit (Premium Rounded)</option>
                            </select>
                          </div>

                          {/* Section Visibility Switches */}
                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Section Visibility</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                <input type="checkbox" checked={overrideShowServices} onChange={(e) => setOverrideShowServices(e.target.checked)} /> Show Services
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                <input type="checkbox" checked={overrideShowTestimonials} onChange={(e) => setOverrideShowTestimonials(e.target.checked)} /> Show Testimonials
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                <input type="checkbox" checked={overrideShowEstimator} onChange={(e) => setOverrideShowEstimator(e.target.checked)} /> Show Booking/Estimator
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                <input type="checkbox" checked={overrideShowAbout} onChange={(e) => setOverrideShowAbout(e.target.checked)} /> Show About Us
                              </label>
                            </div>
                          </div>

                          {/* Copy Content Overrides */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Hero Title (Tagline)</label>
                              <input 
                                type="text" 
                                value={overrideHeroTitle} 
                                onChange={(e) => setOverrideHeroTitle(e.target.value)} 
                                placeholder="Enter custom tagline..."
                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Hero Subtitle</label>
                              <textarea 
                                rows={2}
                                value={overrideHeroSubtitle} 
                                onChange={(e) => setOverrideHeroSubtitle(e.target.value)} 
                                placeholder="Enter custom subtitle value prop..."
                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>About Text</label>
                              <textarea 
                                rows={3}
                                value={overrideAboutText} 
                                onChange={(e) => setOverrideAboutText(e.target.value)} 
                                placeholder="Enter custom about section content..."
                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>CTA Button Text</label>
                              <input 
                                type="text" 
                                value={overrideCtaText} 
                                onChange={(e) => setOverrideCtaText(e.target.value)} 
                                placeholder="e.g. Book Appointment"
                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                              />
                            </div>
                          </div>

                          <button 
                            type="button" 
                            onClick={saveOverrides}
                            className="btn-primary"
                            style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', cursor: 'pointer' }}
                          >
                            Save Design Overrides
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: TASKS */}
                    {crmPreviewTab === 'tasks' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 4px 0' }}>
                            <Terminal size={14} /> Antigravity Developer Task Queue
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>
                            Submit complex coding modifications (e.g. adding features, page layout changes) for the background CLI agent to execute directly on the codebase.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Describe Modification / Feature Prompt</label>
                            <textarea 
                              rows={5}
                              value={taskQueuePrompt} 
                              onChange={(e) => setTaskQueuePrompt(e.target.value)} 
                              placeholder="e.g. Add a beautiful Google Maps iframe section and a multi-step booking wizard for this Dentist site."
                              style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Task Priority</label>
                            <select 
                              value={taskQueuePriority} 
                              onChange={(e) => setTaskQueuePriority(e.target.value as any)}
                              style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                            </select>
                          </div>

                          <button 
                            type="button" 
                            onClick={queueTask}
                            disabled={taskQueueLoading || !taskQueuePrompt}
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            {taskQueueLoading ? <Loader2 className="spin-anim" size={16} /> : <Send size={16} />} Queue Code Modification
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: HANDOVER */}
                    {crmPreviewTab === 'handover' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, margin: '0 0 4px 0' }}>
                            Client Hosting & Database Options
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>
                            Configure where leads should submit bookings and how the client hosting should be managed when claiming this website.
                          </p>
                        </div>

                        {/* Turnout Scaling Selector */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Lead Turnout Mode</label>
                          <select 
                            value={turnoutMode} 
                            onChange={(e) => updateTurnoutMode(e.target.value as any)}
                            style={{ width: '100%', padding: '10px', background: 'var(--input-bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', fontWeight: 600 }}
                          >
                            <option value="dynamic">Central CRM Database Mode</option>
                            <option value="n8n">Direct n8n automation webhook redirection</option>
                            <option value="git">Independent HTML / Git export client package</option>
                          </select>

                          {turnoutMode === 'dynamic' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Form submissions route back directly to this admin console's main CRM pipeline and Google Sheets.
                            </p>
                          )}
                          {turnoutMode === 'n8n' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Form submissions bypass this console and route directly to the webhook URL set in Settings.
                            </p>
                          )}
                          {turnoutMode === 'git' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Claiming the site will export and publish code to GitHub / Netlify. Forms submit to independent client keys (Web3Forms/Supabase).
                            </p>
                          )}
                        </div>

                        {/* Handover Portal Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                          <a 
                            href={`/handover/${previewLead.lead_id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', width: '100%', textAlign: 'center' }}
                          >
                            <ExternalLink size={16} /> Open Client Handover Portal
                          </a>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Send this secure portal link to the client to let them handle hosting setup independently.
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                    Select a lead in the CRM directory to preview website overrides and outreach options.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* TAB 3: SCRAPERS CONTROL */}
        {activeTab === 'scrapers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Multi-Source Lead Scrapers</h3>
                <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>Multiple Providers</span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                Select a lead scraper provider. All providers include businesses regardless of website status and insert new qualified leads directly into your database.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '8px' }}>
                <ScraperCard
                  id="google"
                  name="Google Places API"
                  description="Official Places endpoint. High data fidelity."
                  status="api-required"
                  isConfigured={!!config.googlePlacesApiKey}
                  isSelected={selectedScraper === 'google'}
                  onSelect={() => setSelectedScraper('google')}
                />
                <ScraperCard
                  id="maps-free"
                  name="Google Maps (Free)"
                  description="Playwright-powered scraper. No API keys."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'maps-free'}
                  onSelect={() => setSelectedScraper('maps-free')}
                />
                <ScraperCard
                  id="duckduckgo"
                  name="DuckDuckGo Search"
                  description="Crawls public business search pages."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'duckduckgo'}
                  onSelect={() => setSelectedScraper('duckduckgo')}
                />
                <ScraperCard
                  id="osm"
                  name="OpenStreetMap"
                  description="Free register of shops, offices, amenities."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'osm'}
                  onSelect={() => setSelectedScraper('osm')}
                />
                <ScraperCard
                  id="jiji"
                  name="Jiji Crawler"
                  description="Crawls Jiji.ng classified listings."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'jiji'}
                  onSelect={() => setSelectedScraper('jiji')}
                />
                <ScraperCard
                  id="instagram"
                  name="Instagram Scraper"
                  description="Crawls Instagram business profiles."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'instagram'}
                  onSelect={() => setSelectedScraper('instagram')}
                />
                <ScraperCard
                  id="facebook"
                  name="Facebook Scraper"
                  description="Crawls Facebook pages & listings."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'facebook'}
                  onSelect={() => setSelectedScraper('facebook')}
                />
                <ScraperCard
                  id="tiktok"
                  name="TikTok Scraper"
                  description="Crawls TikTok merchant bios & links."
                  status="free"
                  isConfigured={true}
                  isSelected={selectedScraper === 'tiktok'}
                  onSelect={() => setSelectedScraper('tiktok')}
                />
                <ScraperCard
                  id="linkedin"
                  name="LinkedIn Scraper"
                  description="Crawls LinkedIn company pages."
                  status="api-required"
                  isConfigured={false}
                  isSelected={selectedScraper === 'linkedin'}
                  onSelect={() => setSelectedScraper('linkedin')}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', margin: '8px 0' }} />

              <ScrapeControls
                selectedScraper={selectedScraper}
                query={gMapsQuery}
                setQuery={setGMapsQuery}
                limit={gMapsLimit}
                setLimit={setGMapsLimit}
                scraping={scraping}
                onExecute={runScraper}
                isConfigured={selectedScraper === 'google' ? !!config.googlePlacesApiKey : true}
                requiresKey={selectedScraper === 'google'}
                runAllConcurrently={runAllConcurrently}
                setRunAllConcurrently={setRunAllConcurrently}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginTop: '16px' }}>
                <Lagos10KOutreachCard />
                <SolarQuoteProOutreachCard />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                id="scraper-runner-control"
                className="glass-panel" 
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  background: runnerStatus === 'online' 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0.01) 100%)' 
                    : 'var(--card-bg)',
                  border: runnerStatus === 'online'
                    ? '1px solid rgba(16, 185, 129, 0.15)'
                    : '1px solid var(--panel-border)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={18} color="var(--primary)" />
                    {config?.activeRunnerBackend === 'github_actions' ? 'GitHub Actions Cloud Runner' : (config?.activeRunnerBackend === 'huggingface' ? 'Hugging Face Space Runner' : 'Local Scraper Runner')}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: runnerStatus === 'online' ? '#10B981' : runnerStatus === 'loading' ? '#F59E0B' : '#EF4444',
                      boxShadow: runnerStatus === 'online' 
                        ? '0 0 10px #10B981, 0 0 20px rgba(16, 185, 129, 0.4)' 
                        : 'none'
                    }} />
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      color: runnerStatus === 'online' ? '#10B981' : runnerStatus === 'loading' ? '#F59E0B' : '#EF4444' 
                    }}>
                      {runnerStatus === 'online' ? 'Running' : runnerStatus === 'loading' ? 'Checking' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Active Runner Target Switch */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Execution Backend</span>
                  <select
                    value={config?.activeRunnerBackend || 'local'}
                    onChange={async (e) => {
                      const target = e.target.value;
                      try {
                        const targetLabel = target === 'local' ? 'Local PC' : (target === 'github_actions' ? 'GitHub Actions (Free)' : 'Cloud (Hugging Face)');
                        addToast(`Switching active runner target to ${targetLabel}...`, 'info');
                        const saveRes = await fetch('/api/config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ activeRunnerBackend: target })
                        });
                        if (saveRes.ok) {
                          addToast(`Runner target switched to ${target === 'local' ? 'Local PC' : (target === 'github_actions' ? 'GitHub Actions' : 'Cloud Space')}!`, 'success');
                          fetchConfig();
                          setTimeout(checkRunnerStatus, 500);
                        } else {
                          addToast('Failed to save runner target configuration.', 'error');
                        }
                      } catch (err: any) {
                        addToast(`Error updating runner target: ${err.message}`, 'error');
                      }
                    }}
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="local">💻 Local PC Workstation</option>
                    <option value="huggingface">☁️ Cloud (Hugging Face - PRO)</option>
                    <option value="github_actions">🐙 Cloud (GitHub Actions - Free)</option>
                  </select>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.4' }}>
                  {config?.activeRunnerBackend === 'github_actions'
                    ? "On-demand cloud queue execution run via GitHub Actions. Automatically spins up when tasks are enqueued, and logs statistics in Supabase logs."
                    : config?.activeRunnerBackend === 'huggingface'
                      ? "Persistent background queue execution running on Hugging Face Spaces. Automatically syncs with your Supabase queue."
                      : isProductionEnv 
                        ? "Monitoring local worker via database heartbeat. You can start/stop the local worker directly using the buttons below if your local server is running on port 3006."
                        : "Spawns and manages the local background queue worker process tree. It will automatically process queued scraper jobs in the background."}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {runnerStatus === 'online' ? (
                    <button
                      type="button"
                      onClick={handleStopLocalRunner}
                      disabled={triggerLoading}
                      className="btn-secondary"
                      style={{
                        flexGrow: 1,
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderColor: '#EF4444',
                        color: '#EF4444',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {triggerLoading 
                        ? <Loader2 size={16} className="spin-anim" /> 
                        : config?.activeRunnerBackend === 'github_actions' ? 'GitHub Actions (On-Demand)' : (config?.activeRunnerBackend === 'huggingface' ? 'Pause Cloud Space' : 'Stop Runner')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLocalTrigger}
                      disabled={triggerLoading || runnerStatus === 'loading'}
                      className="btn-primary"
                      style={{
                        flexGrow: 1,
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: 'none',
                        color: 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      {triggerLoading 
                        ? <Loader2 size={16} className="spin-anim" /> 
                        : config?.activeRunnerBackend === 'github_actions' ? 'Trigger GitHub Action' : (config?.activeRunnerBackend === 'huggingface' ? 'Start Cloud Space' : 'Start Runner')}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={checkRunnerStatus}
                    disabled={triggerLoading || runnerStatus === 'loading'}
                    className="btn-secondary"
                    style={{
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Refresh runner status"
                  >
                    <RefreshCw size={16} className={runnerStatus === 'loading' ? 'animate-spin' : ''} />
                  </button>

                  <a
                    href={`http://localhost:${localPort || '3006'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#06B6D4',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    title="Open Local Console on Port 3006"
                  >
                    <ExternalLink size={14} /> http://localhost:{localPort || '3006'}
                  </a>
                </div>

                {/* Quick-access Lagos 10K shortcut button */}
                <button
                  type="button"
                  id="bulk-queue-btn-quick"
                  onClick={runLagos10KStandalone}
                  disabled={bulkQueuing}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%',
                    padding: '11px 16px',
                    background: bulkQueuing
                      ? 'rgba(6, 182, 212, 0.25)'
                      : 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
                    border: 'none', borderRadius: '10px',
                    color: 'white', fontWeight: 700, fontSize: '0.88rem',
                    cursor: bulkQueuing ? 'not-allowed' : 'pointer',
                    opacity: bulkQueuing ? 0.65 : 1,
                    marginTop: '4px',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  {bulkQueuing
                    ? <><Loader2 size={15} className="animate-spin" /> Queueing 10K Jobs...</>
                    : <><Flame size={15} /> ⚡ Start Lagos 10K Scraper</>
                  }
                </button>
                {runnerStatus !== 'online' && (
                  <p style={{ fontSize: '0.72rem', color: '#F59E0B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={11} /> Runner offline — clicking will auto-start it then launch scrapers.
                  </p>
                )}
              </div>

              {/* Autostart set-and-forget instructions removed to streamline Settings panel */}

              {/* Lagos 10K Daily Lead Scraper & Automation Panel */}
              <div
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(139, 92, 246, 0.04) 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #10B981)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Flame size={20} color="#06B6D4" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                    Lagos 10K Daily Lead Scraper
                  </h4>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
                    background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '20px', color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>10,000/day</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.5', margin: 0 }}>
                  Automatically generates up to <strong style={{ color: 'var(--text-primary)' }}>100 scraper jobs</strong> across 22 business niches (clinics, lawyer, boutiques, transport…) and 20 Lagos suburbs. Targetting <strong style={{ color: '#10B981' }}>10,000+ hydrated local leads</strong> daily.
                </p>

                {/* Estimate meters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Scrapers Configured', value: bulkQueuedCount !== null ? String(bulkQueuedCount) : '100', color: '#8B5CF6' },
                    { label: 'Target Leads', value: bulkQueuedCount !== null ? String(bulkQueuedCount * 100) : '10,000', color: '#10B981' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      border: `1px solid ${color}22`
                    }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0 6px 0', padding: '10px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <input
                    type="checkbox"
                    id="auto-queue-lagos-daily-check"
                    checked={config.autoQueueLagosDaily10k !== false}
                    onChange={async (e) => {
                      const updatedConfig = { ...config, autoQueueLagosDaily10k: e.target.checked };
                      setConfig(updatedConfig);
                      try {
                        await fetch('/api/config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updatedConfig)
                        });
                        addToast(e.target.checked ? 'Daily Lagos scraper automation enabled!' : 'Daily Lagos automation disabled.', 'success');
                      } catch {
                        addToast('Failed to update automation settings', 'error');
                      }
                    }}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--primary)',
                      cursor: 'pointer'
                    }}
                  />
                  <label 
                    htmlFor="auto-queue-lagos-daily-check" 
                    style={{ fontSize: '0.8rem', color: '#e2e8f0', cursor: 'pointer', userSelect: 'none' }}
                  >
                    Automate daily 24h cron runs to queue 10k leads
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    id="bulk-queue-btn"
                    onClick={runLagos10KStandalone}
                    disabled={bulkQueuing}
                    style={{
                      flex: '1 1 200px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '12px 20px',
                      background: bulkQueuing
                        ? 'rgba(6, 182, 212, 0.3)'
                        : 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
                      border: 'none', borderRadius: '10px',
                      color: 'white', fontWeight: 700, fontSize: '0.9rem',
                      cursor: bulkQueuing ? 'not-allowed' : 'pointer',
                      opacity: bulkQueuing ? 0.7 : 1,
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
                    }}
                  >
                    {bulkQueuing
                      ? <><Loader2 size={16} className="animate-spin" /> Starting Scrapers...</>
                      : <><Sparkles size={16} /> ⚡ Start Lagos Scraper (10K Leads)</>
                    }
                  </button>

                  <a
                    href={`http://localhost:${localPort || '3006'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '12px 16px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '10px',
                      color: '#06B6D4',
                      fontWeight: 600, fontSize: '0.85rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    title="Open Console on localhost:3006"
                  >
                    <ExternalLink size={14} /> http://localhost:{localPort || '3006'}
                  </a>
                </div>

                {runnerStatus !== 'online' && (
                  <p style={{ fontSize: '0.75rem', color: '#10B981', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={12} /> 1-Click Auto Run: Clicking will automatically start the background runner and launch 100 scraper jobs.
                  </p>
                )}

                {bulkQueuedCount !== null && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <CheckCircle size={14} />
                    {bulkQueuedCount} scraper engines running in pool · targetting ~{bulkQueuedCount * 100} leads
                  </div>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--primary)' }}>Verification Rules</h4>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Website Check:</strong> Includes all businesses. Leads with a website receive upgrade/automation pitches; leads without a website receive new-site design proposals.</li>
                  <li><strong>Outreach Sync:</strong> Automatically normalizes phone numbers and syncs target lists to Google Sheets in real-time.</li>
                  <li><strong>Rating Floor:</strong> Defaults to high ratings or checks Maps rating thresholds.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CAMPAIGN SCHEDULER */}
        {activeTab === 'scheduler' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Control Panel */}
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={24} /> 30-Day Campaign Scheduler
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Plan, pace, and automate your lead generation pipeline using AI. Spreads queries across a 30-day window.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleTriggerNextCampaign}
                    disabled={triggeringCampaign || !schedule}
                    className="btn-secondary"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: '#a78bfa',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {triggeringCampaign ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                    Trigger Next Now
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateAISchedule}
                    disabled={generatingSchedule}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                      border: 'none',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {generatingSchedule ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Generate 30-Day Plan (AI)
                  </button>
                </div>
              </div>

              {scheduleLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 10px' }} />
                  Loading active campaign plan...
                </div>
              ) : !schedule ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No active schedule found. Click "Generate 30-Day Plan" above to configure your pipeline.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  {/* Left Side: pacing & focus constraints */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Pacing & Campaign Controls</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <input
                        type="checkbox"
                        id="autoQueueEnabled"
                        checked={schedule.autoQueueEnabled}
                        onChange={(e) => handleSaveScheduleSettings(e.target.checked, schedule.intervalDays)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="autoQueueEnabled" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}>
                        Enable Auto-Queue (Background Automation)
                      </label>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Pacing Interval (Days between searches)
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={schedule.intervalDays}
                          onChange={(e) => handleSaveScheduleSettings(schedule.autoQueueEnabled, parseInt(e.target.value) || 1)}
                          style={{
                            width: '80px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Run next query query every {schedule.intervalDays} days. (Takes ~36 days for 12 queries).
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: AI seed constraints */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>AI Seed Target Filters</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Niche Focus Constraint</label>
                        <input
                          type="text"
                          placeholder="e.g. dentists, boutique, gyms"
                          value={nicheFocusInput}
                          onChange={(e) => setNicheFocusInput(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'white'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Location Focus Constraint</label>
                        <input
                          type="text"
                          placeholder="e.g. Lekki, Ikeja, Lagos"
                          value={locationFocusInput}
                          onChange={(e) => setLocationFocusInput(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'white'
                          }}
                        />
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      💡 If empty, the AI generator dynamically maps non-overlapping niches and suburbs across Lagos based on real database lead saturation stats.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Pipeline Matrix */}
            {schedule && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                    Campaign Plan Matrix: <span style={{ color: 'var(--primary)' }}>{schedule.monthYear}</span>
                  </h3>
                  {schedule.lastTriggeredAt && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Last query queued: {new Date(schedule.lastTriggeredAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {schedule.weeks.map((week: any) => (
                    <div
                      key={week.weekNumber}
                      className="glass-panel"
                      style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        background: 'rgba(255, 255, 255, 0.015)',
                        border: '1px solid rgba(255, 255, 255, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>Week {week.weekNumber}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>3 Targets</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {week.queries.map((q: any) => (
                          <div
                            key={q.id}
                            style={{
                              padding: '10px 12px',
                              background: 'rgba(0,0,0,0.15)',
                              borderRadius: '6px',
                              border: q.status === 'queued' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.02)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={q.query}>
                                {q.query}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  background: q.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : q.status === 'queued' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                                  color: q.status === 'completed' ? '#10B981' : q.status === 'queued' ? '#a78bfa' : 'var(--text-muted)',
                                  border: q.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' : q.status === 'queued' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.08)'
                                }}
                              >
                                {q.status}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              <span style={{ textTransform: 'capitalize' }}>
                                Engine: {q.scraper === 'maps-free' ? 'Google Maps' : q.scraper}
                              </span>
                              {q.leadsScraped !== undefined && (
                                <span style={{ color: '#10B981', fontWeight: 600 }}>
                                  +{q.leadsScraped} leads
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYSTEM SYNC LOGS */}
        {activeTab === 'logs' && (
          <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>System Audit Logs</h3>
              <button onClick={fetchLogs} disabled={loadingLogs} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                Refresh Timeline
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '400px' }}>
              {loadingLogs && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Syncing audit logs timeline...</div>}
              {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No system logs found in Google Sheets.</div>}
              
              {logs.map((log, index) => (
                <div key={index} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{log[2]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log[1]).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span className={`badge ${log[4] === 'SUCCESS' ? 'badge-contacted' : log[4] === 'ERROR' ? 'badge-error' : 'badge-new'}`} style={{ fontSize: '0.7rem' }}>
                      {log[4]}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log[5]}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: SYSTEM VARIABLES */}
        {activeTab === 'settings' && (
          <form onSubmit={saveConfig} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>System Settings & API Integrations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Configure your databases, scraping APIs, and multi-channel outreach options.</p>
            </div>

            {/* Section A: Global & Data Store */}
            <div id="db-settings" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>1. Global Configuration</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Storage Backend Mode</label>
                  <select 
                    value={config.storageMode || 'hybrid'} 
                    onChange={(e) => setConfig({ ...config, storageMode: e.target.value as any })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="hybrid">Hybrid Mode (Google Sheets + fallback)</option>
                    <option value="local">Local Mode (JSON file DB)</option>
                    <option value="supabase">Supabase Database (Postgres)</option>
                    <option value="cloud">Google Sheets Database Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Default Outreach Channel</label>
                  <select 
                    value={config.outreachChannel || 'gmail'} 
                    onChange={(e) => setConfig({ ...config, outreachChannel: e.target.value as any })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="gmail">Email Outreach</option>
                    <option value="whatsapp">WhatsApp Outreach</option>
                    <option value="sms">SMS Text Outreach</option>
                    <option value="multichannel">Multichannel Blast (Email + WhatsApp + SMS)</option>
                    <option value="coldcall">Twilio Cold Call</option>
                    <option value="jiji">Jiji Chat Outreach</option>
                    <option value="instagram">Instagram Chat Outreach</option>
                    <option value="facebook">Facebook Chat Outreach</option>
                    <option value="tiktok">TikTok Chat Outreach</option>
                    <option value="linkedin">LinkedIn Chat Outreach</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Outreach Business Signature</label>
                  <input 
                    type="text" 
                    value={config.businessSignature} 
                    onChange={(e) => setConfig({ ...config, businessSignature: e.target.value })}
                    placeholder="e.g. Bethelmind Analytics & Strategy Team"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Cascade Failover Sequence
                  </label>
                  <input 
                    type="text" 
                    value={config.failoverPriority || ''} 
                    onChange={(e) => setConfig({ ...config, failoverPriority: e.target.value })}
                    placeholder="whatsapp,sms,email"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Comma-separated channels in fallback order (e.g. <code>whatsapp,sms,email</code>)
                  </div>
                </div>
              </div>
            </div>

            {/* Section A-2: Google Sheets Integration */}
            <div id="sheets-settings" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>2. Google Sheets Integration</h4>
                <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                  Google Cloud Console →
                </a>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
                Bethelmind Analytics & Strategy stores leads, logs, and stats in Google Sheets worksheets. You can test your connection or initialize missing worksheets below.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Google Spreadsheet ID</label>
                  <input 
                    type="text" 
                    value={config.googleSpreadsheetId || ''} 
                    onChange={(e) => setConfig({ ...config, googleSpreadsheetId: e.target.value })}
                    placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!config.googleSpreadsheetId) {
                        addToast("Please enter a Google Spreadsheet ID first.", "error");
                        return;
                      }
                      setTestingSheets(true);
                      addToast("Testing Sheets connection...", "info");
                      try {
                        const res = await fetch('/api/config/test-sheets', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ initialize: false })
                        });
                        const data = await res.json();
                        if (data.success) {
                          addToast("Connection Success: " + data.message, "success");
                          checkSheetsStatus();
                        } else {
                          if (data.status === 'yellow') {
                            if (confirm(`${data.error}\n\nWould you like to initialize the missing tabs now?`)) {
                              addToast("Initializing missing worksheets...", "info");
                              const res2 = await fetch('/api/config/test-sheets', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ initialize: true })
                              });
                              const data2 = await res2.json();
                              if (data2.success) {
                                addToast("Worksheets initialized: " + data2.message, "success");
                                checkSheetsStatus();
                              } else {
                                addToast("Initialization failed: " + data2.error, "error");
                              }
                            }
                          } else {
                            addToast("Connection Failed: " + data.error, "error");
                          }
                        }
                      } catch (err: any) {
                        addToast("Error: " + err.message, "error");
                      } finally {
                        setTestingSheets(false);
                      }
                    }}
                    disabled={testingSheets}
                    className="btn-primary"
                    style={{ 
                      flexGrow: 1, 
                      padding: '12px', 
                      fontSize: '0.85rem', 
                      justifyContent: 'center', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      opacity: testingSheets ? 0.6 : 1,
                      cursor: testingSheets ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {testingSheets ? (
                      <>
                        <Loader2 size={16} className="spin-anim" />
                        Testing Connection...
                      </>
                    ) : (
                      'Test & Sync Sheets'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Section A-3: Scraper & AI Credentials */}
            <div id="ai-credentials" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>3. Scraper & AI Credentials</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                    Get Places API Key →
                  </a>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                    Get Gemini API Key →
                  </a>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                      Google Places API Key (Scraper) <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                      <span 
                        title="Required for live lead scraping. Ensure the 'Places API' is enabled in your Google Cloud Console." 
                        style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}
                      >
                        ?
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!config.googlePlacesApiKey) {
                          alert("Please enter a Google Places API key first.");
                          return;
                        }
                        try {
                          const res = await fetch('/api/config/test-places', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ apiKey: config.googlePlacesApiKey })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert("Connection Success: " + data.message);
                          } else {
                            alert("Connection Failed: " + data.error);
                          }
                        } catch (err: any) {
                          alert("Error testing connection: " + err.message);
                        }
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px' }}
                    >
                      Test Connection
                    </button>
                  </div>
                  <input 
                    type="password" 
                    value={config.googlePlacesApiKey} 
                    onChange={(e) => setConfig({ ...config, googlePlacesApiKey: e.target.value })}
                    placeholder="Paste Google Cloud API key(s) separated by commas"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                      Gemini AI API Key (Copywriting) <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        const keysStr = config.geminiApiKey || '';
                        if (!keysStr) {
                          alert("Please enter at least one Gemini API key first.");
                          return;
                        }
                        const firstKey = keysStr.split(',')[0].trim();
                        addToast("Testing Gemini connection...", "info");
                        try {
                          const res = await fetch('/api/config/test-antigravity', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ apiKey: firstKey, model: 'gemini-1.5-flash' })
                          });
                          const data = await res.json();
                          if (data.success) {
                            addToast(data.message, "success");
                          } else {
                            addToast("Gemini Connection Failed: " + data.error, "error");
                          }
                        } catch (err: any) {
                          addToast("Error testing connection: " + err.message, "error");
                        }
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px' }}
                    >
                      Test Connection
                    </button>
                  </div>
                  <textarea 
                    value={Array.isArray((config as any).geminiApiKeys) && (config as any).geminiApiKeys.length > 0 ? (config as any).geminiApiKeys.join(', ') : (config.geminiApiKey || '')} 
                    onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                    placeholder="Paste Gemini API Key(s) separated by commas or newlines"
                    rows={2}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                      Antigravity API Key(s) (Fallback Model Chain) <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        const keysStr = config.antigravityApiKey || '';
                        if (!keysStr) {
                          alert("Please enter at least one Antigravity API key first.");
                          return;
                        }
                        const firstKey = keysStr.split(',')[0].trim();
                        const modelsStr = config.antigravityModels || '';
                        const firstModel = Array.isArray(modelsStr) 
                          ? (modelsStr[0] || 'gemini_flash_high')
                          : (typeof modelsStr === 'string' ? (modelsStr.split(',')[0].trim() || 'gemini_flash_high') : 'gemini_flash_high');

                        addToast("Testing Antigravity connection...", "info");
                        try {
                          const res = await fetch('/api/config/test-antigravity', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ apiKey: firstKey, model: firstModel })
                          });
                          const data = await res.json();
                          if (data.success) {
                            addToast(data.message, "success");
                          } else {
                            addToast("Connection Failed: " + data.error, "error");
                          }
                        } catch (err: any) {
                          addToast("Error: " + err.message, "error");
                        }
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px' }}
                    >
                      Test Connection
                    </button>
                  </div>
                  <textarea 
                    value={Array.isArray((config as any).antigravityApiKeys) && (config as any).antigravityApiKeys.length > 0 ? (config as any).antigravityApiKeys.join(', ') : (config.antigravityApiKey || '')} 
                    onChange={(e) => setConfig({ ...config, antigravityApiKey: e.target.value })}
                    placeholder="Paste Antigravity API Key(s) separated by commas or newlines"
                    rows={2}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Antigravity Models Pool <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(separate with commas)</span>
                  </label>
                  <input 
                    type="text" 
                    value={Array.isArray(config.antigravityModels) ? config.antigravityModels.join(', ') : (config.antigravityModels || '')} 
                    onChange={(e) => {
                      const models = e.target.value.split(',').map(m => m.trim()).filter(Boolean);
                      setConfig({ ...config, antigravityModels: models });
                    }}
                    placeholder="gemini_flash_high, gemini_pro_low, gpt_oss, claude, sonneta, opus"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Remote Browser Endpoint - fixes libnss3.so error on Vercel */}
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡</span> Remote Browser Token(s) or WebSocket URL
                    </label>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                      Required to fix <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px' }}>libnss3.so</code> errors on Vercel. Connect to a hosted Chromium service like Browserless.io instead of launching a local browser.
                    </p>
                  </div>
                  <a 
                    href="https://browserless.io" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontSize: '0.72rem', color: '#0af', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '2px' }}
                  >
                    Get free token →
                  </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Active Browser Provider Selector */}
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      🌐 Active Browser Provider <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>(which provider the 10 scrapers use)</span>
                    </label>
                    <select
                      value={(config as any).activeBrowserProvider || 'local'}
                      onChange={(e) => setConfig({ ...config, activeBrowserProvider: e.target.value as any } as any)}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    >
                      <option value="local">🖥️ Local Chromium (no API key needed)</option>
                      <option value="browserless">⚡ Browserless.io (use API tokens above)</option>
                      <option value="browserbase">🌐 Browserbase.com (use API keys above)</option>
                      <option value="tor">🧅 Tor Proxy (anonymised local browser)</option>
                      <option value="rotation">🔄 Rotation (cycle all configured providers)</option>
                    </select>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Set to <strong>Browserless.io</strong> to use your API tokens. Set to <strong>Rotation</strong> to automatically cycle all providers.
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Browserless API Token(s) <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(separate with commas)</span>
                    </label>
                    <textarea 
                      value={Array.isArray((config as any).browserlessApiKeys) && (config as any).browserlessApiKeys.length > 0 ? (config as any).browserlessApiKeys.join(', ') : ((config as any).browserlessApiKey || '')} 
                      onChange={(e) => {
                        const raw = e.target.value;
                        const keys = raw.split(/[,\n]+/).map((k: string) => k.trim()).filter(Boolean);
                        setConfig({
                          ...config,
                          browserlessApiKey: raw,
                          browserlessApiKeys: keys,
                          ...(keys.length > 0 && (config as any).activeBrowserProvider !== 'rotation' ? { activeBrowserProvider: 'browserless' } : {}),
                        } as any);
                      }}
                      placeholder="Paste Browserless API token(s) (separated by commas or newlines)"
                      rows={2}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const raw = (config as any).browserlessApiKey || 
                                    (Array.isArray((config as any).browserlessApiKeys) && (config as any).browserlessApiKeys.length > 0 ? (config as any).browserlessApiKeys[0] : '');
                        if (!raw) { addToast('Enter a Browserless API token first.', 'error'); return; }
                        addToast('Testing Browserless connection...', 'info');
                        try {
                          const res = await fetch('/api/config/test-browser', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ provider: 'browserless', apiKey: raw })
                          });
                          const data = await res.json();
                          if (data.success) {
                            addToast('✅ Browserless connected successfully!', 'success');
                          } else {
                            addToast('❌ Connection failed: ' + data.error, 'error');
                          }
                        } catch (err: any) {
                          addToast('Error: ' + err.message, 'error');
                        }
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', marginTop: '8px', cursor: 'pointer' }}
                    >
                      Test Connection
                    </button>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Browserbase API Key(s) <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(separate with commas)</span>
                      </label>
                      <a
                        href="https://www.browserbase.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.72rem', color: '#0af', whiteSpace: 'nowrap', marginLeft: '12px' }}
                      >
                        Get free key →
                      </a>
                    </div>
                    <textarea 
                      value={Array.isArray((config as any).browserbaseApiKeys) && (config as any).browserbaseApiKeys.length > 0 ? (config as any).browserbaseApiKeys.join(', ') : ((config as any).browserbaseApiKey || '')} 
                      onChange={(e) => {
                        const raw = e.target.value;
                        const keys = raw.split(/[,\n]+/).map((k: string) => k.trim()).filter(Boolean);
                        setConfig({ ...config, browserbaseApiKey: raw, browserbaseApiKeys: keys } as any);
                      }}
                      placeholder="Paste Browserbase API key(s) (separated by commas or newlines)"
                      rows={2}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const raw = (config as any).browserbaseApiKey || 
                                    (Array.isArray((config as any).browserbaseApiKeys) && (config as any).browserbaseApiKeys.length > 0 ? (config as any).browserbaseApiKeys[0] : '');
                        if (!raw) { addToast('Enter a Browserbase API key first.', 'error'); return; }
                        addToast('Testing Browserbase connection...', 'info');
                        try {
                          const res = await fetch('/api/config/test-browser', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ provider: 'browserbase', apiKey: raw })
                          });
                          const data = await res.json();
                          if (data.success) {
                            addToast('✅ Browserbase connected successfully!', 'success');
                          } else {
                            addToast('❌ Connection failed: ' + data.error, 'error');
                          }
                        } catch (err: any) {
                          addToast('Error: ' + err.message, 'error');
                        }
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', marginTop: '8px', cursor: 'pointer' }}
                    >
                      Test Connection
                    </button>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Legacy WebSocket URL (or Custom Chromium API Endpoint)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={(config as any).remoteBrowserWs || ''} 
                        onChange={(e) => setConfig({ ...config, remoteBrowserWs: e.target.value } as any)}
                        placeholder="Paste full WebSocket URL (wss://...)"
                        style={{ flex: 1, padding: '11px 12px', background: 'var(--input-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem' }}
                      />
                  <button
                    type="button"
                    onClick={async () => {
                      const ws = (config as any).remoteBrowserWs;
                      if (!ws) { addToast('Enter a WebSocket URL or API token first.', 'error'); return; }
                      addToast('Testing remote browser connection...', 'info');
                      try {
                        const res = await fetch('/api/config/test-browser', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ wsUrl: ws })
                        });
                        const data = await res.json();
                        if (data.success) {
                          addToast('✅ Remote browser connected successfully!', 'success');
                        } else {
                          addToast('❌ Connection failed: ' + data.error, 'error');
                        }
                      } catch (err: any) {
                        addToast('Error: ' + err.message, 'error');
                      }
                    }}
                    className="btn-secondary"
                    style={{ padding: '11px 16px', fontSize: '0.8rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
                  >
                    Test Connection
                  </button>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Free option:</strong> Sign up at <a href="https://browserless.io" target="_blank" style={{ color: '#0af' }}>Browserless.io</a> → copy the API token from your dashboard.
                  You can paste one token, or multiple tokens separated by commas for rotation.
                </div>
              </div>

              {/* Proxy Settings & Rotation Pool */}
              <div id="proxy-settings" style={{ marginTop: '20px', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '10px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--success)', display: 'block', margin: 0 }}>
                    🌐 Dynamic Proxy Pool (IP Rotation)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a
                      href="https://www.webshare.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.72rem', color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Webshare 10 Free →
                    </a>
                    <a
                      href="https://proxyscrape.com/free-proxy-list"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.72rem', color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
                    >
                      ProxyScrape List →
                    </a>
                    <button
                      type="button"
                      onClick={verifyProxies}
                      disabled={checkingHealth}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px', marginLeft: '6px' }}
                    >
                      {checkingHealth ? 'Testing...' : 'Verify Proxies'}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                  Prevent IP-based scraper blocks by rotating through a list of proxies (e.g. brightdata, webshare, oxylabs). Paste proxies separated by commas or newlines.
                </p>
                <textarea 
                  value={config.proxyPool || ''} 
                  onChange={(e) => setConfig({ ...config, proxyPool: e.target.value })}
                  placeholder="http://username:password@proxy.example.com:8080, socks5://username:password@proxy2.example.com:1080"
                  rows={2}
                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '16px' }}>
                  If empty, falls back to the default scraper proxy or local IP. Protocol prefix is required (<code>http://</code>, <code>socks5://</code>, etc.).
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    🌐 Webshare / Custom Rotating Proxies <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(separate with commas)</span>
                  </label>
                  <textarea 
                    value={Array.isArray((config as any).webshareProxies) && (config as any).webshareProxies.length > 0 ? (config as any).webshareProxies.join(', ') : ((config as any).webshareProxies ? (config as any).webshareProxies.toString() : '')} 
                    onChange={(e) => setConfig({ ...config, webshareProxies: e.target.value } as any)}
                    placeholder="http://username:password@proxy.webshare.io:80, socks5://username:password@proxy2.webshare.io:1080"
                    rows={2}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Automatically rotates exit IP per request. Used for high-volume concurrent scraping.
                  </div>
                </div>
              </div>

            </div>

            {/* Section B: Email Provider */}
            <div id="email-settings" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>2. Email Outreach Provider</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  <ProviderCard
                    id="gmail"
                    name="Google Workspace"
                    description="Gmail OAuth (Google Workspace)"
                    selected={config.emailProvider === 'gmail'}
                    onSelect={() => setConfig({ ...config, emailProvider: 'gmail' })}
                  />
                  <ProviderCard
                    id="resend"
                    name="Resend.com"
                    description="Resend.com API"
                    selected={config.emailProvider === 'resend'}
                    onSelect={() => setConfig({ ...config, emailProvider: 'resend' })}
                  />
                  <ProviderCard
                    id="brevo"
                    name="Brevo.com"
                    description="Brevo.com SMTP API"
                    selected={config.emailProvider === 'brevo'}
                    onSelect={() => setConfig({ ...config, emailProvider: 'brevo' })}
                  />
                  <ProviderCard
                    id="smtp"
                    name="Custom SMTP"
                    description="Custom SMTP Server (Free/Generic)"
                    selected={config.emailProvider === 'smtp'}
                    onSelect={() => setConfig({ ...config, emailProvider: 'smtp' })}
                  />
                  <ProviderCard
                    id="sendgrid"
                    name="SendGrid"
                    description="SendGrid API (Free Tier)"
                    selected={config.emailProvider === 'sendgrid'}
                    onSelect={() => setConfig({ ...config, emailProvider: 'sendgrid' })}
                  />
                </div>
              </div>

              {config.emailProvider === 'gmail' && (
                <>
                  <div style={{ display: 'grid', gap: '12px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: config.googleRefreshToken ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${config.googleRefreshToken ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                      color: config.googleRefreshToken ? '#10b981' : '#ef4444',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: config.googleRefreshToken ? '#10b981' : '#ef4444',
                        boxShadow: `0 0 8px ${config.googleRefreshToken ? '#10b981' : '#ef4444'}`
                      }} />
                      {config.googleRefreshToken 
                        ? `Active: Connected as ${config.googleUserEmail || 'Google User'}` 
                        : 'Disconnected: Google Account Sign-In Required'}
                    </div>

                    {(!config.googleClientId || !config.googleClientSecret) && (
                      <span style={{ fontSize: '0.78rem', color: '#ff4757', fontWeight: 600 }}>
                        ⚠️ Please configure Google OAuth Client ID and Secret below before connecting.
                      </span>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <button
                        onClick={async () => {
                          setIsGmailConnecting(true);
                          try {
                            // Auto-save the config first
                            const resp = await fetch('/api/config', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...config,
                                googleClientId: config.googleClientId,
                                googleClientSecret: config.googleClientSecret,
                                googleProjectId: config.googleProjectId,
                              })
                            });
                            const data = await resp.json();
                            if (data && !data.error) {
                              setConfig(data.config || data);
                              addToast('Settings auto-saved! Redirecting to Google...', 'success');
                              
                              const isClasp = config.googleClientId === '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com';
                              window.location.href = `/api/auth/google${isClasp ? '?use_clasp_redirect=true' : ''}`;
                            } else {
                              addToast(data.error || 'Failed to save configuration before redirecting.', 'error');
                              setIsGmailConnecting(false);
                            }
                          } catch (e: any) {
                            addToast(e.message || 'Error occurred during auto-save.', 'error');
                            setIsGmailConnecting(false);
                          }
                        }}
                        disabled={isGmailConnecting || !config.googleClientId || !config.googleClientSecret}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: (isGmailConnecting || !config.googleClientId || !config.googleClientSecret)
                            ? 'rgba(100, 100, 100, 0.2)'
                            : 'linear-gradient(90deg, hsl(210,70%,50%), hsl(210,70%,70%))',
                          color: (isGmailConnecting || !config.googleClientId || !config.googleClientSecret) ? 'var(--text-muted)' : 'var(--text-primary)',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: (isGmailConnecting || !config.googleClientId || !config.googleClientSecret) ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isGmailConnecting ? 'Connecting…' : (config.googleRefreshToken ? 'Reconnect Google Account' : 'Sign in with Google')}
                      </button>

                      {config.googleClientId === '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com' && (
                        <div style={{ background: 'rgba(255, 165, 0, 0.05)', border: '1px dashed orange', padding: '10px', borderRadius: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#ffb936', fontWeight: 500 }}>
                            💡 Using Default clasp Credentials: After signing in, copy the resulting URL from your browser's address bar (even if it says "site can't be reached") and paste it below:
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="Paste http://localhost:9005/?code=... here"
                              id="claspCodeInput"
                              style={{ flex: 1, padding: '6px 10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                            />
                            <button
                              onClick={async () => {
                                const inputVal = (document.getElementById('claspCodeInput') as HTMLInputElement)?.value;
                                if (!inputVal) {
                                  addToast('Please paste the redirect URL or code first.', 'error');
                                  return;
                                }
                                try {
                                  let code = inputVal.trim();
                                  if (inputVal.includes('code=')) {
                                    const parsedUrl = new URL(inputVal.trim());
                                    code = parsedUrl.searchParams.get('code') || inputVal.trim();
                                  }
                                  addToast('Submitting authorization code...', 'info');
                                  const resp = await fetch(`/api/auth/callback?code=${encodeURIComponent(code)}&use_clasp_redirect=true`);
                                  const data = await resp.json();
                                  if (data && !data.error) {
                                    // Refresh configuration
                                    const configResp = await fetch('/api/config');
                                    const configData = await configResp.json();
                                    setConfig(configData.config || configData);
                                    addToast('Successfully authenticated and saved Google credentials!', 'success');
                                    if (document.getElementById('claspCodeInput')) {
                                      (document.getElementById('claspCodeInput') as HTMLInputElement).value = '';
                                    }
                                  } else {
                                    addToast(data.error || 'Authentication failed.', 'error');
                                  }
                                } catch (e: any) {
                                  addToast(e.message || 'Error occurred during token exchange.', 'error');
                                }
                              }}
                              style={{ padding: '6px 12px', background: 'orange', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Authorize the app via Google OAuth. Credentials are saved automatically.
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google OAuth Client ID</label>
                      <input 
                        type="text" 
                        value={config.googleClientId || ''} 
                        onChange={(e) => setConfig({ ...config, googleClientId: e.target.value })}
                        placeholder="Enter Google Client ID"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google OAuth Client Secret</label>
                      <input 
                        type="password" 
                        value={config.googleClientSecret || ''} 
                        onChange={(e) => setConfig({ ...config, googleClientSecret: e.target.value })}
                        placeholder="Enter Google Client Secret"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google Cloud Project ID</label>
                      <input 
                        type="text" 
                        value={config.googleProjectId || ''} 
                        onChange={(e) => setConfig({ ...config, googleProjectId: e.target.value })}
                        placeholder="e.g. leadgen-console"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {config.emailProvider === 'resend' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Resend API Key</label>
                    <input type="password" value={config.resendApiKey || ''} onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })} placeholder="re_..." style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                    <a href="https://resend.com/dashboard/api-keys" target="_blank" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Get free API key →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>From Email Address (Verified Domain)</label>
                    <input type="text" value={config.resendFromEmail || ''} onChange={(e) => setConfig({ ...config, resendFromEmail: e.target.value })} placeholder="onboarding@resend.dev or hello@yourdomain.com" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                  </div>
                </div>
              )}

              {config.emailProvider === 'brevo' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Brevo API Key (V3)</label>
                    <input type="password" value={config.brevoApiKey || ''} onChange={(e) => setConfig({ ...config, brevoApiKey: e.target.value })} placeholder="xkeysib-..." style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                    <a href="https://app.brevo.com/settings/keys" target="_blank" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Get free API key →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender Display Name</label>
                    <input type="text" value={config.brevoSenderName || ''} onChange={(e) => setConfig({ ...config, brevoSenderName: e.target.value })} placeholder="e.g. Bethelmind Analytics & Strategy Support" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender Verified Email</label>
                    <input type="text" value={config.brevoSenderEmail || ''} onChange={(e) => setConfig({ ...config, brevoSenderEmail: e.target.value })} placeholder="hello@yourdomain.com" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                  </div>
                </div>
              )}

              {config.emailProvider === 'smtp' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SMTP Host</label>
                    <input 
                      type="text" 
                      value={config.smtpHost || ''} 
                      onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                      placeholder="e.g. smtp.mailtrap.io or smtp.gmail.com"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SMTP Port</label>
                    <input 
                      type="number" 
                      value={config.smtpPort || 587} 
                      onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                      placeholder="e.g. 587 or 465"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SMTP Username / Email</label>
                    <input 
                      type="text" 
                      value={config.smtpUser || ''} 
                      onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                      placeholder="user@domain.com"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SMTP Password</label>
                    <input 
                      type="password" 
                      value={config.smtpPass || ''} 
                      onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                      placeholder="SMTP Password"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>From Email Address</label>
                    <input 
                      type="text" 
                      value={config.smtpFrom || ''} 
                      onChange={(e) => setConfig({ ...config, smtpFrom: e.target.value })}
                      placeholder="sender@domain.com"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender Display Name</label>
                    <input 
                      type="text" 
                      value={config.smtpSenderName || ''} 
                      onChange={(e) => setConfig({ ...config, smtpSenderName: e.target.value })}
                      placeholder="e.g. Bethelmind Analytics & Strategy Marketing"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <input 
                        type="checkbox" 
                        checked={config.smtpSecure || false} 
                        onChange={(e) => setConfig({ ...config, smtpSecure: e.target.checked })}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>Use Secure SSL/TLS (Check if using port 465)</span>
                    </label>
                  </div>
                </div>
              )}

              {config.emailProvider === 'sendgrid' && (
                <div style={{ background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>SendGrid API Key</label>
                    <input type="password" value={config.sendgridApiKey || ''} onChange={(e) => setConfig({ ...config, sendgridApiKey: e.target.value })} placeholder="SG.xxxxx" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                    <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Get free API key →</a>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>From Email (Verified)</label>
                    <input type="text" value={config.sendgridFromEmail || ''} onChange={(e) => setConfig({ ...config, sendgridFromEmail: e.target.value })} placeholder="verified@yourdomain.com" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Sender Display Name</label>
                    <input type="text" value={config.sendgridSenderName || ''} onChange={(e) => setConfig({ ...config, sendgridSenderName: e.target.value })} placeholder="e.g. Bethelmind Analytics & Strategy Outreach" style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Section C: WhatsApp Provider */}
            <div id="whatsapp-settings" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>3. WhatsApp Outreach Provider</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={config.whatsappEnabled || false} 
                      onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Enable WhatsApp sending endpoint</span>
                  </label>
                </div>
                <select 
                  value={config.whatsappProvider || 'cloud'} 
                  onChange={(e) => setConfig({ ...config, whatsappProvider: e.target.value as any })}
                  style={{ padding: '8px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
                >
                  <option value="cloud">Meta Business WhatsApp API</option>
                  <option value="evolution">Evolution API (QR Code / Baileys)</option>
                  <option value="whapi">Whapi.cloud API (QR Code / Web)</option>
                  <option value="baileys">Custom Baileys Service (Free / QR Code)</option>
                </select>
              </div>

              {config.whatsappProvider === 'cloud' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(6, 182, 212, 0.04)', border: '1px dashed rgba(6, 182, 212, 0.3)', borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Meta Auto-Link Helper</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Automate retrieval of Phone Number ID & Token using a headed browser.</span>
                      </div>
                      {!metaConnecting ? (
                        <button
                          type="button"
                          onClick={startMetaConnection}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #1877F2 0%, #06B6D4 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 16px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.25)',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                        >
                          <span>⚡ Auto-Link Facebook Account</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopMetaConnection}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#EF4444',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 16px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                        >
                          <span>🛑 Cancel/Stop Browser</span>
                        </button>
                      )}
                    </div>
                    {metaStatus && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.75rem'
                      }}>
                        {metaConnecting && (
                          <>
                            <style dangerouslySetInnerHTML={{__html: `
                              @keyframes pulse {
                                0%, 100% { opacity: 1; transform: scale(1); }
                                50% { opacity: 0.4; transform: scale(1.2); }
                              }
                            `}} />
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#06B6D4',
                              display: 'inline-block',
                              animation: 'pulse 1.5s infinite'
                            }} />
                          </>
                        )}
                        <span style={{ color: metaStatus.includes('Error') ? '#EF4444' : metaStatus.includes('Success') ? '#10B981' : '#06B6D4', fontWeight: 550 }}>
                          {metaStatus}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Phone Number ID</label>
                    <input 
                      type="text" 
                      value={config.whatsappPhoneNumberId || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                      placeholder="Enter Phone Number ID"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Get Meta Developer Credentials →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>System Access Token</label>
                    <input 
                      type="password" 
                      value={config.whatsappAccessToken || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappAccessToken: e.target.value })}
                      placeholder="EAAB..."
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Template Name</label>
                    <input 
                      type="text" 
                      value={config.whatsappTemplateName || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappTemplateName: e.target.value })}
                      placeholder="e.g. lead_outreach_1"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Template Language Code</label>
                    <input 
                      type="text" 
                      value={config.whatsappTemplateLanguageCode || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappTemplateLanguageCode: e.target.value })}
                      placeholder="e.g. en_US"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.whatsappProvider === 'evolution' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Evolution API Base URL</label>
                    <input 
                      type="text" 
                      value={config.evolutionApiUrl || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionApiUrl: e.target.value })}
                      placeholder="https://api.myserver.com"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <a href="https://evolution-api.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Setup Evolution API →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Instance apikey</label>
                    <input 
                      type="password" 
                      value={config.evolutionApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionApiKey: e.target.value })}
                      placeholder="apikey token"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Instance Name</label>
                    <input 
                      type="text" 
                      value={config.evolutionInstanceName || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionInstanceName: e.target.value })}
                      placeholder="e.g. MyPersonalPhone"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.whatsappProvider === 'whapi' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Whapi Token</label>
                    <input 
                      type="password" 
                      value={config.whapiToken || ''} 
                      onChange={(e) => setConfig({ ...config, whapiToken: e.target.value })}
                      placeholder="Whapi.cloud bearer token"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <a href="https://whapi.cloud" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Get Whapi.cloud Token →</a>
                  </div>
                </div>
              )}

              {config.whatsappProvider === 'baileys' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Baileys Local API URL</label>
                    <input 
                      type="text" 
                      value={config.whatsappBaileysUrl || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappBaileysUrl: e.target.value })}
                      placeholder="http://localhost:3007"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  
                  <BaileysPairingPanel baseUrl={config.whatsappBaileysUrl || 'http://localhost:3007'} />
                </div>
              )}

              {/* Text Message Template input for Evolution/Whapi/Baileys */}
              {(config.whatsappProvider === 'evolution' || config.whatsappProvider === 'whapi' || config.whatsappProvider === 'baileys') && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Text Message Template</label>
                  <textarea 
                    value={config.whatsappMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, whatsappMessageTemplate: e.target.value })}
                    placeholder={`Hi {{lead.name}},\n\nWe generated a custom landing page for your business. Check it out: {{previewUrl}}\n\nBest, {{businessSignature}}`}
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div>Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{businessSignature}}`}</code></div>
                    <div style={{ color: '#06B6D4' }}>✨ Anti-Ban Spintax enabled: Use <code>{`{Hello|Hi|Hey}`}</code> syntax to randomize message variations.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Section D: Twilio Calls (Optional) */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>4. Twilio Voice Cold Calling (Optional)</h4>
                <a href="https://twilio.com/console" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                  Twilio Console →
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Twilio Account SID <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                  </label>
                  <input 
                    type="text" 
                    value={config.twilioAccountSid || ''} 
                    onChange={(e) => setConfig({ ...config, twilioAccountSid: e.target.value })}
                    placeholder="AC..., AC..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Twilio Auth Token <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                  </label>
                  <input 
                    type="password" 
                    value={config.twilioAuthToken || ''} 
                    onChange={(e) => setConfig({ ...config, twilioAuthToken: e.target.value })}
                    placeholder="Auth Token(s) separated by commas"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Twilio From Phone Number <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                  </label>
                  <input 
                    type="text" 
                    value={config.twilioFromNumber || ''} 
                    onChange={(e) => setConfig({ ...config, twilioFromNumber: e.target.value })}
                    placeholder="+1234567890, +1987654321"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Twilio Call Message Template</label>
                  <textarea 
                    value={config.twilioCallMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, twilioCallMessageTemplate: e.target.value })}
                    placeholder="Hello, this is a call from Bethelmind Analytics & Strategy to let you know we custom designed a web page for your business..."
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Section E: SMS Outreach (Low Cost / Free) */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>4.5. Bulk SMS Outreach Settings</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Choose a free Android Carrier Gateway or low-cost African direct providers.</p>
                </div>
                <select 
                  value={config.smsProvider || 'gateway'} 
                  onChange={(e) => setConfig({ ...config, smsProvider: e.target.value as any })}
                  style={{ padding: '8px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
                >
                  <option value="gateway">Android Gateway (Free ₦0.00)</option>
                  <option value="termii">Termii SMS (Nigeria ₦2.00 - ₦4.50)</option>
                  <option value="africastalking">Africa's Talking (Africa ₦2.50 - ₦5.00)</option>
                  <option value="twilio">Twilio SMS ($0.05 - $0.10)</option>
                </select>
              </div>

              {config.smsProvider === 'gateway' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Android SMS Gateway IP / URL</label>
                    <input 
                      type="url" 
                      value={config.smsGatewayUrl || ''} 
                      onChange={(e) => setConfig({ ...config, smsGatewayUrl: e.target.value })}
                      placeholder="e.g. http://192.168.1.5:8080/send or https://my-ngrok-tunnel.ngrok-free.app/send"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Install any free SMS Gateway app on an Android phone, keep it connected to the internet/WiFi, and paste the endpoint URL here.
                    </div>
                  </div>
                </div>
              )}

              {config.smsProvider === 'termii' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Termii API Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <input 
                      type="password" 
                      value={config.termiiApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, termiiApiKey: e.target.value })}
                      placeholder="Enter Termii API Key"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <a href="https://termii.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Sign up on Termii →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender ID / Signature</label>
                    <input 
                      type="text" 
                      value={config.termiiSenderId || ''} 
                      onChange={(e) => setConfig({ ...config, termiiSenderId: e.target.value })}
                      placeholder="e.g. Sandbox or registered Sender ID"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.smsProvider === 'africastalking' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Username</label>
                    <input 
                      type="text" 
                      value={config.africastalkingUsername || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingUsername: e.target.value })}
                      placeholder="e.g. sandbox or production username"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      API Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <input 
                      type="password" 
                      value={config.africastalkingApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingApiKey: e.target.value })}
                      placeholder="Enter Africa's Talking API Key"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <a href="https://africastalking.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af', marginTop: '4px', display: 'inline-block' }}>Sign up on Africa's Talking →</a>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender ID / Shortcode (Optional)</label>
                    <input 
                      type="text" 
                      value={config.africastalkingSenderId || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingSenderId: e.target.value })}
                      placeholder="e.g. brand name or shortcode"
                      style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.smsProvider === 'twilio' && (
                <div style={{ background: 'var(--input-bg-lighter)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Uses credentials from section <strong>4. Twilio Voice Cold Calling</strong> (SID, Auth Token, and From Phone Number) for sending text messages.
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Default SMS Message Template</label>
                <textarea 
                  value={config.smsMessageTemplate || ''} 
                  onChange={(e) => setConfig({ ...config, smsMessageTemplate: e.target.value })}
                  placeholder="Hello {{lead.name}}, please review the custom landing page designed for your business: {{previewUrl}} - {{signature}}"
                  rows={3}
                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                </div>
              </div>

              {/* Test SMS Provider Connection */}
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '10px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
                  ⚡ Test SMS Configuration
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                  Verify that your {config.smsProvider === 'gateway' ? 'Android SMS Gateway' : config.smsProvider === 'termii' ? 'Termii API' : config.smsProvider === 'africastalking' ? "Africa's Talking API" : 'Twilio API'} works by sending a test text message.
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="tel" 
                    value={testSmsNumber} 
                    onChange={(e) => setTestSmsNumber(e.target.value)}
                    placeholder="Enter phone number (e.g. +2348031234567)"
                    style={{ flex: 1, padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleSendTestSms}
                    disabled={testingSms}
                    style={{ 
                      padding: '10px 16px', 
                      fontSize: '0.8rem', 
                      borderRadius: '8px', 
                      whiteSpace: 'nowrap', 
                      background: 'linear-gradient(90deg, var(--primary), #0891b2)', 
                      color: '#fff', 
                      border: 'none', 
                      cursor: 'pointer',
                      opacity: testingSms ? 0.6 : 1,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                    }}
                  >
                    {testingSms ? 'Sending...' : 'Send Test SMS'}
                  </button>
                </div>
              </div>
            </div>

            {/* Section E: Supabase DB Store (Optional) */}
            {config.storageMode === 'supabase' && (
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>5. Supabase Configuration</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Supabase URL</label>
                    <input 
                      type="text" 
                      value={config.supabaseUrl || ''} 
                      onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
                      placeholder="https://yourproject.supabase.co"
                      style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Supabase Service Key</label>
                    <input 
                      type="password" 
                      value={config.supabaseKey || ''} 
                      onChange={(e) => setConfig({ ...config, supabaseKey: e.target.value })}
                      placeholder="Service role key for server bypass"
                      style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section F: n8n Integration */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>5. n8n Automation Webhook</h4>
                <a href="https://n8n.io" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                  n8n Cloud Console →
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Global n8n Webhook URL</label>
                  <input 
                    type="url" 
                    value={config.n8nWebhookUrl || ''} 
                    onChange={(e) => setConfig({ ...config, n8nWebhookUrl: e.target.value })}
                    placeholder="https://primary-n8n.yourdomain.com/webhook/..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Websites configured in "Direct n8n automation webhook redirection" turnout mode will post client contact submissions here.
                  </div>
                </div>
              </div>
            </div>

            {/* Section G: Jiji Bulk Messaging Outreach */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>6. Jiji Bulk Messaging Outreach</h4>
                <a href="https://jiji.ng/login.html" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'underline', fontWeight: 500 }}>
                  🔑 Open Jiji Login / Sign-up →
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Email or Phone</label>
                  <input 
                    type="text" 
                    value={config.jijiEmail || ''} 
                    onChange={(e) => setConfig({ ...config, jijiEmail: e.target.value })}
                    placeholder="e.g. jijiuser@email.com or +234..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Password</label>
                  <input 
                    type="password" 
                    value={config.jijiPassword || ''} 
                    onChange={(e) => setConfig({ ...config, jijiPassword: e.target.value })}
                    placeholder="Jiji Password"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.05)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 600 }}>
                    <span>ℹ️ Account Isolation Recommended</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    To protect your main account from potential anti-spam restrictions, we highly recommend using a separate/secondary account. 
                    <a href="https://jiji.ng/login.html" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', marginLeft: '6px', fontWeight: 600, textDecoration: 'underline' }}>
                      Click here to Register or Log In on Jiji Nigeria.
                    </a>
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Message Template</label>
                  <textarea 
                    value={config.jijiMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, jijiMessageTemplate: e.target.value })}
                    placeholder="Hello {{lead.name}}, I saw your Jiji listing and built a preview site for you: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Instagram Message Template</label>
                  <textarea 
                    value={config.instagramMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, instagramMessageTemplate: e.target.value })}
                    placeholder="Hi {{lead.name}}, I found your e-commerce store on Instagram and built a preview website: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Facebook Message Template</label>
                  <textarea 
                    value={config.facebookMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, facebookMessageTemplate: e.target.value })}
                    placeholder="Hello {{lead.name}}, I saw your shop page on Facebook and made a personalized web storefront preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TikTok Message Template</label>
                  <textarea 
                    value={config.tiktokMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, tiktokMessageTemplate: e.target.value })}
                    placeholder="Hey {{lead.name}}, I checked out your shop videos on TikTok and created a custom web store preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>LinkedIn Message Template</label>
                  <textarea 
                    value={config.linkedinMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, linkedinMessageTemplate: e.target.value })}
                    placeholder="Hi {{lead.name}}, I noticed your professional profile on LinkedIn and created a custom web store preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Section H: Claiming & Payments (Paystack / Moniepoint) */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>7. Client Claiming & Payments (Paystack / Moniepoint / OPay)</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="https://paystack.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                    Paystack Dashboard →
                  </a>
                  <a href="https://moniepoint.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                    Moniepoint Dashboard →
                  </a>
                  <a href="https://opayweb.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0af' }}>
                    OPay Business →
                  </a>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Paystack Public Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                  </label>
                  <input 
                    type="text" 
                    value={config.paystackPublicKey || ''} 
                    onChange={(e) => setConfig({ ...config, paystackPublicKey: e.target.value })}
                    placeholder="pk_test_... or pk_live_..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Paystack Secret Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                  </label>
                  <input 
                    type="password" 
                    value={config.paystackSecretKey || ''} 
                    onChange={(e) => setConfig({ ...config, paystackSecretKey: e.target.value })}
                    placeholder="sk_test_... or sk_live_..."
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Claim Fee (NGN)</label>
                  <input 
                    type="number" 
                    value={config.claimFeeNGN || 0} 
                    onChange={(e) => setConfig({ ...config, claimFeeNGN: Number(e.target.value) })}
                    placeholder="e.g. 50000"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Set to 0 or leave empty to disable online payment.
                  </div>
                </div>
                
                {/* Moniepoint Settings */}
                <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }}></div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Moniepoint Bank Name</label>
                  <input 
                    type="text" 
                    value={config.moniepointBankName || ''} 
                    onChange={(e) => setConfig({ ...config, moniepointBankName: e.target.value })}
                    placeholder="e.g. Moniepoint Microfinance Bank"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Moniepoint Account Number</label>
                  <input 
                    type="text" 
                    value={config.moniepointAccountNumber || ''} 
                    onChange={(e) => setConfig({ ...config, moniepointAccountNumber: e.target.value })}
                    placeholder="e.g. 509... (10 digits)"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Moniepoint Account Name</label>
                  <input 
                    type="text" 
                    value={config.moniepointAccountName || ''} 
                    onChange={(e) => setConfig({ ...config, moniepointAccountName: e.target.value })}
                    placeholder="e.g. Bethelmind Analytics & Strategy Ventures"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Moniepoint Secret Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <a href="https://moniepoint.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: '#0af' }}>
                      Get Moniepoint API Keys →
                    </a>
                  </div>
                  <input 
                    type="password" 
                    value={(config as any).moniepointSecretKey || ''} 
                    onChange={(e) => setConfig({ ...config, moniepointSecretKey: e.target.value } as any)}
                    placeholder="Paste Moniepoint Secret Key(s) separated by commas"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                {/* OPay Settings */}
                <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }}></div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>OPay Bank Name</label>
                  <input 
                    type="text" 
                    value={config.opayBankName || ''} 
                    onChange={(e) => setConfig({ ...config, opayBankName: e.target.value })}
                    placeholder="e.g. OPay Digital Services (Merchant)"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>OPay Account Number</label>
                  <input 
                    type="text" 
                    value={config.opayAccountNumber || ''} 
                    onChange={(e) => setConfig({ ...config, opayAccountNumber: e.target.value })}
                    placeholder="e.g. 706... (10 digits)"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>OPay Account Name</label>
                  <input 
                    type="text" 
                    value={config.opayAccountName || ''} 
                    onChange={(e) => setConfig({ ...config, opayAccountName: e.target.value })}
                    placeholder="e.g. Bethelmind Analytics & Strategy Ventures (OPay)"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      OPay Secret Key <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Supports rotation: separate with commas)</span>
                    </label>
                    <a href="https://opayweb.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: '#0af' }}>
                      Get OPay Secret Keys →
                    </a>
                  </div>
                  <input 
                    type="password" 
                    value={(config as any).opaySecretKey || ''} 
                    onChange={(e) => setConfig({ ...config, opaySecretKey: e.target.value } as any)}
                    placeholder="Paste OPay Secret Key(s) separated by commas"
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Outreach Channel Connectivity Health Diagnostics Panel */}
            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📶</span> Outreach Channel Connectivity & API Health Diagnostics
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: '4px 0 0 0' }}>
                    Verify channel status, proxy server blocks, and credential validity across the outreach cascade.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runDiagnostics}
                  disabled={checkingHealth}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {checkingHealth ? (
                    <>
                      <Loader2 size={12} className="spin-anim" /> Testing Channels...
                    </>
                  ) : (
                    'Run Connectivity Test'
                  )}
                </button>
              </div>

              {healthStatus ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {/* WhatsApp Health Card */}
                    {(() => {
                      const waStatus = healthStatus.whatsapp?.status;
                      const isUnconfigured = waStatus === 'unconfigured';
                      const isHealthy = waStatus === 'healthy' || healthStatus.whatsapp?.connected;
                      const cardBg = isHealthy ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';
                      const cardBorder = isHealthy ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)';
                      const textCol = isHealthy ? 'var(--success)' : 'var(--error)';
                      const statusLabel = isHealthy ? 'CONNECTED' : isUnconfigured ? 'UNCONFIGURED' : 'DISCONNECTED';
                      
                      return (
                        <div style={{
                          padding: '12px 16px',
                          background: cardBg,
                          border: cardBorder,
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>WhatsApp (Baileys)</span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: textCol
                              }}>
                                {statusLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {healthStatus.whatsapp?.details || 'No session active'}
                            </div>
                          </div>
                          {!isHealthy && (
                            <button 
                              type="button" 
                              onClick={() => scrollToSectionAndFocus('whatsapp-settings', 'select')}
                              style={{
                                marginTop: '10px',
                                padding: '4px 8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '4px',
                                color: '#fca5a5',
                                fontSize: '0.65rem',
                                cursor: 'pointer',
                                width: 'fit-content',
                                fontWeight: 600
                              }}
                            >
                              🔧 Re-pair WhatsApp
                            </button>
                          )}
                        </div>
                      );
                    })()}

                    {/* SMS Health Card */}
                    {(() => {
                      const smsStatus = healthStatus.sms?.status;
                      const isUnconfigured = smsStatus === 'unconfigured';
                      const isHealthy = smsStatus === 'ready';
                      const cardBg = isHealthy ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';
                      const cardBorder = isHealthy ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)';
                      const textCol = isHealthy ? 'var(--success)' : 'var(--error)';
                      const statusLabel = isHealthy ? 'READY' : isUnconfigured ? 'UNCONFIGURED' : 'OFFLINE';
                      
                      return (
                        <div style={{
                          padding: '12px 16px',
                          background: cardBg,
                          border: cardBorder,
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>SMS Gateway</span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: textCol
                              }}>
                                {statusLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {healthStatus.sms?.details || 'API Key missing/invalid'}
                            </div>
                          </div>
                          {!isHealthy && (
                            <button 
                              type="button" 
                              onClick={() => scrollToSectionAndFocus('sms-settings', 'select')}
                              style={{
                                marginTop: '10px',
                                padding: '4px 8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '4px',
                                color: '#fca5a5',
                                fontSize: '0.65rem',
                                cursor: 'pointer',
                                width: 'fit-content',
                                fontWeight: 600
                              }}
                            >
                              🔧 Configure SMS
                            </button>
                          )}
                        </div>
                      );
                    })()}

                    {/* Email Health Card */}
                    {(() => {
                      const emailStatus = healthStatus.email?.status;
                      const isUnconfigured = emailStatus === 'unconfigured';
                      const isHealthy = emailStatus === 'ready';
                      const cardBg = isHealthy ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';
                      const cardBorder = isHealthy ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)';
                      const textCol = isHealthy ? 'var(--success)' : 'var(--error)';
                      const statusLabel = isHealthy ? 'READY' : isUnconfigured ? 'UNCONFIGURED' : 'OFFLINE';
                      
                      return (
                        <div style={{
                          padding: '12px 16px',
                          background: cardBg,
                          border: cardBorder,
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Email ({config.emailProvider || 'gmail'})</span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: textCol
                              }}>
                                {statusLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {healthStatus.email?.details || 'SMTP credentials missing'}
                            </div>
                          </div>
                          {!isHealthy && (
                            <button 
                              type="button" 
                              onClick={() => scrollToSectionAndFocus('email-settings', 'select')}
                              style={{
                                marginTop: '10px',
                                padding: '4px 8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '4px',
                                color: '#fca5a5',
                                fontSize: '0.65rem',
                                cursor: 'pointer',
                                width: 'fit-content',
                                fontWeight: 600
                              }}
                            >
                              🔧 Update Credentials
                            </button>
                          )}
                        </div>
                      );
                    })()}

                    {/* Scraper IP & Proxies Card */}
                    {(() => {
                      const scraperStatus = healthStatus.scraper?.status;
                      const isUnhealthy = scraperStatus === 'unhealthy';
                      const isWarning = scraperStatus === 'warning';
                      const isOk = scraperStatus === 'ok';
                      
                      const cardBg = isOk 
                        ? 'rgba(16, 185, 129, 0.05)' 
                        : isWarning 
                        ? 'rgba(245, 158, 11, 0.05)' 
                        : 'rgba(239, 68, 68, 0.05)';
                      const cardBorder = isOk 
                        ? '1px solid rgba(16, 185, 129, 0.15)' 
                        : isWarning 
                        ? '1px solid rgba(245, 158, 11, 0.15)' 
                        : '1px solid rgba(239, 68, 68, 0.15)';
                      const textCol = isOk 
                        ? 'var(--success)' 
                        : isWarning 
                        ? '#f59e0b' 
                        : 'var(--error)';
                      const statusLabel = isOk 
                        ? 'ACTIVE' 
                        : isWarning 
                        ? 'WARNING' 
                        : 'UNHEALTHY';
                      
                      return (
                        <div style={{
                          padding: '12px 16px',
                          background: cardBg,
                          border: cardBorder,
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Scraper IP / Proxy</span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: textCol
                              }}>
                                {statusLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              IP: {healthStatus.scraper?.ip || 'Unknown'} | {healthStatus.scraper?.details || 'No proxies configured'}
                            </div>
                          </div>
                          {!isOk && (
                            <button 
                              type="button" 
                              onClick={() => scrollToSectionAndFocus('proxy-settings', 'textarea')}
                              style={{
                                marginTop: '10px',
                                padding: '4px 8px',
                                background: isWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: isWarning ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '4px',
                                color: isWarning ? '#fde047' : '#fca5a5',
                                fontSize: '0.65rem',
                                cursor: 'pointer',
                                width: 'fit-content',
                                fontWeight: 600
                              }}
                            >
                              🔧 Configure Proxies
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Tested Proxies verification status panel */}
                  {healthStatus.scraper?.proxies && healthStatus.scraper.proxies.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      padding: '12px 16px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>🌐 Proxy Pool Verification Status</span>
                          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                            {healthStatus.scraper.proxies.filter((p: any) => p.status === 'online').length} / {healthStatus.scraper.proxies.length} Online
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {healthStatus.scraper.proxies.map((proxy: any, pIdx: number) => {
                          let displayName = proxy.url;
                          try {
                            const urlObj = new URL(proxy.url.trim().includes('://') ? proxy.url.trim() : 'http://' + proxy.url.trim());
                            displayName = `${urlObj.protocol}//${urlObj.username ? '***:***@' : ''}${urlObj.host}`;
                          } catch (e) {}

                          return (
                            <div key={pIdx} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 10px',
                              background: proxy.status === 'online' ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)',
                              border: proxy.status === 'online' ? '1px solid rgba(16, 185, 129, 0.05)' : '1px solid rgba(239, 68, 68, 0.05)',
                              borderRadius: '6px',
                              fontSize: '0.72rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                <div style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: proxy.status === 'online' ? 'var(--success)' : 'var(--error)'
                                }} />
                                <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={proxy.url}>
                                  {displayName}
                                </span>
                                {proxy.latency > 0 && (
                                  <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 500 }}>
                                    ({proxy.latency}ms)
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {proxy.status === 'offline' && (
                                  <span style={{ fontSize: '0.68rem', color: '#f87171' }} title={proxy.error}>
                                    {proxy.error || 'Failed'}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => quickRemoveProxy(proxy.url)}
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--error)',
                                    cursor: 'pointer',
                                    fontSize: '0.68rem',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                  No diagnostics data available. Run connectivity test to verify channel integration status.
                </div>
              )}
            </div>

            {/* Safety & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={config.dryRun} 
                  onChange={(e) => setConfig({ ...config, dryRun: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 500 }}>Enable Dry Run Simulation Mode (Do not send real APIs)</span>
              </label>

              <button 
                type="submit" 
                disabled={savingConfigState}
                className="btn-primary" 
                style={{ 
                  padding: '12px 24px', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: savingConfigState ? 0.6 : 1,
                  cursor: savingConfigState ? 'not-allowed' : 'pointer'
                }}
              >
                {savingConfigState ? (
                  <>
                    <Loader2 size={16} className="spin-anim" />
                    Saving Settings...
                  </>
                ) : (
                  'Save Configuration Settings'
                )}
              </button>
            </div>
          </form>
        )}

      </main>

      {/* Floating Action Bar */}
      {selectedLeads.size > 0 && !outreachProgress.active && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '16px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 40px rgba(6, 182, 212, 0.15)',
          zIndex: 1000
        }}>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></span>
            <strong>{selectedLeads.size}</strong> leads selected
          </div>
          
          <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          
          <button
            onClick={runOutreach}
            disabled={sendingOutreach}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)'
            }}
          >
            {sendingOutreach ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 className="spin-anim" size={14} /> Processing...
              </span>
            ) : (
              `Send Proposal`
            )}
          </button>

          <button
            onClick={() => setSelectedLeads(new Set())}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Outreach Progress Modal */}
      {outreachProgress.active && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel" style={{
            width: '600px',
            maxWidth: '95%',
            padding: '30px',
            borderRadius: '16px',
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Outreach Campaign Status
            </h3>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {outreachProgress.statusText}
            </div>

            {/* Progress bar container */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${(outreachProgress.current / outreachProgress.total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, #a855f7 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s ease-in-out'
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {outreachProgress.current} / {outreachProgress.total}
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Successes</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>
                  {outreachProgress.successes}
                </div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--error)' }}>Failures</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--error)' }}>
                  {outreachProgress.failures}
                </div>
              </div>
            </div>

            {/* Real-time Diagnostics Log */}
            {outreachLogs.length > 0 && (
              <div style={{
                textAlign: 'left',
                marginTop: '10px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '15px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Fallback Routing Diagnostics Log
                </div>
                <div style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  lineHeight: '1.4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  color: 'var(--text-secondary)'
                }}>
                  {outreachLogs.map((item, idx) => (
                    <div key={idx} style={{
                      paddingBottom: idx === outreachLogs.length - 1 ? '0' : '10px',
                      borderBottom: idx === outreachLogs.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.leadName}</span>
                        <span style={{
                          color: item.finalStatus === 'ERROR' ? 'var(--error)' : 'var(--success)',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {item.finalStatus}
                        </span>
                      </div>

                      {/* Channel cascade results badges */}
                      {item.channelResults && item.channelResults.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '2px 0' }}>
                          {item.channelResults.map((cRes: any, cIdx: number) => {
                            let badgeColor = 'var(--text-muted)';
                            let badgeBg = 'rgba(255,255,255,0.05)';
                            let labelText = cRes.channel.toUpperCase();
                            
                            if (cRes.status === 'success') {
                              badgeColor = 'var(--success)';
                              badgeBg = 'rgba(16, 185, 129, 0.1)';
                              labelText += ' (Sent)';
                            } else if (cRes.status === 'skipped') {
                              badgeColor = '#f59e0b';
                              badgeBg = 'rgba(245, 158, 11, 0.1)';
                              labelText += ' (Bypassed)';
                            } else if (cRes.status === 'failed') {
                              badgeColor = 'var(--error)';
                              badgeBg = 'rgba(239, 68, 68, 0.1)';
                              labelText += ' (Failed)';
                            }
                            
                            return (
                              <div 
                                key={cIdx} 
                                style={{ 
                                  fontSize: '0.62rem', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px', 
                                  color: badgeColor, 
                                  background: badgeBg, 
                                  border: `1px solid ${badgeColor}20`,
                                  fontWeight: 500
                                }} 
                                title={cRes.error || cRes.fixAction || ''}
                              >
                                {labelText}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px' }}>
                        {item.logs.map((logStr, lIdx) => (
                          <div key={lIdx} style={{
                            color: logStr.includes('Failed') || logStr.includes('Failure') || logStr.includes('Error') || logStr.includes('skipped') || logStr.includes('Skipped')
                              ? '#f87171'
                              : logStr.includes('succeeded') || logStr.includes('sent') || logStr.includes('Simulated') || logStr.includes('CONTACTED')
                                ? '#34d399'
                                : 'var(--text-muted)'
                          }}>
                            • {logStr}
                          </div>
                        ))}
                      </div>

                      {/* Recommend Fix Banner */}
                      {item.channelResults?.some((c: any) => c.status === 'failed' && c.fixAction) && (
                        <div style={{
                          marginTop: '4px',
                          padding: '8px',
                          background: 'rgba(239, 68, 68, 0.05)',
                          borderLeft: '3px solid var(--error)',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          {(() => {
                            const failedCh = item.channelResults.find((c: any) => c.status === 'failed' && c.fixAction);
                            let buttonText = 'Resolve Settings';
                            let onClickAction = () => {};

                            if (failedCh) {
                              const errLower = (failedCh.error || '').toLowerCase();
                              const fixLower = (failedCh.fixAction || '').toLowerCase();
                              
                              if (failedCh.channel === 'whatsapp' && (errLower.includes('session') || errLower.includes('disconnect') || errLower.includes('expired') || errLower.includes('logout') || errLower.includes('logged out'))) {
                                buttonText = '🔧 Re-pair WhatsApp';
                                onClickAction = () => {
                                  setOutreachProgress(prev => ({ ...prev, active: false }));
                                  scrollToSectionAndFocus('whatsapp-settings', 'select');
                                };
                              } else if (failedCh.channel === 'email' && (errLower.includes('credentials') || errLower.includes('auth') || errLower.includes('unauthorized') || errLower.includes('key'))) {
                                buttonText = '🔧 Update Email Settings';
                                onClickAction = () => {
                                  setOutreachProgress(prev => ({ ...prev, active: false }));
                                  scrollToSectionAndFocus('email-settings', 'select');
                                };
                              } else if (fixLower.includes('proxy') || failedCh.errorCategory === 'IP_BLOCKED' || errLower.includes('proxy') || errLower.includes('tunnel') || errLower.includes('ip blocked') || errLower.includes('rate-limit') || errLower.includes('429')) {
                                buttonText = '🔧 Configure Proxies';
                                onClickAction = () => {
                                  setOutreachProgress(prev => ({ ...prev, active: false }));
                                  scrollToSectionAndFocus('proxy-settings', 'textarea');
                                };
                              } else {
                                if (failedCh.channel === 'whatsapp') {
                                  buttonText = '🔧 Configure WhatsApp';
                                  onClickAction = () => {
                                    setOutreachProgress(prev => ({ ...prev, active: false }));
                                    scrollToSectionAndFocus('whatsapp-settings', 'select');
                                  };
                                } else if (failedCh.channel === 'sms') {
                                  buttonText = '🔧 Configure SMS';
                                  onClickAction = () => {
                                    setOutreachProgress(prev => ({ ...prev, active: false }));
                                    scrollToSectionAndFocus('sms-settings', 'select');
                                  };
                                } else if (failedCh.channel === 'email') {
                                  buttonText = '🔧 Configure Email';
                                  onClickAction = () => {
                                    setOutreachProgress(prev => ({ ...prev, active: false }));
                                    scrollToSectionAndFocus('email-settings', 'select');
                                  };
                                } else {
                                  buttonText = '🔧 Resolve Settings';
                                  onClickAction = () => {
                                    setOutreachProgress(prev => ({ ...prev, active: false }));
                                    const configTab = document.getElementById('tab-settings');
                                    if (configTab) configTab.click();
                                  };
                                }
                              }
                            }

                            return (
                              <>
                                <div style={{ minWidth: 0 }}>
                                  <span style={{ fontWeight: 600, color: 'var(--error)' }}>Recommended Action: </span>
                                  <span>{failedCh ? failedCh.fixAction : ''}</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={onClickAction}
                                  style={{ 
                                    padding: '2px 8px', 
                                    background: 'rgba(239, 68, 68, 0.15)', 
                                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                                    borderRadius: '4px', 
                                    color: '#fca5a5', 
                                    cursor: 'pointer', 
                                    fontSize: '0.65rem',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600
                                  }}
                                >
                                  {buttonText}
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!sendingOutreach && (
              <button
                type="button"
                onClick={() => setOutreachProgress(prev => ({ ...prev, active: false }))}
                className="btn-secondary"
                style={{
                  marginTop: '10px',
                  padding: '10px 16px',
                  width: '100%',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Close Progress Panel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      {showOnboarding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '600px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            maxHeight: '95vh',
            overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                Bethelmind Analytics & Strategy Quick Setup Wizard
              </h3>
              <button 
                onClick={() => {
                  localStorage.setItem("onboarding_complete", "true");
                  setShowOnboarding(false);
                  addToast('Onboarding skipped. You can configure settings later.', 'info');
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Step {onboardingStep} of 5</span>
                <span>{Math.round((onboardingStep) * 20)}% Complete</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(onboardingStep) * 20}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
            </div>

              {/* Steps Content */}
              <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {onboardingStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Step 1: Connect Supabase Database</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Bethelmind Analytics & Strategy uses Supabase to securely save scraped leads, cache outreach history, and track campaign pipeline logs.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Supabase URL</label>
                      <input 
                        type="text" 
                        value={config.supabaseUrl || ''} 
                        onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
                        placeholder="https://your-project-ref.supabase.co"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Supabase Service Key</label>
                      <input 
                        type="password" 
                        value={config.supabaseKey || ''} 
                        onChange={(e) => setConfig({ ...config, supabaseKey: e.target.value })}
                        placeholder="eyJhbGciOi..."
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Step 2: Add Google Places API Key</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      To pull fresh businesses from Google Maps in real-time, you need a Google Places API key. If left blank, the app runs in sandbox simulation mode.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Google Places API Key</label>
                      <input 
                        type="password" 
                        value={config.googlePlacesApiKey || ''} 
                        onChange={(e) => setConfig({ ...config, googlePlacesApiKey: e.target.value })}
                        placeholder="AIzaSy..."
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Step 3: Choose Outreach Channel</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Select which channel you would like to use by default to contact B2B leads.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                      <button 
                        type="button"
                        onClick={() => setConfig({ ...config, outreachChannel: 'gmail' })}
                        style={{
                          padding: '20px',
                          background: config.outreachChannel !== 'whatsapp' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: config.outreachChannel !== 'whatsapp' ? '2px solid var(--primary)' : '1px solid var(--panel-border)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          outline: 'none'
                        }}
                      >
                        <span style={{ fontSize: '2rem' }}>✉️</span>
                        <span style={{ fontWeight: 600 }}>Email Outreach</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Automated cold proposal emails to prospects</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setConfig({ ...config, outreachChannel: 'whatsapp' })}
                        style={{
                          padding: '20px',
                          background: config.outreachChannel === 'whatsapp' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: config.outreachChannel === 'whatsapp' ? '2px solid var(--primary)' : '1px solid var(--panel-border)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          outline: 'none'
                        }}
                      >
                        <span style={{ fontSize: '2rem' }}>💬</span>
                        <span style={{ fontWeight: 600 }}>WhatsApp Outreach</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Send personalized proposals via WhatsApp API</span>
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Step 4: Configure Outreach Provider</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Setup the credentials for your chosen outreach channel.
                    </p>

                    {config.outreachChannel === 'whatsapp' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>WhatsApp Provider</label>
                          <select 
                            value={config.whatsappProvider || 'cloud'} 
                            onChange={(e) => setConfig({ ...config, whatsappProvider: e.target.value as any })}
                            style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                          >
                            <option value="cloud">Official Cloud API</option>
                            <option value="evolution">Evolution API (Baileys)</option>
                            <option value="whapi">Whapi.cloud</option>
                          </select>
                        </div>
                        {config.whatsappProvider === 'cloud' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(6, 182, 212, 0.04)', border: '1px dashed rgba(6, 182, 212, 0.3)', borderRadius: '8px', padding: '12px 14px', marginTop: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Meta Auto-Link Helper</span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Automate retrieval of Phone Number ID & Token.</span>
                                </div>
                                {!metaConnecting ? (
                                  <button
                                    type="button"
                                    onClick={startMetaConnection}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: 'linear-gradient(135deg, #1877F2 0%, #06B6D4 100%)',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: 'white',
                                      padding: '8px 16px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.25)',
                                      transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                                  >
                                    <span>⚡ Auto-Link Facebook</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={stopMetaConnection}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: '#EF4444',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: 'white',
                                      padding: '8px 16px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                                      transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                                  >
                                    <span>🛑 Cancel/Stop Browser</span>
                                  </button>
                                )}
                              </div>
                              {metaStatus && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '0.75rem'
                                }}>
                                  {metaConnecting && (
                                    <>
                                      <style dangerouslySetInnerHTML={{__html: `
                                        @keyframes pulse {
                                          0%, 100% { opacity: 1; transform: scale(1); }
                                          50% { opacity: 0.4; transform: scale(1.2); }
                                        }
                                      `}} />
                                      <span style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#06B6D4',
                                        display: 'inline-block',
                                        animation: 'pulse 1.5s infinite'
                                      }} />
                                    </>
                                  )}
                                  <span style={{ color: metaStatus.includes('Error') ? '#EF4444' : metaStatus.includes('Success') ? '#10B981' : '#06B6D4', fontWeight: 550 }}>
                                    {metaStatus}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone Number ID</label>
                              <input 
                                type="text" 
                                value={config.whatsappPhoneNumberId || ''} 
                                onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                                placeholder="Phone number ID"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Access Token</label>
                              <input 
                                type="password" 
                                value={config.whatsappAccessToken || ''} 
                                onChange={(e) => setConfig({ ...config, whatsappAccessToken: e.target.value })}
                                placeholder="Access token"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.whatsappProvider === 'evolution' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Evolution API URL</label>
                              <input 
                                type="text" 
                                value={config.evolutionApiUrl || ''} 
                                onChange={(e) => setConfig({ ...config, evolutionApiUrl: e.target.value })}
                                placeholder="https://api.domain.com"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>API Key</label>
                              <input 
                                type="password" 
                                value={config.evolutionApiKey || ''} 
                                onChange={(e) => setConfig({ ...config, evolutionApiKey: e.target.value })}
                                placeholder="Evolution API Key"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.whatsappProvider === 'whapi' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Whapi Token</label>
                            <input 
                              type="password" 
                              value={config.whapiToken || ''} 
                              onChange={(e) => setConfig({ ...config, whapiToken: e.target.value })}
                              placeholder="Whapi Token"
                              style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Provider</label>
                          <select 
                            value={config.emailProvider || 'gmail'} 
                            onChange={(e) => setConfig({ ...config, emailProvider: e.target.value as any })}
                            style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                          >
                            <option value="gmail">Gmail OAuth</option>
                            <option value="resend">Resend.com API</option>
                            <option value="brevo">Brevo.com SMTP API</option>
                            <option value="smtp">Custom SMTP Server</option>
                            <option value="sendgrid">SendGrid API</option>
                          </select>
                        </div>
                        {config.emailProvider === 'resend' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resend API Key</label>
                              <input 
                                type="password" 
                                value={config.resendApiKey || ''} 
                                onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                                placeholder="re_..."
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>From Email Address</label>
                              <input 
                                type="text" 
                                value={config.resendFromEmail || ''} 
                                onChange={(e) => setConfig({ ...config, resendFromEmail: e.target.value })}
                                placeholder="hello@yourdomain.com"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.emailProvider === 'brevo' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Brevo API Key</label>
                              <input 
                                type="password" 
                                value={config.brevoApiKey || ''} 
                                onChange={(e) => setConfig({ ...config, brevoApiKey: e.target.value })}
                                placeholder="xkeysib-..."
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sender Email</label>
                              <input 
                                type="text" 
                                value={config.brevoSenderEmail || ''} 
                                onChange={(e) => setConfig({ ...config, brevoSenderEmail: e.target.value })}
                                placeholder="hello@yourdomain.com"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.emailProvider === 'smtp' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SMTP Host</label>
                                <input 
                                  type="text" 
                                  value={config.smtpHost || ''} 
                                  onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                                  placeholder="smtp.gmail.com"
                                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SMTP Port</label>
                                <input 
                                  type="number" 
                                  value={config.smtpPort || ''} 
                                  onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                                  placeholder="587"
                                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SMTP Username</label>
                              <input 
                                type="text" 
                                value={config.smtpUser || ''} 
                                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                                placeholder="user@domain.com"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SMTP Password</label>
                              <input 
                                type="password" 
                                value={config.smtpPass || ''} 
                                onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                                placeholder="SMTP Password"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.emailProvider === 'sendgrid' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SendGrid API Key</label>
                              <input 
                                type="password" 
                                value={config.sendgridApiKey || ''} 
                                onChange={(e) => setConfig({ ...config, sendgridApiKey: e.target.value })}
                                placeholder="SG.xxx"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>From Email Address</label>
                              <input 
                                type="text" 
                                value={config.sendgridFromEmail || ''} 
                                onChange={(e) => setConfig({ ...config, sendgridFromEmail: e.target.value })}
                                placeholder="hello@yourdomain.com"
                                style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}
                        {config.emailProvider === 'gmail' && (
                          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--panel-border)', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Gmail OAuth connection can be completed in the Settings panel after onboarding.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {onboardingStep === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Step 5: Run First Lead Scrape</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Launch your first search query to scrape leads. This uses Google Maps (Free/API) based on step 2 settings.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Search Query (Industry + Location)</label>
                      <input 
                        type="text" 
                        value={gMapsQuery || ''} 
                        onChange={(e) => setGMapsQuery(e.target.value)}
                        placeholder="e.g. Dentists in Houston"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Max Results Limit</label>
                      <input 
                        type="number" 
                        value={gMapsLimit || 10} 
                        onChange={(e) => setGMapsLimit(Number(e.target.value))}
                        placeholder="10"
                        style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!gMapsQuery) {
                          alert("Please specify a search query first.");
                          return;
                        }
                        try {
                          const scraperToUse = config.googlePlacesApiKey ? 'google' : 'maps-free';
                          setSelectedScraper(scraperToUse);
                          // save config before run
                          await saveConfig();
                          addToast('Launching onboarding scraper...', 'info');
                          // start scraping
                          await runScraper();
                          localStorage.setItem("onboarding_complete", "true");
                          setShowOnboarding(false);
                          addToast('Onboarding complete! Scrape in progress.', 'success');
                        } catch (err: any) {
                          addToast(err.message || 'Scraper failed to start', 'error');
                        }
                      }}
                      disabled={scraping}
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '100%', marginTop: '10px', cursor: scraping ? 'not-allowed' : 'pointer' }}
                    >
                      {scraping ? (
                        <>
                          <Loader2 className="spin-anim" size={16} /> Running Scraper...
                        </>
                      ) : (
                        'Launch Scraper & Finish'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("onboarding_complete", "true");
                    setShowOnboarding(false);
                    addToast('Onboarding skipped. You can configure settings later.', 'info');
                  }}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Skip for now
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {onboardingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(prev => prev - 1)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Back
                    </button>
                  )}
                  {onboardingStep < 5 ? (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await saveConfig();
                          if (onboardingStep === 2) {
                            setSelectedScraper(config.googlePlacesApiKey ? 'google' : 'maps-free');
                          }
                          setOnboardingStep(prev => prev + 1);
                        } catch (err) {
                          addToast('Error saving step config', 'error');
                        }
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Next
                    </button>
                  ) : (
                    onboardingStep === 5 && !scraping && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem("onboarding_complete", "true");
                          setShowOnboarding(false);
                          addToast('Quick setup complete! Welcome to Bethelmind Analytics & Strategy.', 'success');
                        }}
                        className="btn-primary"
                        style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Finish Setup
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
