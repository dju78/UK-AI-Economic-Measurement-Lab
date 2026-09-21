"""
Data Integrity Tests for UK AI Economic Measurement Lab
Validates:
1. All 23 CPA product groups exist and have complete time series (2020-2023)
2. Non-negative supply/demand values
3. Broad totals consistency and accounting identity
4. SHA-256 manifest integrity
5. DS05 60-company benchmark corpus balance and label validity
"""
import os
import json
import hashlib
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT_DIR, "data", "raw")
MANIFEST_PATH = os.path.join(ROOT_DIR, "data", "manifest.json")

class TestDataIntegrity(unittest.TestCase):

    def test_manifest_checksums(self):
        self.assertTrue(os.path.exists(MANIFEST_PATH), "Manifest file must exist")
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        
        self.assertIn("datasets", manifest)
        self.assertEqual(len(manifest["datasets"]), 5, "Manifest must track exactly 5 datasets (DS01-DS05)")

        for ds in manifest["datasets"]:
            full_path = os.path.join(ROOT_DIR, ds["relative_path"])
            self.assertTrue(os.path.exists(full_path), f"Dataset file {full_path} must exist")
            with open(full_path, "rb") as bf:
                calc_hash = hashlib.sha256(bf.read()).hexdigest()
            self.assertEqual(calc_hash, ds["sha256"], f"SHA256 mismatch for {ds['source_id']}")

    def test_cpa_product_count_and_fields(self):
        cpa_file = os.path.join(RAW_DIR, "ds01_ons_thematic_cpa_sut_2020_2023.json")
        with open(cpa_file, "r", encoding="utf-8") as f:
            cpa_data = json.load(f)
        
        products = cpa_data["data"]
        self.assertEqual(len(products), 23, "Must have exactly 23 ONS AI-relevant CPA product groups")

        for p in products:
            self.assertTrue(p["product_code"].startswith("CPA_"), f"Product code {p['product_code']} must start with CPA_")
            self.assertIn("time_series", p)
            self.assertIn("ai_illustrative_share_base", p)
            self.assertGreaterEqual(p["ai_illustrative_share_base"], 0.0)
            self.assertLessEqual(p["ai_illustrative_share_base"], 1.0)
            
            # Check time series 2020-2023
            for yr in ["2020", "2021", "2022", "2023"]:
                self.assertIn(yr, p["time_series"], f"Year {yr} missing in {p['product_code']}")
                ts = p["time_series"][yr]
                self.assertGreater(ts["domestic_output"], 0, f"Domestic output must be positive for {p['product_code']} {yr}")
                self.assertGreater(ts["total_supply"], 0, f"Total supply must be positive for {p['product_code']} {yr}")
                self.assertGreater(ts["intermediate_demand"], 0, f"Intermediate demand must be positive for {p['product_code']} {yr}")

                # Accounting identity: domestic_output + imports <= total_supply + margins/taxes
                self.assertGreaterEqual(ts["total_supply"], ts["domestic_output"], f"Total supply must be >= domestic output for {p['product_code']} {yr}")

    def test_bics_adoption_data(self):
        bics_file = os.path.join(RAW_DIR, "ds02_ons_bics_ai_adoption_2023_2026.json")
        with open(bics_file, "r", encoding="utf-8") as f:
            bics = json.load(f)
        
        self.assertIn("overall_adoption_trajectory", bics)
        self.assertIn("adoption_by_industry_2026", bics)
        self.assertIn("pedagogical_caveat", bics)
        self.assertGreater(len(bics["adoption_by_industry_2026"]), 5)

        for item in bics["overall_adoption_trajectory"]:
            self.assertGreater(item["businesses_10plus"], 0)
            self.assertLess(item["businesses_10plus"], 100)
            self.assertGreater(item["all_businesses"], 0)
            self.assertLess(item["all_businesses"], 100)

    def test_dsit_benchmark_data(self):
        dsit_file = os.path.join(RAW_DIR, "ds03_dsit_ai_sector_study_2024.json")
        with open(dsit_file, "r", encoding="utf-8") as f:
            dsit = json.load(f)
        
        self.assertEqual(dsit["source_id"], "DS03")
        self.assertGreater(dsit["estimated_ai_companies"], 5000)
        self.assertGreater(dsit["estimated_ai_turnover_gbp_million"], 10000)
        self.assertGreater(dsit["estimated_ai_employment"], 50000)

    def test_datacentre_infra_data(self):
        infra_file = os.path.join(RAW_DIR, "ds04_ons_datacentres_digital_infra_2026.json")
        with open(infra_file, "r", encoding="utf-8") as f:
            infra = json.load(f)
        
        self.assertEqual(infra["source_id"], "DS04")
        self.assertGreater(infra["total_uk_datacenter_capacity_mw_2025"], 1000)
        self.assertAlmostEqual(infra["hyperscale_share_pct"] + infra["colocation_share_pct"] + infra["enterprise_on_premise_pct"], 100.0, places=1)

    def test_benchmark_corpus_balance_and_completeness(self):
        corpus_file = os.path.join(RAW_DIR, "ds05_uk_ai_business_corpus.json")
        with open(corpus_file, "r", encoding="utf-8") as f:
            corpus = json.load(f)
        
        data = corpus["data"]
        self.assertEqual(len(data), 60, "Corpus must have exactly 60 curated UK business profiles")

        positive_count = sum(1 for r in data if r["ground_truth_ai_relevant"])
        negative_count = sum(1 for r in data if not r["ground_truth_ai_relevant"])
        hard_negative_count = sum(1 for r in data if r.get("is_hard_negative"))

        self.assertEqual(positive_count, 40, "Must have exactly 40 positive AI business profiles")
        self.assertEqual(negative_count, 20, "Must have exactly 20 non-AI / negative business profiles")
        self.assertGreaterEqual(hard_negative_count, 4, "Must contain at least 4 hard negative test cases")

        # Check all positive cases have ground truth labels
        all_categories = set()
        for r in data:
            self.assertTrue(r["business_id"].startswith("UK-AI-"))
            self.assertTrue(len(r["company_name"]) > 0)
            self.assertTrue(len(r["text"]) > 20)
            if r["ground_truth_ai_relevant"]:
                self.assertGreater(len(r["ground_truth_labels"]), 0, f"Positive business {r['business_id']} must have labels")
                for lbl in r["ground_truth_labels"]:
                    all_categories.add(lbl)

        self.assertEqual(len(all_categories), 13, "40 positive businesses must cover all 13 ONS Table 3 taxonomy categories")

if __name__ == "__main__":
    unittest.main()
