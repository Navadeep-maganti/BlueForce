import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building,
  MapPin,
  Clock,
  Award,
  Layers,
  Wrench,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface JobCreationPageProps {
  onNavigate: (path: string) => void;
}

export const JobCreationPage: React.FC<JobCreationPageProps> = ({ onNavigate }) => {
  const store = useStore();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('Senior Industrial Wireman & LT Panel Expert');
  const [tradeCategory, setTradeCategory] = useState('Electrical');
  const [description, setDescription] = useState(
    'Responsible for high-voltage panel wiring, motor starter calibration, and preventative maintenance at our Autonagar plant.'
  );
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Shift-based'>('Full-time');
  const [shift, setShift] = useState<'Day Shift' | 'Night Shift' | 'Rotational' | 'Flexible'>('Day Shift');
  const [openings, setOpenings] = useState<number>(4);

  // Step 2
  const [skillsStr, setSkillsStr] = useState('Industrial Wiring, LT/HT Switchgear, Motor Maintenance, Plant Safety');
  const [certsStr, setCertsStr] = useState('ITI Electrician Diploma, A-Grade Wireman License');
  const [expYears, setExpYears] = useState<number>(4);

  // Step 3
  const [salaryMin, setSalaryMin] = useState<number>(26000);
  const [salaryMax, setSalaryMax] = useState<number>(34000);
  const [city, setCity] = useState('Vijayawada');
  const [workAddress, setWorkAddress] = useState('Phase-2, Autonagar Industrial Area, Vijayawada, AP');
  const [benefitsStr, setBenefitsStr] = useState('PF & ESI, Subsidized Canteen, Overtime Pay (1.5x), Safety Boots & Kit');
  const [joiningDate, setJoiningDate] = useState('Within 15 Days');
  const [deadlineDate, setDeadlineDate] = useState('2026-04-30');

  const handlePublish = () => {
    store.postNewJob({
      title,
      tradeCategory,
      description,
      jobType,
      shift,
      openings,
      requiredSkills: skillsStr.split(',').map((s) => s.trim()),
      requiredCertifications: certsStr.split(',').map((s) => s.trim()),
      experienceRequiredYears: expYears,
      salaryMin,
      salaryMax,
      salaryPeriod: 'monthly',
      location: `${city}, AP`,
      city,
      distanceKm: 8,
      workAddress,
      benefits: benefitsStr.split(',').map((b) => b.trim()),
      joiningDate,
      deadlineDate,
    });

    onNavigate('/employer/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/employer/dashboard')}
        className="text-xs font-bold text-slate-600 hover:text-navy flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-navy">Post a New Trade Opening</h1>
        <p className="text-xs text-muted">
          Our AI parser will automatically index your requirements and match them against verified candidate profiles.
        </p>
      </div>

      {/* 4-Step Stepper Bar */}
      <div className="kc-card p-4 bg-white border">
        <div className="stepper-nav mb-0 pb-0 border-none">
          <div className={`stepper-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <div className="stepper-number">1</div>
            <span className="hidden sm:inline">Basic Details</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-2" />
          <div className={`stepper-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <div className="stepper-number">2</div>
            <span className="hidden sm:inline">Skills & Certs</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-2" />
          <div className={`stepper-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
            <div className="stepper-number">3</div>
            <span className="hidden sm:inline">Location & Pay</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-2" />
          <div className={`stepper-item ${currentStep === 4 ? 'active' : ''}`}>
            <div className="stepper-number">4</div>
            <span className="hidden sm:inline">Review & Publish</span>
          </div>
        </div>
      </div>

      {/* Step Contents */}
      <div className="kc-card p-6 bg-white border">
        {/* STEP 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 1: Role Overview</h2>

            <div className="form-group">
              <label className="form-label text-xs">Job Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Industrial Electrician & Substation Tech"
                className="form-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">Trade Category</label>
                <select
                  value={tradeCategory}
                  onChange={(e) => setTradeCategory(e.target.value)}
                  className="form-select text-xs"
                >
                  <option value="Electrical">⚡ Electrical & Power Systems</option>
                  <option value="Solar">☀️ Solar & Renewable Energy</option>
                  <option value="Machining">⚙️ CNC Machining & Tooling</option>
                  <option value="Welding">🔥 TIG/MIG Welding & Fabrication</option>
                  <option value="Automotive">🚛 Heavy Vehicles & Fleet</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Open Vacancies</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={openings}
                  onChange={(e) => setOpenings(Number(e.target.value))}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="form-select text-xs"
                >
                  <option value="Full-time">Full-time (Direct Plant)</option>
                  <option value="Contract">Contract (Fixed Term)</option>
                  <option value="Shift-based">Shift-based</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Shift Timings</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="form-select text-xs"
                >
                  <option value="Day Shift">Day Shift (08:00 AM – 05:00 PM)</option>
                  <option value="Night Shift">Night Shift (08:00 PM – 05:00 AM)</option>
                  <option value="Rotational">Rotational Shift (3 Shifts)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Job Description & Responsibilities</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Requirements */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 2: Skills & Mandatory Certifications</h2>

            <div className="form-group">
              <label className="form-label text-xs">Required Trade Skills (comma separated)</label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. Industrial Three-Phase Wiring, LT Panels, Motor Rewinding"
                className="form-input text-xs"
              />
              <p className="text-[11px] text-muted">
                Tip: Specific trade terms allow our AI algorithm to match candidates with 90%+ accuracy.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Mandatory Trade Licenses / Certifications</label>
              <input
                type="text"
                value={certsStr}
                onChange={(e) => setCertsStr(e.target.value)}
                placeholder="e.g. ITI NCVT Electrician, A-Grade Wireman License"
                className="form-input text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Minimum Experience Required (Years)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={expYears}
                onChange={(e) => setExpYears(Number(e.target.value))}
                className="form-input text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Location & Salary */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 3: Location & Compensation</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">Minimum Monthly Salary (₹)</label>
                <input
                  type="number"
                  step="1000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Maximum Monthly Salary (₹)</label>
                <input
                  type="number"
                  step="1000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Expected Joining Timeline</label>
                <input
                  type="text"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Full Plant Work Address</label>
              <input
                type="text"
                value={workAddress}
                onChange={(e) => setWorkAddress(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Benefits Provided (comma separated)</label>
              <input
                type="text"
                value={benefitsStr}
                onChange={(e) => setBenefitsStr(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950">AI Parsing Ready</h3>
                <p className="text-[11px] text-emerald-800">
                  We found <strong>8 pre-screened candidates</strong> in your district matching these exact trade parameters.
                </p>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-5 rounded-2xl border bg-slate-50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge-primary text-[10px] mb-1">{tradeCategory}</span>
                  <h3 className="text-base font-extrabold text-navy">{title}</h3>
                  <p className="text-xs text-muted mt-0.5">{workAddress}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-700">
                    ₹{salaryMin.toLocaleString()} – ₹{salaryMax.toLocaleString()} / mo
                  </div>
                  <span className="text-[10px] text-muted">{openings} Openings • {shift}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t">
                {description}
              </p>

              <div className="pt-2 border-t">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skillsStr.split(',').map((s, i) => (
                    <span key={i} className="badge badge-neutral text-[10px]">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Nav */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="btn btn-secondary btn-sm text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="btn btn-success btn-sm text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Publish Job to Live Feed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
