'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Table as TableIcon,
  Search,
  Filter,
  Sliders,
  ExternalLink,
  ChevronRight,
  Database,
  BarChart2,
  Layers,
  ArrowDownUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ALL_CPA_PRODUCTS } from '@/lib/data';
import { CPAProduct, ProvenanceMeta } from '@packages/schemas';
import { formatGbpMillions, formatPercent } from '@/lib/utils';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { AccessibleChartWrapper } from '@/components/charts/AccessibleChartWrapper';

export default function SupplyUsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [activeProduct, setActiveProduct] = useState<CPAProduct | null>(ALL_CPA_PRODUCTS[12]); // Default CPA_J62
  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const filteredProducts = useMemo(() => {
    return ALL_CPA_PRODUCTS.filter((p) => {
      const matchesSearch =
        p.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.broad_layer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === 'all' || p.ons_thematic_group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  // Chart data for top 10 products in selected year
  const chartData = useMemo(() => {
    return filteredProducts.slice(0, 10).map((p) => {
      const ts = p.time_series[selectedYear] || p.time_series['2023'];
      return {
        code: p.product_code.replace('CPA_', ''),
        name: p.product_name,
        domestic_output: ts.domestic_output,
        imports: ts.imports,
        intermediate_demand: ts.intermediate_demand,
        gfcf: ts.gfcf,
        exports: ts.exports
      };
    });
  }, [filteredProducts, selectedYear]);

  const sutProvenance: ProvenanceMeta = {
    source_id: 'DS01',
    source_title: 'ONS Supply and Use Tables (S5) & AI Thematic Account Methodology Table 1 (S1)',
    publisher: 'Office for National Statistics',
    reference_period: selectedYear,
    release_date: '2025-10-31',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0',
    statistical_status: 'Published official-statistics source',
    transformation_version: 'sut-v1.0.0',
    unit: 'GBP million (current basic / purchasers prices)',
    notes: 'Published broad product totals contain both AI and non-AI activity. Candidate denominators for thematic disaggregation.'
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                Official Source Data
              </span>
              <ProvenanceBadge
                status="Published official-statistics source"
                sourceId="DS01 / S5"
                onClick={() => setSelectedMeta(sutProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <TableIcon className="w-5 h-5 text-slate-800 stroke-[1.75]" />
              Supply & Use Tables: 23 AI-Relevant CPA Product Groups
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 self-start">
            Reference Period: 2020–2023
          </span>
        </div>

        <CaveatBanner type="broad_warning">
          <strong>Official National Accounts Rule:</strong> The figures below represent published broad product category totals from the ONS Supply and Use Tables.
          They are <strong>not AI output estimates</strong>. Broad categories contain both standard non-AI activity and emerging AI activity.
          Use the <Link href="/disaggregation" className="font-bold underline text-amber-950">Disaggregation Lab</Link> to test experimental AI-share scenarios.
        </CaveatBanner>

        {/* Filter and search bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 stroke-[1.75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by CPA code, product name, or value chain layer..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              aria-label="Search CPA products"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              aria-label="Filter by ONS thematic group"
            >
              <option value="all">All ONS Thematic Groups (23)</option>
              <option value="AI goods & infrastructure">AI goods & infrastructure (10)</option>
              <option value="Direct AI services">Direct AI services (4)</option>
              <option value="Supporting AI services">Supporting AI services (9)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-semibold"
              aria-label="Select reference year"
            >
              <option value="2023">Year: 2023</option>
              <option value="2022">Year: 2022</option>
              <option value="2021">Year: 2021</option>
              <option value="2020">Year: 2020</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Chart: Supply vs Demand Breakdown */}
      <AccessibleChartWrapper
        title={`Top AI-Relevant Broad Product Groups — Supply & Output (${selectedYear})`}
        subtitle="Domestic Output (Basic Prices) vs Imports of Goods/Services (£m current prices)"
        sourceNote="ONS Supply and Use Tables (S5) & ONS AI Thematic Account (S1)"
        tableData={chartData}
        tableColumns={[
          { key: 'code', header: 'CPA Code' },
          { key: 'name', header: 'Product Group Name' },
          { key: 'domestic_output', header: 'Domestic Output (£m)', format: (v) => formatGbpMillions(v) },
          { key: 'imports', header: 'Imports (£m)', format: (v) => formatGbpMillions(v) },
          { key: 'intermediate_demand', header: 'Intermediate Demand (£m)', format: (v) => formatGbpMillions(v) },
          { key: 'gfcf', header: 'GFCF (£m)', format: (v) => formatGbpMillions(v) },
          { key: 'exports', header: 'Exports (£m)', format: (v) => formatGbpMillions(v) }
        ]}
        exportFileName={`ons_cpa_sut_${selectedYear}`}
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="code" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#475569' }}
                tickFormatter={(v) => `£${v >= 1000 ? `${v / 1000}bn` : `${v}m`}`}
              />
              <Tooltip
                formatter={(value: any) => [`£${Number(value).toLocaleString()}m`, '']}
                labelFormatter={(label) => `CPA ${label}`}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="domestic_output" name="Domestic Output (Basic Prices)" fill="#0f172a" radius={[2, 2, 0, 0]} />
              <Bar dataKey="imports" name="Imports (Goods & Services)" fill="#64748b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AccessibleChartWrapper>

      {/* Main SUT Table & Product Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SUT Product Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900">
              Published SUT Matrix ({filteredProducts.length} Products)
            </h2>
            <span className="text-xs text-slate-500">Values in £ million</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                  <th scope="col" className="p-3">CPA Code</th>
                  <th scope="col" className="p-3">Product Label</th>
                  <th scope="col" className="p-3 text-right">Domestic Output</th>
                  <th scope="col" className="p-3 text-right">Imports</th>
                  <th scope="col" className="p-3 text-right">GFCF</th>
                  <th scope="col" className="p-3 text-right">Total Supply</th>
                  <th scope="col" className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredProducts.map((p) => {
                  const ts = p.time_series[selectedYear] || p.time_series['2023'];
                  const isSelected = activeProduct?.product_code === p.product_code;

                  return (
                    <tr
                      key={p.product_code}
                      onClick={() => setActiveProduct(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-100/90 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="p-3 font-bold text-slate-900">
                        {p.product_code.replace('CPA_', '')}
                      </td>
                      <td className="p-3 font-sans font-medium text-slate-900 max-w-[200px] truncate" title={p.product_name}>
                        {p.product_name}
                      </td>
                      <td className="p-3 text-right text-slate-800">
                        {formatGbpMillions(ts.domestic_output)}
                      </td>
                      <td className="p-3 text-right text-slate-800">
                        {formatGbpMillions(ts.imports)}
                      </td>
                      <td className="p-3 text-right text-slate-800">
                        {formatGbpMillions(ts.gfcf)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatGbpMillions(ts.total_supply)}
                      </td>
                      <td className="p-3 text-center">
                        <ChevronRight className="w-4 h-4 text-slate-400 inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Product Inspector Drawer */}
        <div className="lg:col-span-4">
          {activeProduct ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200">
                    {activeProduct.product_code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {activeProduct.sic_link}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {activeProduct.product_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Layer: <strong className="text-slate-700">{activeProduct.broad_layer}</strong>
                </p>
              </div>

              {/* Product AI Scope Notes */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">AI Scope & Measurement Notes:</span>
                <p>{activeProduct.ai_relevance_notes}</p>
              </div>

              {/* Time Series Breakdown 2020-2023 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Time Series Summary (£m)
                </span>
                <div className="divide-y divide-slate-100 text-xs font-mono">
                  {['2020', '2021', '2022', '2023'].map((yr) => {
                    const ts = activeProduct.time_series[yr];
                    return (
                      <div key={yr} className="py-1.5 flex justify-between items-center">
                        <span className="font-sans font-medium text-slate-600">{yr}</span>
                        <div className="space-x-3 text-right">
                          <span className="text-slate-500">Output: <strong>{formatGbpMillions(ts.domestic_output)}</strong></span>
                          <span className="text-slate-500">Imports: <strong>{formatGbpMillions(ts.imports)}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  href={`/disaggregation?product=${activeProduct.product_code}`}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sliders className="w-4 h-4 stroke-[1.75]" /> Disaggregate this Product in Lab
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedMeta(sutProvenance)}
                  className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 stroke-[1.75]" /> View Source Provenance
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select a product from the matrix to inspect its details.
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
