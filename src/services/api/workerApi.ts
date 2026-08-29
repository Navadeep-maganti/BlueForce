import { apiClient } from './apiClient';

export interface WorkerSkillPayload {
  skill_name: string;
  category?: string;
  level: number;
  years_experience: number;
}

export interface ProofOfWorkPayload {
  title: string;
  description: string;
  category: string;
  images: string[];
  skills_demonstrated: string[];
  client_or_employer: string;
  location: string;
  completion_date: string;
}

export interface CertificationPayload {
  title: string;
  issuing_body: string;
  issue_date: string;
  expiry_date?: string;
  credential_id: string;
  document_url?: string;
}

export interface WorkerFilterParams {
  search?: string;
  skill?: string;
  location?: string;
  city?: string;
  experience?: number;
  availability?: string;
  minimum_trust_score?: number;
  verified_only?: boolean;
  ordering?: string;
  page?: number;
}

export const workerApi = {
  // 1. Candidate Discovery for Employers (Phase 6)
  async discoverWorkers(params: WorkerFilterParams = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        query.append(key, String(value));
      }
    });
    const res = await apiClient.get(`/workers/?${query.toString()}`);
    return res.data;
  },

  // 2. Public Sanitized Worker Profile for Employers
  async getPublicProfile(id: number | string) {
    const res = await apiClient.get(`/workers/${id}/`);
    return res.data;
  },

  // 3. Worker's Own Aggregated Profile
  async getMyProfile() {
    const res = await apiClient.get('/workers/me/');
    return res.data;
  },

  async updateMyProfile(data: Record<string, any>) {
    const res = await apiClient.patch('/workers/me/', data);
    return res.data;
  },

  // 4. Skills
  async getTaxonomySkills(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const res = await apiClient.get(`/skills/?${params.toString()}`);
    return res.data;
  },

  async getMySkills() {
    const res = await apiClient.get('/workers/me/skills/');
    return res.data;
  },

  async addSkill(payload: WorkerSkillPayload) {
    const res = await apiClient.post('/workers/me/skills/', payload);
    return res.data;
  },

  async updateSkill(id: number | string, payload: Partial<WorkerSkillPayload>) {
    const res = await apiClient.patch(`/workers/me/skills/${id}/`, payload);
    return res.data;
  },

  async deleteSkill(id: number | string) {
    const res = await apiClient.delete(`/workers/me/skills/${id}/`);
    return res.data;
  },

  // 5. Certifications
  async getMyCertifications() {
    const res = await apiClient.get('/workers/me/certifications/');
    return res.data;
  },

  async addCertification(payload: CertificationPayload) {
    const res = await apiClient.post('/workers/me/certifications/', payload);
    return res.data;
  },

  async deleteCertification(id: number | string) {
    const res = await apiClient.delete(`/workers/me/certifications/${id}/`);
    return res.data;
  },

  // 6. Proof of Work
  async getMyProofOfWork() {
    const res = await apiClient.get('/workers/me/proof-of-work/');
    return res.data;
  },

  async addProofOfWork(payload: ProofOfWorkPayload) {
    const res = await apiClient.post('/workers/me/proof-of-work/', payload);
    return res.data;
  },

  async updateProofOfWork(id: number | string, payload: Partial<ProofOfWorkPayload>) {
    const res = await apiClient.patch(`/workers/me/proof-of-work/${id}/`, payload);
    return res.data;
  },

  async deleteProofOfWork(id: number | string) {
    const res = await apiClient.delete(`/workers/me/proof-of-work/${id}/`);
    return res.data;
  },
};
