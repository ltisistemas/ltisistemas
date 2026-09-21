# Technical Design: Multi-Language API Incident Integration Guide

## Context
With the implementation of the Incident Ingestion API (`POST /api/v1/incidents` and `POST /api/v1/auth/login`), developers need a single, portable, self-contained documentation file in the repository root (`API_INTEGRATION_GUIDE.md`) to copy directly into external projects.
See [proposal.md](file:///c:/projetos/PROJETO-COM-IA/LTI-SISTEMAS/lti-sistemas/openspec/changes/api-integration-guide/proposal.md) and [specs/api-client-guides/spec.md](file:///c:/projetos/PROJETO-COM-IA/LTI-SISTEMAS/lti-sistemas/openspec/changes/api-integration-guide/specs/api-client-guides/spec.md).

## Goals / Non-Goals

**Goals:**
- Create `API_INTEGRATION_GUIDE.md` at the project root with complete, production-grade code implementations in PHP, Laravel, Python, Next.js, and cURL.
- Detail dual authentication (API Key vs. Login Token).
- Explain payload formatting, origin types, deduplication logic, and response structures.
- Include best practices for non-blocking telemetry (fire-and-forget, background queues) so external app performance is never impacted by logging.

**Non-Goals:**
- Publishing separate npm/packagist/pypi packages (the goal is drop-in snippets and helper classes).
- Changing existing API runtime behavior.

## Decisions

### Decision 1: Single File Root Location (`API_INTEGRATION_GUIDE.md`)
- **Rationale**: Having a single markdown file at the root allows developers to copy the document directly into their client codebases, internal wikis, or project documentation folders.
- **Alternatives Considered**: Splitting into multiple files under `docs/` (more difficult to copy as a single artifact).

### Decision 2: Self-Contained Drop-in Code Examples
- **Rationale**: Each language section will provide complete, zero-external-dependency (or standard dependency) code that can be copied and run immediately:
  - **cURL**: Direct shell commands.
  - **Vanilla PHP**: Native `curl_init` class with no Composer packages required.
  - **Laravel**: Uses `Illuminate\Support\Facades\Http` and provides `bootstrap/app.php` / `Handler.php` exception registration.
  - **Python**: Standard `requests` client with `sys.excepthook` unhandled crash hook.
  - **Next.js / TypeScript**: Native `fetch` with Next.js Server Actions and React Error Boundary examples.

## Risks / Trade-offs

- **[Risk] Code snippets drifting out of sync with API changes**
  - → *Mitigation*: Code examples strictly follow the validated route contracts of `/api/v1/auth/login` and `/api/v1/incidents`.
