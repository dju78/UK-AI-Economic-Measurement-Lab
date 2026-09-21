"""
Statistical and Calculation Tests for Disaggregation Engine
Validates:
1. Direct allocation method with bounds clamping
2. Proportional allocation method with product defaults and overrides
3. Modelled allocation method (p_ai * r_ai)
4. Hybrid tiered cascading allocation
5. Edge cases: 0% share, 100% share, zero broad total, bounds preservation
6. Batch processing of all 23 CPA product groups
"""
import os
import json
import unittest
from packages.schemas.types import CPAProduct, DisaggregationParams
from packages.methods.disaggregation import run_disaggregation

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT_DIR, "data", "raw")

class TestDisaggregation(unittest.TestCase):

    def setUp(self):
        cpa_file = os.path.join(RAW_DIR, "ds01_ons_thematic_cpa_sut_2020_2023.json")
        with open(cpa_file, "r", encoding="utf-8") as f:
            cpa_data = json.load(f)
        
        self.products = [CPAProduct(**p) for p in cpa_data["data"]]
        self.j62 = next(p for p in self.products if p.product_code == "CPA_J62")

    def test_direct_method_calculation(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="direct",
            observed_ai_value=15000.0
        )
        res = run_disaggregation(self.j62, params)
        self.assertEqual(res.method, "direct")
        self.assertEqual(res.broad_total_value, 101850.0)
        self.assertEqual(res.estimated_ai_base, 15000.0)
        self.assertEqual(res.estimated_ai_low, 12750.0)
        self.assertEqual(res.estimated_ai_high, 17250.0)
        self.assertEqual(res.estimated_non_ai_base, 86850.0)
        self.assertAlmostEqual(res.implied_ai_share_base_pct, 14.7, places=1)

    def test_direct_method_clamping_exceeds_broad(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="direct",
            observed_ai_value=200000.0  # Exceeds broad total of 101850
        )
        res = run_disaggregation(self.j62, params)
        self.assertEqual(res.estimated_ai_base, 101850.0, "Direct estimate must not exceed broad total")
        self.assertEqual(res.estimated_non_ai_base, 0.0)

    def test_proportional_method_default_shares(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="proportional"
        )
        res = run_disaggregation(self.j62, params)
        expected_base = round(101850.0 * 0.165, 1)
        self.assertEqual(res.estimated_ai_base, expected_base)
        self.assertLessEqual(res.estimated_ai_low, res.estimated_ai_base)
        self.assertGreaterEqual(res.estimated_ai_high, res.estimated_ai_base)

    def test_proportional_method_override_shares(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="proportional",
            share_base=0.25,
            share_low=0.15,
            share_high=0.35
        )
        res = run_disaggregation(self.j62, params)
        self.assertEqual(res.estimated_ai_base, 25462.5)
        self.assertEqual(res.estimated_ai_low, 15277.5)
        self.assertEqual(res.estimated_ai_high, 35647.5)

    def test_modelled_method_compound_calculation(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="modelled",
            company_ai_probability_mean=0.50,
            firm_ai_revenue_attribution_ratio=0.40
        )
        res = run_disaggregation(self.j62, params)
        # compound = 0.50 * 0.40 = 0.20 -> 101850 * 0.20 = 20370.0
        self.assertEqual(res.estimated_ai_base, 20370.0)
        self.assertLess(res.estimated_ai_low, res.estimated_ai_base)
        self.assertGreater(res.estimated_ai_high, res.estimated_ai_base)

    def test_hybrid_method_cascading_tiers(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="hybrid",
            tier1_direct_value=5000.0,
            tier2_proportional_share=0.10,
            tier3_modelled_residual_weight=0.05
        )
        res = run_disaggregation(self.j62, params)
        # broad = 101850.0
        # t1 = 5000.0, res1 = 96850.0
        # t2 = 96850.0 * 0.10 = 9685.0, res2 = 87165.0
        # t3 = 87165.0 * 0.05 = 4358.25
        # base = 5000.0 + 9685.0 + 4358.25 = 19043.25 -> round 19043.3 or 19043.2
        self.assertAlmostEqual(res.estimated_ai_base, 19043.3, places=0)
        self.assertEqual(round(res.estimated_ai_base + res.estimated_non_ai_base, 1), 101850.0)

    def test_zero_share_boundary(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="proportional",
            share_base=0.0,
            share_low=0.0,
            share_high=0.0
        )
        res = run_disaggregation(self.j62, params)
        self.assertEqual(res.estimated_ai_base, 0.0)
        self.assertEqual(res.estimated_ai_low, 0.0)
        self.assertEqual(res.estimated_ai_high, 0.0)
        self.assertEqual(res.estimated_non_ai_base, 101850.0)
        self.assertEqual(res.implied_ai_share_base_pct, 0.0)

    def test_100_percent_share_boundary(self):
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="proportional",
            share_base=1.0,
            share_low=1.0,
            share_high=1.0
        )
        res = run_disaggregation(self.j62, params)
        self.assertEqual(res.estimated_ai_base, 101850.0)
        self.assertEqual(res.estimated_non_ai_base, 0.0)
        self.assertEqual(res.implied_ai_share_base_pct, 100.0)

    def test_all_23_cpa_products_execute_cleanly(self):
        for product in self.products:
            for method in ["direct", "proportional", "modelled", "hybrid"]:
                params = DisaggregationParams(
                    product_code=product.product_code,
                    reference_year="2023",
                    target_variable="domestic_output",
                    method=method
                )
                res = run_disaggregation(product, params)
                self.assertGreaterEqual(res.estimated_ai_base, 0.0)
                self.assertLessEqual(res.estimated_ai_base, res.broad_total_value)
                self.assertLessEqual(res.estimated_ai_low, res.estimated_ai_base)
                self.assertGreaterEqual(res.estimated_ai_high, res.estimated_ai_base)
                self.assertEqual(round(res.estimated_ai_base + res.estimated_non_ai_base, 1), round(res.broad_total_value, 1))

if __name__ == "__main__":
    unittest.main()
