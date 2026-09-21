# Technical Design: API Incident Ingestion & Telemetry System

## Context
External applications developed for or used by LTI Sistemas clients require an automated mechanism to transmit runtime errors, crashes, and exceptions directly into the support system without manual user intervention.
See [proposal.md](file:///c:/projetos/PROJETO-COM-IA/LTI-SISTEMAS/lti-sistemas/openspec/changes/api-incident-ingestion/proposal.md) for full motivation and [specs/incident-api/spec.md](file:///c:/projetos/PROJETO-COM-IA/LTI-SISTEMAS/lti-sistemas/openspec/changes/api-incident-ingestion/specs/incident-api/spec.md) for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide two lightweight, robust REST API endpoints:
  1. `POST /api/v1/auth/login` (authentication for session token)
  2. `POST /api/v1/incidents` (incident ingestion with telemetry)
- Support secure API-Key authentication (`x-api-key` and `Authorization: Bearer <key>`) as well as JWT session tokens.
- Implement intelligent incident fingerprinting to group recurring exceptions under existing active tickets (`ABERTO` / `PENDENTE`).
- Store heavy diagnostic telemetry (stack traces, payload snapshots, URLs, headers) in a dedicated relational table (`TicketOccurrence`) to prevent bloat in the main `Ticket` table.
- Display origin tags, occurrence counts, and interactive telemetry inspectors (stack traces + JSON payloads) in the support UI.

**Non-Goals:**
- Building a generic APM or distributed tracer (e.g., Datadog/Sentry replacement). Focus is strictly on actionable support incidents.
- Modifying marketing site or public non-support pages.
- Webhook dispatching to external third parties (can be added in future iterations).

## Architecture & Data Model

### 1. Database Schema Additions (Prisma)

```prisma
enum IncidentOrigin {
  FRONT
  BACK
  INFRA
  EVENT
  OUTROS
}

model ApiKey {
  id          String    @id @default(cuid())
  name        String    @default("Default API Key")
  keyHash     String    @unique
  keyPrefix   String
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())

  @@index([userId])
  @@index([keyHash])
}

model TicketOccurrence {
  id          String          @id @default(cuid())
  ticketId    String
  ticket      Ticket          @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  origin      IncidentOrigin  @default(OUTROS)
  occurredAt  DateTime        @default(now())
  sourceUrl   String?
  targetUrl   String?
  stackTrace  String?         @db.Text
  payload     String?         @db.Text
  headers     String?         @db.Text
  createdAt   DateTime        @default(now())

  @@index([ticketId])
  @@index([occurredAt])
}
```

### 2. Enhancements to `Ticket` Model
- `origin`: `IncidentOrigin` (default `OUTROS`)
- `fingerprint`: `String?` (Indexed hash for rapid deduplication)
- `occurrenceCount`: `Int` (default 1)
- `lastOccurrenceAt`: `DateTime` (default `now()`)
- `sourceUrl`: `String?`
- `targetUrl`: `String?`
- `occurrences`: `TicketOccurrence[]`

```prisma
// Extension on Ticket
@@index([fingerprint, userId, status])
```

## Decisions

### Decision 1: Dual Authentication Model (API Key + JWT Login)
- **Rationale**: External services running backend daemons, lambdas, or frontend clients prefer static, revocable API Keys (`lti_live_...`) stored securely in environment variables. Other systems prefer explicit session login (`POST /api/v1/auth/login`) returning a scoped JWT.
- **Alternatives Considered**:
  - *Basic Auth on every request*: Requires transmitting raw passwords continuously (less secure, difficult to rotate without password changes).
  - *OAuth2 Server*: Overkill for the current requirement.

### Decision 2: Deduplication by Fingerprint Hashing
- **Rationale**: When an outage occurs (e.g. database timeout), hundreds of requests might fail in minutes. Generating separate tickets would flood the support queue.
- **Algorithm**:
  - `fingerprint = SHA256("${userId}:${origin}:${screenName.toLowerCase().trim()}:${normalizedErrorSummary}")`
  - Normalized error extracts the primary error class and sanitized message (stripping dynamic timestamps and UUIDs).
  - Lookup active ticket (`status IN ['ABERTO', 'PENDENTE'] AND userId = user.id AND fingerprint = fingerprint AND deletedAt IS NULL`).
  - If found: Append `TicketOccurrence`, increment `occurrenceCount`, update `lastOccurrenceAt`, return existing ticket info with `isNew: false`.
  - If not found or closed: Create new ticket (`isNew: true`), attach initial `TicketOccurrence`.
- **Alternatives Considered**:
  - *Full text comparison in SQL*: Slow, susceptible to formatting variations.
  - *No deduplication*: Creates ticket spam during recurring incidents.

### Decision 3: Separate `TicketOccurrence` Table for Telemetry
- **Rationale**: Stack traces and request payloads can easily be several kilobytes of text. Storing them in a separate 1-to-N table ensures that querying ticket lists remain lightweight and fast, while full diagnostic payloads are loaded on-demand in the detail view.
- **Alternatives Considered**:
  - *Single text/JSON column in `Ticket`*: Would exceed row limits or degrade database read performance when listing tickets.

### Decision 4: Security & Sensitive Payload Sanitization
- **Rationale**: Request payloads may contain sensitive fields (passwords, tokens, credit card numbers).
- **Sanitization Rule**: The ingestion handler parses JSON payloads (if valid JSON) and masks known sensitive keys (`password`, `token`, `secret`, `authorization`, `creditCard`, `cvv`) with `[REDACTED]` before persistence.

## Risks / Trade-offs

- **[Risk] High-volume error storms exhausting database connections**
  - → *Mitigation*: Rate-limit `POST /api/v1/incidents` per API Key/IP and cap stack trace / payload storage at 64KB per occurrence.

- **[Risk] Over-aggressive deduplication grouping distinct bugs**
  - → *Mitigation*: Fingerprint includes `screenName`, `origin`, and specific error type to ensure distinct issues in the same module create separate tickets. Closed tickets (`FECHADO`) are never reopened automatically; a new ticket is generated if a bug recurs after being resolved.

- **[Risk] Exposing sensitive credentials in stack traces or payloads**
  - → *Mitigation*: Automated JSON key scrubbing for sensitive identifiers before storing occurrences.

## Migration Plan
1. Update Prisma schema with new models and migrations.
2. Implement auth helper functions (`verifyApiKey`, `generateApiToken`).
3. Create Next.js route handlers `/api/v1/auth/login` and `/api/v1/incidents`.
4. Update server actions (`getTicketByIdAction`) to return occurrences.
5. Enhance `TicketDetailClientView` with Telemetry and Occurrences viewer.
6. Run unit, integration, and component tests; run `npm run build`.
