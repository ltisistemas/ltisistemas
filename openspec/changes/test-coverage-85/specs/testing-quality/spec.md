## Purpose

Provides automated unit, integration, and component testing suites with continuous coverage metrics enforcing a minimum 85% code coverage threshold across core libraries, server actions, and UI components.

## ADDED Requirements

### Requirement: Automated Test Execution and 85% Coverage Threshold
The system SHALL provide an automated test runner command (`npm run test:coverage` / `npm test`) that executes all test suites and enforces a minimum test coverage threshold of 85% across statements, branches, functions, and lines.

#### Scenario: Running test suite with coverage
- **WHEN** the test command `npm run test:coverage` is executed
- **THEN** all tests pass and the coverage report confirms at least 85% overall code coverage.

#### Scenario: Coverage falls below threshold
- **WHEN** new code is added without corresponding tests causing coverage to drop below 85%
- **THEN** the test runner fails with a non-zero exit code highlighting uncovered lines.

---

### Requirement: Authentication and Cryptographic Integrity Tests
The test suite SHALL validate Argon2id password hashing with pepper, password mismatch rejections, JWT session creation, signature verification, expiration handling, and role validation guards.

#### Scenario: Verifying password hashing and verification
- **WHEN** the auth test suite runs password hashing and comparison tests
- **THEN** valid passwords match correctly, incorrect passwords fail verification, and pepper is properly applied.

#### Scenario: Verifying session token lifecycle
- **WHEN** session payloads are encoded and decoded
- **THEN** payload claims (userId, role, company) are accurately preserved and tampered tokens are rejected.

---

### Requirement: Server Actions and Data Isolation Tests
The test suite SHALL validate ticket creation, attachment limits (max 3 images), status updates, user provisioning, and role-based data isolation (preventing clients from seeing other clients' tickets).

#### Scenario: Testing client ticket privacy isolation
- **WHEN** a client attempts to query or retrieve a ticket belonging to another user
- **THEN** the action denies access and enforces strict privacy isolation.

#### Scenario: Testing support status transitions
- **WHEN** a support user updates a ticket status between `ABERTO`, `PENDENTE`, and `FECHADO`
- **THEN** the status update persists correctly and invalid status changes are rejected.

---

### Requirement: UI Component and Modal Interaction Tests
The test suite SHALL validate the rendering and behavioral interactions of key UI components including `StatusBadge`, `ImageLightboxModal`, `SupportHeader`, `CreateTicketModal`, and `CreateUserModal`.

#### Scenario: Testing StatusBadge rendering
- **WHEN** `StatusBadge` is rendered with status `ABERTO`, `PENDENTE`, or `FECHADO`
- **THEN** the component renders the corresponding icon, label, and accessible styling.

#### Scenario: Testing image modal interactions
- **WHEN** an attachment is opened in `ImageLightboxModal`
- **THEN** the modal displays the image, download link, and handles escape key / close triggers.
