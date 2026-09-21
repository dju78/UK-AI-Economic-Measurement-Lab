'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Layers,
  Scale,
  ShieldCheck,
  Building,
  FileCheck2,
  Download
} from 'lucide-react';
import {
  SNA_DECISION_NODES,
  SNA_CASE_STUDIES
} from '@packages/methods/sna_tree';
import { SNACaseStudy, SNADecisionOption, ProvenanceMeta } from '@packages/schemas';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';

export default function SNADecisionPage() {
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [pathHistory, setPathHistory] = useState<Array<{ nodeId: string; option: SNADecisionOption }>>([]);
  const [activeOutcome, setActiveOutcome] = useState<SNADecisionOption['accounting_effect'] | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<SNACaseStudy | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const currentNode = SNA_DECISION_NODES[currentNodeId] || SNA_DECISION_NODES['root'];

  const handleSelectOption = (option: SNADecisionOption) => {
    const nextHistory = [...pathHistory, { nodeId: currentNodeId, option }];
    setPathHistory(nextHistory);

    if (option.accounting_effect) {
      setActiveOutcome(option.accounting_effect);
    } else if (option.next_node_id && SNA_DECISION_NODES[option.next_node_id]) {
      setCurrentNodeId(option.next_node_id);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('root');
    setPathHistory([]);
    setActiveOutcome(null);
    setSelectedCaseStudy(null);
  };

  const handleLoadCaseStudy = (cs: SNACaseStudy) => {
    setSelectedCaseStudy(cs);
    handleReset();
    // Pre-navigate root
    const rootOptId = cs.initial_answers['root'];
    const rootOpt = SNA_DECISION_NODES['root'].options.find((o) => o.id === rootOptId);
    if (rootOpt) {
      handleSelectOption(rootOpt);
      const nextNodeKey = Object.keys(cs.initial_answers).find((k) => k !== 'root');
      if (nextNodeKey && rootOpt.next_node_id) {
        const nextOptId = cs.initial_answers[nextNodeKey];
        const nextOpt = SNA_DECISION_NODES[rootOpt.next_node_id]?.options.find((o) => o.id === nextOptId);
        if (nextOpt) {
          handleSelectOption(nextOpt);
        }
      }
    }
  };

  const snaProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'System of National Accounts (SNA 2008), ESA 2010 & ONS Thematic Account Methodology (S1)',
    publisher: 'United Nations / Eurostat / Office for National Statistics',
    reference_period: '2026',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0 / Crown Copyright',
    statistical_status: 'Published research/context source',
    transformation_version: 'sna-tree-v1.0.0',
    unit: 'Deterministic Accounting Treatment Framework',
    notes: 'Educational decision-support engine. Does not establish official corporate tax or statistical accounting rulings.'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800">
                NATIONAL ACCOUNTS DECISION SUPPORT
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="SNA 2008 / S1"
                onClick={() => setSelectedMeta(snaProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-govuk-blue" />
              SNA National Accounts Decision Engine
            </h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start New Decision Tree
          </button>
        </div>

        <CaveatBanner type="experimental_warning">
          <strong>Mandatory Caveat:</strong> Results produced by this engine are
          <strong> indicative treatments for research and educational investigation</strong>, not official statistical classifications or tax accounting advice.
          National Accounts boundaries depend on specific contractual terms, risk-bearing, and residency facts.
        </CaveatBanner>
      </div>

      {/* Case Study Quick Launcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-govuk-blue" />
            Pre-loaded UK Case Study Scenarios (Click to Load)
          </h2>
          <span className="text-[11px] text-slate-500">6 Real-world Scenarios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SNA_CASE_STUDIES.map((cs) => {
            const isSelected = selectedCaseStudy?.id === cs.id;
            return (
              <button
                key={cs.id}
                type="button"
                onClick={() => handleLoadCaseStudy(cs)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer focus:ring-2 focus:ring-govuk-blue ${
                  isSelected
                    ? 'bg-blue-50 border-govuk-blue shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-govuk-blue'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-govuk-blue block mb-0.5 font-mono">
                  {cs.id} · {cs.firm_type}
                </span>
                <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                  {cs.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {cs.activity_summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Wizard & Outcome View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Wizard Steps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Step Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-semibold text-slate-700">Decision Path:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">1. Transaction Type</span>
              {pathHistory.map((step, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="bg-blue-50 text-govuk-blue px-2 py-0.5 rounded font-medium">
                    {step.option.label.split('—')[0]}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {!activeOutcome ? (
              <div className="space-y-4 pt-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {currentNode.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentNode.question}
                  </p>
                </div>

                <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-200 text-xs text-sky-950 leading-relaxed">
                  <strong>Accounting Context:</strong> {currentNode.context_help}
                </div>

                {/* Option Buttons */}
                <div className="space-y-2.5 pt-2">
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-govuk-blue transition-all group focus:outline-none focus:ring-2 focus:ring-govuk-blue cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-govuk-blue transition-colors">
                          {opt.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-govuk-blue transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Completed Decision State */
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Indicative National Accounts Treatment Resolved
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    All decision dimensions evaluated according to SNA 2008 / ESA 2010 rules.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-4 bg-govuk-blue text-white rounded-lg text-xs font-semibold hover:bg-govuk-darkBlue transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Evaluate Another Scenario
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Accounting Impact & Ledger */}
        <div className="lg:col-span-5">
          {activeOutcome ? (
            <div className="bg-white rounded-xl border-2 border-govuk-blue p-6 shadow-md sticky top-24 space-y-5 animate-in fade-in duration-200">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-govuk-blue block mb-1">
                  Indicative Accounting Classification
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {activeOutcome.national_accounts_category}
                </h2>
                <span className="text-xs text-slate-500 font-mono block mt-1">
                  {activeOutcome.primary_cpa}
                </span>
              </div>

              {/* Boundary Summary Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">SNA Asset Boundary:</span>
                  <span className="font-bold text-slate-900">
                    {activeOutcome.asset_boundary ? 'Within Asset Boundary (GFCF)' : 'Operating Expense (P.2)'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Economic Residency:</span>
                  <span className="font-bold text-slate-900">{activeOutcome.residency}</span>
                </div>
              </div>

              {/* Rationale & Citation */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">SNA Methodological Rationale:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {activeOutcome.rationale}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1 font-mono">
                  <Scale className="w-3.5 h-3.5 text-slate-400" /> Standard Citation: {activeOutcome.sna_citation}
                </div>
              </div>

              {/* Double Entry Ledger Impact */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">
                  National Accounts Ledger Entry
                </span>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] space-y-1">
                  <div className="text-emerald-400">
                    Debit: {activeOutcome.asset_boundary ? 'GFCF Capital Account (P.51g)' : 'Intermediate Consumption (P.2)'}
                  </div>
                  <div className="text-blue-300">
                    Credit: {activeOutcome.residency === 'UK Resident' ? 'Domestic Output (P.1)' : 'Imports of Services/Goods (P.7)'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-3">
              <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Decision Outcome Inspector</p>
              <p className="max-w-xs mx-auto">
                Step through the questions on the left or select a pre-loaded UK case study to generate the System of National Accounts treatment.
              </p>
            </div>
          )}
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
