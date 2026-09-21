## Purpose
Provides complete, copy-paste-ready implementation guides and code examples in PHP, Laravel, Python, Next.js, and cURL for integrating external applications with the LTI Sistemas Incident Ingestion API.

## ADDED Requirements

### Requirement: Multi-Language Code Implementations
The system SHALL provide a dedicated root documentation file `API_INTEGRATION_GUIDE.md` containing fully functional code implementations and exception handling wrappers across standard programming languages and frameworks.

#### Scenario: cURL CLI usage examples
- **WHEN** a developer consults the guide for testing or shell script integration
- **THEN** the guide provides copy-paste cURL commands for API login and incident ingestion with sample JSON payloads

#### Scenario: PHP and Laravel implementation examples
- **WHEN** a PHP or Laravel developer implements automated error reporting
- **THEN** the guide provides a reusable PHP cURL service class and a Laravel Exception Handler / HTTP client integration

#### Scenario: Python implementation examples
- **WHEN** a Python backend developer integrates telemetry
- **THEN** the guide provides a `requests`-based telemetry client and a global `sys.excepthook` unhandled exception capturer

#### Scenario: Next.js / TypeScript implementation examples
- **WHEN** a Next.js or React developer integrates error ingestion
- **THEN** the guide provides a TypeScript telemetry helper, React Error Boundary, and Server Action / Route handler try-catch examples

---

### Requirement: API Contract and Schema Documentation
The guide SHALL clearly document endpoint URLs, authentication headers (`x-api-key` and `Authorization: Bearer <token>`), request payload properties, origin enum values (`FRONT`, `BACK`, `INFRA`, `EVENT`, `OUTROS`), incident deduplication rules, and HTTP response codes.

#### Scenario: Developer reviews endpoint contracts and fields
- **WHEN** an engineer reads the integration guide
- **THEN** all parameters (`title`, `screenName`, `description`, `origin`, `sourceUrl`, `targetUrl`, `occurredAt`, `errorLog`, `payload`), response statuses (201 Created vs 200 OK), and `LTI-BUG-...` hash formats are clearly explained
