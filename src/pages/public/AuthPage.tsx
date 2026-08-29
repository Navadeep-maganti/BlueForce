import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Briefcase,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface AuthPageProps {
  onNavigate: (path: string) => void;
  defaultRole?: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, defaultRole = 'worker' }) => {
  const { t } = useTranslation(['auth', 'common', 'navigation']);
  const store = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handle1ClickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoEmail =
      role === 'worker'
        ? 'worker@demo.com'
        : role === 'employer'
        ? 'employer@demo.com'
        : 'admin@demo.com';
    const res = await store.login(demoEmail, 'password123');
    setIsLoading(false);

    if (res.success) {
      if (role === 'worker') onNavigate('/worker/dashboard');
      else if (role === 'employer') onNavigate('/employer/dashboard');
      else onNavigate('/admin/dashboard');
    } else {
      // Fallback to local store demo persona
      store.loginAs(role);
      if (role === 'worker') onNavigate('/worker/dashboard');
      else if (role === 'employer') onNavigate('/employer/dashboard');
      else onNavigate('/admin/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (isRegister) {
      const res = await store.register({
        email: email.trim(),
        password: password,
        role: selectedRole,
        phone: phone,
        full_name: selectedRole === 'worker' ? (name || 'Skilled Technician') : undefined,
        primary_trade: selectedRole === 'worker' ? (trade || 'Industrial Electrician') : undefined,
        company_name: selectedRole === 'employer' ? (name || 'ABC Enterprises') : undefined,
        trade_industry: selectedRole === 'employer' ? (trade || 'Manufacturing') : undefined,
        location: 'Vijayawada, AP',
      });
      setIsLoading(false);

      if (res.success) {
        if (selectedRole === 'worker') onNavigate('/worker/dashboard');
        else if (selectedRole === 'employer') onNavigate('/employer/dashboard');
        else onNavigate('/admin/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } else {
      const res = await store.login(email.trim(), password);
      setIsLoading(false);

      if (res.success && res.user) {
        if (res.user.role === 'worker') onNavigate('/worker/dashboard');
        else if (res.user.role === 'employer') onNavigate('/employer/dashboard');
        else onNavigate('/admin/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Main Authentication Form Card */}
      <div className="kc-card p-6 sm:p-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        {/* Header Branding & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs border border-blue-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
            {isRegister
              ? selectedRole === 'worker'
                ? 'Join as a Skilled Worker'
                : 'Register Enterprise Account'
              : t('auth:signInTitle', 'Sign in to BlueForce')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRegister
              ? selectedRole === 'worker'
                ? 'Get your trade skills verified and find trusted plant jobs'
                : 'Directly hire verified, pre-screened industrial technicians'
              : t('auth:signInSubtitle', 'Access your verified profile, jobs, or candidates')}
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl grid grid-cols-2 gap-1.5 mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('worker');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'worker'
                ? 'bg-white text-primary shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{t('auth:workerRole', 'Technician / Worker')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('employer');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'employer'
                ? 'bg-white text-primary shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('auth:employerRole', 'Employer / Plant')}</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label text-xs font-bold text-slate-700">
                  {selectedRole === 'worker'
                    ? t('auth:fullName', 'Full Name')
                    : t('auth:companyName', 'Company / Plant Name')}
                </label>
                <div className="input-icon-wrapper">
                  <div className="input-icon-left">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      selectedRole === 'worker'
                        ? t('auth:fullNamePlaceholder', 'e.g. Ramesh Kumar')
                        : t('auth:companyNamePlaceholder', 'e.g. ABC Precision Industries Ltd.')
                    }
                    className="form-input has-icon-left text-sm py-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-xs font-bold text-slate-700">
                  {selectedRole === 'worker'
                    ? t('auth:tradeCategory', 'Primary Trade Skill')
                    : t('employer:jobCreation.tradeCategory', 'Industry Sector')}
                </label>
                <div className="input-icon-wrapper">
                  <div className="input-icon-left">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    placeholder={
                      selectedRole === 'worker'
                        ? 'e.g. Industrial Electrician, CNC Operator, Welder'
                        : 'e.g. Heavy Manufacturing, Solar EPC, Machining'
                    }
                    className="form-input has-icon-left text-sm py-2.5 rounded-xl"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label text-xs font-bold text-slate-700">Email Address</label>
            <div className="input-icon-wrapper">
              <div className="input-icon-left">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegister ? 'name@example.com' : `${selectedRole}@demo.com`}
                className="form-input has-icon-left text-sm py-2.5 rounded-xl"
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label text-xs font-bold text-slate-700">{t('auth:phoneNumber', 'Mobile Number')}</label>
              <div className="input-icon-wrapper">
                <div className="input-icon-left">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('auth:phoneNumberPlaceholder', '+91 98765 43210')}
                  className="form-input has-icon-left text-sm py-2.5 rounded-xl"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="flex items-center justify-between">
              <label className="form-label text-xs font-bold text-slate-700">Password</label>
              {!isRegister && (
                <span className="text-[11px] text-primary font-medium cursor-pointer hover:underline">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="input-icon-wrapper">
              <div className="input-icon-left">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input has-icons-both text-sm py-2.5 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-right"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-sm font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isRegister
              ? selectedRole === 'worker'
                ? t('auth:registerBtn', 'Create Free Worker Profile')
                : t('auth:registerBtn', 'Register Employer Account')
              : t('auth:signInBtn', 'Sign In to Workspace')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login vs Register */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>
            {isRegister
              ? t('auth:alreadyHaveAccount', 'Already have an account?')
              : t('auth:dontHaveAccount', 'New to BlueForce?')}
          </span>{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
            }}
            className="text-primary font-bold hover:underline ml-1"
          >
            {isRegister ? t('auth:signInBtn', 'Sign In') : t('auth:registerBtn', 'Create Account')}
          </button>
        </div>
      </div>

      {/* Quick 1-Click Demo Logins Panel (BELOW User Input Fields) */}
      <div className="kc-card p-5 sm:p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-white">Instant 1-Click Demo Evaluation</h3>
          </div>
          <span className="badge text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 font-bold">
            No signup needed
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Quickly test the full platform as a pre-populated verified worker, enterprise employer, or NSDC government verifier:
        </p>

        <div className="space-y-2">
          <button
            onClick={() => handle1ClickLogin('worker')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all text-xs font-semibold group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-white flex items-center justify-center text-base flex-shrink-0">
                👷
              </div>
              <div>
                <div className="text-white font-bold text-xs group-hover:text-cyan-300 transition-colors">
                  Ramesh Kumar (Industrial Electrician)
                </div>
                <div className="text-[11px] text-slate-400">worker@demo.com • 91 Trust Score • 4y Experience</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>

          <button
            onClick={() => handle1ClickLogin('employer')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all text-xs font-semibold group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-white flex items-center justify-center text-base flex-shrink-0">
                🏢
              </div>
              <div>
                <div className="text-white font-bold text-xs group-hover:text-cyan-300 transition-colors">
                  ABC Industries Ltd. (Enterprise Employer)
                </div>
                <div className="text-[11px] text-slate-400">employer@demo.com • 3 Active Jobs • Candidate Pipeline</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>

          <button
            onClick={() => handle1ClickLogin('admin')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all text-xs font-semibold group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-white flex items-center justify-center text-base flex-shrink-0">
                🛡️
              </div>
              <div>
                <div className="text-white font-bold text-xs group-hover:text-cyan-300 transition-colors">
                  Regional Auditor (Verification Center)
                </div>
                <div className="text-[11px] text-slate-400">admin@demo.com • Audit Stream & Verification Queue</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
