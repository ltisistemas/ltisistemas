## Context

See `proposal.md` for motivation and background context.

The project is initialized on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. The landing page must establish an authoritative, enterprise-grade digital presence for LTI Sistemas and Luiz Felipe Marinho Dantas, highlighting 20 years of hands-on software engineering, cloud architecture, squad leadership, and 4 active production SaaS applications.

## Goals / Non-Goals

**Goals:**
- Deliver a single-page, responsive application with smooth anchor navigation across 9 core sections.
- Provide a typed, centralized data layer (`lib/data.ts`) containing all structured content (services, portfolio projects, career milestones, tech stack items, contact configs) to allow easy future updates.
- Create modular React components adhering to clean code and atomic design principles in `components/`.
- Showcase all 4 production projects with live verified links (`credit-flow-app.vercel.app`, `mainfast-fabrica-de-mvp-webapp-reac.vercel.app`, `meufluxofinanceiro-app.vercel.app`, `quick-invoiceflow.vercel.app`).
- Implement frictionless lead conversion pathways: WhatsApp instant link with pre-filled message, LinkedIn redirect, email mailto/copy, and client-side validated contact inquiry form.
- Optimize for high performance (Lighthouse 90+ score), SEO with structured JSON-LD metadata, and accessibility (WCAG 2.1 AA).

**Non-Goals:**
- Implementing a multi-page dynamic blog or CMS backend (deferrable to a future phase).
- Complex backend authentication or database persistence for the landing page itself (leads are routed directly to WhatsApp, email client, or direct inbox hooks).

## Decisions

### 1. Centralized Data Architecture (`lib/data.ts`)
- **Decision**: Decouple static text, projects metadata, services details, and experience entries into a single TypeScript module (`lib/data.ts`) with strict typing.
- **Rationale**: Keeps React presentation components clean, highly readable, easily testable, and allows the founder to update copy, links, or projects in one single location.
- **Alternatives Considered**: Hardcoding text directly into JSX (rejected: violates separation of concerns and hinders maintainability).

### 2. Modern Tech Aesthetic: Dark Slate & Cyan/Emerald Accent Theme
- **Decision**: Use a sleek dark theme (`#090D16` / `#0F172A`) with glassmorphism overlays (`backdrop-blur-md`, subtle translucent borders), cyan/teal primary accents (`#06B6D4`), and emerald badges (`#10B981`) for live production status.
- **Rationale**: Appeals directly to technical decision-makers (CTOs, Tech Leads, Engineering Managers, Product Owners) conveying high craftsmanship, modern architectural fluency, and reliability.
- **Alternatives Considered**: Generic light-mode corporate design (rejected: lacks the distinct modern tech engineering personality required).

### 3. Native Lucide Icon Integrations & Lightweight Visual Assets
- **Decision**: Install and leverage `lucide-react` for consistent, accessible, scalable vector icons across service cards, tech stack categories, contact channels, and portfolio indicators.
- **Rationale**: Guarantees crisp rendering across all screen resolutions without heavy image payloads, keeping bundle size minimal and Lighthouse scores 90+.
- **Alternatives Considered**: Heavy custom raster images or external font icon CDNs (rejected: slower load times and visual inconsistencies).

### 4. Component Hierarchy & Layout Structure
```
app/
├── layout.tsx         # Root layout with fonts, SEO OpenGraph, JSON-LD Schema
├── page.tsx           # Assembles all section components
└── globals.css        # Tailwind directives and custom utility classes
components/
├── layout/
│   ├── Navbar.tsx     # Sticky glassmorphic navbar with mobile menu
│   └── Footer.tsx     # Footer with brand info, quick links, social media
├── sections/
│   ├── Hero.tsx       # Value proposition, CTAs, live status indicator
│   ├── About.tsx      # Luiz Felipe's 20-year trajectory & engineering ethos
│   ├── Services.tsx   # 5 specialized technical services cards
│   ├── Portfolio.tsx  # 4 live SaaS project showcase cards with external links
│   ├── TechStack.tsx  # Categorized technology matrix with badges
│   ├── Experience.tsx # Enterprise trajectory (TCS/Itaú, F3M, Petrobras, LTI)
│   ├── Metrics.tsx    # Impact stats (+900% throughput, 12+ led devs, etc.)
│   └── Contact.tsx    # Multi-channel conversion form & direct WhatsApp/LinkedIn
└── ui/
    ├── Badge.tsx      # Status and tech tag badge
    ├── Button.tsx     # Polished button styles (primary, secondary, outline)
    └── Card.tsx       # Reusable glassmorphic card container
lib/
├── data.ts            # Typed content data source
└── types.ts           # Data interfaces and types
```

## Risks / Trade-offs

- **[Risk]** External portfolio URLs might undergo downtime or maintenance on Vercel.
  - **Mitigation**: Add visual fallback preview cards, clear architectural explanations, and secure `rel="noopener noreferrer"` links with clear indication of external deployment.
- **[Risk]** Contact form spam or unhandled email delivery without a paid email service.
  - **Mitigation**: Implement direct WhatsApp deep link with pre-formatted business query as the primary high-conversion channel, alongside a mailto trigger and direct LinkedIn contact option.

## Migration Plan

1. Initialize component library folders (`components/layout`, `components/sections`, `components/ui`, `lib/`).
2. Add `lucide-react` dependency for crisp icons.
3. Configure `lib/types.ts` and `lib/data.ts` with complete content for LTI Sistemas.
4. Build reusable UI elements and section components.
5. Integrate sections in `app/page.tsx`, configure metadata in `app/layout.tsx`, and refine global styles in `app/globals.css`.
6. Validate build with `npm run build` and test responsiveness and links.
