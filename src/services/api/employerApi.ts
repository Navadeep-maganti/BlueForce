import { apiClient } from './apiClient';
import { CreateJobPayload } from './jobApi';
import { ApplicationStage } from '../../types';

export interface EmployerProfileData {
  id: number | string;
  company_name: string;
  trade_industry: string;
  tagline?: string;
  description?: string;
  gst_or_cin_number?: string;
  location: string;
  city: string;
  state: string;
  logo_url?: string;
  is_verified: boolean;
  verification_badge: string;
  employee_count: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
}

export const employerApi = {
  // 1. Employer Profile
  async getProfile(): Promise<{ success: boolean; data: EmployerProfileData; message: string }> {
    const res = await apiClient.get('/employers/me/');
    return res.data;
  },

  // 2. Employer Jobs CRUD
  async getJobs(status?: string) {
    const query = status ? `?status=${status}` : '';
    const res = await apiClient.get(`/employer/jobs/${query}`);
    return res.data;
  },

  async createJob(payload: CreateJobPayload) {
    const res = await apiClient.post('/employer/jobs/', payload);
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

  // 3. Recruitment Pipeline
  async getApplications(params: { job_id?: string; stage?: string } = {}) {
    const query = new URLSearchParams();
    if (params.job_id) query.append('job_id', params.job_id);
    if (params.stage && params.stage !== 'all') query.append('stage', params.stage);
    const res = await apiClient.get(`/applications/employer/?${query.toString()}`);
    return res.data;
  },

  async updateStage(applicationId: number | string, stage: ApplicationStage, note?: string, rejectionReason?: string) {
    const res = await apiClient.patch(`/applications/${applicationId}/stage/`, {
      stage,
      note,
      rejection_reason: rejectionReason,
    });
    return res.data;
  },

  // 4. Saved Candidates Roster
  async getSavedCandidates() {
    const res = await apiClient.get('/employer/saved-candidates/');
    return res.data;
  },
};
