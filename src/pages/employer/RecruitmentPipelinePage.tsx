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
  ChevronRight,
  X,
  Award,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../hooks/useStore';
import { Application, ApplicationStage, InterviewDetails } from '../../types';

interface RecruitmentPipelinePageProps {
  onNavigate: (path: string) => void;
}

const STAGES: ApplicationStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];

export const RecruitmentPipelinePage: React.FC<RecruitmentPipelinePageProps> = ({ onNavigate }) => {
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
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      store.moveApplicationStage(appId, targetStage, `Stage advanced to ${targetStage}`);
    }
  };

  const handleSaveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp) return;

    store.scheduleInterview(interviewApp.id, {
      id: `int_${Date.now()}`,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      locationOrLink: interviewLoc,
      instructions,
      interviewerName: 'K. Satyanarayana (General Manager)',
      status: 'scheduled',
    });

    setInterviewApp(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-navy">Recruitment Pipeline</h1>
            <span className="badge badge-primary text-[11px]">Kanban Board</span>
          </div>
          <p className="text-xs text-muted">
            Manage candidates across hiring stages. Moving to "Hired" generates worker ID badge and notifies candidate.
          </p>
        </div>

        {/* Job Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Filter by Opening:</span>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="form-select text-xs py-1.5 w-56"
          >
            <option value="all">All Open Positions ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-grid">
        {STAGES.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.currentStage === stage);

          return (
            <div key={stage} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      stage === 'Hired'
                        ? 'bg-emerald-500'
                        : stage === 'Interview'
                        ? 'bg-amber-500'
                        : 'bg-primary'
                    }`}
                  />
                  {stage}
                </span>
                <span className="badge badge-neutral text-[10px] py-0">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-2.5 flex-1">
                {stageApps.map((app) => (
                  <div key={app.id} className="kanban-card space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={app.workerAvatarUrl}
                          alt={app.workerName}
                          className="w-9 h-9 rounded-xl object-cover border"
                        />
                        <div>
                          <h4 className="font-extrabold text-xs text-navy leading-tight">
                            {app.workerName}
                          </h4>
                          <span className="text-[10px] text-muted">{app.workerTrade}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="badge badge-verified text-[10px] py-0">
                          {app.workerTrustScore}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-700">
                        <span className="truncate pr-1 font-semibold">{app.jobTitle}</span>
                        <span className="font-bold text-emerald-700">{app.matchScore}%</span>
                      </div>
                      <div className="text-[10px] text-muted">
                        Applied: {app.appliedDate}
                      </div>
                    </div>

                    {/* Scheduled Interview badge if in Interview */}
                    {app.interview && (
                      <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium">
                        🗓️ {app.interview.date} at {app.interview.time}
                      </div>
                    )}

                    {/* Stage shift arrows */}
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      {stage !== 'Applied' ? (
                        <button
                          onClick={() => handleMoveStage(app.id, stage, 'prev')}
                          title="Move Back"
                          className="text-slate-400 hover:text-navy p-1 rounded hover:bg-slate-100"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div />
                      )}

                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {stage}
                      </span>

                      {stage !== 'Hired' ? (
                        <button
                          onClick={() => handleMoveStage(app.id, stage, 'next')}
                          className="btn btn-primary btn-sm text-[10px] py-1 px-2 flex items-center gap-1"
                        >
                          {stage === 'Selected' ? (
                            'Hire ✓'
                          ) : stage === 'Shortlisted' ? (
                            'Schedule 🗓️'
                          ) : (
                            <>
                              Next <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="badge badge-verified text-[10px]">Hired ✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      {interviewApp && (
        <div className="modal-overlay" onClick={() => setInterviewApp(null)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-base font-bold text-navy">Schedule Trade Test & Interview</h3>
                  <p className="text-xs text-muted">Candidate: {interviewApp.workerName} ({interviewApp.jobTitle})</p>
                </div>
              </div>
              <button onClick={() => setInterviewApp(null)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label text-xs">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="form-select text-xs"
                >
                  <option value="In-person Trade Test">In-person Trade Test (Plant Workshop)</option>
                  <option value="Video Call">Video Technical Screening</option>
                  <option value="Phone Screening">Phone Screening</option>
                  <option value="Plant Visit">Plant Walkthrough & Foreman Discussion</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Plant Address or Meeting Link</label>
                <input
                  type="text"
                  required
                  value={interviewLoc}
                  onChange={(e) => setInterviewLoc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Instructions for Candidate</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="form-textarea text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setInterviewApp(null)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-xs font-bold">
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
