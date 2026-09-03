## Why

The user provided the official Google Analytics (GA4) measurement tag ID `G-NHWCDJ8HM4` to monitor real-time traffic, organic visitors, acquisition channels, and user engagement on `https://ltisistemas.vercel.app/`.

## What Changes

- Configure `G-NHWCDJ8HM4` as the official Google Analytics ID in `components/analytics/Analytics.tsx` and environment configurations (`.env.local` and `.env.example`).
- Ensure `gtag.js` is loaded via `next/script` with `strategy="afterInteractive"` to ensure zero performance degradation and perfect Core Web Vitals.
- Verify real-time pageview and custom event dispatching (`whatsapp_click`, `proposal_submit`, `portfolio_launch`).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landing-page`: Official Google Analytics 4 tag configuration and verified tracking.

## Impact

- **Analytics**: `G-NHWCDJ8HM4` will start capturing user metrics and conversions immediately upon deployment.
