'use client';

import React, { useState } from 'react';
import { Star, Phone, MapPin, Award, CheckCircle, ArrowRight, ShieldCheck, Plus, Minus, Printer, Receipt, X } from 'lucide-react';

interface PreviewData {
  lead: {
    name: string;
    category: string;
    address: string;
    area: string;
    city: string;
    phone_raw: string;
    phone_e164: string;
    rating: number;
    reviews_count: number;
    business_summary: string;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    heroImage: string;
    gradient: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: { title: string; description: string; icon: string }[];
    aboutText: string;
    testimonials: { name: string; text: string; rating: number }[];
    ctaText: string;
  };
  pitch?: any;
}

interface LandingPageProps {
  data: PreviewData;
  leadId: string;
  isPreview?: boolean;
}

export default function LandingPage({ data, leadId, isPreview = false }: LandingPageProps) {
  const { lead, theme, copy } = data;

  const pitch = data.pitch || {
    categoryKey: 'general',
    widgetType: 'quote_estimator',
    widgetTitle: 'Smart Project Estimator & Invoice Generator',
    widgetDescription: 'Simulate adjusting the sliders to estimate costs and see immediate PDF quote invoice generation and CRM logging.',
    benefitsList: [
      'Dynamic quote estimator slider based on project scope, size, or duration',
      'Automatic branded PDF quote invoice generated and emailed to lead',
      'Bidirectional client sync with Google Sheets CRM',
      'Instant WhatsApp notifications for new business proposals'
    ],
    whatsappSim: [
      { sender: 'customer', text: 'Hi! I calculated a cost estimate of ₦400,000 for standard web automation.', timeOffsetMs: 500 },
      { sender: 'bot', text: 'Hello! Branded PDF Estimate Quote #8283 has been dispatched to your email. An agent will contact you shortly.', timeOffsetMs: 1600 },
      { sender: 'agent', text: '🔔 [New Quote Request] Client calculated ₦400,000 estimate. Contact: info@client.com. PDF Invoice #8283 generated. Logs synced to Google Sheets CRM.', timeOffsetMs: 3100 }
    ],
    invoiceDemo: {
      currency: '₦',
      taxRate: 0.075,
      items: [
        { name: 'Standard Project Set-Up & Consulting Fee', price: 150000, qty: 1 },
        { name: 'Implementation & Custom Development Service', price: 250000, qty: 1 }
      ]
    }
  };

  const [claimed, setClaimed] = useState(false);

  // Demo Automation States
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);

  // New Interactive Widget States
  const [activeModalInvoice, setActiveModalInvoice] = useState<any | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<any[]>([]);
  const [whatsappSimActive, setWhatsappSimActive] = useState(false);

  // E-commerce state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Luxury Unisex Sneakers (White/Gold)', price: 45000, qty: 1, selected: true },
    { id: 2, name: 'Designer Leather Crossbody Bag', price: 65000, qty: 0, selected: false },
    { id: 3, name: 'Edo Coral Beads Set (Polished)', price: 30000, qty: 0, selected: false }
  ]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'paystack' | 'success'>('cart');

  // Auto valuation state
  const [valuationBrand, setValuationBrand] = useState('Toyota');
  const [valuationYear, setValuationYear] = useState(2018);
  const [valuationMileage, setValuationMileage] = useState(50000);
  const [valuationCondition, setValuationCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Good');

  // Restaurant state
  const [tableGuests, setTableGuests] = useState(4);
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState('19:30');
  const [tableNum, setTableNum] = useState(4);
  const [preOrderFood, setPreOrderFood] = useState(false);

  // Patient intake state
  const [intakeDate, setIntakeDate] = useState(new Date().toISOString().split('T')[0]);
  const [intakeTime, setIntakeTime] = useState('10:00');
  const [intakeProcedure, setIntakeProcedure] = useState('Routine Dental Consultation');
  const [intakeInsurance, setIntakeInsurance] = useState('Self-Pay');
  const [intakeConsent, setIntakeConsent] = useState(true);

  // General scope estimator state
  const [estimatorScope, setEstimatorScope] = useState(250000);
  const [estimatorExtras, setEstimatorExtras] = useState({
    gateway: false,
    crm: false,
    whatsapp: false,
    enterprise: false
  });

  // Common Widget Submission Logic
  const handleWidgetSubmit = async (
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    detailsString: string,
    invoiceItems: { name: string; price: number; qty: number }[]
  ) => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          date: new Date().toISOString().split('T')[0],
          message: detailsString
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit simulation');
      }

      // Calculate invoice numbers and subtotal
      const subtotal = invoiceItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const taxRate = pitch.invoiceDemo?.taxRate || 0.075;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      const newInvoice = {
        invoiceNumber: `INV-APX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        businessName: lead.name,
        businessAddress: lead.address || 'Lagos, Nigeria',
        businessPhone: lead.phone_raw || '+234 123 4567',
        signature: 'ApexReach Automations'
      };

      setActiveModalInvoice(newInvoice);
      setDemoStatus(`Automation simulation success! Branded invoice #${newInvoice.invoiceNumber} has been generated. View the overlay to inspect or print.`);

      // Trigger WhatsApp simulation
      if (pitch.whatsappSim && pitch.whatsappSim.length > 0) {
        setWhatsappSimActive(true);
        setWhatsappMessages([]);
        
        pitch.whatsappSim.forEach((msg: any) => {
          setTimeout(() => {
            const formattedText = msg.text
              .replace(/\{\{lead\.name\}\}/g, lead.name)
              .replace(/\{\{previewUrl\}\}/g, `${window.location.origin}/preview/${leadId}`)
              .replace(/John Doe/g, customerName)
              .replace(/\+2348031234567/g, customerPhone || '+2348031234567');
            
            setWhatsappMessages(prev => [
              ...prev,
              {
                sender: msg.sender,
                text: formattedText,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }, msg.timeOffsetMs);
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Simulation Error: ${error.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const renderPatientIntake = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const handleIntakeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Dental Consultation / Procedure (${intakeProcedure})`, price: intakeProcedure.includes('Root Canal') ? 85000 : intakeProcedure.includes('Whitening') ? 45000 : 25000, qty: 1 },
        { name: 'X-Ray Diagnostics Fee', price: 15000, qty: 1 }
      ];
      const details = `Patient intake details. Date: ${intakeDate} at ${intakeTime}. Procedure: ${intakeProcedure}. Insurance: ${intakeInsurance}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleIntakeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="Patient's Full Name" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="patient@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 123 4567" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Procedure Requested</label>
            <select value={intakeProcedure} onChange={(e) => setIntakeProcedure(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Routine Dental Consultation">Routine Dental Consultation (₦25,000)</option>
              <option value="Professional Teeth Whitening">Professional Teeth Whitening (₦45,000)</option>
              <option value="Root Canal Therapy">Root Canal Therapy (₦85,000)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Appointment Date</label>
            <input type="date" value={intakeDate} onChange={(e) => setIntakeDate(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Time Slot</label>
            <select value={intakeTime} onChange={(e) => setIntakeTime(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="13:00">01:00 PM</option>
              <option value="15:00">03:00 PM</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Insurance Provider</label>
            <select value={intakeInsurance} onChange={(e) => setIntakeInsurance(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Self-Pay">Self-Pay / Cash</option>
              <option value="Leadway Health">Leadway Health</option>
              <option value="AXA Mansard HMO">AXA Mansard HMO</option>
              <option value="Hygeia Health">Hygeia Health</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%', alignSelf: 'end', paddingBottom: '12px' }}>
            <input type="checkbox" id="consent" checked={intakeConsent} onChange={(e) => setIntakeConsent(e.target.checked)} />
            <label htmlFor="consent" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>Enable SMS/WhatsApp reminders</label>
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Processing Request...' : 'Submit Patient Intake & Sync Calendar'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderVehicleValuation = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    // Calculate estimate live
    const baseValue = 12000000;
    const yearMult = 1 - (2026 - valuationYear) * 0.04;
    const mileageMult = 1 - (valuationMileage / 200000) * 0.15;
    const condMult = valuationCondition === 'Excellent' ? 1.0 : valuationCondition === 'Good' ? 0.85 : 0.7;
    const finalValuationValue = Math.max(1500000, Math.floor(baseValue * yearMult * mileageMult * condMult));

    const handleValuationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Vehicle Diagnostic Inspection Fee (${valuationBrand} ${valuationYear})`, price: 30000, qty: 1 },
        { name: 'Trade-in Appraisal Certification', price: 15000, qty: 1 },
        { name: `Estimated Trade-in Value Allowance`, price: -finalValuationValue, qty: 1 }
      ];
      const details = `Car Valuation request. Brand: ${valuationBrand}, Year: ${valuationYear}, Mileage: ${valuationMileage} km, Condition: ${valuationCondition}. Estimated Value: ₦${finalValuationValue.toLocaleString()}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Kola Alao" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="kola@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 802 987 6543" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Vehicle Brand</label>
            <select value={valuationBrand} onChange={(e) => setValuationBrand(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Toyota">Toyota</option>
              <option value="Lexus">Lexus</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Honda">Honda</option>
              <option value="Hyundai">Hyundai</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Model Year ({valuationYear})</label>
            <input type="range" min="2010" max="2026" step="1" value={valuationYear} onChange={(e) => setValuationYear(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Mileage: {valuationMileage.toLocaleString()} km</label>
            <input type="range" min="1000" max="200000" step="5000" value={valuationMileage} onChange={(e) => setValuationMileage(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Vehicle Condition</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Excellent', 'Good', 'Fair'].map((cond) => (
              <label key={cond} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#4b5563' }}>
                <input type="radio" name="condition" checked={valuationCondition === cond} onChange={() => setValuationCondition(cond as any)} style={{ accentColor: theme.primary }} />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ESTIMATED TRADE-IN VALUATION</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            ₦{finalValuationValue.toLocaleString()}
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Appraising Vehicle...' : 'Request Valuation & Alert Dealership'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderTableReservation = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const handleReserveSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Table Booking Deposit (Table #${tableNum} - ${tableGuests} guests)`, price: 10000, qty: 1 }
      ];
      if (preOrderFood) {
        items.push({ name: 'Gourmet Jollof Rice Platter (Feeds 2)', price: 18000, qty: 1 });
        items.push({ name: 'Mocktail Pitcher (Strawberry Mint)', price: 12000, qty: 1 });
      }
      const details = `Table booking. Date: ${tableDate} at ${tableTime}. Table #${tableNum}, Guests: ${tableGuests}. Preorder dinner: ${preOrderFood ? 'Yes' : 'No'}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleReserveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Tunde Bello" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="tunde@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 111 2233" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Select Table Preference</label>
            <select value={tableNum} onChange={(e) => setTableNum(Number(e.target.value))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="1">Table 1 (Indoor standard, max 4)</option>
              <option value="2">Table 2 (Window view, max 2)</option>
              <option value="3">Table 3 (Booth seating, max 6)</option>
              <option value="4">Table 4 (VIP dining suite, max 8)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Dining Date</label>
            <input type="date" value={tableDate} onChange={(e) => setTableDate(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Reservation Time</label>
            <select value={tableTime} onChange={(e) => setTableTime(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
              <option value="19:30">07:30 PM</option>
              <option value="20:30">08:30 PM</option>
              <option value="21:30">09:30 PM</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Number of Guests ({tableGuests})</label>
            <input type="range" min="1" max="10" step="1" value={tableGuests} onChange={(e) => setTableGuests(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%', alignSelf: 'end', paddingBottom: '12px' }}>
            <input type="checkbox" id="preorder" checked={preOrderFood} onChange={(e) => setPreOrderFood(e.target.checked)} />
            <label htmlFor="preorder" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>Pre-order gourmet dinner platter (+₦30,000)</label>
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Booking Table...' : 'Confirm Reservation & Notify Kitchen'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderEcommerceCart = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const updateQty = (id: number, delta: number) => {
      setCartItems(prev => prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty, selected: newQty > 0 };
        }
        return item;
      }));
    };

    const activeItems = cartItems.filter(i => i.selected && i.qty > 0);
    const subtotal = activeItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.075;
    const total = subtotal + tax;

    const handlePaystackCheckout = (e: React.FormEvent) => {
      e.preventDefault();
      if (activeItems.length === 0) {
        alert('Please add at least one item to your cart!');
        return;
      }
      setCheckoutStep('paystack');
    };

    const handleMockPayment = () => {
      setCheckoutStep('success');
      const invoiceItems = activeItems.map(i => ({ name: i.name, price: i.price, qty: i.qty }));
      const details = `Paid E-commerce order. Total items: ${activeItems.length}. Amount paid: ₦${total.toLocaleString()}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, invoiceItems);
    };

    if (checkoutStep === 'paystack') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ display: 'inline-flex', padding: '8px 16px', background: '#ecfdf5', color: '#047857', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={16} /> Paystack Secure Checkout Simulation
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Simulate Paystack Payment</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            You are checking out for <strong>₦{total.toLocaleString()}</strong>. In production, this launches the official Paystack popup window. Click below to simulate success.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
            <button type="button" onClick={handleMockPayment} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Simulate Successful Payment
            </button>
            <button type="button" onClick={() => setCheckoutStep('cart')} style={{ background: '#e2e8f0', color: '#4b5563', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (checkoutStep === 'success') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Payment Confirmed!</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Simulated transaction succeeded! Branded invoice generated. Look for the floating Live WhatsApp simulation widget in the bottom-right of your screen.
          </p>
          <button type="button" onClick={() => { setCheckoutStep('cart'); setCartItems(prev => prev.map(i => ({...i, qty: i.id === 1 ? 1 : 0, selected: i.id === 1}))); }} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Shop Again
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handlePaystackCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1f2937' }}>Select Products</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1f2937' }}>{item.name}</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>₦{item.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer' }}><Minus size={14} /></button>
                <span style={{ fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563', marginBottom: '6px' }}>
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563', marginBottom: '6px' }}>
            <span>VAT (7.5%)</span>
            <span>₦{tax.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginTop: '6px' }}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Customer Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Amara Okafor" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="amara@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 815 345 6789" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <button type="submit" disabled={subtotal === 0 || demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: (subtotal === 0 || demoLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Initializing Checkout...' : 'Proceed to Paystack Payment'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderQuoteEstimator = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    // Calculate quote total
    const extraPriceGateway = estimatorExtras.gateway ? 50000 : 0;
    const extraPriceCrm = estimatorExtras.crm ? 30000 : 0;
    const extraPriceWhatsapp = estimatorExtras.whatsapp ? 60000 : 0;
    const finalQuoteValue = estimatorScope + extraPriceGateway + extraPriceCrm + extraPriceWhatsapp;

    const handleQuoteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Web Automation Base Setup (Level: ₦${estimatorScope.toLocaleString()})`, price: estimatorScope, qty: 1 }
      ];
      if (estimatorExtras.gateway) items.push({ name: 'Payment Gateway Integration Add-on', price: 50000, qty: 1 });
      if (estimatorExtras.crm) items.push({ name: 'CRM & Custom Sheets Sync Integration', price: 30000, qty: 1 });
      if (estimatorExtras.whatsapp) items.push({ name: 'WhatsApp Marketing/Drip Campaign Alerts', price: 60000, qty: 1 });
      if (estimatorExtras.enterprise) items.push({ name: 'Bespoke Enterprise Custom Automation (ERP/Accounting Custom Sync)', price: 0, qty: 1 });

      const details = `Pricing calculator proposal. Base level: ₦${estimatorScope.toLocaleString()}. Extras: Gateway(${estimatorExtras.gateway}), CRM(${estimatorExtras.crm}), WhatsApp(${estimatorExtras.whatsapp}), Enterprise(${estimatorExtras.enterprise}). Calculated Total: ₦${finalQuoteValue.toLocaleString()}`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="john@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 123 4567" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Base Automation Level (₦{estimatorScope.toLocaleString()})</label>
            <input type="range" min="150000" max="400000" step="50000" value={estimatorScope} onChange={(e) => setEstimatorScope(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '10px' }}>Select Premium Add-ons</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.gateway} onChange={(e) => setEstimatorExtras({...estimatorExtras, gateway: e.target.checked})} style={{ accentColor: theme.primary }} />
              Payment Gateway Integration (Paystack/Flutterwave) (+₦50,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.crm} onChange={(e) => setEstimatorExtras({...estimatorExtras, crm: e.target.checked})} style={{ accentColor: theme.primary }} />
              Advanced CRM & Google Sheets Bidirectional Logs (+₦30,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.whatsapp} onChange={(e) => setEstimatorExtras({...estimatorExtras, whatsapp: e.target.checked})} style={{ accentColor: theme.primary }} />
              WhatsApp Automated Drip Campaigns & Reminders (+₦60,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.enterprise} onChange={(e) => setEstimatorExtras({...estimatorExtras, enterprise: e.target.checked})} style={{ accentColor: theme.primary }} />
              Bespoke Enterprise Custom Automation (Accounting, ERP, CRM Custom Sync) (₦Contact for Negotiation)
            </label>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CALCULATED PROJECT ESTIMATE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: theme.primary, marginTop: '4px' }}>
            ₦{finalQuoteValue.toLocaleString()}{estimatorExtras.enterprise ? ' + Bespoke Scope (Negotiable)' : ''}
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Generating Quote...' : 'Generate Custom Quote & Branded Invoice'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderActiveWidget = () => {
    if (demoStatus && pitch.widgetType !== 'ecommerce') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
            Automation Succeeded!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            {demoStatus}
          </p>
          <button 
            type="button"
            onClick={() => { setDemoStatus(null); setDemoForm({ name: '', email: '', phone: '', date: '', message: '' }); }}
            style={{ background: '#cbd5e1', color: '#1f2937', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Test Another Booking
          </button>
        </div>
      );
    }

    switch (pitch.widgetType) {
      case 'patient_intake':
        return renderPatientIntake();
      case 'vehicle_valuation':
        return renderVehicleValuation();
      case 'table_reservation':
        return renderTableReservation();
      case 'ecommerce':
        return renderEcommerceCart();
      case 'quote_estimator':
      default:
        return renderQuoteEstimator();
    }
  };

  // Claim States
  const [claimForm, setClaimForm] = useState({ name: '', email: '' });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);


  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          ...demoForm
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit test booking');
      }
      setDemoStatus(result.message || 'Automation simulated successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Demo Error: ${error.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      const res = await fetch('/api/preview/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          clientName: claimForm.name,
          clientEmail: claimForm.email,
          theme,
          copy
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit claim request');
      }
      setClaimMessage(result.message || 'Request submitted successfully!');
      setClaimed(true);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Claim Error: ${error.message}`);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div style={{ 
      background: theme.bg, 
      color: '#1e293b', 
      fontFamily: `${theme.font}, system-ui, sans-serif`,
      minHeight: '100vh',
      position: 'relative',
      paddingTop: isPreview ? '64px' : '0px',
      overflowX: 'hidden'
    }}>
      {/* Dynamic Font Import */}
      <link 
        href={`https://fonts.googleapis.com/css2?family=${theme.font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`} 
        rel="stylesheet" 
      />

      {/* Sticky Conversion-Focused Preview Banner */}
      {isPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(9, 13, 22, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              padding: '4px 8px', 
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>ApexReach Demo</span>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, fontWeight: 500 }} className="hide-mobile">
              Hey <strong>{lead.name}</strong>, we custom-built this site based on your Google rating!
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="#claim" style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Claim Website & Domain
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '75vh', 
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${theme.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(8px)',
            borderRadius: '99px', 
            padding: '6px 16px', 
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rated {lead.rating} Stars by {lead.reviews_count} Locals</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 4rem)', 
            lineHeight: 1.1, 
            fontWeight: 700, 
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em'
          }}>{copy.heroTitle}</h1>

          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            color: '#e2e8f0', 
            marginBottom: '36px',
            maxWidth: '650px',
            margin: '0 auto 36px',
            lineHeight: 1.5,
            textShadow: '0 1px 5px rgba(0,0,0,0.3)'
          }}>{copy.heroSubtitle}</p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={isPreview ? "#claim" : "#booking"} style={{
              background: theme.primary,
              border: `1px solid ${theme.primary}`,
              color: '#fff',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              {copy.ctaText} <ArrowRight size={18} />
            </a>
            {lead.phone_raw && (
              <a href={`tel:${lead.phone_e164}`} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              >
                <Phone size={18} /> Call Us Directly
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Social-Proof Reputation Bar */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', color: '#fbbf24', fontSize: '2rem', fontWeight: 700 }}>
              {lead.rating} <Star style={{ fill: '#fbbf24' }} size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Average Google Rating</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary }}>{lead.reviews_count}+</div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Customer Reviews Verified</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              100% <CheckCircle size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Locally Verified Service</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>Our Specialties & Services</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>We specialize in delivering high-quality, professional solutions designed to meet your needs in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {copy.services.map((service, idx) => (
              <div key={idx} style={{ 
                background: '#ffffff', 
                padding: '36px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              className="service-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)';
              }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: theme.primary, marginBottom: '12px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ background: '#ffffff', padding: '80px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.primary, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              <Award size={18} /> Award-Winning Reputation
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '20px', lineHeight: 1.2 }}>About {lead.name}</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '24px' }}>{copy.aboutText}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin style={{ color: theme.primary }} size={20} />
                <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.address}</span>
              </div>
              {lead.phone_raw && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone style={{ color: theme.primary }} size={20} />
                  <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.phone_raw}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
              alt="Workspace" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '20px', 
              right: '20px', 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)',
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} size={24} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Local Verified Reputation</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Top rating confirmed on Google Maps APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>What Our Customers Say</h2>
            <p style={{ color: '#64748b' }}>Here is what actual clients think of our work in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {copy.testimonials.map((test, idx) => (
              <div key={idx} style={{ 
                background: '#ffffff', 
                padding: '30px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} style={{ color: '#fbbf24', fill: '#fbbf24' }} size={16} />
                  ))}
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.95rem' }}>&ldquo;{test.text}&rdquo;</p>
                <p style={{ margin: 0, fontWeight: 600, color: theme.primary, fontSize: '0.9rem' }}>— {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form (Interactive Automation Demo) */}
      <section id="booking" style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '80px 24px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              background: 'rgba(2, 132, 199, 0.1)',
              color: theme.primary,
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '99px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>{isPreview ? "Interactive Automation Demo" : "Schedule Our Services"}</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginTop: '16px', marginBottom: '12px' }}>
              {pitch.widgetTitle || "Test-Drive Booking Automation"}
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {pitch.widgetDescription || "Try this interactive demo to see how we automate custom database entries, instant alerts, and printable invoice receipts."}
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
          }}>
            {renderActiveWidget()}
          </div>
        </div>
      </section>

      {/* Walkthrough Video & Pricing Strategy Section */}
      {isPreview && (
        <section id="pricing-strategy" style={{
          background: '#0f172a',
          color: '#f8fafc',
          padding: '80px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Walkthrough & Pricing Strategy</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '16px', marginBottom: '12px' }}>
                How ApexReach Scales Your Business
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
                Watch a quick 1-minute video showing our automated lead generation, instant pitching, and custom domain deployment system.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
              {/* Video Embed */}
              <div style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                  <video 
                    src="/assets/apexreach-demo.webm" 
                    controls 
                    poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>

              {/* Pricing / Grade Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#38bdf8' }}>Graded Automation Packages</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Select the option that matches your business model. Every package includes a premium landing page tailored to your high-rated Google reputation.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #94a3b8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>1. Basic Online Presence</strong>
                      <span style={{ fontWeight: 700, color: '#94a3b8' }}>₦150,000</span>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Includes custom design, fast hosting, basic SEO configuration, mobile-first responsive layout, and phone link connection. Best for simple local credibility.
                    </p>
                  </div>

                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #60a5fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>2. Growth Engine (Simple Automation)</strong>
                      <span style={{ fontWeight: 700, color: '#60a5fa' }}>₦250,000</span>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Adds automated booking intake form, direct email/WhatsApp alerts for new leads, and automated basic invoicing or PDF receipt generation.
                    </p>
                  </div>

                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>3. Automated Powerhouse (Big Automation)</strong>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>₦400,000</span>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Adds full payment gateway checkout (Paystack/Flutterwave), advanced CRM bidirectional sheet logging, automated follow-up drip campaign, and custom database integrations.
                    </p>
                  </div>

                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>4. Bespoke Enterprise Automations</strong>
                      <span style={{ fontWeight: 700, color: '#8b5cf6' }}>₦Contact for Negotiation</span>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Integrates custom accounting pipelines, warehouse inventory bots, advanced lead generation scrapers, and legacy CRM bidirectional sync. Contact for customized project scoping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Chat Simulation Widget */}
      {isPreview && whatsappSimActive && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '320px',
          maxHeight: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header */}
          <div style={{ background: '#075e54', color: '#ffffff', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25d366' }}></div>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Live Automation Feed</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Simulated Deliveries</span>
              </div>
            </div>
            <button type="button" onClick={() => setWhatsappSimActive(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#ece5dd',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '260px'
          }}>
            {whatsappMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '40px' }}>
                Waiting for automation trigger...
              </div>
            ) : (
              whatsappMessages.map((msg, idx) => {
                const isAgent = msg.sender === 'agent';
                const isBot = msg.sender === 'bot';
                const isCustomer = msg.sender === 'customer';
                
                let bg = '#ffffff';
                let alignSelf = 'flex-start';
                let color = '#333333';
                let borderRadius = '8px 8px 8px 0px';
                
                if (isCustomer) {
                  bg = '#dcf8c6';
                  alignSelf = 'flex-end';
                  borderRadius = '8px 8px 0px 8px';
                } else if (isAgent) {
                  bg = '#e9f5ff';
                  color = '#0c4a6e';
                }

                return (
                  <div key={idx} style={{
                    background: bg,
                    color: color,
                    padding: '10px 12px',
                    borderRadius: borderRadius,
                    maxWidth: '85%',
                    alignSelf: alignSelf as any,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    fontSize: '0.85rem',
                    lineHeight: 1.4
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isCustomer ? '#075e54' : isAgent ? '#0284c7' : '#e67e22', marginBottom: '2px' }}>
                      {isCustomer ? 'Client (You)' : isAgent ? 'Sales CRM Alert' : `${lead.name} Bot`}
                    </div>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888888', textAlign: 'right', marginTop: '4px' }}>
                      {msg.time}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Action Footer */}
          {activeModalInvoice && (
            <div style={{ padding: '10px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => {
                  // Keep modal open or trigger focus
                }}
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Receipt size={14} /> View Invoice & Receipt
              </button>
            </div>
          )}
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {activeModalInvoice && (
        <div 
          onClick={() => setActiveModalInvoice(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 13, 22, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header / Actions */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt style={{ color: theme.primary }} size={20} />
                <strong style={{ fontSize: '1rem', color: '#1f2937' }}>Automated Receipt & Invoice Proposal</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#4b5563'
                  }}
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveModalInvoice(null)}
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Page */}
            <div id="printable-invoice" style={{ padding: '40px', color: '#1f2937', background: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {/* Business Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: theme.primary }}>{activeModalInvoice.businessName}</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                    {activeModalInvoice.businessAddress}
                  </p>
                  {activeModalInvoice.businessPhone && (
                    <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                      Phone: {activeModalInvoice.businessPhone}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(2, 132, 199, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>
                    ESTIMATE / INVOICE
                  </span>
                  <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>{activeModalInvoice.invoiceNumber}</p>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

              {/* Invoice Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Billed To:</span>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginTop: '4px', color: '#0f172a' }}>{activeModalInvoice.clientName}</strong>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>{activeModalInvoice.clientEmail}</span>
                  {activeModalInvoice.clientPhone && (
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>{activeModalInvoice.clientPhone}</span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date Issued:</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>{activeModalInvoice.date}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Payment Terms:</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>Due on Receipt (Simulation)</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Item Description</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {activeModalInvoice.items.map((item: any, idx: number) => {
                    const priceVal = item.price;
                    const isCredit = priceVal < 0;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 0', fontWeight: 500, color: '#334155' }}>{item.name}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#334155' }}>{item.qty}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', color: isCredit ? '#10b981' : '#334155' }}>
                          {isCredit ? '-' : ''}₦{Math.abs(priceVal).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: isCredit ? '#10b981' : '#334155' }}>
                          {isCredit ? '-' : ''}₦{Math.abs(priceVal * item.qty).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals Box */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₦{activeModalInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>VAT ({(pitch.invoiceDemo?.taxRate || 0.075) * 100}%):</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₦{activeModalInvoice.tax.toLocaleString()}</span>
                  </div>
                  <hr style={{ border: 0, borderTop: '1px solid #cbd5e1', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>Total Amount:</span>
                    <span>₦{activeModalInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginTop: '50px', padding: '15px', background: '#f8fafc', borderRadius: '8px', borderLeft: `3px solid ${theme.primary}` }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>B2B Proposal Estimate Note:</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                  This estimate invoice demonstrates automated transaction billing and instant PDF generations customized for <strong>{activeModalInvoice.businessName}</strong>. Standard setup integrates with Paystack gateway or local bank transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Section / Contact Form */}
      {isPreview && (
        <section id="claim" style={{ 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0',
          padding: '100px 24px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ 
            maxWidth: '600px', 
            width: '100%', 
            background: '#fafaf9',
            padding: '40px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {!claimed ? (
              <>
                <ShieldCheck size={48} style={{ color: theme.primary, margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Claim This Website & Domain</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', lineHeight: 1.5 }}>
                  This is a live responsive preview of the website we designed for <strong>{lead.name}</strong>. Provide your email address below to claim ownership, customize the content, and deploy it to a live domain.
                </p>

                <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={claimForm.name}
                      onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                      placeholder="Enter your name"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      placeholder="name@business.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={claimLoading}
                    style={{
                      background: theme.primary,
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: claimLoading ? 'not-allowed' : 'pointer',
                      marginTop: '10px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => !claimLoading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                    onMouseLeave={(e) => !claimLoading && (e.currentTarget.style.filter = 'brightness(1)')}
                  >
                    {claimLoading ? 'Submitting Request...' : 'Request Ownership & Edit Access'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <Award size={64} style={{ color: '#10b981', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Request Submitted!</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {claimMessage || `Thank you! We've received your request to claim the website and domain for ${lead.name}. Our automation is triggering a deployment of your live files on GitHub and Vercel. We will contact you at the email provided to transfer ownership.`}
                </p>
                <button 
                  onClick={() => setClaimed(false)}
                  style={{ background: '#e2e8f0', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Styled utilities for mobile responsive behaviors */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
