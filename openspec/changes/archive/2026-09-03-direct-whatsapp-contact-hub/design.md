## Context

See `proposal.md` for motivation and background context.

The user requested the complete removal of the traditional contact form in favor of an ultra-direct, 1-click WhatsApp communication hub. This design specifies the visual layout and topic-based message presets for the new Direct WhatsApp Fast-Connect Hub.

## Goals / Non-Goals

**Goals:**
- Replace the form in `components/sections/Contact.tsx` with a **Direct WhatsApp Fast-Connect Hub**:
  - **Main Direct Channel Card**: Displays verified phone `+55 (81) 97312-3278`, online availability indicator, executive founder attribution, and direct primary WhatsApp trigger.
  - **5 Categorized 1-Click WhatsApp Quick Starters**:
    1. ⚡ Consultoria em Arquitetura & Cloud-Native
    2. 🚀 Alocação de Tech Lead & Squad Acceleration
    3. 🔄 Modernização de Sistemas Legados sem Downtime
    4. 🛠️ Engenharia de Software Sob Medida & SaaS
    5. 💬 Diagnóstico Geral & Proposta Rápida
  - Secondary corporate channels for LinkedIn and E-mail.
- Track conversion events on every topic click (`whatsapp_click` with category).

**Non-Goals:**
- Retaining input fields or textareas that demand typing before opening WhatsApp.

## Decisions

### 1. Categorized 1-Click WhatsApp Topics
- **Decision**: Provide pre-configured topic cards that automatically format the greeting message in WhatsApp Web / Mobile.
- **Rationale**: Eliminates typing friction for mobile and desktop users while giving the founder immediate context on what the client needs.

## Risks / Trade-offs

- **[Risk]** None. WhatsApp URLs (`wa.me`) are universal across mobile, desktop, and web.

## Migration Plan

1. Refactor `components/sections/Contact.tsx` to render the WhatsApp Fast-Connect Hub.
2. Validate build with `npm run build`.
