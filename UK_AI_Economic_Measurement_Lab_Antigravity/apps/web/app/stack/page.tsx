'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Server,
  Cloud,
  Sliders,
  Boxes,
  FileCode,
  Database,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Globe2,
  Info
} from 'lucide-react';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { ProvenanceMeta } from '@packages/schemas';

interface StackNode {
  id: string;
  name: string;
  layerIndex: number;
  layerName: string;
  icon: any;
  summary: string;
  cpaMappings: string[];
  sicMappings: string[];
  nationalAccountsTreatment: {
    category: string;
    assetType: string;
    flowType: string;
    residencyNote: string;
  };
  measurementChallenges: string[];
  onsCitation: string;
}

const STACK_LAYERS: Array<{
  index: number;
  name: string;
  tagline: string;
  nodes: StackNode[];
}> = [
  {
    index: 7,
    name: 'Layer 7 · Downstream Adoption & Final Use',
    tagline: 'Enterprise operations, consumer interaction, public services (health, education)',
    nodes: [
      {
        id: 'node_final_use',
        name: 'Downstream Business & Public Sector Adoption',
        layerIndex: 7,
        layerName: 'Downstream Adoption',
        icon: Building2,
        summary: 'Final consumption and intermediate usage of AI tools across legal, finance, retail, healthcare, and public administration.',
        cpaMappings: ['CPA_M691 (Legal)', 'CPA_M702 (Consulting)', 'CPA_N78 (HR)', 'All SIC Divisions'],
        sicMappings: ['SIC 64 (Banking)', 'SIC 86 (Health)', 'SIC 47 (Retail)', 'SIC 70 (Management)'],
        nationalAccountsTreatment: {
          category: 'Intermediate Consumption & Household Final Consumption (P.2 / P.3)',
          assetType: 'Non-capitalized operating expenditure unless creating own-account capital',
          flowType: 'Domestic demand / imported service consumption',
          residencyNote: 'Adopting UK enterprises consume AI services produced domestically or imported from abroad.'
        },
        measurementChallenges: [
          'Adoption rate (BICS) does not equal economic contribution or GVA.',
          'Value added by AI within adopting firms is bundled in overall business turnover.'
        ],
        onsCitation: 'ONS Thematic Account Paper (S1) §2.3 & BICS (S2)'
      }
    ]
  },
  {
    index: 6,
    name: 'Layer 6 · Data Work, Human Feedback & Intangibles',
    tagline: 'Data annotation, RLHF labeling, synthetic corpora, vector databases',
    nodes: [
      {
        id: 'node_data_assets',
        name: 'Data Assets & Curated Training Corpora',
        layerIndex: 6,
        layerName: 'Data & Intangibles',
        icon: Database,
        summary: 'Proprietary knowledge datasets, multimodal training corpora, RLHF human feedback datasets, and database structures.',
        cpaMappings: ['CPA_J63 (Data processing & hosting)', 'CPA_M72 (Scientific R&D)'],
        sicMappings: ['SIC 63.11 (Data processing)', 'SIC 72.19 (Other R&D)'],
        nationalAccountsTreatment: {
          category: 'Gross Fixed Capital Formation (AN.1173 Databases)',
          assetType: 'Intangible Fixed Asset if structured for query > 1 year',
          flowType: 'Own-account capitalization / Purchased services',
          residencyNote: 'UK-created proprietary datasets form UK domestic capital assets.'
        },
        measurementChallenges: [
          'Difficulty establishing market valuation for proprietary training data.',
          'Separating routine data cleaning from multi-year intellectual capital.'
        ],
        onsCitation: 'SNA 2008 §10.144 & ONS S1 §3.2'
      }
    ]
  },
  {
    index: 5,
    name: 'Layer 5 · AI Applications & Vertical Software',
    tagline: 'Domain-specific enterprise AI SaaS, copilot agents, automated workflows',
    nodes: [
      {
        id: 'node_apps',
        name: 'Enterprise AI Applications & Vertical SaaS',
        layerIndex: 5,
        layerName: 'AI Applications',
        icon: FileCode,
        summary: 'Commercial AI software for contract analysis, radiology diagnostics, fraud detection, code synthesis, and marketing copy.',
        cpaMappings: ['CPA_J582 (Software publishing)', 'CPA_J62 (Computer programming)'],
        sicMappings: ['SIC 58.29 (Software publishing)', 'SIC 62.01 (Programming)'],
        nationalAccountsTreatment: {
          category: 'Gross Fixed Capital Formation (AN.1173) or Intermediate Consumption (P.2)',
          assetType: 'Purchased/Own-Account Software Asset or Monthly SaaS expense',
          flowType: 'Domestic output / Service imports',
          residencyNote: 'UK AI software developers generate domestic output; imported SaaS involves cross-border royalty/licence flows.'
        },
        measurementChallenges: [
          'Embedded AI in generic enterprise software (e.g. ERP suites with AI features).',
          'SaaS subscriptions do not enter the SNA asset boundary.'
        ],
        onsCitation: 'ONS S1 Table 1 & Table 3'
      }
    ]
  },
  {
    index: 4,
    name: 'Layer 4 · Foundation Models, Frontier AI & APIs',
    tagline: 'LLMs, multimodal transformers, open weights, inference endpoints',
    nodes: [
      {
        id: 'node_foundation_models',
        name: 'Frontier Models & Inference APIs',
        layerIndex: 4,
        layerName: 'Foundation Models',
        icon: Boxes,
        summary: 'Pre-trained foundation models, reasoning architectures, diffusion models, and token-based API services.',
        cpaMappings: ['CPA_J582 (Software publishing)', 'CPA_J63 (Hosting & APIs)', 'CPA_M72 (R&D)'],
        sicMappings: ['SIC 62.01 (Programming)', 'SIC 72.19 (Deep tech R&D)'],
        nationalAccountsTreatment: {
          category: 'Gross Fixed Capital Formation (AN.1171 R&D / AN.1173 Software) & Intermediate Consumption',
          assetType: 'Model weights as intangible IP asset; API tokens as intermediate consumption',
          flowType: 'Cross-border digital trade / Domestic R&D formation',
          residencyNote: 'Significant UK import flows for foreign-hosted frontier API tokens (e.g. US hyperscalers).'
        },
        measurementChallenges: [
          'High concentration among global frontier labs outside the UK.',
          'Open-source model weights (e.g. Llama) create economic surplus without direct market transaction price.'
        ],
        onsCitation: 'ONS S1 §2.1 & Digital Trade 2026 (S6)'
      }
    ]
  },
  {
    index: 3,
    name: 'Layer 3 · Platforms, MLOps & Developer Tooling',
    tagline: 'Orchestration, vector indexes, fine-tuning frameworks, evaluation & safety',
    nodes: [
      {
        id: 'node_mlops',
        name: 'MLOps, AI Tooling & Frameworks',
        layerIndex: 3,
        layerName: 'MLOps & Tooling',
        icon: Sliders,
        summary: 'Developer frameworks (PyTorch, LangChain), vector search engines, model evaluation, safety benchmarks, and deployment tooling.',
        cpaMappings: ['CPA_J62 (Consultancy & programming)', 'CPA_M712 (Testing & analysis)'],
        sicMappings: ['SIC 62.02 (Consultancy)', 'SIC 71.20 (Technical testing)'],
        nationalAccountsTreatment: {
          category: 'Intermediate Consumption (P.2) or Capitalized Development (P.51g)',
          assetType: 'Software tooling / Safety assurance service',
          flowType: 'Domestic services output',
          residencyNote: 'Strong UK presence in AI safety evaluation and technical benchmarking.'
        },
        measurementChallenges: [
          'Separating general software developer tooling from AI-specific MLOps.',
          'Open-source tooling contributions.'
        ],
        onsCitation: 'ONS S1 Table 3 Category 10 & 13'
      }
    ]
  },
  {
    index: 2,
    name: 'Layer 2 · Hyperscale Cloud Compute & Hosting',
    tagline: 'IaaS, GPU clusters, high-speed interconnects, cloud data processing',
    nodes: [
      {
        id: 'node_cloud_compute',
        name: 'Cloud Compute Infrastructure & GPU Clusters',
        layerIndex: 2,
        layerName: 'Cloud Compute',
        icon: Cloud,
        summary: 'Hyperscale cloud compute instances, specialized AI GPU clouds (neoclouds), high-throughput storage, and cluster networking.',
        cpaMappings: ['CPA_J63 (Information services - hosting & data processing)', 'CPA_J61 (Telecoms)'],
        sicMappings: ['SIC 63.11 (Data processing & hosting)', 'SIC 61.10 (Telecoms)'],
        nationalAccountsTreatment: {
          category: 'Intermediate Consumption (P.2) / Service Imports (P.72)',
          assetType: 'Compute service consumed during model training/inference',
          flowType: 'Cross-border service import or domestic hosting',
          residencyNote: 'Large UK enterprise spend flows abroad to US cloud providers (AWS, Azure, GCP).'
        },
        measurementChallenges: [
          'Cloud invoices combine general compute, storage, bandwidth, and AI GPU accelerators into single line items.',
          'Determining the UK residency of compute processing servers.'
        ],
        onsCitation: 'ONS Data Centres 2026 (S3) & ONS S1 §4'
      }
    ]
  },
  {
    index: 1,
    name: 'Layer 1 · Upstream Semiconductors & Compute Hardware',
    tagline: 'AI microchips, GPUs, TPUs, ASICs, optical networking, server racks',
    nodes: [
      {
        id: 'node_hardware',
        name: 'AI Silicon, Accelerators & Server Hardware',
        layerIndex: 1,
        layerName: 'Semiconductors & Hardware',
        icon: Layers,
        summary: 'Specialized silicon architectures (GPU, TPU, NPU), wafer fabrication, high-bandwidth memory (HBM), and assembled server nodes.',
        cpaMappings: ['CPA_C261 (Electronic components)', 'CPA_C262 (Computers & peripherals)', 'CPA_C263 (Communication equip)'],
        sicMappings: ['SIC 26.11 (Electronic components)', 'SIC 26.20 (Computers)'],
        nationalAccountsTreatment: {
          category: 'Gross Fixed Capital Formation (AN.1132) & Imports of Goods (P.71)',
          assetType: 'Tangible Fixed Asset (Computer Hardware)',
          flowType: 'Physical goods imports / domestic capital accumulation',
          residencyNote: 'Vast majority of AI silicon and servers are manufactured overseas (Taiwan, US, East Asia) and imported into the UK.'
        },
        measurementChallenges: [
          'Standard trade classifications (HS/CPA) do not isolate AI GPUs from standard microprocessors.',
          'UK IP design (e.g. ARM) is separate from physical chip manufacturing.'
        ],
        onsCitation: 'ONS S1 Table 1 (CPA 26.1 & 26.2)'
      }
    ]
  },

  {
    index: 0,
    name: 'Layer 0 · Energy, Data Centre Structures & Physical Facilities',
    tagline: 'Grid power, sub-stations, data centre real estate, liquid cooling systems',
    nodes: [
      {
        id: 'node_datacentre_infra',
        name: 'Data Centre Real Estate, Power & Cooling Facilities',
        layerIndex: 0,
        layerName: 'Physical Infrastructure',
        icon: Server,
        summary: 'Heavy physical data centre shell construction, high-voltage grid connections, backup diesel/battery UPS, and liquid cooling systems.',
        cpaMappings: ['CPA_C282 (Cooling machinery)', 'CPA_C279 (Electrical equipment)', 'CPA_F41 (Buildings)'],
        sicMappings: ['SIC 68.20 (Real estate)', 'SIC 41.20 (Construction)', 'SIC 35.11 (Electricity)'],
        nationalAccountsTreatment: {
          category: 'Gross Fixed Capital Formation (AN.112 Buildings & Structures / AN.1139 Machinery)',
          assetType: 'Tangible Fixed Asset (Structures & Plant)',
          flowType: 'Domestic construction investment & imported industrial machinery',
          residencyNote: 'Physical data centre structures located in the UK represent UK domestic fixed capital assets.'
        },
        measurementChallenges: [
          'Data centre buildings are classified under general commercial real estate or hosting.',
          'Rapid power consumption growth must be linked to energy accounts.'
        ],
        onsCitation: 'ONS Data Centres in National Accounts (S3) & Digital Infrastructure (S4)'
      }
    ]
  }
];

export default function StackPage() {
  const [selectedNode, setSelectedNode] = useState<StackNode>(
    STACK_LAYERS[4].nodes[0]
  );
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const nodeProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'ONS Measuring artificial intelligence in the UK economy using a thematic account (S1)',
    publisher: 'Office for National Statistics & UK AI Economic Measurement Lab',
    reference_period: '2026',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0',
    statistical_status: 'Published research/context source',
    transformation_version: 'stack-v1.0.0',
    unit: 'Conceptual Framework & National Accounts Classifications'
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                Conceptual Framework
              </span>
              <ProvenanceBadge
                status="Published research/context source"
                sourceId="S1 Stack"
                onClick={() => setSelectedMeta(nodeProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-slate-800 stroke-[1.75]" />
              AI Economic Production Stack Explorer
            </h1>
          </div>
          <Link
            href="/supply-use"
            className="px-3.5 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start shadow-xs"
          >
            <span>Trace to Supply & Use Tables</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          Artificial intelligence is not a single industry or product; it is a general-purpose technology spanning an 8-layer economic value chain.
          Select any tier in the interactive production stack below to inspect its System of National Accounts (SNA) accounting treatment,
          UK residency implications, CPA/SIC linkages, and empirical measurement challenges.
        </p>
      </div>

      {/* Main interactive stack layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: 8-Layer Stack Navigator */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
            <span>Value Chain Hierarchy</span>
            <span>Downstream (Top) to Upstream (Base)</span>
          </div>

          <div className="space-y-2.5">
            {STACK_LAYERS.map((layer) => {
              const node = layer.nodes[0];
              const isSelected = selectedNode.id === node.id;
              const Icon = node.icon;

              return (
                <button
                  key={layer.index}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50/70'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
                  </div>

                  <div className="grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        Layer {layer.index}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {node.cpaMappings[0]?.split(' ')[0]}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm leading-snug mt-1">
                      {node.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed line-clamp-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {layer.tagline}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-2.5 transition-transform ${
                      isSelected ? 'text-amber-300 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Detailed Node Inspector */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                  {selectedNode.layerName}
                </span>
                <span className="text-xs text-slate-500 font-mono">Layer {selectedNode.layerIndex}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {selectedNode.name}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* National Accounts Treatment */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-slate-700 stroke-[1.75]" />
                National Accounts (SNA/ESA) Treatment
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">SNA Transaction Category:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedNode.nationalAccountsTreatment.category}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Asset Boundary Classification:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedNode.nationalAccountsTreatment.assetType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">UK Residency & Cross-Border Flows:</span>
                  <span className="text-slate-700 leading-relaxed block mt-0.5">
                    {selectedNode.nationalAccountsTreatment.residencyNote}
                  </span>
                </div>
              </div>
            </div>

            {/* CPA & SIC Mappings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Classification Linkages
              </h3>
              <div className="space-y-1.5">
                <div className="text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">CPA 2008 Product Groups:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.cpaMappings.map((cpa) => (
                      <span
                        key={cpa}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px]"
                      >
                        {cpa}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs pt-2">
                  <span className="font-semibold text-slate-700 block mb-1">UK SIC Industry Mappings:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.sicMappings.map((sic) => (
                      <span
                        key={sic}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]"
                      >
                        {sic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Challenges */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 stroke-[1.75]" />
                Key Measurement Challenges
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedNode.measurementChallenges.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold shrink-0">•</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Citation: {selectedNode.onsCitation}</span>
              <Link
                href={`/disaggregation`}
                className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
              >
                Test Disaggregation <ChevronRight className="w-3.5 h-3.5" />
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
