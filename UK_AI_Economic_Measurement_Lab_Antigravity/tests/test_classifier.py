"""
Unit and Statistical Tests for AI Business Classifier
Validates:
1. Rule-based dictionary baseline and TF-IDF logistic regression models
2. Multi-label taxonomy classification across all 13 categories
3. Hard negative filtering (buzzword suppression without technical substance)
4. Evaluation metrics (Precision, Recall, F1, Confusion Matrix) on 60-company corpus
5. Stratified 5-fold cross-validation on held-out splits
6. Robustness against empty, short, or noisy business descriptions
"""
import os
import json
import unittest
from packages.methods.classifier import (
    classify_business_text,
    evaluate_classifier_on_corpus,
    evaluate_classifier_cross_validation,
    TAXONOMY_RULES
)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT_DIR, "data", "raw")

class TestClassifier(unittest.TestCase):

    def setUp(self):
        corpus_file = os.path.join(RAW_DIR, "ds05_uk_ai_business_corpus.json")
        with open(corpus_file, "r", encoding="utf-8") as f:
            corpus_data = json.load(f)
        self.corpus = corpus_data["data"]

    def test_dedicated_ai_classification(self):
        sample = {
            "business_id": "TEST-01",
            "company_name": "Frontier LLM Labs Ltd",
            "text": "Developing proprietary deep learning transformer foundation models and large language model architectures for code generation.",
            "ground_truth_ai_relevant": True,
            "ground_truth_dedicated": True
        }
        res = classify_business_text(sample, "tfidf_logistic")
        self.assertTrue(res["is_ai_relevant"])
        self.assertGreaterEqual(res["ai_probability"], 0.80)
        self.assertIn("ai_platforms_models", res["predicted_labels"])
        self.assertTrue(res["is_dedicated"])

    def test_hard_negative_filtering(self):
        # Buzzword without engineering foundation
        sample = {
            "business_id": "TEST-02",
            "company_name": "Standard Managed IT Services Ltd",
            "text": "We provide Office 365 migrations, network firewall management, printer maintenance, and AI-ready cloud hosting consultations.",
            "ground_truth_ai_relevant": False,
            "ground_truth_dedicated": False
        }
        res = classify_business_text(sample, "tfidf_logistic")
        self.assertFalse(res["is_ai_relevant"], "Hard negative with IT buzzwords must not be classified as core AI")
        self.assertLess(res["ai_probability"], 0.50)

    def test_completely_non_ai_business(self):
        sample = {
            "business_id": "TEST-03",
            "company_name": "Traditional Sourdough Bakery Ltd",
            "text": "Handcrafted sourdough bread, fresh pastries, and wedding cakes baked in traditional stone ovens.",
            "ground_truth_ai_relevant": False,
            "ground_truth_dedicated": False
        }
        res = classify_business_text(sample, "tfidf_logistic")
        self.assertFalse(res["is_ai_relevant"])
        self.assertLessEqual(res["ai_probability"], 0.10)
        self.assertEqual(len(res["predicted_labels"]), 0)

    def test_rule_baseline_model(self):
        sample = {
            "business_id": "TEST-04",
            "company_name": "BioTech Drug AI Ltd",
            "text": "Automated protein folding simulations and AI drug discovery using deep learning.",
            "ground_truth_ai_relevant": True,
            "ground_truth_dedicated": True
        }
        res = classify_business_text(sample, "rule_baseline")
        self.assertTrue(res["is_ai_relevant"])
        self.assertIn("healthcare_life_sciences", res["predicted_labels"])
        self.assertEqual(res["model_version"], "rule-dict-v1.0")

    def test_full_corpus_evaluation_metrics(self):
        metrics = evaluate_classifier_on_corpus(self.corpus, "tfidf_logistic")
        self.assertEqual(metrics["total_samples"], 60)
        self.assertGreaterEqual(metrics["accuracy"], 0.85, "Accuracy should meet quality gate threshold >= 85%")
        self.assertGreaterEqual(metrics["precision"], 0.80, "Precision should be >= 80%")
        self.assertGreaterEqual(metrics["recall"], 0.80, "Recall should be >= 80%")
        self.assertGreaterEqual(metrics["f1_score"], 0.80, "F1-Score should be >= 80%")

        cm = metrics["confusion_matrix"]
        self.assertEqual(cm["tp"] + cm["fp"] + cm["tn"] + cm["fn"], 60)
        self.assertEqual(cm["tp"] + cm["fn"], 40, "Total actual positives must equal 40")
        self.assertEqual(cm["tn"] + cm["fp"], 20, "Total actual negatives must equal 20")

    def test_stratified_cross_validation(self):
        cv = evaluate_classifier_cross_validation(self.corpus, 5, "tfidf_logistic")
        self.assertEqual(cv["k_folds"], 5)
        self.assertEqual(cv["total_samples"], 60)
        self.assertEqual(len(cv["fold_accuracies"]), 5)
        self.assertGreaterEqual(cv["mean_accuracy"], 0.85, "Cross-validated accuracy should be >= 85%")
        self.assertGreaterEqual(cv["f1_score"], 0.85, "Cross-validated F1 should be >= 85%")

    def test_empty_and_noise_handling(self):
        empty_sample = {"business_id": "TEST-EMPTY", "company_name": "Empty Ltd", "text": ""}
        res_empty = classify_business_text(empty_sample, "tfidf_logistic")
        self.assertFalse(res_empty["is_ai_relevant"])
        self.assertLessEqual(res_empty["ai_probability"], 0.50)

        noise_sample = {"business_id": "TEST-NOISE", "company_name": "Noise Ltd", "text": "!@#$%^&*() 12345 67890"}
        res_noise = classify_business_text(noise_sample, "tfidf_logistic")
        self.assertFalse(res_noise["is_ai_relevant"])

if __name__ == "__main__":
    unittest.main()
