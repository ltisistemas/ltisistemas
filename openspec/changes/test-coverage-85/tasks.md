## 1. Test Framework Setup

- [x] 1.1 Install test dependencies (`vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) and configure `vitest.config.ts` with 85% coverage thresholds.
- [x] 1.2 Add `npm test` and `npm run test:coverage` scripts to `package.json` and verify test environment runs.

## 2. Authentication & Session Unit Tests

- [x] 2.1 Implement unit tests for `lib/auth/password.ts` covering Argon2id hashing, pepper verification, and invalid password rejections.
- [x] 2.2 Implement unit tests for `lib/auth/session.ts` covering JWT creation, token decoding, expiration, cookie management, and `requireSession` role guards.

## 3. Server Actions & Business Logic Tests

- [x] 3.1 Implement unit tests for `lib/actions/auth-actions.ts` covering `loginAction`, `logoutAction`, `createUserAction`, and `listUsersAction` with permission and validation checks.
- [x] 3.2 Implement unit tests for `lib/actions/ticket-actions.ts` covering `createTicketAction`, `getTicketsAction`, `getTicketByIdAction`, `updateTicketStatusAction`, attachment limits, and client privacy isolation.

## 4. Utilities & Component Tests

- [x] 4.1 Implement unit tests for `lib/utils/image-compression.ts` and `lib/analytics.ts` verifying input handling and data processing.
- [x] 4.2 Implement component tests for `components/suporte/StatusBadge.tsx`, `components/suporte/ImageLightboxModal.tsx`, and `components/suporte/SupportHeader.tsx`.

## 5. Coverage Enforcement, Verification & Git Sync

- [ ] 5.1 Execute test coverage runner (`npm run test:coverage`) and verify code coverage is at or above 85% across all metrics.
- [ ] 5.2 Commit all changes with a descriptive commit message and push to the remote repository.
