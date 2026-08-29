import React, { useState } from 'react';
import {
  Layers,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { Application, ApplicationStage, InterviewDetails } from '../../types';

interface RecruitmentPipelinePageProps {
  onNavigate: (path: string) => void;
}

const STAGES: ApplicationStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];

export const RecruitmentPipelinePage: React.FC<RecruitmentPipelinePageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['employer', 'applications', 'common', 'navigation']);
  const store = useStore();
  const applications = store.applications;
  const jobs = store.jobs;

  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);

  // Interview modal form
  const [interviewDate, setInterviewDate] = useState('2026-03-05');
  const [interviewTime, setInterviewTime] = useState('10:30 AM IST');
  const [interviewType, setInterviewType] = useState<InterviewDetails['type']>('In-person Trade Test');
  const [interviewLoc, setInterviewLoc] = useState('ABC Industries Main Workshop, Autonagar, Vijayawada');
  const [instructions, setInstructions] = useState(
    'Please bring original trade certificates and safety boots for a 30-minute motor wiring bench test.'
  );

  const filteredApps = applications.filter((app) => {
    return selectedJobFilter === 'all' || app.jobId === selectedJobFilter;
  });

  const handleMoveStage = (appId: string, currentStage: ApplicationStage, direction: 'next' | 'prev') => {
    const currentIndex = STAGES.indexOf(currentStage);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < STAGES.length) {
      const targetStage = STAGES[targetIndex];

      if (targetStage === 'Interview') {
        const app = applications.find((a) => a.id === appId);
        if (app) setInterviewApp(app);
        return;
      }

      if (targetStage === 'Hired') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      store.updateApplicationStage(appId, targetStage, `Moved to ${targetStage}`);
    }
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp) return;

    store.scheduleInterview(interviewApp.id, {
      id: `iv_${Date.now()}`,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      locationOrLink: interviewLoc,
      instructions,
      interviewerName: 'Plant Supervisor',
      status: 'scheduled',
    });

    setInterviewApp(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">
            {t('employer:pipelineTitle', 'Candidate Recruitment Kanban')}
          </h1>
          <p className="text-xs text-muted">
            Drag, evaluate and move certified workers across verified trade qualification stages
          </p>
        </div>

        {/* Job Filter Selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="form-select text-xs"
          >
            <option value="all">⚡ {t('jobs:allTrades', 'All Active Openings')} ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Columns (6 Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto min-h-[550px] pb-4">
        {STAGES.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.currentStage === stage);

          return (
            <div
              key={stage}
              className="kc-card p-3 bg-slate-50/70 border border-slate-200 flex flex-col justify-between min-w-[200px]"
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <span className="font-extrabold text-xs text-navy">
                    {t(`applications:statusStages.${stage.toLowerCase()}`, stage)}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[10px] font-bold flex items-center justify-center border shadow-2xs">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards List in this Stage */}
                <div className="space-y-2.5">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-navy">{app.workerName}</h4>
                          <span className="text-[10px] text-muted block line-clamp-1">
                            {app.jobTitle}
                          </span>
                        </div>
                        <span className="badge badge-verified text-[8px] py-0">
                          {app.matchScore}%
                        </span>
                      </div>

                      {app.interview && (
                        <div className="p-1.5 rounded-md bg-purple-50 text-purple-700 text-[9px] font-semibold flex items-center gap-1 border border-purple-100">
                          <Calendar className="w-3 h-3" />
                          <span>{app.interview.date}</span>
                        </div>
                      )}

                      {/* Stage Move Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <button
                          onClick={() => handleMoveStage(app.id, app.currentStage, 'prev')}
                          disabled={stage === 'Applied'}
                          className={`p-1 rounded text-slate-400 hover:text-slate-700 ${
                            stage === 'Applied' ? 'invisible' : ''
                          }`}
                          title="Move Back"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleMoveStage(app.id, app.currentStage, 'next')}
                          disabled={stage === 'Hired'}
                          className={`btn btn-secondary btn-sm py-0.5 px-2 text-[10px] font-bold ${
                            stage === 'Hired' ? 'invisible' : ''
                          }`}
                        >
                          {stage === 'Selected' ? 'Hire ✓' : 'Advance →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      {interviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-black text-navy">Schedule Trade Test / Interview</h3>
                <p className="text-[11px] text-muted">Candidate: {interviewApp.workerName}</p>
              </div>
              <button onClick={() => setInterviewApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assessment Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="form-select text-xs"
                >
                  <option value="In-person Trade Test">In-person Trade Test / Workshop</option>
                  <option value="Technical Video Interview">Technical Video Call</option>
                  <option value="Site Practical Demonstration">Plant Practical Demonstration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Plant Location / Link</label>
                <input
                  type="text"
                  required
                  value={interviewLoc}
                  onChange={(e) => setInterviewLoc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Candidate Instructions</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="form-textarea text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setInterviewApp(null)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  {t('common:actions.cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-xs font-bold">
                  {t('applications:actions.confirmInterview', 'Schedule & Notify')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
