## ADDED Requirements

### Requirement: Client Support Portal Navigation Access
The system SHALL provide prominent and accessible navigation links ("Área do Cliente" / "Suporte") in the top navigation header and the website footer, routing users directly to the client ticket and support authentication portal.

#### Scenario: User clicks Support link in header
- **WHEN** a visitor or client clicks the "Área do Cliente" / "Suporte" button or link in the top navigation bar
- **THEN** the system navigates directly to `/suporte/login` or the client portal dashboard if already authenticated.

#### Scenario: User clicks Support link in footer
- **WHEN** a user clicks the "Suporte ao Cliente" link in the footer
- **THEN** the system opens the support login and ticket submission portal.
