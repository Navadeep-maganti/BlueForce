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
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';

interface JobDetailPageProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, onNavigate }) => {
  const { t } = useTranslation(['jobs', 'common', 'navigation', 'worker', 'verification']);
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
    if (!store.currentUser) {
      onNavigate('/auth?role=worker');
      return;
    }
    if (store.currentUser.role !== 'worker') {
      setToastMessage('Only registered Workers can apply for jobs. You are logged in as an Employer.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
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
        <ArrowLeft className="w-4 h-4" /> {t('common:actions.back', 'Back to all jobs')}
      </button>

      {/* Top Job Header Card */}
      <div className="kc-card p-6 bg-white border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogoUrl}
              alt={job.companyName}
              className="w-16 h-16 rounded-xl object-cover border"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary text-[10px] uppercase font-bold">
                  {job.tradeCategory}
                </span>
                {job.isCompanyVerified && (
                  <span className="badge badge-verified text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> {t('common:badges.topEmployer', 'Verified Employer')}
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-black text-navy mt-1">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> {job.companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {job.shift}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {job.postedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                {t('jobs:jobDetails.salaryAndPerks', 'Monthly Compensation')}
              </span>
              <div className="text-lg font-black text-emerald-700">
                ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
                <span className="text-xs font-normal text-muted block">/ {t('common:time.perMonth', 'month')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => store.toggleBookmarkJob(job.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Save Job"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`btn btn-md font-bold px-6 text-xs ${
                  hasApplied
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {hasApplied ? t('jobs:jobCard.applied', 'Applied ✓') : t('jobs:jobDetails.applyNow', 'Apply with Trust ID')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Match Fit Callout */}
      {job.matchData && (
        <div className="kc-card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                {job.matchData.matchPercentage}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-navy">
                    {t('jobs:jobDetails.matchAnalysis', 'Trust & Skill Match Breakdown')}
                  </h3>
                  <span className="badge badge-primary text-[9px] py-0">
                    <Sparkles className="w-2.5 h-2.5 inline mr-0.5" /> {t('common:badges.highMatch', 'High Match')}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-xs text-slate-700">
                  {job.matchData.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMatchModal(true)}
              className="btn btn-outline-primary btn-sm whitespace-nowrap text-xs self-end md:self-auto"
            >
              {t('jobs:jobDetails.matchAnalysis', 'View Formula Details')}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Job Details (8 cols) + Side Info (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Job Description & Details */}
        <div className="md:col-span-8 space-y-6">
          {/* Job Overview */}
          <div className="kc-card p-6 bg-white border space-y-4">
            <h2 className="text-sm font-bold text-navy pb-2 border-b">
              {t('jobs:jobDetails.jobOverview', 'Job Overview & Requirements')}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
            <p className="text-[10px] text-slate-400 italic">
              {t('jobs:jobDetails.dynamicNotice', 'Note: Job details and requirements are provided directly by the employer.')}
            </p>
          </div>

          {/* Required Skills */}
          <div className="kc-card p-6 bg-white border space-y-4">
            <h2 className="text-sm font-bold text-navy pb-2 border-b">
              {t('jobs:jobDetails.requirements', 'Technical Skills & Competencies')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  ⚙️ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Required Certifications */}
          <div className="kc-card p-6 bg-white border space-y-4">
            <h2 className="text-sm font-bold text-navy pb-2 border-b">
              {t('jobs:jobDetails.certifications', 'Mandatory Credentials & Trade Licenses')}
            </h2>
            <div className="space-y-2">
              {(job.requiredCertifications || []).map((cert, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-navy flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> {cert}
                  </span>
                  <span className="badge badge-neutral text-[10px]">
                    {t('common:status.verified', 'Verified on file')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Plant / Company Card & Quick Specs */}
        <div className="md:col-span-4 space-y-6">
          <div className="kc-card p-5 bg-white border space-y-4">
            <h3 className="text-xs font-bold text-navy pb-2 border-b">
              {t('jobs:jobDetails.aboutCompany', 'About the Employer')}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  {t('auth:companyName', 'Company')}
                </span>
                <span className="font-bold text-navy">{job.companyName}</span>
              </div>

              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  {t('jobs:filterByTrade', 'Industry Sector')}
                </span>
                <span className="font-bold text-navy">{job.tradeCategory}</span>
              </div>

              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  {t('jobs:jobCard.openings', { count: job.openings, defaultValue: `${job.openings} Openings` })}
                </span>
                <span className="font-bold text-navy">{job.openings} Open Positions</span>
              </div>

              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  {t('worker:experience', 'Experience Required')}
                </span>
                <span className="font-bold text-navy">
                  {t('worker:experienceYears', { years: job.experienceRequiredYears, defaultValue: `Min ${job.experienceRequiredYears} Years` })}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  {t('jobs:filterByJobType', 'Shift Schedule')}
                </span>
                <span className="font-bold text-navy">{job.shift}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`btn btn-md w-full text-xs font-bold ${
                  hasApplied
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {hasApplied ? t('jobs:jobCard.applied', 'Applied ✓') : t('jobs:jobDetails.applyNow', 'Apply Now')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Breakdown Modal */}
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
