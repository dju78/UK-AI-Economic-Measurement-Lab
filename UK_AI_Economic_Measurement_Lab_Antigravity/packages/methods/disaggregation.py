"""
Python Disaggregation Engine for UK AI Economic Measurement Lab
"""
from typing import Dict, Any
from datetime import datetime
from packages.schemas.types import CPAProduct, DisaggregationParams, DisaggregationResult

def run_disaggregation(product: CPAProduct, params: DisaggregationParams) -> DisaggregationResult:
    year_data = product.time_series.get(params.reference_year, product.time_series.get("2023", {}))
    broad_total = year_data.get(params.target_variable, year_data.get("domestic_output", 0.0))

    estimated_ai_base = 0.0
    estimated_ai_low = 0.0
    estimated_ai_high = 0.0
    formula_latex = ""

    if params.method == "direct":
        observed = params.observed_ai_value or 0.0
        estimated_ai_base = min(observed, broad_total)
        estimated_ai_low = max(0.0, estimated_ai_base * 0.85)
        estimated_ai_high = min(broad_total, estimated_ai_base * 1.15)
        formula_latex = f"\\text{{AI}} = \\min(V_{{\\text{{observed}}}}, \\text{{Broad}}) = \\min({estimated_ai_base:.1f}, {broad_total:.1f})"

    elif params.method == "proportional":
        share_base = params.share_base if params.share_base is not None else product.ai_illustrative_share_base
        share_low = params.share_low if params.share_low is not None else product.ai_illustrative_share_low
        share_high = params.share_high if params.share_high is not None else product.ai_illustrative_share_high

        estimated_ai_base = broad_total * share_base
        estimated_ai_low = broad_total * share_low
        estimated_ai_high = broad_total * share_high
        formula_latex = f"\\text{{AI}} = \\text{{Broad}} \\times s_{{\\text{{AI}}}} = {broad_total:.1f} \\times {share_base*100:.1f}\\%"

    elif params.method == "modelled":
        p_ai = params.company_ai_probability_mean if params.company_ai_probability_mean is not None else 0.45
        r_ai = params.firm_ai_revenue_attribution_ratio if params.firm_ai_revenue_attribution_ratio is not None else 0.35
        compound = p_ai * r_ai

        estimated_ai_base = broad_total * compound
        estimated_ai_low = broad_total * max(0.0, (p_ai - 0.15) * (r_ai - 0.12))
        estimated_ai_high = broad_total * min(1.0, (p_ai + 0.15) * (r_ai + 0.15))
        formula_latex = f"\\text{{AI}} = \\text{{Broad}} \\times (p_{{\\text{{AI}}}} \\times r_{{\\text{{AI}}}}) = {broad_total:.1f} \\times ({p_ai*100:.1f}\\% \\times {r_ai*100:.1f}\\%)"

    elif params.method == "hybrid":
        direct_tier = min(params.tier1_direct_value if params.tier1_direct_value is not None else (broad_total * 0.04), broad_total)
        res1 = max(0.0, broad_total - direct_tier)
        prop_share = params.tier2_proportional_share if params.tier2_proportional_share is not None else 0.08
        prop_tier = res1 * prop_share
        res2 = max(0.0, res1 - prop_tier)
        mod_weight = params.tier3_modelled_residual_weight if params.tier3_modelled_residual_weight is not None else 0.05
        mod_tier = res2 * mod_weight

        estimated_ai_base = direct_tier + prop_tier + mod_tier
        estimated_ai_low = direct_tier + prop_tier * 0.7 + mod_tier * 0.5
        estimated_ai_high = min(broad_total, direct_tier + prop_tier * 1.3 + mod_tier * 1.6)
        formula_latex = f"\\text{{AI}} = V_{{\\text{{direct}}}} + (\\text{{Res}}_1 \\times s) + (\\text{{Res}}_2 \\times w) = {direct_tier:.1f} + {prop_tier:.1f} + {mod_tier:.1f}"

    # Guardrails
    estimated_ai_base = max(0.0, min(broad_total, estimated_ai_base))
    estimated_ai_low = max(0.0, min(estimated_ai_base, estimated_ai_low))
    estimated_ai_high = max(estimated_ai_base, min(broad_total, estimated_ai_high))
    estimated_non_ai_base = broad_total - estimated_ai_base

    return DisaggregationResult(
        scenario_id=f"SCN-{params.product_code}-{params.method}",
        product_code=product.product_code,
        product_name=product.product_name,
        reference_year=params.reference_year,
        target_variable=params.target_variable,
        broad_total_value=round(broad_total, 1),
        method=params.method,
        method_version=f"{params.method}-py-v1.0",
        estimated_ai_base=round(estimated_ai_base, 1),
        estimated_ai_low=round(estimated_ai_low, 1),
        estimated_ai_high=round(estimated_ai_high, 1),
        estimated_non_ai_base=round(estimated_non_ai_base, 1),
        implied_ai_share_base_pct=round((estimated_ai_base / broad_total) * 100, 1) if broad_total > 0 else 0.0,
        implied_ai_share_low_pct=round((estimated_ai_low / broad_total) * 100, 1) if broad_total > 0 else 0.0,
        implied_ai_share_high_pct=round((estimated_ai_high / broad_total) * 100, 1) if broad_total > 0 else 0.0,
        formula_latex=formula_latex,
        created_at=datetime.utcnow().isoformat() + "Z"
    )
