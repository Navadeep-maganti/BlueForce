import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  Phone,
  User,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Application, ApplicationStage } from '../../types';

interface ApplicationTrackingPageProps {
  onNavigate: (path: string) => void;
}

const STAGES: ApplicationStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];

export const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({ onNavigate }) => {
  const store = useStore();
  const worker = store.workerProfile;
  const applications = store.applications.filter((a) => a.workerId === worker.id);

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const getStageIndex = (stage: ApplicationStage) => STAGES.indexOf(stage);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-navy">Application Progress & Interviews</h1>
          <p className="text-xs text-muted">
            Track real-time candidate progression from trade screening to on-site plant joining
          </p>
        </div>
        <button
          onClick={() => onNavigate('/worker/jobs')}
          className="btn btn-primary btn-sm text-xs self-start sm:self-auto"
        >
          Explore More Openings
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="kc-card p-12 text-center bg-white border">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-navy">No applications yet</h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto mb-4">
            Discover matching trade openings and apply in 1-click using your verified digital identity.
          </p>
          <button onClick={() => onNavigate('/worker/jobs')} className="btn btn-primary btn-sm text-xs">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active Applications ({applications.length})
            </span>
            {applications.map((app) => {
              const isSelected = app.id === currentApp?.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-primary shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-xs text-navy line-clamp-1">{app.jobTitle}</h3>
                    <span className="badge badge-primary text-[10px] uppercase font-bold whitespace-nowrap">
                      {app.currentStage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{app.companyName}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted mt-2 pt-2 border-t border-slate-200/60">
                    <span>Applied: {app.appliedDate}</span>
                    <span className="font-bold text-emerald-700">{app.matchScore}% Match</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Application View & Visual 6-Stage Timeline (8 cols) */}
          {currentApp && (
            <div className="lg:col-span-8 space-y-6">
              {/* Top Banner Card */}
              <div className="kc-card p-6 bg-white border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                  <div>
                    <span className="badge badge-verified text-[11px] mb-1">
                      Verified Identity Application
                    </span>
                    <h2 className="text-lg font-black text-navy">{currentApp.jobTitle}</h2>
                    <p className="text-xs font-semibold text-slate-700">{currentApp.companyName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-muted">Current Status</div>
                    <div className="text-base font-extrabold text-primary uppercase">
                      {currentApp.currentStage}
                    </div>
                  </div>
                </div>

                {/* Visual 6-Stage Timeline */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Recruitment Progress Pipeline
                  </h4>

                  <div className="relative">
                    {/* Horizontal Bar (Desktop) */}
                    <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${(getStageIndex(currentApp.currentStage) / (STAGES.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                      {STAGES.map((stageName, idx) => {
                        const currentIdx = getStageIndex(currentApp.currentStage);
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={stageName} className="flex flex-col sm:items-center text-left sm:text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                                isCurrent
                                  ? 'bg-primary text-white ring-4 ring-blue-100 scale-110'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] font-bold ${
                                isCurrent
                                  ? 'text-primary'
                                  : isDone
                                  ? 'text-navy'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Timeline Log Events */}
                <div className="mt-8 pt-6 border-t space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Activity & Verification Log
                  </h4>
                  <div className="space-y-2.5">
                    {currentApp.timeline.map((event, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                          event.completed
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-slate-50/40 border-dashed border-slate-200 text-slate-400'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                            event.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {event.completed ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy">{event.stage}</span>
                            {event.timestamp && (
                              <span className="text-[10px] text-muted">{event.timestamp}</span>
                            )}
                          </div>
                          {event.note && (
                            <p className="text-[11px] text-slate-600 mt-0.5">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scheduled Interview Card */}
              {currentApp.interview && (
                <div className="kc-card p-6 bg-gradient-to-br from-blue-900 to-navy-900 text-white shadow-xl rounded-2xl border border-blue-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-extrabold text-base text-white">
                      Scheduled Trade Test & Interview
                    </h3>
                    <span className="badge bg-emerald-500 text-white text-[10px] font-bold ml-auto">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">Date & Time</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        {currentApp.interview.date} at {currentApp.interview.time}
                      </span>
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">Interview Format</span>
                      <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
                        {currentApp.interview.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs space-y-2 mb-4">
                    <div>
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">Plant Location</span>
                      <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                        {currentApp.interview.locationOrLink}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-200 uppercase font-bold block">Special Instructions</span>
                      <p className="text-blue-100 text-[11px] leading-relaxed mt-0.5">
                        {currentApp.interview.instructions}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-blue-200">
                    <span>Interviewer: <strong>{currentApp.interview.interviewerName}</strong></span>
                    <button
                      onClick={() => alert('Directions & Plant Entry Pass sent to your SMS/WhatsApp!')}
                      className="btn btn-sm bg-cyan-400 text-navy-950 font-bold hover:bg-cyan-300"
                    >
                      Download Entry Pass (PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
