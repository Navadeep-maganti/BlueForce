import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enAuth from './locales/en/auth.json';
import enWorker from './locales/en/worker.json';
import enEmployer from './locales/en/employer.json';
import enJobs from './locales/en/jobs.json';
import enApplications from './locales/en/applications.json';
import enVerification from './locales/en/verification.json';
import enAnalytics from './locales/en/analytics.json';
import enErrors from './locales/en/errors.json';

// Hindi translations
import hiCommon from './locales/hi/common.json';
import hiNavigation from './locales/hi/navigation.json';
import hiAuth from './locales/hi/auth.json';
import hiWorker from './locales/hi/worker.json';
import hiEmployer from './locales/hi/employer.json';
import hiJobs from './locales/hi/jobs.json';
import hiApplications from './locales/hi/applications.json';
import hiVerification from './locales/hi/verification.json';
import hiAnalytics from './locales/hi/analytics.json';
import hiErrors from './locales/hi/errors.json';

// Telugu translations
import teCommon from './locales/te/common.json';
import teNavigation from './locales/te/navigation.json';
import teAuth from './locales/te/auth.json';
import teWorker from './locales/te/worker.json';
import teEmployer from './locales/te/employer.json';
import teJobs from './locales/te/jobs.json';
import teApplications from './locales/te/applications.json';
import teVerification from './locales/te/verification.json';
import teAnalytics from './locales/te/analytics.json';
import teErrors from './locales/te/errors.json';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  regionHint: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    regionHint: 'Pan-India & Global',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    regionHint: 'North & Central India',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    regionHint: 'Andhra Pradesh & Telangana',
  },
];

export const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    worker: enWorker,
    employer: enEmployer,
    jobs: enJobs,
    applications: enApplications,
    verification: enVerification,
    analytics: enAnalytics,
    errors: enErrors,
  },
  hi: {
    common: hiCommon,
    navigation: hiNavigation,
    auth: hiAuth,
    worker: hiWorker,
    employer: hiEmployer,
    jobs: hiJobs,
    applications: hiApplications,
    verification: hiVerification,
    analytics: hiAnalytics,
    errors: hiErrors,
  },
  te: {
    common: teCommon,
    navigation: teNavigation,
    auth: teAuth,
    worker: teWorker,
    employer: teEmployer,
    jobs: teJobs,
    applications: teApplications,
    verification: teVerification,
    analytics: teAnalytics,
    errors: teErrors,
  },
} as const;

// Get initial language from localStorage or detector
const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('kaushal_lang') as LanguageCode) : null;
const initialLang = savedLang && ['en', 'hi', 'te'].includes(savedLang) ? savedLang : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'auth',
      'worker',
      'employer',
      'jobs',
      'applications',
      'verification',
      'analytics',
      'errors',
    ],
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'kaushal_lang',
      caches: ['localStorage'],
    },
  });

// Synchronize document language and direction
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language || 'en';
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kaushal_lang', lng);
    }
  });
}

export default i18n;
