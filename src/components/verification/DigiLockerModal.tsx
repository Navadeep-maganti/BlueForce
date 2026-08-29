import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck,
  Award,
  ArrowRight,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Building,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type VerificationStep = 'consent' | 'aadhaar_input' | 'otp_verify' | 'success';

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation(['verification', 'common', 'worker']);
  const store = useStore();
  const worker = store.workerProfile;

  const [step, setStep] = useState<VerificationStep>('consent');
  const [fetchAadhaar, setFetchAadhaar] = useState(true);
  const [fetchNcvt, setFetchNcvt] = useState(true);
  const [fetchDl, setFetchDl] = useState(false);
  const [hasConsented, setHasConsented] = useState(true);

  // Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('5489 3218 8921');
  const [otp, setOtp] = useState('');
  const [securityPin, setSecurityPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'otp_verify' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const formatAadhaar = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadhaarNumber(formatAadhaar(e.target.value));
    setErrorMessage(null);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = aadhaarNumber.replace(/\D/g, '');
    if (rawDigits.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp_verify');
      setCountdown(45);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP sent by UIDAI to your mobile.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsProcessing(false);

      // Execute in store
      const res = store.verifyDigiLockerAadhaar({
        aadhaarNumber: aadhaarNumber,
        includeNcvtCert: fetchNcvt,
        tradeName: worker.primaryTrade,
      });

      if (res.success) {
        setStep('success');
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.message);
      }
    }, 1500);
  };

  const handleReset = () => {
    setStep('consent');
    setOtp('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="digilocker-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200/80 shadow-2xl space-y-5 animate-slideUp relative overflow-hidden">
        {/* Subtle Government Tricolor Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-xl font-black text-blue-800">🔒</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="digilocker-title" className="text-base sm:text-lg font-black text-navy tracking-tight">
                  DigiLocker eKYC Verification
                </h2>
                <span className="badge text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5">
                  Govt. of India
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Paperless, instant & tamper-proof credentials fetch
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Consent & Document Selection */}
        {step === 'consent' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100/90 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-navy">Why verify with DigiLocker?</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Directly fetches your authentic government Aadhaar & NCVT trade certifications into your BlueForce Digital Identity to increase your <strong>Trust Score to 90+</strong>.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Credentials to Fetch:
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={fetchAadhaar}
                      onChange={(e) => setFetchAadhaar(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Aadhaar eKYC (UIDAI)</span>
                      <span className="text-[11px] text-slate-500">Official biometric & name validation</span>
                    </div>
                  </div>
                  <span className="badge badge-success text-xs font-bold">+20 Pts</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={fetchNcvt}
                      onChange={(e) => setFetchNcvt(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">NCVT / ITI Trade Certificate</span>
                      <span className="text-[11px] text-slate-500">Government technical qualification</span>
                    </div>
                  </div>
                  <span className="badge badge-success text-xs font-bold">+20 Pts</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all opacity-70">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={fetchDl}
                      onChange={(e) => setFetchDl(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Heavy Driving License (MoRTH)</span>
                      <span className="text-[11px] text-slate-500">Commercial vehicle / crane operator</span>
                    </div>
                  </div>
                  <span className="badge badge-neutral text-xs font-bold">Optional</span>
                </label>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="w-4 h-4 accent-primary mt-0.5 rounded"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I authorize BlueForce to securely retrieve my selected credentials via DigiLocker in compliance with the Information Technology Act, 2000.
              </span>
            </label>

            <button
              type="button"
              disabled={!hasConsented || (!fetchAadhaar && !fetchNcvt)}
              onClick={() => setStep('aadhaar_input')}
              className="btn btn-primary w-full text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              Continue to Secure UIDAI Gateway <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Enter 12-digit Aadhaar Number */}
        {step === 'aadhaar_input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="form-label text-xs font-bold text-slate-700 block mb-1.5">
                Enter 12-Digit Aadhaar Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  placeholder="XXXX XXXX XXXX"
                  className="form-input text-base font-mono font-bold tracking-widest pl-10 py-3 rounded-xl"
                  maxLength={14}
                />
                <ShieldCheck className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Raw Aadhaar numbers are never stored plaintext (UIDAI Masking Compliant).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" /> Registered Mobile:
              </span>
              <strong className="text-navy">{worker.phone}</strong>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep('consent')}
                className="btn btn-secondary flex-1 text-xs py-2.5 rounded-xl font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing || aadhaarNumber.replace(/\D/g, '').length !== 12}
                className="btn btn-primary flex-2 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting to UIDAI...
                  </>
                ) : (
                  <>
                    Get UIDAI OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP & Security PIN Verification */}
        {step === 'otp_verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OTP Sent to Aadhaar-Linked Mobile
              </span>
              <span className="font-mono font-bold text-xs">
                {countdown > 0 ? `${countdown}s` : 'Expired'}
              </span>
            </div>

            <div>
              <label className="form-label text-xs font-bold text-slate-700 block mb-1.5">
                Enter 6-Digit UIDAI OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setErrorMessage(null);
                }}
                placeholder="• • • • • •"
                className="form-input text-center text-lg font-mono font-black tracking-widest py-2.5 rounded-xl"
                maxLength={6}
                autoFocus
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>(Demo OTP: 123456 or any 6 digits)</span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => setCountdown(45)}
                    className="text-primary font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label text-xs font-bold text-slate-700">
                  DigiLocker 6-Digit Security PIN
                </label>
                <span className="text-[10px] text-slate-400">Default: 123456</span>
              </div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="form-input text-center text-base font-mono font-bold py-2.5 rounded-xl pr-10"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep('aadhaar_input')}
                className="btn btn-secondary flex-1 text-xs py-2.5 rounded-xl font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing || otp.length < 6}
                className="btn btn-primary flex-2 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching DigiLocker Data...
                  </>
                ) : (
                  <>
                    Verify & Boost Trust Score <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success Screen */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-black text-navy">DigiLocker Verification Successful!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Your Government Identity and NCVT Trade Diplomas have been authenticated and linked to your digital profile.
              </p>
            </div>

            {/* Verified Digital Identity Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-navy-950 text-white text-left space-y-3 shadow-lg border border-blue-700">
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-cyan-300 tracking-wider">GOVERNMENT OF INDIA</span>
                </div>
                <span className="badge text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold px-2 py-0.5">
                  100% eKYC Verified
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{worker.fullName}</h4>
                  <p className="text-xs text-blue-200 mt-0.5">{worker.primaryTrade}</p>
                  <p className="text-xs font-mono text-cyan-300 font-bold mt-1.5">
                    Aadhaar: {worker.aadhaarMasked || 'XXXX-XXXX-8921'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-300 leading-none">
                    {worker.trustScore.total}
                  </div>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block mt-0.5">
                    Trust Score
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-800/60 flex items-center justify-between text-[11px] text-blue-300">
                <span>Verified via DigiLocker</span>
                <span>Audit ID: DL-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="btn btn-primary w-full text-xs font-bold py-3 rounded-xl shadow-md"
            >
              Continue to Worker Dashboard
            </button>
          </div>
        )}

        {/* Security Assurance Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> 256-bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" /> National Informatics Centre (NIC)
          </span>
        </div>
      </div>
    </div>
  );
};
