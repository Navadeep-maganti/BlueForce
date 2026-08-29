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
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { Application, ApplicationStage } from '../../types';

interface ApplicationTrackingPageProps {
  onNavigate: (path: string) => void;
}

const STAGES: ApplicationStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];

export const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['applications', 'common', 'navigation', 'jobs']);
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
          <h1 className="text-xl font-bold text-navy">
            {t('applications:title', 'Application Progress & Interviews')}
          </h1>
          <p className="text-xs text-muted">
            {t('applications:subtitle', 'Track real-time candidate progression from trade screening to on-site plant joining')}
          </p>
        </div>
        <button
          onClick={() => onNavigate('/worker/jobs')}
          className="btn btn-primary btn-sm text-xs self-start sm:self-auto"
        >
          {t('applications:emptyStateCta', 'Explore More Openings')}
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="kc-card p-12 text-center bg-white border">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-navy">
            {t('applications:emptyState', 'No applications yet')}
          </h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto mb-4">
            {t('applications:subtitle', 'Discover matching trade openings and apply in 1-click using your verified digital identity.')}
          </p>
          <button onClick={() => onNavigate('/worker/jobs')} className="btn btn-primary btn-sm text-xs">
            {t('applications:emptyStateCta', 'Browse Recommended Openings')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1">
              {t('applications:tabs.all', { count: applications.length, defaultValue: `All Applications (${applications.length})` })}
            </h2>

            <div className="space-y-2">
              {applications.map((app) => {
                const isSelected = app.id === currentApp?.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-xs text-navy line-clamp-1">{app.jobTitle}</h3>
                      <span
                        className={`badge text-[9px] font-bold ${
                          app.currentStage === 'Interview'
                            ? 'badge-verified'
                            : app.currentStage === 'Hired' || app.currentStage === 'Selected'
                            ? 'badge-success'
                            : 'badge-neutral'
                        }`}
                      >
                        {t(`applications:statusStages.${app.currentStage.toLowerCase()}`, app.currentStage)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className="font-medium text-slate-700">{app.companyName}</span>
                      <span>{app.appliedDate}</span>
                    </div>

                    {app.interview && (
                      <div className="mt-2 p-1.5 rounded-md bg-blue-50 border border-blue-100 flex items-center gap-1.5 text-[10px] text-primary font-bold">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>
                          {t('applications:statusStages.interview', 'Interview')}: {app.interview.date} at {app.interview.time}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Application Pipeline Detail (8 cols) */}
          {currentApp && (
            <div className="lg:col-span-8 space-y-6">
              {/* Top Summary Card */}
              <div className="kc-card p-6 bg-white border space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                  <div>
                    <span className="badge badge-primary text-[10px] uppercase font-bold mb-1">
                      {currentApp.workerTrade}
                    </span>
                    <h2 className="text-base font-black text-navy">{currentApp.jobTitle}</h2>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {currentApp.companyName} •{' '}
                      {t('applications:timeline.appliedOn', { date: currentApp.appliedDate, defaultValue: `Applied on ${currentApp.appliedDate}` })}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(`/worker/jobs/${currentApp.jobId}`)}
                    className="btn btn-secondary btn-sm text-xs self-start sm:self-auto"
                  >
                    {t('applications:actions.viewJob', 'View Job Posting')}
                  </button>
                </div>

                {/* Progress Stepper Bar */}
                <div>
                  <h3 className="text-xs font-bold text-navy mb-4">
                    {t('applications:timeline.title', 'Application Progress Pipeline')}
                  </h3>

                  <div className="relative flex items-center justify-between">
                    {/* Connecting background track */}
                    <div className="absolute left-0 top-3.5 w-full h-1 bg-slate-100 -z-0" />
                    <div
                      className="absolute left-0 top-3.5 h-1 bg-primary transition-all duration-500 -z-0"
                      style={{
                        width: `${(getStageIndex(currentApp.currentStage) / (STAGES.length - 1)) * 100}%`,
                      }}
                    />

                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= getStageIndex(currentApp.currentStage);
                      const isCurrent = idx === getStageIndex(currentApp.currentStage);

                      return (
                        <div key={stage} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                              isCurrent
                                ? 'bg-primary text-white border-primary ring-4 ring-primary/20'
                                : isCompleted
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-1.5 text-center ${
                              isCurrent ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {t(`applications:statusStages.${stage.toLowerCase()}`, stage)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scheduled Interview Details */}
              {currentApp.interview && (
                <div className="kc-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-navy">
                        📅 {t('applications:statusStages.interview', 'Confirmed Interview Schedule')}
                      </h3>
                      <p className="text-[11px] text-muted">
                        {currentApp.interview.type} with Employer Plant Supervisor
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-blue-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block">
                        Date & Time
                      </span>
                      <span className="font-bold text-navy">
                        {currentApp.interview.date} at {currentApp.interview.time}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block">
                        Location / Link
                      </span>
                      <span className="font-bold text-navy flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {currentApp.interview.locationOrLink}
                      </span>
                    </div>

                    {currentApp.interview.instructions && (
                      <div className="sm:col-span-2 pt-2 border-t text-[11px] text-slate-700">
                        <span className="font-bold text-navy block mb-0.5">Instructions:</span>
                        {currentApp.interview.instructions}
                      </div>
                    )}
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
