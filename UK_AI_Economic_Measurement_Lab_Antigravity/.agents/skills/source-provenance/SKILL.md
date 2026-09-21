---
name: source-provenance
description: Acquires and documents authoritative public data with immutable raw snapshots, hashes, source metadata and lineage. Use whenever adding or updating a dataset/source.
---
# Source Provenance Skill

## Source priority
1. ONS primary publication/dataset/API.
2. GOV.UK or another official primary publisher.
3. Other authoritative sources only when explicitly justified.

## Required source record
Capture publisher, title, source URL, download URL if different, access timestamp, reference period, vintage/version, local raw path, file/media type, SHA-256, statistical status, and transformation lineage.

## Acquisition protocol
1. Verify the current official source using the browser.
2. Prefer machine-readable official downloads/APIs.
3. Download deterministically.
4. Hash before transformation.
5. Preserve raw snapshot unchanged.
6. Validate basic file/schema expectations.
7. Fail visibly if the source changes unexpectedly.

Never silently replace unavailable data with synthetic values.
