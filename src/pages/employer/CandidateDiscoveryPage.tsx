import React, { useState } from 'react';
import {
  Search,
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  Mail,
  Award,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { WorkerProfile } from '../../types';
import { TrustScoreWidget } from '../../components/trust/TrustScoreWidget';

interface CandidateDiscoveryPageProps {
  onNavigate: (path: string) => void;
}

export const CandidateDiscoveryPage: React.FC<CandidateDiscoveryPageProps> = ({ onNavigate }) => {
  const store = useStore();
  const candidates = store.candidates;
  const employer = store.employerProfile;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [minTrustScore, setMinTrustScore] = useState<number>(80);
  const [selectedCandidate, setSelectedCandidate] = useState<WorkerProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShortlist = (cand: WorkerProfile) => {
    // If an application exists, move to shortlisted, or create application
    const existing = store.applications.find((a) => a.workerId === cand.id);
    if (existing) {
      store.moveApplicationStage(existing.id, 'Shortlisted', 'Shortlisted directly from Candidate Discovery');
    } else {
      store.applyForJob(store.jobs[0].id);
    }
    setToastMessage(`${cand.fullName} has been shortlisted for your opening!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCandidates = candidates.filter((cand) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      cand.fullName.toLowerCase().includes(query) ||
      cand.primaryTrade.toLowerCase().includes(query) ||
      cand.skills.some((s) => s.name.toLowerCase().includes(query)) ||
      cand.location.toLowerCase().includes(query);

    const matchesTrade =
      selectedTrade === 'all' ||
      cand.primaryTrade.toLowerCase().includes(selectedTrade.toLowerCase());

    const matchesTrust = cand.trustScore.total >= minTrustScore;

    return matchesQuery && matchesTrade && matchesTrust;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-navy-900 text-white shadow-xl flex items-center gap-3 border border-blue-500 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-navy">Candidate Discovery</h1>
            <span className="badge badge-verified text-[11px]">
              ✓ Pre-Verified Trade Roster
            </span>
          </div>
          <p className="text-xs text-muted">
            Discover verified industrial electricians, CNC operators, welders, and solar specialists with 85+ Trust Scores.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/employer/pipeline')}
          className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          View Kanban Pipeline →
        </button>
      </div>

      {/* Top Search & Filter Strip */}
      <div className="kc-card p-5 bg-white border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="relative sm:col-span-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, trade (Electrician, CNC, Welder), or skill..."
              className="form-input text-xs pl-9 pr-3 py-2.5"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="form-select text-xs py-2.5"
            >
              <option value="all">All Trade Disciplines</option>
              <option value="Electrician">Electrician</option>
              <option value="CNC">CNC Machinist</option>
              <option value="Solar">Solar Tech</option>
              <option value="Welder">Welder</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted whitespace-nowrap">Min Trust:</span>
            <input
              type="range"
              min="70"
              max="95"
              step="5"
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-xs font-bold text-emerald-700 min-w-[28px]">{minTrustScore}</span>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCandidates.map((cand) => {
          const isBookmarked = employer.bookmarkedWorkerIds?.includes(cand.id);

          return (
            <div
              key={cand.id}
              className="kc-card p-5 bg-white border kc-card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={cand.avatarUrl}
                      alt={cand.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm sm:text-base text-navy">
                          {cand.fullName}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs font-bold text-primary">{cand.primaryTrade}</p>
                      <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {cand.location} • {cand.yearsOfExperience} Yrs Exp
                      </p>
                    </div>
                  </div>

                  {/* Trust Score Box */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-700 leading-none">
                      {cand.trustScore.total}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-muted block">
                      Trust Score
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {cand.tagline}
                </p>

                {/* Verified Skills Strip */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {cand.skills.map((s, i) => (
                    <span key={i} className="badge badge-neutral text-[10px]">
                      ✓ {s.name}
                    </span>
                  ))}
                </div>

                {/* Proof of Work Thumbnail preview if available */}
                {cand.proofOfWork && cand.proofOfWork.length > 0 && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border flex items-center gap-2.5">
                    <img
                      src={cand.proofOfWork[0].images[0]}
                      alt="Proof"
                      className="w-10 h-8 rounded object-cover border"
                    />
                    <div className="text-[11px] text-slate-700 flex-1 truncate">
                      <strong>Work Proof:</strong> {cand.proofOfWork[0].title}
                    </div>
                    <span className="badge badge-verified text-[9px]">Verified</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t flex items-center justify-between gap-2">
                <button
                  onClick={() => store.toggleBookmarkWorker(cand.id)}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-600 border-amber-300'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 flex-1 justify-end">
                  <button
                    onClick={() => setSelectedCandidate(cand)}
                    className="btn btn-secondary btn-sm text-xs flex-1 sm:flex-initial"
                  >
                    View Verified Profile
                  </button>
                  <button
                    onClick={() => handleShortlist(cand)}
                    className="btn btn-primary btn-sm text-xs font-bold flex-1 sm:flex-initial"
                  >
                    Shortlist Candidate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Detail Modal */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal-content p-6 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatarUrl}
                  alt={selectedCandidate.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-primary"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black text-navy">{selectedCandidate.fullName}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-primary">{selectedCandidate.primaryTrade}</p>
                  <p className="text-xs text-muted">{selectedCandidate.location} • {selectedCandidate.yearsOfExperience} Years Exp</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="btn-icon">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <TrustScoreWidget scoreData={selectedCandidate.trustScore} />

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-navy">About Technician</h4>
                <p className="text-slate-600 leading-relaxed">{selectedCandidate.bio}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Verified Skills & Level
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedCandidate.skills.map((s, i) => (
                    <div key={i} className="p-2 rounded bg-white border flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{s.name}</span>
                      <span className="text-amber-500 font-bold">{s.level}★</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <button onClick={() => setSelectedCandidate(null)} className="btn btn-secondary btn-sm text-xs">
                Close
              </button>
              <button
                onClick={() => {
                  handleShortlist(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="btn btn-primary btn-sm text-xs font-bold"
              >
                Shortlist for Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
