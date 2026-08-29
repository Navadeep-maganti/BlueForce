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
  CertificationItem,
  WorkExperienceItem,
  TrustScoreBreakdown,
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
import { jobApi } from './api/jobApi';
import { applicationApi } from './api/applicationApi';
import { verificationApi } from './api/verificationApi';
import { notificationApi } from './api/notificationApi';

const STORAGE_KEYS = {
  CURRENT_USER: 'kaushal_current_user',
  ALL_USERS: 'kaushal_all_users_db',
  USER_DATA_PREFIX: 'kaushal_userdata_',
  GLOBAL_JOBS: 'kaushal_global_jobs',
  GLOBAL_VERIFICATIONS: 'kaushal_global_verifications',
  GLOBAL_REPORTS: 'kaushal_global_reports',
  TOKENS: 'kc_tokens',
};

// Helper to calculate dynamic trust score based on actual items on file
export const calculateDynamicTrustScore = (
  profile: WorkerProfile,
  isUserVerified: boolean
): TrustScoreBreakdown => {
  const identityScore = isUserVerified ? 20 : 0;
  const verifiedCertsCount = profile.certifications.filter(
    (c) => c.verificationStatus === 'verified'
  ).length;
  const totalCertsCount = profile.certifications.length;
  const certsScore = Math.min(
    20,
    totalCertsCount > 0 ? 5 + verifiedCertsCount * 8 : 0
  );

  const testedSkillsCount = profile.skills.filter((s) => s.isVerified).length;
  const skillsScore = Math.min(
    20,
    profile.skills.length * 4 + testedSkillsCount * 3
  );

  const verifiedExpYears = profile.experience.reduce(
    (acc, exp) => acc + (exp.isEmployerVerified ? 2 : 1),
    0
  );
  const expScore = Math.min(15, verifiedExpYears * 4);

  const reviewsCount = profile.reviews?.length || 0;
  const reviewsScore = Math.min(15, reviewsCount * 5);

  const powCount = profile.proofOfWork?.length || 0;
  const powScore = Math.min(10, powCount * 3);

  const total =
    identityScore + certsScore + skillsScore + expScore + reviewsScore + powScore;

  return {
    total: Math.min(100, total),
    identity: {
      score: identityScore,
      max: 20,
      verified: isUserVerified,
      label: 'Aadhaar eKYC',
    },
    certifications: {
      score: certsScore,
      max: 20,
      verifiedCount: verifiedCertsCount,
      label: 'Trade Credentials',
    },
    skills: {
      score: skillsScore,
      max: 20,
      testedCount: testedSkillsCount,
      label: 'Technical Competency',
    },
    experience: {
      score: expScore,
      max: 15,
      verifiedYears: verifiedExpYears,
      label: 'Plant Experience',
    },
    employerReviews: {
      score: reviewsScore,
      max: 15,
      avgRating: 5.0,
      reviewCount: reviewsCount,
      label: 'Supervisor Reviews',
    },
    completedJobs: {
      score: powScore,
      max: 10,
      completedCount: powCount,
      label: 'Proof of Work',
    },
  };
};

export const calculateDynamicProfileStrength = (profile: WorkerProfile): number => {
  let score = 20; // baseline for account registration
  if (profile.fullName && profile.fullName.trim().length > 2) score += 10;
  if (profile.bio && profile.bio.trim().length > 10) score += 15;
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.certifications && profile.certifications.length > 0) score += 15;
  if (profile.experience && profile.experience.length > 0) score += 10;
  if (profile.proofOfWork && profile.proofOfWork.length > 0) score += 10;
  return Math.min(100, score);
};

export const createCleanWorkerProfile = (user: User, trade?: string): WorkerProfile => {
  const profile: WorkerProfile = {
    id: `worker_${user.id}`,
    userId: user.id,
    fullName: user.name,
    primaryTrade: trade || 'Skilled Technician',
    tagline: trade ? `Certified ${trade}` : 'Skilled Technical Professional',
    bio: '',
    location: user.location || 'Vijayawada, AP',
    city: user.location ? user.location.split(',')[0].trim() : 'Vijayawada',
    state: 'Andhra Pradesh',
    pinCode: '520007',
    preferredRadiusKm: 50,
    phone: user.phone,
    email: user.email,
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    availability: 'available_now',
    expectedSalaryMonthly: { min: 25000, max: 35000 },
    yearsOfExperience: 0,
    education: 'ITI / Diploma',
    languages: ['Telugu', 'English', 'Hindi'],
    skills: trade
      ? [
          {
            id: `sk_${Date.now()}`,
            name: trade,
            category: 'Primary Trade',
            level: 3,
            yearsExperience: 1,
            isVerified: false,
          },
        ]
      : [],
    certifications: [],
    experience: [],
    proofOfWork: [],
    reviews: [],
    recommendedSkills: [
      { skill: 'PLC Automation & Ladder Logic', unlocksJobsCount: 18, avgSalaryBoost: '+₹6,000/mo' },
      { skill: 'Solar Inverter Troubleshooting', unlocksJobsCount: 14, avgSalaryBoost: '+₹4,500/mo' },
    ],
    bookmarkedJobIds: [],
    profileStrengthPercent: 30,
    trustScore: {
      total: user.isVerified ? 20 : 0,
      identity: { score: user.isVerified ? 20 : 0, max: 20, verified: user.isVerified, label: 'Aadhaar eKYC' },
      certifications: { score: 0, max: 20, verifiedCount: 0, label: 'Trade Credentials' },
      skills: { score: trade ? 4 : 0, max: 20, testedCount: 0, label: 'Technical Competency' },
      experience: { score: 0, max: 15, verifiedYears: 0, label: 'Plant Experience' },
      employerReviews: { score: 0, max: 15, avgRating: 0, reviewCount: 0, label: 'Supervisor Reviews' },
      completedJobs: { score: 0, max: 10, completedCount: 0, label: 'Proof of Work' },
    },
  };

  profile.trustScore = calculateDynamicTrustScore(profile, user.isVerified);
  profile.profileStrengthPercent = calculateDynamicProfileStrength(profile);
  return profile;
};

export const createCleanEmployerProfile = (user: User, companyName?: string, tradeIndustry?: string): EmployerProfile => {
  return {
    id: `emp_${user.id}`,
    userId: user.id,
    companyName: companyName || user.name || 'Industrial Enterprise',
    tradeIndustry: tradeIndustry || 'Manufacturing & Industrial Engineering',
    tagline: 'Verified Industrial Employer',
    description: '',
    gstOrCinNumber: '',
    location: user.location || 'Vijayawada, AP',
    city: user.location ? user.location.split(',')[0].trim() : 'Vijayawada',
    state: 'Andhra Pradesh',
    logoUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
    isVerified: user.isVerified,
    verificationBadge: 'Verified Enterprise',
    employeeCount: '50-200',
    establishedYear: 2018,
    contactPerson: user.name,
    contactEmail: user.email,
    contactPhone: user.phone,
    bookmarkedWorkerIds: [],
  };
};

class Store {
  private listeners: Set<() => void> = new Set();

  currentUser: User | null = null;
  workerProfile: WorkerProfile = defaultWorkerProfile;
  candidates: WorkerProfile[] = mockCandidates;
  employerProfile: EmployerProfile = mockEmployerProfile;
  jobs: Job[] = mockJobs;
  applications: Application[] = [];
  verifications: VerificationDocument[] = mockVerifications;
  reports: PlatformReport[] = mockReports;
  notifications: NotificationItem[] = [];
  isLoading: boolean = false;
  authError: string | null = null;

  constructor() {
    this.loadGlobalData();
    this.loadCurrentUserSession();
  }

  private loadGlobalData() {
    try {
      const savedJobs = localStorage.getItem(STORAGE_KEYS.GLOBAL_JOBS);
      this.jobs = savedJobs ? JSON.parse(savedJobs) : mockJobs;

      const savedVerifs = localStorage.getItem(STORAGE_KEYS.GLOBAL_VERIFICATIONS);
      this.verifications = savedVerifs ? JSON.parse(savedVerifs) : mockVerifications;

      const savedReports = localStorage.getItem(STORAGE_KEYS.GLOBAL_REPORTS);
      this.reports = savedReports ? JSON.parse(savedReports) : mockReports;
    } catch (e) {
      console.error('Error loading global data:', e);
    }
  }

  private saveGlobalData() {
    try {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEYS.GLOBAL_VERIFICATIONS, JSON.stringify(this.verifications));
      localStorage.setItem(STORAGE_KEYS.GLOBAL_REPORTS, JSON.stringify(this.reports));
    } catch (e) {
      console.error('Error saving global data:', e);
    }
  }

  private loadCurrentUserSession() {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.loadUserData(this.currentUser!.id, this.currentUser!.role);
      } else {
        // No user logged in by default - clean guest visitor state
        this.currentUser = null;
        this.applications = [];
        this.notifications = [];
      }
    } catch (e) {
      console.error('Error loading current user session:', e);
      this.currentUser = null;
      this.applications = [];
      this.notifications = [];
    }
  }

  private loadUserData(userId: string, role: UserRole) {
    try {
      const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`;
      const savedDataStr = localStorage.getItem(key);

      if (savedDataStr) {
        const data = JSON.parse(savedDataStr);
        if (role === 'worker') {
          this.workerProfile = data.workerProfile || createCleanWorkerProfile(this.currentUser!);
          this.applications = data.applications || [];
        } else if (role === 'employer') {
          this.employerProfile = data.employerProfile || createCleanEmployerProfile(this.currentUser!);
          this.applications = data.applications || [];
        }
        this.notifications = data.notifications || [];
      } else {
        // If this is a mock user, load mock data, otherwise create clean profile!
        const isMockWorker = userId === '1' || userId === 'worker_1';
        const isMockEmployer = userId === '2' || userId === 'employer_1';

        if (isMockWorker) {
          this.workerProfile = defaultWorkerProfile;
          this.applications = mockApplications;
          this.notifications = mockNotifications;
        } else if (isMockEmployer) {
          this.employerProfile = mockEmployerProfile;
          this.applications = mockApplications;
          this.notifications = mockNotifications;
        } else {
          // BRAND NEW USER: Clean empty state
          if (role === 'worker') {
            this.workerProfile = createCleanWorkerProfile(this.currentUser!);
            this.applications = [];
          } else if (role === 'employer') {
            this.employerProfile = createCleanEmployerProfile(this.currentUser!);
            this.applications = [];
          }
          this.notifications = [
            {
              id: `notif_${Date.now()}`,
              userId: userId,
              title: 'Welcome to KaushalConnect',
              message: 'Your account is ready. Complete your profile to boost your workforce trust score.',
              type: 'system',
              timestamp: 'Just now',
              isRead: false,
            },
          ];
        }
        this.saveCurrentUserData();
      }
    } catch (e) {
      console.error('Error loading user specific data:', e);
    }
  }

  private saveCurrentUserData() {
    if (!this.currentUser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));

      const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${this.currentUser.id}`;
      const dataToSave = {
        workerProfile: this.currentUser.role === 'worker' ? this.workerProfile : undefined,
        employerProfile: this.currentUser.role === 'employer' ? this.employerProfile : undefined,
        applications: this.applications,
        notifications: this.notifications,
      };
      localStorage.setItem(key, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving user data:', e);
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
        this.loadUserData(this.currentUser.id, this.currentUser.role);
        this.notify();
      }
    } catch (err) {
      console.log('Session restore info: working in local persistent mode');
    }
  }

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    this.isLoading = true;
    this.authError = null;
    this.notify();

    // Check if this is a known demo account
    const isWorkerDemo = usernameOrEmail.toLowerCase().includes('worker');
    const isEmployerDemo = usernameOrEmail.toLowerCase().includes('employer');
    const isAdminDemo = usernameOrEmail.toLowerCase().includes('admin');

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

        this.loadUserData(this.currentUser.id, this.currentUser.role);
        this.isLoading = false;
        this.notify();
        return { success: true, message: 'Login successful', user: this.currentUser };
      }
    } catch (err) {
      // Fall back to local DB check
    }

    // Local DB search
    const allUsersDbStr = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    const allUsers: User[] = allUsersDbStr ? JSON.parse(allUsersDbStr) : mockUsers;

    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );

    if (matchedUser) {
      this.currentUser = matchedUser;
      this.loadUserData(this.currentUser.id, this.currentUser.role);
      this.isLoading = false;
      this.notify();
      return { success: true, message: 'Login successful', user: this.currentUser };
    }

    if (isWorkerDemo || isEmployerDemo || isAdminDemo) {
      const role: UserRole = isWorkerDemo ? 'worker' : isEmployerDemo ? 'employer' : 'admin';
      this.loginAs(role);
      this.isLoading = false;
      return { success: true, message: 'Signed in with demo persona', user: this.currentUser! };
    }

    this.isLoading = false;
    this.authError = 'Invalid email or password.';
    this.notify();
    return { success: false, message: 'Invalid credentials.' };
  }

  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string; user?: User }> {
    this.isLoading = true;
    this.authError = null;
    this.notify();

    let newUserId = `user_${Date.now()}`;
    let isVerified = false;

    try {
      const res = await authApi.register(payload);
      if (res?.success && res?.data) {
        const { tokens, user: u } = res.data;
        localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
        newUserId = String(u.id);
        isVerified = u.is_verified;
      }
    } catch (err) {
      console.log('Registering in local persistent storage');
    }

    const newUser: User = {
      id: newUserId,
      name: payload.full_name || payload.company_name || payload.email.split('@')[0],
      email: payload.email,
      phone: payload.phone || '+91 98480 12345',
      role: payload.role,
      location: payload.location || 'Vijayawada, AP',
      avatarUrl:
        payload.role === 'worker'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
          : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
      isVerified: isVerified,
      createdAt: new Date().toISOString(),
    };

    // Save to all users DB
    const allUsersDbStr = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    const allUsers: User[] = allUsersDbStr ? JSON.parse(allUsersDbStr) : [...mockUsers];
    allUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));

    this.currentUser = newUser;

    // Create 100% clean profile with ONLY the user's provided input
    if (newUser.role === 'worker') {
      this.workerProfile = createCleanWorkerProfile(newUser, payload.primary_trade);
      this.applications = [];
    } else if (newUser.role === 'employer') {
      this.employerProfile = createCleanEmployerProfile(
        newUser,
        payload.company_name,
        payload.trade_industry
      );
      this.applications = [];
    }

    this.notifications = [
      {
        id: `notif_${Date.now()}`,
        userId: newUser.id,
        title: 'Account Created',
        message: 'Welcome to KaushalConnect. Start adding your skills and work history.',
        type: 'system',
        timestamp: 'Just now',
        isRead: false,
      },
    ];

    this.saveCurrentUserData();
    this.isLoading = false;
    this.notify();
    return { success: true, message: 'Account created successfully', user: this.currentUser };
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
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.currentUser = null;
    this.notifications = [];
    this.applications = [];
    this.notify();
  }

  loginAs(role: UserRole) {
    const foundUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    this.currentUser = foundUser;
    this.loadUserData(this.currentUser.id, this.currentUser.role);
    this.saveCurrentUserData();
    this.notify();
  }

  // Worker Profile Updates & Additions
  updateWorkerProfile(data: Partial<WorkerProfile>) {
    this.workerProfile = {
      ...this.workerProfile,
      ...data,
    };
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  addSkill(skillData: Omit<SkillItem, 'id'>) {
    const newSkill: SkillItem = {
      ...skillData,
      id: `sk_${Date.now()}`,
    };
    this.workerProfile.skills = [...this.workerProfile.skills, newSkill];
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  removeSkill(skillId: string) {
    this.workerProfile.skills = this.workerProfile.skills.filter((s) => s.id !== skillId);
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  addCertification(certData: Omit<CertificationItem, 'id' | 'verificationStatus'>) {
    const newCert: CertificationItem = {
      ...certData,
      id: `cert_${Date.now()}`,
      verificationStatus: 'pending',
    };
    this.workerProfile.certifications = [...this.workerProfile.certifications, newCert];

    // Add to global verification audit queue
    const newVerifDoc: VerificationDocument = {
      id: `vdoc_${Date.now()}`,
      workerOrEmployerId: this.workerProfile.id,
      entityName: this.workerProfile.fullName,
      entityType: 'worker',
      docType: 'ITI Diploma',
      docNumber: certData.credentialId || 'NSDC-CERT-NEW',
      submittedAt: 'Just now',
      status: 'pending',
      fileUrl: certData.documentUrl || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    };
    this.verifications = [newVerifDoc, ...this.verifications];
    this.saveGlobalData();

    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  removeCertification(certId: string) {
    this.workerProfile.certifications = this.workerProfile.certifications.filter(
      (c) => c.id !== certId
    );
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  addExperience(expData: Omit<WorkExperienceItem, 'id' | 'isEmployerVerified'>) {
    const newExp: WorkExperienceItem = {
      ...expData,
      id: `exp_${Date.now()}`,
      isEmployerVerified: false,
    };
    this.workerProfile.experience = [...this.workerProfile.experience, newExp];
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  removeExperience(expId: string) {
    this.workerProfile.experience = this.workerProfile.experience.filter((e) => e.id !== expId);
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  addProofOfWork(powData: Omit<ProofOfWorkItem, 'id'>) {
    const newPow: ProofOfWorkItem = {
      ...powData,
      id: `pow_${Date.now()}`,
    };
    this.workerProfile.proofOfWork = [...this.workerProfile.proofOfWork, newPow];
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  removeProofOfWork(powId: string) {
    this.workerProfile.proofOfWork = this.workerProfile.proofOfWork.filter((p) => p.id !== powId);
    this.workerProfile.trustScore = calculateDynamicTrustScore(
      this.workerProfile,
      this.currentUser?.isVerified ?? false
    );
    this.workerProfile.profileStrengthPercent = calculateDynamicProfileStrength(
      this.workerProfile
    );
    this.saveCurrentUserData();
  }

  // Employer Profile & Job Posting
  updateEmployerProfile(data: Partial<EmployerProfile>) {
    this.employerProfile = {
      ...this.employerProfile,
      ...data,
    };
    this.saveCurrentUserData();
  }

  createJob(jobData: Partial<Job>): { success: boolean; message: string; job?: Job } {
    if (!this.currentUser || this.currentUser.role !== 'employer') {
      return { success: false, message: 'You must be logged in as an Employer to post job openings.' };
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      employerId: this.employerProfile.id,
      companyName: this.employerProfile.companyName,
      companyLogoUrl: this.employerProfile.logoUrl,
      isCompanyVerified: this.employerProfile.isVerified,
      title: jobData.title || 'Technical Specialist',
      tradeCategory: jobData.tradeCategory || this.employerProfile.tradeIndustry || 'Manufacturing',
      location: jobData.location || this.employerProfile.location,
      city: jobData.city || this.employerProfile.city,
      salaryMin: jobData.salaryMin || 25000,
      salaryMax: jobData.salaryMax || 35000,
      salaryPeriod: 'monthly',
      experienceRequiredYears: jobData.experienceRequiredYears || 2,
      jobType: jobData.jobType || 'Full-time',
      shift: jobData.shift || 'Day Shift',
      openings: jobData.openings || 2,
      joiningDate: jobData.joiningDate || 'Immediate',
      deadlineDate: '30 days',
      postedAt: 'Just now',
      requiredSkills: jobData.requiredSkills || ['Industrial Maintenance'],
      description: jobData.description || 'Verified job opening created via Employer Hub.',
      benefits: jobData.benefits || ['PF + ESI Coverage', 'Overtime Allowance'],
      workAddress: jobData.workAddress || this.employerProfile.location,
      status: 'active',
      applicationsCount: 0,
    };

    this.jobs = [newJob, ...this.jobs];
    this.saveGlobalData();
    this.notify();
    return { success: true, message: 'Opening posted successfully', job: newJob };
  }

  // Worker Application Submission
  applyForJob(jobId: string): { success: boolean; message: string; applicationId?: string } {
    if (!this.currentUser) {
      return { success: false, message: 'Please sign in or create a free worker account to apply.' };
    }

    if (this.currentUser.role !== 'worker') {
      return { success: false, message: 'Only Worker accounts can apply for jobs. You are logged in as an Employer.' };
    }

    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job opening not found.' };

    const existing = this.applications.find(
      (a) => a.jobId === jobId && a.workerId === this.workerProfile.id
    );
    if (existing) {
      return { success: false, message: 'You have already applied for this opening.' };
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
      matchScore: 92,
      topSkills: this.workerProfile.skills.map((s) => s.name),
      appliedDate: 'Just now',
      currentStage: 'Applied',
      timeline: [
        {
          stage: 'Applied',
          timestamp: 'Just now',
          note: 'Application submitted with verified credentials attached.',
          completed: true,
        },
      ],
    };

    this.applications = [newApp, ...this.applications];
    job.applicationsCount = (job.applicationsCount || 0) + 1;
    this.saveGlobalData();
    this.saveCurrentUserData();

    // Add confirmation notification
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: this.currentUser.id,
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.companyName} was sent.`,
      type: 'application_update',
      timestamp: 'Just now',
      isRead: false,
      actionUrl: '/worker/applications',
    });
    this.saveCurrentUserData();

    return { success: true, message: 'Application submitted successfully!', applicationId: newApp.id };
  }

  // Kanban Pipeline Stage Transition
  updateApplicationStage(appId: string, nextStage: ApplicationStage, notes?: string) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    app.currentStage = nextStage;
    app.timeline.push({
      stage: nextStage,
      timestamp: 'Just now',
      note: notes || `Moved to ${nextStage}`,
      completed: true,
    });

    this.saveCurrentUserData();
    this.saveGlobalData();
    this.notify();
  }

  // Interview Scheduling
  scheduleInterview(appId: string, details: InterviewDetails) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    app.interview = details;
    app.currentStage = 'Interview';
    app.timeline.push({
      stage: 'Interview',
      timestamp: 'Just now',
      note: `${details.type} scheduled on ${details.date} at ${details.time}`,
      completed: true,
    });

    this.saveCurrentUserData();
    this.saveGlobalData();
    this.notify();
  }

  // Document Verification (Admin)
  verifyDocument(id: string, status: 'verified' | 'rejected', reason?: string) {
    const doc = this.verifications.find((v) => v.id === id);
    if (doc) {
      doc.status = status;
      doc.rejectionReason = reason;
      doc.reviewedAt = 'Just now';
      doc.reviewedBy = 'NSDC Regional Auditor';
      this.saveGlobalData();
      this.notify();
    }
  }

  resolveReport(id: string, status: 'resolved' | 'dismissed') {
    const report = this.reports.find((r) => r.id === id);
    if (report) {
      report.status = status;
      this.saveGlobalData();
      this.notify();
    }
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveCurrentUserData();
    }
  }

  postNewJob(jobData: Partial<Job>) {
    return this.createJob(jobData);
  }

  moveApplicationStage(appId: string, currentStage: ApplicationStage, direction: 'next' | 'prev') {
    const STAGES: ApplicationStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];
    const idx = STAGES.indexOf(currentStage);
    if (idx === -1) return;

    let targetStage = currentStage;
    if (direction === 'next' && idx < STAGES.length - 1) {
      targetStage = STAGES[idx + 1];
    } else if (direction === 'prev' && idx > 0) {
      targetStage = STAGES[idx - 1];
    }

    if (targetStage !== currentStage) {
      this.updateApplicationStage(appId, targetStage);
    }
  }

  toggleBookmarkJob(jobId: string): boolean {
    const exists = this.workerProfile.bookmarkedJobIds.includes(jobId);
    if (exists) {
      this.workerProfile.bookmarkedJobIds = this.workerProfile.bookmarkedJobIds.filter((id) => id !== jobId);
    } else {
      this.workerProfile.bookmarkedJobIds.push(jobId);
    }
    this.saveCurrentUserData();
    return !exists;
  }

  toggleBookmarkWorker(workerId: string): boolean {
    const exists = this.employerProfile.bookmarkedWorkerIds.includes(workerId);
    if (exists) {
      this.employerProfile.bookmarkedWorkerIds = this.employerProfile.bookmarkedWorkerIds.filter((id) => id !== workerId);
    } else {
      this.employerProfile.bookmarkedWorkerIds.push(workerId);
    }
    this.saveCurrentUserData();
    return !exists;
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
    this.saveCurrentUserData();
  }
}

export const appStore = new Store();
