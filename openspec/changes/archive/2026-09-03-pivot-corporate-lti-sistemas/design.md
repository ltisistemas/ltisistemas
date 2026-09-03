## Context

See `proposal.md` for motivation and background context.

The existing codebase is built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4 with a clean component architecture. This design outlines how to pivot the narrative and visual copy across all sections from an individual freelancer portfolio to an authoritative **corporate software engineering firm (LTI Sistemas)**.

## Goals / Non-Goals

**Goals:**
- Shift the narrative posture across the entire application to an institutional, enterprise-grade software house ("LTI Sistemas").
- Position founder Luiz Felipe Marinho Dantas as the Chief Technology Officer & Principal Solutions Architect leading the firm's engineering standards.
- Re-label and reframe portfolio items as proprietary platforms and products engineered by LTI Sistemas (*Credit Flow App*, *MainFast*, *Meu Fluxo Financeiro*, *Quick InvoiceFlow*).
- Restructure services into corporate B2B capabilities (Engenharia Sob Medida, Consultoria de Arquitetura Cloud, Alocação de Tech Lead & Squad Acceleration, Modernização de Sistemas Legados, Desenvolvimento End-to-End).
- Update the centralized data layer in `lib/data.ts` and `lib/types.ts` with institutional copy, corporate contact channels, and B2B inquiry flows.
- Update SEO metadata and JSON-LD schema in `app/layout.tsx` to represent the company `Organization` and `ProfessionalService`.

**Non-Goals:**
- Changing the underlying visual dark-tech aesthetic or core design system tokens (the modern slate/cyan/emerald theme remains the chosen corporate identity).
- Introducing backend database dependencies (client-side validated mailto and direct corporate WhatsApp channels provide fast conversion).

## Decisions

### 1. Institutional Narrative Architecture in `lib/data.ts`
- **Decision**: Update all content in `lib/data.ts` to institutional plural ("Nossas Soluções", "Nossa Equipe de Engenharia", "Ecossistemas Entregues pela LTI Sistemas").
- **Rationale**: Elevates perceived company scale and professionalism when pitching to CTOs, PMs, and enterprise procurement.
- **Alternatives Considered**: Keeping first-person solo text (rejected: explicitly requested to focus on LTI Sistemas).

### 2. Component Refactoring Strategy
- **`components/layout/Navbar.tsx`**: Update links to "Sobre a LTI", "Soluções", "Produtos", "Metodologia", "Histórico", "Contato".
- **`components/sections/Hero.tsx`**: Emphasize LTI Sistemas as an engineering house for high-complexity software, with badges highlighting mission-critical architecture, custom delivery, and proven track record.
- **`components/sections/About.tsx`**: Reframe as "Sobre a LTI Sistemas" — highlighting corporate mission, engineering governance, and the executive leadership of founder Luiz Felipe.
- **`components/sections/Services.tsx`**: Reframe as "Soluções Corporativas LTI Sistemas".
- **`components/sections/Portfolio.tsx`**: Reframe as "Produtos e Ecossistemas Desenvolvidos pela LTI Sistemas".
- **`components/sections/TechStack.tsx`**: Reframe as "Nossa Metodologia & Arsenal Tecnológico".
- **`components/sections/Experience.tsx`**: Reframe as "DNA Enterprise & Bagagem Técnica".
- **`components/sections/Metrics.tsx`**: Reframe as "Impacto & Resultados Entregues".
- **`components/sections/Contact.tsx`**: Reframe as "Consultoria Corporativa & Proposta de Projeto".
- **`components/layout/Footer.tsx`**: Reinforce LTI Sistemas institutional branding, copyright, and business links.

### 3. Corporate SEO & Structured Data
- **Decision**: Update JSON-LD in `app/layout.tsx` to declare `Organization` / `ProfessionalService` for LTI Sistemas, with founder attribution to Luiz Felipe Marinho Dantas.

## Risks / Trade-offs

- **[Risk]** Losing the personal credibility of Luiz Felipe's 20-year career.
  - **Mitigation**: Strategically present Luiz Felipe as Founder & Principal Solutions Architect who personally guarantees engineering governance, code review, and architectural rigor on all LTI Sistemas projects.

## Migration Plan

1. Update `lib/types.ts` and `lib/data.ts` with institutional corporate data.
2. Refactor all section components (`Hero`, `About`, `Services`, `Portfolio`, `TechStack`, `Experience`, `Metrics`, `Contact`, `Navbar`, `Footer`).
3. Update `app/layout.tsx` with corporate SEO metadata.
4. Execute `npm run build` to verify clean build.
