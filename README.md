# UK AI Economic Measurement Lab

> **Independent Statistical Research Prototype**  
> **Author & Lead:** Daramola Omoyele  
> **Version:** 0.2.0  
> **Status:** Completed & Validated  

---

## Overview

The **UK AI Economic Measurement Lab** is a public, reproducible statistical research environment designed to explore how artificial intelligence can be identified, classified, and disaggregated from non-AI activity within the UK National Accounts and Supply & Use Tables framework.

---

## Project Structure & Navigation

The primary application and codebase is located in:
`UK_AI_Economic_Measurement_Lab_Antigravity/`

### Quick Commands:
```bash
cd UK_AI_Economic_Measurement_Lab_Antigravity

# 1. Build and verify data layer
python scripts/build_data_layer.py

# 2. Run statistical test suite
python -m unittest discover tests

# 3. Launch Web Application
cd apps/web
npm install
npm run build
npm run start
```

Please see `UK_AI_Economic_Measurement_Lab_Antigravity/README.md` and `UK_AI_Economic_Measurement_Lab_Antigravity/docs/` for complete architectural and statistical documentation.
