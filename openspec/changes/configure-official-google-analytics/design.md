## Context

See `proposal.md` for motivation and background context.

The user provided the official Google Analytics measurement tag `G-NHWCDJ8HM4`. This design describes how `G-NHWCDJ8HM4` is integrated directly into the `Analytics` component and environment configurations.

## Goals / Non-Goals

**Goals:**
- Configure `G-NHWCDJ8HM4` as the default Google Analytics 4 ID in `components/analytics/Analytics.tsx`.
- Create `.env.local` and `.env.example` documenting `NEXT_PUBLIC_GA_ID=G-NHWCDJ8HM4`.
- Ensure non-blocking script execution via `next/script` (`strategy="afterInteractive"`).

**Non-Goals:**
- Removing support for other pixels (Meta Pixel, LinkedIn Tag) which remain available as optional integrations.

## Decisions

### 1. Defaulting with Environment Variable Override
- **Decision**: Use `const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-NHWCDJ8HM4";` in `components/analytics/Analytics.tsx`.
- **Rationale**: Guarantees that Google Analytics will immediately start collecting data on Vercel deployment even if the user has not yet configured project environment variables, while maintaining total flexibility for environment-specific IDs.

## Risks / Trade-offs

- **[Risk]** None. `next/script` handles async loading and avoids render blocking.

## Migration Plan

1. Update `components/analytics/Analytics.tsx` with default `G-NHWCDJ8HM4`.
2. Create/update `.env.example` and `.env.local`.
3. Validate build with `npm run build`.
