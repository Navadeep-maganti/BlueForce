import {
  User,
  WorkerProfile,
  EmployerProfile,
  Job,
  Application,
  ApplicationStage,
  InterviewDetails,
  VerificationDocument,
  PlatformReport,
  NotificationItem,
  ProofOfWorkItem,
  SkillItem,
  UserRole,
} from '../types';
import {
  mockUsers,
  defaultWorkerProfile,
  mockCandidates,
  mockEmployerProfile,
  mockJobs,
  mockApplications,
  mockVerifications,
  mockReports,
  mockNotifications,
} from './mockData';
import { authApi, RegisterPayload } from './api/authApi';

const STORAGE_KEYS = {
  USER: 'kaushal_current_user',
  WORKER_PROFILE: 'kaushal_worker_profile',
  CANDIDATES: 'kaushal_candidates',
  EMPLOYER_PROFILE: 'kaushal_employer_profile',
  JOBS: 'kaushal_jobs',
  APPLICATIONS: 'kaushal_applications',
  VERIFICATIONS: 'kaushal_verifications',
  REPORTS: 'kaushal_reports',
  NOTIFICATIONS: 'kaushal_notifications',
  TOKENS: 'kc_tokens',
};

class Store {
  private listeners: Set<() => void> = new Set();

  currentUser: User | null = null;
  workerProfile: WorkerProfile = defaultWorkerProfile;
  candidates: WorkerProfile[] = mockCandidates;
  employerProfile: EmployerProfile = mockEmployerProfile;
  jobs: Job[] = mockJobs;
  applications: Application[] = mockApplications;
  verifications: VerificationDocument[] = mockVerifications;
  reports: PlatformReport[] = mockReports;
  notifications: NotificationItem[] = mockNotifications;
  isLoading: boolean = false;
  authError: string | null = null;

  constructor() {
    this.loadFromStorage();
    this.restoreSession();
  }

  private loadFromStorage() {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      this.currentUser = savedUser ? JSON.parse(savedUser) : mockUsers[0]; // default to worker

      const savedWorker = localStorage.getItem(STORAGE_KEYS.WORKER_PROFILE);
      this.workerProfile = savedWorker ? JSON.parse(savedWorker) : defaultWorkerProfile;

      const savedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      this.candidates = savedCandidates ? JSON.parse(savedCandidates) : mockCandidates;

      const savedEmployer = localStorage.getItem(STORAGE_KEYS.EMPLOYER_PROFILE);
      this.employerProfile = savedEmployer ? JSON.parse(savedEmployer) : mockEmployerProfile;

      const savedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      this.jobs = savedJobs ? JSON.parse(savedJobs) : mockJobs;

      const savedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      this.applications = savedApps ? JSON.parse(savedApps) : mockApplications;

      const savedVerifs = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      this.verifications = savedVerifs ? JSON.parse(savedVerifs) : mockVerifications;

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = savedReports ? JSON.parse(savedReports) : mockReports;

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : mockNotifications;
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.WORKER_PROFILE, JSON.stringify(this.workerProfile));
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      localStorage.setItem(STORAGE_KEYS.EMPLOYER_PROFILE, JSON.stringify(this.employerProfile));
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(this.verifications));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Live Backend Authentication & Session Restore
  async restoreSession() {
    const tokensStr = localStorage.getItem(STORAGE_KEYS.TOKENS);
    if (!tokensStr) return;

    try {
      const res = await authApi.getMe();
      if (res?.success && res?.data?.user) {
        const u = res.data.user;
        this.currentUser = {
          id: String(u.id),
          name: u.display_name || u.username,
          email: u.email,
          phone: u.phone || '+91 98480 12345',
          role: u.role,
          location: u.location || 'Vijayawada, AP',
          avatarUrl: u.avatar_url,
          isVerified: u.is_verified,
          createdAt: u.created_at,
        };
        this.saveToStorage();
      }
    } catch (err) {
      console.log('Session restore info: working in hybrid/local mode');
    }
  }

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    this.isLoading = true;
    this.authError = null;
    this.notify();

    try {
      const res = await authApi.login(usernameOrEmail, password);
      if (res?.success && res?.data) {
        const { tokens, user: u } = res.data;
        localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

        this.currentUser = {
          id: String(u.id),
          name: u.display_name || u.username,
          email: u.email,
          phone: u.phone || '+91 98480 12345',
          role: u.role,
          location: u.location || 'Vijayawada, AP',
          avatarUrl: u.avatar_url,
          isVerified: u.is_verified,
          createdAt: u.created_at,
        };

        if (u.role === 'worker' && u.profile_data) {
          this.workerProfile.fullName = u.profile_data.full_name;
          this.workerProfile.primaryTrade = u.profile_data.primary_trade;
          this.workerProfile.city = u.profile_data.city;
        } else if (u.role === 'employer' && u.profile_data) {
          this.employerProfile.companyName = u.profile_data.company_name;
          this.employerProfile.tradeIndustry = u.profile_data.trade_industry;
        }

        this.saveToStorage();
        this.isLoading = false;
        return { success: true, message: 'Login successful', user: this.currentUser };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err: any) {
      this.isLoading = false;
      const errorMsg = err.response?.data?.message || err.message || 'Invalid credentials.';
      this.authError = errorMsg;
      this.notify();
      return { success: false, message: errorMsg };
    }
  }

  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string; user?: User }> {
    this.isLoading = true;
    this.authError = null;
    this.notify();

    try {
      const res = await authApi.register(payload);
      if (res?.success && res?.data) {
        const { tokens, user: u } = res.data;
        localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

        this.currentUser = {
          id: String(u.id),
          name: u.display_name || u.username,
          email: u.email,
          phone: u.phone || payload.phone || '+91 98480 12345',
          role: u.role,
          location: u.location || payload.location || 'Vijayawada, AP',
          avatarUrl: u.avatar_url,
          isVerified: u.is_verified,
          createdAt: u.created_at,
        };

        if (u.role === 'worker' && payload.full_name) {
          this.workerProfile.fullName = payload.full_name;
          this.workerProfile.primaryTrade = payload.primary_trade || 'Industrial Electrician';
        } else if (u.role === 'employer' && payload.company_name) {
          this.employerProfile.companyName = payload.company_name;
          this.employerProfile.tradeIndustry = payload.trade_industry || 'Precision Engineering';
        }

        this.saveToStorage();
        this.isLoading = false;
        return { success: true, message: 'Account created successfully', user: this.currentUser };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (err: any) {
      this.isLoading = false;
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
      this.authError = errorMsg;
      this.notify();
      return { success: false, message: errorMsg };
    }
  }

  async logout() {
    const tokensStr = localStorage.getItem(STORAGE_KEYS.TOKENS);
    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        await authApi.logout(tokens?.refresh);
      } catch (e) {}
    }
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    this.currentUser = null;
    this.saveToStorage();
  }

  loginAs(role: UserRole) {
    const foundUser = mockUsers.find((u) => u.role === role);
    if (foundUser) {
      this.currentUser = foundUser;
      this.saveToStorage();
    }
  }

  loginWithCustom(name: string, email: string, role: UserRole) {
    this.currentUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone: '+91 98765 43210',
      role,
      location: 'Vijayawada, AP',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    this.saveToStorage();
  }

  // Worker Actions
  applyForJob(jobId: string): { success: boolean; message: string; applicationId?: string } {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    const existing = this.applications.find(
      (a) => a.jobId === jobId && a.workerId === this.workerProfile.id
    );
    if (existing) {
      return { success: false, message: 'You have already applied for this job.' };
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      workerId: this.workerProfile.id,
      employerId: job.employerId,
      jobTitle: job.title,
      companyName: job.companyName,
      workerName: this.workerProfile.fullName,
      workerTrade: this.workerProfile.primaryTrade,
      workerAvatarUrl: this.workerProfile.avatarUrl,
      workerTrustScore: this.workerProfile.trustScore.total,
      workerExperienceYears: this.workerProfile.yearsOfExperience,
      workerLocation: this.workerProfile.location,
      matchScore: job.matchData?.matchPercentage || 92,
      topSkills: this.workerProfile.skills.slice(0, 3).map((s) => s.name),
      currentStage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          stage: 'Applied',
          timestamp: 'Just now',
          note: 'Application submitted with verified Trust Score (91/100)',
          completed: true,
        },
      ],
    };

    this.applications.unshift(newApp);
    this.saveToStorage();
    return { success: true, message: 'Applied successfully!', applicationId: newApp.id };
  }

  addProofOfWork(item: Omit<ProofOfWorkItem, 'id'>) {
    const newPow: ProofOfWorkItem = {
      id: `pow_${Date.now()}`,
      ...item,
    };
    this.workerProfile.proofOfWork.unshift(newPow);
    this.workerProfile.trustScore.completedJobs.score = Math.min(10, this.workerProfile.trustScore.completedJobs.score + 1);
    this.workerProfile.trustScore.completedJobs.completedCount += 1;
    this.recalcTrustScore();
    this.saveToStorage();
  }

  addSkill(skill: Omit<SkillItem, 'id'>) {
    const newSkill: SkillItem = {
      id: `skill_${Date.now()}`,
      ...skill,
    };
    this.workerProfile.skills.push(newSkill);
    this.saveToStorage();
  }

  private recalcTrustScore() {
    const ts = this.workerProfile.trustScore;
    ts.total =
      ts.identity.score +
      ts.certifications.score +
      ts.skills.score +
      ts.experience.score +
      ts.employerReviews.score +
      ts.completedJobs.score;
  }

  toggleBookmarkJob(jobId: string) {
    if (!this.workerProfile.bookmarkedJobIds) {
      this.workerProfile.bookmarkedJobIds = [];
    }
    const idx = this.workerProfile.bookmarkedJobIds.indexOf(jobId);
    if (idx >= 0) {
      this.workerProfile.bookmarkedJobIds.splice(idx, 1);
    } else {
      this.workerProfile.bookmarkedJobIds.push(jobId);
    }
    this.saveToStorage();
  }

  toggleBookmarkWorker(workerId: string) {
    if (!this.employerProfile.bookmarkedWorkerIds) {
      this.employerProfile.bookmarkedWorkerIds = [];
    }
    const idx = this.employerProfile.bookmarkedWorkerIds.indexOf(workerId);
    if (idx >= 0) {
      this.employerProfile.bookmarkedWorkerIds.splice(idx, 1);
    } else {
      this.employerProfile.bookmarkedWorkerIds.push(workerId);
    }
    this.saveToStorage();
  }

  // Employer Actions
  moveApplicationStage(applicationId: string, newStage: ApplicationStage, note?: string) {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return;

    app.currentStage = newStage;
    app.timeline.push({
      stage: newStage,
      timestamp: new Date().toISOString().split('T')[0],
      note: note || `Candidate moved to ${newStage} stage.`,
      completed: true,
    });
    this.saveToStorage();
  }

  scheduleInterview(applicationId: string, interview: InterviewDetails) {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return;

    app.currentStage = 'Interview';
    app.interview = interview;
    app.timeline.push({
      stage: 'Interview',
      timestamp: interview.date,
      note: `Interview scheduled (${interview.type}) at ${interview.time}.`,
      completed: true,
    });

    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: app.workerId,
      title: 'Interview Scheduled',
      message: `Your interview for ${app.jobTitle} with ${app.companyName} is on ${interview.date} at ${interview.time}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'interview',
      actionUrl: '/worker/applications',
    });

    this.saveToStorage();
  }

  createJob(jobData: Partial<Job> & { title: string; tradeCategory: string; description: string; jobType: any; shift: any; openings: number; salaryMin: number; salaryMax: number }): Job {
    const newJob: Job = {
      salaryPeriod: 'monthly',
      experienceRequiredYears: 3,
      joiningDate: 'Within 15 Days',
      deadlineDate: '2026-04-30',
      requiredSkills: [],
      benefits: [],
      workAddress: 'Autonagar, Vijayawada',
      status: 'active',
      location: jobData.city || 'Vijayawada',
      city: jobData.city || 'Vijayawada',
      ...jobData,
      id: `job_${Date.now()}`,
      employerId: this.employerProfile.id,
      companyName: this.employerProfile.companyName,
      companyLogoUrl: this.employerProfile.logoUrl,
      isCompanyVerified: this.employerProfile.isVerified,
      postedAt: 'Just now',
      applicationsCount: 0,
      matchData: {
        matchPercentage: 91,
        skillCompatibility: { score: 44, max: 50, details: 'Matches trade requirements' },
        experienceScore: { score: 18, max: 20, details: 'Verified tenure' },
        locationScore: { score: 14, max: 15, details: 'Local candidate' },
        certificationScore: { score: 5, max: 5, details: 'Verified certificates' },
        availabilityScore: { score: 10, max: 10, details: 'Immediate' },
        reasons: ['Strong trade profile', 'Valid government credentials'],
      },
    };

    this.jobs.unshift(newJob);
    this.saveToStorage();
    return newJob;
  }

  postNewJob(jobData: any): Job {
    return this.createJob(jobData);
  }

  // Admin Actions
  verifyDocument(docId: string, statusOrApproved: 'verified' | 'rejected' | boolean, reason?: string) {
    const doc = this.verifications.find((v) => v.id === docId);
    if (doc) {
      if (typeof statusOrApproved === 'boolean') {
        doc.status = statusOrApproved ? 'verified' : 'rejected';
      } else {
        doc.status = statusOrApproved;
      }
      if (reason) doc.rejectionReason = reason;
      doc.reviewedBy = 'Admin Moderator';
      doc.reviewedAt = new Date().toISOString().split('T')[0];
      this.saveToStorage();
    }
  }

  approveVerification(docId: string) {
    this.verifyDocument(docId, true);
  }

  rejectVerification(docId: string, reason: string) {
    this.verifyDocument(docId, false, reason);
  }

  resolveReport(reportId: string, status: 'resolved' | 'dismissed' | string = 'resolved') {
    const rep = this.reports.find((r) => r.id === reportId);
    if (rep) {
      rep.status = (status === 'dismissed' ? 'dismissed' : 'resolved');
      this.saveToStorage();
    }
  }

  resetDemoData() {
    this.workerProfile = defaultWorkerProfile;
    this.candidates = mockCandidates;
    this.employerProfile = mockEmployerProfile;
    this.jobs = mockJobs;
    this.applications = mockApplications;
    this.verifications = mockVerifications;
    this.reports = mockReports;
    this.notifications = mockNotifications;
    this.saveToStorage();
  }
}

export const appStore = new Store();
