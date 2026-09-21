"""
Python schemas and data structures for UK AI Economic Measurement Lab
"""
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Any

@dataclass
class CPAProductTimeSeries:
    domestic_output: float
    imports: float
    total_supply: float
    intermediate_demand: float
    gfcf: float
    exports: float
    final_consumption: float

@dataclass
class CPAProduct:
    product_code: str
    product_name: str
    broad_layer: str
    ons_thematic_group: str
    sic_link: str
    ai_relevance_notes: str
    ai_illustrative_share_base: float
    ai_illustrative_share_low: float
    ai_illustrative_share_high: float
    time_series: Dict[str, Dict[str, float]]

@dataclass
class DisaggregationParams:
    method: str
    product_code: str
    reference_year: str
    target_variable: str = "domestic_output"
    share_base: Optional[float] = None
    share_low: Optional[float] = None
    share_high: Optional[float] = None
    observed_ai_value: Optional[float] = None
    company_ai_probability_mean: Optional[float] = None
    firm_ai_revenue_attribution_ratio: Optional[float] = None
    tier1_direct_value: Optional[float] = None
    tier2_proportional_share: Optional[float] = None
    tier3_modelled_residual_weight: Optional[float] = None

@dataclass
class DisaggregationResult:
    scenario_id: str
    product_code: str
    product_name: str
    reference_year: str
    target_variable: str
    broad_total_value: float
    method: str
    method_version: str
    estimated_ai_base: float
    estimated_ai_low: float
    estimated_ai_high: float
    estimated_non_ai_base: float
    implied_ai_share_base_pct: float
    implied_ai_share_low_pct: float
    implied_ai_share_high_pct: float
    formula_latex: str
    created_at: str

    def dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class CompanyClassificationRecord:
    business_id: str
    company_name: str
    sic_code: Optional[str] = None
    sic_description: Optional[str] = None
    text: str = ""
    ground_truth_labels: Optional[List[str]] = None
    ground_truth_ai_relevant: Optional[bool] = None
    ground_truth_dedicated: Optional[bool] = None
    is_hard_negative: Optional[bool] = None

@dataclass
class PredictionFeatureWeight:
    term: str
    weight: float
    direction: str

@dataclass
class ClassificationPrediction:
    business_id: str
    company_name: str
    model_type: str
    model_version: str
    is_ai_relevant: bool
    ai_probability: float
    predicted_labels: List[str]
    is_dedicated: bool
    confidence_score: float
    feature_contributions: List[PredictionFeatureWeight]
    highlighted_terms: List[str]
    review_status: str

@dataclass
class ClassifierEvaluationMetrics:
    total_samples: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    true_positives: int
    false_positives: int
    true_negatives: int
    false_negatives: int
    confusion_matrix: Dict[str, int]
    per_label_metrics: Dict[str, Dict[str, Any]]

@dataclass
class SNACaseStudy:
    id: str
    title: str
    firm_type: str
    activity_summary: str
    initial_answers: Dict[str, str]
    expected_treatment: str
    key_national_accounts_insight: str
