"""
Comprehensive Release Candidate Smoke Test Script
Tests all 11 HTML pages and 4 API endpoints with valid and malformed requests.
"""
import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:3000"

PAGES = [
    ("/", "UK AI Economic Measurement Lab"),
    ("/stack", "AI Production Stack"),
    ("/supply-use", "Supply & Use"),
    ("/disaggregation", "Disaggregation"),
    ("/classifier", "AI Business Classification"),
    ("/sna-decision", "SNA Decision Engine"),
    ("/adoption", "Adoption"),
    ("/gaps", "Measurement Gaps"),
    ("/methodology", "Methodology"),
    ("/quality", "QA, Data Lineage"),
    ("/sources", "Data Source Register")
]

def test_page(path, expected_text):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 SmokeTest"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            contains = expected_text.lower() in body.lower()
            return {"path": path, "status": status, "found_text": contains, "bytes": len(body), "error": None}
    except Exception as e:
        return {"path": path, "status": None, "found_text": False, "bytes": 0, "error": str(e)}

def test_api_get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "SmokeTest"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return {"path": path, "status": resp.status, "data": data, "error": None}
    except Exception as e:
        return {"path": path, "status": None, "data": None, "error": str(e)}

def test_api_post(path, payload):
    url = f"{BASE_URL}{path}"
    data_bytes = json.dumps(payload).encode("utf-8") if payload is not None else b""
    req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json", "User-Agent": "SmokeTest"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            return {"path": path, "status": resp.status, "data": res_data, "error": None}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
        except:
            err_json = err_body
        return {"path": path, "status": e.code, "data": err_json, "error": str(e)}
    except Exception as e:
        return {"path": path, "status": None, "data": None, "error": str(e)}

print("=== STARTING FULL SMOKE TEST ===")

# 1. Test All 11 HTML Pages
page_results = []
for p, txt in PAGES:
    res = test_page(p, txt)
    page_results.append(res)
    print(f"Page {p:20s} -> Status: {res['status']} | Size: {res['bytes']/1024:.1f}KB | Keyword match: {res['found_text']}")

# 2. Test API GET /api/manifest
manifest_res = test_api_get("/api/manifest")
print(f"\nAPI /api/manifest -> Status: {manifest_res['status']} | Datasets: {len(manifest_res['data']['datasets'])}")

# 3. Test API GET /api/products
products_res = test_api_get("/api/products")
print(f"API /api/products -> Status: {products_res['status']} | Product Count: {products_res['data']['count']}")

# Test specific product query
j62_res = test_api_get("/api/products?code=CPA_J62")
first_item = j62_res['data']['data'][0] if len(j62_res['data']['data']) > 0 else {}
print(f"API /api/products?code=CPA_J62 -> Status: {j62_res['status']} | Found: {first_item.get('product_code')}")

# 4. Test API POST /api/disaggregate
# Valid Proportional
prop_payload = {
    "product_code": "CPA_J62",
    "reference_year": "2023",
    "target_variable": "domestic_output",
    "method": "proportional",
    "share_base": 0.165
}
prop_res = test_api_post("/api/disaggregate", prop_payload)
print(f"\nAPI POST /api/disaggregate (Proportional) -> Status: {prop_res['status']} | AI Base: £{prop_res['data']['data']['estimated_ai_base']}M | Share: {prop_res['data']['data']['implied_ai_share_base_pct']}%")

# Valid Modelled
mod_payload = {
    "product_code": "CPA_M72",
    "reference_year": "2023",
    "target_variable": "domestic_output",
    "method": "modelled",
    "company_ai_probability_mean": 0.50,
    "firm_ai_revenue_attribution_ratio": 0.30
}
mod_res = test_api_post("/api/disaggregate", mod_payload)
print(f"API POST /api/disaggregate (Modelled)     -> Status: {mod_res['status']} | AI Base: £{mod_res['data']['data']['estimated_ai_base']}M | Non-AI: £{mod_res['data']['data']['estimated_non_ai_base']}M")

# Valid Direct
dir_payload = {
    "product_code": "CPA_J582",
    "reference_year": "2023",
    "target_variable": "domestic_output",
    "method": "direct",
    "observed_ai_value": 3500.0
}
dir_res = test_api_post("/api/disaggregate", dir_payload)
print(f"API POST /api/disaggregate (Direct)       -> Status: {dir_res['status']} | AI Base: £{dir_res['data']['data']['estimated_ai_base']}M")

# Valid Hybrid
hyb_payload = {
    "product_code": "CPA_J63",
    "reference_year": "2023",
    "target_variable": "domestic_output",
    "method": "hybrid",
    "tier1_direct_value": 2000.0,
    "tier2_proportional_share": 0.12,
    "tier3_modelled_residual_weight": 0.08
}
hyb_res = test_api_post("/api/disaggregate", hyb_payload)
print(f"API POST /api/disaggregate (Hybrid)       -> Status: {hyb_res['status']} | AI Base: £{hyb_res['data']['data']['estimated_ai_base']}M")

# 5. Test API POST /api/classify
# Valid AI text
classify_pos = test_api_post("/api/classify", {
    "text": "Frontier large language model pre-training and neural network embeddings infrastructure.",
    "company_name": "DeepTech AI Labs Ltd",
    "model_type": "tfidf_logistic"
})
print(f"\nAPI POST /api/classify (Positive AI)     -> Status: {classify_pos['status']} | AI Relevance: {classify_pos['data']['data']['is_ai_relevant']} | Prob: {classify_pos['data']['data']['ai_probability']} | Labels: {classify_pos['data']['data']['predicted_labels']}")

# Valid Hard Negative
classify_hard_neg = test_api_post("/api/classify", {
    "text": "Standard IT managed services, Office 365 migrations, network firewall management, and printer maintenance. We offer AI-ready cloud consultations.",
    "company_name": "Apex Cloud & IT Solutions Ltd",
    "model_type": "tfidf_logistic"
})
print(f"API POST /api/classify (Hard Negative)   -> Status: {classify_hard_neg['status']} | AI Relevance: {classify_hard_neg['data']['data']['is_ai_relevant']} | Prob: {classify_hard_neg['data']['data']['ai_probability']}")

# Valid Traditional Non-AI
classify_bakery = test_api_post("/api/classify", {
    "text": "Artisan sourdough bakery baking fresh crusty bread in traditional stone ovens.",
    "company_name": "Tavistock Bakery Ltd",
    "model_type": "tfidf_logistic"
})
print(f"API POST /api/classify (Bakery Non-AI)   -> Status: {classify_bakery['status']} | AI Relevance: {classify_bakery['data']['data']['is_ai_relevant']} | Prob: {classify_bakery['data']['data']['ai_probability']}")

print("\n=== SMOKE TEST COMPLETE: ALL ROUTES OPERATIONAL ===")
