import { apiClient } from './apiClient';
import { Job } from '../../types';

export interface JobFilterParams {
  search?: string;
  location?: string;
  city?: string;
  category?: string;
  trade?: string;
  radius?: number;
  min_salary?: number;
  max_salary?: number;
  experience?: number;
  shift?: string;
  job_type?: string;
  skills?: string;
  page?: number;
}

export interface CreateJobPayload {
  title: string;
  trade_category: string;
  location: string;
  city: string;
  salary_min: number;
  salary_max: number;
  salary_period?: string;
  experience_required_years?: number;
  job_type?: string;
  shift?: string;
  openings?: number;
  joining_date?: string;
  deadline_date?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  required_certifications?: string[];
  description: string;
  benefits?: string[];
  work_address?: string;
  status?: string;
}

export const jobApi = {
  // 1. Public Job Discovery
  async getPublicJobs(params: JobFilterParams = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        query.append(key, String(value));
      }
    });
    const res = await apiClient.get(`/jobs/?${query.toString()}`);
    return res.data;
  },

  // 2. Public Job Detail
  async getJobDetail(id: number | string) {
    const res = await apiClient.get(`/jobs/${id}/`);
    return res.data;
  },

  // 3. Employer Job CRUD
  async getEmployerJobs(status?: string) {
    const query = status ? `?status=${status}` : '';
    const res = await apiClient.get(`/employer/jobs/${query}`);
    return res.data;
  },

  async createJob(payload: CreateJobPayload) {
    const res = await apiClient.post('/employer/jobs/', payload);
    return res.data;
  },

  async getEmployerJobDetail(id: number | string) {
    const res = await apiClient.get(`/employer/jobs/${id}/`);
    return res.data;
  },

  async updateJob(id: number | string, payload: Partial<CreateJobPayload>) {
    const res = await apiClient.patch(`/employer/jobs/${id}/`, payload);
    return res.data;
  },

  async closeJob(id: number | string) {
    const res = await apiClient.delete(`/employer/jobs/${id}/`);
    return res.data;
  },

  // 4. Saved Jobs (Phase 13)
  async saveJob(id: number | string) {
    const res = await apiClient.post(`/jobs/${id}/save/`);
    return res.data;
  },

  async unsaveJob(id: number | string) {
    const res = await apiClient.delete(`/jobs/${id}/save/`);
    return res.data;
  },

  async getSavedJobs() {
    const res = await apiClient.get('/workers/me/saved-jobs/');
    return res.data;
  },
};
