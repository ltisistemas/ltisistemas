## Context

The codebase contains core authentication, data access, session management, image processing, and UI components for the LTI Sistemas corporate portal and ticket system. To maintain high code quality and reliability, automated tests with coverage threshold enforcement (85%) must be established.

See `proposal.md` for motivation and `specs/testing-quality/spec.md` for requirements.

## Goals / Non-Goals

**Goals:**
- Set up Vitest with `@vitest/coverage-v8` and `@testing-library/react` configured with 85% minimum code coverage threshold.
- Cover all authentication utilities (`lib/auth/password.ts`, `lib/auth/session.ts`).
- Cover all Server Actions (`lib/actions/auth-actions.ts`, `lib/actions/ticket-actions.ts`) with positive, negative, and edge cases.
- Cover client utilities and UI components (`lib/utils/image-compression.ts`, `components/suporte/*`).
- Fast test execution in both local development and CI environments.

**Non-Goals:**
- Heavy end-to-end browser automation (e.g. Cypress/Playwright full cluster runs) — fast Vitest unit/integration/component tests are used.

## Decisions

### 1. Test Framework: Vitest + @testing-library/react + JSDOM
- **Choice**: Use Vitest with `v8` coverage provider and `jsdom` environment.
- **Rationale**: Instant execution, native TypeScript support, compatibility with React 19 and Next.js App Router server actions.
- **Alternatives Considered**: Jest (slower, requires extra babel/ts-jest configuration).

### 2. Mocking Strategy for Server Actions & Prisma
- **Choice**: Mock Prisma client methods (`findUnique`, `findMany`, `create`, `update`, `count`) and `next/headers` cookies in server action tests.
- **Rationale**: Ensures fast, deterministic unit tests that run independently of live database connectivity, while verifying every branch and validation rule.

### 3. Coverage Threshold Enforcement (85%)
- **Choice**: Configure `thresholds: { lines: 85, functions: 85, branches: 85, statements: 85 }` directly in `vitest.config.ts`.
- **Rationale**: Guarantees that any build or commit failing to meet the 85% coverage threshold fails immediately.

## Risks / Trade-offs

- **[Risk] React 19 testing library compatibility** → **Mitigation**: Use `@testing-library/react` and `jsdom` with proper mock setups for Next.js router and navigation hooks.
- **[Risk] Coverage skew from configuration files** → **Mitigation**: Exclude `.next/`, `openspec/`, `prisma/` generated files, and config files from coverage metrics in `vitest.config.ts`.
