## MODIFIED Requirements

### Requirement: Verified Corporate Contact Channels and Routing
The system SHALL route all interactive contact elements, buttons, and form triggers to the verified official business endpoints: WhatsApp `5581973123278`, LinkedIn profile `https://www.linkedin.com/in/luizfelipemarinhodantas/`, and corporate email `luizltisistemas@gmail.com`, and SHALL provide multi-channel proposal dispatch options (direct 1-click Gmail compose link, instant WhatsApp payload forward, and mailto fallback) to ensure reliable lead delivery without client-side failure.

#### Scenario: User triggers WhatsApp conversation
- **WHEN** the visitor clicks any WhatsApp CTA (Navbar, Hero, Contact Section, or Footer)
- **THEN** the system opens WhatsApp Web / Mobile with target phone `5581973123278` and a pre-filled professional message asking for corporate software consulting.

#### Scenario: User opens LinkedIn profile
- **WHEN** the visitor clicks any LinkedIn button or technical direction link
- **THEN** the system navigates securely in a new tab to `https://www.linkedin.com/in/luizfelipemarinhodantas/` with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: User sends email or submits corporate inquiry form
- **WHEN** the visitor submits the corporate inquiry form or clicks the email link
- **THEN** the system presents an interactive dispatch modal offering 1-click Gmail Webmail compose with pre-filled subject/body to `luizltisistemas@gmail.com`, 1-click WhatsApp forward with formatted proposal details, and default email client dispatch.

## ADDED Requirements

### Requirement: GitHub Profile Presentation Documentation
The repository README.md SHALL serve as an executive GitHub Profile Presentation Card for LTI Sistemas and founder Luiz Felipe Marinho Dantas, detailing company overview, mission-critical engineering credentials (+900% throughput), technology badges, 4 live SaaS applications with verified URLs, and direct business contact buttons.

#### Scenario: Viewing the repository on GitHub
- **WHEN** any user visits `github.com/ltisistemas` or views the repository root
- **THEN** the system renders a modern GitHub Profile README containing branded badges, architectural strengths, live SaaS links, and contact channels.
