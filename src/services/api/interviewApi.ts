import { apiClient } from './apiClient';

export interface ScheduleInterviewRequest {
  date: string;
  time: string;
  interview_type: 'TRADE_TEST' | 'VIDEO_CALL' | 'IN_PERSON' | 'PLANT_VISIT' | 'PHONE' | string;
  location?: string;
  meeting_link?: string;
  location_or_link?: string;
  instructions: string;
  interviewer_name: string;
}

export interface InterviewItem {
  id: number | string;
  application: number | string;
  job_title: string;
  company_name: string;
  company_logo_url?: string;
  worker_name: string;
  worker_trade: string;
  worker_avatar_url?: string;
  worker_trust_score: number;
  scheduled_at?: string;
  date: string;
  time: string;
  interview_type: string;
  location: string;
  meeting_link?: string;
  location_or_link?: string;
  instructions: string;
  interviewer_name: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | string;
  created_by?: number | string;
  created_by_name?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export const interviewApi = {
  // 1. Schedule Interview for Applicant
  async scheduleInterview(applicationId: number | string, payload: ScheduleInterviewRequest) {
    const res = await apiClient.post(`/applications/${applicationId}/schedule-interview/`, payload);
    return res.data;
  },

  // 2. List Interviews Relevant to Authenticated User
  async getInterviews(status?: string) {
    const query = status ? `?status=${status}` : '';
    const res = await apiClient.get(`/interviews/${query}`);
    return res.data;
  },

  // 3. Get Interview Details
  async getInterviewDetail(id: number | string) {
    const res = await apiClient.get(`/interviews/${id}/`);
    return res.data;
  },

  // 4. Update / Reschedule Interview Details
  async updateInterview(id: number | string, payload: Partial<ScheduleInterviewRequest> & { status?: string; feedback?: string }) {
    const res = await apiClient.patch(`/interviews/${id}/`, payload);
    return res.data;
  },

  // 5. Cancel Interview
  async cancelInterview(id: number | string, reason?: string) {
    const res = await apiClient.post(`/interviews/${id}/cancel/`, { reason });
    return res.data;
  },

  // 6. Mark Completed with Feedback
  async completeInterview(id: number | string, feedback?: string, rating?: number, moveToSelected: boolean = true) {
    const res = await apiClient.post(`/interviews/${id}/complete/`, {
      feedback,
      rating,
      move_to_selected: moveToSelected,
    });
    return res.data;
  },
};
