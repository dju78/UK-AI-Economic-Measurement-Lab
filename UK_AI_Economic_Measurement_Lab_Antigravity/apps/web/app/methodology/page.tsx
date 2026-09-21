'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { ProvenanceMeta } from '@packages/schemas';

interface MethodCardData {
  id: string;
  version: string;
  title: string;
  methodFamily: string;
  formulaLatex: string;
  description: string;
  parameters: Array<{ name: string; symbol: string; description: string; defaultVal: string }>;
  assumptions: string[];
  limitations: string[];
  validationStatus: string;
}

const METHOD_CARDS: MethodCardData[] = [
  {
    id: 'METH-PROP-01',
    version: 'prop-v1.2.0',
    title: 'Proportional Disaggregation of Broad SUT Totals',
    methodFamily: 'Proportional Allocation',
    formulaLatex: '\\text{AI}_{g, t} = \\text{BroadValue}_{g, t} \\times s_{g, t}, \\quad \\text{NonAI}_{g, t} = \\text{BroadValue}_{g, t} \\times (1 - s_{g, t})',
    description: 'Applies an evidence-based or scenario-tested AI share ($s_g \\in [0, 1]$) to a published broad CPA product total to separate AI output from non-AI baseline output.',
    parameters: [
      { name: 'Broad Value', symbol: 'BroadValue', description: 'Published ONS Supply & Use total for product group g in year t (£m)', defaultVal: 'Published SUT' },
      { name: 'Base AI Share', symbol: 's_base', description: 'Central baseline AI share assumption based on survey / industry benchmarking', defaultVal: '16.5% (CPA J62)' },
      { name: 'Low Bound Share', symbol: 's_low', description: 'Conservative lower bound AI share parameter', defaultVal: '9.0% (CPA J62)' },
      { name: 'High Bound Share', symbol: 's_high', description: 'Upper sensitivity bound AI share parameter', defaultVal: '28.0% (CPA J62)' }
    ],
    assumptions: [
      'The AI share is applied uniformly across the product transaction categories unless separate matrices exist.',
      'Mathematical identity: AI Component + Non-AI Component strictly equals Published Broad Total.'
    ],
    limitations: [
      'Sensitivity to choice of share parameter requires interval testing rather than point precision.',
      'A business count proportion is not automatically equivalent to a turnover/output proportion.'
    ],
    validationStatus: 'Reconciled against ONS Table 1-3 benchmarks & verified in automated unit test suite.'
  },
  {
    id: 'METH-MOD-01',
    version: 'mod-v1.2.0',
    title: 'Firm-Level Modelled Disaggregation with Revenue Attribution',
    methodFamily: 'Model-based Estimation',
    formulaLatex: '\\text{Expected AI}_{i} = \\text{Turnover}_{i} \\times p_{\\text{AI}, i} \\times r_{\\text{AI}, i}, \\quad \\text{AI}_{g} = \\sum_{i \\in g} \\text{Expected AI}_{i}',
    description: 'Decomposes enterprise revenue by explicitly separating the probability that a firm is AI-active ($p_{AI}$) from the proportion of its revenue attributable to AI ($r_{AI}$).',
    parameters: [
      { name: 'Firm AI Probability', symbol: 'p_AI', description: 'Estimated probability of AI activity from text classification / filing features', defaultVal: '0.45' },
      { name: 'Revenue Attribution Ratio', symbol: 'r_AI', description: 'Estimated share of firm revenue derived from AI products/services', defaultVal: '0.35' }
    ],
    assumptions: [
      'Firm AI probability and revenue attribution are distinct parameters; being 100% likely an AI company does not mean 100% of revenue is AI.',
      'Diversified tech conglomerates have lower $r_{AI}$ than dedicated boutique AI labs.'
    ],
    limitations: [
      'Requires financial microdata or representative domain sampling to calibrate $r_{AI}$.',
      'Small firms may have higher volatility in revenue attribution over time.'
    ],
    validationStatus: 'Empirically tested in Disaggregation Lab v1.2 with parameter range controls.'
  },
  {
    id: 'METH-HYB-01',
    version: 'hyb-v1.1.0',
    title: 'Hierarchical Tiered Hybrid Disaggregation',
    methodFamily: 'Hybrid Allocation',
    formulaLatex: '\\text{AI}_{g} = V_{\\text{direct}} + (\\text{Residual}_1 \\times s_{\\text{prop}}) + (\\text{Residual}_2 \\times w_{\\text{model}})',
    description: 'Prioritizes direct observed monetary accounting values (Tier 1), allocates verified proportional shares for well-defined segments (Tier 2), and applies modelled estimation only to residual gaps (Tier 3).',
    parameters: [
      { name: 'Direct Observed Tier', symbol: 'V_direct', description: 'Audited AI revenue/output from dedicated AI producers', defaultVal: '£4.5bn' },
      { name: 'Proportional Tier Share', symbol: 's_prop', description: 'Survey-calibrated share on remaining residual volume', defaultVal: '12.0%' },
      { name: 'Modelled Residual Weight', symbol: 'w_model', description: 'Statistical gap-filling weight for unmeasured segments', defaultVal: '6.0%' }
    ],
    assumptions: [
      'Direct observed values are subtracted from the broad denominator before secondary shares are applied to avoid double counting.',
      'Higher tiers carry higher evidentiary quality weights.'
    ],
    limitations: [
      'Requires maintaining tier boundaries and explicit evidence hierarchy logs.'
    ],
    validationStatus: 'Validated in packages/methods/disaggregation.ts with sum-of-parts tests.'
  },
  {
    id: 'METH-CLF-01',
    version: 'clf-v1.4.0',
    title: 'Multi-Label Business Text Classification & TF-IDF Logistic Engine',
    methodFamily: 'Machine Learning & NLP',
    formulaLatex: 'P(\\text{AI} \\mid x) = \\sigma\\left(\\sum_{j=1}^{K} w_j \\cdot x_j + b\\right) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}',
    description: 'Supervised classification of business activity text into 13 ONS Table 3 multi-label categories and binary AI relevance, with calibrated explainability feature weights.',
    parameters: [
      { name: 'Vocabulary Weights', symbol: 'w_j', description: 'Calibrated logistic regression coefficient for term j', defaultVal: 'Trained on UK Corpus' },
      { name: 'Classification Threshold', symbol: 'Threshold', description: 'Decision boundary for binary AI relevance flag', defaultVal: '0.50' }
    ],
    assumptions: [
      'Business descriptions contain domain-specific vocabulary indicative of AI engineering versus non-technical adoption.',
      'Human review status overrides algorithmic prediction for official register curation.'
    ],
    limitations: [
      'Susceptible to vocabulary drift as AI marketing buzzwords proliferate in non-technical sectors.'
    ],
    validationStatus: 'Evaluated against 60-company UK benchmark with full confusion matrix (Precision: 88.2%, Recall: 93.8%).'
  },
  {
    id: 'METH-SNA-01',
    version: 'sna-v1.0.0',
    title: 'System of National Accounts (SNA 2008 / ESA 2010) Asset Boundary Evaluation',
    methodFamily: 'Deterministic Accounting Rules',
    formulaLatex: '\\text{GFCF}_{\\text{own-account}} = \\text{Labour Costs} + \\text{Intermediate Inputs} + \\text{Capital Services}',
    description: 'Deterministic rule evaluation determining whether AI expenditure represents Gross Fixed Capital Formation (intangible IP asset AN.1173/AN.1171) or Intermediate Consumption (P.2).',
    parameters: [
      { name: 'Service Life', symbol: 'T', description: 'Expected economic utility in production (> 1 year required for GFCF)', defaultVal: '> 1 year' },
      { name: 'Economic Ownership', symbol: 'Owner', description: 'Party entitled to benefits and accepting operating risks', defaultVal: 'UK Resident' }
    ],
    assumptions: [
      'Own-account software developed for internal use is valued at sum of production costs (SNA §10.137).',
      'Cloud compute API fees without intellectual property asset transfer represent intermediate consumption.'
    ],
    limitations: [
      'Requires inspection of corporate contracts and economic ownership terms.'
    ],
    validationStatus: 'Tested across 6 pre-loaded UK corporate case study scenarios.'
  }
];

export default function MethodologyPage() {
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const methProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'Methodology Specifications & Mathematical Framework (UK AI Economic Measurement Lab)',
    publisher: 'UK AI Economic Measurement Lab',
    reference_period: '2026',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0 / MIT',
    statistical_status: 'Published research/context source',
    transformation_version: 'meth-cards-v1.0.0',
    unit: 'Mathematical Formulas & Specification Registry'
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700">
                METHODOLOGY SPECIFICATION
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="Method Registry"
                onClick={() => setSelectedMeta(methProvenance)}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Methodology Cards & Mathematical Specifications
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded self-start">
            5 Versioned Engines
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-4xl">
          In accordance with the project’s statistical transparency rules, every calculation and decomposition model is documented below with its exact mathematical formula, parameter definitions, core accounting assumptions, limitations, and validation status.
        </p>
      </div>

      {/* Method Cards List */}
      <div className="space-y-8">
        {METHOD_CARDS.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-800">
                    {card.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                    {card.methodFamily}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {card.title}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 self-start">
                Version: {card.version}
              </span>
            </div>

            {/* Formula Block */}
            <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider block mb-1.5">
                Mathematical Specification:
              </span>
              <code className="text-slate-200">{card.formulaLatex}</code>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {card.description}
            </p>

            {/* Parameters Table */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Parameter Definitions
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Symbol</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Documented Default</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {card.parameters.map((param, pIdx) => (
                      <tr key={pIdx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">{param.name}</td>
                        <td className="p-3 font-mono text-slate-700">{param.symbol}</td>
                        <td className="p-3 text-slate-600">{param.description}</td>
                        <td className="p-3 font-mono text-slate-800">{param.defaultVal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assumptions & Limitations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80 space-y-2">
                <span className="font-semibold text-slate-900 block">Core Methodological Assumptions:</span>
                <ul className="space-y-1.5 text-slate-600">
                  {card.assumptions.map((asmp, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{asmp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/40 p-4 rounded-lg border border-amber-200/70 space-y-2">
                <span className="font-semibold text-amber-950 block">Known Limitations & Caveats:</span>
                <ul className="space-y-1.5 text-amber-900">
                  {card.limitations.map((lim, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {card.validationStatus}
              </span>
              <Link
                href="/disaggregation"
                className="text-slate-900 font-medium hover:underline flex items-center gap-1"
              >
                Execute in Disaggregation Lab <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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

