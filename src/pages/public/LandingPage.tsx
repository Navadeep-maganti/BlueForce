import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
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
          </div>

          {/* Platform Verified Credential Showcase Card */}
          <div className="talent-preview" aria-label="Example verified worker profile">
            <div className="talent-preview__topline">
              <span>
                <span className="live-dot" /> {t('worker:immediateJoining', 'AVAILABLE NOW')}
              </span>
              <span>{t('worker:verifiedBadge', 'Verified Credential')}</span>
            </div>
            <div className="talent-preview__person">
              <div className="talent-avatar" style={{ width: '48px', height: '48px', minWidth: '48px', maxWidth: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                KC
              </div>
              <div>
                <h2>
                  Certified Technician <BadgeCheck size={18} className="text-blue-500" />
                </h2>
                <p>Industrial Electrician & Automation</p>
                <p className="talent-preview__location">
                  <MapPin size={14} /> Visakhapatnam, AP · 4 yrs experience
                </p>
              </div>
            </div>

            <div className="talent-preview__score">
              <div>
                <span>{t('employer:matchScore', 'Trust Score')}</span>
                <strong>94/100</strong>
                <small>{t('common:badges.highMatch', 'Aadhaar eKYC + NSDC Certified')}</small>
              </div>
              <div className="score-ring">
                <span>94</span>
              </div>
            </div>

            <div className="talent-preview__skills">
              <span>Panel wiring</span>
              <span>PLC Automation</span>
              <span>Preventive maintenance</span>
            </div>

            <div className="talent-preview__proof">
              <p>
                <ShieldCheck size={17} />
                <span>
                  <strong>{t('common:badges.verifiedWorker', 'Direct Verified Hire')}</strong>
                  <small>{t('verification:verifiedBadge', 'Identity, trade certificate & work proof checked')}</small>
                </span>
              </p>
              <button onClick={() => setShowMatchModal(true)}>
                {t('jobs:jobDetails.matchAnalysis', 'Why this match?')} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Proof metrics bar */}
        <div className="landing-proof">
          <div className="landing-shell landing-proof__grid">
            <div>
              <strong>12,400+</strong>
              <span>{t('common:hero.stat1Label', 'Verified blue-collar workers')}</span>
            </div>
            <div>
              <strong>850+</strong>
              <span>{t('common:hero.stat2Label', 'Industrial employers hiring')}</span>
            </div>
            <div>
              <strong>4.2 Days</strong>
              <span>{t('common:hero.stat3Label', 'Average time-to-hire')}</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>{t('common:hero.stat4Label', 'Direct hiring, ₹0 commission')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="landing-section">
        <div className="landing-shell">
          <div className="section-head">
            <span className="eyebrow">{t('common:features.badge', 'Built for trust & clarity')}</span>
            <h2>{t('common:features.title', 'Everything workers & employers need in one unified ecosystem')}</h2>
          </div>

          <div className="landing-cards">
            <div className="feature-card">
              <div className="feature-card__icon">
                <ShieldCheck size={26} />
              </div>
              <h3>{t('verification:title', '100-Point Antigravity Trust Score')}</h3>
              <p>
                {t('verification:subtitle', 'Aadhaar identity, NSDC trade certificates, tested technical skills, and verified past-employer work proofs combined into one transparent rating.')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <Mic size={26} />
              </div>
              <h3>{t('jobs:voiceModal.title', 'Kaushal Voice Discovery')}</h3>
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
