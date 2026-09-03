## Purpose

Provides a high-impact, modern, and accessible landing page for LTI Sistemas, presenting Senior Software Engineer and Tech Lead Luiz Felipe Marinho Dantas's 20 years of hands-on expertise, core technical services, production portfolio, and direct business conversion channels.

## ADDED Requirements

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
