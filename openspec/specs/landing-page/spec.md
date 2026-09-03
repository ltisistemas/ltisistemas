# landing-page Specification

## Purpose
Provides a high-impact, modern, and accessible landing page for LTI Sistemas, presenting Senior Software Engineer and Tech Lead Luiz Felipe Marinho Dantas's 20 years of hands-on expertise, core technical services, production portfolio, and direct business conversion channels.

## Requirements

### Requirement: Brand Identity and Navigation
The system SHALL display a sticky or top-level navigation header featuring the LTI Sistemas brand identity, quick links to main sections (About, Services, Portfolio, Stack, Experience, Contact), and an immediate call-to-action button.

#### Scenario: User navigates via header links
- **WHEN** the visitor clicks any navigation link (e.g., "Serviços", "Portfólio", "Contato")
- **THEN** the page smoothly scrolls to the corresponding section with appropriate visual offset.

#### Scenario: Mobile viewport navigation toggle
- **WHEN** a visitor views the site on a mobile device
- **THEN** the navigation collapses into an accessible mobile menu trigger that opens and closes fluidly.

---

### Requirement: Hero Section and Value Proposition
The system SHALL present a hero section communicating the core slogan ("Engenharia de Software de Alta Complexidade | Arquitetura | Liderança Técnica"), founder credentials (20+ years of hands-on experience), primary CTA ("Falar com Especialista" / "Ver Portfólio"), and quick proof metrics.

#### Scenario: Viewing the hero section
- **WHEN** the user lands on the homepage
- **THEN** the system displays the high-authority headline, subheadline, founder identity, status badge ("Disponível para Novos Projetos / Liderança Técnica"), and direct CTA buttons.

#### Scenario: Clicking hero CTA triggers
- **WHEN** the user clicks "Falar com Especialista" or "Ver Portfólio"
- **THEN** the page navigates directly to the contact channels or scrolls to the portfolio section.

---

### Requirement: Founder Profile and Authority (About Section)
The system SHALL display an executive profile section highlighting Luiz Felipe Marinho Dantas as a Senior Software Engineer and Hands-On Tech Lead with 20 years of real-world enterprise engineering experience, detailing expertise in mission-critical systems, squad leadership, and legacy modernization.

#### Scenario: Inspecting the About section
- **WHEN** the visitor reads the About section
- **THEN** the system displays the founder bio, key leadership philosophies, enterprise trajectory (TCS/Itaú, Petrobras, F3M), and highlights of technical depth.

---

### Requirement: Specialized Services Breakdown
The system SHALL render dedicated interactive cards for the 5 core service offerings: Senior Software Engineering, Software Architecture, Technical Leadership, Cloud & DevOps, and Full Stack Development.

#### Scenario: Exploring services
- **WHEN** the visitor reviews the Services section
- **THEN** the system displays 5 distinct service cards, each containing an iconic visual, title, comprehensive description, key deliverable bullets, and relevant tech badges.

---

### Requirement: Live Production Portfolio Grid
The system SHALL showcase 4 live production projects (*Credit Flow App*, *MainFast - Fábrica de MVP*, *Meu Fluxo Financeiro*, *Quick InvoiceFlow*) with interactive project cards displaying titles, value descriptions, tech stack tags, and direct external links to the production deployments.

#### Scenario: Interacting with portfolio cards
- **WHEN** the user clicks on a project link or external launch icon for any of the 4 applications
- **THEN** the browser opens the verified production URL (e.g., https://credit-flow-app.vercel.app/) in a new tab with secure `rel="noopener noreferrer"` attributes.

#### Scenario: Viewing portfolio details
- **WHEN** the visitor inspects each portfolio item
- **THEN** the card displays a clear overview of the problem solved, architectural approach, and technology stack (Next.js, React, TypeScript, Tailwind, etc.).

---

### Requirement: Categorized Technical Stack Matrix
The system SHALL provide a structured visualization of technical proficiencies organized into Backend, Frontend, Cloud, DevOps, Databases, and Architecture & Methodologies.

#### Scenario: Browsing tech stack categories
- **WHEN** the user views the Tech Stack section
- **THEN** the system displays categorized groups highlighting technologies such as .NET Core, Node.js (NestJS), React, Angular, AWS, Docker, Terraform, SQL Server, Clean Architecture, and TDD.

---

### Requirement: Enterprise Experience and Career Timeline
The system SHALL present an enterprise track record timeline or career highlight cards featuring major clients and previous engagements including TCS / Banco Itaú, F3M, Petrobras, and LTI Sistemas.

#### Scenario: Reviewing career history
- **WHEN** the visitor views the Experience section
- **THEN** the system details the roles, company names, scope of mission-critical systems delivered, and notable achievements in chronological or hierarchical order.

---

### Requirement: Quantifiable Impact Metrics and Differentiators
The system SHALL display prominent proof points highlighting tangible business outcomes, including metrics such as +900% throughput increase in fraud detection systems, 12+ engineers mentored/led, and 20 years of production reliability.

#### Scenario: Viewing impact counters
- **WHEN** the visitor scrolls to the impact metrics section
- **THEN** the system presents highlighted numerical callouts with descriptive labels emphasizing engineering rigor and measurable value.

---

### Requirement: Multi-Channel Lead Capture and Direct Contact
The system SHALL provide direct, frictionless contact options including a direct WhatsApp quick-chat link with pre-filled message intent, LinkedIn profile connection, direct email link, and a contact inquiry form.

#### Scenario: Initiating WhatsApp conversation
- **WHEN** the visitor clicks the WhatsApp contact button
- **THEN** the system opens WhatsApp Web / App with a pre-configured greeting asking for technical consulting or project estimation.

#### Scenario: Submitting contact inquiry
- **WHEN** the visitor fills in the contact form (Name, Email, Subject/Project Type, Message) and submits
- **THEN** the form validates inputs, presents visual confirmation, and triggers direct communication.

---

### Requirement: Responsive Layout, Accessibility and Performance Standards
The system SHALL be fully responsive across mobile, tablet, and desktop viewports, compliant with WCAG 2.1 AA accessibility guidelines (semantic tags, keyboard navigation, high contrast), and achieve a Lighthouse performance score of 90+.

#### Scenario: Viewing across screen sizes
- **WHEN** the viewport is resized from mobile (375px) to ultra-wide desktop (1920px+)
- **THEN** the layout adjusts fluidly without horizontal scroll, overlapping text, or broken interactive elements.

### Requirement: Corporate Brand Positioning and Navigation Header
The system SHALL display an institutional navigation header featuring the LTI Sistemas corporate identity, enterprise slogan, direct links to company sections (Sobre a Empresa, Soluções, Produtos Desenvolvidos, Metodologia & Stack, Histórico Enterprise, Contato Corporativo), and a primary call-to-action button ("Solicitar Proposta" / "Falar com Especialistas").

#### Scenario: User navigates via corporate header links
- **WHEN** the visitor clicks any navigation link (e.g., "Soluções", "Produtos Desenvolvidos", "Contato")
- **THEN** the page smoothly scrolls to the corresponding section with appropriate visual offset.

#### Scenario: Mobile navigation toggle for company menu
- **WHEN** a visitor views the landing page on a mobile device
- **THEN** the system provides an accessible menu drawer containing all institutional section links and corporate contact buttons.

---

### Requirement: Institutional Hero Section and Value Proposition
The system SHALL present an authoritative hero section that firmly establishes LTI Sistemas as a high-performance software engineering studio, showcasing the institutional slogan ("Engenharia de Software de Alta Complexidade | Arquitetura | Liderança Técnica"), corporate availability badge, key value pillars (sistemas de missão crítica, arquitetura escalável, aceleração de squads), and direct conversion triggers.

#### Scenario: Viewing the corporate hero section
- **WHEN** the user lands on the homepage
- **THEN** the system displays the company-first headline, value proposition for businesses, leadership credentials of founder Luiz Felipe (Principal Architect & Tech Lead), and dual action CTAs.

#### Scenario: Clicking hero corporate CTAs
- **WHEN** the visitor clicks "Solicitar Proposta / Falar com Especialistas" or "Conhecer Nossos Produtos"
- **THEN** the page redirects to corporate WhatsApp/inquiry form or scrolls to the company's live platforms section.

---

### Requirement: Corporate Identity and Engineering Excellence (About LTI Sistemas)
The system SHALL present an institutional section titled "Sobre a LTI Sistemas", detailing the company's mission, engineering standards, commitment to high-availability architecture, and executive technical leadership directed by founder Luiz Felipe Marinho Dantas (20 years of hands-on mission-critical experience).

#### Scenario: Inspecting the About LTI Sistemas section
- **WHEN** a prospect or corporate decision-maker reads the About section
- **THEN** the system presents the company's engineering ethos, core operating principles (Hands-On Architecture, Zero Downtime Modernization, Squad Mentorship, Clean Code Governance), and institutional credentials.

---

### Requirement: B2B Corporate Solutions and Services
The system SHALL showcase the 5 core corporate service offerings of LTI Sistemas: Engenharia de Software Sob Medida, Consultoria de Arquitetura & Cloud-Native, Alocação de Liderança Técnica / Squad Acceleration, Modernização de Sistemas Legados e Desenvolvimento End-to-End de Produtos Digitais & SaaS.

#### Scenario: Reviewing corporate services
- **WHEN** the visitor reviews the Solutions section
- **THEN** the system displays structured cards outlining each service's business impact, key institutional deliverables, and technological foundations.

---

### Requirement: Delivered Platforms and Enterprise SaaS Showcase (Company Cases)
The system SHALL showcase 4 live production platforms developed and architected by LTI Sistemas (*Credit Flow App*, *MainFast*, *Meu Fluxo Financeiro*, *Quick InvoiceFlow*) as proven company solutions, complete with live verified links, architectural descriptions, and business highlights.

#### Scenario: Exploring company platform cases
- **WHEN** the visitor inspects any of the 4 platform cards
- **THEN** the card presents the platform name, business category, problem solved by LTI Sistemas' engineering, technology stack, and an external launch button leading to the live application.

---

### Requirement: Technical Arsenal, Methodology and Engineering Governance
The system SHALL display the engineering methodology, quality standards (Clean Architecture, DDD, SOLID, TDD, CI/CD), and technology matrix utilized by LTI Sistemas across Backend, Frontend, Cloud, DevOps, and Databases.

#### Scenario: Browsing company technical capabilities
- **WHEN** the user inspects the Methodology & Tech Stack section
- **THEN** the system presents categorized competencies representing LTI Sistemas' team mastery.

---

### Requirement: Enterprise Pedigree and Foundation Track Record
The system SHALL present the enterprise pedigree and high-scale background that form the technical foundation of LTI Sistemas (projects delivered for Banco Itaú / TCS, Petrobras, F3M Information Systems).

#### Scenario: Inspecting enterprise track record
- **WHEN** the visitor reviews the Experience & Track Record section
- **THEN** the system highlights the enterprise-level challenges solved, such as +900% throughput increase in antifraud systems and high-availability corporate architectures.

---

### Requirement: Quantifiable Institutional Impact Metrics
The system SHALL present verified company metrics highlighting LTI Sistemas' impact, including 20+ years of accumulated engineering know-how, +900% throughput performance benchmark, 4 production platforms operating actively, and 12+ developers accelerated.

#### Scenario: Viewing company impact numbers
- **WHEN** the visitor views the metrics section
- **THEN** the system displays prominent numerical benchmarks emphasizing reliability and measurable performance.

---

### Requirement: Corporate Consultation and B2B Lead Conversion
The system SHALL provide institutional conversion channels, including corporate WhatsApp contact with pre-filled business intent, official corporate email, LinkedIn company connection, and an enterprise inquiry form allowing clients to specify project scope and requirements.

#### Scenario: Initiating corporate contact
- **WHEN** a prospect submits the inquiry form or clicks the WhatsApp button
- **THEN** the system routes the request with project details (Consultoria, Arquitetura, Squad Acceleration, Modernização) for priority corporate response.

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

### Requirement: GitHub Profile Presentation Documentation
The repository README.md SHALL serve as an executive GitHub Profile Presentation Card for LTI Sistemas and founder Luiz Felipe Marinho Dantas, detailing company overview, mission-critical engineering credentials (+900% throughput), technology badges, 4 live SaaS applications with verified URLs, and direct business contact buttons.

#### Scenario: Viewing the repository on GitHub
- **WHEN** any user visits `github.com/ltisistemas` or views the repository root
- **THEN** the system renders a modern GitHub Profile README containing branded badges, architectural strengths, live SaaS links, and contact channels.

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
