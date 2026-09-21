# Proposal: Unified API Incident Ingestion Integration Guide

## Why
Developers integrating external client projects (PHP, Laravel, Python, Next.js/Node.js, microservices) with the LTI Sistemas Incident Ingestion API need a single, comprehensive, self-contained reference document in the root of the project. Having drop-in code snippets and best practices allows engineers to immediately add automated telemetry and error reporting to their applications without reverse-engineering endpoint schemas.

## What Changes
- Create `API_INTEGRATION_GUIDE.md` in the root of the repository.
- Provide clear explanations of:
  - Base URLs and environment setup.
  - Dual authentication mechanisms: API Key (`x-api-key` and `Authorization: Bearer <key>`) vs. API Login (`POST /api/v1/auth/login`).
  - Request specification for `POST /api/v1/incidents` (including `title`, `screenName`, `description`, `origin`, `sourceUrl`, `targetUrl`, `errorLog`, `payload`).
  - Deduplication behavior and automatic incident hashing (`LTI-BUG-...`).
- Provide complete, production-ready code examples in:
  1. **cURL**: Direct CLI/HTTP requests for login and incident ingestion.
  2. **Vanilla PHP**: cURL wrapper class and exception handler.
  3. **Laravel**: Service provider / Custom Log Channel / Global Exception Handler integration with `Http::withHeaders()`.
  4. **Python**: Requests client with `sys.excepthook` / `try...except` wrapper.
  5. **Next.js / Node.js**: Global Error Boundary, Server Action try/catch utility, and API route telemetry wrapper.

## Capabilities

### New Capabilities
- `api-client-guides`: Multi-language implementation guide and drop-in code examples for the incident ingestion API.

### Modified Capabilities
<!-- No requirement changes to existing capability specs -->

## Impact
- **Documentation**: New file `API_INTEGRATION_GUIDE.md` at the project root.
- **Codebase / Runtime**: No breaking changes to existing application runtime code or database schemas.
