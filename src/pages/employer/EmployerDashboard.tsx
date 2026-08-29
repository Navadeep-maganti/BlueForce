import React, { useState } from 'react';
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
  Building2,
  Edit3,
  X,
  Phone,
  Mail,
  User,
  Globe,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';

interface EmployerDashboardProps {
  onNavigate: (path: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['employer', 'common', 'navigation', 'jobs']);
  const store = useStore();
  const employer = store.employerProfile;
  const jobs = store.jobs;
  const applications = store.applications;
  const candidates = store.candidates;

  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState(employer.companyName);
  const [tradeIndustry, setTradeIndustry] = useState(employer.tradeIndustry);
  const [tagline, setTagline] = useState(employer.tagline || '');
  const [description, setDescription] = useState(employer.description || '');
  const [gstOrCinNumber, setGstOrCinNumber] = useState(employer.gstOrCinNumber);
  const [location, setLocation] = useState(employer.location);
  const [city, setCity] = useState(employer.city || 'Visakhapatnam');
  const [state, setState] = useState(employer.state || 'Andhra Pradesh');
  const [contactPerson, setContactPerson] = useState(employer.contactPerson);
  const [contactEmail, setContactEmail] = useState(employer.contactEmail);
  const [contactPhone, setContactPhone] = useState(employer.contactPhone);
  const [employeeCount, setEmployeeCount] = useState(employer.employeeCount || '50-200 Employees');
  const [establishedYear, setEstablishedYear] = useState(employer.establishedYear || 2012);
  const [website, setWebsite] = useState(employer.website || '');
  const [logoUrl, setLogoUrl] = useState(employer.logoUrl || '');

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const totalAppsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.currentStage === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.currentStage === 'Interview').length;
  const hiredCount = applications.filter((a) => a.currentStage === 'Hired' || a.currentStage === 'Selected').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateEmployerProfile({
      companyName,
      tradeIndustry,
      tagline,
      description,
      gstOrCinNumber,
      location,
      city,
      state,
      contactPerson,
      contactEmail,
      contactPhone,
      employeeCount,
      establishedYear: Number(establishedYear),
      website,
      logoUrl: logoUrl || employer.logoUrl,
    });
    setShowEditModal(false);
    setToastMessage('Company profile details saved successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-navy-900 text-white shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="kc-card p-6 sm:p-7 bg-white border border-slate-200/80 shadow-xs rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={employer.logoUrl}
            alt={employer.companyName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200/80 flex-shrink-0 shadow-xs"
            style={{ width: '56px', height: '56px', minWidth: '56px', maxWidth: '56px' }}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-navy tracking-tight">{employer.companyName}</h1>
              {employer.isVerified && (
                <span className="badge badge-verified text-xs px-2.5 py-0.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> {employer.verificationBadge || 'Verified Enterprise'}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-primary mt-0.5">{employer.tradeIndustry}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {employer.location} • {employer.gstOrCinNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowEditModal(true)}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            Edit Profile
          </button>
          <button
            onClick={() => onNavigate('/employer/candidates')}
            className="btn btn-outline-primary btn-sm flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl"
          >
            <Users className="w-3.5 h-3.5" />
            {t('employer:candidateSearch', 'Find Candidates')}
          </button>
          <button
            onClick={() => onNavigate('/employer/jobs/new')}
            className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('employer:postNewJob', 'Post a Job')}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('employer:activeJobs', 'Active Openings')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-navy tracking-tight">{activeJobsCount}</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              +1 {t('common:status.published', 'published this week')}
            </span>
          </div>
        </div>

        <div className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('employer:totalApplications', 'Applicants')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-navy tracking-tight">{totalAppsCount}</span>
            <span className="text-xs text-slate-500 block mt-1">{t('common:status.justNow', 'Direct verified candidates')}</span>
          </div>
        </div>

        <div className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('employer:shortlisted', 'Shortlisted')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-navy tracking-tight">{shortlistedCount}</span>
            <span className="text-xs text-amber-600 font-semibold block mt-1">
              {t('employer:inReview', 'In review')}
            </span>
          </div>
        </div>

        <div className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('employer:interviews', 'Interviews')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-navy tracking-tight">{interviewCount}</span>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {t('employer:upcomingInterviews', 'Scheduled')}
            </span>
          </div>
        </div>

        <div className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between col-span-2 lg:col-span-1 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('employer:hired', 'Selected / Hired')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-navy tracking-tight">{hiredCount}</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              {t('employer:completedHires', 'Plant onboarded')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Matching Candidates (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t('employer:topCandidates', 'Top Matching Candidates')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('employer:topCandidatesDesc', 'AI matched based on trade certifications, verified experience, and 100-pt Trust Score.')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/employer/candidates')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              {t('common:actions.viewAll', 'View all')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {candidates.slice(0, 3).map((candidate) => (
              <div
                key={candidate.id}
                className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 kc-card-hover"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={candidate.avatarUrl}
                    alt={candidate.fullName}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200/80 flex-shrink-0 shadow-xs"
                    style={{ width: '52px', height: '52px', minWidth: '52px', maxWidth: '52px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-navy">{candidate.fullName}</h3>
                      <span className="badge badge-verified text-xs py-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> {candidate.trustScore.total} {t('common:badges.trustScore', 'Trust')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary mt-0.5">{candidate.primaryTrade}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {candidate.location} •{' '}
                      {candidate.yearsOfExperience}y {t('worker:experience', 'experience')}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700">{candidate.profileStrengthPercent}% Match</span>
                    <span className="text-xs text-slate-500 block">₹{candidate.expectedSalaryMonthly.min.toLocaleString()}+</span>
                  </div>
                  <button
                    onClick={() => onNavigate('/employer/candidates')}
                    className="btn btn-secondary btn-sm text-xs font-bold px-3.5 py-1.5 rounded-xl"
                  >
                    {t('common:actions.viewDetails', 'View Profile')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Job Openings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {t('employer:activeJobs', 'Active Job Openings')}
            </h2>
            <button
              onClick={() => onNavigate('/employer/jobs/new')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              + {t('employer:postNewJob', 'Post New')}
            </button>
          </div>

          <div className="space-y-3.5">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="kc-card p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-navy line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.tradeCategory} • {job.openings} {t('jobs:jobCard.openings', 'Openings')}
                    </p>
                  </div>
                  <span className="badge badge-success text-xs py-0.5">{t('common:status.active', 'Active')}</span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold">
                    ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onNavigate('/employer/pipeline')}
                    className="text-primary font-bold hover:underline text-xs flex items-center gap-0.5"
                  >
                    {t('employer:viewPipeline', 'View Pipeline →')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content p-6 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">Edit Enterprise Profile</h3>
                  <p className="text-[11px] text-muted">Update your plant/company profile, contact info, and trade industry</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Enterprise Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input input-sm w-full text-xs"
                    placeholder="e.g. ABC Precision Industries Ltd."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Trade Industry / Sector</label>
                  <input
                    type="text"
                    required
                    value={tradeIndustry}
                    onChange={(e) => setTradeIndustry(e.target.value)}
                    className="input input-sm w-full text-xs"
                    placeholder="e.g. Heavy Electrical & Automation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN / CIN Number</label>
                  <input
                    type="text"
                    required
                    value={gstOrCinNumber}
                    onChange={(e) => setGstOrCinNumber(e.target.value)}
                    className="input input-sm w-full text-xs"
                    placeholder="e.g. 37AAACA1234F1Z5"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Workforce Size</label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="input input-sm w-full text-xs"
                  >
                    <option value="10-50 Employees">10–50 Employees</option>
                    <option value="50-200 Employees">50–200 Employees</option>
                    <option value="200-500 Employees">200–500 Employees</option>
                    <option value="500+ Employees">500+ Large Industrial Unit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Plant / Head Office Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input input-sm w-full text-xs"
                  placeholder="e.g. Autonagar Industrial Area, Phase II"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input input-sm w-full text-xs"
                    placeholder="e.g. Visakhapatnam"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input input-sm w-full text-xs"
                    placeholder="e.g. Andhra Pradesh"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input input-sm w-full text-xs"
                  placeholder="Tell candidates about your plant operations, safety standards, and facilities..."
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border">
                <h4 className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Primary HR / Plant Contact Person
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="input input-sm w-full text-xs"
                      placeholder="e.g. Vikram Sharma"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">HR Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="input input-sm w-full text-xs"
                      placeholder="e.g. hr@abcprecision.in"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="input input-sm w-full text-xs"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Logo URL (Optional)</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="input input-sm w-full text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save Company Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
