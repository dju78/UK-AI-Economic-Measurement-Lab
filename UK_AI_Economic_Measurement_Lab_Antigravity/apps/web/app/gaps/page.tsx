'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Database,
  Sliders,
  Cpu,
  Clock,
  ExternalLink,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { ProvenanceMeta } from '@packages/schemas';

interface MeasurementGap {
  id: string;
  number: number;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  onsProblemDescription: string;
  currentObservableEvidence: string;
  whatRemainsUnmeasured: string;
  proposedEmpiricalTests: string;
  onsRoadmapMilestone: string;
}

const MEASUREMENT_GAPS: MeasurementGap[] = [
  {
    id: 'GAP-01',
    number: 1,
    title: 'Disaggregating Broad CPA Product Groups',
    severity: 'Critical',
    onsProblemDescription: 'Broad CPA categories (such as CPA 62.0 for computer programming or CPA 26.2 for computer manufacturing) contain both AI and conventional non-AI products. National Accounts currently cannot isolate the AI component directly.',
    currentObservableEvidence: 'Published broad Supply & Use table totals (£101.8bn in CPA J62, £21.0bn in CPA C262).',
    whatRemainsUnmeasured: 'The precise monetary ratio ($s_{AI}$) of AI software/goods to non-AI software/goods across all 23 relevant CPA groups.',
    proposedEmpiricalTests: 'Proportional allocation calibrated against audited corporate turnover breakdowns and specialized tech survey modules.',
    onsRoadmapMilestone: 'Q1 2027: Methodology options paper; Q2–Q4 2027: Test disaggregation'
  },
  {
    id: 'GAP-02',
    number: 2,
    title: 'Embedded AI and Blurred Technology Boundaries',
    severity: 'High',
    onsProblemDescription: 'AI capabilities are increasingly bundled into standard consumer goods, avionics, motor vehicles, medical scanners, and generic SaaS platforms without separate itemized pricing.',
    currentObservableEvidence: 'Broad electronics (CPA C26.4/C26.5) and aerospace (CPA C30.3) published output.',
    whatRemainsUnmeasured: 'The value added by the AI algorithmic sub-component versus physical manufacturing chassis.',
    proposedEmpiricalTests: 'Hedonic regression modeling decomposing price premiums of AI-enabled versus non-AI baseline products.',
    onsRoadmapMilestone: 'Q2 2027: Conceptual decomposition trials'
  },
  {
    id: 'GAP-03',
    number: 3,
    title: 'AI Business Population Identification & Validation',
    severity: 'Critical',
    onsProblemDescription: 'UK SIC does not contain an AI-specific division. Experimental company lists (such as the 5,860 DSIT cohort) require ongoing validation against false positives and marketing buzzwords.',
    currentObservableEvidence: 'Curated 60-company research benchmark; DSIT AI sector study population estimates.',
    whatRemainsUnmeasured: 'A dynamic, verifiable register of active UK AI producers distinguishing core developers from superficial adopters.',
    proposedEmpiricalTests: 'Supervised multi-label text classification with mandatory human expert review and Companies House filing validation.',
    onsRoadmapMilestone: 'Q4 2026: Evidence and data landscape review'
  },
  {
    id: 'GAP-04',
    number: 4,
    title: 'Separating AI Revenue from Non-AI Revenue in Diversified Firms',
    severity: 'High',
    onsProblemDescription: 'Large diversified multinationals (e.g. global tech conglomerates, big-4 consultancies) generate substantial AI turnover alongside legacy consulting, advertising, and hardware sales.',
    currentObservableEvidence: 'Total firm-level turnover and consolidated group balance sheets.',
    whatRemainsUnmeasured: 'Granular segment-level AI revenue attribution ratios ($r_{AI}$) for diversified corporations.',
    proposedEmpiricalTests: 'Hierarchical Bayesian estimation separating firm-level AI probability ($p_{AI}$) from revenue attribution ratio ($r_{AI}$).',
    onsRoadmapMilestone: 'Q1 2027: Firm-level disaggregation methodology'
  },
  {
    id: 'GAP-05',
    number: 5,
    title: 'Exploiting Alternative & Non-Survey Data Sources',
    severity: 'Medium',
    onsProblemDescription: 'Traditional annual surveys suffer from 12–24 month reporting lags. Non-survey sources (web scraping, job vacancies, API token telemetry, code repos) lack standard National Accounts sampling frames.',
    currentObservableEvidence: 'Lightcast AI job postings indices; GitHub repository activity; public LLM token benchmarks.',
    whatRemainsUnmeasured: 'Representative sampling weights and price deflators for non-survey alternative metrics.',
    proposedEmpiricalTests: 'Benchmarking alternative web metrics against audited Annual Business Survey (ABS) returns.',
    onsRoadmapMilestone: 'Q4 2026 – Q1 2027: Data landscape scoping'
  },
  {
    id: 'GAP-06',
    number: 6,
    title: 'Producing Timely, Decision-Useful Quarterly Estimates',
    severity: 'Medium',
    onsProblemDescription: 'AI technology shifts rapidly across quarterly cycles, whereas benchmark Supply and Use tables operate on annual structural releases with substantial revisions.',
    currentObservableEvidence: 'Monthly Index of Production/Services; Quarterly BICS survey waves.',
    whatRemainsUnmeasured: 'High-frequency quarterly nowcasting models for AI domestic output and capital formation.',
    proposedEmpiricalTests: 'Dynamic factor models and mixed-frequency nowcasting linking high-frequency cloud compute and trade flows to annual SUTs.',
    onsRoadmapMilestone: 'Q1 2028: Experimental satellite account readiness'
  }
];

export default function GapsPage() {
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const gapsProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'ONS Measuring artificial intelligence in the UK economy using a thematic account (S1) §3',
    publisher: 'Office for National Statistics & UK AI Economic Measurement Lab',
    reference_period: '2026-2028 Roadmap',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0',
    statistical_status: 'Published research/context source',
    transformation_version: 'gaps-v1.0.0',
    unit: 'Methodological Research Challenges',
    notes: 'Identifies the six primary statistical gaps preventing direct measurement of AI in official accounts.'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                Research Agenda
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="ONS S1 §3"
                onClick={() => setSelectedMeta(gapsProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-slate-800 stroke-[1.75]" />
              Six Core AI Economic Measurement Challenges
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 self-start">
            Roadmap Horizon: 2026–2028
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          In its September 2026 methodology publication (S1), the Office for National Statistics explicitly outlined six central measurement challenges that prevent AI from being directly observed in official National Accounts.
          This research prototype implements empirical workflows to address each of these challenges.
        </p>
      </div>

      {/* 6 Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MEASUREMENT_GAPS.map((gap) => (
          <div
            key={gap.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {gap.number}
                  </span>
                  <h2 className="font-bold text-base text-slate-900 leading-snug">
                    {gap.title}
                  </h2>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    gap.severity === 'Critical'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : gap.severity === 'High'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {gap.severity}
                </span>
              </div>

              {/* ONS Problem Statement */}
              <div className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">ONS Measurement Problem:</span>
                <p>{gap.onsProblemDescription}</p>
              </div>

              {/* Evidence vs Missing */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Currently Observable Evidence:</span>
                  <span className="text-slate-800">{gap.currentObservableEvidence}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">What Remains Unmeasured:</span>
                  <span className="text-rose-700 font-medium">{gap.whatRemainsUnmeasured}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Proposed Empirical Test / Solution:</span>
                  <span className="text-slate-800">{gap.proposedEmpiricalTests}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">{gap.onsRoadmapMilestone}</span>
              <Link
                href={gap.number <= 2 ? '/disaggregation' : gap.number <= 4 ? '/classifier' : '/methodology'}
                className="text-govuk-blue font-semibold hover:underline flex items-center gap-1"
              >
                Inspect Workflow <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ProvenanceDrawer
        isOpen={Boolean(selectedMeta)}
        onClose={() => setSelectedMeta(null)}
        metadata={selectedMeta}
      />
    </div>
  );
}
