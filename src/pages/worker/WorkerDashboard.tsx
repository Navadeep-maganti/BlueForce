import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  Sparkles,
  MapPin,
  TrendingUp,
  ArrowRight,
  Mic,
  Bookmark,
  CheckCircle2,
  Clock,
  Zap,
  Building,
  Target,
  Award,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { TrustScoreWidget } from '../../components/trust/TrustScoreWidget';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';
import { DigiLockerModal } from '../../components/verification/DigiLockerModal';
import { Job, JobMatchBreakdown } from '../../types';

interface WorkerDashboardProps {
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigate, onOpenVoiceModal }) => {
  const { t } = useTranslation(['worker', 'jobs', 'common', 'navigation', 'verification']);
  const store = useStore();
  const worker = store.workerProfile;
  const jobs = store.jobs;
  const upcomingInterviews = store.applications.filter(
    (application) => application.workerId === worker.id && application.interview
  );
  const careerInsight = null;

  const [selectedMatch, setSelectedMatch] = useState<{ match: JobMatchBreakdown; title: string; company: string } | null>(null);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApply = (job: Job) => {
    if (!store.currentUser) {
      onNavigate('/auth?role=worker');
      return;
    }
    if (store.currentUser.role !== 'worker') {
      setToastMessage('Only registered Workers can apply for jobs.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const res = store.applyForJob(job.id);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-navy-900 text-white shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="kc-card p-6 sm:p-7 bg-white border border-slate-200/80 shadow-xs rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={worker.avatarUrl}
            alt={worker.fullName}
            className="w-14 h-14 rounded-2xl object-cover border border-primary/30 shadow-xs flex-shrink-0"
            style={{ width: '56px', height: '56px', minWidth: '56px', maxWidth: '56px', objectFit: 'cover' }}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-navy tracking-tight">{t('worker:greeting', 'Good morning')} 👋</h1>
              <span className="badge badge-verified text-xs px-2.5 py-0.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('common:status.verified', 'Verified Worker')}
              </span>
            </div>
            <p className="text-sm font-semibold text-primary mt-0.5">{worker.primaryTrade}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {worker.location} • {t('worker:immediateJoining', 'Available Now')}
            </p>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onOpenVoiceModal}
            className="btn btn-outline-primary btn-sm flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl"
          >
            <Mic className="w-4 h-4 text-blue-600 animate-pulse" />
            {t('navigation:voiceSearch', 'Voice Search')}
          </button>
          <button
            onClick={() => onNavigate('/worker/jobs')}
            className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
          >
            {t('navigation:jobs', 'Find Jobs')}
          </button>
        </div>
      </div>

      {/* Profile Strength & Trust Score Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Strength Card (4 cols) */}
        <div className="lg:col-span-4 kc-card p-6 sm:p-7 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('worker:profileStrength', 'Profile Strength')}
              </span>
              <span className="text-sm font-black text-primary">{worker.profileStrengthPercent}%</span>
            </div>
            <div className="match-bar-track mb-3 h-2.5 rounded-full bg-slate-100">
              <div className="match-bar-fill h-full rounded-full bg-primary" style={{ width: `${worker.profileStrengthPercent}%` }} />
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('worker:unlockJobsTip', 'Complete your profile, certifications and work proof to help employers assess your experience.')}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${store.currentUser?.isVerified ? 'text-emerald-600' : 'text-slate-300'}`} /> {t('verification:factors.identity', 'Aadhaar eKYC')}
                </span>
                {store.currentUser?.isVerified ? (
                  <span className="badge badge-verified text-xs font-bold">{worker.aadhaarMasked ? `Verified (${worker.aadhaarMasked.slice(-4)})` : t('common:status.verified', 'Verified')}</span>
                ) : (
                  <button
                    onClick={() => setShowDigiLockerModal(true)}
                    className="badge text-xs bg-blue-100 text-primary border border-blue-300 hover:bg-blue-200 transition-colors font-bold cursor-pointer"
                  >
                    Verify via DigiLocker +20 Pts
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${worker.certifications.length > 0 ? 'text-emerald-600' : 'text-slate-300'}`} /> {t('verification:factors.certifications', 'ITI NCVT Diploma')}
                </span>
                <span className={`badge text-xs ${worker.certifications.length > 0 ? 'badge-verified' : 'badge-neutral'}`}>
                  {worker.certifications.length > 0 ? t('common:status.verified', 'Verified') : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${worker.proofOfWork.length > 0 ? 'text-emerald-600' : 'text-slate-300'}`} /> {t('verification:factors.proofOfWork', 'Proof of Work')}
                </span>
                <span className={`badge text-xs ${worker.proofOfWork.length > 0 ? 'badge-verified' : 'badge-neutral'}`}>
                  {worker.proofOfWork.length > 0 ? t('common:status.approved', 'Approved') : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            {!store.currentUser?.isVerified && (
              <button
                onClick={() => setShowDigiLockerModal(true)}
                className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                Verify Identity with DigiLocker
              </button>
            )}
            <button
              onClick={() => onNavigate('/worker/profile')}
              className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl"
            >
              {t('worker:tabs.overview', 'Edit Digital Identity')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust Score 100-pt Widget (8 cols) */}
        <div className="lg:col-span-8">
          <TrustScoreWidget scoreData={worker.trustScore} />
        </div>
      </div>

      {/* Career insights */}
      {careerInsight && (
        <div className="kc-card-navy p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-400 text-navy-950 px-1.5 py-0.2 rounded">
                  {t('worker:careerInsights', 'Career Insight')}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {t('worker:unlockJobsTip', 'Add one more skill to unlock more suitable jobs.')}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/worker/profile')}
            className="btn btn-primary btn-sm whitespace-nowrap text-xs self-end md:self-auto"
          >
            {t('common:actions.viewDetails', 'Explore Skill Path')}
          </button>
        </div>
      )}

      {/* Upcoming Scheduled Interviews Section */}
      {upcomingInterviews.length > 0 && (
        <div className="kc-card p-6 sm:p-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy">
                  📅 {t('worker:upcomingInterviews', 'Upcoming Scheduled Interviews & Trade Tests')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('applications:statusStages.interview', 'Confirmed interview appointments with employer plant supervisors')}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/worker/applications')}
              className="text-primary text-xs font-bold hover:underline"
            >
              {t('navigation:applications', 'View All Applications')}
            </button>
          </div>

          <div className="space-y-3">
            {upcomingInterviews.map((app) => {
              const iv = app.interview;
              if (!iv) return null;
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-success text-xs font-bold py-0.5">
                        {iv.type || 'Trade Test'}
                      </span>
                      <span className="text-sm font-black text-navy">{app.jobTitle}</span>
                      <span className="text-xs text-slate-500">• {app.companyName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-semibold text-blue-900">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> {iv.date} at {iv.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {iv.locationOrLink || 'Plant Workshop'}
                      </span>
                    </div>
                    {iv.instructions && (
                      <p className="text-xs text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/80 inline-block mt-1">
                        <strong>Instructions:</strong> {iv.instructions}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => onNavigate('/worker/applications')}
                      className="btn btn-outline-primary btn-sm text-xs font-semibold px-3.5 py-2 rounded-xl"
                    >
                      {t('applications:timeline.title', 'Track Status')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended jobs from the available job feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-navy flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('worker:recommendedJobs', 'Recommended Jobs for You')}
            </h2>
            <p className="text-[11px] text-muted">
              {t('jobs:sortOptions.bestMatch', 'Ranked with explainable compatibility scores for your trade credentials')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/worker/jobs')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            {t('common:actions.viewAll', 'View all')} ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {jobs.slice(0, 3).map((job) => {
            const hasApplied = store.applications.some(
              (a) => a.jobId === job.id && a.workerId === worker.id
            );
            const isBookmarked = worker.bookmarkedJobIds?.includes(job.id);

            return (
              <div key={job.id} className="kc-card p-4 bg-white border flex flex-col justify-between kc-card-hover">
                <div>
                  {/* Top company & match badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={job.companyLogoUrl}
                        alt={job.companyName}
                        className="w-9 h-9 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-navy truncate max-w-[120px]">
                            {job.companyName}
                          </span>
                          {job.isCompanyVerified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" /> {job.location} ({job.distanceKm || 6} km)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => store.toggleBookmarkJob(job.id)}
                      className={`p-1 rounded-md border transition-colors ${
                        isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-300' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Pay */}
                  <h3 className="font-bold text-xs sm:text-sm text-navy mb-1 line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 mb-2.5">
                    <span>
                      ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()} / {t('common:time.perMonth', 'mo')}
                    </span>
                    <span className="badge badge-neutral text-[9px] font-normal">{job.jobType}</span>
                  </div>

                  {/* Explainable match information */}
                  {job.matchData && (
                    <div
                      onClick={() =>
                        setSelectedMatch({
                          match: job.matchData!,
                          title: job.title,
                          company: job.companyName,
                        })
                      }
                      className="p-2 rounded-lg bg-blue-50/80 border border-blue-200/70 cursor-pointer hover:bg-blue-100/80 transition-colors mb-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {job.matchData.matchPercentage}% {t('employer:matchScore', 'Match')}
                        </span>
                        <span className="text-[10px] text-primary underline font-semibold">
                          {t('jobs:jobDetails.matchAnalysis', 'Why?')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-1">
                        ✓ {job.matchData.reasons[0]}
                      </p>
                    </div>
                  )}

                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="badge badge-neutral text-[9px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2.5 border-t flex items-center gap-1.5">
                  <button
                    onClick={() => onNavigate(`/worker/jobs/${job.id}`)}
                    className="btn btn-secondary btn-sm flex-1 text-[11px]"
                  >
                    {t('common:actions.viewDetails', 'Details')}
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    disabled={hasApplied}
                    className={`btn btn-sm flex-1 text-[11px] ${
                      hasApplied ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'btn-primary'
                    }`}
                  >
                    {hasApplied ? t('jobs:jobCard.applied', 'Applied ✓') : t('jobs:jobCard.quickApply', 'Quick Apply')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match explanation modal */}
      {selectedMatch && (
        <MatchScoreModal
          matchData={selectedMatch.match}
          jobTitle={selectedMatch.title}
          companyName={selectedMatch.company}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* DigiLocker eKYC Modal */}
      <DigiLockerModal
        isOpen={showDigiLockerModal}
        onClose={() => setShowDigiLockerModal(false)}
      />
    </div>
  );
};
