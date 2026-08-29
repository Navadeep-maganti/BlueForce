export type UserRole = 'worker' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  location: string;
  language?: 'en' | 'te' | 'hi';
  isVerified: boolean;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number; // 1 to 5
  yearsExperience: number;
  isVerified: boolean;
  verificationSource?: string; // e.g. 'ITI Skill Test', 'ABC Industries Assessment'
  badgeIcon?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuingBody: string; // e.g. 'National Skill Development Corp (NSDC)', 'State Board of Technical Education'
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  documentUrl?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
}

export interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  skillsUsed: string[];
  isEmployerVerified: boolean;
  verifierContact?: string;
}

export interface ProofOfWorkItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  skillsDemonstrated: string[];
  clientOrEmployer: string;
  location: string;
  completionDate: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationBadgeUrl?: string;
  rating?: number;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerCompany: string;
  rating: number;
  comment: string;
  date: string;
  verifiedHire: boolean;
}

export interface TrustScoreBreakdown {
  total: number; // max 100
  identity: { score: number; max: number; verified: boolean; label: string };
  certifications: { score: number; max: number; verifiedCount: number; label: string };
  skills: { score: number; max: number; testedCount: number; label: string };
  experience: { score: number; max: number; verifiedYears: number; label: string };
  employerReviews: { score: number; max: number; avgRating: number; reviewCount: number; label: string };
  completedJobs: { score: number; max: number; completedCount: number; label: string };
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  primaryTrade: string; // e.g., 'Industrial Electrician', 'CNC Lathe Operator'
  tagline: string;
  bio: string;
  location: string;
  city: string;
  state: string;
  pinCode: string;
  preferredRadiusKm: number;
  phone: string;
  email: string;
  avatarUrl: string;
  availability: 'available_now' | 'in_two_weeks' | 'employed_open';
  expectedSalaryMonthly: { min: number; max: number };
  yearsOfExperience: number;
  education: string;
  languages: string[];
  trustScore: TrustScoreBreakdown;
  profileStrengthPercent: number;
  skills: SkillItem[];
  certifications: CertificationItem[];
  experience: WorkExperienceItem[];
  proofOfWork: ProofOfWorkItem[];
  reviews: ReviewItem[];
  recommendedSkills: {
    skill: string;
    unlocksJobsCount: number;
    avgSalaryBoost: string;
    courseUrl?: string;
  }[];
  bookmarkedJobIds: string[];
  aadhaarMasked?: string;
  isDigiLockerVerified?: boolean;
  digiLockerVerifiedAt?: string;
  digiLockerDocs?: {
    type: string;
    docName: string;
    docNumber: string;
    issuer: string;
    verifiedAt: string;
  }[];
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  tradeIndustry: string; // e.g., 'Industrial Manufacturing', 'Solar Energy Solutions'
  tagline: string;
  description: string;
  gstOrCinNumber: string;
  location: string;
  city: string;
  state: string;
  logoUrl: string;
  isVerified: boolean;
  verificationBadge: string;
  employeeCount: string;
  establishedYear: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  bookmarkedWorkerIds: string[];
}

export interface JobMatchBreakdown {
  matchPercentage: number;
  skillCompatibility: { score: number; max: number; details: string };
  experienceScore: { score: number; max: number; details: string };
  locationScore: { score: number; max: number; details: string };
  certificationScore: { score: number; max: number; details: string };
  availabilityScore: { score: number; max: number; details: string };
  reasons: string[];
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogoUrl: string;
  isCompanyVerified: boolean;
  title: string;
  tradeCategory: string;
  location: string;
  city: string;
  distanceKm?: number;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'monthly' | 'daily' | 'hourly';
  experienceRequiredYears: number;
  jobType: 'Full-time' | 'Contract' | 'Part-time' | 'Shift-based';
  shift: 'Day Shift' | 'Night Shift' | 'Rotational' | 'Flexible';
  openings: number;
  joiningDate: string;
  deadlineDate: string;
  postedAt: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  requiredCertifications?: string[];
  description: string;
  benefits: string[];
  workAddress: string;
  status: 'active' | 'paused' | 'closed';
  matchData?: JobMatchBreakdown;
  applicationsCount?: number;
}

export type ApplicationStage = 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected' | 'Hired' | 'Rejected';

export interface ApplicationTimelineEvent {
  stage: ApplicationStage;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface InterviewDetails {
  id: string;
  date: string;
  time: string;
  type: 'In-person Trade Test' | 'Video Call' | 'Phone Screening' | 'Plant Visit';
  locationOrLink: string;
  instructions: string;
  interviewerName: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  jobTitle: string;
  companyName: string;
  workerName: string;
  workerTrade: string;
  workerAvatarUrl: string;
  workerTrustScore: number;
  workerExperienceYears: number;
  workerLocation: string;
  matchScore: number;
  topSkills: string[];
  appliedDate: string;
  currentStage: ApplicationStage;
  timeline: ApplicationTimelineEvent[];
  interview?: InterviewDetails;
  employerNotes?: string;
  rating?: number;
  rejectionReason?: string;
}

export interface VerificationDocument {
  id: string;
  workerOrEmployerId: string;
  entityName: string;
  entityType: 'worker' | 'employer';
  docType: 'Aadhaar / National ID' | 'ITI Diploma' | 'Trade License' | 'GST Certificate' | 'Experience Letter';
  docNumber: string;
  submittedAt: string;
  status: 'verified' | 'pending' | 'rejected';
  fileUrl: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PlatformReport {
  id: string;
  reporterName: string;
  reportedEntityName: string;
  reportedEntityType: 'job' | 'employer' | 'worker' | 'certificate';
  reasonCategory: 'Fake Job' | 'Fraudulent Certificate' | 'Unsafe Workplace' | 'Harassment' | 'Payment Default';
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
  evidenceUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_match' | 'application_update' | 'interview' | 'verification' | 'system';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
