import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';

interface JobDetailPageProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, onNavigate }) => {
  const store = useStore();
  const job = store.jobs.find((j) => j.id === jobId) || store.jobs[0];
  const worker = store.workerProfile;

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hasApplied = store.applications.some(
    (a) => a.jobId === job.id && a.workerId === worker.id
  );
  const isBookmarked = worker.bookmarkedJobIds?.includes(job.id);

  const handleApply = () => {
    const res = store.applyForJob(job.id);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-navy-900 text-white shadow-xl flex items-center gap-3 border border-blue-500 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => onNavigate('/worker/jobs')}
        className="text-xs font-bold text-slate-600 hover:text-navy flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all jobs
      </button>

      {/* Header Card */}
      <div className="kc-card p-6 bg-white border">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogoUrl}
              alt={job.companyName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy">{job.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  {job.companyName}
                  {job.isCompanyVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  )}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location} ({job.distanceKm || 6} km away)
                </span>
                <span>•</span>
                <span className="badge badge-neutral text-[10px]">{job.jobType}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-end md:self-start">
            <button
              onClick={() => store.toggleBookmarkJob(job.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={handleApply}
              disabled={hasApplied}
              className={`btn btn-lg text-xs font-bold ${
                hasApplied ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'btn-primary'
              }`}
            >
              {hasApplied ? 'Applied with Trust Profile ✓' : 'Apply Now with 1-Click'}
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t">
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-[10px] text-muted font-bold uppercase block">Monthly Pay</span>
            <span className="text-sm font-extrabold text-emerald-700">
              ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-[10px] text-muted font-bold uppercase block">Experience Needed</span>
            <span className="text-sm font-bold text-navy">
              {job.experienceRequiredYears}+ Years
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-[10px] text-muted font-bold uppercase block">Shift Schedule</span>
            <span className="text-sm font-bold text-navy">{job.shift}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-[10px] text-muted font-bold uppercase block">Open Vacancies</span>
            <span className="text-sm font-bold text-primary">{job.openings} Openings</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Description (8 cols) + AI Match & Plant Spec (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Job Overview */}
          <div className="kc-card p-6 bg-white border space-y-4">
            <h3 className="text-base font-bold text-navy">Role Overview & Responsibilities</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
              Mandatory Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((s, i) => (
                <span key={i} className="badge badge-primary text-xs py-1">
                  ✓ {s}
                </span>
              ))}
            </div>

            {job.requiredCertifications && (
              <>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                  Trade Certifications Required
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredCertifications.map((c, i) => (
                    <span key={i} className="badge badge-verified text-xs py-1">
                      <Award className="w-3.5 h-3.5" /> {c}
                    </span>
                  ))}
                </div>
              </>
            )}

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
              Plant Benefits & Statutory Welfare
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {job.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-950 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Plant Address & Joining Info */}
          <div className="kc-card p-6 bg-white border space-y-3">
            <h3 className="text-base font-bold text-navy">Reporting Work Location</h3>
            <p className="text-xs text-slate-700 font-medium flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              {job.workAddress}
            </p>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <span>Joining Schedule: <strong>{job.joiningDate}</strong></span>
              <span>Deadline: <strong>{job.deadlineDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Match Card */}
          {job.matchData && (
            <div className="kc-card p-5 bg-white border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Your Compatibility
                </span>
                <span className="badge badge-verified text-xs font-bold">
                  {job.matchData.matchPercentage}% Fit
                </span>
              </div>

              <div className="match-bar-track mb-3">
                <div className="match-bar-fill" style={{ width: `${job.matchData.matchPercentage}%` }} />
              </div>

              <ul className="space-y-2 text-xs text-slate-700 mb-4">
                {job.matchData.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> {r}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowMatchModal(true)}
                className="btn btn-outline-primary btn-sm w-full text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" /> View Explainability Formula
              </button>
            </div>
          )}

          {/* Verified Employer Seal */}
          <div className="kc-card p-5 bg-slate-50 border space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-xs text-navy">Direct Plant Hiring Guarantee</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              This job is posted directly by the registered employer. No placement agencies, zero wage cuts, and guaranteed prompt PF/ESI enrollment.
            </p>
          </div>
        </div>
      </div>

      {/* Explainable AI Modal */}
      {showMatchModal && job.matchData && (
        <MatchScoreModal
          matchData={job.matchData}
          jobTitle={job.title}
          companyName={job.companyName}
          onClose={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
};
