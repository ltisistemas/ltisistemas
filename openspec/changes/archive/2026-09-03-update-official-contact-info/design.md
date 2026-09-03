## Context

See `proposal.md` for motivation and background context.

The site is built with a centralized data source (`lib/data.ts`). This design defines how the official contact information (WhatsApp `5581973123278`, LinkedIn `https://www.linkedin.com/in/luizfelipemarinhodantas/`, Email `luizltisistemas@gmail.com`) is injected into the single source of truth and propagated across all layout components, sections, and SEO schema.

## Goals / Non-Goals

**Goals:**
- Update `lib/data.ts` with the official contact coordinates:
  - Phone & WhatsApp: `81973123278` (Formatted: `+55 (81) 97312-3278`)
  - Deep link: `https://wa.me/5581973123278?text=Ol%C3%A1%2C%20LTI%20Sistemas!%20Gostaria%20de%20conversar%20sobre%20uma%20proposta%20ou%20consultoria%20corporativa.`
  - LinkedIn: `https://www.linkedin.com/in/luizfelipemarinhodantas/`
  - Email: `luizltisistemas@gmail.com`
- Verify and ensure all conversion points (`Navbar.tsx`, `Hero.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`, and `app/layout.tsx`) correctly route to these new endpoints.
- Update the JSON-LD schema in `app/layout.tsx` to include the verified email and LinkedIn profile URL.

**Non-Goals:**
- Changing existing section layouts, animations, or styling tokens.

## Decisions

### 1. Centralized Injection via `lib/data.ts`
- **Decision**: Update `siteConfig.contact` in `lib/data.ts` and ensure all components consume the centralized config rather than hardcoding values.
- **Rationale**: Guarantees consistency across header CTAs, mobile drawers, Hero buttons, Contact cards, inquiry form mailto actions, footer links, and SEO metadata.

## Risks / Trade-offs

- **[Risk]** None identified. Direct link formats for WhatsApp (`wa.me/5581973123278`), LinkedIn, and mailto are standard, verified, and cross-platform.

## Migration Plan

1. Update `lib/data.ts` `siteConfig.contact` object.
2. Update `app/layout.tsx` structured JSON-LD data.
3. Validate build with `npm run build`.
