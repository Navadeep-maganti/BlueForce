import React, { useState } from 'react';
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, ChevronRight,
  Globe2, MapPin, Mic, Search, ShieldCheck, Sparkles, Star, UsersRound, Zap,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { MatchScoreModal } from '../../components/matching/MatchScoreModal';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenVoiceModal }) => {
  const store = useStore();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [search, setSearch] = useState('');
  const sampleMatch = store.jobs[0]?.matchData;

  const startWorker = () => { store.loginAs('worker'); onNavigate('/worker/dashboard'); };
  const startEmployer = () => { store.loginAs('employer'); onNavigate('/employer/dashboard'); };
  const handleSearch = (event: React.FormEvent) => { event.preventDefault(); onNavigate('/worker/jobs'); };

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-orb landing-orb--one" /><div className="landing-orb landing-orb--two" />
        <div className="landing-shell landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="eyebrow"><Sparkles size={14} /> India&apos;s trusted skilled-work network</p>
            <h1>Good work deserves a <span>better way in.</span></h1>
            <p className="landing-hero__lede">Find verified opportunities or hire proven talent — without the uncertainty, endless calls, or unreliable profiles.</p>
            <form className="landing-search" onSubmit={handleSearch}>
              <Search size={20} aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search electrician, welder, supervisor…" aria-label="Search jobs by role or skill" />
              <button type="submit">Search jobs <ArrowRight size={16} /></button>
            </form>
            <div className="landing-search__support"><span>Popular: Electrician</span><span>Maintenance</span><span>Machine operator</span><button onClick={onOpenVoiceModal} type="button"><Mic size={14} /> Search by voice</button></div>
            <div className="landing-paths" aria-label="Choose your path">
              <button className="landing-path landing-path--primary" onClick={startWorker}><span className="landing-path__icon"><BriefcaseBusiness size={21} /></span><span><strong>I&apos;m looking for work</strong><small>Build a profile and find matches</small></span><ArrowRight size={18} /></button>
              <button className="landing-path" onClick={startEmployer}><span className="landing-path__icon"><Building2 size={21} /></span><span><strong>I&apos;m hiring</strong><small>Discover people ready to work</small></span><ArrowRight size={18} /></button>
            </div>
          </div>
          <div className="talent-preview" aria-label="Example verified worker profile">
            <div className="talent-preview__topline"><span><span className="live-dot" /> AVAILABLE NOW</span><span>Live profile</span></div>
            <div className="talent-preview__person"><div className="talent-avatar">RK</div><div><h2>Ramesh Kumar <BadgeCheck size={18} /></h2><p>Industrial Electrician</p><p className="talent-preview__location"><MapPin size={14} /> Visakhapatnam · 4 yrs experience</p></div></div>
            <div className="talent-preview__score"><div><span>Match score</span><strong>94%</strong><small>Great fit for your opening</small></div><div className="score-ring"><span>94</span></div></div>
            <div className="talent-preview__skills"><span>Panel wiring</span><span>Safety systems</span><span>Preventive maintenance</span></div>
            <div className="talent-preview__proof"><p><ShieldCheck size={17} /><span><strong>Verified to hire</strong><small>Identity, trade certificate & work proof checked</small></span></p><button onClick={() => setShowMatchModal(true)}>Why this match? <ChevronRight size={15} /></button></div>
          </div>
        </div>
        <div className="landing-shell landing-proofbar">
          <div><strong>12,400+</strong><span>verified workers</span></div><div><strong>1,800+</strong><span>active employers</span></div><div><strong>91/100</strong><span>average trust score</span></div><div><span className="landing-proofbar__stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></span><span>built for real work</span></div>
        </div>
      </section>
      <section className="landing-section landing-shell landing-intro"><div className="section-heading"><p className="eyebrow">One trusted place</p><h2>Every decision starts with proof, not promises.</h2><p>Blue Workforce makes skills, reliability, and availability easy to understand before anyone commits.</p></div><div className="value-grid"><article><span className="value-icon value-icon--blue"><ShieldCheck /></span><h3>Profiles you can trust</h3><p>Clear identity, certificates and work proof, all in one place.</p></article><article><span className="value-icon value-icon--violet"><Zap /></span><h3>Relevant matches first</h3><p>See the jobs and candidates that actually fit, with the reason why.</p></article><article><span className="value-icon value-icon--amber"><Globe2 /></span><h3>Easy in your language</h3><p>Use English, Telugu, Hindi, or voice search to move faster.</p></article></div></section>
      <section className="landing-section landing-shell landing-flow"><div className="section-heading"><p className="eyebrow">Simple from day one</p><h2>Know exactly what to do next.</h2></div><div className="flow-steps"><article><span>01</span><div><h3>Create your trusted profile</h3><p>Add your skills and proof. We guide you through it in minutes.</p></div></article><article><span>02</span><div><h3>See the strongest matches</h3><p>Understand fit, pay, location, and requirements before you apply or contact.</p></div></article><article><span>03</span><div><h3>Move forward confidently</h3><p>Track every application, interview, and hiring decision in one clear place.</p></div></article></div></section>
      <section className="landing-shell landing-cta"><div><p className="eyebrow">A better workforce, together</p><h2>Ready when you are.</h2><p>Join a hiring network built around skilled people and reliable outcomes.</p></div><div className="landing-cta__actions"><button className="button button--light" onClick={startWorker}>Find work <ArrowRight size={17} /></button><button className="button button--outline" onClick={startEmployer}>Hire talent <UsersRound size={17} /></button></div></section>
      {showMatchModal && sampleMatch && <MatchScoreModal matchData={sampleMatch} jobTitle={store.jobs[0]?.title ?? 'Industrial Electrician'} companyName={store.jobs[0]?.companyName ?? 'Blue Workforce'} onClose={() => setShowMatchModal(false)} />}
    </div>
  );
};
