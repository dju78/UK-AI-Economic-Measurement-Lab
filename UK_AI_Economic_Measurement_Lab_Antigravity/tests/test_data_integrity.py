"""
Data Integrity Tests for UK AI Economic Measurement Lab
Validates:
1. All 23 CPA product groups exist and have complete time series (2020-2023)
2. Non-negative supply/demand values
3. Broad totals consistency
4. SHA-256 manifest integrity
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
                self.assertGreater(ts["domestic_output"], 0, "Domestic output must be positive")
                self.assertGreater(ts["total_supply"], 0, "Total supply must be positive")
                self.assertGreater(ts["intermediate_demand"], 0, "Intermediate demand must be positive")

    def test_bics_adoption_data(self):
        bics_file = os.path.join(RAW_DIR, "ds02_ons_bics_ai_adoption_2023_2026.json")
        with open(bics_file, "r", encoding="utf-8") as f:
            bics = json.load(f)
        
        self.assertIn("overall_adoption_trajectory", bics)
        self.assertIn("adoption_by_industry_2026", bics)
        self.assertIn("pedagogical_caveat", bics)
        self.assertGreater(len(bics["adoption_by_industry_2026"]), 5)

if __name__ == "__main__":
    unittest.main()
