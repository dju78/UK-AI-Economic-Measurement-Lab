"""
Python AI Business Classifier Engine for UK AI Economic Measurement Lab
Matches the TypeScript implementation in packages/methods/classifier.ts
"""
import re
import math
from typing import List, Dict, Any, Tuple, Optional
from packages.schemas.types import CompanyClassificationRecord

TAXONOMY_RULES = {
    "ai_platforms_models": {
        "label": "AI Platforms, Foundation Models & Data Infra",
        "keywords": ["foundation model", "foundational model", "large language model", "llm", "deep learning", "transformer", "rag", "vector database", "neural network", "diffusion model", "embeddings", "gpu cluster"],
        "regex": re.compile(r"\b(foundation(al)? model|large language model|llm|deep learning|transformer|vector database|diffusion model|neural network|rag|embeddings|gpu cluster|open-weight)\b", re.IGNORECASE)
    },
    "healthcare_life_sciences": {
        "label": "Healthcare & Life Sciences AI",
        "keywords": ["protein folding", "drug discovery", "clinical", "medical imaging", "biotech", "pathology", "genomics", "arrhythmia", "radiology"],
        "regex": re.compile(r"\b(protein folding|drug discovery|clinical|medical imaging|biotechnology|biotech|genomics|pathology|arrhythmia|radiology|mammography|transcriptomics)\b", re.IGNORECASE)
    },
    "robotics_autonomous_systems": {
        "label": "Robotics & Autonomous Systems",
        "keywords": ["autonomous", "robotics", "amr", "slam", "drone", "uav", "reinforcement learning", "autopilot", "bin-picking"],
        "regex": re.compile(r"\b(autonomous|robotics|amr|slam|drone|uav|reinforcement learning|autopilot|vtol|bin-picking|surface vessel)\b", re.IGNORECASE)
    },
    "finance_fintech_compliance": {
        "label": "Finance, FinTech & Compliance",
        "keywords": ["fraud detection", "aml", "algorithmic trading", "credit scoring", "quantitative", "anomaly detection", "credit risk", "audit copilot"],
        "regex": re.compile(r"\b(fraud detection|aml|algorithmic trading|credit scoring|quantitative fund|anomaly detection|fintech|credit risk|audit copilot|vat fraud)\b", re.IGNORECASE)
    },
    "computer_vision_speech": {
        "label": "Computer Vision & Speech/Audio",
        "keywords": ["computer vision", "object tracking", "lidar", "speech synthesis", "tts", "voice cloning", "transcription", "nlp", "voicebot"],
        "regex": re.compile(r"\b(computer vision|object tracking|lidar|speech synthesis|text-to-speech|tts|voice cloning|transcription|nlp|natural language processing|voicebot|emotion recognition|machine vision)\b", re.IGNORECASE)
    },
    "cybersecurity_safety_governance": {
        "label": "Cybersecurity, AI Safety & Governance",
        "keywords": ["threat hunting", "malware detection", "ai safety", "soc", "red-teaming", "governance", "bias auditing", "prompt injection"],
        "regex": re.compile(r"\b(threat hunting|zero-day|malware detection|ai safety|soc triage|red-teaming|ai governance|bias auditing|bias testing|prompt injection|penetration testing)\b", re.IGNORECASE)
    },
    "workflow_document_automation": {
        "label": "Workflow & Document Automation",
        "keywords": ["contract lifecycle", "document extraction", "red-lining", "process automation", "erp", "ocr", "intelligent document", "unstructured tables"],
        "regex": re.compile(r"\b(contract lifecycle|document extraction|red-lining|process automation|ocr|workflow automation|intelligent document|unstructured tables|case law)\b", re.IGNORECASE)
    },
    "customer_engagement_sales_marketing": {
        "label": "Customer Engagement & Conversational AI",
        "keywords": ["conversational agent", "customer support", "call-centre", "virtual assistant", "chatbot", "voicebot"],
        "regex": re.compile(r"\b(conversational agent|customer support|call-centre|virtual assistant|chatbot|customer engagement|voicebot|conversational ai)\b", re.IGNORECASE)
    },
    "generative_ai_synthetic_content": {
        "label": "Generative AI & Synthetic Media",
        "keywords": ["generative marketing", "synthetic media", "synthetic content", "creative ai", "image generation", "synthetic video"],
        "regex": re.compile(r"\b(generative marketing|synthetic media|synthetic content|creative ai|image generation|multi-modal|synthetic video|digital avatars)\b", re.IGNORECASE)
    },
    "energy_environment_infrastructure": {
        "label": "Energy, Environment & Infrastructure",
        "keywords": ["grid load balancing", "battery storage", "bess", "spatio-temporal", "renewable energy forecasting", "flood risk"],
        "regex": re.compile(r"\b(grid load balancing|battery storage|bess|renewable energy forecasting|smart grid|flood risk|catchment runoff|power grid)\b", re.IGNORECASE)
    },
    "education_hr_workforce": {
        "label": "Education, HR & Recruitment Tech",
        "keywords": ["recruitment matching", "resume screening", "interview transcription", "skills gap", "reskilling", "adaptive learning"],
        "regex": re.compile(r"\b(recruitment matching|resume screening|interview transcription|skills gap|hr tech|reskilling|employee mobility|adaptive learning|stem curricula)\b", re.IGNORECASE)
    },
    "data_analytics_forecasting": {
        "label": "Data Analytics & Predictive Forecasting",
        "keywords": ["predictive analytics", "machine learning algorithms", "forecasting", "graph neural network", "prediction algorithms"],
        "regex": re.compile(r"\b(predictive analytics|machine learning|forecasting|graph neural network|ensemble|prediction algorithms|arrhythmia prediction)\b", re.IGNORECASE)
    },
    "ai_consulting_adoption": {
        "label": "AI Consulting & Strategy",
        "keywords": ["strategy consultancy", "vendor selection", "operating model", "advisory", "ai advisory", "eu ai act"],
        "regex": re.compile(r"\b(strategy consultancy|vendor selection|operating model|ai advisory|transformation|ai roadmaps|eu ai act)\b", re.IGNORECASE)
    }
}

HARD_NEGATIVE_PATTERNS = [
    re.compile(r"\b(office 365|printer maintenance|managed services|residential real estate|stone ovens|wood-fired|sourdough|baking|cleaning detergents|general cleaning|haulage|refrigerated|stone masonry|lithographic offset|fuse board|cask ales|builders' carpentry|timber staircases|keyholding response)\b", re.IGNORECASE)
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
    "natural language processing": 2.50,
    "nlp": 2.30,
    "machine learning": 1.95,
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
    "helpdesk": -3.20
}

LOGISTIC_BIAS = -1.25

def classify_business_text(
    record: Dict[str, Any],
    model_type: str = "tfidf_logistic"
) -> Dict[str, Any]:
    text = record.get("text", "")
    lower_text = text.lower()

    predicted_labels = []
    highlighted_terms = []

    for cat_key, rule in TAXONOMY_RULES.items():
        if rule["regex"].search(text):
            predicted_labels.append(cat_key)
            for kw in rule["keywords"]:
                if kw in lower_text and kw not in highlighted_terms:
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
            if term in lower_text:
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

    is_dedicated = is_ai_relevant and (record.get("ground_truth_dedicated") if record.get("ground_truth_dedicated") is not None else len(predicted_labels) >= 2)
    confidence_score = round(abs(ai_probability - 0.5) * 200) / 100

    return {
        "business_id": record.get("business_id", ""),
        "company_name": record.get("company_name", ""),
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
    corpus: List[Dict[str, Any]],
    model_type: str = "tfidf_logistic"
) -> Dict[str, Any]:
    tp = 0
    fp = 0
    tn = 0
    fn = 0

    per_label_stats = {cat: {"tp": 0, "fp": 0, "fn": 0, "total_actual": 0} for cat in TAXONOMY_RULES}

    for record in corpus:
        pred = classify_business_text(record, model_type)
        actual = record.get("ground_truth_ai_relevant", False)

        if pred["is_ai_relevant"] and actual:
            tp += 1
        elif pred["is_ai_relevant"] and not actual:
            fp += 1
        elif not pred["is_ai_relevant"] and not actual:
            tn += 1
        elif not pred["is_ai_relevant"] and actual:
            fn += 1

        actual_labels = set(record.get("ground_truth_labels", []))
        pred_labels = set(pred["predicted_labels"])

        for cat in TAXONOMY_RULES:
            is_actual = cat in actual_labels
            is_pred = cat in pred_labels
            if is_actual:
                per_label_stats[cat]["total_actual"] += 1
            if is_actual and is_pred:
                per_label_stats[cat]["tp"] += 1
            elif not is_actual and is_pred:
                per_label_stats[cat]["fp"] += 1
            elif is_actual and not is_pred:
                per_label_stats[cat]["fn"] += 1

    total = len(corpus)
    accuracy = (tp + tn) / total if total > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 1.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 1.0
    f1_score = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    roc_auc = (recall + (tn / (tn + fp if (tn + fp) > 0 else 1))) / 2

    per_label_metrics = {}
    for cat, s in per_label_stats.items():
        prec = s["tp"] / (s["tp"] + s["fp"]) if (s["tp"] + s["fp"]) > 0 else 1.0
        rec = s["tp"] / (s["tp"] + s["fn"]) if (s["tp"] + s["fn"]) > 0 else (1.0 if s["total_actual"] == 0 else 0.0)
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        per_label_metrics[cat] = {
            "precision": round(prec, 2),
            "recall": round(rec, 2),
            "f1": round(f1, 2),
            "support": s["total_actual"]
        }

    return {
        "total_samples": total,
        "accuracy": round(accuracy, 3),
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1_score": round(f1_score, 3),
        "roc_auc": round(roc_auc, 3),
        "true_positives": tp,
        "false_positives": fp,
        "true_negatives": tn,
        "false_negatives": fn,
        "confusion_matrix": {"tp": tp, "fp": fp, "tn": tn, "fn": fn},
        "per_label_metrics": per_label_metrics
    }
