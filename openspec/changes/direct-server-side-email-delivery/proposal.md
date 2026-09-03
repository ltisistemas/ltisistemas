## Why

The proposal form should not require visitors to open their personal email or Gmail webmail client to send a message. The form must transmit the proposal directly in the background through a server-side Next.js API route (`/api/contact`) straight into `luizltisistemas@gmail.com`, providing a seamless 1-click submit experience with an instant on-page confirmation screen.

## What Changes

- **Server-Side Email Dispatch API (`app/api/contact/route.ts`)**:
  - Create a Next.js App Router API Route (`POST /api/contact`) that accepts the form payload (Name, Email, Company, Project Type, Message).
  - Dispatch the formatted email payload to `luizltisistemas@gmail.com` via serverless email gateway (Web3Forms / Resend / Formspree webhook pipeline) with complete error handling.
- **Seamless 1-Click Form UI (`components/sections/Contact.tsx`)**:
  - Replace client-side redirect dispatch with background `fetch("/api/contact", ...)` submission.
  - Add real-time loading state ("Enviando proposta...") and disable submit button during request.
  - Display a dedicated on-page Success State ("✅ Proposta Enviada com Sucesso!") with a breakdown of what was sent and an urgent WhatsApp follow-up button.
  - Maintain an offline/fallback option if the network request fails.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landing-page`: Direct background server-side email dispatch and instant on-page submission confirmation.

## Impact

- **Backend**: Adds `app/api/contact/route.ts`.
- **Frontend**: Overhauls `components/sections/Contact.tsx` for seamless background transmission.
