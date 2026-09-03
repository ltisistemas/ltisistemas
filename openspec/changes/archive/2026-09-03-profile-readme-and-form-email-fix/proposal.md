## Why

1. **GitHub Profile Card (README.md)**: Because the repository name (`ltisistemas`) matches the GitHub account (`github.com/ltisistemas`), `README.md` serves automatically as the user's official GitHub Profile Presentation Card. It currently contains default Next.js boilerplate and needs to be completely rewritten into a premium, visual, and high-authority executive portfolio presentation.
2. **Contact Inquiry Form Delivery**: When visitors submitted the contact/proposal form, the browser triggered a raw client-side `mailto:`, which fails silently if the user does not have a native desktop mail client configured (such as Outlook or Apple Mail). We must overhaul the form with foolproof multi-channel delivery: direct 1-click Gmail Webmail compose, direct WhatsApp proposal forward with complete payload, mailto fallback, and an interactive confirmation modal ensuring zero lost leads.

## What Changes

- **GitHub Profile README.md Overhaul**:
  - Transform `README.md` into an executive GitHub Profile README for **LTI Sistemas** and founder **Luiz Felipe Marinho Dantas**.
  - Include custom shields/badges (.NET, React, Next.js, AWS, TypeScript, Tailwind, Docker, etc.).
  - Institutional summary: 20+ years of mission-critical experience, +900% throughput benchmark, Clean Architecture, squad leadership.
  - Showcase the 4 live production SaaS applications with badges and live Vercel links.
  - Interactive contact buttons (WhatsApp, LinkedIn, Email).
- **Contact Form Delivery & Modal Overhaul (`Contact.tsx`)**:
  - Overhaul `Contact.tsx` submission flow so users can immediately choose their preferred sending method:
    - **1-Click Gmail Webmail**: Automatically opens `mail.google.com` with `luizltisistemas@gmail.com`, subject, and full message pre-filled.
    - **1-Click WhatsApp**: Automatically forwards the structured proposal payload directly to `+55 (81) 97312-3278`.
    - **Default Mail App / Copy**: Standard mailto trigger + 1-click payload copier.
  - Display an interactive success/dispatch modal confirming the lead details and providing instant dispatch triggers so no inquiry is ever lost.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landing-page`: Overhaul contact inquiry form delivery mechanisms and create the official GitHub Profile README.

## Impact

- **`README.md`**: Complete overhaul to serve as the flagship GitHub profile presentation.
- **`components/sections/Contact.tsx`**: Enhanced submission flow with instant Gmail, WhatsApp, and mailto dispatch modal.
- **`lib/data.ts`**: Helper utilities and pre-formatted email/WhatsApp proposal generators.
