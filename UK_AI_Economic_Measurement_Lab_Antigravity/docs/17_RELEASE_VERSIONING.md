# 17 — Release, Versioning and Change Management

## Version dimensions

Maintain separate versions for:
- application code;
- data snapshot;
- methodology;
- classifier model;
- SNA rule set.

Example display:

`App 1.0.0 | Data 2026-09-21 | Disaggregation prop-0.3.0 | Classifier tfidf-0.2.0 | SNA rules 0.1.0`

## Release classes

### Research preview
Incomplete prototype; clearly marked; no external promotion as finished.

### Public prototype
Core tests and validation report pass; stable URLs; known issues published.

### Research release
A specific methodology/result frozen with DOI-like citation text if practical.

## Change categories

- editorial only;
- software bug fix;
- data refresh;
- methodology change;
- model retrain;
- correction.

Methodology changes that alter historical results require a major/minor method-version increment and an impact note.

## Correction policy

If a published prototype result is materially wrong:
1. preserve record of the original release;
2. stop/flag affected output;
3. fix and validate;
4. publish correction note with cause and impact;
5. link correction from affected page/changelog.
