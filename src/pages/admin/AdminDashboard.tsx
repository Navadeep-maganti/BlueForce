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
import { useStore } from '../../hooks/useStore';
import { VerificationDocument, PlatformReport } from '../../types';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const store = useStore();
  const verifications = store.verifications;
  const reports = store.reports;
  const jobs = store.jobs;
  const workers = store.candidates;

  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'jobs' | 'workers'>('verifications');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerifyDoc = (id: string, status: 'verified' | 'rejected') => {
    const reason = status === 'rejected'
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
      <div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-navy">
              Platform Admin & Trust Hub
            </h1>
            <span className="badge badge-verified text-[11px]">System Moderator</span>
          </div>
          <p className="text-xs text-muted">
            Manage government identity verification, ITI trade diploma validation, and fraud moderation.
          </p>
        </div>

      </div>

      {/* Top Admin KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kc-card p-4 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">Worker profiles</span>
          <div className="text-2xl font-black text-navy">{workers.length}</div>
          <span className="text-[10px] text-slate-600 font-bold">Profiles available to review</span>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">Live job postings</span>
          <div className="text-2xl font-black text-navy">{jobs.length}</div>
          <span className="text-[10px] text-slate-600 font-bold">Available for moderation review</span>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">Pending Verifications</span>
          <div className="text-2xl font-black text-amber-600">{pendingVerifsCount}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Requires manual audit</span>
        </div>

        <div className="kc-card p-4 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">Dispute / Fraud Reports</span>
          <div className="text-2xl font-black text-red-600">{pendingReportsCount}</div>
          <span className="text-[10px] text-red-700 font-semibold">Flagged by community</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Verification Center ({verifications.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Fraud & Dispute Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Moderation ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'workers'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Users className="w-4 h-4" /> Users ({workers.length})
        </button>
      </div>

      {/* TAB 1: VERIFICATION CENTER */}
      {activeTab === 'verifications' && (
        <div className="kc-card bg-white border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-navy">Identity & Trade Document Verification Queue</h3>
            <span className="text-xs text-muted">Aadhaar, ITI NCVT & CEIG Licences</span>
          </div>

          <div className="divide-y">
            {verifications.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy">{doc.entityName}</span>
                    <span
                      className={`badge text-[10px] ${
                        doc.status === 'verified'
                          ? 'badge-verified'
                          : doc.status === 'pending'
                          ? 'badge-pending'
                          : 'badge-rejected'
                      }`}
                    >
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary">{doc.docType} • ID: {doc.docNumber}</p>
                  <p className="text-[11px] text-muted">Submitted on: {doc.submittedAt}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="btn btn-secondary btn-sm text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Document
                  </button>

                  {doc.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleVerifyDoc(doc.id, 'verified')}
                        className="btn btn-success btn-sm text-xs flex items-center gap-1 font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Boost Score
                      </button>
                      <button
                        onClick={() => handleVerifyDoc(doc.id, 'rejected')}
                        className="btn btn-secondary btn-sm text-xs text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-muted px-2">
                      Reviewed by {doc.reviewedBy || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FRAUD & DISPUTE REPORTS */}
      {activeTab === 'reports' && (
        <div className="kc-card bg-white border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-navy">Community Dispute & Safety Moderation</h3>
            <span className="badge badge-rejected text-[10px]">Zero Tolerance Policy</span>
          </div>

          <div className="divide-y">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy">
                      Report against: {rep.reportedEntityName}
                    </span>
                    <span className="badge badge-rejected text-[10px]">
                      {rep.reasonCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rep.description}</p>
                  <p className="text-[11px] text-muted">
                    Reported by {rep.reporterName} on {rep.reportedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {rep.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="btn btn-primary btn-sm text-xs font-bold"
                      >
                        Take Action / Suspend Entity
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="btn btn-secondary btn-sm text-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span className="badge badge-verified text-xs">
                      Status: {rep.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: JOB MODERATION */}
      {activeTab === 'jobs' && (
        <div className="kc-card bg-white border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-navy">Active Platform Job Postings</h3>
            <span className="text-xs text-muted">{jobs.length} Active Direct Plant Openings</span>
          </div>

          <div className="divide-y">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-navy">{job.title}</h4>
                  <p className="text-xs text-primary font-medium">{job.companyName} • {job.location}</p>
                  <p className="text-[11px] text-muted">
                    ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()} / mo • {job.openings} Openings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-verified text-[10px]">Active & Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="kc-card bg-white border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-navy">Worker Profile Overview</h3>
            <span className="text-xs text-muted">Current profiles available in the platform</span>
          </div>
          <div className="divide-y">
            {workers.map((worker) => (
              <div key={worker.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={worker.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-navy truncate">{worker.fullName}</h4>
                    <p className="text-xs text-primary font-medium">{worker.primaryTrade} · {worker.location}</p>
                  </div>
                </div>
                <span className="badge badge-verified text-[10px]">Trust score {worker.trustScore.total}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
