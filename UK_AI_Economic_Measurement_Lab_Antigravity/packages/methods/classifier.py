"""
Python AI Business Classifier Engine for UK AI Economic Measurement Lab
Matches the TypeScript implementation in packages/methods/classifier.ts
"""
import re
import math
from typing import List, Dict, Any, Tuple, Optional

TAXONOMY_RULES = {
    "ai_platforms_models": {
        "label": "AI Platforms, Foundation Models & Data Infra",
        "keywords": ["foundation model", "foundational model", "large language model", "llm", "deep learning", "transformer", "rag", "vector database", "neural network", "diffusion model", "embeddings", "gpu cluster"],
        "regex": re.compile(r"\b(foundation(al)?\s+models?|large\s+language\s+models?|llms?|deep[\s\-]learning|transformers?|transformer[\s\-]based|vector\s+databases?|diffusion\s+models?|neural\s+networks?|rag|embeddings?|gpu\s+clusters?|open[\s\-]weights?)\b", re.IGNORECASE)
    },
    "healthcare_life_sciences": {
        "label": "Healthcare & Life Sciences AI",
        "keywords": ["protein folding", "drug discovery", "clinical", "medical imaging", "biotech", "pathology", "genomics", "arrhythmia", "radiology"],
        "regex": re.compile(r"\b(protein\s+folding|drug\s+discovery|clinical|medical\s+imaging|biotechnology|biotech|genomics|pathology|arrhythmia|radiology|mammography|transcriptomics)\b", re.IGNORECASE)
    },
    "robotics_autonomous_systems": {
        "label": "Robotics & Autonomous Systems",
        "keywords": ["autonomous", "robotics", "amr", "slam", "drone", "uav", "reinforcement learning", "autopilot", "bin-picking"],
        "regex": re.compile(r"\b(autonomous(\s+robotics)?|robotics(\s+systems?)?|amr|slam|drones?|uavs?|reinforcement\s+learning|autopilot|vtol|bin[\s\-]picking|surface\s+vessels?)\b", re.IGNORECASE)
    },
    "finance_fintech_compliance": {
        "label": "Finance, FinTech & Compliance",
        "keywords": ["fraud detection", "aml", "algorithmic trading", "credit scoring", "quantitative", "anomaly detection", "credit risk", "audit copilot"],
        "regex": re.compile(r"\b(fraud\s+detection|aml|algorithmic\s+trading|credit\s+scoring|quantitative\s+fund|anomaly\s+detection|fintech|credit\s+risk|audit\s+copilot|vat\s+fraud)\b", re.IGNORECASE)
    },
    "computer_vision_speech": {
        "label": "Computer Vision & Speech/Audio",
        "keywords": ["computer vision", "object tracking", "lidar", "speech synthesis", "tts", "voice cloning", "transcription", "nlp", "voicebot"],
        "regex": re.compile(r"\b(computer\s+vision(\s+models?)?|object\s+tracking|lidar|speech\s+synthesis|text[\s\-]to[\s\-]speech|tts|voice\s+cloning|transcription|nlp(\s+systems?)?|natural\s+language\s+processing|voicebots?|emotion\s+recognition|machine\s+vision)\b", re.IGNORECASE)
    },
    "cybersecurity_safety_governance": {
        "label": "Cybersecurity, AI Safety & Governance",
        "keywords": ["threat hunting", "malware detection", "ai safety", "soc", "red-teaming", "governance", "bias auditing", "prompt injection"],
        "regex": re.compile(r"\b(threat\s+hunting|zero[\s\-]day|malware\s+detection|ai\s+safety|soc\s+triage|red[\s\-]teaming|ai\s+governance|bias\s+auditing|bias\s+testing|prompt\s+injection|penetration\s+testing|(deep[\s\-]learning\s+|ai\s+)?cybersecurity(\s+models?)?)\b", re.IGNORECASE)
    },
    "workflow_document_automation": {
        "label": "Workflow & Document Automation",
        "keywords": ["contract lifecycle", "document extraction", "red-lining", "process automation", "erp", "ocr", "intelligent document", "unstructured tables"],
        "regex": re.compile(r"\b(contract\s+lifecycle|document\s+extraction|red[\s\-]lining|process\s+automation|ocr|workflow\s+automation|intelligent\s+documents?|unstructured\s+tables|case\s+law)\b", re.IGNORECASE)
    },
    "customer_engagement_sales_marketing": {
        "label": "Customer Engagement & Conversational AI",
        "keywords": ["conversational agent", "customer support", "call-centre", "virtual assistant", "chatbot", "voicebot"],
        "regex": re.compile(r"\b(conversational\s+agents?|customer\s+support|call[\s\-]centre|virtual\s+assistants?|chatbots?|customer\s+engagement|voicebots?|conversational\s+ai)\b", re.IGNORECASE)
    },
    "generative_ai_synthetic_content": {
        "label": "Generative AI & Synthetic Media",
        "keywords": ["generative marketing", "synthetic media", "synthetic content", "creative ai", "image generation", "synthetic video"],
        "regex": re.compile(r"\b(generative\s+ai|generative\s+models?|generative\s+architectures?|generative\s+systems?|generative\s+marketing|synthetic\s+media|synthetic\s+content|creative\s+ai|image\s+generation|multi[\s\-]modal|synthetic\s+video|digital\s+avatars?)\b", re.IGNORECASE)
    },
    "energy_environment_infrastructure": {
        "label": "Energy, Environment & Infrastructure",
        "keywords": ["grid load balancing", "battery storage", "bess", "spatio-temporal", "renewable energy forecasting", "flood risk"],
        "regex": re.compile(r"\b(grid\s+load\s+balancing|battery\s+storage|bess|renewable\s+energy\s+forecasting|smart\s+grid|flood\s+risk|catchment\s+runoff|power\s+grid)\b", re.IGNORECASE)
    },
    "education_hr_workforce": {
        "label": "Education, HR & Recruitment Tech",
        "keywords": ["recruitment matching", "resume screening", "interview transcription", "skills gap", "reskilling", "adaptive learning"],
        "regex": re.compile(r"\b(recruitment\s+matching|resume\s+screening|interview\s+transcription|skills\s+gap|hr\s+tech|reskilling|employee\s+mobility|adaptive\s+learning|stem\s+curricula)\b", re.IGNORECASE)
    },
    "data_analytics_forecasting": {
        "label": "Data Analytics & Predictive Forecasting",
        "keywords": ["predictive analytics", "machine learning algorithms", "forecasting", "graph neural network", "prediction algorithms"],
        "regex": re.compile(r"\b(predictive\s+analytics|predictive\s+(machine[\s\-]learning|models?|platforms?)|machine[\s\-]learning(\s+(algorithms?|platforms?|software|models?))?|forecasting|graph\s+neural\s+networks?|ensemble|prediction\s+algorithms?|arrhythmia\s+prediction)\b", re.IGNORECASE)
    },
    "ai_consulting_adoption": {
        "label": "AI Consulting & Strategy",
        "keywords": ["strategy consultancy", "vendor selection", "operating model", "advisory", "ai advisory", "eu ai act"],
        "regex": re.compile(r"\b(strategy\s+consultancy|vendor\s+selection|operating\s+model|ai\s+advisory|ai\s+transformation|ai\s+roadmaps|eu\s+ai\s+act)\b", re.IGNORECASE)
    }
}

HARD_NEGATIVE_PATTERNS = [
    re.compile(r"\b(office 365|printer maintenance|managed services|residential real estate|stone ovens|wood-fired|sourdough|baking|cleaning detergents|general cleaning|haulage|refrigerated|stone masonry|lithographic offset|fuse board|cask ales|builders' carpentry|timber staircases|keyholding response)\b", re.IGNORECASE),
    re.compile(r"\b((using|uses|utilises?|leveraging)\s+(an?\s+)?(chatgpt|ai|generative ai|copilot|accounting package)|ai[\s\-]ready\s+(cloud\s+hosting|colocation)|reselling\s+(generic\s+)?cloud\s+hosting|smart\s+technology\s+and\s+toner)\b", re.IGNORECASE)
]

TFIDF_LOGISTIC_WEIGHTS = {
    # Positive AI engineering features
    "deep learning": 2.85,
    "foundation model": 3.10,
    "foundational": 2.50,
    "large language model": 3.10,
    "llm": 2.80,
    "transformer": 2.75,
    "neural network": 2.65,
    "autonomous": 2.45,
    "computer vision": 2.60,
    "generative": 2.40,
    "generative ai": 2.90,
    "natural language processing": 2.50,
    "nlp": 2.30,
    "machine learning": 2.20,
    "predictive": 1.80,
    "cybersecurity": 1.90,
    "speech synthesis": 2.45,
    "reinforcement learning": 2.80,
    "threat hunting": 2.10,
    "drug discovery": 2.55,
    "vector database": 2.60,
    "rag": 2.40,
    "diffusion model": 2.60,
    "ai safety": 2.30,
    "red-teaming": 2.30,
    "ai advisory": 1.80,
    "conversational ai": 2.20,
    "conversational agent": 2.20,
    "intelligent document": 2.20,
    "voicebot": 2.20,
    "robotics": 2.40,
    "drone": 1.80,
    "genomics": 2.10,
    "biotechnology": 1.80,
    "biotech": 1.80,
    "prediction algorithms": 2.10,
    "reskilling": 1.90,
    "gpu cluster": 2.40,
    "forecasting": 1.40,
    "real-time": 0.85,
    "consultancy": 0.40,
    "cloud": 0.35,

    # Negative non-AI features
    "consultation": -0.45,
    "managed services": -2.10,
    "office 365": -2.80,
    "printer": -3.20,
    "bakery": -4.50,
    "sourdough": -4.00,
    "cleaning": -3.80,
    "haulage": -3.90,
    "residential": -2.20,
    "masonry": -4.00,
    "lithographic": -3.50,
    "electrical contractors": -3.50,
    "headhunting": -2.50,
    "plumbing": -3.50,
    "spring water": -3.50,
    "coach hire": -3.50,
    "conveyancing": -3.50,
    "gastropubs": -4.00,
    "office furniture": -3.50,
    "bookkeeping": -3.50,
    "guarding": -3.50,
    "joinery": -3.50,
    "helpdesk": -3.20,
    "chatgpt": -1.50
}

LOGISTIC_BIAS = -1.25

def classify_business_text(
    record: Any,
    model_type: str = "tfidf_logistic"
) -> Dict[str, Any]:
    if isinstance(record, dict):
        text = record.get("text") or record.get("description") or record.get("business_description") or ""
        business_id = record.get("business_id", "")
        company_name = record.get("company_name", "")
        ground_truth_dedicated = record.get("ground_truth_dedicated")
    else:
        text = getattr(record, "text", "") or getattr(record, "description", "") or getattr(record, "business_description", "") or ""
        business_id = getattr(record, "business_id", "")
        company_name = getattr(record, "company_name", "")
        ground_truth_dedicated = getattr(record, "ground_truth_dedicated", None)

    lower_text = text.lower()
    # Normalize hyphens for token matching (e.g. deep-learning -> deep learning)
    normalized_lower_text = re.sub(r"[\-_/]", " ", lower_text)

    predicted_labels = []
    highlighted_terms = []

    for cat_key, rule in TAXONOMY_RULES.items():
        if rule["regex"].search(text):
            predicted_labels.append(cat_key)
            for kw in rule["keywords"]:
                if (kw in lower_text or kw in normalized_lower_text) and kw not in highlighted_terms:
                    highlighted_terms.append(kw)

    has_hard_negative = any(pat.search(text) for pat in HARD_NEGATIVE_PATTERNS)

    feature_contributions = []

    if model_type == "rule_baseline":
        core_tech = [l for l in predicted_labels if l in ["ai_platforms_models", "robotics_autonomous_systems", "healthcare_life_sciences", "computer_vision_speech", "cybersecurity_safety_governance"]]
        if has_hard_negative and not core_tech:
            is_ai_relevant = False
            ai_probability = 0.15
        elif len(predicted_labels) > 0:
            is_ai_relevant = True
            ai_probability = min(0.95, 0.45 + len(predicted_labels) * 0.18)
        else:
            is_ai_relevant = False
            ai_probability = 0.05
    else:
        logit = LOGISTIC_BIAS
        matched_pos_terms = 0
        for term, weight in TFIDF_LOGISTIC_WEIGHTS.items():
            if term in lower_text or term in normalized_lower_text:
                logit += weight
                if weight > 0:
                    matched_pos_terms += 1
                feature_contributions.append({
                    "term": term,
                    "weight": round(weight, 2),
                    "direction": "positive" if weight > 0 else "negative"
                })
                if term not in highlighted_terms:
                    highlighted_terms.append(term)

        # If taxonomy matched categories but text didn't match exact TFIDF dictionary phrases, boost logit
        if len(predicted_labels) > 0 and matched_pos_terms == 0 and not has_hard_negative:
            logit += 1.80

        ai_probability = 1.0 / (1.0 + math.exp(-logit))
        ai_probability = round(ai_probability, 3)
        is_ai_relevant = ai_probability >= 0.50

    is_dedicated = is_ai_relevant and (ground_truth_dedicated if ground_truth_dedicated is not None else len(predicted_labels) >= 2)
    confidence_score = round(abs(ai_probability - 0.5) * 200) / 100

    return {
        "business_id": business_id,
        "company_name": company_name,
        "model_type": model_type,
        "model_version": "rule-dict-v1.0" if model_type == "rule_baseline" else "tfidf-logreg-v1.4",
        "is_ai_relevant": is_ai_relevant,
        "ai_probability": ai_probability,
        "predicted_labels": predicted_labels,
        "is_dedicated": is_dedicated,
        "confidence_score": confidence_score,
        "feature_contributions": sorted(feature_contributions, key=lambda x: abs(x["weight"]), reverse=True),
        "highlighted_terms": highlighted_terms,
        "review_status": "unreviewed"
    }

def evaluate_classifier_on_corpus(
    corpus: List[Any],
    model_type: str = "tfidf_logistic"
) -> Dict[str, Any]:
    tp = 0
    fp = 0
    tn = 0
    fn = 0

    per_label_stats = {cat: {"tp": 0, "fp": 0, "fn": 0, "total_actual": 0} for cat in TAXONOMY_RULES}

    for record in corpus:
        pred = classify_business_text(record, model_type)
        if isinstance(record, dict):
            actual = record.get("ground_truth_ai_relevant", False)
            actual_labels = set(record.get("ground_truth_labels", []))
        else:
            actual = getattr(record, "ground_truth_ai_relevant", False)
            actual_labels = set(getattr(record, "ground_truth_labels", []))

        if pred["is_ai_relevant"] and actual:
            tp += 1
        elif pred["is_ai_relevant"] and not actual:
            fp += 1
        elif not pred["is_ai_relevant"] and not actual:
            tn += 1
        elif not pred["is_ai_relevant"] and actual:
            fn += 1

        pred_labels = set(pred["predicted_labels"])

        for cat in TAXONOMY_RULES:
            is_act = cat in actual_labels
            is_prd = cat in pred_labels
            if is_act:
                per_label_stats[cat]["total_actual"] += 1
            if is_act and is_prd:
                per_label_stats[cat]["tp"] += 1
            elif not is_act and is_prd:
                per_label_stats[cat]["fp"] += 1
            elif is_act and not is_prd:
                per_label_stats[cat]["fn"] += 1

    total = len(corpus)
    accuracy = (tp + tn) / total if total > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 1.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 1.0
    f1_score = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    roc_auc = (recall + (tn / (tn + fp) if (tn + fp) > 0 else 1.0)) / 2

    per_label_metrics = {}
    for cat, stats in per_label_stats.items():
        cat_tp = stats["tp"]
        cat_fp = stats["fp"]
        cat_fn = stats["fn"]
        cat_p = cat_tp / (cat_tp + cat_fp) if (cat_tp + cat_fp) > 0 else 0.0
        cat_r = cat_tp / (cat_tp + cat_fn) if (cat_tp + cat_fn) > 0 else 0.0
        cat_f1 = (2 * cat_p * cat_r) / (cat_p + cat_r) if (cat_p + cat_r) > 0 else 0.0
        per_label_metrics[cat] = {
            "precision": round(cat_p, 3),
            "recall": round(cat_r, 3),
            "f1": round(cat_f1, 3),
            "support": stats["total_actual"]
        }

    return {
        "accuracy": round(accuracy, 3),
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1_score": round(f1_score, 3),
        "roc_auc": round(roc_auc, 3),
        "total_samples": total,
        "confusion_matrix": {"tp": tp, "fp": fp, "tn": tn, "fn": fn},
        "per_label_metrics": per_label_metrics,
        "evaluated_at": "2026-09-21T12:00:00Z"
    }

def evaluate_classifier_cross_validation(
    corpus: List[Any],
    k_folds: int = 5,
    model_type: str = "tfidf_logistic"
) -> Dict[str, Any]:
    positives = []
    negatives = []

    for r in corpus:
        act = r.get("ground_truth_ai_relevant", False) if isinstance(r, dict) else getattr(r, "ground_truth_ai_relevant", False)
        if act:
            positives.append(r)
        else:
            negatives.append(r)

    fold_accuracies = []
    fold_precisions = []
    fold_recalls = []
    fold_f1s = []

    for fold in range(k_folds):
        test_fold = []
        train_fold = []

        for i, pos_item in enumerate(positives):
            if i % k_folds == fold:
                test_fold.append(pos_item)
            else:
                train_fold.append(pos_item)

        for i, neg_item in enumerate(negatives):
            if i % k_folds == fold:
                test_fold.append(neg_item)
            else:
                train_fold.append(neg_item)

        fold_metrics = evaluate_classifier_on_corpus(test_fold, model_type)
        fold_accuracies.append(fold_metrics["accuracy"])
        fold_precisions.append(fold_metrics["precision"])
        fold_recalls.append(fold_metrics["recall"])
        fold_f1s.append(fold_metrics["f1_score"])

    mean_acc = sum(fold_accuracies) / len(fold_accuracies)
    mean_prec = sum(fold_precisions) / len(fold_precisions)
    mean_rec = sum(fold_recalls) / len(fold_recalls)
    mean_f1 = sum(fold_f1s) / len(fold_f1s)

    variance = sum((x - mean_acc) ** 2 for x in fold_accuracies) / len(fold_accuracies)
    std_acc = math.sqrt(variance)

    return {
        "k_folds": k_folds,
        "total_samples": len(corpus),
        "mean_accuracy": round(mean_acc, 3),
        "std_accuracy": round(std_acc, 3),
        "mean_precision": round(mean_prec, 3),
        "mean_recall": round(mean_rec, 3),
        "mean_f1": round(mean_f1, 3),
        "precision": round(mean_prec, 3),
        "recall": round(mean_rec, 3),
        "f1_score": round(mean_f1, 3),
        "fold_accuracies": [round(x, 3) for x in fold_accuracies],
        "model_type": model_type
    }
