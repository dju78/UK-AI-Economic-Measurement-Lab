import json
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from packages.methods.classifier import (
    classify_business_text as py_classify,
    evaluate_classifier_on_corpus as py_eval,
    TAXONOMY_RULES as PY_TAXONOMY,
    TFIDF_LOGISTIC_WEIGHTS as PY_WEIGHTS,
    HARD_NEGATIVE_PATTERNS as PY_HARD_NEGS
)

CORPUS_PATH = os.path.join(ROOT_DIR, "data", "raw", "ds05_uk_ai_business_corpus.json")

with open(CORPUS_PATH, "r", encoding="utf-8") as f:
    corpus = json.load(f)["data"]

test_cases = [
    ("ORIG_FAILING", "Developing enterprise large language models and neural generative architectures", "62.01", True),
    ("POS_01", "develops generative AI foundation models", "62.01", True),
    ("POS_02", "builds transformer-based language models", "62.01", True),
    ("POS_03", "develops computer vision neural networks", "62.01", True),
    ("POS_04", "provides machine-learning forecasting software", "62.01", True),
    ("POS_05", "develops autonomous robotics AI", "72.19", True),
    ("POS_06", "builds NLP systems for enterprise documents", "62.01", True),
    ("POS_07", "creates deep-learning cybersecurity models", "62.01", True),
    ("POS_08", "develops predictive machine-learning platforms", "62.01", True),
    ("NEG_01", "AI-ready cloud hosting and domain registration services", "63.11", False),
    ("NEG_02", "printer maintenance using smart technology and toner replacement", "95.11", False),
    ("NEG_03", "bakery using an AI accounting package for daily invoice reconciliation", "10.71", False),
    ("NEG_04", "estate agent using ChatGPT for drafting property sales brochures", "68.31", False),
    ("NEG_05", "conventional IT support mentioning AI capability for client helpdesk tickets", "62.02", False),
    ("NEG_06", "reselling generic cloud hosting and server colocation", "63.11", False),
]

print("======================================================================")
print("AUDITING PYTHON CLASSIFIER ON TEST CASES")
print("======================================================================")
failures = 0
for cid, text, sic, expected in test_cases:
    rec = {"business_id": cid, "company_name": cid, "text": text, "sic_code": sic}
    res = py_classify(rec, "tfidf_logistic")
    ok = (res["is_ai_relevant"] == expected)
    if not ok:
        failures += 1
    status = "PASS" if ok else "FAIL"
    prob = res["ai_probability"] * 100
    labels = res["predicted_labels"]
    terms = res["highlighted_terms"]
    print(f"[{status}] {cid:12}: Prob={prob:5.1f}% Relevant={str(res['is_ai_relevant']):5} (Expected {str(expected):5}) | Labels={labels} | Terms={terms}")

print(f"\nPython Test Cases: {len(test_cases) - failures}/{len(test_cases)} Passed")
