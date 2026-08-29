import { apiClient } from './apiClient';

export interface ExplainableMatchBreakdown {
  match_score: number;
  eligible: boolean;
  breakdown: {
    skills: number;
    experience: number;
    location: number;
    certifications: number;
    availability: number;
  };
  strengths: string[];
  gaps: string[];
}

export interface RecommendedJobItem extends ExplainableMatchBreakdown {
  job_id: number | string;
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
}

export interface RecommendedCandidateItem extends ExplainableMatchBreakdown {
  worker_id: number | string;
  full_name: string;
  primary_trade: string;
  tagline: string;
  location: string;
  city: string;
  years_of_experience: number;
  availability: string;
  trust_score: number;
  is_verified: boolean;
  avatar_url?: string;
  top_skills: string[];
}

export const matchingApi = {
  // 1. Recommended Jobs tailored for authenticated worker
  async getRecommendedJobs(limit: number = 10): Promise<{ success: boolean; data: RecommendedJobItem[]; message: string }> {
    const res = await apiClient.get(`/jobs/recommended/?limit=${limit}`);
    return res.data;
  },

  // 2. Ranked Candidates tailored for specific employer job
  async getRecommendedCandidates(jobId?: number | string, limit: number = 20): Promise<{
    success: boolean;
    data: {
      job_id: number | string;
      job_title: string;
      trade_category: string;
      required_skills: string[];
      candidates: RecommendedCandidateItem[];
    };
    message: string;
  }> {
    const query = jobId ? `?job_id=${jobId}&limit=${limit}` : `?limit=${limit}`;
    const res = await apiClient.get(`/employer/candidates/recommended/${query}`);
    return res.data;
  },
};
