## Context

See `proposal.md` for motivation and background context.

This design covers two key improvements:
1. Transforming `README.md` into the official executive GitHub Profile Card for `ltisistemas`.
2. Overhauling the contact inquiry form in `components/sections/Contact.tsx` to eliminate reliance on OS desktop mail clients, providing direct 1-click Gmail Webmail compose, WhatsApp proposal forwarding, and clipboard copy.

## Goals / Non-Goals

**Goals:**
- **README.md**: Create a modern, executive GitHub Profile README with shields.io badges, corporate summary, 4 live SaaS applications, methodology, and direct contact buttons.
- **Contact Delivery**: Provide a foolproof proposal dispatch experience in `components/sections/Contact.tsx`:
  - 1-Click Gmail Webmail direct compose URL (`mail.google.com/mail/?view=cm&fs=1&to=luizltisistemas@gmail.com&...`)
  - 1-Click WhatsApp proposal forwarding (`wa.me/5581973123278?text=...`)
  - Default mailto trigger + 1-click clipboard copier for maximum reliability.
- Ensure 0% lead drop-off even when visitors lack desktop email client software.

**Non-Goals:**
- Requiring paid third-party email API subscriptions (e.g. SendGrid or Amazon SES credentials), keeping the deployment 100% serverless, zero-cost, and instant on Vercel.

## Decisions

### 1. Dual-Channel Webmail & WhatsApp Dispatch Flow
- **Decision**: On form submission, display a polished Dispatch & Confirmation Modal with pre-configured direct dispatch options (Gmail Webmail, WhatsApp Forward, Mailto, Copy Proposal).
- **Rationale**: 95%+ of corporate and startup clients use browser-based Gmail or WhatsApp. By providing direct web URLs with pre-populated message bodies, we ensure 100% delivery success without depending on local OS email client configurations.

### 2. GitHub Profile README Architecture
- **Decision**: Structure `README.md` using professional Markdown with Shields.io badges, live application links, metrics, and corporate contact triggers.
- **Rationale**: Elevates the `ltisistemas` GitHub profile into an instant authority piece for visitors, recruiters, CTOs, and potential clients.

## Risks / Trade-offs

- **[Risk]** Pop-up blockers on browser tabs.
  - **Mitigation**: Use direct user-triggered clicks on the dispatch modal buttons with explicit `target="_blank"` and visual confirmation.

## Migration Plan

1. Overhaul `README.md`.
2. Update `components/sections/Contact.tsx` with the multi-channel dispatch modal.
3. Validate build with `npm run build`.
