'use client';

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  Eye,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Sparkles,
  Search,
  Scale
} from 'lucide-react';
import { BENCHMARK_BUSINESS_CORPUS } from '@/lib/data';
import {
  classifyBusinessText,
  evaluateClassifierOnCorpus,
  TAXONOMY_RULES
} from '@packages/methods/classifier';
import {
  ClassificationPrediction,
  ClassifierEvaluationMetrics,
  CompanyClassificationRecord,
  HumanReviewStatus,
  ProvenanceMeta
} from '@packages/schemas';
import { CaveatBanner } from '@/components/provenance/CaveatBanner';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { ProvenanceDrawer } from '@/components/provenance/ProvenanceDrawer';
import { formatPercent } from '@/lib/utils';

export default function ClassifierPage() {
  const [selectedCorpusIndex, setSelectedCorpusIndex] = useState<number>(0);
  const [customText, setCustomText] = useState<string>(BENCHMARK_BUSINESS_CORPUS[0].text);
  const [customName, setCustomName] = useState<string>(BENCHMARK_BUSINESS_CORPUS[0].company_name);
  const [customSic, setCustomSic] = useState<string>(BENCHMARK_BUSINESS_CORPUS[0].sic_code);
  const [modelType, setModelType] = useState<'rule_baseline' | 'tfidf_logistic'>('tfidf_logistic');

  // Human review state
  const [reviewStatus, setReviewStatus] = useState<HumanReviewStatus>('unreviewed');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [reviewHistory, setReviewHistory] = useState<Array<{ id: string; name: string; status: string; notes: string; time: string }>>([]);

  const [selectedMeta, setSelectedMeta] = useState<ProvenanceMeta | null>(null);

  // Active record to classify
  const currentRecord: CompanyClassificationRecord = useMemo(() => {
    return {
      business_id: `DEMO-${selectedCorpusIndex}`,
      company_name: customName,
      sic_code: customSic,
      sic_description: 'Custom / Benchmark Firm',
      text: customText
    };
  }, [selectedCorpusIndex, customName, customSic, customText]);

  // Current Prediction
  const prediction: ClassificationPrediction = useMemo(() => {
    const pred = classifyBusinessText(currentRecord, modelType);
    return {
      ...pred,
      review_status: reviewStatus,
      reviewer_notes: reviewerNotes
    };
  }, [currentRecord, modelType, reviewStatus, reviewerNotes]);

  // Overall benchmark evaluation metrics
  const evaluationMetrics: ClassifierEvaluationMetrics = useMemo(() => {
    return evaluateClassifierOnCorpus(BENCHMARK_BUSINESS_CORPUS, modelType);
  }, [modelType]);

  const handleSelectPreloaded = (idx: number) => {
    setSelectedCorpusIndex(idx);
    const rec = BENCHMARK_BUSINESS_CORPUS[idx];
    setCustomName(rec.company_name);
    setCustomSic(rec.sic_code);
    setCustomText(rec.text);
    setReviewStatus('unreviewed');
    setReviewerNotes('');
  };

  const handleApplyReview = (status: HumanReviewStatus) => {
    setReviewStatus(status);
    setReviewHistory((prev) => [
      {
        id: currentRecord.business_id,
        name: currentRecord.company_name,
        status,
        notes: reviewerNotes || 'No reviewer notes provided',
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const classifierProvenance: ProvenanceMeta = {
    source_id: 'DS05',
    source_title: 'UK AI Business Classification Research Benchmark & ONS Table 3 Taxonomy (S1)',
    publisher: 'UK AI Economic Measurement Lab',
    reference_period: '2026',
    release_date: '2026-09-21',
    retrieved_at: '2026-09-21T12:00:00Z',
    licence: 'Open Government Licence v3.0 / Research Use',
    statistical_status: 'Prototype output',
    transformation_version: 'clf-v1.4.0',
    model_version: prediction.model_version,
    unit: 'Multi-label probabilities and classification flags',
    notes: 'Population identification aid. Being classified as AI-relevant does not mean 100% of firm revenue is AI output.'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">
                POPULATION IDENTIFICATION
              </span>
              <ProvenanceBadge
                status="Prototype output"
                sourceId="DS05 / S1"
                onClick={() => setSelectedMeta(classifierProvenance)}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-govuk-blue" />
              AI Business Classification & Validation Lab
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start">
            <span className="text-xs font-semibold text-slate-600">Model Engine:</span>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-govuk-blue focus:ring-2 focus:ring-govuk-blue"
            >
              <option value="tfidf_logistic">TF-IDF + Calibrated Logistic Regression</option>
              <option value="rule_baseline">Rule-Based Dictionary Baseline</option>
            </select>
          </div>
        </div>

        <CaveatBanner type="experimental_warning">
          <strong>Statistical Guardrail:</strong> Business classification is a <strong>population identification aid</strong>, not financial attribution.
          Being identified as an AI-relevant enterprise does not imply that 100% of the firm’s turnover or GVA is AI economic output.
          Diversified firms require product-level disaggregation. Human review is mandatory for official register curation.
        </CaveatBanner>
      </div>

      {/* Main Grid: Input & Interactive Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input text & Pre-loaded Samples */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-sm text-slate-900">
                Business Description Input
              </h2>
              <span className="text-[11px] text-slate-500">Benchmark Corpus: 60 UK Firms</span>
            </div>

            {/* Quick selector of pre-loaded examples */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Select from Curated UK Benchmark Samples:
              </label>
              <select
                value={selectedCorpusIndex}
                onChange={(e) => handleSelectPreloaded(parseInt(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-govuk-blue"
              >
                {BENCHMARK_BUSINESS_CORPUS.map((rec, idx) => (
                  <option key={rec.business_id} value={idx}>
                    [{rec.sic_code}] {rec.company_name} {rec.is_hard_negative ? '(Hard Negative Example)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Name & SIC */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Company Name:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">SIC Code:</label>
                <input
                  type="text"
                  value={customSic}
                  onChange={(e) => setCustomSic(e.target.value)}
                  className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                />
              </div>
            </div>

            {/* Free text area */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Business Activity & Product Description:
              </label>
              <textarea
                rows={5}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setReviewStatus('unreviewed');
                }}
                placeholder="Enter company descriptive text, website summary, or Companies House filing..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-900 focus:ring-2 focus:ring-govuk-blue focus:bg-white"
              />
            </div>

            {/* Human Review Panel */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Human Expert Review & Adjudication
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                    reviewStatus === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : reviewStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : reviewStatus === 'amended'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Status: {reviewStatus}
                </span>
              </div>

              <input
                type="text"
                placeholder="Reviewer rationale / audit notes..."
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                className="w-full py-1.5 px-3 bg-white border border-slate-200 rounded text-xs text-slate-800"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleApplyReview('accepted')}
                  className="flex-1 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 flex items-center justify-center gap-1 shadow-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Accept Classification
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyReview('rejected')}
                  className="flex-1 py-1.5 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800 flex items-center justify-center gap-1 shadow-xs"
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> Reject / Hard Negative
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyReview('amended')}
                  className="py-1.5 px-3 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700"
                >
                  Amend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Details & Explainability */}
        <div className="lg:col-span-6 space-y-6">
          {/* Classification Outcome Card */}
          <div
            className={`rounded-xl border-2 p-6 shadow-xs transition-all ${
              prediction.is_ai_relevant
                ? 'bg-emerald-50/50 border-emerald-500'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Model Prediction Output
                </span>
                <div className="flex items-center gap-2">
                  {prediction.is_ai_relevant ? (
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <span>AI-Relevant Business Entity</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xl">
                      <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
                      <span>Non-Core / Non-AI Business</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">AI Probability:</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {formatPercent(prediction.ai_probability * 100, 1)}
                </span>
              </div>
            </div>

            {/* Multi-label ONS Table 3 tags */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Identified AI Sub-Activity Categories ({prediction.predicted_labels.length}):
              </span>
              {prediction.predicted_labels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {prediction.predicted_labels.map((catKey) => {
                    const rule = TAXONOMY_RULES[catKey];
                    return (
                      <span
                        key={catKey}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-govuk-blue shadow-xs"
                      >
                        {rule?.label || catKey}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No direct ONS Table 3 AI activity categories detected.
                </p>
              )}
            </div>

            {/* Firm Type: Dedicated vs Diversified */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Firm Specialisation Type:</span>
              <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                {prediction.is_dedicated ? 'Dedicated AI Specialist Firm' : 'Diversified / Multi-Product Entity'}
              </span>
            </div>
          </div>

          {/* Feature Explainability & Term Weights */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Feature Weights & Explainability
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">{prediction.model_version}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-600 block">
                Top detected terms driving the prediction score:
              </span>
              <div className="space-y-1.5">
                {prediction.feature_contributions.slice(0, 6).map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-200"
                  >
                    <span className="font-mono font-medium text-slate-800">"{feat.term}"</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        feat.direction === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {feat.weight > 0 ? `+${feat.weight}` : feat.weight}
                    </span>
                  </div>
                ))}
                {prediction.feature_contributions.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No salient vocabulary features detected.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Evaluation Dashboard */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Benchmark Corpus Evaluation & Performance Metrics
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated across 60 ground-truth annotated UK businesses with dedicated, diversified, and hard negative samples.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
            Engine: {modelType}
          </span>
        </div>

        {/* Evaluation Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Accuracy</span>
            <span className="text-xl font-bold font-mono text-slate-900">{formatPercent(evaluationMetrics.accuracy * 100, 1)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Precision</span>
            <span className="text-xl font-bold font-mono text-emerald-700">{formatPercent(evaluationMetrics.precision * 100, 1)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">Recall</span>
            <span className="text-xl font-bold font-mono text-govuk-blue">{formatPercent(evaluationMetrics.recall * 100, 1)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">F1-Score</span>
            <span className="text-xl font-bold font-mono text-purple-700">{formatPercent(evaluationMetrics.f1_score * 100, 1)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">ROC-AUC</span>
            <span className="text-xl font-bold font-mono text-slate-900">{evaluationMetrics.roc_auc.toFixed(2)}</span>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Confusion Matrix (Binary AI Relevance)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                <span className="text-slate-500 block">True Positives (TP):</span>
                <span className="text-lg font-bold font-mono text-emerald-800">{evaluationMetrics.confusion_matrix.tp}</span>
                <span className="text-[10px] text-slate-500 block">Correctly identified AI firms</span>
              </div>
              <div className="bg-rose-50 p-3 rounded border border-rose-200">
                <span className="text-slate-500 block">False Positives (FP):</span>
                <span className="text-lg font-bold font-mono text-rose-800">{evaluationMetrics.confusion_matrix.fp}</span>
                <span className="text-[10px] text-slate-500 block">Hard negatives misclassified</span>
              </div>
              <div className="bg-rose-50 p-3 rounded border border-rose-200">
                <span className="text-slate-500 block">False Negatives (FN):</span>
                <span className="text-lg font-bold font-mono text-rose-800">{evaluationMetrics.confusion_matrix.fn}</span>
                <span className="text-[10px] text-slate-500 block">AI firms missed</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-slate-500 block">True Negatives (TN):</span>
                <span className="text-lg font-bold font-mono text-slate-800">{evaluationMetrics.confusion_matrix.tn}</span>
                <span className="text-[10px] text-slate-500 block">Correctly identified non-AI</span>
              </div>
            </div>
          </div>

          {/* Review Audit Trail Log */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Recent Human Review Decisions ({reviewHistory.length})
            </span>
            <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              {reviewHistory.length > 0 ? (
                reviewHistory.map((h, i) => (
                  <div key={i} className="py-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{h.name}</span>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{h.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-white border">
                        {h.status}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{h.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic text-center py-4">No human review actions recorded yet in this session.</p>
              )}
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
