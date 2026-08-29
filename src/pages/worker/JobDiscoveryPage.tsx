import React, { useState } from 'react';
import {
  Search,
  Mic,
  MapPin,
  Filter,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Building,
  Clock,
  Briefcase,
  X,
} from 'lucide-react';
import { useI18n } from '../../i18n/context';
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
  const { t } = useI18n();
  const store = useStore();
  const jobs = store.jobs;
  const worker = store.workerProfile;

  const [searchQuery, setSearchQuery] = useState(initialSearch?.keyword || '');
  const [selectedLocation, setSelectedLocation] = useState(initialSearch?.location || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minSalary, setMinSalary] = useState<number>(initialSearch?.minSalary || 0);
  const [selectedShift, setSelectedShift] = useState('all');
  const [maxDistance, setMaxDistance] = useState<number>(100);

  const [selectedMatch, setSelectedMatch] = useState<{ match: JobMatchBreakdown; title: string; company: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleApply = (job: Job) => {
    const res = store.applyForJob(job.id);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.tradeCategory.toLowerCase().includes(query) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(query)) ||
      job.companyName.toLowerCase().includes(query);

    const matchesLocation =
      selectedLocation === 'all' ||
      job.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      job.tradeCategory.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSalary = minSalary === 0 || job.salaryMin >= minSalary;

    const matchesShift = selectedShift === 'all' || job.shift === selectedShift;

    const matchesDistance = !job.distanceKm || job.distanceKm <= maxDistance;

    return (
      matchesQuery &&
      matchesLocation &&
      matchesCategory &&
      matchesSalary &&
      matchesShift &&
      matchesDistance
    );
  });

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
      <div className="kc-card p-4 bg-white border">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          {/* Main Keyword Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by trade (Electrician, CNC, Solar, Welder) or skills..."
              className="form-input text-xs pl-8 pr-3 py-2"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Location Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select text-xs py-2"
            >
              <option value="all">📍 All Locations</option>
              <option value="Vijayawada">Vijayawada, AP</option>
              <option value="Hyderabad">Hyderabad, TS</option>
              <option value="Bengaluru">Bengaluru, KA</option>
              <option value="Chennai">Chennai, TN</option>
              <option value="Pune">Pune, MH</option>
            </select>
          </div>

          {/* Voice Search Button */}
          <button
            onClick={onOpenVoiceModal}
            className="btn btn-outline-primary py-2 px-3 text-xs font-semibold flex items-center gap-1.5 w-full md:w-auto justify-center"
          >
            <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Voice Search
          </button>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="btn btn-secondary py-2 px-2.5 text-xs md:hidden flex items-center gap-1 w-full justify-center"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {minSalary > 0 || selectedCategory !== 'all' ? '●' : ''}
          </button>
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
              <Filter className="w-3.5 h-3.5 text-primary" /> Filter Openings
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
                Reset
              </button>
            )}
          </div>

          {/* Filter 1: Trade Category */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Trade Category</label>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: 'All Trades' },
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
              <label className="text-[11px] font-bold text-slate-700">Min Monthly Pay</label>
              <span className="text-[11px] font-bold text-emerald-700">
                {minSalary === 0 ? 'Any' : `₹${minSalary.toLocaleString()}+`}
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
              <span>Any</span>
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
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="form-select text-xs py-1.5"
            >
              <option value="all">Any Shift</option>
              <option value="Day Shift">Day Shift</option>
              <option value="Night Shift">Night Shift</option>
              <option value="Rotational">Rotational Shift</option>
            </select>
          </div>
        </aside>

        {/* Job Listings Column (8/9 cols) */}
        <main className="md:col-span-8 lg:col-span-9 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              Showing <strong>{filteredJobs.length}</strong> matching openings
            </span>
            <span className="badge badge-verified text-[10px]">
              ✓ Direct Factory Openings
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="kc-card p-8 text-center bg-white border">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-navy">No matching jobs found</h3>
              <p className="text-[11px] text-muted mt-0.5 max-w-sm mx-auto">
                Try widening your trade filters or resetting salary bounds.
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
                            <MapPin className="w-3 h-3 text-slate-400" /> {job.location} ({job.distanceKm || 8} km away)
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
                        <span className="text-[9px] font-normal text-muted block text-right">/ mo</span>
                      </div>
                      <button
                        onClick={() => store.toggleBookmarkJob(job.id)}
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

                  {/* Explainable AI Match Pill */}
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
                            <span>{job.matchData.matchPercentage}% Trade Fit</span>
                            <span className="badge badge-primary text-[9px] py-0">Explain</span>
                          </div>
                          <p className="text-[10px] text-slate-600 line-clamp-1">
                            {job.matchData.reasons.join(' • ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-primary whitespace-nowrap self-end sm:self-center">
                        Formula Breakdown →
                      </span>
                    </div>
                  )}

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-muted font-semibold mr-0.5">Required:</span>
                    {job.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="badge badge-neutral text-[9px]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2.5 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>{job.openings} Openings</span>
                      <span>•</span>
                      <span>{job.shift}</span>
                      <span>•</span>
                      <span>Min {job.experienceRequiredYears}y exp</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onNavigate(`/worker/jobs/${job.id}`)}
                        className="btn btn-secondary btn-sm text-[11px]"
                      >
                        Details
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
                        {hasApplied ? 'Applied ✓' : 'Apply with Trust ID'}
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
