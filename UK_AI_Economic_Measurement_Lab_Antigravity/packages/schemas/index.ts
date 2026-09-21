/**
 * UK AI Economic Measurement Lab - Core TypeScript Schemas & Types
 * Defines data contracts across products, supply-use, disaggregation, classification, and SNA decision engine.
 */

export type StatisticalStatus =
  | 'Published official-statistics source'
  | 'Published research/context source'
  | 'Illustrative experimental estimate'
  | 'Prototype output';

export interface ProvenanceMeta {
  source_id: string;
  source_title: string;
  publisher: string;
  reference_period: string;
  release_date: string;
  retrieved_at: string;
  licence: string;
  statistical_status: StatisticalStatus;
  transformation_version: string;
  method_id?: string;
  model_version?: string;
  unit: string;
  notes?: string;
}

export interface CPAProductTimeSeries {
  domestic_output: number; // £m basic prices
  imports: number; // £m
  total_supply: number; // £m purchasers' prices
  intermediate_demand: number; // £m
  gfcf: number; // £m gross fixed capital formation
  exports: number; // £m
  final_consumption: number; // £m
}

export interface CPAProduct {
  product_code: string; // e.g. "CPA_J62"
  product_name: string; // e.g. "Computer programming, consultancy and related services"
  broad_layer: string;
  ons_thematic_group: 'AI goods & infrastructure' | 'Direct AI services' | 'Supporting AI services';
  sic_link: string;
  ai_relevance_notes: string;
  ai_illustrative_share_base: number; // 0.0 to 1.0
  ai_illustrative_share_low: number;
  ai_illustrative_share_high: number;
  time_series: Record<string, CPAProductTimeSeries>; // "2020", "2021", "2022", "2023"
}

export type DisaggregationMethodType = 'direct' | 'proportional' | 'modelled' | 'hybrid';

export interface DisaggregationParams {
  method: DisaggregationMethodType;
  product_code: string;
  reference_year: string;
  target_variable: 'domestic_output' | 'total_supply' | 'intermediate_demand' | 'gfcf' | 'exports';
  // Proportional parameters
  share_base?: number;
  share_low?: number;
  share_high?: number;
  // Direct parameters
  observed_ai_value?: number;
  observed_source_citation?: string;
  // Modelled parameters
  company_ai_probability_mean?: number;
  firm_ai_revenue_attribution_ratio?: number;
  // Hybrid parameters
  tier1_direct_value?: number;
  tier2_proportional_share?: number;
  tier3_modelled_residual_weight?: number;
}

export interface QualityScore {
  source_coverage: 'strong' | 'moderate' | 'weak' | 'unknown';
  conceptual_alignment: 'strong' | 'moderate' | 'weak' | 'unknown';
  empirical_validation: 'strong' | 'moderate' | 'weak' | 'unknown';
  uncertainty_width: 'strong' | 'moderate' | 'weak' | 'unknown';
  summary_rationale: string;
}

export interface DisaggregationResult {
  scenario_id: string;
  product_code: string;
  product_name: string;
  reference_year: string;
  target_variable: string;
  broad_total_value: number; // £m
  method: DisaggregationMethodType;
  method_version: string;
  estimated_ai_base: number; // £m
  estimated_ai_low: number; // £m
  estimated_ai_high: number; // £m
  estimated_non_ai_base: number; // £m
  implied_ai_share_base_pct: number;
  implied_ai_share_low_pct: number;
  implied_ai_share_high_pct: number;
  formula_latex: string;
  quality_score: QualityScore;
  provenance: ProvenanceMeta;
  sensitivity_curve: Array<{ share_pct: number; ai_value: number; non_ai_value: number }>;
  created_at: string;
}

export type AITaxonomyCategory =
  | 'data_analytics_forecasting'
  | 'ai_consulting_adoption'
  | 'workflow_document_automation'
  | 'finance_fintech_compliance'
  | 'customer_engagement_sales_marketing'
  | 'computer_vision_speech'
  | 'energy_environment_infrastructure'
  | 'robotics_autonomous_systems'
  | 'healthcare_life_sciences'
  | 'cybersecurity_safety_governance'
  | 'generative_ai_synthetic_content'
  | 'education_hr_workforce'
  | 'ai_platforms_models';

export interface CompanyClassificationRecord {
  business_id: string;
  company_name: string;
  sic_code: string;
  sic_description: string;
  text: string;
  ground_truth_labels?: AITaxonomyCategory[];
  ground_truth_ai_relevant?: boolean;
  ground_truth_dedicated?: boolean;
  is_hard_negative?: boolean;
}

export interface PredictionFeatureWeight {
  term: string;
  weight: number;
  direction: 'positive' | 'negative';
}

export type HumanReviewStatus = 'unreviewed' | 'accepted' | 'rejected' | 'amended' | 'adjudicated';

export interface ClassificationPrediction {
  business_id: string;
  company_name: string;
  model_type: 'rule_baseline' | 'tfidf_logistic';
  model_version: string;
  is_ai_relevant: boolean;
  ai_probability: number; // 0.0 to 1.0
  predicted_labels: AITaxonomyCategory[];
  is_dedicated: boolean;
  confidence_score: number;
  feature_contributions: PredictionFeatureWeight[];
  highlighted_terms: string[];
  review_status: HumanReviewStatus;
  reviewer_label?: boolean;
  reviewer_notes?: string;
  adjudicated_at?: string;
}

export interface ClassifierEvaluationMetrics {
  total_samples: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  confusion_matrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  per_label_metrics: Record<string, { precision: number; recall: number; f1: number; support: number }>;
}

export interface SNADecisionOption {
  id: string;
  label: string;
  description: string;
  next_node_id?: string;
  accounting_effect?: {
    national_accounts_category: 'Gross Fixed Capital Formation (GFCF)' | 'Intermediate Consumption' | 'Household Final Consumption' | 'Imports of Services' | 'Imports of Goods' | 'Own-Account Intangible Asset';
    asset_boundary: boolean;
    production_boundary: boolean;
    economic_ownership_uk: boolean;
    residency: 'UK Resident' | 'Rest of World (RoW)';
    primary_cpa: string;
    rationale: string;
    sna_citation: string;
  };
}

export interface SNADecisionNode {
  id: string;
  title: string;
  question: string;
  context_help: string;
  options: SNADecisionOption[];
}

export interface SNACaseStudy {
  id: string;
  title: string;
  firm_type: string;
  activity_summary: string;
  initial_answers: Record<string, string>;
  expected_treatment: string;
  key_national_accounts_insight: string;
}
