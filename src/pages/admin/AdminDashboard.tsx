import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Award,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  Eye,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { VerificationDocument, PlatformReport } from '../../types';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['verification', 'analytics', 'common', 'navigation']);
  const store = useStore();
  const verifications = store.verifications;
  const reports = store.reports;
  const jobs = store.jobs;
  const workers = store.candidates;

  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'jobs' | 'workers'>('verifications');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerifyDoc = (id: string, status: 'verified' | 'rejected') => {
    const reason =
      status === 'rejected'
        ? window.prompt('Add a reason for rejecting this document (optional):')
        : undefined;
    if (reason === null) return;
    store.verifyDocument(id, status, reason?.trim() || undefined);
    setToastMessage(`Document marked as ${status.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolveReport = (id: string, status: 'resolved' | 'dismissed') => {
    store.resolveReport(id, status);
    setToastMessage(`Report has been ${status.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingVerifsCount = verifications.filter((v) => v.status === 'pending').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-navy-900 text-white shadow-xl flex items-center gap-3 border border-blue-500 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy">
            {t('verification:title', 'Trust & Verification Operations')}
          </h1>
          <p className="text-xs text-muted">
            {t('verification:subtitle', 'Review government Aadhaar IDs, NSDC/NCVT certificates, and past employer work proofs.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-verified text-xs py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Trust Engine Active
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kc-card p-4 bg-white border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            {t('verification:adminQueue.pendingItems', 'Pending Verification')}
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingVerifsCount}</div>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            {t('analytics:metrics.activeWorkers', 'Audited Technicians')}
          </span>
          <div className="text-2xl font-black text-navy mt-1">12,480</div>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            {t('common:status.verified', 'Employer Verified Badges')}
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">420</div>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            {t('verification:scoreBreakdown', 'Avg Platform Trust Score')}
          </span>
          <div className="text-2xl font-black text-primary mt-1">91.4/100</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-4">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          {t('verification:adminQueue.title', 'Credential Queue')} ({pendingVerifsCount})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {t('analytics:reports.exportReport', 'Disputes & Reports')} ({pendingReportsCount})
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'workers'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {t('navigation:candidates', 'Worker Registry')} ({workers.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          {t('navigation:jobs', 'Job Openings')} ({jobs.length})
        </button>
      </div>

      {/* Tab 1: Verification Queue Table */}
      {activeTab === 'verifications' && (
        <div className="kc-card bg-white border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-xs text-navy">
              {t('verification:adminQueue.title', 'Document Verification & Audit Stream')}
            </h3>
            <span className="text-[11px] text-muted">
              {t('verification:auditNotice', 'All credential verifications follow strict NSDC / NCVT compliance standards.')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-3">{t('verification:adminQueue.workerName', 'Technician')}</th>
                  <th className="p-3">{t('verification:adminQueue.itemType', 'Credential Type')}</th>
                  <th className="p-3">{t('verification:adminQueue.submittedOn', 'Submitted')}</th>
                  <th className="p-3">{t('verification:adminQueue.status', 'Status')}</th>
                  <th className="p-3 text-right">{t('common:actions.filter', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {verifications.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-navy">{doc.entityName}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{doc.docType}</span>
                      <span className="text-[10px] text-muted block">{doc.docNumber}</span>
                    </td>
                    <td className="p-3 text-muted">{doc.submittedAt}</td>
                    <td className="p-3">
                      <span
                        className={`badge text-[9px] ${
                          doc.status === 'verified'
                            ? 'badge-verified'
                            : doc.status === 'rejected'
                            ? 'badge-rejected'
                            : 'badge-pending'
                        }`}
                      >
                        {t(`common:status.${doc.status}`, doc.status)}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {doc.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleVerifyDoc(doc.id, 'verified')}
                            className="btn btn-primary py-1 px-2 text-[10px] font-bold"
                          >
                            ✓ {t('verification:adminQueue.approve', 'Verify')}
                          </button>
                          <button
                            onClick={() => handleVerifyDoc(doc.id, 'rejected')}
                            className="btn btn-secondary py-1 px-2 text-[10px] text-red-600 font-bold"
                          >
                            ✕ {t('verification:adminQueue.reject', 'Reject')}
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-muted font-semibold uppercase">
                          {t('common:status.completed', 'Audited')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
