"""
API Contracts and Determinism Tests for UK AI Economic Measurement Lab
Validates:
1. Determinism of mathematical transformations
2. Exact matching across repeat executions
3. Data structures format and serializability
"""
import os
import json
import unittest
from packages.schemas.types import CPAProduct, DisaggregationParams
from packages.methods.disaggregation import run_disaggregation
from packages.methods.classifier import classify_business_text

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT_DIR, "data", "raw")

class TestAPIContracts(unittest.TestCase):

    def setUp(self):
        cpa_file = os.path.join(RAW_DIR, "ds01_ons_thematic_cpa_sut_2020_2023.json")
        with open(cpa_file, "r", encoding="utf-8") as f:
            cpa_data = json.load(f)
        self.products = [CPAProduct(**p) for p in cpa_data["data"]]

    def test_disaggregation_determinism(self):
        j62 = next(p for p in self.products if p.product_code == "CPA_J62")
        params = DisaggregationParams(
            product_code="CPA_J62",
            reference_year="2023",
            target_variable="domestic_output",
            method="proportional",
            share_base=0.165
        )
        
        res1 = run_disaggregation(j62, params)
        res2 = run_disaggregation(j62, params)

        self.assertEqual(res1.estimated_ai_base, res2.estimated_ai_base)
        self.assertEqual(res1.estimated_ai_low, res2.estimated_ai_low)
        self.assertEqual(res1.estimated_ai_high, res2.estimated_ai_high)
        self.assertEqual(res1.implied_ai_share_base_pct, res2.implied_ai_share_base_pct)

    def test_classifier_determinism(self):
        sample = {
            "business_id": "TEST-DET-01",
            "company_name": "Test Firm",
            "text": "Deep learning models for medical pathology imaging and drug discovery."
        }
        res1 = classify_business_text(sample, "tfidf_logistic")
        res2 = classify_business_text(sample, "tfidf_logistic")

        self.assertEqual(res1["is_ai_relevant"], res2["is_ai_relevant"])
        self.assertEqual(res1["ai_probability"], res2["ai_probability"])
        self.assertEqual(res1["predicted_labels"], res2["predicted_labels"])

    def test_disaggregation_result_serialization(self):
        j582 = next(p for p in self.products if p.product_code == "CPA_J582")
        params = DisaggregationParams(
            product_code="CPA_J582",
            reference_year="2022",
            target_variable="domestic_output",
            method="hybrid"
        )
        res = run_disaggregation(j582, params)
        res_dict = res.dict()
        serialized = json.dumps(res_dict)
        self.assertTrue(len(serialized) > 100)
        deserialized = json.loads(serialized)
        self.assertEqual(deserialized["product_code"], "CPA_J582")

if __name__ == "__main__":
    unittest.main()
