import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  Search,
  ArrowRight,
  Volume2,
  AlertCircle,
  RotateCcw,
  Edit3,
  CheckCircle2,
  Sparkles,
  Keyboard,
  Globe2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../i18n/context';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { ParsedVoiceQuery } from '../../services/speechRecognitionService';

export interface KaushalVoiceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { keyword: string; location: string; minSalary: number }) => void;
}

const EXAMPLE_QUERIES = {
  english: [
    { text: 'Electrician jobs near Vijayawada', role: 'Electrician', loc: 'Vijayawada', sal: 25000 },
    { text: 'Machine operator jobs above 25000', role: 'Machine Operator', loc: 'Vijayawada', sal: 25000 },
    { text: 'Find welding jobs nearby', role: 'Welder', loc: 'Vijayawada', sal: 22000 },
  ],
  telugu: [
    { text: 'నాకు విజయవాడ దగ్గర ఎలక్ట్రిషియన్ ఉద్యోగాలు కావాలి', role: 'Electrician', loc: 'Vijayawada', sal: 25000 },
    { text: 'విజయవాడలో 25 వేలకు పైగా సీఎన్‌సీ ఆపరేటర్ పని', role: 'CNC Machinist', loc: 'Vijayawada', sal: 25000 },
    { text: 'సోలార్ టెక్నీషియన్ ఉద్యోగం కావాలి', role: 'Solar Technician', loc: 'Vijayawada', sal: 20000 },
  ],
  hindi: [
    { text: 'मुझे विजयवाड़ा के पास इलेक्ट्रिशियन की नौकरी चाहिए', role: 'Electrician', loc: 'Vijayawada', sal: 25000 },
    { text: 'हैदराबाद में 28 हजार से ऊपर सीएनसी ऑपरेटर का काम', role: 'CNC Machinist', loc: 'Hyderabad', sal: 28000 },
    { text: 'वेल्डिंग और फ़िटिंग का काम खोजें', role: 'Welder', loc: 'Vijayawada', sal: 22000 },
  ],
};

export const KaushalVoiceSearch: React.FC<KaushalVoiceSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { t } = useTranslation(['jobs', 'common', 'navigation']);
  const { language, currentLanguageInfo } = useI18n();

  const {
    state,
    transcript,
    interimTranscript,
    parsedQuery,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    reset,
    setTranscriptManual,
  } = useSpeechRecognition({
    language,
  });

  const [manualText, setManualText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Sync manualText when speech recognition produces text
  useEffect(() => {
    if (transcript) {
      setManualText(transcript);
    }
  }, [transcript]);

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setManualText('');
      setIsEditing(false);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const currentExamples =
    language === 'te'
      ? EXAMPLE_QUERIES.telugu
      : language === 'hi'
      ? EXAMPLE_QUERIES.hindi
      : EXAMPLE_QUERIES.english;

  const handleSelectExample = (ex: { text: string; role: string; loc: string; sal: number }) => {
    setManualText(ex.text);
    setTranscriptManual(ex.text);
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setManualText(val);
    setTranscriptManual(val);
    setIsEditing(true);
  };

  const handleExecuteSearch = () => {
    const activeText = manualText.trim() || transcript.trim();
    if (parsedQuery) {
      onSearch({
        keyword: parsedQuery.keyword || activeText || 'Electrician',
        location: parsedQuery.location || 'Vijayawada',
        minSalary: parsedQuery.minSalary || 0,
      });
    } else {
      onSearch({
        keyword: activeText || 'Electrician',
        location: 'Vijayawada',
        minSalary: 0,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kaushal-voice-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 id="kaushal-voice-title" className="text-sm font-black text-navy dark:text-white">
                  BlueForce Voice Assistant
                </h2>
                <span className="badge badge-primary text-[9px] py-0 font-bold">Multilingual</span>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Globe2 size={11} className="text-blue-500" />
                Listening in: <strong>{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label={t('common:actions.close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State Banner / Status Indicator */}
        <div className="flex items-center justify-center">
          {state === 'idle' && (
            <span className="text-xs text-slate-500 font-medium">
              Tap the microphone and speak your job query
            </span>
          )}

          {state === 'requesting_permission' && (
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Requesting microphone access...
            </span>
          )}

          {state === 'listening' && (
            <div className="flex items-center gap-2 text-xs text-red-600 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Listening... speak clearly in {currentLanguageInfo.nativeName}
            </div>
          )}

          {state === 'processing' && (
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Converting speech to text...
            </span>
          )}

          {state === 'recognized' && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Speech Recognized (Editable below)
            </span>
          )}

          {state === 'error' && (
            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Voice recognition issue
            </span>
          )}
        </div>

        {/* Central Microphone Button with Listening Feedback */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <div className="relative flex items-center justify-center">
            {/* Subtle pulse ring while listening */}
            {state === 'listening' && (
              <div className="absolute w-24 h-24 rounded-full bg-red-400/20 animate-ping" />
            )}

            <button
              type="button"
              onClick={state === 'listening' ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg focus:outline-none focus:ring-4 ${
                state === 'listening'
                  ? 'bg-red-600 hover:bg-red-700 text-white ring-red-200 shadow-red-500/30'
                  : state === 'requesting_permission'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white ring-blue-100 shadow-blue-500/20 hover:scale-105'
              }`}
              aria-label={state === 'listening' ? 'Stop listening' : 'Start voice search'}
            >
              {state === 'listening' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {state === 'listening' ? (
              <button
                type="button"
                onClick={stopListening}
                className="btn btn-secondary py-1 px-3 text-[11px] font-bold text-red-600 border-red-200"
              >
                Stop Listening
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                {state === 'recognized' ? 'Tap mic to re-record' : 'Tap to start speaking'}
              </span>
            )}
          </div>
        </div>

        {/* Live Interim Transcript or Error Box */}
        {state === 'listening' && interimTranscript && (
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200 text-xs text-blue-900 dark:text-blue-200 italic text-center">
            “{interimTranscript}”
          </div>
        )}

        {state === 'error' && errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Voice Search Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">{errorMessage}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
              💡 You can use the manual search box or click a sample query below.
            </p>
          </div>
        )}

        {/* Recognized Text Preview & Editable Input */}
        {(manualText || transcript) && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Edit3 size={11} className="text-blue-600" />
                Recognized Query (Edit if needed):
              </span>
              <button
                type="button"
                onClick={() => {
                  setManualText('');
                  reset();
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={2}
              value={manualText}
              onChange={handleManualTextChange}
              placeholder="e.g. Electrician jobs near Vijayawada..."
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-navy dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Extracted Structured Filters Preview */}
            {parsedQuery && (parsedQuery.keyword || parsedQuery.location || parsedQuery.minSalary > 0) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                {parsedQuery.keyword && (
                  <span className="badge badge-primary font-bold">
                    Trade: {parsedQuery.keyword}
                  </span>
                )}
                {parsedQuery.location && (
                  <span className="badge badge-neutral">
                    Location: {parsedQuery.location}
                  </span>
                )}
                {parsedQuery.minSalary > 0 && (
                  <span className="badge badge-success">
                    Min Pay: ₹{parsedQuery.minSalary.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Example Queries in Active Language */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
            {t('jobs:voiceModal.orTry', 'Or try these voice queries:')}
          </span>
          <div className="space-y-1">
            {currentExamples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(ex)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between group"
              >
                <span className="line-clamp-1 group-hover:text-blue-600 font-medium">“{ex.text}”</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Button to Execute Search */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleExecuteSearch}
            disabled={!manualText.trim() && !transcript.trim()}
            className={`btn w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl shadow-md ${
              manualText.trim() || transcript.trim()
                ? 'btn-primary'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border-none shadow-none'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {t('jobs:voiceModal.searchResultBtn', 'Find matching openings')} →
          </button>
        </div>
      </div>
    </div>
  );
};
