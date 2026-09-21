
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
