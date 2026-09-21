# 09 — Technical Architecture

## 1. Recommended topology

```text
Public browser
   |
Next.js / React / TypeScript web app
   |---- static methodology/content
   |---- authenticated-free public API calls to project backend
   |
Python analytical API (FastAPI)
   |---- disaggregation service
   |---- classifier service
   |---- provenance service
   |
DuckDB + Parquet analytical store
   |
Versioned raw snapshots / transformed datasets
```

For MVP, the Python service may be replaced by precomputed Parquet/JSON plus client-side calculations where this materially reduces complexity and does not weaken reproducibility.

## 2. Suggested repository

```text
/apps/web
/services/analytics
/packages/schemas
/packages/methods
/data/raw/<source>/<vintage>/
/data/processed/
/notebooks/research-only/
/tests/unit
/tests/data
/tests/integration
/tests/e2e
/docs
```

Notebooks are for exploration only. Public calculations must move into tested functions/modules.

## 3. Data pipeline

`acquire → hash → validate raw → transform → validate transformed → publish analytical snapshot → build metadata manifest`.

Use idempotent commands. Example:

```bash
make acquire
make validate-data
make build-data
make test
make publish-snapshot
```

## 4. APIs

### `GET /api/products`
Returns AI-relevant broad product metadata and published source fields.

### `GET /api/products/{code}`
Returns supply/demand facts and provenance.

### `POST /api/disaggregate`
Input: product, method, parameters, vintage.  
Output: result/range, formula, method version, provenance.

### `POST /api/classify`
Input: public/demo business text.  
Output: labels, probabilities, evidence, model version.

### `POST /api/sna-decision`
Input: deterministic answers.  
Output: indicative treatment, path, rules version.

## 5. Configuration

- environment variables only for secrets;
- `.env.example` without secrets;
- data vintage configured separately from code release;
- method versions semantic and immutable once publicly released.

## 6. Observability

Capture:
- pipeline failures;
- source-schema changes;
- API latency/errors;
- calculation exceptions;
- data-vintage mismatch;
- model version and inference errors.

Do not log user-entered text by default.

## 7. Deployment

Preferred public architecture:
- web: Vercel;
- analytics API: container platform (Render/Railway/Fly/Azure equivalent) or serverless Python where stable;
- static data snapshots: bundled or object storage;
- GitHub Actions for CI.

## 8. Reproducible environment

Pin dependencies. Commit lock files. Provide `Dockerfile` and/or `uv.lock`/`requirements.lock`. CI must reproduce tests from clean environment.
