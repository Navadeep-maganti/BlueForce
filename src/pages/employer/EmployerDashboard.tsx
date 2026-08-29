import React from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { useStore } from '../../hooks/useStore';

interface EmployerDashboardProps {
  onNavigate: (path: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const store = useStore();
  const employer = store.employerProfile;
  const jobs = store.jobs;
  const applications = store.applications;
  const candidates = store.candidates;

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const totalAppsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.currentStage === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.currentStage === 'Interview').length;
  const hiredCount = applications.filter((a) => a.currentStage === 'Hired').length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="kc-card p-4 sm:p-5 bg-white border flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <img
            src={employer.logoUrl}
            alt={employer.companyName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-navy">{employer.companyName}</h1>
              {employer.isVerified && (
                <span className="badge badge-verified text-[10px] py-0">
                  <ShieldCheck className="w-3 h-3" /> {employer.verificationBadge}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-primary">{employer.tradeIndustry}</p>
            <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {employer.location} • {employer.gstOrCinNumber}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => onNavigate('/employer/candidates')}
            className="btn btn-secondary btn-sm text-[11px]"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" /> Discover Talent
          </button>
          <button
            onClick={() => onNavigate('/employer/jobs/new')}
            className="btn btn-primary btn-sm text-[11px] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Post New Job
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => onNavigate('/employer/pipeline')}
          className="kc-card p-3.5 bg-white border kc-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between text-muted text-[11px] font-bold mb-1">
            <span>{t.employerDashboard.activeJobs}</span>
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-navy">{activeJobsCount}</div>
          <span className="text-[9px] text-emerald-600 font-bold">● 4 Open in Autonagar</span>
        </div>

        <div 
          onClick={() => onNavigate('/employer/pipeline')}
          className="kc-card p-3.5 bg-white border kc-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between text-muted text-[11px] font-bold mb-1">
            <span>{t.employerDashboard.applications}</span>
            <Users className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-navy">{totalAppsCount}</div>
          <span className="text-[9px] text-primary font-bold">+5 new today</span>
        </div>

        <div 
          onClick={() => onNavigate('/employer/pipeline')}
          className="kc-card p-3.5 bg-white border kc-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between text-muted text-[11px] font-bold mb-1">
            <span>{t.employerDashboard.shortlisted}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="text-xl font-black text-navy">{shortlistedCount}</div>
          <span className="text-[9px] text-muted font-medium">Ready for trade test</span>
        </div>

        <div 
          onClick={() => onNavigate('/employer/pipeline')}
          className="kc-card p-3.5 bg-white border kc-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between text-muted text-[11px] font-bold mb-1">
            <span>{t.employerDashboard.interviews}</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-navy">{interviewCount}</div>
          <span className="text-[9px] text-amber-700 font-bold">1 scheduled Monday</span>
        </div>

        <div 
          onClick={() => onNavigate('/employer/pipeline')}
          className="kc-card p-3.5 bg-white border kc-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between text-muted text-[11px] font-bold mb-1">
            <span>{t.employerDashboard.hired}</span>
            <Award className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">{hiredCount}</div>
          <span className="text-[9px] text-emerald-600 font-bold">100% verified hires</span>
        </div>
      </div>

      {/* Scheduled Plant Interviews & Trade Tests (Phase 5) */}
      {applications.filter((a) => a.currentStage === 'Interview' || a.interview).length > 0 && (
        <div className="kc-card p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-navy">📅 Scheduled Plant Interviews & Trade Tests</h3>
                <p className="text-[10px] text-slate-500">Upcoming candidate assessments at your plant facilities</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/employer/pipeline')}
              className="text-primary text-xs font-bold hover:underline"
            >
              Manage in Pipeline →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications
              .filter((a) => a.currentStage === 'Interview' || a.interview)
              .map((app) => {
                const iv = app.interview || {
                  date: '2026-09-02',
                  time: '11:00 AM IST',
                  type: 'In-person Trade Test',
                  locationOrLink: 'Plant Maintenance Bay 4, Autonagar, Vijayawada',
                  instructions: 'Bring trade certificate copies and safety boots.',
                  interviewerName: 'K. Satyanarayana (General Manager - Operations)',
                  status: 'scheduled',
                };
                return (
                  <div key={app.id} className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={app.workerAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                          alt={app.workerName}
                          className="w-8 h-8 rounded-lg object-cover border"
                        />
                        <div>
                          <div className="text-xs font-bold text-navy">{app.workerName}</div>
                          <div className="text-[10px] text-primary font-semibold">{app.workerTrade}</div>
                        </div>
                      </div>
                      <span className="badge badge-success text-[9px] uppercase font-extrabold py-0.5">
                        {iv.status || 'Scheduled'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-600" /> {iv.date} at {iv.time}
                        </span>
                        <span className="badge badge-neutral text-[9px]">{iv.type || 'Trade Test'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{iv.locationOrLink || 'Plant Workshop'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recruitment Pipeline Teaser & Candidate Stream (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Candidate stream (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-navy flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                {t.employerDashboard.aiTopCandidates}
              </h2>
              <p className="text-[11px] text-muted">
                Pre-screened with government IDs, trade certificates & supervisor reviews
              </p>
            </div>
            <button
              onClick={() => onNavigate('/employer/candidates')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Search All ({candidates.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {candidates.slice(0, 3).map((cand) => (
              <div
                key={cand.id}
                className="kc-card p-3.5 bg-white border kc-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={cand.avatarUrl}
                    alt={cand.fullName}
                    className="w-10 h-10 rounded-xl object-cover border"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-navy">{cand.fullName}</h3>
                      <span className="badge badge-verified text-[9px] py-0">
                        Trust {cand.trustScore.total}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary">{cand.primaryTrade}</p>
                    <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" /> {cand.location} • {cand.yearsOfExperience} yrs exp
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {cand.skills.slice(0, 2).map((s, i) => (
                        <span key={i} className="badge badge-neutral text-[9px]">
                          ✓ {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-xs font-black text-emerald-700">
                    94% Fit
                  </span>
                  <button
                    onClick={() => onNavigate('/employer/pipeline')}
                    className="btn btn-primary btn-sm text-[10px] py-1 px-2.5"
                  >
                    Shortlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Jobs Quick Manage (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-navy">Active Factory Openings</h2>
            <button
              onClick={() => onNavigate('/employer/jobs/new')}
              className="text-xs font-bold text-primary hover:underline"
            >
              + Post
            </button>
          </div>

          <div className="space-y-2.5">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="kc-card p-3.5 bg-white border space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-navy">{job.title}</h3>
                    <p className="text-[10px] text-muted">
                      {job.location} • {job.shift}
                    </p>
                  </div>
                  <span className="badge badge-primary text-[9px]">
                    {job.openings} Openings
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t text-muted">
                  <span className="font-bold text-emerald-700 text-[11px]">
                    ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onNavigate('/employer/pipeline')}
                    className="text-primary font-bold hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    Applicants ({job.applicationsCount || 24}) <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
