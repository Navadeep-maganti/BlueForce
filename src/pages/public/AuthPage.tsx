import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Briefcase, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface AuthPageProps {
  onNavigate: (path: string) => void;
  defaultRole?: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, defaultRole = 'worker' }) => {
  const { t } = useI18n();
  const store = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handle1ClickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoEmail = role === 'worker' ? 'worker@demo.com' : (role === 'employer' ? 'employer@demo.com' : 'admin@demo.com');
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
    <div className="max-w-md mx-auto py-6 px-4">
      {/* 1-Click Demo Login Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-navy-950 text-white shadow-lg mb-6 border border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-extrabold text-xs text-white">⚡ Instant 1-Click Demo Logins</h3>
        </div>
        <p className="text-[11px] text-blue-200 mb-3">
          Select any verified persona to instantly sign in with live JWT tokens:
        </p>

        <div className="space-y-1.5">
          <button
            onClick={() => handle1ClickLogin('worker')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-semibold"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-sm">👷</span>
              <div>
                <div className="text-white font-bold text-[11px]">Ramesh Kumar (Worker)</div>
                <div className="text-[10px] text-blue-200">worker@demo.com • Trust Score 91</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
          </button>

          <button
            onClick={() => handle1ClickLogin('employer')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-semibold"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-sm">🏢</span>
              <div>
                <div className="text-white font-bold text-[11px]">ABC Industries (Employer)</div>
                <div className="text-[10px] text-blue-200">employer@demo.com • 4 Active Jobs</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
          </button>

          <button
            onClick={() => handle1ClickLogin('admin')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-semibold"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-sm">🛡️</span>
              <div>
                <div className="text-white font-bold text-[11px]">Platform Admin / Verifier</div>
                <div className="text-[10px] text-blue-200">admin@demo.com • Document Review</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Main Standard Auth Card */}
      <div className="kc-card p-5 bg-white border">
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-navy">
            {isRegister ? 'Create your Account' : 'Sign in to KaushalConnect'}
          </h2>
          <p className="text-[11px] text-muted mt-0.5">
            {isRegister
              ? 'Join India’s trusted blue-collar workforce network'
              : 'Access your verified profile, jobs, or candidates'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setSelectedRole('worker')}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              selectedRole === 'worker' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
            }`}
          >
            👷 Technician / Worker
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('employer')}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              selectedRole === 'employer' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
            }`}
          >
            🏢 Employer / Plant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label text-xs">
                  {selectedRole === 'worker' ? 'Full Name' : 'Company / Plant Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'worker' ? 'e.g. Ramesh Kumar' : 'e.g. ABC Industries Ltd.'}
                    className="form-input text-xs pl-8"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-xs">
                  {selectedRole === 'worker' ? 'Primary Trade' : 'Industry Sector'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    placeholder={selectedRole === 'worker' ? 'e.g. Industrial Electrician' : 'e.g. Manufacturing'}
                    className="form-input text-xs pl-8"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label text-xs">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${selectedRole}@demo.com`}
                className="form-input text-xs pl-8"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label text-xs">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98480 XXXXX"
                  className="form-input text-xs pl-8"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label text-xs">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input text-xs pl-8"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-xs font-bold py-2.5 mt-2 flex items-center justify-center gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isRegister
              ? `Register as ${selectedRole === 'worker' ? 'Technician' : 'Employer'}`
              : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center pt-3 border-t text-xs text-slate-600">
          {isRegister ? 'Already registered?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
            }}
            className="text-primary font-bold hover:underline ml-1"
          >
            {isRegister ? 'Sign In here' : 'Create Free Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
