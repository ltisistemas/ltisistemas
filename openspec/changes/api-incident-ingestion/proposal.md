# Proposal: API-Based Incident Ingestion & Telemetry System

## Why
External client systems (frontends, backends, infrastructure services, and event pipelines) need a secure, automated way to report technical errors, unhandled exceptions, and runtime incidents directly to LTI Sistemas. Currently, tickets must be opened manually through the web interface. Providing programmatic ingestion endpoints with automated deduplication and occurrence grouping enables immediate telemetry capture, prevents ticket noise, and gives engineers detailed diagnostic data (stack traces, payloads, context URLs) without manual intervention.

## What Changes
- **Secure API Authentication**:
  - Implement dual-mode secure API authentication: support for long-lived Bearer API Keys and an API Login endpoint (`POST /api/v1/auth/login`) generating scoped session tokens.
  - API key management attached to client user accounts (with hashed storage and prefixing).
- **Incident Ingestion Endpoint (`POST /api/v1/incidents`)**:
  - Ingests incident metadata: `title`, `screenName` (or module), `description`, `origin` (`FRONT`, `BACK`, `INFRA`, `EVENT`, `OUTROS`), `sourceUrl`, `targetUrl`, `occurredAt`, `errorLog` (stack trace), and `payload` (context JSON / string).
- **Smart Deduplication & Occurrence Grouping**:
  - Compute a deterministic incident fingerprint based on `userId`, `origin`, `screenName`, and normalized error/title.
  - If an active ticket (`ABERTO` or `PENDENTE`) exists with matching fingerprint, record a new occurrence event, increment `occurrenceCount`, update `lastOccurrenceAt`, and append diagnostic data without creating duplicate tickets.
  - If no active ticket exists (or previous is `FECHADO`), register a new ticket with the standard `LTI-BUG-XXXXXX-YYYY-MM-DD-HH-MM` incident code.
- **Incident Occurrence Telemetry Model**:
  - Create a relational `TicketOccurrence` model storing detailed event traces (stack trace, payload, source/target URLs, occurrence timestamp) linked to `Ticket`.
- **Support Dashboard Telemetry Viewer**:
  - Update ticket detail UI to display occurrence counters, origin badge, and an expandable telemetry drawer/tab to inspect individual occurrences, stack traces, and request/response payloads.

## Capabilities

### New Capabilities
- `incident-api`: Programmatic API authentication, incident ingestion endpoint (`POST /api/v1/incidents`), automated fingerprint deduplication, and occurrence telemetry tracking.

### Modified Capabilities
<!-- No requirement changes to existing capability specs -->

## Impact
- **Database Schema**: New Prisma models (`TicketOccurrence`, `ApiKey`) and extensions to `Ticket` (`origin`, `fingerprint`, `occurrenceCount`, `lastOccurrenceAt`).
- **API Surface**: New public REST API routes under `/api/v1/auth/login` and `/api/v1/incidents`.
- **Security**: Token verification, rate limiting, and input sanitization for automated telemetry ingestion.
- **Support UI**: Enhanced `TicketDetailClientView` showing incident origin, total occurrences, stack traces, and formatted payload inspect modal/accordion.
