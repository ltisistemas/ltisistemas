## 1. Database Schema & Migration

- [x] 1.1 Update `prisma/schema.prisma` with `systemUrl`, `status`, `deletedAt` in `User`, and `screenName`, `slaDueAt`, `deletedAt` in `Ticket`, then run `npx prisma db push` to synchronize SQLite and regenerate Prisma Client.

## 2. Server Actions & Business Logic

- [x] 2.1 Update `lib/actions/auth-actions.ts` to persist `systemUrl` and `status` in `createUserAction`, reject logins in `loginAction` if user is `INATIVO` or soft-deleted, add `deleteUserAction` / `toggleUserStatusAction`, and filter `deletedAt: null` on `listUsersAction`.
- [x] 2.2 Update `lib/actions/ticket-actions.ts` to validate and save `screenName`, calculate `slaDueAt` (+6h) in `createTicketAction`, filter `deletedAt: null` in `getTicketsAction` / `getTicketByIdAction`, and add `deleteTicketAction`.

## 3. SLA Utilities & UI Components

- [x] 3.1 Create `lib/utils/sla.ts` helper and `components/suporte/SlaBadge.tsx` component to compute and render the 6-hour SLA countdown, status pill, and warning colors.
- [x] 3.2 Update `components/suporte/CreateUserModal.tsx` and `components/suporte/UsersClientView.tsx` to manage `systemUrl`, `status` (ATIVO/INATIVO), and trigger soft-delete.
- [x] 3.3 Update `components/suporte/CreateTicketModal.tsx`, `components/suporte/TicketsClientView.tsx`, and `components/suporte/TicketDetailClientView.tsx` to include `screenName` input/display, system address link, and 6h SLA indicators.

## 4. Test Suite Updates & Coverage Enforcement

- [x] 4.1 Update unit tests in `tests/unit/actions/` and `tests/unit/auth/` to test `screenName`, 6h SLA calculation, `INATIVO` user login refusal, and soft-delete behaviors.
- [x] 4.2 Update component tests in `tests/components/` for `CreateUserModal`, `UsersClientView`, `CreateTicketModal`, `TicketsClientView`, `TicketDetailClientView`, and `SlaBadge`.
- [x] 4.3 Run `npm run test:coverage` to verify that all tests pass and code coverage remains at or above 85%.
- [x] 4.4 Run `npm run build` to ensure zero TypeScript errors and production build succeeds.

