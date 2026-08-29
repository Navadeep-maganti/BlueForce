import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MapPin,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenVoiceModal }) => {
  const { t } = useTranslation(['common', 'navigation', 'jobs', 'worker', 'employer', 'verification']);
  const store = useStore();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [search, setSearch] = useState('');
  const sampleMatch = store.jobs[0]?.matchData;

  const startWorker = () => {
    onNavigate('/auth?role=worker');
  };

  const startEmployer = () => {
    onNavigate('/auth?role=employer');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onNavigate('/jobs');
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-orb landing-orb--one" />
        <div className="landing-orb landing-orb--two" />
        <div className="landing-shell landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="eyebrow">
              <Sparkles size={14} /> {t('common:slogan', "India's trusted skilled-work network")}
            </p>
            <h1>
              {t('common:tagline', 'Skills that get seen. Work that gets trusted.')}
            </h1>
            <p className="landing-hero__lede">
              {t(
                'common:slogan',
                'Empowering India\'s skilled workforce through verified credentials, proven work samples, and direct enterprise opportunities.'
              )}
            </p>

            <form className="landing-search" onSubmit={handleSearch}>
              <Search size={20} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('jobs:searchPlaceholder', 'Search electrician, welder, supervisor…')}
                aria-label="Search jobs by role or skill"
              />
              <button type="submit">
                {t('jobs:voiceModal.searchResultBtn', 'Search jobs')} <ArrowRight size={16} />
              </button>
            </form>

            <div className="landing-search__support">
              <span>Popular: Electrician</span>
              <span>CNC Operator</span>
              <span>Welder</span>
              <button onClick={onOpenVoiceModal} type="button">
                <Mic size={14} /> {t('navigation:voiceSearch', 'Search by voice')}
              </button>
            </div>

            <div className="landing-paths" aria-label="Choose your path">
              <button className="landing-path landing-path--primary" onClick={startWorker}>
                <span className="landing-path__icon">
                  <BriefcaseBusiness size={21} />
                </span>
                <span>
                  <strong>{t('navigation:findWork', "I'm looking for work")}</strong>
                  <small>{t('worker:trustScoreHelp', 'Build a verified profile & find matches')}</small>
                </span>
                <ArrowRight size={18} />
              </button>

              <button className="landing-path" onClick={startEmployer}>
                <span className="landing-path__icon">
                  <Building2 size={21} />
                </span>
                <span>
                  <strong>{t('navigation:hireTalent', "I'm hiring")}</strong>
                  <small>{t('employer:topCandidatesDesc', 'Discover verified technicians ready to work')}</small>
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>          {/* Platform Trust & Ecosystem Showcase Card */}
          <div className="talent-preview space-y-4" aria-label="BlueForce Trust Ecosystem">
            <div className="talent-preview__topline">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="live-dot" /> LIVE WORKFORCE NETWORK
              </span>
              <span className="badge badge-verified text-[10px] py-0.5 px-2 font-bold flex items-center gap-1">
                <ShieldCheck size={13} /> NSDC Recognized
              </span>
            </div>

            {/* 3 Core Platform Pillars */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-navy">100-Point Portable Trust Score</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Instant DigiLocker eKYC, NCVT diplomas, and foreman-rated project proofs.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mic size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-navy">Multilingual Voice Discovery</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Natural speech search in Telugu, Hindi & English for fast job and trade matching.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BriefcaseBusiness size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-navy">Direct Plant Hiring (₹0 Comm.)</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Hire verified technicians with zero middleman commissions or delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="talent-preview__stats">
              <div className="talent-preview__stat">
                <span className="talent-preview__stat-val">12,480+</span>
                <span className="talent-preview__stat-lbl">Audited Trades</span>
              </div>
              <div className="talent-preview__stat">
                <span className="talent-preview__stat-val">4.2 Days</span>
                <span className="talent-preview__stat-lbl">Avg Time-to-Hire</span>
              </div>
              <div className="talent-preview__stat">
                <span className="talent-preview__stat-val">94.8%</span>
                <span className="talent-preview__stat-lbl">Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features Section */}
      <section className="section-padded">
        <div className="section-inner">
          <div className="section-header">
            <h2>{t('common:features.title', 'Platform Capabilities')}</h2>
            <p>
              {t(
                'common:features.subtitle',
                'Built for transparency, speed, and real-world trade reliability.'
              )}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">
                <ShieldCheck size={26} />
              </div>
              <h3>{t('verification:title', '100-Point Trust Score')}</h3>
              <p>
                {t(
                  'verification:subtitle',
                  'Every worker gets a portable trust profile combining Aadhaar identity, NCVT trade diplomas, past plant tenures, and peer-reviewed work proofs.'
                )}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <Mic size={26} />
              </div>
              <h3>{t('jobs:voiceModal.title', 'BlueForce Voice Discovery')}</h3>
              <p>
                {t('jobs:voiceModal.listening', 'Search for local plant and workshop jobs in Telugu, Hindi, or English by speaking naturally. No complex typing required.')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <Globe2 size={26} />
              </div>
              <h3>{t('common:multilingual', 'Native Multilingual Experience')}</h3>
              <p>
                Full UI support across English, हिन्दी (Hindi), and తెలుగు (Telugu) with instant switching and persistent language selection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate / Job Match Modal */}
      {showMatchModal && sampleMatch && (
        <MatchScoreModal
          onClose={() => setShowMatchModal(false)}
          jobTitle="Industrial Electrician & Substation Technician"
          companyName="ABC Precision Industries Ltd."
          matchData={sampleMatch}
        />
      )}
    </div>
  );
};
