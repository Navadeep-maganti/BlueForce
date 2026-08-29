import { apiClient } from './apiClient';

export interface VerificationDocumentItem {
  id: number | string;
  entity_type: 'worker' | 'employer' | string;
  worker?: number | string;
  employer?: number | string;
  entity_name: string;
  entity_trade: string;
  avatar_url?: string;
  doc_type: 'IDENTITY' | 'CERTIFICATE' | 'TRADE_LICENSE' | 'OTHER' | string;
  doc_number: string;
  file_url?: string;
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  submitted_date: string;
  submitted_at: string;
}

export interface DocumentSubmitPayload {
  doc_type: 'IDENTITY' | 'CERTIFICATE' | 'TRADE_LICENSE' | 'OTHER' | string;
  doc_number: string;
  file_url?: string;
  notes?: string;
}

export const verificationApi = {
  // 1. Worker Submits Document for Verification
  async submitDocument(payload: DocumentSubmitPayload) {
    const res = await apiClient.post('/verification/submit/', payload);
    return res.data;
  },

  // 2. Worker Gets Their Submitted Documents
  async getMyDocuments() {
    const res = await apiClient.get('/verification/my-documents/');
    return res.data;
  },

  // 3. Admin Verification Queue
  async getAdminQueue(status?: string, docType?: string, entityType?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (docType && docType !== 'all') params.append('doc_type', docType);
    if (entityType && entityType !== 'all') params.append('entity_type', entityType);
    
    const res = await apiClient.get(`/admin/verifications/?${params.toString()}`);
    return res.data;
  },

  // 4. Admin Approves Document
  async approveDocument(id: number | string) {
    const res = await apiClient.post(`/admin/verifications/${id}/approve/`);
    return res.data;
  },

  // 5. Admin Rejects Document
  async rejectDocument(id: number | string, rejectionReason?: string) {
    const res = await apiClient.post(`/admin/verifications/${id}/reject/`, {
      rejection_reason: rejectionReason,
    });
    return res.data;
  },
};
