"""
Unit tests for Disaggregation calculations
"""
import unittest
from packages.schemas.types import CPAProduct, DisaggregationParams
from packages.methods.disaggregation import run_disaggregation

class TestDisaggregation(unittest.TestCase):

    def setUp(self):
        self.sample_product = CPAProduct(
            product_code="CPA_J62",
            product_name="Computer programming, consultancy and related services",
            broad_layer="Core AI Development",
            ons_thematic_group="Direct AI services",
            sic_link="SIC 62",
            ai_relevance_notes="Primary IT services category",
            ai_illustrative_share_base=0.165,
            ai_illustrative_share_low=0.090,
            ai_illustrative_share_high=0.280,
            time_series={
                "2023": {
                    "domestic_output": 100000.0,
                    "imports": 20000.0,
                    "total_supply": 120000.0,
                    "intermediate_demand": 60000.0,
                    "gfcf": 35000.0,
                    "exports": 25000.0,
                    "final_consumption": 0.0
                }
            }
        )

    def test_proportional_disaggregation(self):
        params = DisaggregationParams(
            method="proportional",
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            share_base=0.10,
            share_low=0.05,
            share_high=0.20
        )
        res = run_disaggregation(self.sample_product, params)
        self.assertEqual(res.broad_total_value, 100000.0)
        self.assertEqual(res.estimated_ai_base, 10000.0)
        self.assertEqual(res.estimated_ai_low, 5000.0)
        self.assertEqual(res.estimated_ai_high, 20000.0)
        self.assertEqual(res.estimated_non_ai_base, 90000.0)
        # Mathematical identity: AI + Non-AI == Broad Total
        self.assertAlmostEqual(res.estimated_ai_base + res.estimated_non_ai_base, res.broad_total_value, places=2)

    def test_direct_disaggregation(self):
        params = DisaggregationParams(
            method="direct",
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            observed_ai_value=12500.0
        )
        res = run_disaggregation(self.sample_product, params)
        self.assertEqual(res.estimated_ai_base, 12500.0)
        self.assertEqual(res.estimated_non_ai_base, 87500.0)
        self.assertAlmostEqual(res.estimated_ai_base + res.estimated_non_ai_base, res.broad_total_value, places=2)

    def test_guardrails_prevent_overflow(self):
        params = DisaggregationParams(
            method="direct",
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            observed_ai_value=999999.0  # Excessive value
        )
        res = run_disaggregation(self.sample_product, params)
        self.assertEqual(res.estimated_ai_base, 100000.0, "AI value must not exceed broad total")
        self.assertEqual(res.estimated_non_ai_base, 0.0)

if __name__ == "__main__":
    unittest.main()
