import {
  DisaggregationParams,
  DisaggregationResult,
  QualityScore,
  CPAProduct
} from '../schemas';

/**
 * AI/Non-AI Disaggregation Engine
 * Implements Direct, Proportional, Modelled, and Hybrid statistical disaggregation
 * adhering strictly to the constraint: Broad_Total = AI_Component + Non_AI_Component
 */
export function runDisaggregation(
  product: CPAProduct,
  params: DisaggregationParams
): DisaggregationResult {
  const yearData = product.time_series[params.reference_year] || product.time_series['2023'];
  const broadTotal = yearData[params.target_variable] || yearData.domestic_output;

  let estimatedAIBase = 0;
  let estimatedAILow = 0;
  let estimatedAIHigh = 0;
  let formulaLatex = '';
  let quality: QualityScore;

  switch (params.method) {
    case 'direct': {
      const observed = params.observed_ai_value ?? 0;
      estimatedAIBase = Math.min(observed, broadTotal);
      estimatedAILow = Math.max(0, estimatedAIBase * 0.85);
      estimatedAIHigh = Math.min(broadTotal, estimatedAIBase * 1.15);
      formulaLatex = `\\text{AI} = \\min(V_{\\text{observed}}, \\text{Broad}) = \\min(${estimatedAIBase.toFixed(1)}, ${broadTotal.toFixed(1)}) = ${estimatedAIBase.toFixed(1)}`;
      quality = {
        source_coverage: 'strong',
        conceptual_alignment: 'strong',
        empirical_validation: 'strong',
        uncertainty_width: 'strong',
        summary_rationale: 'Direct observed value from audited or dedicated source survey with bounded measurement error.'
      };
      break;
    }

    case 'proportional': {
      const shareBase = params.share_base ?? product.ai_illustrative_share_base;
      const shareLow = params.share_low ?? product.ai_illustrative_share_low;
      const shareHigh = params.share_high ?? product.ai_illustrative_share_high;

      estimatedAIBase = broadTotal * shareBase;
      estimatedAILow = broadTotal * shareLow;
      estimatedAIHigh = broadTotal * shareHigh;
      formulaLatex = `\\text{AI} = \\text{Broad} \\times s_{\\text{AI}} = ${broadTotal.toFixed(1)} \\times ${(shareBase * 100).toFixed(1)}\\% = ${estimatedAIBase.toFixed(1)}`;
      quality = {
        source_coverage: 'moderate',
        conceptual_alignment: 'moderate',
        empirical_validation: 'weak',
        uncertainty_width: 'moderate',
        summary_rationale: 'Applies uniform share across broad CPA group; sensitivity tested via low/base/high bounds.'
      };
      break;
    }

    case 'modelled': {
      const pAI = params.company_ai_probability_mean ?? 0.45;
      const rAI = params.firm_ai_revenue_attribution_ratio ?? 0.35;
      const compoundShare = pAI * rAI;

      estimatedAIBase = broadTotal * compoundShare;
      estimatedAILow = broadTotal * Math.max(0, (pAI - 0.15) * (rAI - 0.12));
      estimatedAIHigh = broadTotal * Math.min(1.0, (pAI + 0.15) * (rAI + 0.15));
      formulaLatex = `\\text{AI} = \\text{Broad} \\times (p_{\\text{AI}} \\times r_{\\text{AI}}) = ${broadTotal.toFixed(1)} \\times (${(pAI * 100).toFixed(1)}\\% \\times ${(rAI * 100).toFixed(1)}\\%) = ${estimatedAIBase.toFixed(1)}`;
      quality = {
        source_coverage: 'moderate',
        conceptual_alignment: 'strong',
        empirical_validation: 'moderate',
        uncertainty_width: 'weak',
        summary_rationale: 'Modelled decomposition separating firm AI probability from revenue attribution proportion.'
      };
      break;
    }

    case 'hybrid': {
      const directTier = Math.min(params.tier1_direct_value ?? (broadTotal * 0.04), broadTotal);
      const residualAfterDirect = Math.max(0, broadTotal - directTier);
      const propShare = params.tier2_proportional_share ?? 0.08;
      const propTier = residualAfterDirect * propShare;
      const residualAfterProp = Math.max(0, residualAfterDirect - propTier);
      const modelWeight = params.tier3_modelled_residual_weight ?? 0.05;
      const modelTier = residualAfterProp * modelWeight;

      estimatedAIBase = directTier + propTier + modelTier;
      estimatedAILow = directTier + propTier * 0.7 + modelTier * 0.5;
      estimatedAIHigh = Math.min(broadTotal, directTier + propTier * 1.3 + modelTier * 1.6);
      formulaLatex = `\\text{AI} = V_{\\text{direct}} + (\\text{Res}_1 \\times s_{\\text{prop}}) + (\\text{Res}_2 \\times w_{\\text{mod}}) = ${directTier.toFixed(1)} + ${propTier.toFixed(1)} + ${modelTier.toFixed(1)} = ${estimatedAIBase.toFixed(1)}`;
      quality = {
        source_coverage: 'strong',
        conceptual_alignment: 'strong',
        empirical_validation: 'moderate',
        uncertainty_width: 'moderate',
        summary_rationale: 'Tiered hierarchy prioritizing verified direct accounting facts before residual modelling.'
      };
      break;
    }
  }

  // Ensure mathematical guardrails
  estimatedAIBase = Math.max(0, Math.min(broadTotal, estimatedAIBase));
  estimatedAILow = Math.max(0, Math.min(estimatedAIBase, estimatedAILow));
  estimatedAIHigh = Math.max(estimatedAIBase, Math.min(broadTotal, estimatedAIHigh));
  const estimatedNonAIBase = broadTotal - estimatedAIBase;

  // Build 20-point sensitivity curve across 0% - 50% AI share
  const sensitivityCurve: Array<{ share_pct: number; ai_value: number; non_ai_value: number }> = [];
  for (let s = 0; s <= 50; s += 2.5) {
    const aiVal = (broadTotal * s) / 100;
    sensitivityCurve.push({
      share_pct: s,
      ai_value: Math.round(aiVal * 10) / 10,
      non_ai_value: Math.round((broadTotal - aiVal) * 10) / 10
    });
  }

  return {
    scenario_id: `SCN-${params.product_code}-${params.method}-${Date.now().toString(36)}`,
    product_code: product.product_code,
    product_name: product.product_name,
    reference_year: params.reference_year,
    target_variable: params.target_variable,
    broad_total_value: broadTotal,
    method: params.method,
    method_version: `${params.method}-v1.2.0`,
    estimated_ai_base: Math.round(estimatedAIBase * 10) / 10,
    estimated_ai_low: Math.round(estimatedAILow * 10) / 10,
    estimated_ai_high: Math.round(estimatedAIHigh * 10) / 10,
    estimated_non_ai_base: Math.round(estimatedNonAIBase * 10) / 10,
    implied_ai_share_base_pct: Math.round((estimatedAIBase / broadTotal) * 1000) / 10,
    implied_ai_share_low_pct: Math.round((estimatedAILow / broadTotal) * 1000) / 10,
    implied_ai_share_high_pct: Math.round((estimatedAIHigh / broadTotal) * 1000) / 10,
    formula_latex: formulaLatex,
    quality_score: quality,
    provenance: {
      source_id: 'DS01',
      source_title: 'ONS Thematic Account Methodology & Input-Output Supply and Use Tables (S1 & S5)',
      publisher: 'Office for National Statistics (Broad Total) + UK AI Economic Measurement Lab (Decomposition)',
      reference_period: params.reference_year,
      release_date: '2026-09-21',
      retrieved_at: new Date().toISOString(),
      licence: 'Open Government Licence v3.0',
      statistical_status: 'Illustrative experimental estimate',
      transformation_version: 'disagg-v1.2.0',
      method_id: `METH-${params.method.toUpperCase()}`,
      unit: 'GBP million (current prices)'
    },
    sensitivity_curve: sensitivityCurve,
    created_at: new Date().toISOString()
  };
}
