import { apiClient } from './apiClient';

export type ReportType = 'FAKE_JOB' | 'FAKE_CERTIFICATE' | 'FRAUD' | 'INAPPROPRIATE_CONTENT' | 'OTHER';
export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
export type ReportedEntityType = 'job' | 'employer' | 'worker' | 'certificate' | 'other';

export interface SubmitReportPayload {
  reported_entity_name: string;
  reported_entity_type: ReportedEntityType;
  reported_entity_id?: string | number;
  report_type: ReportType;
  description: string;
  evidence_url?: string;
}

export interface PlatformReportItem {
  id: number | string;
  reporter_name: string;
  reported_entity_name: string;
  reported_entity_type: ReportedEntityType;
  entity_type_display: string;
  reported_entity_id?: string;
  report_type: ReportType;
  report_type_display: string;
  description: string;
  evidence_url?: string;
  status: ReportStatus;
  status_display: string;
  resolution_notes?: string;
  action_taken?: string;
  reported_at: string;
  updated_at: string;
}

export const reportApi = {
  // 1. Submit a Platform Report (Phase 16)
  async submitReport(payload: SubmitReportPayload): Promise<{
    success: boolean;
    data: PlatformReportItem;
    message: string;
  }> {
    const res = await apiClient.post('/reports/', payload);
    return res.data;
  },

  // 2. Admin Moderation Queue
  async getAdminReportsQueue(params: { status?: string; report_type?: string; entity_type?: string } = {}): Promise<{
    success: boolean;
    data: PlatformReportItem[];
    message: string;
  }> {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.report_type && params.report_type !== 'all') query.append('report_type', params.report_type);
    if (params.entity_type && params.entity_type !== 'all') query.append('entity_type', params.entity_type);

    const res = await apiClient.get(`/admin/reports/?${query.toString()}`);
    return res.data;
  },

  // 3. Admin Update Report Status
  async updateReportStatus(
    id: number | string,
    payload: { status: ReportStatus; resolution_notes?: string; action_taken?: string }
  ): Promise<{
    success: boolean;
    data: PlatformReportItem;
    message: string;
  }> {
    const res = await apiClient.patch(`/admin/reports/${id}/`, payload);
    return res.data;
  },
};
