import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
base = 'https://uk-ai-economic-measurement-lab.vercel.app'

test_groups = {
    'ORIGINAL FAILING TEST CASE': [
        ('ORIG_01', 'Developing enterprise large language models and neural generative architectures', '62.01', True)
    ],
    '5 CLEAR AI PRODUCERS': [
        ('PROD_01', 'develops generative AI foundation models', '62.01', True),
        ('PROD_02', 'builds transformer-based language models', '62.01', True),
        ('PROD_03', 'develops computer vision neural networks', '62.01', True),
        ('PROD_04', 'develops autonomous robotics AI', '72.19', True),
        ('PROD_05', 'creates deep-learning cybersecurity models', '62.01', True)
    ],
    '5 DIVERSIFIED / AMBIGUOUS BUSINESSES': [
        ('DIV_01', 'provides machine-learning forecasting software', '62.01', True),
        ('DIV_02', 'builds NLP systems for enterprise documents', '62.01', True),
        ('DIV_03', 'develops predictive machine-learning platforms', '62.01', True),
        ('DIV_04', 'enterprise software consultancy developing custom neural networks', '62.02', True),
        ('DIV_05', 'fintech quantitative risk modelling algorithms and fraud detection', '66.19', True)
    ],
    '5 HARD NEGATIVES': [
        ('NEG_01', 'AI-ready cloud hosting and domain registration services', '63.11', False),
        ('NEG_02', 'printer maintenance using smart technology and toner replacement', '95.11', False),
        ('NEG_03', 'conventional IT support mentioning AI capability for client helpdesk tickets', '62.02', False),
        ('NEG_04', 'reselling generic cloud hosting and server colocation', '63.11', False),
        ('NEG_05', 'office furniture supply and commercial interior design', '31.01', False)
    ],
    '5 ORDINARY AI USERS (ADOPTION ONLY)': [
        ('USER_01', 'bakery using an AI accounting package for daily invoice reconciliation', '10.71', False),
        ('USER_02', 'estate agent using ChatGPT for drafting property sales brochures', '68.31', False),
        ('USER_03', 'law firm using generative AI tools for document summarisation', '69.10', False),
        ('USER_04', 'marketing agency using ChatGPT for blog ideation', '73.11', False),
        ('USER_05', 'retail fashion boutique using AI virtual try-on software', '47.71', False)
    ]
}

print('======================================================================')
print('LIVE VERCEL PRODUCTION CLASSIFIER MATRIX TEST')
print('Target URL:', base + '/api/classify')
print('======================================================================')

all_passed = True
total_cases = 0
passed_cases = 0

for group_name, cases in test_groups.items():
    print(f'\n--- {group_name} ---')
    for cid, text, sic, expected in cases:
        total_cases += 1
        # Pass description (the original payload format)
        payload = json.dumps({'description': text, 'sic_code': sic, 'company_name': cid}).encode('utf-8')
        req = urllib.request.Request(
            base + '/api/classify',
            data=payload,
            headers={'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))['data']
                prob = data['ai_probability'] * 100
                rel = data['is_ai_relevant']
                labels = data['predicted_labels']
                terms = data['highlighted_terms']
                ok = (rel == expected)
                if ok:
                    passed_cases += 1
                else:
                    all_passed = False
                status = 'PASS' if ok else 'FAIL'
                print(f'[{status}] {cid:<8} | Prob: {prob:5.1f}% | Relevant: {str(rel):<5} (Expected {str(expected):<5}) | Labels: {labels}', flush=True)
        except Exception as e:
            print(f'[FAIL] {cid:<8} | ERROR: {e}', flush=True)
            all_passed = False

print('\n======================================================================', flush=True)
print(f'LIVE MATRIX RESULT: {passed_cases}/{total_cases} PASSED', flush=True)
print('======================================================================', flush=True)
