import React from 'react';
import { JobMatchBreakdown } from '../../types';
import { X, Sparkles, CheckCircle, Target, MapPin, Award, Clock, Wrench } from 'lucide-react';

interface MatchScoreModalProps {
  matchData: JobMatchBreakdown;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
}

export const MatchScoreModal: React.FC<MatchScoreModalProps> = ({
  matchData,
  jobTitle,
  companyName,
  onClose,
}) => {
  const { matchPercentage, skillCompatibility, experienceScore, locationScore, certificationScore, availabilityScore, reasons } = matchData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Explainable AI Match
                </span>
                <span className="badge badge-verified font-bold text-xs">
                  {matchPercentage}% Compatibility
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy">{jobTitle}</h3>
              <p className="text-xs text-muted">{companyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Match Bar */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Overall Fit Breakdown
            </span>
            <span className="text-2xl font-black text-emerald-400">{matchPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-blue-200 mt-2">
            No mysterious algorithms. This score is mathematically derived from your verified trade credentials, proximity, and experience.
          </p>
        </div>

        {/* Signal Breakdown */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Score Signals & Factors
        </h4>

        <div className="space-y-3">
          {/* Factor 1: Skills */}
          <div className="p-3 rounded-lg border bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="flex items-center gap-1.5 text-navy">
                <Wrench className="w-4 h-4 text-blue-600" /> Skill Compatibility
              </span>
              <span className="text-primary font-bold">{skillCompatibility.score} / {skillCompatibility.max} pts</span>
            </div>
            <div className="match-bar-track mb-1">
              <div className="match-bar-fill" style={{ width: `${(skillCompatibility.score / skillCompatibility.max) * 100}%` }} />
            </div>
            <p className="text-xs text-muted">{skillCompatibility.details}</p>
          </div>

          {/* Factor 2: Experience */}
          <div className="p-3 rounded-lg border bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="flex items-center gap-1.5 text-navy">
                <Clock className="w-4 h-4 text-amber-600" /> Experience Match
              </span>
              <span className="text-primary font-bold">{experienceScore.score} / {experienceScore.max} pts</span>
            </div>
            <div className="match-bar-track mb-1">
              <div className="match-bar-fill" style={{ width: `${(experienceScore.score / experienceScore.max) * 100}%` }} />
            </div>
            <p className="text-xs text-muted">{experienceScore.details}</p>
          </div>

          {/* Factor 3: Location */}
          <div className="p-3 rounded-lg border bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="flex items-center gap-1.5 text-navy">
                <MapPin className="w-4 h-4 text-emerald-600" /> Proximity & Commute
              </span>
              <span className="text-primary font-bold">{locationScore.score} / {locationScore.max} pts</span>
            </div>
            <div className="match-bar-track mb-1">
              <div className="match-bar-fill" style={{ width: `${(locationScore.score / locationScore.max) * 100}%` }} />
            </div>
            <p className="text-xs text-muted">{locationScore.details}</p>
          </div>

          {/* Factor 4: Certification */}
          <div className="p-3 rounded-lg border bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="flex items-center gap-1.5 text-navy">
                <Award className="w-4 h-4 text-indigo-600" /> Mandatory Certification
              </span>
              <span className="text-primary font-bold">{certificationScore.score} / {certificationScore.max} pts</span>
            </div>
            <div className="match-bar-track mb-1">
              <div className="match-bar-fill" style={{ width: `${(certificationScore.score / certificationScore.max) * 100}%` }} />
            </div>
            <p className="text-xs text-muted">{certificationScore.details}</p>
          </div>

          {/* Factor 5: Availability */}
          <div className="p-3 rounded-lg border bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="flex items-center gap-1.5 text-navy">
                <CheckCircle className="w-4 h-4 text-teal-600" /> Availability / Joining
              </span>
              <span className="text-primary font-bold">{availabilityScore.score} / {availabilityScore.max} pts</span>
            </div>
            <div className="match-bar-track mb-1">
              <div className="match-bar-fill" style={{ width: `${(availabilityScore.score / availabilityScore.max) * 100}%` }} />
            </div>
            <p className="text-xs text-muted">{availabilityScore.details}</p>
          </div>
        </div>

        {/* Reasons list */}
        {reasons && reasons.length > 0 && (
          <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <h5 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Key Match Highlights
            </h5>
            <ul className="space-y-1">
              {reasons.map((r, i) => (
                <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="btn btn-primary w-full sm:w-auto">
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
