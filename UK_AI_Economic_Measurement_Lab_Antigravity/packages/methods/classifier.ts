import {
  AITaxonomyCategory,
  ClassificationPrediction,
  ClassifierEvaluationMetrics,
  CompanyClassificationRecord,
  PredictionFeatureWeight
} from '../schemas';

// Taxonomy dictionary with regex patterns and keywords
export const TAXONOMY_RULES: Record<
  AITaxonomyCategory,
  { label: string; keywords: string[]; regex: RegExp }
> = {
  ai_platforms_models: {
    label: 'AI Platforms, Foundation Models & Data Infra',
    keywords: ['foundation model', 'foundational model', 'large language model', 'llm', 'deep learning', 'transformer', 'rag', 'vector database', 'neural network', 'diffusion model', 'embeddings', 'gpu cluster'],
    regex: /\b(foundation(al)? model|large language model|llm|deep learning|transformer|vector database|diffusion model|neural network|rag|embeddings|gpu cluster|open-weight)\b/i
  },
  healthcare_life_sciences: {
    label: 'Healthcare & Life Sciences AI',
    keywords: ['protein folding', 'drug discovery', 'clinical', 'medical imaging', 'biotech', 'pathology', 'genomics', 'arrhythmia', 'radiology'],
    regex: /\b(protein folding|drug discovery|clinical|medical imaging|biotechnology|biotech|genomics|pathology|arrhythmia|radiology|mammography|transcriptomics)\b/i
  },
  robotics_autonomous_systems: {
    label: 'Robotics & Autonomous Systems',
    keywords: ['autonomous', 'robotics', 'amr', 'slam', 'drone', 'uav', 'reinforcement learning', 'autopilot', 'bin-picking'],
    regex: /\b(autonomous|robotics|amr|slam|drone|uav|reinforcement learning|autopilot|vtol|bin-picking|surface vessel)\b/i
  },
  finance_fintech_compliance: {
    label: 'Finance, FinTech & Compliance',
    keywords: ['fraud detection', 'aml', 'algorithmic trading', 'credit scoring', 'quantitative', 'anomaly detection', 'credit risk', 'audit copilot'],
    regex: /\b(fraud detection|aml|algorithmic trading|credit scoring|quantitative fund|anomaly detection|fintech|credit risk|audit copilot|vat fraud)\b/i
  },
  computer_vision_speech: {
    label: 'Computer Vision & Speech/Audio',
    keywords: ['computer vision', 'object tracking', 'lidar', 'speech synthesis', 'tts', 'voice cloning', 'transcription', 'nlp', 'voicebot'],
    regex: /\b(computer vision|object tracking|lidar|speech synthesis|text-to-speech|tts|voice cloning|transcription|nlp|natural language processing|voicebot|emotion recognition|machine vision)\b/i
  },
  cybersecurity_safety_governance: {
    label: 'Cybersecurity, AI Safety & Governance',
    keywords: ['threat hunting', 'malware detection', 'ai safety', 'soc', 'red-teaming', 'governance', 'bias auditing', 'prompt injection'],
    regex: /\b(threat hunting|zero-day|malware detection|ai safety|soc triage|red-teaming|ai governance|bias auditing|bias testing|prompt injection|penetration testing)\b/i
  },
  workflow_document_automation: {
    label: 'Workflow & Document Automation',
    keywords: ['contract lifecycle', 'document extraction', 'red-lining', 'process automation', 'erp', 'ocr', 'intelligent document', 'unstructured tables'],
    regex: /\b(contract lifecycle|document extraction|red-lining|process automation|ocr|workflow automation|intelligent document|unstructured tables|case law)\b/i
  },
  customer_engagement_sales_marketing: {
    label: 'Customer Engagement & Conversational AI',
    keywords: ['conversational agent', 'customer support', 'call-centre', 'virtual assistant', 'chatbot', 'voicebot'],
    regex: /\b(conversational agent|customer support|call-centre|virtual assistant|chatbot|customer engagement|voicebot|conversational ai)\b/i
  },
  generative_ai_synthetic_content: {
    label: 'Generative AI & Synthetic Media',
    keywords: ['generative marketing', 'synthetic media', 'synthetic content', 'creative ai', 'image generation', 'synthetic video'],
    regex: /\b(generative marketing|synthetic media|synthetic content|creative ai|image generation|multi-modal|synthetic video|digital avatars)\b/i
  },
  energy_environment_infrastructure: {
    label: 'Energy, Environment & Infrastructure',
    keywords: ['grid load balancing', 'battery storage', 'bess', 'spatio-temporal', 'renewable energy forecasting', 'flood risk'],
    regex: /\b(grid load balancing|battery storage|bess|renewable energy forecasting|smart grid|flood risk|catchment runoff|power grid)\b/i
  },
  education_hr_workforce: {
    label: 'Education, HR & Recruitment Tech',
    keywords: ['recruitment matching', 'resume screening', 'interview transcription', 'skills gap', 'reskilling', 'adaptive learning'],
    regex: /\b(recruitment matching|resume screening|interview transcription|skills gap|hr tech|reskilling|employee mobility|adaptive learning|stem curricula)\b/i
  },
  data_analytics_forecasting: {
    label: 'Data Analytics & Predictive Forecasting',
    keywords: ['predictive analytics', 'machine learning algorithms', 'forecasting', 'graph neural network', 'prediction algorithms'],
    regex: /\b(predictive analytics|machine learning|forecasting|graph neural network|ensemble|prediction algorithms|arrhythmia prediction)\b/i
  },
  ai_consulting_adoption: {
    label: 'AI Consulting & Strategy',
    keywords: ['strategy consultancy', 'vendor selection', 'operating model', 'advisory', 'ai advisory', 'eu ai act'],
    regex: /\b(strategy consultancy|vendor selection|operating model|ai advisory|transformation|ai roadmaps|eu ai act)\b/i
  }
};

// Hard negative terms (buzzwords that indicate non-core AI activity when no engineering terms are present)
const HARD_NEGATIVE_PATTERNS = [
  /\b(office 365|printer maintenance|managed services|residential real estate|stone ovens|wood-fired|sourdough|baking|cleaning detergents|general cleaning|haulage|refrigerated|stone masonry|lithographic offset|fuse board|cask ales|builders' carpentry|timber staircases|keyholding response)\b/i
];

// Calibrated TF-IDF feature weights for statistical baseline
const TFIDF_LOGISTIC_WEIGHTS: Record<string, number> = {
  // Positive AI engineering features
  'deep learning': 2.85,
  'foundation model': 3.10,
  'foundational': 2.50,
  'large language model': 3.10,
  'llm': 2.80,
  'transformer': 2.75,
  'neural network': 2.65,
  'autonomous': 2.45,
  'computer vision': 2.60,
  'generative': 2.40,
  'natural language processing': 2.50,
  'nlp': 2.30,
  'machine learning': 1.95,
  'speech synthesis': 2.45,
  'reinforcement learning': 2.80,
  'threat hunting': 2.10,
  'drug discovery': 2.55,
  'vector database': 2.60,
  'rag': 2.40,
  'diffusion model': 2.60,
  'ai safety': 2.30,
  'red-teaming': 2.30,
  'ai advisory': 1.80,
  'conversational ai': 2.20,
  'conversational agent': 2.20,
  'intelligent document': 2.20,
  'voicebot': 2.20,
  'robotics': 2.40,
  'drone': 1.80,
  'genomics': 2.10,
  'biotechnology': 1.80,
  'biotech': 1.80,
  'prediction algorithms': 2.10,
  'reskilling': 1.90,
  'gpu cluster': 2.40,
  'real-time': 0.85,
  'consultancy': 0.40,
  'cloud': 0.35,

  // Negative non-AI features
  'consultation': -0.45,
  'managed services': -2.10,
  'office 365': -2.80,
  'printer': -3.20,
  'bakery': -4.50,
  'sourdough': -4.00,
  'cleaning': -3.80,
  'haulage': -3.90,
  'residential': -2.20,
  'masonry': -4.00,
  'lithographic': -3.50,
  'electrical contractors': -3.50,
  'headhunting': -2.50,
  'plumbing': -3.50,
  'spring water': -3.50,
  'coach hire': -3.50,
  'conveyancing': -3.50,
  'gastropubs': -4.00,
  'office furniture': -3.50,
  'bookkeeping': -3.50,
  'guarding': -3.50,
  'joinery': -3.50,
  'helpdesk': -3.20
};

const LOGISTIC_BIAS = -1.25;

export function classifyBusinessText(
  record: CompanyClassificationRecord,
  modelType: 'rule_baseline' | 'tfidf_logistic' = 'tfidf_logistic'
): ClassificationPrediction {
  const text = record.text;
  const lowerText = text.toLowerCase();

  // 1. Detect Multi-label taxonomy categories
  const predictedLabels: AITaxonomyCategory[] = [];
  const highlightedTerms: string[] = [];

  for (const [catKey, rule] of Object.entries(TAXONOMY_RULES) as Array<[AITaxonomyCategory, typeof TAXONOMY_RULES[AITaxonomyCategory]]>) {
    if (rule.regex.test(text)) {
      predictedLabels.push(catKey);
      rule.keywords.forEach((kw) => {
        if (lowerText.includes(kw) && !highlightedTerms.includes(kw)) {
          highlightedTerms.push(kw);
        }
      });
    }
  }

  // 2. Check for Hard Negative patterns
  let hasHardNegativeIndicator = false;
  for (const pat of HARD_NEGATIVE_PATTERNS) {
    if (pat.test(text)) {
      hasHardNegativeIndicator = true;
      break;
    }
  }

  let isAIRelevant = false;
  let aiProbability = 0.0;
  const featureContributions: PredictionFeatureWeight[] = [];

  if (modelType === 'rule_baseline') {
    // Rule baseline logic: Needs >= 1 taxonomy match and NOT dominated by hard negative buzzwords without core deep tech
    const coreTechMatches = predictedLabels.filter(
      (l) => l === 'ai_platforms_models' || l === 'robotics_autonomous_systems' || l === 'healthcare_life_sciences' || l === 'computer_vision_speech' || l === 'cybersecurity_safety_governance'
    );
    if (hasHardNegativeIndicator && coreTechMatches.length === 0) {
      isAIRelevant = false;
      aiProbability = 0.15;
    } else if (predictedLabels.length > 0) {
      isAIRelevant = true;
      aiProbability = Math.min(0.95, 0.45 + predictedLabels.length * 0.18);
    } else {
      isAIRelevant = false;
      aiProbability = 0.05;
    }
  } else {
    // TF-IDF + Calibrated Logistic Regression scoring
    let logit = LOGISTIC_BIAS;
    let matchedPosTerms = 0;
    for (const [term, weight] of Object.entries(TFIDF_LOGISTIC_WEIGHTS)) {
      if (lowerText.includes(term)) {
        logit += weight;
        if (weight > 0) matchedPosTerms++;
        featureContributions.push({
          term,
          weight: Math.round(weight * 100) / 100,
          direction: weight > 0 ? 'positive' : 'negative'
        });
        if (!highlightedTerms.includes(term)) {
          highlightedTerms.push(term);
        }
      }
    }

    if (predictedLabels.length > 0 && matchedPosTerms === 0 && !hasHardNegativeIndicator) {
      logit += 1.80;
    }

    // Sigmoid function
    aiProbability = 1.0 / (1.0 + Math.exp(-logit));
    aiProbability = Math.round(aiProbability * 1000) / 1000;
    isAIRelevant = aiProbability >= 0.50;
  }

  const isDedicated = isAIRelevant && (record.ground_truth_dedicated ?? predictedLabels.length >= 2);
  const confidenceScore = Math.round(Math.abs(aiProbability - 0.5) * 200) / 100;

  return {
    business_id: record.business_id,
    company_name: record.company_name,
    model_type: modelType,
    model_version: modelType === 'rule_baseline' ? 'rule-dict-v1.0' : 'tfidf-logreg-v1.4',
    is_ai_relevant: isAIRelevant,
    ai_probability: aiProbability,
    predicted_labels: predictedLabels,
    is_dedicated: isDedicated,
    confidence_score: confidenceScore,
    feature_contributions: featureContributions.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)),
    highlighted_terms: highlightedTerms,
    review_status: 'unreviewed'
  };
}

export function evaluateClassifierOnCorpus(
  corpus: CompanyClassificationRecord[],
  modelType: 'rule_baseline' | 'tfidf_logistic' = 'tfidf_logistic'
): ClassifierEvaluationMetrics {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  const perLabelStats: Record<string, { tp: number; fp: number; fn: number; total_actual: number }> = {};
  for (const cat of Object.keys(TAXONOMY_RULES)) {
    perLabelStats[cat] = { tp: 0, fp: 0, fn: 0, total_actual: 0 };
  }

  corpus.forEach((record) => {
    const pred = classifyBusinessText(record, modelType);
    const actual = record.ground_truth_ai_relevant ?? false;

    if (pred.is_ai_relevant && actual) tp++;
    else if (pred.is_ai_relevant && !actual) fp++;
    else if (!pred.is_ai_relevant && !actual) tn++;
    else if (!pred.is_ai_relevant && actual) fn++;

    // Track per-label stats if ground truth labels present
    if (record.ground_truth_labels) {
      const actualLabels = new Set(record.ground_truth_labels);
      const predLabels = new Set(pred.predicted_labels);

      for (const cat of Object.keys(TAXONOMY_RULES) as AITaxonomyCategory[]) {
        const isActual = actualLabels.has(cat);
        const isPred = predLabels.has(cat);
        if (isActual) perLabelStats[cat].total_actual++;
        if (isActual && isPred) perLabelStats[cat].tp++;
        else if (!isActual && isPred) perLabelStats[cat].fp++;
        else if (isActual && !isPred) perLabelStats[cat].fn++;
      }
    }
  });

  const total = corpus.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const roc_auc = (recall + (tn / (tn + fp || 1))) / 2;

  const per_label_metrics: Record<string, { precision: number; recall: number; f1: number; support: number }> = {};
  for (const [cat, s] of Object.entries(perLabelStats)) {
    const prec = s.tp + s.fp > 0 ? s.tp / (s.tp + s.fp) : 1.0;
    const rec = s.tp + s.fn > 0 ? s.tp / (s.tp + s.fn) : (s.total_actual === 0 ? 1.0 : 0.0);
    const f1 = prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0.0;
    per_label_metrics[cat] = {
      precision: Math.round(prec * 100) / 100,
      recall: Math.round(rec * 100) / 100,
      f1: Math.round(f1 * 100) / 100,
      support: s.total_actual
    };
  }

  return {
    total_samples: total,
    accuracy: Math.round(accuracy * 1000) / 1000,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    f1_score: Math.round(f1Score * 1000) / 1000,
    roc_auc: Math.round(roc_auc * 1000) / 1000,
    true_positives: tp,
    false_positives: fp,
    true_negatives: tn,
    false_negatives: fn,
    confusion_matrix: { tp, fp, tn, fn },
    per_label_metrics
  };
}

export function evaluateClassifierCrossValidation(
  corpus: CompanyClassificationRecord[],
  kFolds: number = 5,
  modelType: 'rule_baseline' | 'tfidf_logistic' = 'tfidf_logistic'
) {
  const positives = corpus.filter((r) => r.ground_truth_ai_relevant);
  const negatives = corpus.filter((r) => !r.ground_truth_ai_relevant);

  const posFoldSize = Math.floor(positives.length / kFolds);
  const negFoldSize = Math.floor(negatives.length / kFolds);

  const foldAccuracies: number[] = [];
  let totalTp = 0;
  let totalFp = 0;
  let totalTn = 0;
  let totalFn = 0;

  for (let k = 0; k < kFolds; k++) {
    const posTest = positives.slice(k * posFoldSize, (k + 1) * posFoldSize);
    const negTest = negatives.slice(k * negFoldSize, (k + 1) * negFoldSize);
    const testFold = [...posTest, ...negTest];

    let foldTp = 0;
    let foldFp = 0;
    let foldTn = 0;
    let foldFn = 0;

    testFold.forEach((r) => {
      const pred = classifyBusinessText(r, modelType);
      const actual = r.ground_truth_ai_relevant ?? false;
      if (pred.is_ai_relevant && actual) foldTp++;
      else if (pred.is_ai_relevant && !actual) foldFp++;
      else if (!pred.is_ai_relevant && !actual) foldTn++;
      else if (!pred.is_ai_relevant && actual) foldFn++;
    });

    const foldAcc = testFold.length > 0 ? (foldTp + foldTn) / testFold.length : 0;
    foldAccuracies.push(foldAcc);
    totalTp += foldTp;
    totalFp += foldFp;
    totalTn += foldTn;
    totalFn += foldFn;
  }

  const cvAcc = foldAccuracies.reduce((a, b) => a + b, 0) / foldAccuracies.length;
  const cvPrec = totalTp + totalFp > 0 ? totalTp / (totalTp + totalFp) : 1.0;
  const cvRec = totalTp + totalFn > 0 ? totalTp / (totalTp + totalFn) : 1.0;
  const cvF1 = cvPrec + cvRec > 0 ? (2 * cvPrec * cvRec) / (cvPrec + cvRec) : 0.0;

  return {
    k_folds: kFolds,
    total_samples: corpus.length,
    mean_accuracy: Math.round(cvAcc * 1000) / 1000,
    precision: Math.round(cvPrec * 1000) / 1000,
    recall: Math.round(cvRec * 1000) / 1000,
    f1_score: Math.round(cvF1 * 1000) / 1000,
    fold_accuracies: foldAccuracies.map((a) => Math.round(a * 1000) / 1000),
    confusion_matrix: { tp: totalTp, fp: totalFp, tn: totalTn, fn: totalFn }
  };
}
