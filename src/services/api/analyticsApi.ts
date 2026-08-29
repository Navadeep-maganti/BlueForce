import { apiClient } from './apiClient';

export interface PipelineFunnel {
  applied: number;
  screening: number;
  shortlisted: number;
  interview: number;
  selected: number;
  hired: number;
}

export interface ConversionRates {
  shortlist_rate: number;
  interview_rate: number;
  hire_rate: number;
}

export interface ApplicationPerJobItem {
  job_id: number | string;
  title: string;
  trade_category: string;
  openings: number;
  status: string;
  applicants_count: number;
  hired_count: number;
  fill_rate_percent: number;
}

export interface EmployerRecruitmentAnalyticsData {
  total_applications: number;
  active_jobs_count: number;
  average_applications_per_active_job: number;
  pipeline: PipelineFunnel;
  conversion_rates: ConversionRates;
  applications_per_job: ApplicationPerJobItem[];
  top_recruitment_trades: Array<{ trade: string; applicants: number }>;
}

export const analyticsApi = {
  // 1. Get Deep Employer Recruitment Analytics (Phase 15)
  async getEmployerRecruitmentAnalytics(): Promise<{
    success: boolean;
    data: EmployerRecruitmentAnalyticsData;
    message: string;
  }> {
    const res = await apiClient.get('/employer/analytics/');
    return res.data;
  },
};
