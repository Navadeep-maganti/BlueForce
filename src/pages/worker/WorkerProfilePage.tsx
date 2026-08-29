import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Wrench,
  Briefcase,
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Camera,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { TrustScoreWidget } from '../../components/trust/TrustScoreWidget';
import { ProofOfWorkItem, SkillItem } from '../../types';

interface WorkerProfilePageProps {
  onNavigate: (path: string) => void;
}

export const WorkerProfilePage: React.FC<WorkerProfilePageProps> = ({ onNavigate }) => {
  const store = useStore();
  const worker = store.workerProfile;

  const [activeTab, setActiveTab] = useState<'proof' | 'skills' | 'certs' | 'experience' | 'reviews'>('proof');
  const [showAddPowModal, setShowAddPowModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // New Proof of Work form state
  const [powTitle, setPowTitle] = useState('');
  const [powDesc, setPowDesc] = useState('');
  const [powCategory, setPowCategory] = useState('Industrial Electrical');
  const [powEmployer, setPowEmployer] = useState('');
  const [powSkills, setPowSkills] = useState('');
  const [powLocation, setPowLocation] = useState('Vijayawada');

  // New Skill form state
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Electrical');
  const [skillYears, setSkillYears] = useState(3);

  const handleAddPow = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProofOfWork({
      title: powTitle,
      description: powDesc,
      category: powCategory,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
      skillsDemonstrated: powSkills.split(',').map((s) => s.trim()),
      clientOrEmployer: powEmployer || 'Self / Direct Client',
      location: powLocation,
      completionDate: new Date().toISOString().split('T')[0],
      isVerified: true,
      verifiedBy: 'Client / Site Supervisor',
      rating: 5,
    });
    setShowAddPowModal(false);
    setPowTitle('');
    setPowDesc('');
    setPowEmployer('');
    setPowSkills('');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    store.addSkill({
      name: skillName,
      category: skillCategory,
      level: 4,
      yearsExperience: skillYears,
      isVerified: false,
    });
    setShowAddSkillModal(false);
    setSkillName('');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header Profile Identity Banner */}
      <div className="kc-card p-5 sm:p-6 bg-white border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-navy">{worker.fullName}</h1>
                <span className="badge badge-verified text-[10px] py-0">
                  <ShieldCheck className="w-3 h-3" /> Biometric eKYC Verified
                </span>
                <span className="badge badge-primary text-[10px] py-0">
                  Available Now
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-primary">{worker.primaryTrade}</p>
              <p className="text-xs text-muted max-w-xl leading-relaxed">
                {worker.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {worker.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {worker.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {worker.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Score Highlight Box */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-right self-stretch sm:self-auto flex sm:flex-col items-center sm:items-end justify-between">
            <div>
              <div className="text-2xl font-black text-emerald-700 leading-none">
                {worker.trustScore.total}
              </div>
              <span className="text-[9px] uppercase font-bold text-emerald-900 tracking-wider">
                Workforce Trust Score
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">
              Top 3% Certified in AP
            </span>
          </div>
        </div>

        {/* Verification Badges Strip */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
          <span className="badge badge-verified text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> NCVT Trade Certificate (NTC)
          </span>
          <span className="badge badge-verified text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> CEIG Wireman (A-Grade)
          </span>
          <span className="badge badge-verified text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Green Jobs Council (SCGJ)
          </span>
          <span className="badge badge-primary text-[10px]">
            <Briefcase className="w-3 h-3" /> 5 Years Verified Plant Experience
          </span>
        </div>
      </div>

      {/* Trust Score 100-Point Breakdown Accordion */}
      <TrustScoreWidget scoreData={worker.trustScore} />

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-4">
        <button
          onClick={() => setActiveTab('proof')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'proof'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Proof-of-Work ({worker.proofOfWork.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'skills'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" /> Verified Skills ({worker.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('certs')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'certs'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Government Certifications ({worker.certifications.length})
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'experience'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Plant Experience ({worker.experience.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Star className="w-3.5 h-3.5" /> Supervisor Reviews ({worker.reviews.length})
        </button>
      </div>

      {/* Tab 1: PROOF OF WORK PORTFOLIO */}
      {activeTab === 'proof' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy">Authentic Photo Proof of Work</h3>
              <p className="text-[11px] text-muted">
                "Don't just tell employers what you can do. Show verified proof of what you can do."
              </p>
            </div>
            <button
              onClick={() => setShowAddPowModal(true)}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Work Proof
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worker.proofOfWork.map((pow) => (
              <div key={pow.id} className="kc-card overflow-hidden bg-white border">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={pow.images[0]}
                    alt={pow.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Plant Verified ✓
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-navy-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded">
                    {pow.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-navy">{pow.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pow.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {pow.skillsDemonstrated.map((s, i) => (
                      <span key={i} className="badge badge-primary text-[9px]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t flex items-center justify-between text-[11px] text-muted">
                    <span>Client: <strong>{pow.clientOrEmployer}</strong></span>
                    <span>Completed: <strong>{pow.completionDate}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: VERIFIED SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">Trade Competencies & Assessment Results</h3>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {worker.skills.map((skill) => (
              <div key={skill.id} className="kc-card p-3.5 bg-white border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-navy">{skill.name}</h4>
                    {skill.isVerified ? (
                      <span className="badge badge-verified text-[9px]">Verified ✓</span>
                    ) : (
                      <span className="badge badge-pending text-[9px]">Pending Test</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">
                    {skill.yearsExperience} Years Exp • {skill.verificationSource || 'Self-declared'}
                  </p>
                </div>
                <div className="flex items-center text-amber-500 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < skill.level ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: CERTIFICATIONS */}
      {activeTab === 'certs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {worker.certifications.map((cert) => (
            <div key={cert.id} className="kc-card p-4 bg-white border space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="badge badge-verified text-[9px] mb-1">
                    ✓ Verified via NCVT/CEIG Registry
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-navy">{cert.title}</h4>
                  <p className="text-[11px] text-muted mt-0.5">{cert.issuingBody}</p>
                </div>
                <Award className="w-7 h-7 text-primary flex-shrink-0" />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-0.5 font-mono text-slate-700">
                <div>ID: <strong>{cert.credentialId}</strong></div>
                <div className="text-[10px] text-muted">Issued: {cert.issueDate}</div>
              </div>

              <button
                onClick={() => window.open(cert.documentUrl, '_blank')}
                className="btn btn-secondary btn-sm w-full text-[11px] flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> View Official Certificate Copy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="space-y-3">
          {worker.experience.map((exp) => (
            <div key={exp.id} className="kc-card p-4 bg-white border space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-navy">{exp.jobTitle}</h4>
                    {exp.isEmployerVerified && (
                      <span className="badge badge-verified text-[9px]">Employer Confirmed ✓</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-primary">{exp.companyName} • {exp.location}</p>
                  <p className="text-[10px] text-muted">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {exp.skillsUsed.map((s, i) => (
                  <span key={i} className="badge badge-neutral text-[9px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {worker.reviews.map((rev) => (
            <div key={rev.id} className="kc-card p-4 bg-white border space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-navy">{rev.reviewerName}</h4>
                  <p className="text-[10px] text-muted">{rev.reviewerCompany}</p>
                </div>
                <div className="flex items-center text-amber-500 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="ml-1 font-bold text-navy text-xs">{rev.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
              <div className="text-[10px] text-muted">{rev.date} • Verified Plant Contract</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Proof-of-Work Modal */}
      {showAddPowModal && (
        <div className="modal-overlay" onClick={() => setShowAddPowModal(false)}>
          <div className="modal-content p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-navy mb-1">Add Proof of Work Project</h3>
            <p className="text-[11px] text-muted mb-3">
              Upload photos of machinery or electrical panels you installed. Adds +2 points to your Trust Score upon verification.
            </p>

            <form onSubmit={handleAddPow} className="space-y-2.5">
              <div className="form-group">
                <label className="form-label text-xs">Project / Work Title</label>
                <input
                  type="text"
                  required
                  value={powTitle}
                  onChange={(e) => setPowTitle(e.target.value)}
                  placeholder="e.g. 500kVA Transformer Commissioning"
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Description of Work Executed</label>
                <textarea
                  required
                  rows={2}
                  value={powDesc}
                  onChange={(e) => setPowDesc(e.target.value)}
                  placeholder="Explain the technical scope, tools used..."
                  className="form-textarea text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="form-group">
                  <label className="form-label text-xs">Client / Plant Name</label>
                  <input
                    type="text"
                    value={powEmployer}
                    onChange={(e) => setPowEmployer(e.target.value)}
                    placeholder="e.g. ABC Industries"
                    className="form-input text-xs"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Location</label>
                  <input
                    type="text"
                    value={powLocation}
                    onChange={(e) => setPowLocation(e.target.value)}
                    placeholder="e.g. Vijayawada"
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Skills Demonstrated (comma separated)</label>
                <input
                  type="text"
                  value={powSkills}
                  onChange={(e) => setPowSkills(e.target.value)}
                  placeholder="e.g. HT Panel, Cable Splicing, Earth Testing"
                  className="form-input text-xs"
                />
              </div>

              <div className="p-2.5 border-2 border-dashed rounded-lg text-center bg-slate-50">
                <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-primary">Upload Plant Photos</span>
                <p className="text-[9px] text-muted">JPG, PNG up to 10MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPowModal(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-xs font-bold">
                  Submit Work Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="modal-overlay" onClick={() => setShowAddSkillModal(false)}>
          <div className="modal-content p-5 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-navy mb-1">Add Trade Skill</h3>
            <p className="text-[11px] text-muted mb-3">Declare new capabilities to unlock more matching jobs.</p>

            <form onSubmit={handleAddSkill} className="space-y-2.5">
              <div className="form-group">
                <label className="form-label text-xs">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. PLC Ladder Logic"
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={skillYears}
                  onChange={(e) => setSkillYears(Number(e.target.value))}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-xs font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
