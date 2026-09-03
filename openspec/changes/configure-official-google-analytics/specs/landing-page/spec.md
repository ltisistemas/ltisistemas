## MODIFIED Requirements

### Requirement: Multi-Pixel Analytics and Conversion Event Tracking
The system SHALL provide a modular analytics provider configured with the official Google Analytics 4 measurement tag (`G-NHWCDJ8HM4`), and supporting optional Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`) and LinkedIn Partner Tag (`NEXT_PUBLIC_LINKEDIN_PARTNER_ID`) with safe no-op fallbacks when environment variables are undefined, and SHALL dispatch custom conversion events on high-intent user interactions.

#### Scenario: User triggers conversion event
- **WHEN** a visitor clicks any WhatsApp CTA, submits a corporate proposal, or launches a live portfolio application
- **THEN** the system dispatches a standard conversion event (`conversion_event`, `lead_submission`, `whatsapp_contact`) to all active analytics providers.

#### Scenario: Site loads without tracking IDs configured
- **WHEN** the site is accessed without analytics environment variables set
- **THEN** the application runs smoothly without console errors or blocking script execution.
