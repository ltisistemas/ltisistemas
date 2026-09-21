## Why

To guarantee enterprise-grade reliability, data privacy, and prevent regression across core services, authentication pipelines, and ticket management workflows, LTI Sistemas requires an automated test suite with a minimum test coverage threshold of 85%.

## What Changes

- **Test Infrastructure Setup**: Configure Vitest / Jest alongside React Testing Library and coverage reporting tools (`@vitest/coverage-v8`).
- **Cryptographic & Auth Unit Tests**: Comprehensive tests for Argon2id hashing with pepper, session creation/verification with `jose`, and role-based guards.
- **Server Actions & Business Logic Tests**: Unit and integration tests for `loginAction`, `createUserAction`, `listUsersAction`, `createTicketAction`, `getTicketsAction`, `getTicketByIdAction`, and `updateTicketStatusAction`.
- **Image Compression & Utility Tests**: Unit tests verifying client-side canvas image optimization and base64 handling.
- **Component & UI Interaction Tests**: Tests for `StatusBadge`, `ImageLightboxModal`, `SupportHeader`, `CreateTicketModal`, `CreateUserModal`, and Navigation links.
- **Coverage Enforcement**: Configured test runner script enforcing a minimum coverage threshold of 85% across lines, statements, functions, and branches.

## Capabilities

### New Capabilities
- `testing-quality`: Comprehensive automated test suite with unit, integration, and UI component coverage enforcing a minimum 85% threshold.

### Modified Capabilities
<!-- No requirement changes to existing capability specs -->

## Impact

- **Dependencies**: Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitest/coverage-v8`, `jsdom`.
- **Configuration**: Add `vitest.config.ts` with coverage reporters and 85% threshold enforcement.
- **Scripts**: Add `npm test` and `npm run test:coverage` to `package.json`.
