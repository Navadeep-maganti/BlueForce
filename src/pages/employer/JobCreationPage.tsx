import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  Award,
  Layers,
  Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';

interface JobCreationPageProps {
  onNavigate: (path: string) => void;
}

export const JobCreationPage: React.FC<JobCreationPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['employer', 'jobs', 'common', 'navigation']);
  const store = useStore();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [tradeCategory, setTradeCategory] = useState('Electrical');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Shift-based'>('Full-time');
  const [shift, setShift] = useState<'Day Shift' | 'Night Shift' | 'Rotational' | 'Flexible'>('Day Shift');
  const [openings, setOpenings] = useState<number>(1);

  // Step 2
  const [skillsStr, setSkillsStr] = useState('');
  const [certsStr, setCertsStr] = useState('');
  const [expYears, setExpYears] = useState<number>(0);

  // Step 3
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [salaryMax, setSalaryMax] = useState<number>(0);
  const [city, setCity] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [benefitsStr, setBenefitsStr] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNext = () => {
    const error =
      currentStep === 1
        ? !title.trim() || !description.trim()
          ? 'Add a job title and a clear job description to continue.'
          : openings < 1
          ? 'Enter at least one opening.'
          : null
        : currentStep === 2
        ? !skillsStr.trim()
          ? 'Add at least one required skill to continue.'
          : null
        : currentStep === 3
        ? !city.trim() || !workAddress.trim()
          ? 'Add the city and full work address to continue.'
          : salaryMin <= 0 || salaryMax < salaryMin
          ? 'Enter a valid monthly salary range.'
          : null
        : null;
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setCurrentStep((step) => step + 1);
  };

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
        <ArrowLeft className="w-4 h-4" /> {t('common:actions.back', 'Back to Dashboard')}
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-navy">
          {t('employer:jobCreation.title', 'Post a New Trade Opening')}
        </h1>
        <p className="text-xs text-muted">
          {t('employer:jobCreation.subtitle', 'Publish a verified industrial opening to 12,000+ certified technicians.')}
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
        {validationError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" role="alert">
            {validationError}
          </div>
        )}

        {/* STEP 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 1: Role Overview</h2>

            <div className="form-group">
              <label className="form-label text-xs">
                {t('employer:jobCreation.jobTitle', 'Job Title')}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('employer:jobCreation.jobTitlePlaceholder', 'e.g. Industrial Electrician & Substation Tech')}
                className="form-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">
                  {t('employer:jobCreation.tradeCategory', 'Trade Category')}
                </label>
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
                <label className="form-label text-xs">
                  {t('employer:jobCreation.vacancies', 'Open Vacancies')}
                </label>
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
                <label className="form-label text-xs">
                  {t('jobs:filterByJobType', 'Job Type')}
                </label>
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
                  <option value="Day Shift">Day Shift</option>
                  <option value="Night Shift">Night Shift</option>
                  <option value="Rotational">Rotational</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-xs">
                {t('employer:jobCreation.jobDescription', 'Job Description')}
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('employer:jobCreation.jobDescriptionPlaceholder', 'Describe shift timing, machine types, overtime policy, food/accommodation...')}
                className="form-textarea text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Certs */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 2: Required Skills & Credentials</h2>

            <div className="form-group">
              <label className="form-label text-xs">Required Technical Skills (comma separated)</label>
              <input
                type="text"
                required
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. PLC Ladder Logic, 415V HT Panels, Transformer Testing"
                className="form-input text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs">
                {t('employer:jobCreation.certificationsRequired', 'Required Certifications')} (comma separated)
              </label>
              <input
                type="text"
                value={certsStr}
                onChange={(e) => setCertsStr(e.target.value)}
                placeholder="e.g. NCVT ITI Electrician, CEIG 'A' License"
                className="form-input text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs">
                {t('employer:jobCreation.minExperience', 'Minimum Experience (Years)')}
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={expYears}
                onChange={(e) => setExpYears(Number(e.target.value))}
                className="form-input text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Location & Pay */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 3: Location & Compensation</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">
                  {t('employer:jobCreation.salaryMin', 'Minimum Monthly Salary (₹)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  placeholder="22000"
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">
                  {t('employer:jobCreation.salaryMax', 'Maximum Monthly Salary (₹)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  placeholder="30000"
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">
                  {t('employer:jobCreation.location', 'City / District')}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Vijayawada, AP"
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Plant / Factory Address</label>
                <input
                  type="text"
                  required
                  value={workAddress}
                  onChange={(e) => setWorkAddress(e.target.value)}
                  placeholder="Plot 42, Auto Nagar Industrial Estate"
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Benefits & Allowances (comma separated)</label>
              <input
                type="text"
                value={benefitsStr}
                onChange={(e) => setBenefitsStr(e.target.value)}
                placeholder="e.g. Free Plant Canteen, PF + ESI, Overtime 2x, Transport"
                className="form-input text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-bold text-navy">Step 4: Review Your Job Opening</h2>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-navy text-sm">{title}</span>
                <span className="badge badge-primary">{tradeCategory}</span>
              </div>
              <p className="text-slate-700">{description}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted">
                <div>
                  <strong>Pay:</strong> ₹{salaryMin.toLocaleString()} – ₹{salaryMax.toLocaleString()}/mo
                </div>
                <div>
                  <strong>Location:</strong> {city}
                </div>
                <div>
                  <strong>Openings:</strong> {openings}
                </div>
                <div>
                  <strong>Shift:</strong> {shift}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="btn btn-secondary btn-sm text-xs"
            >
              {t('common:actions.back', 'Back')}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1"
            >
              {t('common:actions.next', 'Next Step')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1 font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t('employer:jobCreation.publishJob', 'Publish Job Opening')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
