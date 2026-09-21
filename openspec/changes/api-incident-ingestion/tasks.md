## 1. Database Schema & Data Layer

- [x] 1.1 Add `IncidentOrigin` enum, `ApiKey` model, and `TicketOccurrence` model to `prisma/schema.prisma` with appropriate relations, and run `npx prisma generate` to verify model generation
- [x] 1.2 Extend `Ticket` model with `origin`, `fingerprint`, `occurrenceCount`, `lastOccurrenceAt`, `sourceUrl`, and `targetUrl` in `prisma/schema.prisma` and verify TypeScript schema compilation

## 2. API Authentication & Token Security

- [x] 2.1 Implement API Key generation, SHA-256 hashing, prefixing, and verification utilities in `lib/auth/api-keys.ts` with unit tests in `tests/unit/auth/api-keys.test.ts`
- [x] 2.2 Implement API Login endpoint `POST /api/v1/auth/login` validating email/password and issuing signed API JWT bearer tokens, verified with route tests in `tests/api/auth-login.test.ts`
- [x] 2.3 Implement unified API authentication middleware/helper `authenticateApiRequest(req)` supporting both `x-api-key` and Bearer JWT tokens with test coverage in `tests/unit/auth/api-auth-middleware.test.ts`

## 3. Incident Ingestion, Deduplication & Telemetry

- [x] 3.1 Implement fingerprint generation and sensitive payload sanitization helper in `lib/utils/incident-fingerprint.ts` with unit tests in `tests/unit/utils/incident-fingerprint.test.ts`
- [x] 3.2 Implement incident ingestion core service in `lib/services/incident-ingestion.ts` handling active ticket deduplication, occurrence registration, occurrence counter increment, and new ticket fallback with unit tests in `tests/unit/services/incident-ingestion.test.ts`
- [x] 3.3 Create route handler `POST /api/v1/incidents` validating incoming JSON payload, invoking ingestion service, and returning structured HTTP responses with integration tests in `tests/api/incidents-ingest.test.ts`

## 4. Support UI Telemetry & Occurrence Viewer

- [ ] 4.1 Update `lib/actions/ticket-actions.ts` to include occurrences, origin, and occurrence counts in `TicketDetail` and `TicketSummary` interfaces with updated unit tests in `tests/unit/actions/ticket-actions.test.ts`
- [ ] 4.2 Create `components/suporte/OccurrenceTimeline.tsx` component to display occurrence timeline, formatted JSON payload inspector, and stack trace viewer with tests in `tests/components/OccurrenceTimeline.test.tsx`
- [ ] 4.3 Update `components/suporte/TicketDetailClientView.tsx` to render origin badge (`FRONT`, `BACK`, `INFRA`, `EVENT`, `OUTROS`), occurrence counter chip, and the occurrence telemetry drawer with updated tests in `tests/components/TicketDetailClientView.test.tsx`

## 5. Verification & End-to-End Validation

- [ ] 5.1 Run full test suite with coverage (`npm run test:coverage`) and verify that all test files pass and maintain >= 85% coverage
- [ ] 5.2 Run `npm run build` to ensure clean Next.js Turbopack compilation without TypeScript or linting errors
