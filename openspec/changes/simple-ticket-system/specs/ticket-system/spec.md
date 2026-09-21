## Purpose

Provides a secure, streamlined incident ticketing portal for LTI Sistemas clients to submit support requests with screenshot attachments and track resolution statuses, and allows support engineers to manage and resolve client tickets across all contracted accounts.

## ADDED Requirements

### Requirement: User Authentication and Role-Based Authorization
The system SHALL authenticate users using email and password verified via Argon2id with server-side pepper, issue secure session credentials, and enforce role-based access for `SUPORTE` and `CLIENTE` roles.

#### Scenario: Successful client login
- **WHEN** a client submits valid email and password credentials
- **THEN** the system authenticates the user, sets an HTTP-only secure session cookie, and redirects to the client ticket dashboard.

#### Scenario: Successful support login
- **WHEN** a support engineer submits valid credentials with role `SUPORTE`
- **THEN** the system authenticates the user and redirects to the support management console.

#### Scenario: Invalid credentials submission
- **WHEN** a user enters an incorrect email or password
- **THEN** the system returns an authentication error without revealing whether the email or password was invalid.

#### Scenario: Unauthorized access attempt to protected route
- **WHEN** an unauthenticated visitor attempts to access any `/suporte/chamados` or `/suporte/usuarios` route
- **THEN** the system redirects the visitor to the login page with a return URL parameter.

---

### Requirement: Administrative User Provisioning
The system SHALL restrict user registration and provisioning exclusively to authenticated users with the `SUPORTE` role, storing name, email, company, optional contract number, role, and peppered Argon2id password hash.

#### Scenario: Support creates a new client account
- **WHEN** an authenticated `SUPORTE` user submits a valid new user payload with name, email, company, optional contract number, password, and role `CLIENTE`
- **THEN** the system creates the user record with the password securely hashed using Argon2id + pepper and confirms creation.

#### Scenario: Non-support user attempts to provision accounts
- **WHEN** an unauthenticated visitor or a user with role `CLIENTE` attempts to invoke the user creation endpoint
- **THEN** the system rejects the request with a 403 Forbidden status.

#### Scenario: Creation attempt with duplicate email
- **WHEN** an administrator attempts to create a user with an email that already exists
- **THEN** the system rejects the operation and displays a validation message stating that the email is already in use.

---

### Requirement: Client Ticket Creation and Attachment Handling
The system SHALL allow authenticated clients to create incident tickets by providing a title, problem description, and up to 3 image attachments (screenshots/photos) stored in base64 / compressed format, setting initial status to `aberto`.

#### Scenario: Client successfully submits an incident ticket
- **WHEN** an authenticated client fills in a title, detailed problem description, attaches up to 3 valid image files (PNG/JPEG/WebP), and submits
- **THEN** the system validates inputs, stores the ticket and base64 image data associated with the client's account, sets status to `aberto`, and returns the created ticket.

#### Scenario: Submission exceeding attachment limits
- **WHEN** a client attempts to attach more than 3 images or files exceeding size thresholds (e.g. > 5MB per image)
- **THEN** the system blocks submission and displays a clear validation error.

#### Scenario: Submission with missing required fields
- **WHEN** a client submits a ticket with an empty title or description
- **THEN** the system prevents submission and highlights the missing fields.

---

### Requirement: Client Ticket Inspection and Privacy Isolation
The system SHALL provide clients with an intuitive list of their own tickets showing status badges (`aberto`, `pendente`, `fechado`), creation timestamp, and title, while strictly preventing access to tickets of other clients.

#### Scenario: Client views ticket list
- **WHEN** an authenticated client navigates to the tickets overview
- **THEN** the system displays only tickets belonging to that client's user record, displaying status badges, dates, and title.

#### Scenario: Client views details of own ticket
- **WHEN** a client selects one of their tickets
- **THEN** the system displays the full problem description, current status, creation date, and clickable thumbnails of all attached screenshots.

#### Scenario: Client attempts to view another client's ticket
- **WHEN** a client attempts to navigate to `/suporte/chamados/[id]` for a ticket belonging to a different client
- **THEN** the system returns a 404 Not Found or 403 Forbidden error and denies access.

---

### Requirement: Support Incident Console and Status Lifecycle
The system SHALL provide support engineers with a consolidated overview of all client tickets across all companies, enabling filtering by status, inspection of client metadata, and modification of ticket status between `aberto`, `pendente`, and `fechado`.

#### Scenario: Support views all customer tickets
- **WHEN** an authenticated `SUPORTE` user accesses the tickets dashboard
- **THEN** the system renders a unified table/list of all incidents showing client name, company, contract number, status, submission date, and title.

#### Scenario: Support filters tickets by status
- **WHEN** the support engineer applies a status filter (e.g. "aberto" or "pendente")
- **THEN** the ticket view dynamically updates to display only matching tickets.

#### Scenario: Support updates ticket status
- **WHEN** a support engineer changes the status of a ticket (e.g. from `aberto` to `pendente` or `fechado`)
- **THEN** the system persists the new status timestamp and updates the ticket record immediately.

#### Scenario: Support inspects client ticket attachments
- **WHEN** a support engineer opens a ticket detail view
- **THEN** the system displays the complete client context (name, company, contract number, email), full description, and high-resolution previews of attached images.
