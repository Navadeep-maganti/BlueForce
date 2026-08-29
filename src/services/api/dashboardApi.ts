import { apiClient } from './apiClient';

export interface WorkerDashboardData {
  user: {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    avatar_url?: string;
    is_verified: boolean;
  };
  profile_summary: {
    id: number | string;
    primary_trade: string;
    location: string;
    city: string;
    years_of_experience: number;
    availability: string;
    profile_completeness_percent: number;
  };
  trust_score: {
    score: number;
    breakdown: Record<string, any>;
    max_possible?: Record<string, any>;
    recommendations: string[];
  };
  application_statistics: {
    total_applications: number;
    applied: number;
    screening: number;
    shortlisted: number;
    interview: number;
    selected: number;
    hired: number;
    rejected: number;
  };
  recommended_jobs: Array<{
    id: number | string;
    title: string;
    trade_category: string;
    company_name: string;
    company_logo_url?: string;
    is_company_verified: boolean;
    location: string;
    city: string;
    salary_min: number;
    salary_max: number;
    salary_period: string;
    job_type: string;
    shift: string;
    experience_required_years: number;
    required_skills: string[];
    match_percentage: number;
    match_reasons: string[];
    has_applied: boolean;
  }>;
  upcoming_interviews: Array<{
    id: number | string;
    application_id: number | string;
    job_title: string;
    company_name: string;
    company_logo_url?: string;
    interview_type: string;
    date: string;
    time: string;
    location_or_link: string;
    instructions: string;
    interviewer_name: string;
    status: string;
  }>;
  recent_notifications: Array<{
    id: number | string;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    action_url?: string;
    created_at: string;
  }>;
  unread_notifications_count: number;
  career_insight?: {
    title: string;
    recommended_skill: string;
    salary_boost_estimate: string;
    action_url: string;
  };
}

export interface EmployerDashboardData {
  employer: {
    id: number | string;
    company_name: string;
    trade_industry: string;
    location: string;
    city: string;
    logo_url?: string;
    is_verified: boolean;
    verification_badge: string;
  };
  kpis: {
    active_jobs: number;
    total_openings: number;
    total_applications: number;
    shortlisted_candidates: number;
    upcoming_interviews: number;
    total_hires: number;
  };
  hiring_funnel: {
    applied: number;
    screening: number;
    shortlisted: number;
    interview: number;
    selected: number;
    hired: number;
    rejected: number;
    conversion_rate_percent: number;
  };
  recent_applications: Array<{
    id: number | string;
    job_id: number | string;
    job_title: string;
    worker_id: number | string;
    worker_name: string;
    worker_trade: string;
    worker_avatar_url?: string;
    worker_trust_score: number;
    match_score: number;
    current_stage: string;
    applied_at: string;
  }>;
  recent_jobs: Array<{
    id: number | string;
    title: string;
    trade_category: string;
    location: string;
    city: string;
    openings: number;
    status: string;
    applications_count: number;
    created_at: string;
  }>;
  upcoming_interviews: Array<{
    id: number | string;
    application_id: number | string;
    job_title: string;
    worker_name: string;
    worker_trade: string;
    worker_avatar_url?: string;
    worker_trust_score: number;
    interview_type: string;
    date: string;
    time: string;
    location_or_link: string;
    status: string;
  }>;
}

export const dashboardApi = {
  // 1. Get Aggregated Worker Dashboard
  async getWorkerDashboard(): Promise<{ success: boolean; data: WorkerDashboardData; message: string }> {
    const res = await apiClient.get('/dashboard/worker/');
    return res.data;
  },

  // 2. Get Aggregated Employer Dashboard
  async getEmployerDashboard(): Promise<{ success: boolean; data: EmployerDashboardData; message: string }> {
    const res = await apiClient.get('/dashboard/employer/');
    return res.data;
  },
};
