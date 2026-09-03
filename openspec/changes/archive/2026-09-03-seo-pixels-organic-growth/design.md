## Context

See `proposal.md` for motivation and background context.

The site is live in production at `https://ltisistemas.vercel.app/`. This design establishes a complete technical SEO foundation for search crawler indexing (Google, Bing) and a modular, production-ready multi-pixel analytics infrastructure.

## Goals / Non-Goals

**Goals:**
- Implement Next.js metadata routes:
  - `app/sitemap.ts` (Sitemap XML with canonical URLs, changefreq, and priorities)
  - `app/robots.ts` (Robots.txt allowing all crawlers and indexing)
- Enhance `app/layout.tsx` with:
  - `metadataBase: new URL("https://ltisistemas.vercel.app")`
  - Canonical URLs, complete OpenGraph and Twitter cards
  - Multi-Schema JSON-LD (`Organization`, `WebSite`, `ProfessionalService`, `FAQPage`)
- Implement `lib/analytics.ts` and `components/analytics/Analytics.tsx`:
  - Support Google Analytics 4 (`NEXT_PUBLIC_GA_ID`)
  - Support Meta / Facebook Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
  - Support LinkedIn Insight Tag (`NEXT_PUBLIC_LINKEDIN_PARTNER_ID`)
  - Dispatch custom conversion events on WhatsApp clicks, proposal dispatches, and portfolio links.

**Non-Goals:**
- Hardcoding tracking tokens that would expose private account IDs without environment variables.

## Decisions

### 1. Native Next.js 16 Metadata File Routes (`sitemap.ts` & `robots.ts`)
- **Decision**: Use Next.js App Router's built-in TypeScript metadata file handlers rather than static static files.
- **Rationale**: Automatic header generation, correct MIME types, and seamless synchronization with site domains.

### 2. Multi-Schema JSON-LD (`Organization` + `WebSite` + `FAQPage`)
- **Decision**: Bundle `Organization`, `WebSite`, and `FAQPage` schemas into the `<head>` of `app/layout.tsx`.
- **Rationale**: `FAQPage` schema unlocks rich accordion search result snippets on Google for target keywords ("Consultoria em Arquitetura", "Tech Lead as a Service", "Modernização de Legados").

### 3. Graceful Multi-Pixel Client Architecture
- **Decision**: Load analytics via a non-blocking client component (`Analytics.tsx`) that conditionally renders only when the corresponding environment variable is present, while `lib/analytics.ts` provides safe no-op event dispatching.
- **Rationale**: Zero performance overhead and zero console errors in development or until the user adds their tracking IDs in Vercel.

## Risks / Trade-offs

- **[Risk]** Analytics blockers in browsers.
  - **Mitigation**: Use Next.js `next/script` with `strategy="afterInteractive"` to prevent any blocking of primary content rendering.

## Migration Plan

1. Create `app/sitemap.ts` and `app/robots.ts`.
2. Create `lib/analytics.ts` and `components/analytics/Analytics.tsx`.
3. Update `app/layout.tsx` with enhanced metadata, FAQ schema, and `Analytics` component.
4. Integrate `trackEvent` triggers into `Contact.tsx`, `Hero.tsx`, `Navbar.tsx`, and `Portfolio.tsx`.
5. Validate build with `npm run build`.
