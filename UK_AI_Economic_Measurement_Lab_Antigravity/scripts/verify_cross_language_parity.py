import os
import sys
import json
import subprocess

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from packages.methods.classifier import (
    classify_business_text as py_classify,
    evaluate_classifier_on_corpus as py_eval,
    evaluate_classifier_cross_validation as py_cv
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

# 1. Evaluate Python on 60 DS05 Benchmark
py_metrics = py_eval(corpus, "tfidf_logistic")
py_cv_metrics = py_cv(corpus, 5, "tfidf_logistic")

print("======================================================================")
print("PYTHON DS05 BENCHMARK EVALUATION (60 FIRMS)")
print("======================================================================")
print(f"Accuracy  : {py_metrics['accuracy']*100:.1f}%")
print(f"Precision : {py_metrics['precision']*100:.1f}%")
print(f"Recall    : {py_metrics['recall']*100:.1f}%")
print(f"F1-Score  : {py_metrics['f1_score']*100:.1f}%")
print(f"Confusion : {py_metrics['confusion_matrix']}")
print(f"5-Fold CV Mean Acc: {py_cv_metrics['mean_accuracy']*100:.1f}% (std: {py_cv_metrics['std_accuracy']*100:.2f}%)")

# 2. Write a Node runner to evaluate TypeScript on the exact same corpus & test cases
ts_runner_code = """
const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '../apps/web/node_modules/typescript');
const ts = require(tsPath);

const tsCode = fs.readFileSync(path.join(__dirname, '../packages/methods/classifier.ts'), 'utf8');
const jsCode = ts.transpileModule(tsCode, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
const fn = new Function('require', 'exports', 'module', jsCode);
fn(require, mod.exports, mod);

const { classifyBusinessText, evaluateClassifierOnCorpus, evaluateClassifierCrossValidation } = mod.exports;

const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/raw/ds05_uk_ai_business_corpus.json'), 'utf8')).data;

const inSample = evaluateClassifierOnCorpus(corpus, 'tfidf_logistic');
const cv = evaluateClassifierCrossValidation(corpus, 5, 'tfidf_logistic');

const predictions = corpus.map(r => {
  const p = classifyBusinessText(r, 'tfidf_logistic');
  return {
    id: r.business_id,
    prob: p.ai_probability,
    relevant: p.is_ai_relevant,
    labels: p.predicted_labels
  };
});

const testCases = [
  { id: "ORIG_FAILING", text: "Developing enterprise large language models and neural generative architectures", sic: "62.01", expected: true },
  { id: "POS_01", text: "develops generative AI foundation models", sic: "62.01", expected: true },
  { id: "POS_02", text: "builds transformer-based language models", sic: "62.01", expected: true },
  { id: "POS_03", text: "develops computer vision neural networks", sic: "62.01", expected: true },
  { id: "POS_04", text: "provides machine-learning forecasting software", sic: "62.01", expected: true },
  { id: "POS_05", text: "develops autonomous robotics AI", sic: "72.19", expected: true },
  { id: "POS_06", text: "builds NLP systems for enterprise documents", sic: "62.01", expected: true },
  { id: "POS_07", text: "creates deep-learning cybersecurity models", sic: "62.01", expected: true },
  { id: "POS_08", text: "develops predictive machine-learning platforms", sic: "62.01", expected: true },
  { id: "NEG_01", text: "AI-ready cloud hosting and domain registration services", sic: "63.11", expected: false },
  { id: "NEG_02", text: "printer maintenance using smart technology and toner replacement", sic: "95.11", expected: false },
  { id: "NEG_03", text: "bakery using an AI accounting package for daily invoice reconciliation", sic: "10.71", expected: false },
  { id: "NEG_04", text: "estate agent using ChatGPT for drafting property sales brochures", sic: "68.31", expected: false },
  { id: "NEG_05", text: "conventional IT support mentioning AI capability for client helpdesk tickets", sic: "62.02", expected: false },
  { id: "NEG_06", text: "reselling generic cloud hosting and server colocation", sic: "63.11", expected: false }
];

const testResults = testCases.map(tc => {
  const p = classifyBusinessText({ business_id: tc.id, company_name: tc.id, text: tc.text, sic_code: tc.sic }, 'tfidf_logistic');
  return {
    id: tc.id,
    prob: p.ai_probability,
    relevant: p.is_ai_relevant,
    labels: p.predicted_labels,
    expected: tc.expected
  };
});

console.log(JSON.stringify({ inSample, cv, predictions, testResults }));
"""

ts_runner_path = os.path.join(ROOT_DIR, "scripts", "run_ts_classifier.js")
with open(ts_runner_path, "w", encoding="utf-8") as f:
    f.write(ts_runner_code)

print("\n======================================================================")
print("EXECUTING TYPESCRIPT RUNNER VIA NODE")
print("======================================================================")
res = subprocess.run(["node", ts_runner_path], cwd=ROOT_DIR, capture_output=True, text=True)
if res.returncode != 0:
    print("TypeScript Runner Error:", res.stderr)
    sys.exit(1)

ts_data = json.loads(res.stdout)
ts_metrics = ts_data["inSample"]
ts_cv_metrics = ts_data["cv"]

print(f"TypeScript In-Sample Accuracy : {ts_metrics['accuracy']*100:.1f}%")
print(f"TypeScript In-Sample Precision: {ts_metrics['precision']*100:.1f}%")
print(f"TypeScript In-Sample Recall   : {ts_metrics['recall']*100:.1f}%")
print(f"TypeScript In-Sample F1-Score : {ts_metrics['f1_score']*100:.1f}%")
print(f"TypeScript 5-Fold CV Mean Acc : {ts_cv_metrics['mean_accuracy']*100:.1f}% (std: {ts_cv_metrics['std_accuracy']*100:.2f}%)")

# 3. Reconcile all 60 DS05 Profiles Record by Record
print("\n======================================================================")
print("60-COMPANY BENCHMARK PARITY RECONCILIATION TABLE")
print("======================================================================")
print(f"{'ID':<10} | {'Expected':<8} | {'Py Pred':<8} | {'TS Pred':<8} | {'Py Prob':<8} | {'TS Prob':<8} | {'Parity':<6}")
print("-" * 75)

mismatches = 0
for i, r in enumerate(corpus):
    cid = r["business_id"]
    exp = r["ground_truth_ai_relevant"]
    py_res = py_classify(r, "tfidf_logistic")
    ts_res = ts_data["predictions"][i]

    prob_diff = abs(py_res["ai_probability"] - ts_res["prob"])
    label_match = (py_res["is_ai_relevant"] == ts_res["relevant"])
    prob_match = prob_diff < 0.001

    if not label_match or not prob_match:
        mismatches += 1
        status = "MISMATCH"
    else:
        status = "MATCH"

    print(f"{cid:<10} | {str(exp):<8} | {str(py_res['is_ai_relevant']):<8} | {str(ts_res['relevant']):<8} | {py_res['ai_probability']*100:6.1f}%  | {ts_res['prob']*100:6.1f}%  | {status:<6}")

print("-" * 75)
print(f"Reconciliation Result: {60 - mismatches}/60 Perfect Parity Matches ({mismatches} Mismatches)")

# 4. Compare Test Cases
print("\n======================================================================")
print("TARGET TEST CASES PARITY & SANITY AUDIT")
print("======================================================================")
tc_failures = 0
for i, tc in enumerate(ts_data["testResults"]):
    cid = tc["id"]
    exp = tc["expected"]
    ts_rel = tc["relevant"]
    ts_prob = tc["prob"]
    py_r = py_classify({"business_id": cid, "text": [x[1] for x in test_cases if x[0] == cid][0]}, "tfidf_logistic")

    parity = (py_r["is_ai_relevant"] == ts_rel) and (abs(py_r["ai_probability"] - ts_prob) < 0.001)
    correct = (ts_rel == exp)

    if not parity or not correct:
        tc_failures += 1
        status = "FAIL"
    else:
        status = "PASS"

    print(f"[{status}] {cid:<12} | Exp: {str(exp):<5} | Py: {py_r['ai_probability']*100:5.1f}% ({py_r['is_ai_relevant']!s:<5}) | TS: {ts_prob*100:5.1f}% ({ts_rel!s:<5}) | Parity: {parity!s:<5}")

print(f"\nTarget Test Cases Result: {len(ts_data['testResults']) - tc_failures}/{len(ts_data['testResults'])} Passed")
