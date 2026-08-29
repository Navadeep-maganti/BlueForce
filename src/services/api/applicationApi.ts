import { apiClient } from './apiClient';
import { ApplicationStage, InterviewDetails } from '../../types';

export interface ScheduleInterviewPayload {
  date: string;
  time: string;
  interview_type: string;
  location_or_link: string;
  instructions: string;
  interviewer_name: string;
}

export const applicationApi = {
  // 1. Worker Apply for Job
  async applyForJob(jobId: number | string) {
    const res = await apiClient.post(`/jobs/${jobId}/apply/`);
    return res.data;
  },

  // 2. Worker My Applications
  async getMyApplications() {
    const res = await apiClient.get('/applications/my/');
    return res.data;
  },

  // 3. Employer Recruitment Pipeline
  async getEmployerApplications(params: { job_id?: string; stage?: string } = {}) {
    const query = new URLSearchParams();
    if (params.job_id) query.append('job_id', params.job_id);
    if (params.stage && params.stage !== 'all') query.append('stage', params.stage);
    const res = await apiClient.get(`/applications/employer/?${query.toString()}`);
    return res.data;
  },

  // 4. Update Application Stage (with Guarded Transitions)
  async updateStage(applicationId: number | string, stage: ApplicationStage, note?: string, rejectionReason?: string) {
    const res = await apiClient.patch(`/applications/${applicationId}/stage/`, {
      stage,
      note,
      rejection_reason: rejectionReason,
    });
    return res.data;
  },

  // 5. Schedule Interview
  async scheduleInterview(applicationId: number | string, payload: ScheduleInterviewPayload) {
    const res = await apiClient.post(`/applications/${applicationId}/schedule-interview/`, payload);
    return res.data;
  },

  // 6. Application Detail
  async getApplicationDetail(applicationId: number | string) {
    const res = await apiClient.get(`/applications/${applicationId}/`);
    return res.data;
  },
};
