"""
Python schemas and data structures for UK AI Economic Measurement Lab
"""
from dataclasses import dataclass, field
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
