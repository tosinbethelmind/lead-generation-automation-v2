'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  BarChart3,
  GraduationCap,
  CalendarClock,
  BadgeCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Layers,
  FileCheck2,
  Award,
  Briefcase,
  Microscope,
  Lock,
  Clock,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Send,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Shield,
  Compass,
} from 'lucide-react';
import { getStoredAttribution, trackConversionEvent } from '@/lib/commerce/googleTracking';

const WHATSAPP_NUMBER = '2348022791227';

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const HERO_WHATSAPP_URL = buildWhatsAppUrl(
  'Hello Bethelmind, I need professional support with my postgraduate research. I would like to discuss my project and receive a quotation.'
);

const PROBLEM_POINTS = [
  "You have a research topic but don't know how to develop it.",
  'Your supervisor keeps requesting corrections.',
  'You are struggling with Chapters 1–5.',
  "You don't understand SPSS, STATA, NVivo or statistical analysis.",
  'Your literature review is becoming difficult to organize.',
  'You have collected data but cannot interpret the results.',
  'You need help preparing your work for journal publication.',
  'Your submission deadline is approaching.',
];

interface OfferCard {
  id: string;
  filterKey: string;
  tag: string;
  title: string;
  positioning: string;
  supportingText?: string;
  tools?: string[];
  items: string[];
  ctaLabel: string;
  supportOption: string;
  whatsappMessage: string;
  featured?: boolean;
  footnote?: string;
  icon: React.ReactNode;
}

const OFFERS: OfferCard[] = [
  {
    id: 'offer-a',
    filterKey: 'topic',
    tag: 'OFFER A • FOUNDATION',
    title: 'Research Topic Development and Concept Paper',
    positioning: 'Start Your Research on the Right Foundation.',
    items: [
      'Research topic refinement',
      'Research problem identification',
      'Research gap identification',
      'Concept paper development',
      'Research background and justification',
      'Research objectives and questions',
      'Hypothesis development',
      'Preliminary research framework',
    ],
    ctaLabel: 'GET TOPIC DEVELOPMENT SUPPORT',
    supportOption: 'Topic refinement',
    whatsappMessage:
      'Hello Bethelmind, I need help with Research Topic Development / Concept Paper for my postgraduate study. Please share how we can get started.',
    icon: <BookOpen className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'offer-b',
    filterKey: 'thesis',
    tag: 'OFFER B • CORE RESEARCH',
    title: 'Dissertation and Thesis Support',
    positioning: 'Professional Guidance From Research Planning to Final Thesis Refinement.',
    items: [
      'Chapter One: Introduction and background',
      'Chapter Two: Literature review',
      'Chapter Three: Research methodology',
      'Chapter Four: Results presentation and analysis',
      'Chapter Five: Discussion, conclusions and recommendations',
      'Thesis review and structural improvement',
      'Academic editing and supervisor correction support',
    ],
    footnote:
      'Provided as legitimate research guidance, drafting assistance, editing, and developmental support that preserves your own academic authorship and responsibility.',
    ctaLabel: 'DISCUSS MY THESIS',
    supportOption: 'Thesis support',
    whatsappMessage:
      'Hello Bethelmind, I would like to discuss Dissertation / Thesis Support for my postgraduate research and receive a quotation.',
    icon: <FileText className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'offer-c',
    filterKey: 'analysis',
    tag: 'OFFER C • FLAGSHIP SPECIALIST SERVICE',
    title: 'Advanced Statistical and Data Analysis',
    positioning: 'Collected Your Data but Struggling With Analysis?',
    supportingText:
      'Get professional assistance with statistical analysis, interpretation and clear presentation of your research findings.',
    tools: ['SPSS', 'STATA', 'NVivo', 'Microsoft Excel'],
    items: [
      'Regression analysis',
      'Descriptive statistics',
      'Inferential statistics',
      'Quantitative data analysis',
      'Qualitative thematic analysis',
      'Data interpretation',
      'Results presentation',
      'Tables and charts',
      'Statistical reporting',
    ],
    ctaLabel: 'GET DATA ANALYSIS SUPPORT',
    supportOption: 'Data analysis',
    whatsappMessage:
      'Hello Bethelmind, I need specialist assistance with Statistical / Data Analysis (SPSS, STATA, NVivo, or interpretation) for my research.',
    featured: true,
    icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'offer-d',
    filterKey: 'literature',
    tag: 'OFFER D • EVIDENCE SYNTHESIS',
    title: 'Systematic Literature Reviews',
    positioning: 'Turn Complex Research Literature Into a Clear, Structured Review.',
    items: [
      'Systematic literature review planning',
      'Literature search strategy',
      'Research evidence synthesis',
      'Inclusion and exclusion criteria',
      'PRISMA-based review support',
      'Thematic synthesis',
      'Research gap identification',
      'Conceptual and theoretical frameworks',
    ],
    ctaLabel: 'REQUEST LITERATURE REVIEW SUPPORT',
    supportOption: 'Literature review',
    whatsappMessage:
      'Hello Bethelmind, I need support with a Systematic Literature Review / PRISMA synthesis for my postgraduate research.',
    icon: <Layers className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'offer-e',
    filterKey: 'formatting',
    tag: 'OFFER E • QUALITY & REFERENCING',
    title: 'Academic Formatting and Plagiarism Reports',
    positioning: 'Get Your Academic Document Professionally Reviewed and Properly Referenced.',
    items: [
      'APA 7th edition',
      'Harvard referencing',
      'Chicago referencing',
      'Vancouver referencing',
      'Citation correction',
      'Reference list formatting',
      'Academic proofreading',
      'Similarity report interpretation',
      'Turnitin report support',
    ],
    footnote:
      'We provide thorough editorial review, citation alignment, and similarity report interpretation without making unrealistic promises on specific similarity percentages.',
    ctaLabel: 'GET DOCUMENT REVIEW',
    supportOption: 'Formatting and editing',
    whatsappMessage:
      'Hello Bethelmind, I need Academic Formatting, Referencing, and Similarity Report Review for my research document.',
    icon: <FileCheck2 className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'offer-f',
    filterKey: 'publication',
    tag: 'OFFER F • PUBLICATION',
    title: 'Journal Article and Publication Support',
    positioning: 'Take Your Research Beyond Your Dissertation.',
    items: [
      'Journal manuscript preparation',
      'Academic article structuring',
      'Manuscript editing',
      'Journal selection guidance',
      'Formatting to journal requirements',
      'Reviewer response and revision support',
      'Publication readiness assessment',
    ],
    ctaLabel: 'DISCUSS PUBLICATION SUPPORT',
    supportOption: 'Journal publication',
    whatsappMessage:
      'Hello Bethelmind, I need Journal Article and Publication Support for my manuscript.',
    icon: <Award className="w-5 h-5 text-amber-400" />,
  },
];

const SERVICE_FILTERS = [
  { key: 'all', label: 'All Services (6)' },
  { key: 'topic', label: 'Topic & Concept' },
  { key: 'thesis', label: 'Chapters 1–5' },
  { key: 'analysis', label: 'SPSS / STATA / NVivo' },
  { key: 'literature', label: 'Literature Review' },
  { key: 'formatting', label: 'Formatting & Turnitin' },
  { key: 'publication', label: 'Journal Publication' },
];

const SEGMENTS = [
  {
    title: 'MSc and MBA Students',
    desc: 'Structured support from proposal and literature review through methodology, data analysis, and final defence preparation.',
    icon: <GraduationCap className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'PhD Researchers',
    desc: 'Rigorous doctoral-level methodology, systematic reviews, advanced statistical modelling, and thesis refinement.',
    icon: <Microscope className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Working Professionals',
    desc: 'Flexible, milestone-driven consultations built around demanding work schedules and tight submission deadlines.',
    icon: <Briefcase className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Lecturers and Academic Researchers',
    desc: 'Collaborative statistical analysis, manuscript preparation, journal formatting, and peer-review revision support.',
    icon: <BookOpen className="w-6 h-6 text-amber-400" />,
  },
];

const TRUST_CARDS = [
  {
    title: 'Confidentiality',
    desc: 'Your research information and personal details are handled professionally.',
    icon: <Lock className="w-5 h-5 text-amber-400" />,
  },
  {
    title: 'Research Expertise',
    desc: 'Support across research methodology, data analysis and academic writing.',
    icon: <BarChart3 className="w-5 h-5 text-amber-400" />,
  },
  {
    title: 'Timely Delivery',
    desc: 'Agreed timelines and clear project milestones.',
    icon: <Clock className="w-5 h-5 text-amber-400" />,
  },
  {
    title: 'Personalized Support',
    desc: 'Recommendations based on your actual academic requirements.',
    icon: <UserCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    title: 'Revision Support',
    desc: 'Defined review and correction arrangements based on the selected service.',
    icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
  },
];

const PACKAGES = [
  {
    name: 'Research Starter',
    badge: 'PACKAGE 1',
    audience: 'For students who need assistance getting started.',
    items: [
      'Topic refinement',
      'Concept paper support',
      'Research objectives and questions',
      'Initial research direction',
    ],
    cta: 'ENQUIRE ABOUT STARTER SUPPORT',
    defaultSupport: 'Topic refinement',
    defaultLevel: 'MSc',
    whatsappMsg:
      'Hello Bethelmind, I would like to enquire about Package 1: Research Starter Support.',
    highlight: false,
  },
  {
    name: 'Dissertation Support',
    badge: 'PACKAGE 2 • MOST REQUESTED',
    audience: 'For MSc and MBA students.',
    items: [
      'Chapter development guidance',
      'Literature review support',
      'Methodology consultation',
      'Data analysis assistance',
      'Editing and referencing',
    ],
    cta: 'GET MY DISSERTATION QUOTE',
    defaultSupport: 'Thesis support',
    defaultLevel: 'MSc',
    whatsappMsg:
      'Hello Bethelmind, I would like to get a quotation for Package 2: Dissertation Support.',
    highlight: true,
  },
  {
    name: 'Advanced Research Support',
    badge: 'PACKAGE 3 • DOCTORAL & PUBLICATION',
    audience: 'For PhD researchers and advanced professionals.',
    items: [
      'Advanced research methodology',
      'Systematic literature review',
      'Advanced statistical analysis',
      'Thesis review and refinement',
      'Journal publication support',
    ],
    cta: 'REQUEST A PHD CONSULTATION',
    defaultSupport: 'Multiple services',
    defaultLevel: 'PhD',
    whatsappMsg:
      'Hello Bethelmind, I would like to request a consultation for Package 3: Advanced Research Support.',
    highlight: false,
  },
];

const DEADLINE_CHIPS = ['Within 7 days', '2–4 weeks', '1–2 months', 'Flexible'];

const FAQS = [
  {
    q: 'How is my research topic and personal information protected?',
    a: 'All enquiries, research topics, datasets, and draft chapters shared with Bethelmind Analytics & Strategy are treated as strictly confidential and used solely to evaluate and deliver your requested support.',
  },
  {
    q: 'Does your thesis support preserve my academic authorship?',
    a: 'Yes. We provide structured research guidance, methodological consultation, statistical analysis, editing, and developmental feedback designed to support your own scholarship and academic responsibility.',
  },
  {
    q: 'How is final pricing determined beyond the ₦80,000 starting point?',
    a: 'Every research project has a different scope. After a free consultation, we provide a clear quotation based on your academic level (MSc, MBA, or PhD), required services, data complexity, and timeline.',
  },
  {
    q: 'Do you support international postgraduate students outside Nigeria?',
    a: 'Yes. While our primary desk serves Nigerian scholars, we actively support international MSc, MBA, and PhD students across UK, European, North American, and African university formatting standards (APA 7th, Harvard, Chicago, Vancouver).',
  },
];

export default function AcademicResearchClient() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [academicLevel, setAcademicLevel] = useState('MSc');
  const [supportNeeded, setSupportNeeded] = useState('Thesis support');
  const [researchStage, setResearchStage] = useState('Working on Chapters 1–3');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    enquiryId: string;
    whatsappFollowUpUrl: string;
    message: string;
  } | null>(null);
  const [formStarted, setFormStarted] = useState(false);

  const visibleOffers =
    activeFilter === 'all' ? OFFERS : OFFERS.filter((o) => o.filterKey === activeFilter);

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackConversionEvent('form_start', { form_name: 'academic_consultation' });
    }
  };

  const handleWhatsAppClick = (label: string) => {
    trackConversionEvent('click_whatsapp', { cta_label: label, page: 'academic_research' });
  };

  const scrollToForm = (preselectSupport?: string, preselectLevel?: string) => {
    if (preselectSupport) {
      setSupportNeeded(preselectSupport);
    }
    if (preselectLevel) {
      setAcademicLevel(preselectLevel);
    }
    const el = document.getElementById('consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const attr = getStoredAttribution();
      const res = await fetch('/api/academic-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsapp,
          email,
          academicLevel,
          supportNeeded,
          researchStage,
          submissionDeadline,
          description,
          gclid: attr.gclid,
          gbraid: attr.gbraid,
          wbraid: attr.wbraid,
          utmCampaign: attr.utm_campaign,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Please check your details and try again.');
        setSubmitting(false);
        return;
      }

      trackConversionEvent('generate_lead', {
        academic_level: academicLevel,
        support_needed: supportNeeded,
        enquiry_id: data.enquiryId,
      });

      setSubmittedResult({
        enquiryId: data.enquiryId,
        whatsappFollowUpUrl: data.whatsappFollowUpUrl,
        message: data.message,
      });
    } catch {
      setErrorMsg('Network error while submitting. Please try again or reach us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100 pb-24 sm:pb-0 selection:bg-amber-400/30 selection:text-amber-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050b16]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-[#050b16] font-black text-base shrink-0 shadow-lg shadow-amber-500/20">
              B
            </div>
            <div className="truncate">
              <div className="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                Bethelmind Analytics &amp; Strategy
              </div>
              <div className="text-[11px] text-amber-300/90 font-medium hidden sm:block">
                Postgraduate Academic Research Support
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              Process
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#consultation-form" className="hover:text-white transition-colors">
              Free Consultation
            </a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={HERO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick('header_whatsapp')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-950/60"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Expert</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 1. HIGH-CONVERSION HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.10),_transparent_50%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Elite Academic Research Support • MSc, MBA &amp; PhD</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[3.1rem] font-extrabold tracking-tight text-white leading-[1.1]">
                Struggling With Your MSc, MBA or PhD Thesis?
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-amber-200/95 leading-snug">
                Get Expert Support With Research Methodology, Thesis Development, Statistical Analysis and Academic Publication.
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Whether you are stuck choosing a research topic, struggling with data analysis, facing supervisor corrections or approaching a submission deadline, Bethelmind provides structured professional support to help you move forward with confidence.
              </p>

              <p className="text-xs sm:text-sm text-slate-300/90 italic border-l-2 border-amber-400/70 pl-3.5 py-0.5">
                &ldquo;From Research Topic to Final Thesis: Get Expert Academic Research Support at Every Stage of Your Postgraduate Journey.&rdquo;
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={HERO_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppClick('hero_primary_cta')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-emerald-950/70 ring-1 ring-emerald-400/30"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>GET HELP WITH MY THESIS</span>
                </a>

                <button
                  type="button"
                  onClick={() => scrollToForm()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050b16] font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>GET A FREE CONSULTATION</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <div className="rounded-xl bg-slate-900/85 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 backdrop-blur-sm">
                <div>
                  <span className="text-sm sm:text-base font-bold text-amber-300">
                    Research Support Packages From ₦80,000
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Final pricing depends on academic level, research scope, complexity and requirements.
                  </p>
                </div>
                <a
                  href="#pricing"
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 shrink-0"
                >
                  View Packages <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { icon: ShieldCheck, text: 'Confidential Professional Support' },
                  { icon: BarChart3, text: 'Advanced Research and Statistical Expertise' },
                  { icon: GraduationCap, text: 'MSc, MBA and PhD Research Support' },
                  { icon: CalendarClock, text: 'Flexible Consultation' },
                  { icon: BadgeCheck, text: 'Transparent Pricing' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0c1a32] via-[#091326] to-[#060e1c] shadow-2xl">
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200 tracking-wide">
                        Postgraduate Research Desk
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25">
                      MSc • MBA • PhD
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#050b16]/90 border border-white/10 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                          Research Workflow &amp; Analysis
                        </p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          Methodology • SPSS / STATA • NVivo
                        </p>
                      </div>
                      <BarChart3 className="w-6 h-6 text-emerald-400 shrink-0" />
                    </div>

                    <svg
                      viewBox="0 0 360 130"
                      className="w-full h-auto rounded-lg bg-[#081224] border border-slate-800/80"
                      role="img"
                      aria-label="Academic research methodology and statistical analysis visual"
                    >
                      <defs>
                        <linearGradient id="acadBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.92" />
                          <stop offset="100%" stopColor="#059669" stopOpacity="0.32" />
                        </linearGradient>
                        <linearGradient id="acadGoldGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#fde68a" />
                        </linearGradient>
                      </defs>
                      <line x1="20" y1="30" x2="340" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="20" y1="65" x2="340" y2="65" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="20" y1="100" x2="340" y2="100" stroke="#1e293b" strokeWidth="1" />
                      <rect x="40" y="72" width="28" height="28" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="84" y="54" width="28" height="46" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="128" y="42" width="28" height="58" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="172" y="30" width="28" height="70" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="216" y="48" width="28" height="52" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="260" y="24" width="28" height="76" rx="4" fill="url(#acadBarGrad)" />
                      <rect x="304" y="18" width="28" height="82" rx="4" fill="url(#acadBarGrad)" />
                      <path
                        d="M54 68 Q 120 48, 186 32 T 318 16"
                        fill="none"
                        stroke="url(#acadGoldGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="54" cy="68" r="3.5" fill="#fbbf24" />
                      <circle cx="186" cy="32" r="3.5" fill="#fbbf24" />
                      <circle cx="318" cy="16" r="3.5" fill="#fbbf24" />
                    </svg>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-slate-900/90 border border-white/10 py-2 px-1.5">
                        <div className="text-[11px] font-bold text-amber-300">Chapters 1–5</div>
                        <div className="text-[10px] text-slate-400">Structured Review</div>
                      </div>
                      <div className="rounded-lg bg-slate-900/90 border border-white/10 py-2 px-1.5">
                        <div className="text-[11px] font-bold text-emerald-300">Data &amp; Tables</div>
                        <div className="text-[10px] text-slate-400">Clear Interpretation</div>
                      </div>
                      <div className="rounded-lg bg-slate-900/90 border border-white/10 py-2 px-1.5">
                        <div className="text-[11px] font-bold text-sky-300">APA / Harvard</div>
                        <div className="text-[10px] text-slate-400">Publication Ready</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                      Nigeria &amp; International Scholars
                    </p>
                    <p className="text-sm text-slate-200 font-medium mt-0.5">
                      Confidential guidance from topic approval to final thesis refinement.
                    </p>
                  </div>
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IDENTIFY THE CUSTOMER'S PROBLEM */}
      <section className="py-12 sm:py-16 border-b border-white/10 bg-[#081122]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Research Journey Doesn&apos;t Have to Be Overwhelming.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Postgraduate research bottlenecks are common—especially when balancing work, family, and demanding supervisor expectations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
            {PROBLEM_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-400/35 transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-slate-200 leading-snug">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1b36] to-slate-900 border border-amber-400/30 p-6 sm:p-8 text-center space-y-4">
            <p className="text-base sm:text-lg font-semibold text-white max-w-2xl mx-auto">
              Whatever stage you are at, we can help you identify the next steps and access the right professional research support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={buildWhatsAppUrl(
                  'Hello Bethelmind, I would like to discuss my postgraduate research stage with an expert and get guidance on next steps.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWhatsAppClick('problem_section_expert_cta')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>DISCUSS MY RESEARCH WITH AN EXPERT</span>
              </a>
              <button
                type="button"
                onClick={() => scrollToForm()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <span>Request a Free Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL SERVICES AND OFFERS */}
      <section id="services" className="py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Structured Postgraduate Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Comprehensive Research Services Tailored to Your Stage
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Filter by your current need or explore all six specialist support areas below.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {SERVICE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f.key
                    ? 'bg-amber-400 text-[#050b16] shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 border border-white/10 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleOffers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  offer.featured
                    ? 'md:col-span-2 bg-gradient-to-br from-[#0c1e35] via-[#091628] to-[#0a1d24] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/30'
                    : 'bg-slate-900/75 border border-white/10 hover:border-amber-400/40'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        offer.featured
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                      }`}
                    >
                      {offer.icon}
                      {offer.tag}
                    </span>
                    {offer.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" /> High-Demand Specialist Service
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white">{offer.title}</h3>
                  <p
                    className={`text-sm sm:text-base font-semibold mt-1.5 ${
                      offer.featured ? 'text-emerald-300' : 'text-amber-200/90'
                    }`}
                  >
                    {offer.positioning}
                  </p>
                  {offer.supportingText && (
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{offer.supportingText}</p>
                  )}

                  {offer.tools && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {offer.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-bold"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul
                    className={`mt-5 grid gap-2 text-sm text-slate-200 ${
                      offer.featured ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                    {offer.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            offer.featured ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {offer.footnote && (
                    <p className="mt-4 text-xs text-slate-400 bg-slate-950/60 border border-white/10 rounded-lg p-3 leading-relaxed">
                      {offer.footnote}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <a
                    href={buildWhatsAppUrl(offer.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick(offer.id)}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
                      offer.featured
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                        : 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{offer.ctaLabel}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => scrollToForm(offer.supportOption)}
                    className="text-xs font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Or request via consultation form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHO WE SERVE */}
      <section className="py-12 sm:py-16 border-b border-white/10 bg-[#081122]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Who We Serve</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Tailored Support Across Postgraduate &amp; Academic Levels
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3">
              Whether you are completing your first postgraduate dissertation or conducting advanced doctoral research, we help you access the right research support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.title}
                className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 hover:border-amber-400/35 transition-colors flex flex-col gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  {seg.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{seg.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{seg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE BETHELMIND? */}
      <section className="py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Why Choose Bethelmind?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Built on Confidentiality, Rigour &amp; Accountability
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TRUST_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-5 bg-slate-900/70 border border-white/10 flex flex-col gap-2.5"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-10 sm:py-14 border-b border-white/10 bg-[#081122]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Simple Process</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              How We Work With You
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Share Your Stage & Deadline',
                desc: 'Send a quick WhatsApp message or fill out the 60-second consultation form with your academic level and needs.',
                icon: <Compass className="w-5 h-5 text-amber-400" />,
              },
              {
                step: '02',
                title: 'Free Scope Review & Quote',
                desc: 'We review your requirements and provide a transparent quotation tailored to your research scope and timeline.',
                icon: <FileText className="w-5 h-5 text-amber-400" />,
              },
              {
                step: '03',
                title: 'Milestone-Based Delivery',
                desc: 'Receive structured guidance, analysis, or editorial review with agreed checkpoints and revision support.',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl p-5 bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">STEP {item.step}</span>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING AND PURCHASE CONVERSION */}
      <section id="pricing" className="py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Transparent Consultation-Based Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Professional Research Support Within Your Budget.
            </h2>

            <div className="mt-5 inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-gradient-to-b from-amber-400/15 to-amber-500/5 border border-amber-400/40">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-300">STARTING FROM</span>
              <span className="text-3xl sm:text-4xl font-black text-white mt-1">₦80,000</span>
            </div>

            <p className="text-sm text-slate-300 mt-4">
              Final pricing depends on your academic level, service requirements, research complexity and delivery timeline.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 flex flex-col justify-between ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-[#0e1f3a] to-[#091326] border-2 border-amber-400/60 shadow-2xl shadow-amber-950/20'
                    : 'bg-slate-900/80 border border-white/10'
                }`}
              >
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
                    {pkg.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">{pkg.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{pkg.audience}</p>

                  <div className="mt-4 py-2.5 px-3 rounded-lg bg-slate-950/70 border border-white/10 text-xs text-slate-300">
                    Custom quotation provided after free consultation
                  </div>

                  <ul className="mt-5 space-y-2.5 text-sm text-slate-200">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                  <a
                    href={buildWhatsAppUrl(pkg.whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick(`package_${pkg.name}`)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
                      pkg.highlight
                        ? 'bg-amber-400 hover:bg-amber-300 text-[#050b16]'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{pkg.cta}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => scrollToForm(pkg.defaultSupport, pkg.defaultLevel)}
                    className="w-full text-center text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Or submit project details below
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto rounded-xl bg-slate-900/90 border border-white/10 p-4 sm:p-5 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Quotation Note:</strong> Every research project is different. We provide a quotation after understanding your research topic, academic level, current progress and required services. MBA and PhD rates are determined after a free consultation.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs text-slate-300">
              <strong className="text-emerald-400">Official Corporate Settlement:</strong> Moniepoint Microfinance Bank &bull;{' '}
              <strong className="text-white">6805375225</strong> &bull;{' '}
              <strong className="text-white">Bethelmind Digital Solutions</strong>{' '}
              <span className="text-amber-300">(Official Parent Company Account &bull; CAC Reg: 9912717)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERSION ENQUIRY FORM */}
      <section id="consultation-form" className="py-12 sm:py-16 border-b border-white/10 bg-[#081122]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-slate-900/95 border border-white/15 p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-7">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Free Research Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Tell Us About Your Research Project.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Share your current research stage and deadline. Your details are kept strictly confidential.
              </p>
            </div>

            {submittedResult ? (
              <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-6 sm:p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Consultation Request Received</h3>
                <p className="text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
                  {submittedResult.message}
                </p>
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300">
                  Reference ID: {submittedResult.enquiryId}
                </div>
                <div className="pt-2">
                  <a
                    href={submittedResult.whatsappFollowUpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick('post_form_whatsapp_followup')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-colors shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Continue on WhatsApp With Your Project Summary</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-xl bg-red-950/60 border border-red-500/40 p-3.5 text-sm text-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chinedu Okafor"
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Phone Number <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 0803 482 9105 or +44 7700 900123"
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="academicLevel" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Academic Level <span className="text-amber-400">*</span>
                    </label>
                    <select
                      id="academicLevel"
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="MSc">MSc</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="supportNeeded" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      What Support Do You Need? <span className="text-amber-400">*</span>
                    </label>
                    <select
                      id="supportNeeded"
                      value={supportNeeded}
                      onChange={(e) => setSupportNeeded(e.target.value)}
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Topic refinement">Topic refinement</option>
                      <option value="Concept paper">Concept paper</option>
                      <option value="Thesis support">Thesis support</option>
                      <option value="Data analysis">Data analysis</option>
                      <option value="Literature review">Literature review</option>
                      <option value="Formatting and editing">Formatting and editing</option>
                      <option value="Journal publication">Journal publication</option>
                      <option value="Multiple services">Multiple services</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="researchStage" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Current Research Stage <span className="text-amber-400">*</span>
                    </label>
                    <select
                      id="researchStage"
                      value={researchStage}
                      onChange={(e) => setResearchStage(e.target.value)}
                      className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Yet to choose a topic">Yet to choose a topic</option>
                      <option value="Topic approved">Topic approved</option>
                      <option value="Working on Chapters 1–3">Working on Chapters 1–3</option>
                      <option value="Data collection completed">Data collection completed</option>
                      <option value="Data analysis stage">Data analysis stage</option>
                      <option value="Completing final corrections">Completing final corrections</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="submissionDeadline" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Submission Deadline
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {DEADLINE_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setSubmissionDeadline(chip)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          submissionDeadline === chip
                            ? 'bg-amber-400 text-[#050b16]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <input
                    id="submissionDeadline"
                    type="text"
                    value={submissionDeadline}
                    onChange={(e) => setSubmissionDeadline(e.target.value)}
                    placeholder="e.g. In 3 weeks, Next month, or December 15"
                    className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brief Description of Your Needs
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your field of study, current challenge (e.g. SPSS/STATA analysis, Chapter 2 review, supervisor feedback), and what you want to achieve."
                    className="w-full rounded-xl bg-[#050b16] border border-slate-700 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-[#050b16] font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{submitting ? 'SUBMITTING YOUR REQUEST...' : 'GET MY FREE CONSULTATION'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400 pt-1">
                  Confidential consultation • No obligation • Direct WhatsApp &amp; specialist response
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-14 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Common Questions</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              Before You Book Your Consultation
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl bg-slate-900/75 border border-white/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#040811] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">Bethelmind Analytics &amp; Strategy</span> — Postgraduate Academic Research Support
          </div>
          <div className="flex items-center gap-4">
            <a
              href={HERO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick('footer_whatsapp')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              WhatsApp: +234 802 279 1227
            </a>
            <span>•</span>
            <a href="#consultation-form" className="hover:text-slate-200">
              Free Consultation
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Conversion Bar */}
      <div className="sm:hidden">
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#050b16]/95 border-t border-white/15 backdrop-blur-lg px-3 py-2.5 flex items-center gap-2.5">
          <a
            href={HERO_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWhatsAppClick('mobile_sticky_whatsapp')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp Thesis Help</span>
          </a>
          <button
            type="button"
            onClick={() => scrollToForm()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-400 text-[#050b16] font-bold text-xs cursor-pointer"
          >
            <span>Free Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
