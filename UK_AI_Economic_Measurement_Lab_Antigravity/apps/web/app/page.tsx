'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Table,
  Sliders,
  Cpu,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Scale,
  Database,
  CheckCircle2,
  FileSpreadsheet,
  Network
} from 'lucide-react';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { StatCard } from '@/components/ui/StatCard';
import { ProvenanceMeta } from '@packages/schemas';
import { ALL_CPA_PRODUCTS, BICS_ADOPTION_DATA, DSIT_BENCHMARK_DATA } from '@/lib/data';
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

  return (
    <div className="space-y-10">
      {/* Top Welcome & Independence Statement */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-govuk-blue text-white tracking-wide">
                UK STATISTICAL RESEARCH PROTOTYPE
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="S1 Roadmap"
                onClick={() => setSelectedMeta(heroProvenance)}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Measuring Artificial Intelligence in the UK Economy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              How can AI activity be identified, classified, and disaggregated from non-AI activity so that production,
              investment, trade, and use can be measured transparently within a UK National Accounts framework?
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/supply-use"
              className="px-4 py-2.5 bg-govuk-blue text-white rounded-lg text-xs font-semibold hover:bg-govuk-darkBlue transition-colors flex items-center gap-2 shadow-xs focus:ring-2 focus:ring-govuk-yellow"
            >
              <Table className="w-4 h-4" /> Explore Supply & Use Data
            </Link>
            <Link
              href="/disaggregation"
              className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs focus:ring-2 focus:ring-govuk-yellow"
            >
              <Sliders className="w-4 h-4" /> Launch Disaggregation Lab
            </Link>
          </div>
        </div>

        {/* Mandatory Official Guardrail Notice */}
        <CaveatBanner type="broad_warning">
          <strong>Mandatory Statistical Safeguard:</strong> The broad CPA product totals shown in this prototype (e.g. £101.8bn in Computer Programming) represent the published aggregate size of entire product groups that <em>contain</em> AI.
          They are <strong>candidate denominators</strong>, not estimates of AI output. Disaggregation into AI and non-AI components requires explicit methodological assumptions and scenario testing.
        </CaveatBanner>
      </div>

      {/* Published Context Key Figures */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-govuk-blue" />
            Published Official Statistics & Research Benchmarks
          </h2>
          <span className="text-xs text-slate-500 font-medium">Source: ONS S1, S2, S5 & DSIT S8</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="AI-Relevant CPA Product Groups"
            value="23"
            unit="Product Groups"
            subtext="Identified in ONS Table 1 across manufacturing, tech, R&D, and services"
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
            title="DSIT AI Sector Companies"
            value="5,860"
            unit="Firms (2024)"
            subtext="3,170 dedicated AI firms + 2,690 diversified AI providers benchmark"
            status="Published research/context source"
            sourceId="DS03 (S8)"
          />
        </div>
      </div>

      {/* Core Research Workflow Matrix */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Interactive Research Modules & Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: AI Production Stack */}
          <Link
            href="/stack"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-govuk-blue flex items-center justify-center mb-4 group-hover:bg-govuk-blue group-hover:text-white transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-govuk-blue transition-colors mb-2">
                1. AI Production Stack Explorer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive 8-layer map from data centres, silicon, and cloud compute up to frontier models and enterprise applications.
                Examines UK residency, trade flows, and production boundaries at each tier.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-govuk-blue">
              <span>Explore Stack Nodes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Supply & Use Explorer */}
          <Link
            href="/supply-use"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                2. Supply & Use Explorer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect published Supply & Use data across all 23 AI-relevant CPA product groups (2020–2023).
                Decompose domestic output, imports, intermediate consumption, GFCF, and exports with accessible data tables.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>View 23 CPA Groups</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Disaggregation Lab */}
          <Link
            href="/disaggregation"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors mb-2">
                3. AI/Non-AI Disaggregation Lab
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experiment with Direct, Proportional, Modelled, and Hybrid disaggregation methods.
                Adjust assumption sliders, inspect sensitivity tornado charts, and download reproducible scenario packages.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Test Disaggregation Models</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: AI Business Classifier */}
          <Link
            href="/classifier"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors mb-2">
                4. AI Business Classification Lab
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-label classification of UK business descriptions into 13 ONS Table 3 categories.
                Features dual rule-based + TF-IDF logistic baselines, feature explainability, and interactive human review.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Classify & Review Firms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 5: SNA Decision Engine */}
          <Link
            href="/sna-decision"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-700 transition-colors mb-2">
                5. SNA Decision Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step decision support on System of National Accounts treatment.
                Evaluates economic ownership, own-account software assets, GFCF, cloud API intermediate consumption, and residency.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>Run Scenario Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 6: Measurement Gaps */}
          <Link
            href="/gaps"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-govuk-blue hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-700 transition-colors mb-2">
                6. Measurement Gaps & Agenda
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured register of the 6 core ONS measurement challenges: product disaggregation, embedded AI, business populations,
                diversified firm revenues, alternative data sources, and quarterly timeliness.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-700">
              <span>Inspect Research Gaps</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* ONS Thematic Account Roadmap Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-govuk-blue" />
              ONS AI Thematic Account Roadmap & Research Alignment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracking the official ONS thematic account delivery schedule published in September 2026 (S1)
            </p>
          </div>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
            Roadmap 2026–2028
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-govuk-blue uppercase tracking-wider mb-1">
              Phase 1 · Q2–Q4 2026
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Scope & Evidence Gathering</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the AI conceptual stack, identify 23 broad CPA product groups, and map initial business populations with DSIT.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published in S1
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              Phase 2 · Q1 2027
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Methodology Options</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluate Direct, Proportional, Modelled, and Hybrid disaggregation options. Explore alternative administrative data.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-govuk-blue">
              <FlaskConical className="w-3.5 h-3.5" /> Lab Core Focus
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Phase 3 · Q2–Q4 2027
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Prototype & Test Estimates</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compile test Supply & Use tables, run user consultation, and refine disaggregation shares across industry sectors.
            </p>
            <div className="mt-3 text-xs text-slate-400 font-medium">
              Upcoming ONS Milestone
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Phase 4 · Q1 2028
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Experimental Account</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target readiness to productionise official experimental AI thematic satellite account within UK National Accounts.
            </p>
            <div className="mt-3 text-xs text-slate-400 font-medium">
              Target Horizon
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
