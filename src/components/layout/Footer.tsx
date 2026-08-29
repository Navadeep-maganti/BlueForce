import React from 'react';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Footer: React.FC = () => {
  const { t } = useTranslation(['navigation', 'common', 'employer', 'worker']);
  const store = useStore();
  const user = store.currentUser;

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        {/* Brand Column */}
        <div className="app-footer__brand">
          <div className="brand">
            <span className="brand__mark">
              <ShieldCheck size={19} />
            </span>
            <span>
              Kaushal<b>Connect</b>
            </span>
          </div>
          <p>
            {t(
              'navigation:footer.aboutDesc',
              "A modern workforce platform connecting certified blue-collar technicians with verified industrial enterprises across India."
            )}
          </p>
          <span className="footer-proof">
            <BadgeCheck size={15} /> {t('common:badges.proofVerified', 'Identity and skills verification built in')}
          </span>
          <div className="mt-4">
            <LanguageSwitcher variant="footer" />
          </div>
        </div>

        {/* Role-Specific Quick Links */}
        {!user ? (
          <>
            <div>
              <h4>{t('navigation:findWork', 'Explore Platform')}</h4>
              <a href="#/jobs">{t('navigation:jobs', 'Browse Trade Openings')}</a>
              <a href="#/auth?role=worker">{t('navigation:footer.forWorkers', 'Worker Registration')}</a>
              <a href="#/auth?role=employer">{t('navigation:footer.forEmployers', 'Enterprise Sign-up')}</a>
              <a href="#/auth?mode=login">{t('navigation:login', 'Account Sign In')}</a>
            </div>

            <div>
              <h4>{t('common:features.title', 'Key Features')}</h4>
              <a href="#/">{t('navigation:home', 'Platform Overview')}</a>
              <a href="#/jobs">{t('navigation:voiceSearch', 'Voice Assisted Search')}</a>
              <a href="#/auth?role=worker">{t('verification:title', '100-pt Trust Score')}</a>
            </div>
          </>
        ) : user.role === 'worker' ? (
          <>
            <div>
              <h4>{t('navigation:footer.forWorkers', 'Worker Portal')}</h4>
              <a href="#/worker/dashboard">{t('navigation:dashboard', 'My Dashboard')}</a>
              <a href="#/worker/jobs">{t('navigation:jobs', 'Find Trade Jobs')}</a>
              <a href="#/worker/applications">{t('navigation:applications', 'Application Tracking')}</a>
              <a href="#/worker/profile">{t('navigation:profile', 'My Profile & Skills')}</a>
            </div>

            <div>
              <h4>{t('verification:title', 'Credentials & Trust')}</h4>
              <a href="#/worker/profile">{t('verification:biometric', 'Aadhaar eKYC')}</a>
              <a href="#/worker/profile">{t('worker:uploadProof', 'Proof of Work')}</a>
              <a href="#/worker/profile">{t('worker:addCert', 'Trade Certifications')}</a>
            </div>
          </>
        ) : user.role === 'employer' ? (
          <>
            <div>
              <h4>{t('navigation:footer.forEmployers', 'Hiring Portal')}</h4>
              <a href="#/employer/dashboard">{t('navigation:dashboard', 'Employer Dashboard')}</a>
              <a href="#/employer/jobs/new">{t('employer:postNewJob', 'Post a Job Opening')}</a>
              <a href="#/employer/candidates">{t('navigation:candidates', 'Candidate Discovery')}</a>
              <a href="#/employer/pipeline">{t('navigation:pipeline', 'Recruitment Pipeline')}</a>
            </div>

            <div>
              <h4>{t('employer:analytics', 'Enterprise Tools')}</h4>
              <a href="#/employer/analytics">{t('employer:analytics', 'Hiring Analytics')}</a>
              <a href="#/employer/dashboard">{t('employer:companyProfile', 'Company Profile')}</a>
              <a href="#/employer/candidates">{t('employer:verifiedTalent', 'Direct Candidate Shortlisting')}</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4>{t('navigation:verification', 'Admin Controls')}</h4>
              <a href="#/admin/dashboard">{t('navigation:dashboard', 'Admin Overview')}</a>
              <a href="#/admin/dashboard">Document Verification Stream</a>
              <a href="#/admin/dashboard">Dispute Resolution</a>
            </div>

            <div>
              <h4>{t('common:status.verified', 'Audit & Compliance')}</h4>
              <a href="#/admin/dashboard">NCVT & NSDC Registry</a>
              <a href="#/admin/dashboard">Enterprise GSTIN Audits</a>
            </div>
          </>
        )}
      </div>

      <div className="app-footer__bottom">
        <span>
          {t('navigation:footer.copyright', {
            year: new Date().getFullYear(),
            defaultValue: '© 2026 KaushalConnect Workforce Technologies. All rights reserved.',
          })}
        </span>
        <span>{t('navigation:footer.proudlyMadeInIndia', "Proudly built for India's skilled workforce 🇮🇳")}</span>
      </div>
    </footer>
  );
};
