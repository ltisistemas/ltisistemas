## Purpose
Provides a secure programmatic API for client systems to ingest runtime incidents, errors, stack traces, and request payloads, automatically deduplicating recurrent events and tracking occurrence telemetry for support engineers.

## ADDED Requirements

### Requirement: API Authentication and Credential Validation
The system SHALL support secure API authentication for external client applications using API Key headers (`x-api-key` or `Authorization: Bearer <api_key>`) as well as programmatic login via `POST /api/v1/auth/login`.

#### Scenario: Successful API Key authentication
- **WHEN** an external system sends a request to an API endpoint with a valid registered `x-api-key` header
- **THEN** the system authenticates the request as the associated client user and allows access to ingestion endpoints

#### Scenario: Successful token generation via API login
- **WHEN** an external client posts valid email and password credentials to `POST /api/v1/auth/login`
- **THEN** the system returns HTTP 200 with an authenticated session/bearer token and user metadata

#### Scenario: Rejection of unauthenticated or invalid API requests
- **WHEN** an external client sends a request without credentials or with an invalid/revoked API key or token
- **THEN** the system responds with HTTP 401 Unauthorized and an informative error message

---

### Requirement: Incident Ingestion Endpoint
The system SHALL provide an automated ingestion endpoint `POST /api/v1/incidents` accepting incident parameters including `title`, `screenName` (or module), `description`, `origin` (`FRONT`, `BACK`, `INFRA`, `EVENT`, `OUTROS`), `sourceUrl`, `targetUrl`, `occurredAt`, `errorLog` (stack trace), and `payload` (JSON or string context).

#### Scenario: Ingesting an incident with complete telemetry
- **WHEN** an authenticated client sends a valid JSON payload containing title, screenName, description, origin, stack trace, and payload data to `POST /api/v1/incidents`
- **THEN** the system registers the incident and returns HTTP 201 with the ticket ID, incident code (`LTI-BUG-...`), and occurrence metadata

#### Scenario: Rejection of invalid incident payload
- **WHEN** an authenticated client sends a payload missing required fields (`title`, `screenName`, `description`, or valid `origin`)
- **THEN** the system responds with HTTP 400 Bad Request detailing the validation errors

---

### Requirement: Automated Fingerprint Deduplication and Occurrence Grouping
The system SHALL compute a normalized fingerprint hash for each incoming incident (based on client ID, screen/module, origin, and normalized error message) and evaluate against existing active tickets (`ABERTO` or `PENDENTE`).

#### Scenario: Recurring incident matches active ticket
- **WHEN** an incoming incident matches the fingerprint and client of an existing open or pending ticket
- **THEN** the system does NOT create a duplicate ticket, but instead appends a new `TicketOccurrence` record with the latest stack trace, payload, and timestamps, increments `occurrenceCount`, and updates `lastOccurrenceAt`

#### Scenario: Incident with no active match creates new ticket
- **WHEN** an incoming incident does not match any active open ticket for that client
- **THEN** the system creates a new support ticket with status `ABERTO`, generates a unique incident hash `LTI-BUG-XXXXXX-YYYY-MM-DD-HH-MM`, and attaches the initial occurrence telemetry record

---

### Requirement: Support Dashboard Occurrence and Telemetry Inspection
The support interface SHALL display the incident origin, total occurrence count, last occurrence timestamp, and an interactive telemetry viewer on the ticket details view for inspecting individual occurrence logs, stack traces, and payloads.

#### Scenario: Viewing occurrence history on ticket details
- **WHEN** a support engineer or client views the details of a ticket that has multiple occurrences
- **THEN** the UI displays an occurrence badge counter, a timeline of occurrences, and collapsible panels to inspect stack traces and formatted JSON payloads
