/**
 * Speech Recognition Abstraction Service for Kaushal Voice.
 * Wraps the browser Web Speech API with fallback support, language detection,
 * and robust query parsing for trade roles, locations, and salary.
 */

import { LanguageCode } from '../i18n/config';

export type SpeechRecognitionState =
  | 'idle'
  | 'requesting_permission'
  | 'listening'
  | 'processing'
  | 'recognized'
  | 'error';

export type SpeechErrorCode =
  | 'not-supported'
  | 'permission-denied'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'aborted'
  | 'unknown';

export interface ParsedVoiceQuery {
  rawText: string;
  keyword: string;
  location: string;
  minSalary: number;
}

// BCP-47 Language mapping for speech recognition
export const getSpeechLanguageCode = (appLang: LanguageCode): string => {
  switch (appLang) {
    case 'te':
      return 'te-IN';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
};

/**
 * Checks if browser has native speech recognition support
 */
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
};

/**
 * Creates a browser SpeechRecognition instance
 */
export const createSpeechRecognition = (langCode: string) => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = langCode;
  recognition.maxAlternatives = 1;
  return recognition;
};

/**
 * Extract structured trade, city, and salary intent from recognized text in English, Hindi, or Telugu
 */
export const parseVoiceQuery = (transcript: string): ParsedVoiceQuery => {
  const text = transcript.trim();
  const lower = text.toLowerCase();

  let keyword = '';
  let location = '';
  let minSalary = 0;

  // 1. Detect Trade Keyword
  if (
    lower.includes('electrician') ||
    lower.includes('electrical') ||
    lower.includes('wiring') ||
    text.includes('ఎలక్ట్రిషియన్') ||
    text.includes('इलेक्ट्रिशियन') ||
    text.includes('बिजली')
  ) {
    keyword = 'Electrician';
  } else if (
    lower.includes('cnc') ||
    lower.includes('machinist') ||
    lower.includes('lathe') ||
    lower.includes('milling') ||
    text.includes('సీఎన్‌సీ') ||
    text.includes('सीएनसी')
  ) {
    keyword = 'CNC Machinist';
  } else if (
    lower.includes('welder') ||
    lower.includes('welding') ||
    lower.includes('tig') ||
    lower.includes('mig') ||
    text.includes('వెల్డర్') ||
    text.includes('वेल्डर')
  ) {
    keyword = 'Welder';
  } else if (
    lower.includes('solar') ||
    lower.includes('panel') ||
    text.includes('సోలార్') ||
    text.includes('सोलर')
  ) {
    keyword = 'Solar Technician';
  } else if (
    lower.includes('operator') ||
    lower.includes('machine') ||
    text.includes('ఆపరేటర్') ||
    text.includes('ऑपरेटर')
  ) {
    keyword = 'Machine Operator';
  } else if (
    lower.includes('fitter') ||
    lower.includes('mechanical') ||
    text.includes('ఫిట్టర్') ||
    text.includes('फ़िटर')
  ) {
    keyword = 'Mechanical Fitter';
  } else {
    // Default to cleaned query terms
    keyword = text.slice(0, 30);
  }

  // 2. Detect Location / City
  if (
    lower.includes('vijayawada') ||
    lower.includes('autonagar') ||
    text.includes('విజయవాడ') ||
    text.includes('विजयवाड़ा')
  ) {
    location = 'Vijayawada';
  } else if (
    lower.includes('hyderabad') ||
    lower.includes('secunderabad') ||
    text.includes('హైదరాబాద్') ||
    text.includes('हैदराबाद')
  ) {
    location = 'Hyderabad';
  } else if (
    lower.includes('visakhapatnam') ||
    lower.includes('vizag') ||
    text.includes('విశాఖపట్నం') ||
    text.includes('विशाखापट्टनम')
  ) {
    location = 'Visakhapatnam';
  } else if (
    lower.includes('bengaluru') ||
    lower.includes('bangalore') ||
    text.includes('బెంగళూరు') ||
    text.includes('बेंगलुरु')
  ) {
    location = 'Bengaluru';
  } else if (
    lower.includes('chennai') ||
    text.includes('చెన్నై') ||
    text.includes('चेन्नई')
  ) {
    location = 'Chennai';
  } else if (
    lower.includes('pune') ||
    text.includes('పుణే') ||
    text.includes('पुणे')
  ) {
    location = 'Pune';
  }

  // 3. Detect Salary
  const salaryMatch = text.match(/(\d{2,3})[,\s]?000/);
  if (salaryMatch) {
    minSalary = parseInt(salaryMatch[1], 10) * 1000;
  } else if (lower.includes('25') || text.includes('25000') || text.includes('25 వేల') || text.includes('25 हजार')) {
    minSalary = 25000;
  } else if (lower.includes('20') || text.includes('20000') || text.includes('20 వేల') || text.includes('20 हजार')) {
    minSalary = 20000;
  } else if (lower.includes('30') || text.includes('30000') || text.includes('30 వేల') || text.includes('30 हजार')) {
    minSalary = 30000;
  } else if (lower.includes('28') || text.includes('28000') || text.includes('28 వేల') || text.includes('28 हजार')) {
    minSalary = 28000;
  }

  return {
    rawText: text,
    keyword,
    location,
    minSalary,
  };
};
