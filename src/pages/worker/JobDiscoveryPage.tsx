import React, { useState, useEffect } from 'react';
import {
  Search,
  Mic,
  MapPin,
  Filter,
  Bookmark,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';
import { Job, JobMatchBreakdown } from '../../types';

interface JobDiscoveryPageProps {
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
  initialSearch?: { keyword: string; location: string; minSalary: number };
}

export const JobDiscoveryPage: React.FC<JobDiscoveryPageProps> = ({
  onNavigate,
  onOpenVoiceModal,
  initialSearch,
}) => {
  const { t } = useTranslation(['jobs', 'common', 'navigation', 'worker', 'verification']);
  const store = useStore();
  const jobs = store.jobs;
  const worker = store.workerProfile;

  const [searchQuery, setSearchQuery] = useState(initialSearch?.keyword || '');
  const [selectedLocation, setSelectedLocation] = useState(initialSearch?.location || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minSalary, setMinSalary] = useState<number>(initialSearch?.minSalary || 0);
  const [selectedShift, setSelectedShift] = useState('all');
  const [maxDistance, setMaxDistance] = useState<number>(500);

  const [selectedMatch, setSelectedMatch] = useState<{ match: JobMatchBreakdown; title: string; company: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      if (initialSearch.keyword) setSearchQuery(initialSearch.keyword);
      if (initialSearch.location) setSelectedLocation(initialSearch.location);
      if (initialSearch.minSalary !== undefined) setMinSalary(initialSearch.minSalary);
    }
  }, [initialSearch]);

  const handleApply = (job: Job) => {
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

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    
    // Multi-token search across all fields
    const queryWords = query ? query.split(/\s+/).filter(Boolean) : [];
    const matchesQuery =
      queryWords.length === 0 ||
      queryWords.every((word) => {
        return (
          job.title.toLowerCase().includes(word) ||
          job.tradeCategory.toLowerCase().includes(word) ||
          job.companyName.toLowerCase().includes(word) ||
          job.city.toLowerCase().includes(word) ||
          job.location.toLowerCase().includes(word) ||
          job.description.toLowerCase().includes(word) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(word)) ||
          (job.preferredSkills && job.preferredSkills.some((s) => s.toLowerCase().includes(word))) ||
          (job.requiredCertifications && job.requiredCertifications.some((c) => c.toLowerCase().includes(word)))
        );
      });

    const matchesLocation =
      !selectedLocation ||
      selectedLocation === 'all' ||
      job.city.toLowerCase() === selectedLocation.toLowerCase() ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'all' ||
      job.tradeCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Electrical' && job.tradeCategory.toLowerCase().includes('electric')) ||
      (selectedCategory === 'Solar' && job.tradeCategory.toLowerCase().includes('solar')) ||
      (selectedCategory === 'Machining' && (job.tradeCategory.toLowerCase().includes('machin') || job.tradeCategory.toLowerCase().includes('tooling') || job.tradeCategory.toLowerCase().includes('cnc'))) ||
      (selectedCategory === 'Welding' && (job.tradeCategory.toLowerCase().includes('weld') || job.tradeCategory.toLowerCase().includes('fabricat'))) ||
      (selectedCategory === 'Automotive' && (job.tradeCategory.toLowerCase().includes('auto') || job.tradeCategory.toLowerCase().includes('diesel') || job.tradeCategory.toLowerCase().includes('fleet')));

    const matchesSalary = !minSalary || minSalary === 0 || job.salaryMin >= minSalary;

    const matchesShift = !selectedShift || selectedShift === 'all' || job.shift === selectedShift;

    const matchesDistance =
      selectedLocation !== 'all' || maxDistance >= 500 || !job.distanceKm || job.distanceKm <= maxDistance;

    return (
      matchesQuery &&
      matchesLocation &&
      matchesCategory &&
      matchesSalary &&
      matchesShift &&
      matchesDistance
    );
  });

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (minSalary > 0 ? 1 : 0) +
    (selectedShift !== 'all' ? 1 : 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-navy-900 text-white shadow-xl flex items-center gap-2.5 border border-blue-500 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Search Banner */}
      <div className="kc-card p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <div className="job-search-toolbar">
          {/* Main Keyword Input - Expanded & Prominent */}
          <div className="job-search-input-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('jobs:searchPlaceholder', 'Search trade, skill, or job title (e.g. Electrician, CNC, Welder)...')}
              className="form-input text-xs sm:text-sm pl-9 pr-8 py-2.5 w-full rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Selector */}
          <div className="job-search-location-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select text-xs sm:text-sm py-2.5 px-3 w-full rounded-xl font-medium text-slate-700"
            >
              <option value="all">📍 {t('jobs:allLocations', 'All Locations')}</option>
              <option value="Vijayawada">Vijayawada, AP</option>
              <option value="Hyderabad">Hyderabad, TS</option>
              <option value="Bengaluru">Bengaluru, KA</option>
              <option value="Chennai">Chennai, TN</option>
              <option value="Pune">Pune, MH</option>
            </select>
          </div>

          {/* Buttons Wrap */}
          <div className="job-search-btn-wrap">
            {/* Voice Search Button */}
            <button
              onClick={onOpenVoiceModal}
              className="btn btn-outline-primary py-2.5 px-3.5 text-xs font-bold flex items-center gap-1.5 rounded-xl justify-center shadow-2xs"
            >
              <Mic className="w-4 h-4 text-primary animate-pulse" />
              <span>{t('navigation:voiceSearch', 'Voice Search')}</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`btn py-2.5 px-3.5 text-xs font-bold flex items-center gap-1.5 rounded-xl justify-center transition-all ${
                activeFiltersCount > 0
                  ? 'btn-primary shadow-xs'
                  : 'btn-secondary text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('common:actions.filter', 'Filters')}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center ml-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Job Feed) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Desktop Sidebar Filters (3 cols) */}
        <aside
          className={`md:col-span-4 lg:col-span-3 space-y-4 kc-card p-4 bg-white border h-fit ${
            showMobileFilters ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-2.5 border-b">
            <h3 className="font-bold text-xs text-navy flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-primary" /> {t('common:actions.applyFilters', 'Filter Openings')}
            </h3>
            {(selectedCategory !== 'all' || minSalary > 0 || selectedShift !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setMinSalary(0);
                  setSelectedShift('all');
                  setMaxDistance(100);
                  setSearchQuery('');
                }}
                className="text-[10px] font-bold text-red-600 hover:underline"
              >
                {t('common:actions.reset', 'Reset')}
              </button>
            )}
          </div>

          {/* Filter 1: Trade Category */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              {t('jobs:filterByTrade', 'Trade / Industry')}
            </label>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: t('jobs:allTrades', 'All Trades') },
                { id: 'Electrical', label: '⚡ Electrical & Wiring' },
                { id: 'Solar', label: '☀️ Solar & Renewable' },
                { id: 'Machining', label: '⚙️ CNC & Tooling' },
                { id: 'Welding', label: '🔥 TIG/MIG Welding' },
                { id: 'Automotive', label: '🚛 Heavy Diesel & Fleet' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-blue-50 text-primary font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Min Salary */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                {t('jobs:filterBySalary', 'Minimum Monthly Salary')}
              </label>
              <span className="text-[11px] font-bold text-emerald-700">
                {minSalary === 0 ? 'Any Pay' : `₹${minSalary.toLocaleString()}+`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35000"
              step="5000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full accent-primary h-1.5"
            />
            <div className="flex justify-between text-[9px] text-muted">
              <span>Any Pay</span>
              <span>₹20k</span>
              <span>₹30k</span>
              <span>₹35k+</span>
            </div>
          </div>

          {/* Filter 3: Commute Radius */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700">Max Radius</label>
              <span className="text-[11px] font-bold text-primary">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-primary h-1.5"
            />
            <div className="flex justify-between text-[9px] text-muted">
              <span>10 km</span>
              <span>25 km</span>
              <span>500 km</span>
            </div>
          </div>

          {/* Filter 4: Shift */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              {t('jobs:filterByJobType', 'Shift')}
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="form-select text-xs py-1.5"
            >
              <option value="all">{t('jobs:anyExperience', 'Any Shift')}</option>
              <option value="Day Shift">Day Shift</option>
              <option value="Night Shift">Night Shift</option>
              <option value="Rotational">Rotational Shift</option>
            </select>
          </div>
        </aside>

        {/* Job Listings Column */}
        <main className="md:col-span-8 lg:col-span-9 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {t('common:pagination.showing', {
                from: 1,
                to: filteredJobs.length,
                total: filteredJobs.length,
                defaultValue: `Showing ${filteredJobs.length} matching openings`,
              })}
            </span>
            <span className="badge badge-verified text-[10px]">
              ✓ {t('common:badges.topEmployer', 'Direct Factory Openings')}
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="kc-card p-8 text-center bg-white border">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-navy">
                {t('common:emptyState.noResults', 'No matching jobs found')}
              </h3>
              <p className="text-[11px] text-muted mt-0.5 max-w-sm mx-auto">
                {t('common:emptyState.noResultsDesc', 'Try widening your trade filters or resetting salary bounds.')}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const hasApplied = store.applications.some(
                (a) => a.jobId === job.id && a.workerId === worker.id
              );
              const isBookmarked = worker.bookmarkedJobIds?.includes(job.id);

              return (
                <div
                  key={job.id}
                  className="kc-card p-4 bg-white border kc-card-hover transition-all space-y-3"
                >
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={job.companyLogoUrl}
                        alt={job.companyName}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3
                            className="font-bold text-xs sm:text-sm text-navy hover:text-primary transition-colors cursor-pointer"
                            onClick={() => onNavigate(`/worker/jobs/${job.id}`)}
                          >
                            {job.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-muted">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            {job.companyName}
                            {job.isCompanyVerified && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                            )}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" /> {job.location} ({job.distanceKm || 8} km)
                          </span>
                          <span>•</span>
                          <span>{job.postedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pay & Bookmark */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <div className="text-xs font-black text-emerald-700">
                        ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
                        <span className="text-[9px] font-normal text-muted block text-right">
                          / {t('common:time.perMonth', 'mo')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!store.currentUser) {
                            onNavigate('/auth?role=worker');
                            return;
                          }
                          store.toggleBookmarkJob(job.id);
                        }}
                        className={`p-1 rounded-md border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                      className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 cursor-pointer hover:bg-blue-100/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          {job.matchData.matchPercentage}%
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-navy flex items-center gap-1">
                            <span>{job.matchData.matchPercentage}% {t('employer:matchScore', 'Trade Fit')}</span>
                            <span className="badge badge-primary text-[9px] py-0">
                              <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
                              {t('jobs:jobDetails.matchAnalysis', 'Explain')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 line-clamp-1">
                            {job.matchData.reasons.join(' • ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-primary whitespace-nowrap self-end sm:self-center">
                        {t('jobs:jobDetails.matchAnalysis', 'Formula Breakdown →')}
                      </span>
                    </div>
                  )}

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-muted font-semibold mr-0.5">
                      {t('jobs:jobDetails.requirements', 'Required')}:
                    </span>
                    {job.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="badge badge-neutral text-[9px]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2.5 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>{t('jobs:jobCard.openings', { count: job.openings, defaultValue: `${job.openings} Openings` })}</span>
                      <span>•</span>
                      <span>{job.shift}</span>
                      <span>•</span>
                      <span>{t('worker:experienceYears', { years: job.experienceRequiredYears, defaultValue: `Min ${job.experienceRequiredYears}y exp` })}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onNavigate(`/worker/jobs/${job.id}`)}
                        className="btn btn-secondary btn-sm text-[11px]"
                      >
                        {t('jobs:jobCard.viewDetails', 'Details')}
                      </button>
                      <button
                        onClick={() => handleApply(job)}
                        disabled={hasApplied}
                        className={`btn btn-sm text-[11px] ${
                          hasApplied
                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {hasApplied
                          ? t('jobs:jobCard.applied', 'Applied ✓')
                          : t('jobs:jobCard.quickApply', 'Quick Apply')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* Match Explainability Modal */}
      {selectedMatch && (
        <MatchScoreModal
          matchData={selectedMatch.match}
          jobTitle={selectedMatch.title}
          companyName={selectedMatch.company}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};
