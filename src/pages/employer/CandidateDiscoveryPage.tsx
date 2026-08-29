import React, { useState } from 'react';
import {
  Search,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Briefcase,
  ChevronRight,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { WorkerProfile } from '../../types';
import { TrustScoreWidget } from '../../components/trust/TrustScoreWidget';

interface CandidateDiscoveryPageProps {
  onNavigate: (path: string) => void;
}

export const CandidateDiscoveryPage: React.FC<CandidateDiscoveryPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['employer', 'worker', 'common', 'verification', 'navigation']);
  const store = useStore();
  const candidates = store.candidates;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<WorkerProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShortlist = (cand: WorkerProfile) => {
    if (!store.currentUser) {
      onNavigate('/auth?role=employer');
      return;
    }
    if (store.currentUser.role !== 'employer') {
      setToastMessage('Only registered Employers can shortlist candidates. You are logged in as a Worker.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const existing = store.applications.find((a) => a.workerId === cand.id);
    if (existing) {
      store.updateApplicationStage(existing.id, 'Shortlisted', 'Shortlisted directly from Candidate Discovery');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-navy">
            {t('employer:candidateSearch', 'Discover Verified Blue-Collar Talent')}
          </h1>
          <p className="text-xs text-muted">
            {t('employer:topCandidatesDesc', 'Browse 12,000+ pre-audited technicians with DigiLocker ID, trade diplomas, and site work proofs')}
          </p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="kc-card p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trade (Electrician, Welder, CNC), skills, or location..."
              className="form-input text-xs pl-9 py-2.5 rounded-xl border border-slate-200/80 w-full"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="form-select text-xs py-2.5 rounded-xl border border-slate-200/80 w-full"
            >
              <option value="all">{t('jobs:allTrades', 'All Trade Categories')}</option>
              <option value="Electrical">⚡ Electrical & Wiring</option>
              <option value="Solar">☀️ Solar Power</option>
              <option value="Machining">⚙️ CNC & Tooling</option>
              <option value="Welding">🔥 TIG/MIG Welding</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              {t('common:badges.trustScore', 'Min Trust')}: {minTrustScore}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="w-full accent-primary h-2"
            />
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            className="kc-card p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={cand.avatarUrl}
                    alt={cand.fullName}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200/80 flex-shrink-0 shadow-xs"
                    style={{ width: '52px', height: '52px', minWidth: '52px', maxWidth: '52px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-navy flex items-center gap-1.5">
                      {cand.fullName}
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </h3>
                    <p className="text-xs font-semibold text-primary mt-0.5">{cand.primaryTrade}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {cand.location} •{' '}
                      {t('worker:experienceYears', { years: cand.yearsOfExperience, defaultValue: `${cand.yearsOfExperience}y exp` })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-emerald-700 leading-none">
                    {cand.trustScore.total}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider">
                    {t('common:badges.trustScore', 'Trust')}
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {cand.skills.slice(0, 3).map((s, idx) => (
                  <span key={idx} className="badge badge-neutral text-xs px-2.5 py-0.5">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t flex items-center gap-2">
              <button
                onClick={() => setSelectedCandidate(cand)}
                className="btn btn-secondary btn-sm flex-1 text-xs"
              >
                {t('common:actions.viewDetails', 'View Trust ID')}
              </button>
              <button
                onClick={() => handleShortlist(cand)}
                className="btn btn-primary btn-sm flex-1 text-xs"
              >
                {t('employer:stages.shortlisted', 'Shortlist')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Profile Detail Drawer / Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatarUrl}
                  alt={selectedCandidate.fullName}
                  className="w-14 h-14 rounded-xl object-cover border"
                />
                <div>
                  <h2 className="text-base font-black text-navy">{selectedCandidate.fullName}</h2>
                  <p className="text-xs font-bold text-primary">{selectedCandidate.primaryTrade}</p>
                  <p className="text-[11px] text-muted">{selectedCandidate.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Trust Breakdown inside Modal */}
            <TrustScoreWidget scoreData={selectedCandidate.trustScore} />

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-secondary btn-sm text-xs"
              >
                {t('common:actions.close', 'Close')}
              </button>
              <button
                onClick={() => {
                  handleShortlist(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="btn btn-primary btn-sm text-xs font-bold"
              >
                {t('employer:stages.shortlisted', 'Shortlist for Opening')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
