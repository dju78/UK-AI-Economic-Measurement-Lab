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
    sourceCode: 'S3 / S4',
    title: 'ONS Data centres and the UK National Accounts & Digital Infrastructure',
    publisher: 'Office for National Statistics',
    url: 'https://www.ons.gov.uk/economy/nationalaccounts/uksectoraccounts/methodologies/datacentresandtheuknationalaccounts',
    referencePeriod: '2025/2026',
    releaseDate: '2026-08-24',
    licence: 'Open Government Licence v3.0',
    status: 'Published research/context source',
    usageInLab: 'Data centre capacity context (1.48 GW), physical structures GFCF, cloud intermediate consumption distinctions.',
    limitations: 'Data centres cannot currently be separately identified across all standard economic statistics.'
  },
  {
    id: 'DS05',
    sourceCode: 'Benchmark DS05',
    title: 'UK AI Business Classification Research Benchmark Corpus (60 UK Profiles)',
    publisher: 'UK AI Economic Measurement Lab (Curated Research Benchmark)',
    url: 'https://github.com/daramola/uk-ai-economic-measurement-lab',
    referencePeriod: '2026',
    releaseDate: '2026-09-21',
    licence: 'Open Government Licence v3.0 / Research Use',
    status: 'Prototype output',
    usageInLab: 'Evaluation corpus of 60 curated UK business profiles with multi-label ground truth across 13 taxonomy categories, hard negatives, and cross-validation.',
    limitations: 'Curated experimental benchmark dataset — not official statistics and not a representative sample of UK businesses.'
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

  const handleRowClick = (source: DataSourceEntry) => {
    setSelectedMeta({
      source_id: source.id,
      source_title: source.title,
      publisher: source.publisher,
      reference_period: source.referencePeriod,
      release_date: source.releaseDate,
      retrieved_at: '2026-09-21T12:00:00Z',
      licence: source.licence,
      statistical_status: source.status,
      transformation_version: 'source-raw-v1.0',
      unit: 'Various',
      notes: source.limitations
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-govuk-blue">
                DATA REGISTRY & PROVENANCE
              </span>
              <span className="text-xs text-slate-500 font-mono">10 External & Benchmark Sources</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-govuk-blue" />
              Authoritative Data Source Register & Bibliography
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-4xl">
          Every quantitative figure and classification rule in this laboratory originates from a verified public source.
          This register records authoritative publisher citations, reference periods, official URLs, and specific limitations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sources by title, publisher, code, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-govuk-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-govuk-blue"
          >
            <option value="all">All Statistical Statuses</option>
            <option value="Published official-statistics source">Published official-statistics source</option>
            <option value="Published research/context source">Published research/context source</option>
            <option value="Prototype output">Prototype output</option>
          </select>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                <th className="p-3.5">Source ID</th>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Publication Title</th>
                <th className="p-3.5">Publisher</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Period</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.map((source) => (
                <tr
                  key={source.id}
                  onClick={() => handleRowClick(source)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-bold font-mono text-govuk-blue">{source.id}</td>
                  <td className="p-3.5 font-mono text-slate-500">{source.sourceCode}</td>
                  <td className="p-3.5 font-semibold text-slate-900 max-w-sm">
                    {source.title}
                  </td>
                  <td className="p-3.5 text-slate-700">{source.publisher}</td>
                  <td className="p-3.5">
                    <ProvenanceBadge status={source.status} />
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">{source.referencePeriod}</td>
                  <td className="p-3.5 text-right">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-govuk-blue hover:underline font-semibold"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
