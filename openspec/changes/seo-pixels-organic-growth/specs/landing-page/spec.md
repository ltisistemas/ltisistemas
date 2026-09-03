## ADDED Requirements

### Requirement: Advanced Technical SEO, Sitemap, and Rich Structured Data
The system SHALL provide native `sitemap.xml` and `robots.txt` endpoints generated via Next.js metadata routes for `https://ltisistemas.vercel.app/` (and custom domains), configure canonical metadata headers, and embed comprehensive Schema.org JSON-LD structured data including `Organization`, `WebSite`, `ProfessionalService`, and `FAQPage` with pre-defined high-intent corporate architecture questions.

#### Scenario: Search engine crawler accesses sitemap and robots
- **WHEN** a search crawler visits `/sitemap.xml` or `/robots.txt`
- **THEN** the system returns valid XML/text indexing rules referencing the canonical production URL `https://ltisistemas.vercel.app`.

#### Scenario: Search engine inspects rich structured FAQ data
- **WHEN** Googlebot crawls the homepage markup
- **THEN** the system provides valid JSON-LD schemas covering Organization details, technical competencies, and an FAQPage dataset ready for rich snippet display.

---

### Requirement: Multi-Pixel Analytics and Conversion Event Tracking
The system SHALL provide a modular analytics provider supporting Google Analytics 4 (`NEXT_PUBLIC_GA_ID`), Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`), and LinkedIn Partner Tag (`NEXT_PUBLIC_LINKEDIN_PARTNER_ID`) with safe no-op fallbacks when environment variables are undefined, and SHALL dispatch custom conversion events on high-intent user interactions.

#### Scenario: User triggers conversion event
- **WHEN** a visitor clicks any WhatsApp CTA, submits a corporate proposal, or launches a live portfolio application
- **THEN** the system dispatches a standard conversion event (`conversion_event`, `lead_submission`, `whatsapp_contact`) to all active analytics providers.

#### Scenario: Site loads without tracking IDs configured
- **WHEN** the site is accessed without analytics environment variables set
- **THEN** the application runs smoothly without console errors or blocking script execution.
