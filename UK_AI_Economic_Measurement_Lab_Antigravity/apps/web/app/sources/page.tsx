'use client';

import React, { useState, useMemo } from 'react';
import {
  Database,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  BookOpen,
  FileText,
  Scale
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { ProvenanceMeta } from '@packages/schemas';

interface DataSourceEntry {
  id: string;
  sourceCode: string;
  title: string;
  publisher: string;
  url: string;
  referencePeriod: string;
  releaseDate: string;
  licence: string;
  status: 'Published official-statistics source' | 'Published research/context source' | 'Prototype output';
  usageInLab: string;
  limitations: string;
}

const DATA_SOURCES: DataSourceEntry[] = [
  {
    id: 'DS01',
    sourceCode: 'S1 / S5',
    title: 'ONS Measuring artificial intelligence in the UK economy using a thematic account',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/economy/nationalaccounts/satelliteaccounts/methodologies/measuringartificialintelligenceintheukeconomyusingathematicaccount',
    referencePeriod: '2020-2023 / 2026',
    releaseDate: '2026-09-21',
    licence: 'Open Government Licence v3.0',
    status: 'Published official-statistics source',
    usageInLab: 'Core conceptual anchor, 23 AI-relevant CPA product groups, Tables 1–3, Supply & Use denominators, roadmap.',
    limitations: 'Broad CPA totals contain both AI and non-AI activity; requires disaggregation before estimating AI output.'
  },
  {
    id: 'DS02',
    sourceCode: 'S2',
    title: 'ONS Artificial intelligence in UK businesses (BICS Waves 95–135)',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026',
    referencePeriod: '2023-2026',
    releaseDate: '2026-07-20',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Business AI adoption trajectories, industry breakdown, firm size adoption, use case prevalence.',
    limitations: 'Adoption rate measures prevalence of use, not economic monetary contribution or GVA.'
  },
  {
    id: 'DS03',
    sourceCode: 'S8',
    title: 'DSIT Artificial Intelligence Sector Study 2024',
    publisher: 'Department for Science, Innovation and Technology',
    url: 'https://www.gov.uk/government/publications/artificial-intelligence-sector-study-2024/artificial-intelligence-sector-study-2024',
    referencePeriod: '2023/2024',
    releaseDate: '2025-09-03',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'External sector population benchmark (5,860 firms), dedicated vs diversified split, sector turnover (£10.6bn).',
    limitations: 'Different methodology and scope boundary from the National Accounts product-level Supply & Use framework.'
  },
  {
    id: 'DS04',
    sourceCode: 'S3',
    title: 'ONS Data centres and the UK National Accounts',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/economy/nationalaccounts/uksectoraccounts/methodologies/datacentresandtheuknationalaccounts',
    referencePeriod: '2026',
    releaseDate: '2026-08-24',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Data centre capacity context (1.48 GW), physical structures GFCF, cloud intermediate consumption distinctions.',
    limitations: 'Data centres cannot currently be separately identified across all standard economic statistics.'
  },
  {
    id: 'DS05',
    sourceCode: 'S4',
    title: 'ONS Redefining investment in digital infrastructure in the UK: 2026',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/articles/redefininginvestmentindigitalinfrastructureintheuk/2026',
    referencePeriod: '2026',
    releaseDate: '2026-08-24',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Digital infrastructure investment framework, fiber telecoms, high-performance computing assets.',
    limitations: 'Digital infrastructure is broader than AI alone; must not be interpreted as AI-only capital.'
  },
  {
    id: 'DS06',
    sourceCode: 'S6',
    title: 'ONS Developing UK digital trade statistics: 2026 update',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/businessindustryandtrade/internationaltrade/articles/developingukdigitaltradestatistics/2026update',
    referencePeriod: '2026',
    releaseDate: '2026-06-26',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Trade in digital services, cross-border cloud compute API token flows, residency definitions.',
    limitations: 'Experimental statistics under active development.'
  },
  {
    id: 'DS07',
    sourceCode: 'S7',
    title: 'ONS UK Standard Industrial Classification (UK SIC 2026)',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/methodology/classificationsandstandards/ukstandardindustrialclassificationofeconomicactivities/uksic2026',
    referencePeriod: '2026',
    releaseDate: '2026-08-03',
    licence: 'Open Government Licence v3.0',
    status: 'Published official-statistics source',
    usageInLab: 'Industry structure context, new AI-related subclasses, comparison with product (CPA) classification.',
    limitations: 'Enterprise-level SIC classification does not isolate multi-product secondary activity.'
  },
  {
    id: 'DS08',
    sourceCode: 'S9',
    title: 'Companies House Public Data API',
    publisher: 'Companies House',
    url: 'https://developer-specs.company-information.service.gov.uk/companies-house-public-data-api/reference',
    referencePeriod: 'Live / 2026',
    releaseDate: '2026-09-21',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Public company registration profiles, registered office address, primary SIC filings for demo classifier.',
    limitations: 'Company profile alone provides brief text; requires caching to comply with rate limits.'
  },
  {
    id: 'DS09',
    sourceCode: 'S10',
    title: 'UK Statistics Authority Code of Practice for Statistics (v3.0)',
    publisher: 'UK Statistics Authority',
    url: 'https://code.statisticsauthority.gov.uk/',
    referencePeriod: '2025',
    releaseDate: '2025-10-01',
    licence: 'Open Government Licence v3.0',
    status: 'Published official-statistics source',
    usageInLab: 'Ethical and governance anchor: Trustworthiness, Quality, Value; mandatory provenance and uncertainty disclosures.',
    limitations: 'Sets governance standards for official statistics; prototype adheres to its spirit.'
  },
  {
    id: 'DS10',
    sourceCode: 'S11',
    title: 'ONS Service Manual and Design System',
    publisher: 'Office for National Statistics',
    url: 'https://service-manual.ons.gov.uk/',
    referencePeriod: '2026',
    releaseDate: '2026-09-21',
    licence: 'Open Government Licence v3.0',
    status: 'Published official-statistics source',
    usageInLab: 'Accessibility standard (WCAG 2.2 AA), accessible data table alternatives, clear plain-English caveats.',
    limitations: 'Used for accessibility inspiration while maintaining independent prototype brand identity.'
  }
];

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const filteredSources = useMemo(() => {
    return DATA_SOURCES.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.usageInLab.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || s.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleOpenDrawer = (s: DataSourceEntry) => {
    setSelectedMeta({
      source_id: s.id,
      source_title: s.title,
      publisher: s.publisher,
      reference_period: s.referencePeriod,
      release_date: s.releaseDate,
      retrieved_at: '2026-09-21T12:00:00Z',
      licence: s.licence,
      statistical_status: s.status,
      transformation_version: 'v1.0.0',
      unit: 'Official Source Record',
      notes: s.limitations
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                PROVENANCE REGISTER
              </span>
              <span className="text-xs text-slate-500 font-mono">10 Authoritative Sources</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-govuk-blue" />
              Authoritative Data Source Register & Bibliography
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md self-start">
            OGL v3.0 / Crown Copyright
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          Every quantitative value and methodological framework in this prototype is anchored to published official statistics or authoritative government research.
          Raw source inputs are immutable, cryptographically hashed, and mapped to specific analytical functions.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data sources by title, publisher, ID, or keywords..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-govuk-blue focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-govuk-blue"
            >
              <option value="all">All Statistical Statuses ({DATA_SOURCES.length})</option>
              <option value="Published official-statistics source">Official Statistics Sources</option>
              <option value="Published research/context source">Official Research / Context Sources</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-govuk-blue transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-slate-100 text-govuk-blue px-2 py-0.5 rounded">
                  {source.id}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  [{source.sourceCode}]
                </span>
                <ProvenanceBadge status={source.status} />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Period: <strong>{source.referencePeriod}</strong></span>
                <span>Released: {source.releaseDate}</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 hover:text-govuk-blue transition-colors">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  {source.title} <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>
              </h2>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                Publisher: {source.publisher}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Application in Measurement Lab:</span>
                <p className="text-slate-700 leading-relaxed">{source.usageInLab}</p>
              </div>

              <div className="bg-amber-50/60 p-3 rounded border border-amber-200">
                <span className="font-bold text-amber-950 block mb-0.5">Key Statistical Limitations:</span>
                <p className="text-amber-900 leading-relaxed">{source.limitations}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Licence: <strong>{source.licence}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleOpenDrawer(source)}
                className="text-govuk-blue font-semibold hover:underline"
              >
                View Full Lineage Metadata &rarr;
              </button>
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
