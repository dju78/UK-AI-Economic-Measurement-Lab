'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Building,
  Users,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BICS_ADOPTION_DATA } from '@/lib/data';
import { ProvenanceMeta } from '@packages/schemas';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { AccessibleChartWrapper } from '@/components/charts/AccessibleChartWrapper';
import { formatPercent } from '@/lib/utils';

export default function AdoptionPage() {
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const bicsProvenance: ProvenanceMeta = {
    source_id: 'DS02',
    source_title: 'ONS Artificial intelligence in UK businesses: 2023 to 2026 (BICS Survey Waves 95-135)',
    publisher: 'Office for National Statistics',
    reference_period: '2023-2026',
    release_date: '2026-07-20',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0',
    statistical_status: 'Published research/context source',
    transformation_version: 'bics-v1.0.0',
    unit: 'Percentage of UK businesses (%)',
    notes: 'Adoption rates measure the prevalence of business use, NOT the economic monetary value or GVA.'
  };

  const trajectoryData = BICS_ADOPTION_DATA.overall_adoption_trajectory;
  const industryData = BICS_ADOPTION_DATA.adoption_by_industry_2026;
  const sizeData = BICS_ADOPTION_DATA.adoption_by_size_2026;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                Official Survey Context
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="DS02 / S2"
                onClick={() => setSelectedMeta(bicsProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-slate-800 stroke-[1.75]" />
              AI Adoption in UK Businesses (BICS 2023–2026)
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 self-start">
            Latest Survey Wave: June 2026 (35.2%)
          </span>
        </div>

        <CaveatBanner type="broad_warning" title="Central Statistical Principle: Adoption Rate ≠ Economic Contribution">
          Survey adoption rates measure the <strong>prevalence of business use</strong>, not monetary gross value added (GVA) or output.
          A company paying £20/month for an off-the-shelf generative assistant is classified as an "adopter" alongside an enterprise investing £100m in proprietary AI infrastructure.
          Adoption surveys cannot by themselves solve the National Accounts monetary disaggregation problem.
        </CaveatBanner>
      </div>

      {/* Chart 1: Trajectory Over Time */}
      <AccessibleChartWrapper
        title="AI Adoption Trajectory among UK Businesses (2023 Q4 – 2026 Q2)"
        subtitle="Percentage of businesses reporting active AI use in operations (BICS Survey)"
        sourceNote="ONS Artificial intelligence in UK businesses (S2)"
        tableData={trajectoryData}
        tableColumns={[
          { key: 'period', header: 'Survey Wave' },
          { key: 'businesses_10plus', header: 'Businesses with 10+ Employees (%)', format: (v) => `${v}%` },
          { key: 'all_businesses', header: 'All Businesses Estimate (%)', format: (v) => `${v}%` }
        ]}
        exportFileName="ons_bics_ai_adoption_trajectory"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectoryData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis
                unit="%"
                domain={[0, 40]}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="businesses_10plus"
                name="Businesses with 10+ Employees"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#0f172a' }}
              />
              <Line
                type="monotone"
                dataKey="all_businesses"
                name="All Businesses (including Micro)"
                stroke="#64748b"
                strokeWidth={1.75}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#64748b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AccessibleChartWrapper>

      {/* Grid: Industry vs Size Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Industry Breakdown */}
        <div className="lg:col-span-7">
          <AccessibleChartWrapper
            title="AI Adoption by Industry Sector (2026 Q2)"
            subtitle="Percentage of businesses reporting active AI use vs intense production use"
            sourceNote="ONS BICS (S2)"
            tableData={industryData}
            tableColumns={[
              { key: 'industry_section', header: 'SIC Section' },
              { key: 'industry_name', header: 'Industry Sector' },
              { key: 'adoption_rate_pct', header: 'Adoption Rate (%)', format: (v) => `${v}%` },
              { key: 'intense_use_pct', header: 'Intense Use (%)', format: (v) => `${v}%` }
            ]}
            exportFileName="ons_bics_industry_adoption"
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industryData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 120, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" domain={[0, 65]} tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis
                    dataKey="industry_name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#1e293b' }}
                    width={110}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="adoption_rate_pct" name="Adoption Rate (%)" fill="#0f172a" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="intense_use_pct" name="Intense Production Use (%)" fill="#64748b" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AccessibleChartWrapper>
        </div>

        {/* Size Band Breakdown & Pedagogical Box */}
        <div className="lg:col-span-5 space-y-6">
          <AccessibleChartWrapper
            title="AI Adoption by Business Size (2026 Q2)"
            subtitle="Adoption gradient across employment size bands"
            sourceNote="ONS BICS (S2)"
            tableData={sizeData}
            tableColumns={[
              { key: 'size_band', header: 'Size Band' },
              { key: 'adoption_rate_pct', header: 'Adoption (%)', format: (v) => `${v}%` },
              { key: 'main_use', header: 'Primary Use Case' }
            ]}
            exportFileName="ons_bics_size_adoption"
          >
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sizeData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="size_band" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis unit="%" domain={[0, 70]} tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Adoption Rate']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Bar dataKey="adoption_rate_pct" fill="#334155" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AccessibleChartWrapper>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Why We Disaggregate Products Instead of SIC Industries
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard industrial classifications (UK SIC) classify an enterprise based on its principal activity.
              A bank adopting AI remains in <strong>SIC 64</strong>; a car manufacturer using computer vision remains in <strong>SIC 29</strong>.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Therefore, measuring the AI economy requires <strong>product-level disaggregation (CPA)</strong> to separate AI services and goods produced from general industrial output.
            </p>
            <div className="pt-2">
              <Link
                href="/disaggregation"
                className="text-govuk-blue font-semibold text-xs hover:underline flex items-center gap-1"
              >
                Go to Disaggregation Lab <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ProvenanceDrawer
        isOpen={Boolean(selectedMeta)}
        onClose={() => setSelectedMeta(null)}
        metadata={selectedMeta}
      />
    </div>
  );
}
