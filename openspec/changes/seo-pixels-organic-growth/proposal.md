## Why

The landing page is live in production at `https://ltisistemas.vercel.app/`. To maximize organic search rankings on Google/Bing and track incoming corporate prospects, we must upgrade technical SEO (sitemap.xml, robots.txt, rich FAQPage schema, canonical URLs, complete OpenGraph/Twitter tags) and install a modular tracking pixel system (Google Analytics 4, Meta Pixel, LinkedIn Partner Tag, and custom conversion events for WhatsApp clicks and proposal submissions).

## What Changes

- **Dynamic Sitemap & Robots (`app/sitemap.ts` & `app/robots.ts`)**:
  - Implement native Next.js `sitemap.ts` generating indexing entries with priority 1.0, change frequency, and canonical URLs for `https://ltisistemas.vercel.app/`.
  - Implement native Next.js `robots.ts` allowing indexing across all major search crawlers (Googlebot, Bingbot, etc.) and referencing the sitemap.
- **Advanced Metadata & FAQ Rich Schema (`app/layout.tsx`)**:
  - Set `metadataBase: new URL("https://ltisistemas.vercel.app")` and absolute canonical URL tags.
  - Add FAQPage Schema (`@type: FAQPage`) answering high-intent search queries (e.g. "Serviços de Tech Lead", "Arquitetura Cloud-Native", "Modernização de Legados", "Desenvolvimento de Sistemas Críticos"), unlocking Google rich snippet search results.
  - Enhance keywords and OpenGraph image metadata.
- **Tracking Pixels & Event Tracking Architecture (`components/analytics/Analytics.tsx` & `lib/analytics.ts`)**:
  - Create a modular analytics provider supporting:
    - Google Analytics 4 (via `NEXT_PUBLIC_GA_ID` / G-XXXXX)
    - Meta Pixel / Facebook Pixel (via `NEXT_PUBLIC_META_PIXEL_ID`)
    - LinkedIn Insight Tag (via `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`)
  - Provide safe no-op fallbacks when environment variables are not set.
  - Implement `trackEvent` helper to track high-value conversions (WhatsApp CTA clicks, LinkedIn profile views, portfolio app clicks, proposal submissions).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landing-page`: Advanced technical SEO, dynamic sitemap/robots, Google FAQPage rich schema, and multi-pixel analytics tracking architecture.

## Impact

- **SEO & Discovery**: Full search engine indexability and Google rich snippets.
- **Analytics**: Ready for GA4, Meta Ads, and LinkedIn Campaign Manager tracking with zero code refactoring needed when adding IDs in Vercel environment variables.
