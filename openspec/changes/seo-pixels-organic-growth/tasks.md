## 1. Technical SEO & Indexing Infrastructure

- [ ] 1.1 Implement `app/sitemap.ts` and `app/robots.ts` configured for `https://ltisistemas.vercel.app` (with change frequency and priority).
- [ ] 1.2 Update `app/layout.tsx` metadata with `metadataBase`, canonical URLs, enhanced keywords, OpenGraph tags, and multi-schema JSON-LD (`Organization`, `WebSite`, `ProfessionalService`, `FAQPage`).

## 2. Tracking Pixels & Event Infrastructure

- [ ] 2.1 Implement `lib/analytics.ts` and `components/analytics/Analytics.tsx` supporting GA4 (`NEXT_PUBLIC_GA_ID`), Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`), and LinkedIn Tag (`NEXT_PUBLIC_LINKEDIN_PARTNER_ID`).
- [ ] 2.2 Wire custom conversion events (`trackEvent`) on WhatsApp CTA clicks, proposal form submissions, and external portfolio launches.

## 3. Verification & Build

- [ ] 3.1 Execute `npm run build` to verify sitemap generation, robots.txt output, zero TypeScript errors, and successful compilation.
