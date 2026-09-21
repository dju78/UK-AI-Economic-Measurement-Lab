'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sliders,
  RotateCcw,
  Download,
  Share2,
  FlaskConical,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Layers,
  FileCode2,
  Table as TableIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ALL_CPA_PRODUCTS, getProductByCode } from '@/lib/data';
import { runDisaggregation } from '@packages/methods/disaggregation';
import { DisaggregationMethodType, DisaggregationParams, ProvenanceMeta } from '@packages/schemas';
import { formatGbpMillions, formatPercent } from '@/lib/utils';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { AccessibleChartWrapper } from '@/components/charts/AccessibleChartWrapper';

function DisaggregationLabContent() {
  const searchParams = useSearchParams();
  const initialProductCode = searchParams.get('product') || 'CPA_J62';

  const [selectedProductCode, setSelectedProductCode] = useState<string>(initialProductCode);
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [targetVariable, setTargetVariable] = useState<'domestic_output' | 'total_supply' | 'intermediate_demand' | 'gfcf' | 'exports'>('domestic_output');
  const [selectedMethod, setSelectedMethod] = useState<DisaggregationMethodType>('proportional');

  // Proportional parameters
  const [shareBase, setShareBase] = useState<number>(0.165);
  const [shareLow, setShareLow] = useState<number>(0.090);
  const [shareHigh, setShareHigh] = useState<number>(0.280);

  // Direct parameters
  const [observedValue, setObservedValue] = useState<number>(16800);
  const [observedSource, setObservedSource] = useState<string>('DSIT AI Sector Study 2024 (S8)');

  // Modelled parameters
  const [companyProb, setCompanyProb] = useState<number>(0.45);
  const [revenueRatio, setRevenueRatio] = useState<number>(0.35);

  // Hybrid parameters
  const [tier1Direct, setTier1Direct] = useState<number>(4500);
  const [tier2Prop, setTier2Prop] = useState<number>(0.12);
  const [tier3Model, setTier3Model] = useState<number>(0.06);

  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  const currentProduct = useMemo(() => {
    return getProductByCode(selectedProductCode) || ALL_CPA_PRODUCTS[12];
  }, [selectedProductCode]);

  // Reset to default product defaults when product changes
  const handleProductChange = (code: string) => {
    setSelectedProductCode(code);
    const prod = getProductByCode(code);
    if (prod) {
      setShareBase(prod.ai_illustrative_share_base);
      setShareLow(prod.ai_illustrative_share_low);
      setShareHigh(prod.ai_illustrative_share_high);
      const output = prod.time_series[selectedYear]?.domestic_output || 10000;
      setObservedValue(Math.round(output * prod.ai_illustrative_share_base));
      setTier1Direct(Math.round(output * 0.04));
    }
  };

  const currentParams: DisaggregationParams = useMemo(() => {
    return {
      method: selectedMethod,
      product_code: currentProduct.product_code,
      reference_year: selectedYear,
      target_variable: targetVariable,
      share_base: shareBase,
      share_low: shareLow,
      share_high: shareHigh,
      observed_ai_value: observedValue,
      company_ai_probability_mean: companyProb,
      firm_ai_revenue_attribution_ratio: revenueRatio,
      tier1_direct_value: tier1Direct,
      tier2_proportional_share: tier2Prop,
      tier3_modelled_residual_weight: tier3Model
    };
  }, [
    selectedMethod,
    currentProduct,
    selectedYear,
    targetVariable,
    shareBase,
    shareLow,
    shareHigh,
    observedValue,
    companyProb,
    revenueRatio,
    tier1Direct,
    tier2Prop,
    tier3Model
  ]);

  const result = useMemo(() => {
    return runDisaggregation(currentProduct, currentParams);
  }, [currentProduct, currentParams]);

  // Method comparison data
  const comparisonData = useMemo(() => {
    const methods: DisaggregationMethodType[] = ['direct', 'proportional', 'modelled', 'hybrid'];
    return methods.map((m) => {
      const res = runDisaggregation(currentProduct, { ...currentParams, method: m });
      return {
        methodName: m.toUpperCase(),
        ai_base: res.estimated_ai_base,
        ai_low: res.estimated_ai_low,
        ai_high: res.estimated_ai_high,
        non_ai: res.estimated_non_ai_base,
        share_pct: res.implied_ai_share_base_pct
      };
    });
  }, [currentProduct, currentParams]);

  // Export scenario JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${result.scenario_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                EXPERIMENTAL METHODOLOGY
              </span>
              <ProvenanceBadge
                status="Illustrative experimental estimate"
                sourceId="Lab Scenario"
                onClick={() => setSelectedMeta(result.provenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-6 h-6 text-govuk-blue" />
              AI/Non-AI Disaggregation Laboratory
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Scenario JSON
            </button>
          </div>
        </div>

        <CaveatBanner type="experimental_warning">
          <strong>Research Environment:</strong> Disaggregation outputs are experimental simulations designed to evaluate sensitivity to allocation rules.
          They are <strong>not official ONS statistical estimates</strong>. All calculations preserve the strict identity: <code>Broad Total = AI Component + Non-AI Component</code>.
        </CaveatBanner>
      </div>

      {/* Main Lab Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter & Method Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900">Scenario Configuration</h2>
              <button
                type="button"
                onClick={() => handleProductChange(selectedProductCode)}
                className="text-[11px] text-slate-500 hover:text-govuk-blue flex items-center gap-1"
                title="Reset parameters to documented baseline"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* 1. Target Product Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Target CPA Product Group:
              </label>
              <select
                value={selectedProductCode}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-govuk-blue"
              >
                {ALL_CPA_PRODUCTS.map((p) => (
                  <option key={p.product_code} value={p.product_code}>
                    {p.product_code.replace('CPA_', '')} — {p.product_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Target Variable & Reference Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">SUT Variable:</label>
                <select
                  value={targetVariable}
                  onChange={(e) => setTargetVariable(e.target.value as any)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                >
                  <option value="domestic_output">Domestic Output</option>
                  <option value="total_supply">Total Supply</option>
                  <option value="intermediate_demand">Intermediate Demand</option>
                  <option value="gfcf">GFCF (Investment)</option>
                  <option value="exports">Exports</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900"
                >
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>

            {/* 3. Method Family Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">
                Disaggregation Method Family:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'proportional', label: 'Proportional' },
                  { id: 'direct', label: 'Direct' },
                  { id: 'modelled', label: 'Modelled' },
                  { id: 'hybrid', label: 'Hybrid' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as DisaggregationMethodType)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      selectedMethod === m.id
                        ? 'bg-govuk-blue text-white border-govuk-blue shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Parameter Sliders based on selected method */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              {selectedMethod === 'proportional' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-800">
                      <span>Base AI Share Assumption:</span>
                      <span className="font-mono text-govuk-blue">{formatPercent(shareBase * 100, 1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.50"
                      step="0.005"
                      value={shareBase}
                      onChange={(e) => setShareBase(parseFloat(e.target.value))}
                      className="w-full accent-govuk-blue cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Low Bound: {formatPercent(shareLow * 100, 1)}
                      </span>
                      <input
                        type="range"
                        min="0.005"
                        max={shareBase}
                        step="0.005"
                        value={shareLow}
                        onChange={(e) => setShareLow(parseFloat(e.target.value))}
                        className="w-full accent-slate-600"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        High Bound: {formatPercent(shareHigh * 100, 1)}
                      </span>
                      <input
                        type="range"
                        min={shareBase}
                        max="0.60"
                        step="0.005"
                        value={shareHigh}
                        onChange={(e) => setShareHigh(parseFloat(e.target.value))}
                        className="w-full accent-slate-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'direct' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1">
                      Observed AI Monetary Value (£m):
                    </label>
                    <input
                      type="number"
                      value={observedValue}
                      onChange={(e) => setObservedValue(parseFloat(e.target.value) || 0)}
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1">
                      Source Evidence Citation:
                    </label>
                    <input
                      type="text"
                      value={observedSource}
                      onChange={(e) => setObservedSource(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'modelled' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-800">
                      <span>Mean Firm AI Probability (p_AI):</span>
                      <span className="font-mono text-govuk-blue">{formatPercent(companyProb * 100, 1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={companyProb}
                      onChange={(e) => setCompanyProb(parseFloat(e.target.value))}
                      className="w-full accent-govuk-blue"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-800">
                      <span>Revenue Attribution Ratio (r_AI):</span>
                      <span className="font-mono text-purple-700">{formatPercent(revenueRatio * 100, 1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={revenueRatio}
                      onChange={(e) => setRevenueRatio(parseFloat(e.target.value))}
                      className="w-full accent-purple-700"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'hybrid' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Tier 1: Direct Verified Value (£m):
                    </span>
                    <input
                      type="number"
                      value={tier1Direct}
                      onChange={(e) => setTier1Direct(parseFloat(e.target.value) || 0)}
                      className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Tier 2: Proportional Residual Share: {formatPercent(tier2Prop * 100, 1)}
                    </span>
                    <input
                      type="range"
                      min="0.01"
                      max="0.30"
                      step="0.01"
                      value={tier2Prop}
                      onChange={(e) => setTier2Prop(parseFloat(e.target.value))}
                      className="w-full accent-govuk-blue"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Tier 3: Modelled Gap Weight: {formatPercent(tier3Model * 100, 1)}
                    </span>
                    <input
                      type="range"
                      min="0.01"
                      max="0.20"
                      step="0.01"
                      value={tier3Model}
                      onChange={(e) => setTier3Model(parseFloat(e.target.value))}
                      className="w-full accent-purple-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quality Assessment Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Scenario Quality & Evidence Rating
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Source Coverage:</span>
                <span className="font-bold capitalize text-slate-900">{result.quality_score.source_coverage}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Conceptual Alignment:</span>
                <span className="font-bold capitalize text-slate-900">{result.quality_score.conceptual_alignment}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Empirical Validation:</span>
                <span className="font-bold capitalize text-slate-900">{result.quality_score.empirical_validation}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Uncertainty Width:</span>
                <span className="font-bold capitalize text-slate-900">{result.quality_score.uncertainty_width}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              {result.quality_score.summary_rationale}
            </p>
          </div>
        </div>

        {/* Right Column: Decomposition Results & Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Output Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Published Broad Total
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {formatGbpMillions(result.broad_total_value)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {result.target_variable.replace('_', ' ')} ({result.reference_year})
              </span>
            </div>

            <div className="bg-white rounded-xl border-2 border-govuk-blue p-5 shadow-xs">
              <span className="text-xs font-semibold text-govuk-blue uppercase tracking-wider block mb-1">
                Modelled AI Component
              </span>
              <div className="text-2xl font-bold font-mono text-govuk-blue">
                {formatGbpMillions(result.estimated_ai_base)}
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-1 block">
                Implied AI Share: <strong>{result.implied_ai_share_base_pct}%</strong>
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Estimated Non-AI Residual
              </span>
              <div className="text-2xl font-bold font-mono text-slate-700">
                {formatGbpMillions(result.estimated_non_ai_base)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Identity: AI + Non-AI = Broad
              </span>
            </div>
          </div>

          {/* Mathematical Formula Banner */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                Active Calculation Specification ({result.method.toUpperCase()})
              </span>
              <span>Version: {result.method_version}</span>
            </div>
            <div className="py-1 text-amber-300 text-sm overflow-x-auto">
              <code>{result.formula_latex}</code>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 font-sans">
              Uncertainty Range: [{formatGbpMillions(result.estimated_ai_low)} – {formatGbpMillions(result.estimated_ai_high)}]
            </div>
          </div>

          {/* Chart 1: Decomposition Stack Comparison */}
          <AccessibleChartWrapper
            title={`Method Family Comparison for ${result.product_code}`}
            subtitle={`Comparing AI Component vs Non-AI Component across 4 Method Families (${result.reference_year})`}
            sourceNote="UK AI Economic Measurement Lab Disaggregation Engine"
            tableData={comparisonData}
            tableColumns={[
              { key: 'methodName', header: 'Method' },
              { key: 'ai_base', header: 'Estimated AI Base (£m)', format: (v) => formatGbpMillions(v) },
              { key: 'ai_low', header: 'Estimated AI Low (£m)', format: (v) => formatGbpMillions(v) },
              { key: 'ai_high', header: 'Estimated AI High (£m)', format: (v) => formatGbpMillions(v) },
              { key: 'non_ai', header: 'Non-AI Residual (£m)', format: (v) => formatGbpMillions(v) },
              { key: 'share_pct', header: 'Implied Share (%)', format: (v) => formatPercent(v) }
            ]}
            exportFileName={`disaggregation_comparison_${result.product_code}`}
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="methodName" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#475569' }}
                    tickFormatter={(v) => `£${v >= 1000 ? `${v / 1000}bn` : `${v}m`}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`£${Number(value).toLocaleString()}m`, '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="ai_base" name="Modelled AI Component (£m)" stackId="a" fill="#1d70b8" />
                  <Bar dataKey="non_ai" name="Non-AI Residual (£m)" stackId="a" fill="#cbd5e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AccessibleChartWrapper>

          {/* Chart 2: 20-Point Sensitivity Response Curve */}
          <AccessibleChartWrapper
            title="Sensitivity Analysis: Implied AI Output vs Assumed Share Curve"
            subtitle={`Tracing AI component response across 0% to 50% AI share of ${result.product_code} (£m)`}
            sourceNote="Deterministic calculation: AI_Value = Broad_Total * Share"
            tableData={result.sensitivity_curve}
            tableColumns={[
              { key: 'share_pct', header: 'Assumed AI Share (%)', format: (v) => `${v}%` },
              { key: 'ai_value', header: 'Implied AI Value (£m)', format: (v) => formatGbpMillions(v) },
              { key: 'non_ai_value', header: 'Non-AI Residual (£m)', format: (v) => formatGbpMillions(v) }
            ]}
            exportFileName={`sensitivity_curve_${result.product_code}`}
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.sensitivity_curve} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="share_pct" unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#475569' }}
                    tickFormatter={(v) => `£${v >= 1000 ? `${v / 1000}bn` : `${v}m`}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`£${Number(value).toLocaleString()}m`, '']}
                    labelFormatter={(label) => `Assumed AI Share: ${label}%`}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="ai_value" name="Modelled AI Component" stroke="#1d70b8" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="non_ai_value" name="Non-AI Residual" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AccessibleChartWrapper>
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

export default function DisaggregationLabPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          Loading Disaggregation Laboratory...
        </div>
      }
    >
      <DisaggregationLabContent />
    </Suspense>
  );
}
