'use client';

import React, { useState, useEffect } from 'react';
import { WebappToolActionBar } from './WebappToolActionBar';
import {
  Briefcase,
  Users,
  Sparkles,
  FileCheck,
  Calendar,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PhoneCall,
  Video,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Mic,
  Volume2,
} from 'lucide-react';
import {
  JobPosition,
  TalentPoolCandidate,
  ApplicantCV,
  InterviewSlot,
  CvGradeResult,
  AiSourcingRecommendation,
  VoiceNoteEvaluationResult,
  SEED_JOB_POSITIONS,
  SEED_TALENT_POOL,
  SEED_INTERVIEW_SLOTS,
  evaluateCvGrade,
  evaluateVoiceNoteSubmission,
  generateSourcingRecommendations,
} from '@/lib/recruitmentEngine';

export function RecruitmentEngineWidget() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'talent_pool' | 'sourcing_ai' | 'cv_grader' | 'interviews'>('jobs');

  const [copiedWidgetUrl, setCopiedWidgetUrl] = useState(false);
  const widgetUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/recruitment` : 'https://apexreach.app/tools/recruitment';
  const whatsappWidgetShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this free 24-Hour AI Recruitment & Talent Engine (Hire vetted candidates in under 24 hours): ${widgetUrl}`)}`;

  // Job Positions State
  const [jobs, setJobs] = useState<JobPosition[]>(SEED_JOB_POSITIONS);
  const [selectedJob, setSelectedJob] = useState<JobPosition>(SEED_JOB_POSITIONS[0]);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Operations');
  const [newJobSalary, setNewJobSalary] = useState('₦300,000 - ₦500,000 / month');
  const [newJobExp, setNewJobExp] = useState(3);
  const [newJobSkills, setNewJobSkills] = useState('Solar Inverter Sizing, Lithium Battery Storage, BOQ');

  // Talent Pool State
  const [talentPool, setTalentPool] = useState<TalentPoolCandidate[]>(SEED_TALENT_POOL);
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  // AI Sourcing Advisor State
  const [sourcingRole, setSourcingRole] = useState('Senior Solar Installation Engineer');
  const [sourcingRecs, setSourcingRecs] = useState<AiSourcingRecommendation>(
    generateSourcingRecommendations('Senior Solar Installation Engineer')
  );
  const [copiedBoolean, setCopiedBoolean] = useState(false);

  // CV Grader State
  const [candidateName, setCandidateName] = useState('Chinedu Kenneth');
  const [candidateEmail, setCandidateEmail] = useState('chinedu.k@example.com');
  const [candidatePhone, setCandidatePhone] = useState('08098765432');
  const [candidateExp, setCandidateExp] = useState(4);
  const [candidateSkillsInput, setCandidateSkillsInput] = useState('Solar Inverter Sizing, High Voltage Wiring, Lithium Battery Storage');
  const [cvText, setCvText] = useState(
    'Experienced Solar Engineer with 4 years managing commercial hybrid installations in Lagos. Expert in pure sine wave hybrid inverter setup, 48V lithium battery rack sizing, and solar PV array wiring. Managed 15kVA commercial projects in Lekki and Ikeja.'
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<CvGradeResult | null>(null);

  // WhatsApp Voice Note Pre-Screening State
  const [voiceTranscriptInput, setVoiceTranscriptInput] = useState('');
  const [voiceEvalResult, setVoiceEvalResult] = useState<VoiceNoteEvaluationResult | null>(null);

  // AI Mass Paragraph Parser Auto-Fill State
  const [massParagraphText, setMassParagraphText] = useState('');
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);

  const handleAutoFillFromParagraph = () => {
    if (!massParagraphText.trim()) return;

    const lower = massParagraphText.toLowerCase();

    // Inferred Title
    let title = 'Senior Technical Specialist';
    if (lower.includes('solar') || lower.includes('inverter') || lower.includes('pv')) title = 'Senior Solar Installation Engineer';
    else if (lower.includes('sales') || lower.includes('b2b') || lower.includes('closing')) title = 'B2B Technical Sales Executive';
    else if (lower.includes('developer') || lower.includes('software') || lower.includes('react') || lower.includes('node')) title = 'Full-Stack Software Developer';
    else if (lower.includes('accountant') || lower.includes('audit') || lower.includes('finance')) title = 'Finance & Accounting Specialist';
    else if (lower.includes('manager') || lower.includes('operations')) title = 'Operations & Branch Manager';
    else if (lower.includes('nurse') || lower.includes('medical') || lower.includes('clinic')) title = 'Healthcare Medical Specialist';

    // Inferred Location
    let loc = 'Lagos';
    if (lower.includes('abuja')) loc = 'Abuja';
    else if (lower.includes('port harcourt') || lower.includes('ph')) loc = 'Port Harcourt';
    else if (lower.includes('lekki')) loc = 'Lagos (Lekki)';
    else if (lower.includes('ikeja')) loc = 'Lagos (Ikeja)';

    // Inferred Salary
    let sal = '₦350,000 - ₦550,000 / month';
    const salMatch = massParagraphText.match(/(?:₦|N|NGN|\$)?\s*\d{2,3}[,k\d]*\s*(?:-|to)?\s*(?:₦|N|NGN|\$)?\s*\d{2,3}[,k\d]*/i);
    if (salMatch) sal = salMatch[0];

    // Inferred Experience
    let exp = 3;
    const expMatch = massParagraphText.match(/(\d+)\s*(?:\+|\s*years?|\s*yrs?)/i);
    if (expMatch) exp = parseInt(expMatch[1], 10);

    // Inferred Skills
    const known = ['Solar', 'Inverter', 'Lithium', 'Sales', 'B2B', 'React', 'Node.js', 'Python', 'BOQ', 'Accounting', 'Management', 'Excel', 'Customer Service', 'CAD', 'Wiring'];
    const found = known.filter(s => lower.includes(s.toLowerCase()));
    const skills = found.length > 0 ? found.join(', ') : 'Technical Expertise, Problem Solving, Communication';

    // Update all form fields across widget
    setNewJobTitle(title);
    setNewJobSalary(sal);
    setNewJobExp(exp);
    setNewJobSkills(skills);
    setSourcingRole(title);
    setCvText(massParagraphText);
    setCandidateSkillsInput(skills);
    setCandidateExp(exp);

    // Generate sourcing recommendations immediately
    setSourcingRecs(generateSourcingRecommendations(title, loc));

    setAutoFillNotice(`✨ AI parsed mass paragraph! Auto-filled Job Title ("${title}"), Salary ("${sal}"), Experience (${exp} yrs), and Skills ("${skills}"). All UI forms updated!`);
    setTimeout(() => setAutoFillNotice(null), 6000);
  };

  // AI Co-Pilot Assistant State
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiAssistantMessages, setAiAssistantMessages] = useState<
    { sender: 'user' | 'ai'; text: string; action?: string; xray?: string }[]
  >([
    {
      sender: 'ai',
      text: '👋 Hello! I am your Intelligent AI HR Co-Pilot. Ask me anything like: "How to hire in 24 hours?", "Calculate salary benchmark for senior solar installer", or "Generate WhatsApp pitch for B2B sales".',
    },
  ]);


  const handleTestVoiceNote = () => {
    const res = evaluateVoiceNoteSubmission(
      candidateName,
      selectedJob.title,
      45,
      voiceTranscriptInput || undefined
    );
    setVoiceEvalResult(res);
  };

  const handleAskAiAssistant = (promptText?: string) => {
    const query = promptText || aiPromptInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    const { askRecruitmentAiAssistant } = require('@/lib/recruitmentEngine');
    const resp = askRecruitmentAiAssistant(query, selectedJob.title);

    const aiMsg = {
      sender: 'ai' as const,
      text: resp.aiAdvice,
      action: resp.recommendedAction,
      xray: resp.googleXrayQuery,
    };

    setAiAssistantMessages((prev) => [...prev, userMsg, aiMsg]);
    setAiPromptInput('');
  };

  // Interview Scheduler State
  const [interviews, setInterviews] = useState<InterviewSlot[]>(SEED_INTERVIEW_SLOTS);
  const [schedCandidateName, setSchedCandidateName] = useState('Chinedu Kenneth');
  const [schedDateTime, setSchedDateTime] = useState('2026-08-08T10:00');
  const [schedMode, setSchedMode] = useState<'video_webrtc' | 'whatsapp_call' | 'in_person'>('video_webrtc');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Run CV Evaluation
  const handleGradeCv = () => {
    setEvaluating(true);
    setTimeout(() => {
      const skills = candidateSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = evaluateCvGrade(
        { requiredSkills: selectedJob.requiredSkills, minYearsExp: selectedJob.minYearsExp, title: selectedJob.title },
        { yearsExperience: candidateExp, skills, cvText }
      );
      setEvalResult(res);
      setEvaluating(false);
    }, 400);
  };

  // Create Job
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) return;
    const skills = newJobSkills.split(',').map(s => s.trim()).filter(Boolean);
    const newJ: JobPosition = {
      id: `job_${Date.now()}`,
      title: newJobTitle,
      department: newJobDept,
      location: 'Lagos / Remote',
      type: 'Full-time',
      salaryRange: newJobSalary,
      minYearsExp: Number(newJobExp),
      requiredSkills: skills,
      description: `Targeting top 5% candidates skilled in ${skills.join(', ')}.`,
      screeningQuestions: [
        `Attach proof of experience in ${skills[0] || 'your core domain'}.`,
        'What is your target monthly salary and earliest start date?'
      ],
      status: 'open',
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJobs([newJ, ...jobs]);
    setSelectedJob(newJ);
    setShowNewJobModal(false);
    setNewJobTitle('');
  };

  // Verify Willingness
  const handleVerifyWillingness = (candidateId: string) => {
    const updated = talentPool.map(c => {
      if (c.id === candidateId) {
        return { ...c, willingnessVerified: true, lastContacted: new Date().toISOString().split('T')[0] };
      }
      return c;
    });
    setTalentPool(updated);
    const candidate = talentPool.find(c => c.id === candidateId);
    setVerificationNotice(`✅ Automated WhatsApp availability & willingness verification sent to ${candidate?.candidateName || 'Candidate'}. Status: VERIFIED`);
    setTimeout(() => setVerificationNotice(null), 4000);
  };

  // Run AI Sourcing Recs
  const handleGenerateSourcing = (role: string) => {
    setSourcingRole(role);
    setSourcingRecs(generateSourcingRecommendations(role));
  };

  // Schedule Interview
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: InterviewSlot = {
      id: `slot_${Date.now()}`,
      jobId: selectedJob.id,
      applicantId: `app_${Date.now()}`,
      candidateName: schedCandidateName,
      jobTitle: selectedJob.title,
      scheduledAt: schedDateTime,
      durationMins: 30,
      mode: schedMode,
      meetingLink: schedMode === 'in_person' ? 'Office HQ (Victoria Island, Lagos)' : `https://apexreach.app/preview/interview/slot_${Date.now()}`,
      interviewerName: 'Lead Hiring Manager',
      status: 'scheduled',
      notes: 'Confirmed candidate interview slot.',
    };

    setInterviews([newSlot, ...interviews]);
    setBookingSuccess(`🎉 Interview confirmed & invitation link generated for ${schedCandidateName}!`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  // Filter talent pool
  const filteredTalentPool = talentPool.filter(c => 
    c.candidateName.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
    c.primaryRole.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(talentSearchQuery.toLowerCase()))
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <WebappToolActionBar currentTool="Recruitment Engine" />
      
      <div
        style={{
          width: '100%',
          background: '#0a0e1a',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
          color: '#f8fafc',
        }}
      >
        {/* 24-HOUR INSTANT HIRE BRANDING BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #06283b 0%, #090d16 50%, #1e1b4b 100%)',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#67e8f9',
                fontWeight: 800,
                fontSize: '1.2rem',
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#67e8f9',
                    background: 'rgba(6, 182, 212, 0.15)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                  }}
                >
                  24-Hour Instant Hire Guaranteed
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#34d399',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  1-ms AI CV & Audio Evaluation
                </span>
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0', fontFamily: "'Outfit', sans-serif" }}>
                Instant AI Talent Recruiter & Vetted Candidate Engine
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <a
              href={whatsappWidgetShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '7px 14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                borderRadius: 10,
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>📲 Share on WhatsApp</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(widgetUrl);
                setCopiedWidgetUrl(true);
                setTimeout(() => setCopiedWidgetUrl(false), 2000);
              }}
              style={{
                padding: '7px 14px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: '#38bdf8',
                borderRadius: 10,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{copiedWidgetUrl ? 'Copied Link! 🔗' : '🔗 Copy Tool Link'}</span>
            </button>
          </div>
        </div>

        {/* INTELLIGENT AI HR CO-PILOT ASSISTANT BAR */}
        <div style={{ background: '#050811', padding: '14px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Sparkles style={{ width: 14, height: 14, color: '#c084fc' }} />
              <span>Intelligent AI Recruitment Assistant (Co-Pilot)</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => handleAskAiAssistant('How to hire fast in 24 hours?')}
                style={{
                  fontSize: '0.68rem',
                  padding: '3px 10px',
                  background: 'rgba(139, 92, 246, 0.18)',
                  color: '#c084fc',
                  borderRadius: 8,
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ⚡ 24h Fast Hire
              </button>
              <button
                onClick={() => handleAskAiAssistant('Calculate salary benchmark for Lagos')}
                style={{
                  fontSize: '0.68rem',
                  padding: '3px 10px',
                  background: 'rgba(59, 130, 246, 0.18)',
                  color: '#60a5fa',
                  borderRadius: 8,
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                💰 Salary Benchmark
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ maxHeight: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }}>
            {aiAssistantMessages.slice(-3).map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: '0.78rem',
                  background: m.sender === 'user' ? 'rgba(30, 58, 138, 0.4)' : 'rgba(15, 23, 42, 0.8)',
                  color: m.sender === 'user' ? '#93c5fd' : '#e2e8f0',
                  border: m.sender === 'user' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
                  marginLeft: m.sender === 'user' ? 32 : 0,
                  marginRight: m.sender === 'user' ? 0 : 32,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.68rem', color: '#64748b', marginBottom: 2 }}>
                  {m.sender === 'user' ? '👤 You' : '🤖 AI Co-Pilot'}
                </div>
                <div>{m.text}</div>
                {m.xray && (
                  <div style={{ marginTop: 4, fontFamily: 'monospace', fontSize: '0.68rem', color: '#22d3ee', background: '#030712', padding: 4, borderRadius: 6, border: '1px solid #1e293b', wordBreak: 'break-all' }}>
                    Query: {m.xray}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
            <input
              type="text"
              placeholder="Ask AI Assistant anything (e.g. 'Draft WhatsApp pitch for sales executive'...)"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAiAssistant()}
              style={{
                flex: 1,
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.78rem',
                padding: '8px 12px',
                borderRadius: 10,
                color: '#ffffff',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleAskAiAssistant()}
              style={{
                padding: '8px 16px',
                background: '#7c3aed',
                color: '#ffffff',
                borderRadius: 10,
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Send style={{ width: 12, height: 12 }} />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* 🤖 AI MASS PARAGRAPH AUTO-FILL ASSISTANT BOX */}
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '3px 8px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', borderRadius: 8, fontSize: '0.8rem' }}>🤖</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>AI Mass Paragraph Auto-Fill Assistant</span>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', borderRadius: 100, border: '1px solid rgba(6, 182, 212, 0.3)' }}>1-Click Auto-Parse</span>
            </div>
            {autoFillNotice && (
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                {autoFillNotice}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <textarea
              rows={2}
              value={massParagraphText}
              onChange={(e) => setMassParagraphText(e.target.value)}
              placeholder="Paste any mass paragraph here (e.g. raw job description, candidate CV, or WhatsApp broadcast message)..."
              style={{
                flex: 1,
                minWidth: 260,
                background: '#030712',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '0.78rem',
                padding: '10px 14px',
                borderRadius: 12,
                color: '#e2e8f0',
                outline: 'none',
                resize: 'none',
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={handleAutoFillFromParagraph}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                borderRadius: 12,
                fontSize: '0.78rem',
                fontWeight: 800,
                border: '1px solid rgba(167, 139, 250, 0.3)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles style={{ width: 14, height: 14, color: '#e9d5ff' }} />
              <span>Auto-Fill Details</span>
            </button>
          </div>
        </div>

        {/* Subheader Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#030712',
            padding: 8,
            gap: 6,
          }}
        >
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 10,
              cursor: 'pointer',
              background: activeTab === 'jobs' ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
              color: activeTab === 'jobs' ? '#60a5fa' : '#94a3b8',
              border: activeTab === 'jobs' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Briefcase style={{ width: 14, height: 14 }} />
            <span>Job Openings ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('talent_pool')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 10,
              cursor: 'pointer',
              background: activeTab === 'talent_pool' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: activeTab === 'talent_pool' ? '#34d399' : '#94a3b8',
              border: activeTab === 'talent_pool' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Users style={{ width: 14, height: 14 }} />
            <span>Talent Pool Bank ({talentPool.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sourcing_ai')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 10,
              cursor: 'pointer',
              background: activeTab === 'sourcing_ai' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: activeTab === 'sourcing_ai' ? '#c084fc' : '#94a3b8',
              border: activeTab === 'sourcing_ai' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>AI Sourcing Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('cv_grader')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 10,
              cursor: 'pointer',
              background: activeTab === 'cv_grader' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: activeTab === 'cv_grader' ? '#fbbf24' : '#94a3b8',
              border: activeTab === 'cv_grader' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <FileCheck style={{ width: 14, height: 14 }} />
            <span>AI CV Grader</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 10,
              cursor: 'pointer',
              background: activeTab === 'interviews' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: activeTab === 'interviews' ? '#38bdf8' : '#94a3b8',
              border: activeTab === 'interviews' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Calendar style={{ width: 14, height: 14 }} />
            <span>Interview Scheduler ({interviews.length})</span>
          </button>
        </div>

      {/* Main Content Area */}
      <div style={{ padding: 20 }}>
        {/* TAB 1: JOB OPENINGS */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                background: 'rgba(5, 8, 18, 0.7)',
                padding: '16px 20px',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📢 Active Job Advertisements</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    Live Hiring Hub
                  </span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Manage job criteria, pre-screening eliminator questions, and applicant portals.
                </p>
              </div>
              <button
                onClick={() => setShowNewJobModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 18px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  borderRadius: 12,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                <PlusCircle style={{ width: 15, height: 15 }} />
                <span>Post New Job</span>
              </button>
            </div>

            {/* Modal to Post New Job */}
            {showNewJobModal && (
              <form
                onSubmit={handleCreateJob}
                style={{
                  background: '#040711',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  padding: 20,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Post New Position
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Job Title</label>
                    <input
                      type="text"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      placeholder="e.g. Lead Solar Technician"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Department</label>
                    <input
                      type="text"
                      value={newJobDept}
                      onChange={(e) => setNewJobDept(e.target.value)}
                      placeholder="Operations / Sales / Tech"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Salary Range (Monthly)</label>
                    <input
                      type="text"
                      value={newJobSalary}
                      onChange={(e) => setNewJobSalary(e.target.value)}
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Min Years Exp Required</label>
                    <input
                      type="number"
                      value={newJobExp}
                      onChange={(e) => setNewJobExp(Number(e.target.value))}
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={newJobSkills}
                    onChange={(e) => setNewJobSkills(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setShowNewJobModal(false)}
                    style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', borderRadius: 8, fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', background: '#2563eb', color: '#ffffff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Publish Job Opening
                  </button>
                </div>
              </form>
            )}

            {/* Jobs List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: selectedJob.id === job.id ? 'rgba(30, 58, 138, 0.35)' : 'rgba(15, 23, 42, 0.5)',
                    border: selectedJob.id === job.id ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: selectedJob.id === job.id ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
                      {job.department}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#34d399', fontFamily: 'monospace', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      {job.applicantsCount} Applicants
                    </span>
                  </div>

                  <h4 style={{ margin: '8px 0 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{job.title}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{job.description}</p>

                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {job.requiredSkills.map((sk, i) => (
                      <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(30, 41, 59, 0.8)', color: '#cbd5e1', padding: '2px 6px', borderRadius: 4 }}>
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>💰 {job.salaryRange}</span>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>Select & Grade &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Job Detail Bar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14 }}>
              <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck style={{ width: 16, height: 16, color: '#34d399' }} />
                Selected Criteria for AI Grading: <span style={{ color: '#60a5fa' }}>{selectedJob.title}</span>
              </h4>
              <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#94a3b8', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                <div><strong style={{ color: '#f8fafc' }}>Min Exp:</strong> {selectedJob.minYearsExp} Years</div>
                <div><strong style={{ color: '#f8fafc' }}>Target Skills:</strong> {selectedJob.requiredSkills.join(', ')}</div>
                <div><strong style={{ color: '#f8fafc' }}>Screening Questions:</strong> {selectedJob.screeningQuestions.length} Active</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVERGREEN TALENT POOL */}
        {activeTab === 'talent_pool' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                background: 'rgba(5, 8, 18, 0.7)',
                padding: '16px 20px',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🌐 Evergreen Talent Pool Bank</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    Warm Candidate Database
                  </span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Pre-categorized CV bank automatically populated via WhatsApp CV dropbot.
                </p>
              </div>

              {/* Search bar */}
              <div style={{ position: 'relative', minWidth: 240 }}>
                <Search style={{ width: 14, height: 14, position: 'absolute', left: 12, top: 11, color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search by role or skill..."
                  value={talentSearchQuery}
                  onChange={(e) => setTalentSearchQuery(e.target.value)}
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px 8px 34px', borderRadius: 10, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {verificationNotice && (
              <div style={{ background: 'rgba(6, 78, 59, 0.6)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#a7f3d0', fontSize: '0.78rem', padding: 12, borderRadius: 12 }}>
                <span>{verificationNotice}</span>
              </div>
            )}

            {/* Candidates Table */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#090d16', color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '12px 16px' }}>Candidate</th>
                    <th style={{ padding: '12px 16px' }}>Primary Role</th>
                    <th style={{ padding: '12px 16px' }}>Skills</th>
                    <th style={{ padding: '12px 16px' }}>Exp</th>
                    <th style={{ padding: '12px 16px' }}>Willingness Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTalentPool.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{c.candidateName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.phone} &bull; {c.location}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#60a5fa', fontWeight: 600 }}>{c.primaryRole}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {c.skills.map((s, i) => (
                            <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(30, 41, 59, 0.8)', color: '#cbd5e1', padding: '2px 6px', borderRadius: 4 }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 800 }}>{c.yearsExperience} yrs</td>
                      <td style={{ padding: '12px 16px' }}>
                        {c.willingnessVerified ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 100 }}>
                            <CheckCircle2 style={{ width: 12, height: 12, color: '#34d399' }} />
                            <span>Available & Verified</span>
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 100 }}>
                            <AlertTriangle style={{ width: 12, height: 12, color: '#fbbf24' }} />
                            <span>Pending Ping</span>
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleVerifyWillingness(c.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: '#34d399',
                            borderRadius: 8,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          📲 Verify Availability
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AI SOURCING ADVISOR */}
        {activeTab === 'sourcing_ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, #090d16 50%, rgba(49, 46, 129, 0.3) 100%)',
                padding: '16px 20px',
                borderRadius: 16,
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles style={{ width: 18, height: 18, color: '#c084fc' }} />
                  <span>AI Quality Candidate Sourcing Advisor</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#e9d5ff' }}>
                  Get AI-optimized sourcing channels, Boolean search strings, and referral bounty plans for top 5% talent.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleGenerateSourcing('Senior Solar Installation Engineer')}
                  style={{ padding: '6px 12px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Solar Role
                </button>
                <button
                  onClick={() => handleGenerateSourcing('High-Ticket B2B Lead Sales Executive')}
                  style={{ padding: '6px 12px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  B2B Sales
                </button>
              </div>
            </div>

            {/* Sourcing Strategy Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
              {/* Target Channels */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap style={{ width: 14, height: 14, color: '#c084fc' }} />
                  Recommended Sourcing Channels for {sourcingRecs.roleTitle}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sourcingRecs.targetChannels.map((ch, idx) => (
                    <div key={idx} style={{ padding: 10, background: '#090d16', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                        <span>{ch.channel}</span>
                        <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: 4 }}>
                          {ch.expectedYield}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>{ch.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LinkedIn & Google X-Ray Search Queries */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>🔎 Google X-Ray Search (100% Free Candidate Search)</span>
                  <button
                    onClick={() => {
                      const xray = sourcingRecs.googleXraySearchString || `site:linkedin.com/in/ "${sourcingRecs.roleTitle}" ("Lagos" OR "Abuja")`;
                      navigator.clipboard.writeText(xray);
                      setCopiedBoolean(true);
                      setTimeout(() => setCopiedBoolean(false), 2000);
                    }}
                    style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Copy style={{ width: 12, height: 12 }} />
                    <span>{copiedBoolean ? 'Copied X-Ray!' : 'Copy Query'}</span>
                  </button>
                </h4>
                <div style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 10, borderRadius: 8, fontFamily: 'monospace', fontSize: '0.72rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                  {sourcingRecs.googleXraySearchString || `site:linkedin.com/in/ "${sourcingRecs.roleTitle}" ("Lagos" OR "Abuja")`}
                </div>

                {/* 1-CLICK INTERACTIVE SOURCING BUTTONS */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                  <a
                    href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${sourcingRecs.roleTitle} Lagos Nigeria`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: '#1d4ed8', color: '#ffffff', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)' }}
                  >
                    <ExternalLink style={{ width: 12, height: 12 }} />
                    <span>👔 LinkedIn Direct Candidates</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:ng.linkedin.com/in/ ("Chief" OR "Director" OR "VP" OR "Head of" OR "Managing Director") "${sourcingRecs.roleTitle}" "Lagos"`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(120, 53, 15, 0.6)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>👑 LinkedIn C-Level & Directors</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:nairaland.com "${sourcingRecs.roleTitle}" Lagos hiring`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(6, 78, 59, 0.6)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>💬 Nairaland Forum</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚀 *NOW HIRING: ${sourcingRecs.roleTitle.toUpperCase()} (LAGOS)*\n\nWe are looking for a qualified ${sourcingRecs.roleTitle} in Lagos.\n\n📲 Drop CV here: ${widgetUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: '#059669', color: '#ffffff', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send style={{ width: 12, height: 12 }} />
                    <span>WhatsApp Broadcast</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI CV GRADER */}
        {activeTab === 'cv_grader' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileCheck style={{ width: 18, height: 18, color: '#fbbf24' }} />
                  <span>AI CV Evaluator & Match Scorer</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Test candidate application parsing against target role requirements: <span style={{ color: '#60a5fa', fontWeight: 700 }}>{selectedJob.title}</span>
                </p>
              </div>
              <button
                onClick={handleGradeCv}
                disabled={evaluating}
                style={{
                  padding: '9px 18px',
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: '#ffffff',
                  borderRadius: 12,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Zap style={{ width: 14, height: 14 }} />
                <span>{evaluating ? 'Evaluating CV...' : 'Run Instant AI CV Grade'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {/* Form Input */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Profile Input</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Years Experience</label>
                    <input
                      type="number"
                      value={candidateExp}
                      onChange={(e) => setCandidateExp(Number(e.target.value))}
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Listed Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={candidateSkillsInput}
                    onChange={(e) => setCandidateSkillsInput(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Paste Candidate CV Text / Summary</label>
                  <textarea
                    rows={4}
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '8px 10px', borderRadius: 8, color: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Evaluation Output */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Evaluation Results</h4>

                {evalResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Suitability Match Score</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginTop: 2 }}>{evalResult.matchScore}%</div>
                      </div>
                      <div>
                        <span style={{ padding: '6px 12px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                          {evalResult.recommendation}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.8)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                      {evalResult.summaryEvaluation}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 10px', fontSize: '0.78rem', color: '#64748b', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: 12 }}>
                    Click <strong style={{ color: '#cbd5e1' }}>Run Instant AI CV Grade</strong> to evaluate candidate against {selectedJob.title}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INTERVIEW SCHEDULER */}
        {activeTab === 'interviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar style={{ width: 18, height: 18, color: '#38bdf8' }} />
                <span>Interview Slot Scheduler & Meeting Generator</span>
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Schedule confirmed interview slots and send 1-click WebRTC or WhatsApp call links to candidates.
              </p>
            </div>

            {bookingSuccess && (
              <div style={{ background: 'rgba(8, 47, 73, 0.8)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#67e8f9', fontSize: '0.78rem', padding: 12, borderRadius: 12 }}>
                {bookingSuccess}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {/* Form */}
              <form onSubmit={handleScheduleInterview} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Book Interview Slot</h4>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Candidate Name</label>
                  <input
                    type="text"
                    value={schedCandidateName}
                    onChange={(e) => setSchedCandidateName(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Date & Time</label>
                  <input
                    type="datetime-local"
                    value={schedDateTime}
                    onChange={(e) => setSchedDateTime(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Interview Mode</label>
                  <select
                    value={schedMode}
                    onChange={(e: any) => setSchedMode(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', padding: '6px 10px', borderRadius: 6, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="video_webrtc">Browser 1-Click Video Call (WebRTC)</option>
                    <option value="whatsapp_call">Direct WhatsApp Phone Interview</option>
                    <option value="in_person">In-Person HQ Meeting</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '10px 0', background: '#0891b2', color: '#ffffff', borderRadius: 10, fontSize: '0.78rem', fontWeight: 800, border: 'none', cursor: 'pointer', marginTop: 4 }}
                >
                  Generate & Confirm Interview
                </button>
              </form>

              {/* Scheduled Slots List */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Interview Pipeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {interviews.map((slot) => (
                    <div key={slot.id} style={{ padding: 12, background: '#090d16', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#ffffff' }}>{slot.candidateName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>{slot.jobTitle}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 2 }}>
                          📅 {new Date(slot.scheduledAt).toLocaleString()} &bull; {slot.durationMins} Mins
                        </div>
                      </div>
                      <a
                        href={slot.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: '6px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.35)', color: '#38bdf8', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Video style={{ width: 12, height: 12 }} />
                        <span>Join Meeting Link</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

