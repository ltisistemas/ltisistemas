## Context

See `proposal.md` for motivation and background context.

The visitor experience must be frictionless: when someone submits a corporate proposal, the system should dispatch the email in the background via Next.js App Router API Route (`POST /api/contact`) straight to `luizltisistemas@gmail.com` without opening any external client or asking the user to log into webmail.

## Goals / Non-Goals

**Goals:**
- Implement `app/api/contact/route.ts` backend endpoint:
  - Validates payload (`name`, `email`, `company`, `projectType`, `message`).
  - Sends email to `luizltisistemas@gmail.com` server-side via serverless email gateway pipeline.
  - Returns `{ success: true }`.
- Overhaul `components/sections/Contact.tsx`:
  - Asynchronous submission with `fetch("/api/contact")`.
  - Loading spinner and disabled button state during transmission.
  - On-page instant Success Screen with confirmation message and optional direct WhatsApp accelerator.
  - Graceful fallback for network errors.

**Non-Goals:**
- Requiring the visitor to open their personal email app or webmail interface.

## Decisions

### 1. Server-Side Email Transmission (`/api/contact`)
- **Decision**: Process the form submission through an App Router API Route that handles formatting and reliable serverless email delivery.
- **Rationale**: Completely removes client-side mailto dependencies, delivering a seamless 1-click submission flow directly from the landing page.

### 2. Immediate On-Page Confirmation UI
- **Decision**: Replace the form view with an on-page Success Banner upon successful API response, providing visual assurance and offering an optional WhatsApp button for urgent corporate discussions.
- **Rationale**: Maximizes user trust, confirms receipt, and provides an immediate channel for fast-moving opportunities.

## Risks / Trade-offs

- **[Risk]** Potential spam / bot submissions.
  - **Mitigation**: Add basic honeypot field and server-side validation on field lengths and formats in `route.ts`.

## Migration Plan

1. Create `app/api/contact/route.ts`.
2. Update `components/sections/Contact.tsx` to call `/api/contact` and display the instant success view.
3. Validate build with `npm run build`.
