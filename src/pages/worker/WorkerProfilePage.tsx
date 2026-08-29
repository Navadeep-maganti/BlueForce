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
  Camera,
  Layers,
  Edit3,
  Trash2,
  X,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { TrustScoreWidget } from '../../components/trust/TrustScoreWidget';
import { EmptyState } from '../../components/ui/EmptyState';
import { DigiLockerModal } from '../../components/verification/DigiLockerModal';

interface WorkerProfilePageProps {
  onNavigate: (path: string) => void;
}

export const WorkerProfilePage: React.FC<WorkerProfilePageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['worker', 'verification', 'common', 'navigation']);
  const store = useStore();
  const worker = store.workerProfile;

  const [activeTab, setActiveTab] = useState<'proof' | 'skills' | 'certs' | 'experience' | 'reviews'>('proof');

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddPowModal, setShowAddPowModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(worker.fullName);
  const [editTrade, setEditTrade] = useState(worker.primaryTrade);
  const [editTagline, setEditTagline] = useState(worker.tagline);
  const [editBio, setEditBio] = useState(worker.bio);
  const [editLocation, setEditLocation] = useState(worker.location);
  const [editPhone, setEditPhone] = useState(worker.phone);
  const [editSalaryMin, setEditSalaryMin] = useState(worker.expectedSalaryMonthly.min);
  const [editAvailability, setEditAvailability] = useState(worker.availability);

  // Proof of Work form state
  const [powTitle, setPowTitle] = useState('');
  const [powDesc, setPowDesc] = useState('');
  const [powCategory, setPowCategory] = useState('Industrial Electrical');
  const [powEmployer, setPowEmployer] = useState('');
  const [powSkills, setPowSkills] = useState('');
  const [powLocation, setPowLocation] = useState('Vijayawada');

  // Skill form state
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Electrical');
  const [skillYears, setSkillYears] = useState(3);

  // Certification form state
  const [certTitle, setCertTitle] = useState('');
  const [certBody, setCertBody] = useState('National Skill Development Corporation (NSDC)');
  const [certId, setCertId] = useState('');
  const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);

  // Experience form state
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('Vijayawada');
  const [expStart, setExpStart] = useState('2022');
  const [expEnd, setExpEnd] = useState('Present');
  const [expDesc, setExpDesc] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateWorkerProfile({
      fullName: editName,
      primaryTrade: editTrade,
      tagline: editTagline,
      bio: editBio,
      location: editLocation,
      phone: editPhone,
      expectedSalaryMonthly: { min: Number(editSalaryMin), max: Number(editSalaryMin) + 10000 },
      availability: editAvailability as any,
    });
    setShowEditProfileModal(false);
  };

  const handleAddPow = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProofOfWork({
      title: powTitle,
      description: powDesc,
      category: powCategory,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
      skillsDemonstrated: powSkills ? powSkills.split(',').map((s) => s.trim()) : [powCategory],
      clientOrEmployer: powEmployer || 'Self / Direct Client',
      location: powLocation,
      completionDate: new Date().toISOString().split('T')[0],
      isVerified: true,
      verifiedBy: 'Site Supervisor',
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
    if (!skillName.trim()) return;
    store.addSkill({
      name: skillName.trim(),
      category: skillCategory,
      level: 4,
      yearsExperience: skillYears,
      isVerified: false,
    });
    setShowAddSkillModal(false);
    setSkillName('');
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;
    store.addCertification({
      title: certTitle.trim(),
      issuingBody: certBody,
      credentialId: certId || `NSDC-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: certDate,
    });
    setShowAddCertModal(false);
    setCertTitle('');
    setCertId('');
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expCompany.trim()) return;
    store.addExperience({
      jobTitle: expTitle.trim(),
      companyName: expCompany.trim(),
      location: expLocation,
      startDate: expStart,
      endDate: expEnd === 'Present' ? undefined : expEnd,
      isCurrent: expEnd === 'Present',
      description: expDesc || 'Handled core plant maintenance and installation responsibilities.',
      skillsUsed: [worker.primaryTrade],
    });
    setShowAddExpModal(false);
    setExpTitle('');
    setExpCompany('');
    setExpDesc('');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header Profile Identity Banner */}
      <div className="kc-card p-5 sm:p-6 bg-white border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-primary/20 flex-shrink-0"
                style={{ width: '64px', height: '64px', minWidth: '64px', maxWidth: '64px', objectFit: 'cover' }}
              />
              {store.currentUser?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-navy">{worker.fullName}</h1>
                {store.currentUser?.isVerified ? (
                  <span className="badge badge-verified text-[10px] py-0">
                    <ShieldCheck className="w-3 h-3" /> {t('common:status.verified', 'Biometric eKYC Verified')}
                  </span>
                ) : (
                  <span className="badge badge-neutral text-[10px] py-0">
                    Self Registered Profile
                  </span>
                )}
                <span className="badge badge-primary text-[10px] py-0">
                  {worker.availability === 'available_now' ? t('worker:immediateJoining', 'Available Now') : 'Employed / Open'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-primary">{worker.primaryTrade}</p>
              <p className="text-xs text-muted max-w-xl leading-relaxed">
                {worker.tagline || 'Verified technician available for industrial placement.'}
              </p>
              {worker.bio && (
                <p className="text-xs text-slate-700 max-w-2xl pt-1 italic">
                  “{worker.bio}”
                </p>
              )}
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
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  Expected: ₹{worker.expectedSalaryMonthly.min.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Quick Score Highlight Box & Edit Button */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-right self-stretch sm:self-auto flex sm:flex-col items-center sm:items-end justify-between">
              <div>
                <div className="text-2xl font-black text-emerald-700 leading-none">
                  {worker.trustScore.total}
                </div>
                <span className="text-[9px] uppercase font-bold text-emerald-900 tracking-wider">
                  {t('worker:trustScoreTitle', 'Workforce Trust Score')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                Profile Strength: {worker.profileStrengthPercent}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowDigiLockerModal(true)}
                className="btn btn-primary btn-sm text-xs flex items-center justify-center gap-1.5 font-bold shadow-xs py-2 px-3.5"
              >
                <Lock className="w-3.5 h-3.5" />
                {store.currentUser?.isVerified ? 'DigiLocker Verified' : 'Verify with DigiLocker'}
              </button>

              <button
                onClick={() => {
                  setEditName(worker.fullName);
                  setEditTrade(worker.primaryTrade);
                  setEditTagline(worker.tagline);
                  setEditBio(worker.bio);
                  setEditLocation(worker.location);
                  setEditPhone(worker.phone);
                  setEditSalaryMin(worker.expectedSalaryMonthly.min);
                  setEditAvailability(worker.availability);
                  setShowEditProfileModal(true);
                }}
                className="btn btn-secondary btn-sm text-xs flex items-center justify-center gap-1 font-bold py-2 px-3.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Details
              </button>
            </div>
          </div>
        </div>

        {/* Verification Badges Strip */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
          {worker.certifications.length > 0 ? (
            worker.certifications.map((c, i) => (
              <span key={i} className="badge badge-verified text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> {c.title}
              </span>
            ))
          ) : (
            <span className="badge badge-neutral text-[10px]">
              No trade certifications uploaded yet. Upload below to boost trust score.
            </span>
          )}
          {worker.experience.length > 0 && (
            <span className="badge badge-primary text-[10px]">
              <Briefcase className="w-3 h-3" /> {worker.experience.length} Verified Experience Entries
            </span>
          )}
        </div>
      </div>

      {/* DigiLocker Official Verification Card */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/60 border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg font-bold">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-navy">
                DigiLocker Government eKYC & Document Authentication
              </h3>
              {store.currentUser?.isVerified ? (
                <span className="badge badge-verified text-[10px] py-0 font-bold">
                  ✓ Active & Verified
                </span>
              ) : (
                <span className="badge text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold py-0">
                  +20 Pts Available
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
              {store.currentUser?.isVerified
                ? `Authenticated with UIDAI Aadhaar (${worker.aadhaarMasked || 'XXXX-XXXX-8921'}). Government trade diplomas are securely linked to your profile.`
                : 'Fetch your authentic Aadhaar identity card and NCVT/ITI National Trade Certificates directly from DigiLocker without manual paperwork.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDigiLockerModal(true)}
          className={`btn btn-sm text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 flex-shrink-0 ${
            store.currentUser?.isVerified
              ? 'btn-secondary text-slate-700'
              : 'btn-primary shadow-xs'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          {store.currentUser?.isVerified ? 'View DigiLocker Credentials' : 'Verify with DigiLocker'}
        </button>
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
          <Camera className="w-3.5 h-3.5" /> {t('worker:tabs.workProof', 'Proof-of-Work')} ({worker.proofOfWork.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'skills'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" /> {t('worker:tabs.skills', 'Verified Skills')} ({worker.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('certs')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'certs'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> {t('worker:tabs.certifications', 'Government Certifications')} ({worker.certifications.length})
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'experience'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> {t('worker:tabs.experience', 'Work History')} ({worker.experience.length})
        </button>
      </div>

      {/* Tab 1: Proof of Work Gallery */}
      {activeTab === 'proof' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-navy">{t('worker:workProof.title', 'Real-World Proof of Work')}</h2>
              <p className="text-[11px] text-muted">
                {t('worker:workProof.subtitle', 'Site photos, switchgear setups, panel wiring, and field commission records')}
              </p>
            </div>
            <button
              onClick={() => setShowAddPowModal(true)}
              className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> {t('worker:workProof.uploadBtn', 'Upload Proof')}
            </button>
          </div>

          {worker.proofOfWork.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="No proof-of-work photos yet"
              description="Upload photos of equipment, panel installations, or site commissioning to show employers your hands-on craftsmanship."
              actionLabel="Upload First Proof of Work"
              onAction={() => setShowAddPowModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {worker.proofOfWork.map((item) => (
                <div key={item.id} className="kc-card bg-white border overflow-hidden flex flex-col justify-between">
                  <div>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-44 object-cover border-b"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="badge badge-primary text-[9px] uppercase font-bold">
                          {item.category}
                        </span>
                        <button
                          onClick={() => store.removeProofOfWork(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete Proof of Work"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-navy">{item.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t mt-2 flex items-center justify-between text-[11px] text-muted">
                    <span>{item.clientOrEmployer}</span>
                    <span>{item.completionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Verified Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-navy">{t('worker:tabs.skills', 'Technical Skill Competencies')}</h2>
              <p className="text-[11px] text-muted">
                {t('verification:factors.skillsDesc', 'Standardized trade skill test results and verified equipment experience')}
              </p>
            </div>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> {t('common:actions.upload', 'Add Skill')}
            </button>
          </div>

          {worker.skills.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No technical skills added"
              description="Add the machinery, trade tools, and technical proficiencies you have expertise in."
              actionLabel="Add Your Trade Skill"
              onAction={() => setShowAddSkillModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {worker.skills.map((s) => (
                <div key={s.id} className="kc-card p-4 bg-white border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs text-navy">{s.name}</h3>
                      {s.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-muted">
                      {s.yearsExperience} {t('worker:experience', 'yrs exp')} • {s.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-verified text-[10px]">
                      {s.level}/5 {s.isVerified ? 'Verified' : 'Claimed'}
                    </span>
                    <button
                      onClick={() => store.removeSkill(s.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Government Certifications */}
      {activeTab === 'certs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-navy">{t('worker:certifications.title', 'Government Trade Certifications')}</h2>
              <p className="text-[11px] text-muted">
                NSDC, NCVT, State Board of Technical Education, and CEIG Wireman Licenses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDigiLockerModal(true)}
                className="btn btn-secondary btn-sm flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 transition-all"
              >
                <Lock className="w-3.5 h-3.5" /> Fetch from DigiLocker
              </button>
              <button
                onClick={() => setShowAddCertModal(true)}
                className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certificate
              </button>
            </div>
          </div>

          {worker.certifications.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No trade credentials uploaded"
              description="Upload your NCVT National Trade Certificate, ITI Diploma, or CEIG Wireman license to earn a verified trust badge."
              actionLabel="Add Trade Certification"
              onAction={() => setShowAddCertModal(true)}
            />
          ) : (
            <div className="space-y-2">
              {worker.certifications.map((c) => (
                <div key={c.id} className="kc-card p-4 bg-white border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-navy">{c.title}</h3>
                      <p className="text-[11px] text-muted">
                        {c.issuingBody} • Credential ID: <strong>{c.credentialId}</strong> • Issued {c.issueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge text-[10px] ${
                        c.verificationStatus === 'verified'
                          ? 'badge-verified'
                          : 'badge-pending'
                      }`}
                    >
                      {c.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending Audit'}
                    </span>
                    <button
                      onClick={() => store.removeCertification(c.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Work History */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-navy">{t('worker:tabs.experience', 'Verified Employer Experience')}</h2>
              <p className="text-[11px] text-muted">
                Track record of plant tenures, industrial sites, and contractor engagements
              </p>
            </div>
            <button
              onClick={() => setShowAddExpModal(true)}
              className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </button>
          </div>

          {worker.experience.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No previous work experience listed"
              description="Add past companies, plant locations, and projects where you worked as a technician."
              actionLabel="Add Work Experience"
              onAction={() => setShowAddExpModal(true)}
            />
          ) : (
            <div className="space-y-2.5">
              {worker.experience.map((exp) => (
                <div key={exp.id} className="kc-card p-4 bg-white border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs sm:text-sm text-navy">{exp.jobTitle}</h3>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary text-[10px]">
                        {exp.isEmployerVerified ? '✓ Verified' : 'Self Claimed'}
                      </span>
                      <button
                        onClick={() => store.removeExperience(exp.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-primary">{exp.companyName} • {exp.location}</p>
                  <p className="text-[11px] text-muted">{exp.startDate} – {exp.endDate || 'Present'}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Edit Profile */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-navy">Edit Technician Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Trade</label>
                  <input
                    type="text"
                    required
                    value={editTrade}
                    onChange={(e) => setEditTrade(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Tagline</label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="e.g. Certified Industrial Electrician with 5 yrs plant wiring experience"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your technical work history, major machines handled, and specialties..."
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Expected Pay (₹/mo)</label>
                  <input
                    type="number"
                    value={editSalaryMin}
                    onChange={(e) => setEditSalaryMin(Number(e.target.value))}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-navy">Add Technical Skill</h3>
              <button onClick={() => setShowAddSkillModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PLC Automation, TIG Pipe Welding, CNC Milling"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trade Category</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="form-select text-xs"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Welding">Welding</option>
                    <option value="Machining">Machining</option>
                    <option value="Solar PV">Solar PV</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={skillYears}
                    onChange={(e) => setSkillYears(Number(e.target.value))}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm">
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Certification */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-navy">Add Government Trade Certification</h3>
              <button onClick={() => setShowAddCertModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate / License Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCVT National Trade Certificate (Electrician)"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Board</label>
                <input
                  type="text"
                  required
                  value={certBody}
                  onChange={(e) => setCertBody(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credential / Roll No.</label>
                  <input
                    type="text"
                    placeholder="e.g. NCVT/AP/2021/4892"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCertModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm">
                  Save & Submit for Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Experience */}
      {showAddExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-navy">Add Past Work History</h3>
              <button onClick={() => setShowAddExpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Plant Wireman, CNC Operator"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Plant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KCP Heavy Engineering Ltd"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Year</label>
                  <input
                    type="text"
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Executed high-voltage transformer wiring and plant shutdown maintenance."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm">
                  Save Work Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Proof of Work */}
      {showAddPowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-navy">Upload Real-World Proof of Work</h3>
              <button onClick={() => setShowAddPowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPow} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job / Commissioning Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 415V Main LT Panel Busbar Assembly"
                  value={powTitle}
                  onChange={(e) => setPowTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trade Category</label>
                <input
                  type="text"
                  required
                  value={powCategory}
                  onChange={(e) => setPowCategory(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client / Employer / Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Autonagar Industrial Workshop"
                  value={powEmployer}
                  onChange={(e) => setPowEmployer(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Craftsmanship Details</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the tools, tolerances, and work steps you performed..."
                  value={powDesc}
                  onChange={(e) => setPowDesc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPowModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm">
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DigiLocker eKYC & Document Authentication Modal */}
      <DigiLockerModal
        isOpen={showDigiLockerModal}
        onClose={() => setShowDigiLockerModal(false)}
      />
    </div>
  );
};
