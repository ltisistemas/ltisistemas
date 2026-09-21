## 1. Server Action & Backend Logic

- [x] 1.1 Implement `resetUserPasswordAction(targetUserId: string, newPassword: string)` in `lib/actions/auth-actions.ts` with session check (SUPORTE role required), password length validation (minimum 6 characters), active/non-deleted user check, and Argon2id + pepper hashing.


## 2. UI Components & Integration

- [x] 2.1 Create `components/suporte/ResetPasswordModal.tsx` modal component with target user info display, password show/hide toggle, automatic secure password generator with clipboard copy, submission loading state, and error handling.

- [x] 2.2 Update `components/suporte/UsersClientView.tsx` to include a "Redefinir Senha" button in the actions column for client users, opening the `ResetPasswordModal` and handling success feedback.


## 3. Test Suite & Coverage Verification

- [x] 3.1 Update unit tests in `tests/unit/actions/auth-actions.test.ts` covering successful password reset, rejection for unauthorized callers (CLIENTE / unauthenticated), short password validation (<6 chars), nonexistent/deleted user errors, and database exception handling.

- [x] 3.2 Create component tests in `tests/components/ResetPasswordModal.test.tsx` and update `tests/components/UsersClientView.test.tsx` to test modal opening, password visibility toggling, password generation, form submission, and error display.

- [x] 3.3 Run `npm run test:coverage` to verify all tests pass and code coverage remains at or above 85% across Statements, Branches, Functions, and Lines.

- [x] 3.4 Run `npm run build` to ensure zero TypeScript errors and a successful Next.js production build.

