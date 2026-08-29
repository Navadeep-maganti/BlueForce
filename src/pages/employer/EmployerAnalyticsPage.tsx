import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  Award,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';

interface EmployerAnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const EmployerAnalyticsPage: React.FC<EmployerAnalyticsPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['analytics', 'employer', 'common', 'navigation']);
  const store = useStore();

  const funnelData = [
    { stage: t('analytics:metrics.totalApplications', 'Applications Received'), count: 248, percent: 100, color: 'bg-blue-600' },
    { stage: t('common:status.verified', 'Skills verified'), count: 184, percent: 74, color: 'bg-indigo-600' },
    { stage: t('employer:stages.shortlisted', 'Shortlisted by Foreman'), count: 42, percent: 17, color: 'bg-cyan-600' },
    { stage: t('employer:stages.interview', 'On-site Trade Test'), count: 18, percent: 7.2, color: 'bg-amber-500' },
    { stage: t('employer:stages.hired', 'Hired & ID Issued'), count: 7, percent: 2.8, color: 'bg-emerald-500' },
  ];

  const skillDemand = [
    { trade: 'Industrial Electrician', demand: 92, supply: 64, gap: 'High Demand' },
    { trade: 'CNC Lathe / Milling', demand: 85, supply: 48, gap: 'Severe Shortage' },
    { trade: 'Solar PV Installer', demand: 78, supply: 70, gap: 'Balanced' },
    { trade: 'TIG/MIG Pipe Welder', demand: 88, supply: 52, gap: 'High Demand' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-navy">
          {t('analytics:title', 'Recruitment & Hiring Analytics')}
        </h1>
        <p className="text-xs text-muted">
          {t('analytics:subtitle', 'Real-time metrics on candidate throughput, time-to-hire, and regional blue-collar skill supply.')}
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kc-card p-5 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">
            {t('analytics:metrics.avgTimeToHire', 'Avg Time to Hire')}
          </span>
          <div className="text-2xl font-black text-navy">4.2 Days</div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 76% faster than agency hiring
          </span>
        </div>

        <div className="kc-card p-5 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">
            {t('employer:analytics.verifiedRatio', 'Verification Pass Rate')}
          </span>
          <div className="text-2xl font-black text-navy">94.8%</div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" /> NCVT / CEIG Verified
          </span>
        </div>

        <div className="kc-card p-5 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">
            {t('employer:interviewsScheduled', 'Interview Show-Up Rate')}
          </span>
          <div className="text-2xl font-black text-navy">91.4%</div>
          <span className="text-[11px] text-primary font-bold mt-1 block">
            +40% vs unverified job portals
          </span>
        </div>

        <div className="kc-card p-5 bg-white border">
          <span className="text-xs font-bold text-muted uppercase block mb-1">
            {t('analytics:metrics.hireConversion', 'Cost Per Plant Hire')}
          </span>
          <div className="text-2xl font-black text-emerald-700">₹0</div>
          <span className="text-[11px] text-muted mt-1 block">Zero middleman commissions</span>
        </div>
      </div>

      {/* Funnel & Skill Demand Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel (7 cols) */}
        <div className="lg:col-span-7 kc-card p-6 bg-white border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy">
              {t('analytics:charts.applicationFunnel', 'Recruitment Conversion Funnel')}
            </h3>
            <span className="badge badge-primary text-[10px]">Autonagar Plant Q1</span>
          </div>

          <div className="space-y-3 pt-2">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.stage}</span>
                  <span className="text-navy font-bold">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted pt-3 border-t">
            High top-of-funnel precision due to Aadhaar verification and standardized trade competency filters.
          </p>
        </div>

        {/* Regional Skill Supply vs Demand (5 cols) */}
        <div className="lg:col-span-5 kc-card p-6 bg-white border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy">
              {t('analytics:charts.demandByTrade', 'Regional Trade Supply Index')}
            </h3>
            <span className="badge badge-verified text-[10px]">AP & Telangana</span>
          </div>

          <div className="space-y-3 pt-2">
            {skillDemand.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-navy">
                  <span>{item.trade}</span>
                  <span
                    className={`badge text-[10px] ${
                      item.gap === 'Severe Shortage' ? 'badge-rejected' : 'badge-pending'
                    }`}
                  >
                    {item.gap}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span>Demand: <strong>{item.demand}/100</strong></span>
                  <span>•</span>
                  <span>Available: <strong>{item.supply}/100</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
