## Purpose

Defines the verified official contact channels, WhatsApp routing, LinkedIn profiles, and corporate email destinations for LTI Sistemas (Luiz Tecnologia da Informação).

## ADDED Requirements

### Requirement: Verified Corporate Contact Channels and Routing
The system SHALL route all interactive contact elements, buttons, and form triggers to the verified official business endpoints: WhatsApp `5581973123278`, LinkedIn profile `https://www.linkedin.com/in/luizfelipemarinhodantas/`, and corporate email `luizltisistemas@gmail.com`.

#### Scenario: User triggers WhatsApp conversation
- **WHEN** the visitor clicks any WhatsApp CTA (Navbar, Hero, Contact Section, or Footer)
- **THEN** the system opens WhatsApp Web / Mobile with target phone `5581973123278` and a pre-filled professional message asking for corporate software consulting.

#### Scenario: User opens LinkedIn profile
- **WHEN** the visitor clicks any LinkedIn button or technical direction link
- **THEN** the system navigates securely in a new tab to `https://www.linkedin.com/in/luizfelipemarinhodantas/` with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: User sends email or submits corporate inquiry form
- **WHEN** the visitor submits the corporate inquiry form or clicks the email link
- **THEN** the system directs the inquiry directly to `luizltisistemas@gmail.com` with formatted project details and company name.
