## MODIFIED Requirements

### Requirement: Verified Corporate Contact Channels and Routing
The system SHALL route all interactive contact elements, buttons, and topic triggers directly to the verified official business endpoints: WhatsApp `5581973123278`, LinkedIn profile `https://www.linkedin.com/in/luizfelipemarinhodantas/`, and corporate email `luizltisistemas@gmail.com`, replacing static forms with an interactive Direct WhatsApp Fast-Connect Hub offering 1-click tailored message triggers for each engineering service.

#### Scenario: User triggers WhatsApp conversation
- **WHEN** the visitor clicks any WhatsApp CTA (Navbar, Hero, Contact Section, or Footer)
- **THEN** the system opens WhatsApp Web / Mobile with target phone `5581973123278` and a pre-filled professional message asking for corporate software consulting.

#### Scenario: User opens LinkedIn profile
- **WHEN** the visitor clicks any LinkedIn button or technical direction link
- **THEN** the system navigates securely in a new tab to `https://www.linkedin.com/in/luizfelipemarinhodantas/` with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: User sends email or submits corporate inquiry form
- **WHEN** the visitor interacts with the direct contact channels or selects a specific engineering service topic
- **THEN** the system immediately opens WhatsApp with target phone `5581973123278` and tailored subject context (Arquitetura Cloud, Tech Lead / Squads, Modernização de Legados, Engenharia Sob Medida, Atendimento Geral).
