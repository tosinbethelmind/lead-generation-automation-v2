import { NextResponse } from 'next/server';
import {
  getJobPositions,
  createJobPosition,
  evaluateCvGrade,
  submitCvApplication,
  addToTalentPool,
  searchTalentPool,
  verifyWillingness,
  scheduleInterview,
  generateSourcingRecommendations,
  getApplicants,
  getInterviewSlots,
} from '@/lib/recruitmentEngine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list_jobs';

    if (action === 'list_jobs') {
      const jobs = getJobPositions();
      return NextResponse.json({ success: true, jobs });
    }

    if (action === 'list_talent_pool') {
      const q = searchParams.get('q') || undefined;
      const candidates = searchTalentPool(q);
      return NextResponse.json({ success: true, candidates });
    }

    if (action === 'list_applicants') {
      const applicants = getApplicants();
      return NextResponse.json({ success: true, applicants });
    }

    if (action === 'list_interviews') {
      const slots = getInterviewSlots();
      return NextResponse.json({ success: true, slots });
    }

    return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_job') {
      const { title, department, location, type, salaryRange, minYearsExp, requiredSkills, description, screeningQuestions } = body;
      if (!title || !department) {
        return NextResponse.json({ success: false, error: 'Title and department are required' }, { status: 400 });
      }
      const job = createJobPosition({
        title,
        department,
        location: location || 'Remote / Lagos',
        type: type || 'Full-time',
        salaryRange: salaryRange || 'Negotiable',
        minYearsExp: minYearsExp || 1,
        requiredSkills: requiredSkills || [],
        description: description || '',
        screeningQuestions: screeningQuestions || [],
        status: 'open',
      });
      return NextResponse.json({ success: true, job });
    }

    if (action === 'evaluate_cv') {
      const { jobRequirements, candidate } = body;
      if (!jobRequirements || !candidate) {
        return NextResponse.json({ success: false, error: 'jobRequirements and candidate data are required' }, { status: 400 });
      }
      const evaluation = evaluateCvGrade(jobRequirements, candidate);
      return NextResponse.json({ success: true, evaluation });
    }

    if (action === 'evaluate_voice_note') {
      const { evaluateVoiceNoteSubmission } = await import('@/lib/recruitmentEngine');
      const { candidateName, roleTitle, audioDurationSeconds, rawTranscript } = body;
      const voiceResult = evaluateVoiceNoteSubmission(
        candidateName || 'Applicant',
        roleTitle || 'Solar Technical Specialist',
        Number(audioDurationSeconds || 45),
        rawTranscript
      );
      return NextResponse.json({ success: true, voiceResult });
    }

    if (action === 'submit_cv') {
      const { jobId, candidateName, email, phone, location, yearsExperience, skills, expectedSalary, coverNote, cvText } = body;
      if (!jobId || !candidateName || !email) {
        return NextResponse.json({ success: false, error: 'jobId, candidateName, and email are required' }, { status: 400 });
      }
      const applicant = submitCvApplication(jobId, {
        candidateName,
        email,
        phone: phone || '',
        location: location || 'Lagos',
        yearsExperience: Number(yearsExperience) || 0,
        skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        expectedSalary: expectedSalary || '',
        coverNote: coverNote || '',
        cvText: cvText || '',
      });
      return NextResponse.json({ success: true, applicant });
    }

    if (action === 'add_to_talent_pool') {
      const { candidateName, email, phone, location, primaryRole, yearsExperience, skills, availabilityStatus, rating } = body;
      const entry = addToTalentPool({
        candidateName,
        email,
        phone: phone || '',
        location: location || 'Lagos',
        primaryRole: primaryRole || 'General Specialist',
        yearsExperience: Number(yearsExperience) || 0,
        skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        availabilityStatus: availabilityStatus || 'immediately_available',
        willingnessVerified: false,
        rating: Number(rating) || 4,
      });
      return NextResponse.json({ success: true, candidate: entry });
    }

    if (action === 'verify_willingness') {
      const { candidateId } = body;
      const res = verifyWillingness(candidateId);
      return NextResponse.json(res);
    }

    if (action === 'schedule_interview') {
      const { jobId, applicantId, candidateName, jobTitle, scheduledAt, durationMins, mode, interviewerName } = body;
      const slot = scheduleInterview({
        jobId,
        applicantId,
        candidateName,
        jobTitle,
        scheduledAt: scheduledAt || new Date(Date.now() + 86400000).toISOString(),
        durationMins,
        mode,
        interviewerName,
      });
      return NextResponse.json({ success: true, slot });
    }

    if (action === 'ai_sourcing_help') {
      const { roleTitle, location, experienceLevel } = body;
      const recommendations = generateSourcingRecommendations(roleTitle || 'Solar Technical Specialist', location, experienceLevel);
      return NextResponse.json({ success: true, recommendations });
    }

    if (action === 'ai_headhunting_pitch') {
      const { generateHeadhuntingPitch } = await import('@/lib/recruitmentEngine');
      const { candidateName, targetRole, currentCompany, offeredCompRange } = body;
      const pitch = generateHeadhuntingPitch(candidateName || 'Senior Specialist', targetRole || 'Solar Director', currentCompany, offeredCompRange);
      return NextResponse.json({ success: true, pitch });
    }

    if (action === 'verify_candidate_identity') {
      const { verifyCandidateIdentityShield } = await import('@/lib/recruitmentEngine');
      const { candidateName, ninNumber, pastEmployerCac } = body;
      const shield = verifyCandidateIdentityShield(candidateName || 'Candidate', ninNumber, pastEmployerCac);
      return NextResponse.json({ success: true, shield });
    }

    if (action === 'ask_ai_assistant') {
      const { askRecruitmentAiAssistant } = await import('@/lib/recruitmentEngine');
      const { userQuery, contextJobTitle } = body;
      const aiResponse = askRecruitmentAiAssistant(userQuery || 'How to hire fast?', contextJobTitle || 'Senior Solar Engineer');
      return NextResponse.json({ success: true, aiResponse });
    }

    return NextResponse.json({ success: false, error: `Unsupported POST action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
