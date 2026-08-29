import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Search, ArrowRight, Volume2 } from 'lucide-react';
import { useI18n } from '../../i18n/context';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { keyword: string; location: string; minSalary: number }) => void;
}

const SAMPLE_VOICE_PROMPTS = [
  {
    text: "I need an electrician job near Vijayawada above 25 thousand.",
    role: "Electrician",
    loc: "Vijayawada",
    sal: 25000,
    lang: "English",
  },
  {
    text: "విజయవాడలో 25 వేలకు పైగా ఇండస్ట్రియల్ ఎలక్ట్రీషియన్ ఉద్యోగం కావాలి.",
    role: "Electrician",
    loc: "Vijayawada",
    sal: 25000,
    lang: "Telugu",
  },
  {
    text: "मुझे हैदराबाद में 28 हजार से ऊपर सीएनसी मशीन ऑपरेटर का काम चाहिए।",
    role: "CNC Machinist",
    loc: "Hyderabad",
    sal: 28000,
    lang: "Hindi",
  },
  {
    text: "Solar panel technician job near Vijayawada airport corridor.",
    role: "Solar",
    loc: "Vijayawada",
    sal: 22000,
    lang: "English",
  },
];

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { t } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedRole, setParsedRole] = useState('');
  const [parsedLocation, setParsedLocation] = useState('');
  const [parsedSalary, setParsedSalary] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setParsedRole('');
      setParsedLocation('');
      setParsedSalary(0);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const parseVoiceText = (text: string) => {
    setIsProcessing(true);
    setTranscript(text);

    setTimeout(() => {
      let role = 'Electrician';
      let loc = 'Vijayawada';
      let sal = 25000;

      const lower = text.toLowerCase();
      if (lower.includes('cnc') || lower.includes('machinist') || lower.includes('మషినిస్ట్') || lower.includes('मशीन')) {
        role = 'CNC';
      } else if (lower.includes('solar') || lower.includes('సోలార్') || lower.includes('सोलर')) {
        role = 'Solar';
      } else if (lower.includes('welder') || lower.includes('వెల్డర్') || lower.includes('वेल्डर')) {
        role = 'Welder';
      } else if (lower.includes('mechanic') || lower.includes('మెకానిక్') || lower.includes('मैकेनिक')) {
        role = 'Mechanic';
      }

      if (lower.includes('hyderabad') || lower.includes('హైదరాబాద్') || lower.includes('हैदराबाद')) {
        loc = 'Hyderabad';
      } else if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('బెంగళూరు')) {
        loc = 'Bengaluru';
      } else if (lower.includes('chennai') || lower.includes('చెన్నై')) {
        loc = 'Chennai';
      } else if (lower.includes('pune') || lower.includes('పుణె')) {
        loc = 'Pune';
      }

      if (lower.includes('28') || lower.includes('28,000') || lower.includes('28 thousand')) {
        sal = 28000;
      } else if (lower.includes('30') || lower.includes('30 thousand')) {
        sal = 30000;
      } else if (lower.includes('22') || lower.includes('22 thousand')) {
        sal = 22000;
      }

      setParsedRole(role);
      setParsedLocation(loc);
      setParsedSalary(sal);
      setIsProcessing(false);
      setIsListening(false);
    }, 600);
  };

  const handleStartRealSpeech = () => {
    // Check Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          parseVoiceText(speechResult);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          parseVoiceText(SAMPLE_VOICE_PROMPTS[0].text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (e) {
        setIsListening(false);
        parseVoiceText(SAMPLE_VOICE_PROMPTS[0].text);
      }
    } else {
      // Browser fallback simulation
      setIsListening(true);
      setTimeout(() => {
        parseVoiceText(SAMPLE_VOICE_PROMPTS[0].text);
      }, 1500);
    }
  };

  const handleConfirmSearch = () => {
    onSearch({
      keyword: parsedRole || 'Electrician',
      location: parsedLocation || 'Vijayawada',
      minSalary: parsedSalary || 20000,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">{t.voiceModal.title}</h3>
              <p className="text-xs text-muted">Supports English, Telugu & Hindi voice commands</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Mic Animation */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <button
            onClick={isListening ? () => setIsListening(false) : handleStartRealSpeech}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-xl scale-110 animate-pulse'
                : 'bg-primary text-white shadow-lg hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="mt-4 text-sm font-semibold text-navy">
            {isListening ? t.voiceModal.listening : t.voiceModal.clickToSpeak}
          </p>
          <p className="text-xs text-muted max-w-xs mt-1">
            {t.voiceModal.samplePrompt}
          </p>
        </div>

        {/* Live Audio Transcript / Extraction Display */}
        {(transcript || isProcessing) && (
          <div className="p-4 bg-slate-50 border rounded-xl mb-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {isProcessing ? t.voiceModal.analyzingVoice : 'AI Speech Extraction'}
            </div>
            <p className="text-sm font-medium text-slate-800 italic">
              "{transcript}"
            </p>

            {parsedRole && !isProcessing && (
              <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">
                  <span className="text-[10px] text-muted block uppercase">Role</span>
                  <span className="font-bold text-navy">{parsedRole}</span>
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="text-[10px] text-muted block uppercase">Location</span>
                  <span className="font-bold text-navy">{parsedLocation}</span>
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="text-[10px] text-muted block uppercase">Min Pay</span>
                  <span className="font-bold text-emerald-700">₹{parsedSalary.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Sample Voice Presets */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-600 mb-2 block">
            {t.voiceModal.orTry}
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {SAMPLE_VOICE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => parseVoiceText(prompt.text)}
                className="w-full text-left p-2 rounded-lg border bg-white hover:bg-blue-50/70 hover:border-blue-300 text-xs transition-all flex items-center justify-between"
              >
                <span className="truncate pr-2 font-medium text-slate-700">
                  🎙️ {prompt.text}
                </span>
                <span className="badge badge-neutral text-[10px] whitespace-nowrap">
                  {prompt.lang}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-2 justify-end pt-2 border-t">
          <button onClick={onClose} className="btn btn-secondary text-xs">
            Cancel
          </button>
          <button
            onClick={handleConfirmSearch}
            disabled={!parsedRole}
            className={`btn btn-primary text-xs ${!parsedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Search className="w-3.5 h-3.5" />
            {t.voiceModal.searchResultBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
