'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { StatCard } from '@/components/ui/StatCard';
import { ProvenanceMeta } from '@packages/schemas';
import { ALL_CPA_PRODUCTS } from '@/lib/data';
import { formatGbpMillions } from '@/lib/utils';

export default function HomePage() {
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  // Compute summary figures from published 2023 SUT data
  const totalBroadSupply2023 = ALL_CPA_PRODUCTS.reduce(
    (acc, p) => acc + (p.time_series['2023']?.total_supply || 0),
    0
  );
  const totalBroadOutput2023 = ALL_CPA_PRODUCTS.reduce(
    (acc, p) => acc + (p.time_series['2023']?.domestic_output || 0),
    0
  );

  const heroProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'ONS Measuring artificial intelligence in the UK economy using a thematic account (S1)',
    publisher: 'Office for National Statistics',
    reference_period: '2020-2023',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0',
    statistical_status: 'Published official-statistics source',
    transformation_version: 'v1.0.0',
    unit: 'GBP Million / Methodological Framework'
  };

  const researchModules = [
    {
      num: '01',
      title: 'AI Production Stack Explorer',
      href: '/stack',
      desc: 'An 8-tier structural map from physical facilities, silicon, and compute hosting up to foundation models and enterprise software. Traces UK economic ownership, residency, and asset boundaries across tiers.',
      action: 'Explore Stack Tiers'
    },
    {
      num: '02',
      title: 'Supply & Use Tables Explorer',
      href: '/supply-use',
      desc: 'Published Supply & Use data across 23 AI-relevant CPA product groups (2020–2023). Decomposes domestic output, imports, intermediate consumption, GFCF, and exports with accessible data tables.',
      action: 'View 23 CPA Groups'
    },
    {
      num: '03',
      title: 'AI/Non-AI Disaggregation Lab',
      href: '/disaggregation',
      desc: 'Interactive testing of Direct, Proportional, Modelled, and Hybrid disaggregation methods. Evaluate sensitivity curves, parameter bounds, and export reproducible scenario packages.',
      action: 'Test Disaggregation Models'
    },
    {
      num: '04',
      title: 'AI Business Classification Lab',
      href: '/classifier',
      desc: 'Multi-label classification of UK business descriptions into 13 ONS Table 3 taxonomy categories. Features rule-based and calibrated TF-IDF baselines, feature explainability, and human review.',
      action: 'Classify & Review Firms'
    },
    {
      num: '05',
      title: 'SNA Decision Engine',
      href: '/sna-decision',
      desc: 'Deterministic decision support on System of National Accounts treatment. Evaluates economic ownership, own-account software assets, GFCF, cloud API intermediate consumption, and residency.',
      action: 'Run Decision Wizard'
    },
    {
      num: '06',
      title: 'Measurement Gaps & Research Agenda',
      href: '/gaps',
      desc: 'Structured register of the 6 core ONS measurement challenges: product disaggregation, embedded AI, business populations, diversified firm revenues, alternative data sources, and quarterly timeliness.',
      action: 'Inspect Research Gaps'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 py-2 sm:py-4">
      {/* Top Welcome & Independence Statement */}
      <section className="bg-white border border-slate-200 rounded-xl p-7 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 tracking-wide uppercase">
                Statistical Research Environment
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="S1 Roadmap"
                onClick={() => setSelectedMeta(heroProvenance)}
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Measuring Artificial Intelligence in the UK Economy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              How can AI activity be identified, classified, and disaggregated from non-AI economic activity so that production,
              investment, trade, and use can be measured transparently within a UK National Accounts and Supply & Use framework?
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/supply-use"
              className="px-4 py-2.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs focus:ring-2 focus:ring-slate-900"
            >
              Explore Supply & Use Data
            </Link>
            <Link
              href="/disaggregation"
              className="px-4 py-2.5 bg-white text-slate-800 border border-slate-300 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs focus:ring-2 focus:ring-slate-900"
            >
              Launch Disaggregation Lab
            </Link>
          </div>
        </div>

        {/* Mandatory Official Guardrail Notice */}
        <div className="pt-2">
          <CaveatBanner type="broad_warning">
            <strong>Mandatory Statistical Safeguard:</strong> The broad CPA product totals shown in this prototype (e.g. £101.8bn in Computer Programming) represent the published aggregate size of entire product groups that <em>contain</em> AI.
            They are <strong>candidate denominators</strong>, not estimates of AI output. Disaggregation into AI and non-AI components requires explicit methodological assumptions and scenario testing.
          </CaveatBanner>
        </div>
      </section>

      {/* Published Context Key Figures */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Published Official Statistics & Research Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Source: ONS S1, S2, S5 & DSIT S8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          <StatCard
            title="AI-Relevant CPA Product Groups"
            value="23"
            unit="Product Groups"
            subtext="Identified in ONS Table 1 across manufacturing, technology, R&D, and services"
            status="Published official-statistics source"
            sourceId="DS01 (S1)"
            onClickProvenance={() => setSelectedMeta(heroProvenance)}
          />

          <StatCard
            title="Total Broad CPA Domestic Output"
            value={formatGbpMillions(totalBroadOutput2023)}
            unit="£m (2023)"
            subtext="Published broad denominator total containing both AI and non-AI production"
            status="Published official-statistics source"
            sourceId="DS01 / S5"
            onClickProvenance={() => setSelectedMeta(heroProvenance)}
          />

          <StatCard
            title="BICS Business AI Adoption"
            value="35.2%"
            unit="10+ Employees"
            subtext="June 2026 ONS survey (up from 12.1% in late 2023). Adoption ≠ GVA"
            status="Published research/context source"
            sourceId="DS02 (S2)"
            trend="+23.1pp since 2023"
            trendPositive={true}
          />

          <StatCard
            title="DSIT AI Sector Population"
            value="5,860"
            unit="Firms (2024)"
            subtext="3,170 dedicated AI firms + 2,690 diversified AI providers benchmark"
            status="Published research/context source"
            sourceId="DS03 (S8)"
          />
        </div>
      </section>

      {/* Core Research Workflow Matrix */}
      <section className="space-y-4">
        <div className="pb-1 border-b border-slate-200/80">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Interactive Research Modules & Workflows
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured tools for exploring National Accounts disaggregation, classification, and boundary rules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {researchModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
                    {module.num}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Module
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-slate-800 transition-colors mb-2.5">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {module.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                <span className="group-hover:text-slate-700">{module.action}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all stroke-[1.75]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ONS Thematic Account Roadmap Tracker */}
      <section className="bg-white border border-slate-200 rounded-xl p-7 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="font-bold text-base text-slate-900">
              ONS AI Thematic Account Roadmap & Research Alignment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracking the official ONS thematic account delivery schedule published in September 2026 (S1)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 self-start">
            Roadmap 2026–2028
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Phase 1 · Q2–Q4 2026
            </div>
            <div className="font-semibold text-sm text-slate-900">Scope & Evidence Gathering</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the AI conceptual stack, identify 23 broad CPA product groups, and map initial business populations with DSIT.
            </p>
            <div className="pt-1 text-xs font-medium text-emerald-700">
              ✓ Published in S1
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-100/80 border border-slate-300 space-y-2">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              Phase 2 · Q1 2027
            </div>
            <div className="font-semibold text-sm text-slate-900">Methodology Options</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluate Direct, Proportional, Modelled, and Hybrid disaggregation options. Explore alternative administrative data.
            </p>
            <div className="pt-1 text-xs font-medium text-slate-900">
              ● Lab Core Focus
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Phase 3 · Q2–Q4 2027
            </div>
            <div className="font-semibold text-sm text-slate-900">Prototype & Test Estimates</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compile test Supply & Use tables, run user consultation, and refine disaggregation shares across industry sectors.
            </p>
            <div className="pt-1 text-xs text-slate-400 font-medium">
              Upcoming ONS Milestone
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Phase 4 · Q1 2028
            </div>
            <div className="font-semibold text-sm text-slate-900">Experimental Account</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target readiness to productionise official experimental AI thematic satellite account within UK National Accounts.
            </p>
            <div className="pt-1 text-xs text-slate-400 font-medium">
              Target Horizon
            </div>
          </div>
        </div>
      </section>

      <ProvenanceDrawer
        isOpen={Boolean(selectedMeta)}
        onClose={() => setSelectedMeta(null)}
        metadata={selectedMeta}
      />
    </div>
  );
}

