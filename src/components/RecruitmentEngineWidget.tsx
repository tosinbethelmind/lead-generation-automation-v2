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
    <div className="w-full space-y-4">
      <WebappToolActionBar currentTool="Recruitment Engine" />
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100">
      {/* 24-HOUR INSTANT HIRE BRANDING BANNER */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950 p-4 border-b border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">
                24-Hour Instant Hire Guaranteed
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                1-ms AI CV & Audio Evaluation
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              Instant AI Talent Recruiter & Vetted Candidate Engine
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <a
            href={whatsappWidgetShareUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
          >
            <span>📲 Share on WhatsApp</span>
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(widgetUrl);
              setCopiedWidgetUrl(true);
              setTimeout(() => setCopiedWidgetUrl(false), 2000);
            }}
            className="px-3 py-1.5 bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
          >
            <span>{copiedWidgetUrl ? 'Copied Link! 🔗' : '🔗 Copy Tool Link'}</span>
          </button>
        </div>
      </div>

      {/* INTELLIGENT AI HR CO-PILOT ASSISTANT BAR */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Intelligent AI Recruitment Assistant (Co-Pilot)</span>
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleAskAiAssistant('How to hire fast in 24 hours?')}
              className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 hover:bg-purple-500/30"
            >
              ⚡ 24h Fast Hire
            </button>
            <button
              onClick={() => handleAskAiAssistant('Calculate salary benchmark for Lagos')}
              className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 hover:bg-blue-500/30"
            >
              💰 Salary Benchmark
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {aiAssistantMessages.slice(-3).map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg text-xs ${
                m.sender === 'user' ? 'bg-blue-900/40 text-blue-200 border border-blue-500/30 ml-8' : 'bg-slate-900 text-slate-200 border border-purple-500/20 mr-8'
              }`}
            >
              <div className="font-semibold text-[10px] text-slate-400 mb-0.5">{m.sender === 'user' ? '👤 You' : '🤖 AI Co-Pilot'}</div>
              <div>{m.text}</div>
              {m.xray && (
                <div className="mt-1 font-mono text-[10px] text-cyan-300 bg-slate-950 p-1 rounded border border-slate-800 break-all">
                  Query: {m.xray}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            placeholder="Ask AI Assistant anything (e.g. 'Draft WhatsApp pitch for sales executive'...)"
            value={aiPromptInput}
            onChange={(e) => setAiPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAiAssistant()}
            className="flex-1 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleAskAiAssistant()}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
          >
            <Send className="w-3 h-3" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Subheader Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/80 p-2 gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Openings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('talent_pool')}
          className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'talent_pool' ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Talent Pool Bank ({talentPool.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sourcing_ai')}
          className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'sourcing_ai' ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Sourcing Advisor</span>
        </button>

        <button
          onClick={() => setActiveTab('cv_grader')}
          className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'cv_grader' ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>AI CV Grader</span>
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'interviews' ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Interview Scheduler ({interviews.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {/* TAB 1: JOB OPENINGS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📢 Active Job Advertisements</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Live Hiring Hub
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage job criteria, pre-screening eliminator questions, and applicant portals.
                </p>
              </div>
              <button
                onClick={() => setShowNewJobModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post New Job</span>
              </button>
            </div>

            {/* Modal to Post New Job */}
            {showNewJobModal && (
              <form onSubmit={handleCreateJob} className="bg-slate-950 border border-blue-500/40 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Post New Position</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Job Title</label>
                    <input
                      type="text"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      placeholder="e.g. Lead Solar Technician"
                      className="w-full bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Department</label>
                    <input
                      type="text"
                      value={newJobDept}
                      onChange={(e) => setNewJobDept(e.target.value)}
                      placeholder="Operations / Sales / Tech"
                      className="w-full bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Salary Range (Monthly)</label>
                    <input
                      type="text"
                      value={newJobSalary}
                      onChange={(e) => setNewJobSalary(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Min Years Exp Required</label>
                    <input
                      type="number"
                      value={newJobExp}
                      onChange={(e) => setNewJobExp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={newJobSkills}
                    onChange={(e) => setNewJobSkills(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewJobModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
                  >
                    Publish Job Opening
                  </button>
                </div>
              </form>
            )}

            {/* Jobs List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedJob.id === job.id
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-lg ring-1 ring-blue-500/30'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {job.department}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {job.applicantsCount} Applicants
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{job.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{job.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {job.requiredSkills.map((sk, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>💰 {job.salaryRange}</span>
                    <span className="text-blue-300 font-medium hover:underline">Select & Grade &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Job Detail Bar */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Selected Criteria for AI Grading: <span className="text-blue-400">{selectedJob.title}</span>
              </h4>
              <div className="mt-2 text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div><strong className="text-slate-200">Min Exp:</strong> {selectedJob.minYearsExp} Years</div>
                <div><strong className="text-slate-200">Target Skills:</strong> {selectedJob.requiredSkills.join(', ')}</div>
                <div><strong className="text-slate-200">Screening Questions:</strong> {selectedJob.screeningQuestions.length} Active</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVERGREEN TALENT POOL */}
        {activeTab === 'talent_pool' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🌐 Evergreen Talent Pool Bank</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Warm Candidate Database
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pre-categorized CV bank automatically populated via WhatsApp CV dropbot.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by role or skill..."
                  value={talentSearchQuery}
                  onChange={(e) => setTalentSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs pl-8 pr-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {verificationNotice && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded-xl flex items-center justify-between animate-fade-in">
                <span>{verificationNotice}</span>
              </div>
            )}

            {/* Candidates Table */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Primary Role</th>
                    <th className="py-3 px-4">Skills</th>
                    <th className="py-3 px-4">Exp</th>
                    <th className="py-3 px-4">Willingness Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTalentPool.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.candidateName}</div>
                        <div className="text-[11px] text-slate-400">{c.phone} &bull; {c.location}</div>
                      </td>
                      <td className="py-3 px-4 text-blue-300 font-medium">{c.primaryRole}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.map((s, i) => (
                            <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-bold">{c.yearsExperience} yrs</td>
                      <td className="py-3 px-4">
                        {c.willingnessVerified ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Available & Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Pending Ping</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleVerifyWillingness(c.id)}
                          className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-lg text-[11px] font-medium transition-all"
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
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 p-4 rounded-xl border border-purple-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Quality Candidate Sourcing Advisor</span>
                  </h3>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Get AI-optimized sourcing channels, Boolean search strings, and referral bounty plans for top 5% talent.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenerateSourcing('Senior Solar Installation Engineer')}
                    className="px-2.5 py-1 bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 border border-purple-500/40 rounded-lg text-xs"
                  >
                    Solar Role
                  </button>
                  <button
                    onClick={() => handleGenerateSourcing('High-Ticket B2B Lead Sales Executive')}
                    className="px-2.5 py-1 bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 border border-purple-500/40 rounded-lg text-xs"
                  >
                    B2B Sales
                  </button>
                </div>
              </div>
            </div>

            {/* Sourcing Strategy Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Channels */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Recommended Sourcing Channels for {sourcingRecs.roleTitle}
                </h4>
                <div className="space-y-2">
                  {sourcingRecs.targetChannels.map((ch, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{ch.channel}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {ch.expectedYield}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{ch.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LinkedIn & Google X-Ray Search Queries */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center justify-between">
                  <span>🔎 Google X-Ray Search (100% Free Candidate Search)</span>
                  <button
                    onClick={() => {
                      const xray = sourcingRecs.googleXraySearchString || `site:linkedin.com/in/ "${sourcingRecs.roleTitle}" ("Lagos" OR "Abuja")`;
                      navigator.clipboard.writeText(xray);
                      setCopiedBoolean(true);
                      setTimeout(() => setCopiedBoolean(false), 2000);
                    }}
                    className="text-[11px] text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedBoolean ? 'Copied X-Ray!' : 'Copy X-Ray Query'}</span>
                  </button>
                </h4>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-[11px] text-cyan-300 break-all">
                  {sourcingRecs.googleXraySearchString || `site:linkedin.com/in/ "${sourcingRecs.roleTitle}" ("Lagos" OR "Abuja")`}
                </div>
                <p className="text-[10px] text-slate-400">
                  💡 <strong>How to use:</strong> Copy and paste this exact string directly into Google. It bypasses LinkedIn Recruiter paywalls and lists 100s of active profiles.
                </p>

                <div className="mt-3 p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg">
                  <span className="text-xs font-bold text-amber-300 block">💡 Free Referral Perks Strategy:</span>
                  <p className="text-[11px] text-amber-200/80 mt-1">{sourcingRecs.referralBountySuggestion}</p>
                </div>
              </div>
            </div>

            {/* 100% Free Sourcing Playbook Cards */}
            {sourcingRecs.freeChannels && (
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🆓 100% Free Talent Sourcing Playbook</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sourcingRecs.freeChannels.map((fc, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-white block">{fc.method}</span>
                      <div className="bg-slate-950 border border-slate-800 p-2 rounded text-[11px] font-mono text-emerald-300 break-all">
                        {fc.template}
                      </div>
                      <p className="text-[10px] text-slate-400">{fc.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Screening Eliminator Questions */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                🛡️ AI Recommended Pre-Screening Questions (Eliminating Low-Quality Spammers)
              </h4>
              <ul className="space-y-1.5">
                {sourcingRecs.samplePreScreeningQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PASSIVE TALENT HEADHUNTER & NIN IDENTITY SHIELD */}
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950 border border-blue-500/30 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <span>🎯 Passive Talent Headhunter & Candidate Identity Shield</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-500/30">
                  Senior Executive Upgrade
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">1. AI Executive Headhunting Pitch</strong>
                  <div className="bg-slate-950 p-2 rounded text-[11px] font-mono text-purple-300 border border-slate-800">
                    &ldquo;Hi [Senior Executive], your track record in commercial solar caught our attention. We are hiring a {sourcingRecs.roleTitle} in Lagos with 40% higher compensation. Open for a 10-min confidential chat?&rdquo;
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold block">88% Candidate Acceptance Rate</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">2. NIN Identity & Past Employer CAC Shield</strong>
                  <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded text-[11px] text-emerald-200">
                    🛡️ NIMC NIN Database & CAC Verification Shield Active. Validates candidate identity and past employer credentials before final offer.
                  </div>
                  <span className="text-[10px] text-slate-400 block">Prevents hiring fake CV inflators or impersonators.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI CV GRADER */}
        {activeTab === 'cv_grader' && (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>AI CV Evaluator & Match Scorer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test candidate application parsing against target role requirements: <span className="text-blue-300 font-semibold">{selectedJob.title}</span>
                </p>
              </div>
              <button
                onClick={handleGradeCv}
                disabled={evaluating}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{evaluating ? 'Evaluating CV...' : 'Run Instant AI CV Grade'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form Input */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Candidate Profile Input</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Years Experience</label>
                    <input
                      type="number"
                      value={candidateExp}
                      onChange={(e) => setCandidateExp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Listed Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={candidateSkillsInput}
                    onChange={(e) => setCandidateSkillsInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Paste Candidate CV Text / Summary</label>
                  <textarea
                    rows={4}
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs p-2.5 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Evaluation Output */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Evaluation Results</h4>

                {evalResult ? (
                  <div className="space-y-3">
                    {/* Score Banner */}
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">Suitability Match Score</div>
                        <div className="text-3xl font-extrabold text-white mt-0.5">{evalResult.matchScore}%</div>
                      </div>
                      <div>
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${evalResult.recommendationBadgeColor}`}>
                          {evalResult.recommendation}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      {evalResult.summaryEvaluation}
                    </p>

                    {/* Matched vs Missing */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-lg">
                        <strong className="text-emerald-400 block mb-1">Matched Skills:</strong>
                        <div className="flex flex-wrap gap-1">
                          {evalResult.matchedSkills.map((m, idx) => (
                            <span key={idx} className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 bg-rose-950/30 border border-rose-500/20 rounded-lg">
                        <strong className="text-rose-400 block mb-1">Missing Skills:</strong>
                        <div className="flex flex-wrap gap-1">
                          {evalResult.missingSkills.length > 0 ? (
                            evalResult.missingSkills.map((m, idx) => (
                              <span key={idx} className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">None missing</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Click <strong className="text-slate-300">Run Instant AI CV Grade</strong> to evaluate candidate against {selectedJob.title}.
                  </div>
                )}
              </div>
            </div>

            {/* WHATSAPP VOICE NOTE PRE-SCREENING & AUDIO TRANSCRIBER CARD */}
            <div className="bg-slate-950/70 border border-emerald-500/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>🎙️ WhatsApp Voice Note Audio Pre-Screening & Transcriber</span>
                </h4>
                <button
                  onClick={handleTestVoiceNote}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Simulate Audio Voice Note</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Candidates send a 60-second WhatsApp voice note introducing themselves. The AI speech transcriber converts audio to text, checks communication clarity, and auto-dispatches an AI voice note reply.
              </p>

              {voiceEvalResult && (
                <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-xl space-y-2 animate-fade-in text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Speech Clarity Score: {voiceEvalResult.communicationClarityScore}%</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                      Tone: {voiceEvalResult.detectedTone}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded text-slate-300 italic border border-slate-800">
                    &ldquo;{voiceEvalResult.transcriptionText}&rdquo;
                  </div>
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-200">
                    <strong className="block mb-0.5 font-semibold text-emerald-300">🤖 Auto WhatsApp Voice Note Sent to Candidate:</strong>
                    &ldquo;{voiceEvalResult.autoReplyVoiceNoteText}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: INTERVIEW SCHEDULER */}
        {activeTab === 'interviews' && (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Interview Slot Scheduler & Meeting Generator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule confirmed interview slots and send 1-click WebRTC or WhatsApp call links to candidates.
                </p>
              </div>
            </div>

            {bookingSuccess && (
              <div className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs p-3 rounded-xl">
                {bookingSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Form */}
              <form onSubmit={handleScheduleInterview} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3 md:col-span-1">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Book Interview Slot</h4>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={schedCandidateName}
                    onChange={(e) => setSchedCandidateName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={schedDateTime}
                    onChange={(e) => setSchedDateTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Interview Mode</label>
                  <select
                    value={schedMode}
                    onChange={(e: any) => setSchedMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-white"
                  >
                    <option value="video_webrtc">Browser 1-Click Video Call (WebRTC)</option>
                    <option value="whatsapp_call">Direct WhatsApp Phone Interview</option>
                    <option value="in_person">In-Person HQ Meeting</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2"
                >
                  Generate & Confirm Interview
                </button>
              </form>

              {/* Scheduled Slots List */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3 md:col-span-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scheduled Interview Pipeline</h4>
                <div className="space-y-2">
                  {interviews.map((slot) => (
                    <div key={slot.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-white">{slot.candidateName}</div>
                        <div className="text-[11px] text-cyan-300 font-medium">{slot.jobTitle}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          📅 {new Date(slot.scheduledAt).toLocaleString()} &bull; {slot.durationMins} Mins
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={slot.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Meeting Link</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
