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
import { workerApi } from './api/workerApi';
import { jobApi, JobFilterParams } from './api/jobApi';
import { applicationApi } from './api/applicationApi';
import { verificationApi } from './api/verificationApi';
import { notificationApi } from './api/notificationApi';

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
        if (u.role === 'worker') {
          await this.fetchWorkerProfile();
        }
        this.saveToStorage();
      }
    } catch (err) {
      console.log('Session restore info: working in hybrid/local mode');
    }
  }

  async fetchWorkerProfile() {
    try {
      const res = await workerApi.getMyProfile();
      if (res?.success && res?.data) {
        const d = res.data;
        if (d.profile) {
          this.workerProfile.fullName = d.profile.full_name;
          this.workerProfile.primaryTrade = d.profile.primary_trade;
          this.workerProfile.tagline = d.profile.tagline || this.workerProfile.tagline;
          this.workerProfile.bio = d.profile.bio || this.workerProfile.bio;
          this.workerProfile.location = d.profile.location;
          this.workerProfile.city = d.profile.city;
          this.workerProfile.yearsOfExperience = d.profile.years_of_experience;
          this.workerProfile.availability = d.profile.availability;
          this.workerProfile.expectedSalaryMonthly = d.profile.expected_salary_min || 28000;
          this.workerProfile.profileStrengthPercent = d.profile.profile_strength_percent || 88;
        }
        if (d.trust_score?.breakdown) {
          const tb = d.trust_score.breakdown;
          this.workerProfile.trustScore = {
            total: d.trust_score.total,
            identity: { score: tb.identity.score, max: 20, verified: true, label: tb.identity.label },
            certifications: { score: tb.certifications.score, max: 20, verifiedCount: tb.certifications.verified_count, label: 'Government NCVT Certs' },
            skills: { score: tb.skills.score, max: 20, testedCount: tb.skills.tested_count, label: 'Verified Trade Tests' },
            experience: { score: tb.experience.score, max: 15, verifiedYears: tb.experience.verified_years, label: 'Plant Experience' },
            employerReviews: { score: tb.employer_reviews.score, max: 15, avgRating: tb.employer_reviews.avg_rating, reviewCount: tb.employer_reviews.review_count, label: 'Supervisor Feedback' },
            completedJobs: { score: tb.completed_jobs.score, max: 10, completedCount: tb.completed_jobs.completed_count, label: 'Photo Proof Works' },
          };
        }
        if (d.skills && d.skills.length > 0) {
          this.workerProfile.skills = d.skills.map((s: any) => ({
            id: String(s.id),
            name: s.skill_name,
            category: s.category || 'Electrical',
            level: s.level || 5,
            yearsExperience: s.years_experience || 4,
            isVerified: s.is_verified,
            verificationSource: s.verification_source,
          }));
        }
        if (d.proof_of_work && d.proof_of_work.length > 0) {
          this.workerProfile.proofOfWork = d.proof_of_work.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            description: p.description,
            category: p.category,
            images: p.images || [],
            skillsDemonstrated: p.skills_demonstrated || [],
            clientOrEmployer: p.client_or_employer,
            location: p.location,
            completionDate: p.completion_date,
            isVerified: p.is_verified,
            verifiedBy: p.verified_by,
            rating: p.rating || 5,
          }));
        }
        this.saveToStorage();
      }
    } catch (e) {
      console.log('Worker profile fetch fallback to local cache');
    }
  }

  async fetchCandidates(params: any = {}) {
    try {
      const res = await workerApi.discoverWorkers(params);
      if (res?.results && res.results.length > 0) {
        this.candidates = res.results.map((w: any) => ({
          id: String(w.id),
          userId: String(w.id),
          fullName: w.full_name,
          primaryTrade: w.primary_trade,
          tagline: w.tagline || 'Certified Industrial Trade Technician',
          bio: 'Verified technical candidate with government certification and plant experience.',
          location: w.location || 'Vijayawada, AP',
          city: w.city || 'Vijayawada',
          avatarUrl: w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          yearsOfExperience: w.years_of_experience || 3,
          availability: w.availability || 'available_now',
          expectedSalaryMonthly: w.expected_salary_min || 28000,
          profileStrengthPercent: 88,
          trustScore: {
            total: w.trust_score_total || 85,
            identity: { score: 20, max: 20, verified: w.is_verified, label: 'Aadhaar eKYC' },
            certifications: { score: 18, max: 20, verifiedCount: w.verified_certs_count || 2, label: 'NCVT Certs' },
            skills: { score: 18, max: 20, testedCount: 4, label: 'Verified Skills' },
            experience: { score: 14, max: 15, verifiedYears: w.years_of_experience || 3, label: 'Plant Tenure' },
            employerReviews: { score: 10, max: 15, avgRating: 5.0, reviewCount: 1, label: 'Feedback' },
            completedJobs: { score: 8, max: 10, completedCount: w.proof_of_work_count || 1, label: 'Proof Works' },
          },
          skills: (w.top_skills || ['Electrical', 'PLC', 'Maintenance']).map((name: string, i: number) => ({
            id: `sk_${i}`,
            name,
            category: 'Industrial',
            level: 5,
            yearsExperience: 4,
            isVerified: true,
          })),
          certifications: [],
          experience: [],
          proofOfWork: [],
          reviews: [],
          recommendedSkills: [],
          bookmarkedJobIds: [],
        }));
        this.saveToStorage();
      }
    } catch (e) {
      console.log('Candidates loaded from cache/fallback');
    }
  }

  async fetchNotifications() {
    try {
      const res = await notificationApi.getNotifications();
      if (res?.data?.notifications) {
        this.notifications = res.data.notifications.map((n: any) => ({
          id: String(n.id),
          userId: this.currentUser?.id || 'worker_1',
          title: n.title,
          message: n.message,
          timestamp: n.timestamp || 'Just now',
          isRead: n.is_read,
          type: n.type || n.notification_type || 'general',
          actionUrl: n.action_url,
        }));
        this.saveToStorage();
      }
    } catch (e) {
      console.log('Notifications loaded from cache');
    }
  }

  async markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveToStorage();
    }
    const numId = parseInt(id.replace(/\D/g, ''), 10);
    if (numId) {
      notificationApi.markAsRead(numId).catch(() => {});
    }
  }

  async markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
    this.saveToStorage();
    notificationApi.markAllAsRead().catch(() => {});
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

        if (u.role === 'worker') {
          await this.fetchWorkerProfile();
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

    // Async backend apply
    const numericJobId = parseInt(jobId.replace(/\D/g, ''), 10) || 1;
    applicationApi.applyForJob(numericJobId).catch(() => console.log('Application saved locally.'));

    return { success: true, message: 'Applied successfully!', applicationId: newApp.id };
  }

  async addProofOfWork(item: Omit<ProofOfWorkItem, 'id'>) {
    const newPow: ProofOfWorkItem = {
      id: `pow_${Date.now()}`,
      ...item,
    };
    this.workerProfile.proofOfWork.unshift(newPow);
    this.workerProfile.trustScore.completedJobs.score = Math.min(10, this.workerProfile.trustScore.completedJobs.score + 1);
    this.workerProfile.trustScore.completedJobs.completedCount += 1;
    this.recalcTrustScore();
    this.saveToStorage();

    try {
      await workerApi.addProofOfWork({
        title: item.title,
        description: item.description,
        category: item.category,
        images: item.images,
        skills_demonstrated: item.skillsDemonstrated,
        client_or_employer: item.clientOrEmployer,
        location: item.location,
        completion_date: item.completionDate,
      });
    } catch (e) {
      console.log('Proof of work saved locally.');
    }
  }

  async addSkill(skill: Omit<SkillItem, 'id'>) {
    const newSkill: SkillItem = {
      id: `skill_${Date.now()}`,
      ...skill,
    };
    this.workerProfile.skills.push(newSkill);
    this.saveToStorage();

    try {
      await workerApi.addSkill({
        skill_name: skill.name,
        category: skill.category,
        level: skill.level,
        years_experience: skill.yearsExperience,
      });
    } catch (e) {
      console.log('Skill saved locally.');
    }
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
    const isAdding = idx < 0;
    if (!isAdding) {
      this.workerProfile.bookmarkedJobIds.splice(idx, 1);
    } else {
      this.workerProfile.bookmarkedJobIds.push(jobId);
    }
    this.saveToStorage();

    const numericJobId = parseInt(jobId.replace(/\D/g, ''), 10) || 1;
    if (isAdding) {
      jobApi.saveJob(numericJobId).catch(() => {});
    } else {
      jobApi.unsaveJob(numericJobId).catch(() => {});
    }
  }

  toggleBookmarkWorker(workerId: string) {
    if (!this.employerProfile.bookmarkedWorkerIds) {
      this.employerProfile.bookmarkedWorkerIds = [];
    }
    const idx = this.employerProfile.bookmarkedWorkerIds.indexOf(workerId);
    const isAdding = idx < 0;
    if (!isAdding) {
      this.employerProfile.bookmarkedWorkerIds.splice(idx, 1);
    } else {
      this.employerProfile.bookmarkedWorkerIds.push(workerId);
    }
    this.saveToStorage();

    const numericWorkerId = parseInt(workerId.replace(/\D/g, ''), 10) || 1;
    if (isAdding) {
      workerApi.saveCandidate(numericWorkerId).catch(() => {});
    } else {
      workerApi.unsaveCandidate(numericWorkerId).catch(() => {});
    }
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

    const numericAppId = parseInt(applicationId.replace(/\D/g, ''), 10) || 1;
    applicationApi.updateStage(numericAppId, newStage, note).catch(() => console.log('Stage synced locally.'));
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

    const numericAppId = parseInt(applicationId.replace(/\D/g, ''), 10) || 1;
    applicationApi.scheduleInterview(numericAppId, {
      date: interview.date,
      time: interview.time,
      interview_type: interview.type,
      location_or_link: interview.locationOrLink,
      instructions: interview.instructions,
      interviewer_name: interview.interviewerName,
    }).catch(() => console.log('Interview saved locally.'));
  }

  async fetchPublicJobs(params: JobFilterParams = {}) {
    try {
      const res = await jobApi.getPublicJobs(params);
      if (res?.results && res.results.length > 0) {
        this.jobs = res.results.map((j: any) => ({
          id: String(j.id),
          employerId: String(j.employer?.id || 'emp_1'),
          companyName: j.company_name || 'Industrial Plant',
          companyLogoUrl: j.company_logo_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
          isCompanyVerified: j.is_company_verified ?? true,
          title: j.title,
          tradeCategory: j.trade_category,
          location: j.location,
          city: j.city,
          distanceKm: j.distance_km || 5.0,
          salaryMin: j.salary_min,
          salaryMax: j.salary_max,
          salaryPeriod: j.salary_period || 'monthly',
          experienceRequiredYears: j.experience_required_years || 3,
          jobType: j.job_type || 'Full-time',
          shift: j.shift || 'Day Shift',
          openings: j.openings || 2,
          joiningDate: j.joining_date || 'Within 15 Days',
          deadlineDate: j.deadline_date || '2026-04-30',
          postedAt: 'Active Now',
          requiredSkills: j.required_skills || [],
          description: j.description,
          benefits: j.benefits || ['PF & ESI', 'Overtime Pay'],
          workAddress: j.work_address || j.location,
          status: j.status || 'active',
          matchData: j.match_data || {
            matchPercentage: 91,
            skillCompatibility: { score: 44, max: 50, details: 'Matches trade requirements' },
            experienceScore: { score: 18, max: 20, details: 'Verified tenure' },
            locationScore: { score: 14, max: 15, details: 'Local candidate' },
            certificationScore: { score: 5, max: 5, details: 'Verified certificates' },
            availabilityScore: { score: 10, max: 10, details: 'Immediate' },
            reasons: ['Strong trade profile', 'Valid government credentials'],
          },
        }));
        this.saveToStorage();
      }
    } catch (e) {
      console.log('Public jobs loaded from cache/fallback.');
    }
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

    // Async sync with backend if employer authenticated
    jobApi.createJob({
      title: jobData.title,
      trade_category: jobData.tradeCategory,
      location: jobData.location || `${jobData.city || 'Vijayawada'}, AP`,
      city: jobData.city || 'Vijayawada',
      salary_min: jobData.salaryMin,
      salary_max: jobData.salaryMax,
      salary_period: jobData.salaryPeriod || 'monthly',
      experience_required_years: jobData.experienceRequiredYears || 3,
      job_type: jobData.jobType || 'Full-time',
      shift: jobData.shift || 'Day Shift',
      openings: jobData.openings || 2,
      joining_date: jobData.joiningDate || 'Within 15 Days',
      deadline_date: jobData.deadlineDate || '2026-04-30',
      required_skills: jobData.requiredSkills || [],
      preferred_skills: jobData.preferredSkills || [],
      required_certifications: jobData.requiredCertifications || [],
      description: jobData.description,
      benefits: jobData.benefits || [],
      work_address: jobData.workAddress || 'Autonagar Industrial Area',
      status: jobData.status || 'active',
    }).catch(() => console.log('Job persisted locally'));

    return newJob;
  }

  postNewJob(jobData: any): Job {
    return this.createJob(jobData);
  }

  // Admin Actions
  verifyDocument(docId: string, statusOrApproved: 'verified' | 'rejected' | boolean, reason?: string) {
    const doc = this.verifications.find((v) => v.id === docId);
    const isApproved = typeof statusOrApproved === 'boolean' ? statusOrApproved : statusOrApproved === 'verified';
    
    if (doc) {
      doc.status = isApproved ? 'verified' : 'rejected';
      if (reason) doc.rejectionReason = reason;
      doc.reviewedBy = 'Admin Moderator';
      doc.reviewedAt = new Date().toISOString().split('T')[0];
      this.saveToStorage();
    }

    const numericId = parseInt(docId.replace(/\D/g, ''), 10) || 1;
    if (isApproved) {
      verificationApi.approveDocument(numericId).catch(() => console.log('Approved locally'));
    } else {
      verificationApi.rejectDocument(numericId, reason).catch(() => console.log('Rejected locally'));
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
