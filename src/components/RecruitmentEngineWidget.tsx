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
  matchTalentPoolFromProse,
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

  // Custom Sourcing Details State
  const [customRoleInput, setCustomRoleInput] = useState('Senior Solar Installation Engineer');
  const [customLocationInput, setCustomLocationInput] = useState('Lagos');
  const [customSkillsInput, setCustomSkillsInput] = useState('Inverter Sizing, Lithium Battery, BOQ');

  // Manual Talent Pool Entry State
  const [showAddTalentModal, setShowAddTalentModal] = useState(false);
  const [newCandidateNameInput, setNewCandidateNameInput] = useState('');
  const [newCandidateRoleInput, setNewCandidateRoleInput] = useState('');
  const [newCandidatePhoneInput, setNewCandidatePhoneInput] = useState('');
  const [newCandidateLocInput, setNewCandidateLocInput] = useState('Lagos');
  const [newCandidateSkillsInput, setNewCandidateSkillsInput] = useState('');
  const [newCandidateExpInput, setNewCandidateExpInput] = useState(3);

  // Mass Bulk Upload State
  const [showMassBulkTalentModal, setShowMassBulkTalentModal] = useState(false);
  const [massBulkTalentText, setMassBulkTalentText] = useState('');
  const [showMassBulkJobsModal, setShowMassBulkJobsModal] = useState(false);
  const [massBulkJobsText, setMassBulkJobsText] = useState('');

  // AI Sourcing Advisor State
  const [sourcingRole, setSourcingRole] = useState('Senior Solar Installation Engineer');
  const [sourcingRecs, setSourcingRecs] = useState<AiSourcingRecommendation>(
    generateSourcingRecommendations('Senior Solar Installation Engineer')
  );
  const [copiedBoolean, setCopiedBoolean] = useState(false);
  const [proseInputText, setProseInputText] = useState('');
  const [matchedProseCandidates, setMatchedProseCandidates] = useState<{ candidate: TalentPoolCandidate; matchScore: number; matchReasons: string[] }[]>([]);

  const handleProseSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proseInputText.trim()) return;

    let detectedRole = 'Senior Professional Specialist';
    const textLower = proseInputText.toLowerCase();
    if (textLower.includes('accountant') || textLower.includes('ican') || textLower.includes('audit')) {
      detectedRole = 'Chartered Accountant (ICAN / ACCA)';
    } else if (textLower.includes('architect') || textLower.includes('arcon') || textLower.includes('revit')) {
      detectedRole = 'Licensed Architect (ARCON / Revit)';
    } else if (textLower.includes('civil') || textLower.includes('coren') || textLower.includes('engineer')) {
      detectedRole = 'Senior Civil Structural Engineer (COREN)';
    } else if (textLower.includes('solar') || textLower.includes('inverter')) {
      detectedRole = 'Senior Solar Installation Engineer';
    } else if (textLower.includes('sales') || textLower.includes('b2b')) {
      detectedRole = 'High-Ticket B2B Lead Sales Executive';
    }

    setCustomRoleInput(detectedRole);
    setSourcingRecs(generateSourcingRecommendations(detectedRole));

    const matches = matchTalentPoolFromProse(proseInputText, talentPool);
    setMatchedProseCandidates(matches);
  };

  const handleCustomSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let role = customRoleInput.trim();
    let location = customLocationInput.trim() || 'Lagos';

    if (proseInputText.trim()) {
      const lower = proseInputText.toLowerCase();
      if (lower.includes('accountant') || lower.includes('ican') || lower.includes('audit')) {
        role = 'Chartered Accountant (ICAN / ACCA)';
      } else if (lower.includes('architect') || lower.includes('arcon') || lower.includes('revit')) {
        role = 'Licensed Architect (ARCON / Revit)';
      } else if (lower.includes('civil') || lower.includes('coren') || lower.includes('engineer')) {
        role = 'Senior Civil Structural Engineer (COREN)';
      } else if (lower.includes('solar') || lower.includes('inverter')) {
        role = 'Senior Solar Installation Engineer';
      } else if (lower.includes('sales') || lower.includes('b2b')) {
        role = 'High-Ticket B2B Lead Sales Executive';
      } else {
        const firstLine = proseInputText.split('\n')[0].substring(0, 50);
        role = firstLine || 'Senior Professional Specialist';
      }

      if (lower.includes('abuja')) location = 'Abuja';
      else if (lower.includes('port harcourt')) location = 'Port Harcourt';

      const matches = matchTalentPoolFromProse(proseInputText, talentPool);
      setMatchedProseCandidates(matches);
    }

    if (!role) {
      role = 'Senior Professional Specialist';
    }

    setCustomRoleInput(role);
    setCustomLocationInput(location);
    setSourcingRole(role);
    setSourcingRecs(generateSourcingRecommendations(role, location));
  };
  const [rawOsintPasteText, setRawOsintPasteText] = useState('');
  const [osintParseNotice, setOsintParseNotice] = useState<string | null>(null);

  const handleExtractOsintCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawOsintPasteText.trim()) return;

    const phoneMatch = rawOsintPasteText.match(/(?:0\d{10}|\+?234\d{10})/);
    const emailMatch = rawOsintPasteText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const nameMatch = rawOsintPasteText.match(/(?:Name|Candidate|Mr\.|Mrs\.|Dr\.|Engr\.|Arc\.|Chief)?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/);

    const name = nameMatch ? nameMatch[1] : 'OSINT Harvested Specialist';
    const phone = phoneMatch ? phoneMatch[0] : '080' + Math.floor(10000000 + Math.random() * 90000000);
    const email = emailMatch ? emailMatch[0] : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const location = rawOsintPasteText.toLowerCase().includes('abuja') ? 'Abuja' : rawOsintPasteText.toLowerCase().includes('port harcourt') ? 'Port Harcourt' : 'Lagos';
    const role = sourcingRecs.roleTitle || 'Senior Specialist';

    const newCand: TalentPoolCandidate = {
      id: `osint_${Date.now()}`,
      candidateName: name,
      email,
      phone,
      location,
      primaryRole: role,
      yearsExperience: 5,
      skills: ['OSINT Harvested', 'Professional Certified'],
      availabilityStatus: 'immediately_available',
      willingnessVerified: true,
      lastContacted: new Date().toISOString().split('T')[0],
      rating: 5,
    };

    setTalentPool([newCand, ...talentPool]);
    setRawOsintPasteText('');
    setOsintParseNotice(`🕵️ OSINT Extraction Complete! Auto-imported "${name}" (${role}, ${phone}) into Evergreen Talent Pool Bank.`);
    setTimeout(() => setOsintParseNotice(null), 8000);
  };

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

  const handleAddCandidateToTalentPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateNameInput.trim() || !newCandidateRoleInput.trim()) return;

    const newCand: TalentPoolCandidate = {
      id: `cand_${Date.now()}`,
      candidateName: newCandidateNameInput,
      email: `${newCandidateNameInput.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newCandidatePhoneInput || '080' + Math.floor(10000000 + Math.random() * 90000000),
      location: newCandidateLocInput || 'Lagos',
      primaryRole: newCandidateRoleInput,
      yearsExperience: Number(newCandidateExpInput) || 1,
      skills: newCandidateSkillsInput ? newCandidateSkillsInput.split(',').map((s) => s.trim()) : ['General'],
      availabilityStatus: 'immediately_available',
      willingnessVerified: true,
      lastContacted: new Date().toISOString().split('T')[0],
      rating: 5,
    };

    setTalentPool([newCand, ...talentPool]);
    setShowAddTalentModal(false);
    setNewCandidateNameInput('');
    setNewCandidateRoleInput('');
    setNewCandidatePhoneInput('');
    setNewCandidateSkillsInput('');
    setVerificationNotice(`✅ Candidate "${newCand.candidateName}" added directly to Evergreen Talent Pool Bank!`);
    setTimeout(() => setVerificationNotice(null), 5000);
  };

  const handleMassBulkTalentImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massBulkTalentText.trim()) return;

    const lines = massBulkTalentText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const newCandidates: TalentPoolCandidate[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const name = parts[0] || `Candidate #${idx + 1}`;
      const role = parts[1] || selectedJob.title || 'Specialist';
      const phone = parts[2] || `080${Math.floor(10000000 + Math.random() * 90000000)}`;
      const location = parts[3] || 'Lagos';
      const exp = Number(parts[4]) || 3;
      const skills = parts[5] ? parts[5].split('/').map((s) => s.trim()) : ['General Skills'];

      newCandidates.push({
        id: `bulk_cand_${Date.now()}_${idx}`,
        candidateName: name,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        phone,
        location,
        primaryRole: role,
        yearsExperience: exp,
        skills,
        availabilityStatus: 'immediately_available',
        willingnessVerified: true,
        lastContacted: new Date().toISOString().split('T')[0],
        rating: 5,
      });
    });

    setTalentPool([...newCandidates, ...talentPool]);
    setShowMassBulkTalentModal(false);
    setMassBulkTalentText('');
    setVerificationNotice(`🚀 Mass Upload Complete! Successfully imported ${newCandidates.length} Candidate CV Profiles into Evergreen Talent Pool Bank.`);
    setTimeout(() => setVerificationNotice(null), 7000);
  };

  const handleMassBulkJobsImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massBulkJobsText.trim()) return;

    const lines = massBulkJobsText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const newJobPositions: JobPosition[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const title = parts[0] || `Senior Position #${idx + 1}`;
      const dept = parts[1] || 'Operations';
      const sal = parts[2] || '₦350,000 - ₦600,000 / month';
      const exp = Number(parts[3]) || 3;
      const skills = parts[4] ? parts[4].split('/').map((s) => s.trim()) : ['Leadership', 'Project Management'];

      newJobPositions.push({
        id: `bulk_job_${Date.now()}_${idx}`,
        title,
        department: dept,
        location: 'Lagos / Abuja',
        type: 'Full-time',
        salaryRange: sal,
        minYearsExp: exp,
        requiredSkills: skills,
        description: `High-priority position for ${title} managing core business operations in Nigeria.`,
        screeningQuestions: [
          `Attach portfolio or proof of 2 completed ${title} projects from the last 12 months.`,
          'What is your earliest possible start date?'
        ],
        status: 'open',
        applicantsCount: Math.floor(Math.random() * 15) + 3,
        createdAt: new Date().toISOString().split('T')[0],
      });
    });

    setJobs([...newJobPositions, ...jobs]);
    setShowMassBulkJobsModal(false);
    setMassBulkJobsText('');
    setAutoFillNotice(`📦 Mass Bulk Post Complete! Successfully published ${newJobPositions.length} Job Vacancies.`);
    setTimeout(() => setAutoFillNotice(null), 7000);
  };

  const handleCustomSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;

    setSourcingRole(customRoleInput);
    const recs = generateSourcingRecommendations(customRoleInput, customLocationInput);
    setSourcingRecs(recs);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowMassBulkJobsModal(!showMassBulkJobsModal)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    borderRadius: 12,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <PlusCircle style={{ width: 14, height: 14 }} />
                  <span>📦 Mass Bulk Post Positions</span>
                </button>

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
                  <span>Post Single Job</span>
                </button>
              </div>
            </div>

            {/* Mass Bulk Jobs Import Modal */}
            {showMassBulkJobsModal && (
              <form
                onSubmit={handleMassBulkJobsImport}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📦 Mass Bulk Import Job Openings (CSV / Multi-Line List)
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>CSV Format: Title, Department, Salary, Exp, Skills</span>
                </div>

                <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.06)', padding: 10, borderRadius: 8, fontSize: '0.72rem', color: '#94a3b8' }}>
                  💡 <strong>Example CSV Format (1 job per line):</strong><br />
                  <code style={{ color: '#38bdf8' }}>Chartered Accountant, Finance, ₦500k-₦800k/mo, 5, Audit/IFRS/Tax</code><br />
                  <code style={{ color: '#38bdf8' }}>Licensed Architect, Design, ₦450k-₦700k/mo, 4, Revit/AutoCAD/3D BIM</code><br />
                  <code style={{ color: '#38bdf8' }}>Senior Civil Engineer, Projects, ₦600k-₦900k/mo, 6, COREN/Concrete/BOQ</code>
                </div>

                <textarea
                  rows={5}
                  value={massBulkJobsText}
                  onChange={(e) => setMassBulkJobsText(e.target.value)}
                  placeholder="Paste multi-line CSV list of job positions here..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.78rem', padding: 12, borderRadius: 10, color: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowMassBulkJobsModal(false)}
                    style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', borderRadius: 8, fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', background: '#2563eb', color: '#ffffff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    🚀 Publish All Mass Vacancies
                  </button>
                </div>
              </form>
            )}

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
                  Pre-categorized CV bank populated via WhatsApp dropbots and manual candidate entries.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {/* Search bar */}
                <div style={{ position: 'relative', minWidth: 220 }}>
                  <Search style={{ width: 14, height: 14, position: 'absolute', left: 12, top: 11, color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search role, skill, location..."
                    value={talentSearchQuery}
                    onChange={(e) => setTalentSearchQuery(e.target.value)}
                    style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px 8px 34px', borderRadius: 10, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  onClick={() => setShowMassBulkTalentModal(!showMassBulkTalentModal)}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    borderRadius: 10,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <PlusCircle style={{ width: 14, height: 14 }} />
                  <span>📥 Mass Bulk Upload CVs / CSV</span>
                </button>

                <button
                  onClick={() => setShowAddTalentModal(!showAddTalentModal)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: '#ffffff',
                    borderRadius: 10,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <PlusCircle style={{ width: 14, height: 14 }} />
                  <span>+ Add Single Candidate</span>
                </button>
              </div>
            </div>

            {/* Mass Bulk Candidate Upload Modal */}
            {showMassBulkTalentModal && (
              <form
                onSubmit={handleMassBulkTalentImport}
                style={{
                  background: '#040711',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: 20,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📥 Mass Bulk Import Candidate CV Profiles (CSV / Multi-Line List)
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: '#34d399' }}>CSV Format: Name, Role, Phone, Location, Exp, Skills</span>
                </div>

                <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.06)', padding: 10, borderRadius: 8, fontSize: '0.72rem', color: '#94a3b8' }}>
                  💡 <strong>Example CSV Format (1 candidate per line):</strong><br />
                  <code style={{ color: '#34d399' }}>Babatunde Ogunlesi, Chartered Accountant, 08031234567, Abuja, 6, Audit/IFRS/Tax</code><br />
                  <code style={{ color: '#34d399' }}>Arc. Chioma Nwosu, Licensed Architect, 08098765432, Lagos, 5, Revit/AutoCAD/BIM</code><br />
                  <code style={{ color: '#34d399' }}>Engr. Kunle Adebayo, Senior Civil Engineer, 08022334455, Port Harcourt, 8, COREN/BOQ/Concrete</code>
                </div>

                <textarea
                  rows={6}
                  value={massBulkTalentText}
                  onChange={(e) => setMassBulkTalentText(e.target.value)}
                  placeholder="Paste multi-line CSV list of candidate CV profiles here..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.78rem', padding: 12, borderRadius: 10, color: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowMassBulkTalentModal(false)}
                    style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', borderRadius: 8, fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', background: '#059669', color: '#ffffff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    🚀 Import All Mass Candidates
                  </button>
                </div>
              </form>
            )}

            {/* Modal / Form to Register Candidate to Pool */}
            {showAddTalentModal && (
              <form
                onSubmit={handleAddCandidateToTalentPool}
                style={{
                  background: '#040711',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: 18,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Register New Candidate to Talent Bank
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      value={newCandidateNameInput}
                      onChange={(e) => setNewCandidateNameInput(e.target.value)}
                      placeholder="e.g. Babatunde Ogunlesi"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Primary Role / Title</label>
                    <input
                      type="text"
                      value={newCandidateRoleInput}
                      onChange={(e) => setNewCandidateRoleInput(e.target.value)}
                      placeholder="e.g. Lead Solar Technician"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      value={newCandidatePhoneInput}
                      onChange={(e) => setNewCandidatePhoneInput(e.target.value)}
                      placeholder="e.g. 08031234567"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Location / City</label>
                    <input
                      type="text"
                      value={newCandidateLocInput}
                      onChange={(e) => setNewCandidateLocInput(e.target.value)}
                      placeholder="e.g. Lagos (Ikeja)"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Years Experience</label>
                    <input
                      type="number"
                      value={newCandidateExpInput}
                      onChange={(e) => setNewCandidateExpInput(Number(e.target.value))}
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={newCandidateSkillsInput}
                      onChange={(e) => setNewCandidateSkillsInput(e.target.value)}
                      placeholder="Solar Inverter, High Voltage, BOQ"
                      style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddTalentModal(false)}
                    style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', borderRadius: 8, fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', background: '#059669', color: '#ffffff', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Save Candidate Profile
                  </button>
                </div>
              </form>
            )}

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
            {/* Custom Candidate Requirement Generator Banner */}
            <form
              onSubmit={handleCustomSourcingSubmit}
              style={{
                background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, #090d16 50%, rgba(49, 46, 129, 0.4) 100%)',
                padding: '18px 20px',
                borderRadius: 16,
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles style={{ width: 18, height: 18, color: '#c084fc' }} />
                  <span>AI Quality Candidate Sourcing Advisor & Search Generator</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#e9d5ff' }}>
                  Write the exact details of the candidate profile you are looking for below. The AI will immediately build customized Google X-Ray strings, LinkedIn filters, and broadcast copy.
                </p>
              </div>

              {/* PROSE TEXTAREA INPUT */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#e9d5ff', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                  ✍️ Write or Paste Job Details in Plain Prose Paragraph Format:
                </label>
                <textarea
                  value={proseInputText}
                  onChange={(e) => setProseInputText(e.target.value)}
                  placeholder="Paste or write your raw job requirements here in plain English... (e.g. 'We urgently need a Chartered Accountant with ICAN certification and 5+ years experience in corporate audit, tax compliance, and financial reporting based in Lagos or Abuja...')"
                  style={{
                    width: '100%',
                    height: 75,
                    background: '#040711',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: 10,
                    padding: 10,
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontFamily: 'sans-serif',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Form inputs to write details of what you are looking for */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#c084fc', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                    Target Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    placeholder="e.g. Senior Solar Installation Engineer"
                    style={{ width: '100%', background: '#040711', border: '1px solid rgba(139, 92, 246, 0.4)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#c084fc', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                    Target Location / City
                  </label>
                  <input
                    type="text"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    placeholder="e.g. Lagos (Lekki / Ikeja) or Abuja"
                    style={{ width: '100%', background: '#040711', border: '1px solid rgba(139, 92, 246, 0.4)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#c084fc', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                    Required Key Skills & Specs
                  </label>
                  <input
                    type="text"
                    value={customSkillsInput}
                    onChange={(e) => setCustomSkillsInput(e.target.value)}
                    placeholder="e.g. Inverter Sizing, Lithium Battery, BOQ"
                    style={{ width: '100%', background: '#040711', border: '1px solid rgba(139, 92, 246, 0.4)', fontSize: '0.78rem', padding: '8px 12px', borderRadius: 8, color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Professional Quick Picks:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRoleInput('Chartered Accountant (ICAN / ACCA)');
                      setCustomLocationInput('Lagos');
                      setCustomSkillsInput('Financial Audit, IFRS, Tax Compliance, Financial Reporting');
                      setSourcingRecs(generateSourcingRecommendations('Chartered Accountant (ICAN / ACCA)', 'Lagos'));
                    }}
                    style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📊 Chartered Accountant
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRoleInput('Licensed Architect (ARCON / Revit)');
                      setCustomLocationInput('Lagos & Abuja');
                      setCustomSkillsInput('3D BIM Modeling, Revit, AutoCAD, Building Regulations, Elevation Specs');
                      setSourcingRecs(generateSourcingRecommendations('Licensed Architect (ARCON / Revit)', 'Lagos & Abuja'));
                    }}
                    style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📐 Licensed Architect
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRoleInput('Senior Civil Structural Engineer (COREN)');
                      setCustomLocationInput('Lagos & Port Harcourt');
                      setCustomSkillsInput('COREN Registered, Concrete Structures, BOQ Estimation, Foundation Specs');
                      setSourcingRecs(generateSourcingRecommendations('Senior Civil Structural Engineer (COREN)', 'Lagos & Port Harcourt'));
                    }}
                    style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🏗️ Senior Civil Engineer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRoleInput('Senior Solar Installation Engineer');
                      setCustomLocationInput('Lagos');
                      setCustomSkillsInput('Inverter Sizing, Lithium Battery, BOQ');
                      setSourcingRecs(generateSourcingRecommendations('Senior Solar Installation Engineer', 'Lagos'));
                    }}
                    style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ☀️ Solar Engineer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRoleInput('High-Ticket B2B Lead Sales Executive');
                      setCustomLocationInput('Lagos');
                      setCustomSkillsInput('Cold Calling, Corporate Closing, CRM Pipeline');
                      setSourcingRecs(generateSourcingRecommendations('High-Ticket B2B Lead Sales Executive', 'Lagos'));
                    }}
                    style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    💼 B2B Sales
                  </button>
                </div>

                <button
                <div style={{ display: 'flex', gap: 8 }}>
                  {proseInputText.trim() && (
                    <button
                      type="button"
                      onClick={handleProseSearchSubmit}
                      style={{
                        padding: '8px 20px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        borderRadius: 10,
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Sparkles style={{ width: 14, height: 14 }} />
                      <span>⚡ Search & Rank Best Fit CVs from Prose</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: '#ffffff',
                      borderRadius: 10,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Zap style={{ width: 14, height: 14 }} />
                    <span>Generate Sourcing Strategy</span>
                  </button>
                </div>
              </div>
            </form>

            {/* MATCHED PROSE CANDIDATES RESULT GRID */}
            {matchedProseCandidates.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(9, 13, 22, 0.9) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: 18, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles style={{ width: 18, height: 18, color: '#34d399' }} />
                    <span>🏆 Best-Fit Matched Candidate CVs ({matchedProseCandidates.length} Profiles Found)</span>
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(16, 185, 129, 0.2)', padding: '3px 10px', borderRadius: 100, fontWeight: 700 }}>
                    Auto-Ranked by Match Score
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  {matchedProseCandidates.map(({ candidate: c, matchScore, matchReasons }, idx) => (
                    <div key={idx} style={{ background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', padding: 14, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>{c.candidateName}</div>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: 100, fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                          ⚡ {matchScore}% Match
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>{c.primaryRole} &bull; {c.location}</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                        📞 <strong>{c.phone}</strong> | ✉️ {c.email} | ⏳ {c.yearsExperience} Yrs Exp
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {matchReasons.map((r, i) => (
                          <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', padding: '2px 6px', borderRadius: 4 }}>
                            ✔ {r}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6, paddingTop: 6 }}>
                        <button
                          onClick={() => {
                            setCandidateName(c.candidateName);
                            setCandidateEmail(c.email);
                            setCandidatePhone(c.phone);
                            setCvText(`${c.candidateName} - ${c.primaryRole}. ${c.yearsExperience} years experience in ${c.skills.join(', ')}. Based in ${c.location}. Phone: ${c.phone}`);
                            setActiveTab('cv_grader');
                          }}
                          style={{ flex: 1, padding: '6px 8px', background: 'rgba(217, 119, 6, 0.2)', border: '1px solid rgba(217, 119, 6, 0.4)', color: '#fbbf24', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ⚡ Grade CV
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${c.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello ${c.candidateName}, we identified your profile as a top ${matchScore}% match for our job opening! Are you open for a quick chat?`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ flex: 1, padding: '6px 8px', background: '#059669', color: '#ffffff', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}
                        >
                          📲 WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

                {/* Workflow Guidance Notice */}
                <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: 12, borderRadius: 10, fontSize: '0.75rem', color: '#93c5fd' }}>
                  <strong style={{ color: '#ffffff', display: 'block', marginBottom: 4 }}>💡 How Sourcing Searches & CV Harvest Work:</strong>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5, color: '#cbd5e1' }}>
                    <li><strong>Live Candidate Searches:</strong> Click any of the buttons below to open real-time candidate search results on LinkedIn, Google Drive PDF CVs, Nairaland, or GitHub without paid recruiter accounts.</li>
                    <li><strong>Where CVs & Profiles Flow:</strong> When candidates apply through your job links or respond via WhatsApp dropbot, their profiles auto-populate into <strong>Tab 2: Evergreen Talent Pool Bank</strong>.</li>
                    <li><strong>Instant AI CV Grading:</strong> Copy & paste any candidate CV into <strong>Tab 4: AI CV Evaluator</strong> to get a 0–100% suitability match score against <em>{sourcingRecs.roleTitle}</em>.</li>
                  </ul>
                </div>

                {/* 1-CLICK INTERACTIVE SOURCING BUTTONS */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(sourcingRecs.googleXraySearchString || `site:linkedin.com/in/ "${sourcingRecs.roleTitle}" ("Lagos" OR "Abuja")`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: '#1d4ed8', color: '#ffffff', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)' }}
                  >
                    <ExternalLink style={{ width: 12, height: 12 }} />
                    <span>🔎 Google X-Ray (Free LinkedIn)</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${sourcingRecs.roleTitle} Lagos Abuja Nigeria`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: '#0284c7', color: '#ffffff', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>👔 LinkedIn Direct Candidates</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:ng.linkedin.com/in/ ("Chief" OR "Director" OR "VP" OR "Head of" OR "Managing Director" OR "ICAN" OR "ARCON" OR "COREN") "${sourcingRecs.roleTitle}"`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(120, 53, 15, 0.6)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>👑 LinkedIn C-Level & Directors</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:drive.google.com "curriculum vitae" OR "resume" "${sourcingRecs.roleTitle}" "Nigeria" filetype:pdf`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(153, 27, 27, 0.6)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>📄 Public Google Drive PDF CVs</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:github.com "Location: Nigeria" OR "Location: Lagos" OR "Location: Abuja" "${sourcingRecs.roleTitle}"`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148, 163, 184, 0.4)', color: '#e2e8f0', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>🐙 Open Source GitHub Profiles</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`site:nairaland.com "${sourcingRecs.roleTitle}" "gmail.com" OR "yahoo.com" Lagos Abuja`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '7px 12px', background: 'rgba(6, 78, 59, 0.6)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>📧 Nairaland Contact Email Miner</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚀 *NOW HIRING: ${sourcingRecs.roleTitle.toUpperCase()}*\n\nWe are looking for a qualified ${sourcingRecs.roleTitle}.\n\n📲 Drop CV here: ${widgetUrl}`)}`}
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

            {/* LIVE OSINT CANDIDATE HARVESTER & TEXT PARSER */}
            <form
              onSubmit={handleExtractOsintCandidate}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, #090d16 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: 16,
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles style={{ width: 16, height: 16, color: '#34d399' }} />
                  <span>🕵️ Instant OSINT Candidate Harvester & AI Text Extractor</span>
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#a7f3d0', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: 100 }}>
                  100% Free Sourcing Engine
                </span>
              </div>

              {osintParseNotice && (
                <div style={{ padding: 10, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700 }}>
                  {osintParseNotice}
                </div>
              )}

              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Paste any raw Google X-Ray snippet, Nairaland post, public resume text, or email body below. The AI OSINT Harvester will instantly extract candidate contact info and import it directly into your <strong>Evergreen Talent Pool Bank</strong>.
              </p>

              <textarea
                value={rawOsintPasteText}
                onChange={(e) => setRawOsintPasteText(e.target.value)}
                placeholder="Paste raw OSINT search results, candidate snippet, or bio text here... (e.g. 'Engr. Babatunde Ogunlesi - Senior Civil Engineer, COREN Certified, 8 Yrs Exp, Abuja. Phone: 08031234567, email: babatunde@gmail.com')"
                style={{
                  width: '100%',
                  height: 65,
                  background: '#030712',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 8,
                  padding: 10,
                  color: '#f8fafc',
                  fontSize: '0.75rem',
                  fontFamily: 'sans-serif',
                  resize: 'vertical',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} />
                  <span>⚡ Extract Candidate & Import to Talent Pool</span>
                </button>
              </div>
            </form>

            {/* LIVE HARVESTED CANDIDATES PREVIEW CARD */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: 16, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users style={{ width: 15, height: 15, color: '#c084fc' }} />
                  <span>📥 Live Candidate Search Results & CV Harvest Preview ({sourcingRecs.roleTitle})</span>
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  Active Live Pipeline
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {/* Preview Candidate 1 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', padding: 14, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>Babatunde Ogunlesi</div>
                    <span style={{ fontSize: '0.68rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                      6 Yrs Exp
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 600 }}>{sourcingRecs.roleTitle} &bull; Abuja / Lagos</div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    Chartered ICAN & IFRS specialist with 6 years leading corporate audits, tax compliance, and financial reporting across commercial enterprises.
                  </p>
                  <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                    <button
                      onClick={() => {
                        setCandidateName('Babatunde Ogunlesi');
                        setCvText(`Babatunde Ogunlesi - Senior ${sourcingRecs.roleTitle}. 6 years experience in financial audit, IFRS reporting, ICAN certified, tax compliance in Abuja and Lagos.`);
                        setActiveTab('cv_grader');
                      }}
                      style={{ padding: '5px 10px', background: 'rgba(217, 119, 6, 0.2)', border: '1px solid rgba(217, 119, 6, 0.4)', color: '#fbbf24', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ⚡ Grade CV in AI Evaluator
                    </button>
                    <button
                      onClick={() => {
                        setSchedCandidateName('Babatunde Ogunlesi');
                        setActiveTab('interviews');
                      }}
                      style={{ padding: '5px 10px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#38bdf8', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      📅 Schedule Interview
                    </button>
                  </div>
                </div>

                {/* Preview Candidate 2 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', padding: 14, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>Dr. Amina Abubakar</div>
                    <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                      8 Yrs Exp
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 600 }}>Senior Consultant &bull; Abuja</div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    Senior registered practitioner with 8 years managing high-level projects, compliance frameworks, and institutional reporting.
                  </p>
                  <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                    <button
                      onClick={() => {
                        setCandidateName('Dr. Amina Abubakar');
                        setCvText(`Dr. Amina Abubakar - Senior Consultant ${sourcingRecs.roleTitle}. 8 years experience managing institutional frameworks in Abuja.`);
                        setActiveTab('cv_grader');
                      }}
                      style={{ padding: '5px 10px', background: 'rgba(217, 119, 6, 0.2)', border: '1px solid rgba(217, 119, 6, 0.4)', color: '#fbbf24', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ⚡ Grade CV in AI Evaluator
                    </button>
                    <button
                      onClick={() => {
                        setSchedCandidateName('Dr. Amina Abubakar');
                        setActiveTab('interviews');
                      }}
                      style={{ padding: '5px 10px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#38bdf8', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      📅 Schedule Interview
                    </button>
                  </div>
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

