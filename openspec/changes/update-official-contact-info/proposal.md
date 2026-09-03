## Why

The landing page previously used placeholder contact links. The founder provided the definitive official contact details for LTI Sistemas (Phone/WhatsApp: `+55 (81) 97312-3278`, LinkedIn: `https://www.linkedin.com/in/luizfelipemarinhodantas/`, and Email: `luizltisistemas@gmail.com`). 

These verified credentials must be integrated across all interactive channels (Navbar, Hero, About, Contact section, mailto form fallback, Footer, and JSON-LD structured metadata) to guarantee all corporate inquiries and client leads are routed directly to the founder.

## What Changes

- Update `lib/data.ts` with the official contact coordinates:
  - **WhatsApp Deep Link**: `https://wa.me/5581973123278?text=Ol%C3%A1%2C%20LTI%20Sistemas!%20Gostaria%20de%20conversar%20sobre%20uma%20proposta%20ou%20consultoria%20corporativa.`
  - **Phone Display**: `+55 (81) 97312-3278` (or `(81) 97312-3278`)
  - **Official LinkedIn URL**: `https://www.linkedin.com/in/luizfelipemarinhodantas/`
  - **Official Corporate Email**: `luizltisistemas@gmail.com`
- Ensure all contact forms, mailto triggers, header CTAs, footer links, and about section buttons use these exact endpoints.
- Update SEO structured data (`app/layout.tsx`) contact points and author URLs with `luizltisistemas@gmail.com` and the official LinkedIn profile.

## Capabilities

### New Capabilities
- `landing-page`: Official verified corporate contact channels and live lead routing for LTI Sistemas.

### Modified Capabilities
<!-- None in main spec root. -->

## Impact

- **Data Layer**: Updates `lib/data.ts` single source of truth.
- **Components & Layout**: Ensures `Navbar.tsx`, `Hero.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`, and `app/layout.tsx` dynamically and accurately route to `81973123278`, `https://www.linkedin.com/in/luizfelipemarinhodantas/`, and `luizltisistemas@gmail.com`.
