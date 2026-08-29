import React, { useState } from 'react';
import { TrustScoreBreakdown } from '../../types';
import { ShieldCheck, Award, Wrench, Briefcase, Star, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface TrustScoreWidgetProps {
  scoreData: TrustScoreBreakdown;
  compact?: boolean;
  onExplainClick?: () => void;
}

export const TrustScoreWidget: React.FC<TrustScoreWidgetProps> = ({ scoreData, compact = false }) => {
  const [expanded, setExpanded] = useState(false);
  const { total, identity, certifications, skills, experience, employerReviews, completedJobs } = scoreData;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--color-success)';
    if (score >= 70) return 'var(--color-primary)';
    return 'var(--color-warning)';
  };

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (total / 100) * circumference;

  if (compact) {
    return (
      <div 
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-white shadow-xs cursor-pointer hover:border-blue-400 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-muted text-[11px]">Trust</span>
          <span className="font-bold text-navy">{total}</span>
          <span className="text-[10px] text-muted">/100</span>
        </div>
      </div>
    );
  }

  return (
    <div className="kc-card p-6 sm:p-7 bg-white border border-slate-200/80 rounded-2xl relative overflow-hidden shadow-xs hover:shadow-md transition-all">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-50/70 rounded-bl-full pointer-events-none opacity-60 blur-xl" />

      {/* Header with Circular Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-verified text-xs py-0.5 px-2.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Workforce ID
            </span>
            <span className="text-xs text-slate-400 font-medium">Updated 2d ago</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-navy tracking-tight flex items-center gap-2">
            Workforce Trust Score
            <span title="Calculated from verified government identity, NCVT certs, and supervisor audits">
              <Info className="w-4 h-4 text-blue-600 inline cursor-pointer" />
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Portable, tamper-evident proof of trade competency & reliability
          </p>
        </div>

        {/* Circular Radial Score */}
        <div className="flex items-center gap-3.5 self-start sm:self-auto">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={getScoreColor(total)}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-navy leading-none">{total}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-black text-emerald-700">Level 5 (Elite Trade)</div>
            <div className="text-xs text-slate-500">Top 3% Electricians in AP</div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {/* Metric 1: Identity */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Identity & Aadhaar
            </span>
            <span className="font-extrabold text-sm text-navy">{identity.score}/{identity.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-emerald-500" style={{ width: `${(identity.score / identity.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {identity.label}
          </p>
        </div>

        {/* Metric 2: Certifications */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Award className="w-4 h-4 text-blue-600" /> ITI & Trade Licenses
            </span>
            <span className="font-extrabold text-sm text-navy">{certifications.score}/{certifications.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-blue-500" style={{ width: `${(certifications.score / certifications.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {certifications.verifiedCount} Government Certs Active
          </p>
        </div>

        {/* Metric 3: Skills */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Wrench className="w-4 h-4 text-indigo-600" /> Verified Skills
            </span>
            <span className="font-extrabold text-sm text-navy">{skills.score}/{skills.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-indigo-500" style={{ width: `${(skills.score / skills.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {skills.testedCount} Standardized Tests
          </p>
        </div>

        {/* Metric 4: Experience */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Briefcase className="w-4 h-4 text-amber-600" /> Plant Tenures
            </span>
            <span className="font-extrabold text-sm text-navy">{experience.score}/{experience.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-amber-500" style={{ width: `${(experience.score / experience.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {experience.verifiedYears} Years Confirmed
          </p>
        </div>

        {/* Metric 5: Employer Reviews */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Star className="w-4 h-4 text-amber-500" /> Supervisor Reviews
            </span>
            <span className="font-extrabold text-sm text-navy">{employerReviews.score}/{employerReviews.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-amber-400" style={{ width: `${(employerReviews.score / employerReviews.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {employerReviews.avgRating}★ ({employerReviews.reviewCount} Reviews)
          </p>
        </div>

        {/* Metric 6: Completed Jobs */}
        <div className="p-3.5 rounded-xl border border-slate-100/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Proof-of-Work Works
            </span>
            <span className="font-extrabold text-sm text-navy">{completedJobs.score}/{completedJobs.max}</span>
          </div>
          <div className="match-bar-track mb-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className="match-bar-fill h-full rounded-full bg-emerald-500" style={{ width: `${(completedJobs.score / completedJobs.max) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {completedJobs.completedCount} Verified Works
          </p>
        </div>
      </div>

      {/* Expandable Formula Explanation */}
      <div className="mt-3 pt-2.5 border-t">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-primary hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide Trust Score Methodology' : 'How is this 91/100 score calculated? (Transparent signals)'}
        </button>

        {expanded && (
          <div className="mt-2.5 p-3 bg-blue-50/60 rounded-lg text-xs text-slate-700 space-y-1.5 animate-fadeIn border border-blue-100">
            <p className="font-bold text-navy text-[11px]">
              ⚖️ The BlueForce 100-Point Formula:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li><strong>20 pts:</strong> Biometric Identity & Aadhaar OTP/eKYC validation.</li>
              <li><strong>20 pts:</strong> Verified NCVT / State Technical Board certificates & trade licenses.</li>
              <li><strong>20 pts:</strong> Standardized trade tests (wireman competency, multimeter test).</li>
              <li><strong>15 pts:</strong> Cross-checked PF/ESI employer employment tenures.</li>
              <li><strong>15 pts:</strong> Direct supervisor feedback after completed commercial contracts.</li>
              <li><strong>10 pts:</strong> Photo/video evidence of executed work authenticated by site engineers.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
