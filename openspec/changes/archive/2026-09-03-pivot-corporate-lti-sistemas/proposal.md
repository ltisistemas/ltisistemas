## Why

The current landing page effectively showcases technical mastery and live projects, but leans too heavily toward a solo freelancer/individual developer portfolio rather than establishing **LTI Sistemas** (Luiz Tecnologia da Informação) as a premier corporate software engineering firm and technology partner.

To maximize credibility, attract higher-ticket enterprise clients, CTOs, and growing businesses, the landing page copy, visual hierarchy, and structural narrative must pivot from an individual-centric portfolio to a **company-first corporate engineering studio** — positioning Luiz Felipe Marinho Dantas as the Founder & Principal Solutions Architect who directs the company's technical excellence and 20-year proven track record.

## What Changes

- **Corporate Rebranding & Tone of Voice**: Shift all section narratives, headings, and copy from first-person/solo freelancer ("sobre mim", "meu portfólio") to institutional/corporate plural ("Sobre a LTI Sistemas", "Nossas Soluções", "Ecossistemas Desenvolvidos", "Nossa Metodologia", "Fale com Nossos Especialistas").
- **Hero Section Overhaul**: Reframe the headline and value proposition around LTI Sistemas as an engineering studio delivering high-complexity software, scalable cloud architecture, and technical squad acceleration.
- **Institutional "Sobre a LTI Sistemas" Section**: Refactor the About section to highlight the firm's mission, engineering governance, and the executive leadership of founder Luiz Felipe (20 years of mission-critical expertise).
- **Corporate Solutions & Services**: Restructure the 5 core services as institutional B2B offerings (Engenharia Sob Medida, Consultoria de Arquitetura Cloud, Alocação de Tech Leadership / Squads, Modernização de Legados, Desenvolvimento End-to-End de Produtos).
- **Portfolio Reframed as Company Cases**: Re-label the 4 live production projects (*Credit Flow App*, *MainFast*, *Meu Fluxo Financeiro*, *Quick InvoiceFlow*) as platforms and proprietary SaaS ecosystems architected and delivered by LTI Sistemas.
- **Enterprise Track Record & Methodology**: Present the background (TCS / Banco Itaú, Petrobras, F3M) as the enterprise pedigree and engineering standards embedded in LTI Sistemas' DNA.
- **Institutional Conversion & Contact**: Update CTAs, contact form, and WhatsApp routing to reflect corporate inquiry ("Falar com a Equipe Técnica", "Solicitar Proposta Corporativa").
- **Centralized Data & Metadata Updates**: Refactor `lib/data.ts`, `lib/types.ts`, and SEO JSON-LD schema to firmly establish LTI Sistemas as an enterprise software organization.

## Capabilities

### New Capabilities
- `landing-page`: Corporate-first landing page for LTI Sistemas showcasing institutional software engineering solutions, live enterprise SaaS cases, corporate technical leadership, and B2B business conversion channels.

### Modified Capabilities
<!-- None in main spec root. -->

## Impact

- **Content & Data Layer**: Updates `lib/data.ts` and `lib/types.ts` to reflect company-first messaging, institutional descriptions, and corporate services.
- **Components Refactoring**: Updates `components/sections/Hero.tsx`, `components/sections/About.tsx`, `components/sections/Services.tsx`, `components/sections/Portfolio.tsx`, `components/sections/TechStack.tsx`, `components/sections/Experience.tsx`, `components/sections/Metrics.tsx`, `components/sections/Contact.tsx`, `components/layout/Navbar.tsx`, and `components/layout/Footer.tsx`.
- **Layout & SEO**: Updates `app/layout.tsx` OpenGraph, description, and JSON-LD schema to highlight Organization / SoftwareApplication / ProfessionalService.
