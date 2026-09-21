"""
Unit Tests for System of National Accounts (SNA 2008 / ESA 2010) Decision Tree
Validates:
1. Decision tree structure and node navigation
2. Accounting effect resolution for all 6 reference case studies
3. Capital formation (GFCF) vs Intermediate Consumption classification logic
4. Cross-border trade in digital services vs domestic compute residency
5. Error handling for incomplete or invalid answer paths
"""
import unittest
from packages.methods.sna_tree import (
    SNA_DECISION_NODES,
    SNA_CASE_STUDIES,
    resolve_sna_decision_path
)

class TestSNADecisionTree(unittest.TestCase):

    def test_case_study_01_bank_own_account_model(self):
        # Case Study 1: Bank fine-tunes Llama-3 open weights with internal engineers
        answers = {"root": "opt_model_software", "software_mode": "sw_own_account"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Own-Account Intangible Asset")
        self.assertTrue(effect["asset_boundary"])
        self.assertTrue(effect["economic_ownership_uk"])
        self.assertEqual(effect["residency"], "UK Resident")

    def test_case_study_02_nhs_saas_us_import(self):
        # Case Study 2: NHS subscribes to US cloud AI tool
        answers = {"root": "opt_cloud_compute", "cloud_residency": "cloud_foreign_import"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Imports of Services")
        self.assertFalse(effect["asset_boundary"], "Foreign SaaS does not enter UK asset boundary")
        self.assertEqual(effect["residency"], "Rest of World (RoW)")

    def test_case_study_03_robotics_hardware_import(self):
        # Case Study 3: Robotics firm imports GPU supercomputer from Taiwan
        answers = {"root": "opt_hardware", "hardware_life": "hw_gfcf_import"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Imports of Goods")
        self.assertTrue(effect["asset_boundary"])
        self.assertTrue(effect["economic_ownership_uk"])

    def test_case_study_04_law_firm_consulting_bespoke_asset(self):
        # Case Study 4: Law firm commissions bespoke workflow software tool (> 1 yr)
        answers = {"root": "opt_consulting", "consulting_purpose": "cons_asset_capitalized"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Gross Fixed Capital Formation (GFCF)")
        self.assertTrue(effect["asset_boundary"])

    def test_case_study_05_retailer_monthly_copy_subscription(self):
        # Case Study 5: Retailer monthly AI copywriting subscription
        answers = {"root": "opt_model_software", "software_mode": "sw_saas_subscription"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Intermediate Consumption")
        self.assertFalse(effect["asset_boundary"])

    def test_case_study_06_biotech_proprietary_database(self):
        # Case Study 6: Oxford biotech proprietary molecular database
        answers = {"root": "opt_data_asset", "data_asset_life": "data_database_gfcf"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNotNone(effect)
        self.assertEqual(effect["national_accounts_category"], "Gross Fixed Capital Formation (GFCF)")
        self.assertTrue(effect["asset_boundary"])

    def test_incomplete_path_returns_none(self):
        # Incomplete answer (only root answered)
        answers = {"root": "opt_hardware"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNone(effect, "Incomplete path must resolve to None")

    def test_invalid_option_returns_none(self):
        answers = {"root": "invalid_option_id"}
        effect = resolve_sna_decision_path(answers)
        self.assertIsNone(effect)

    def test_case_studies_definition_integrity(self):
        self.assertEqual(len(SNA_CASE_STUDIES), 6, "Must define exactly 6 reference case studies")
        for cs in SNA_CASE_STUDIES:
            self.assertTrue(cs["id"].startswith("CS"))
            self.assertTrue(len(cs["title"]) > 0)
            self.assertTrue(len(cs["activity_summary"]) > 0)
            # Verify the initial answers resolve cleanly
            effect = resolve_sna_decision_path(cs["initial_answers"])
            self.assertIsNotNone(effect, f"Case study {cs['id']} answers must resolve to a valid accounting effect")

if __name__ == "__main__":
    unittest.main()
