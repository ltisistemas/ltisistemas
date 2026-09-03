## 1. Setup & Project Foundation

- [x] 1.1 Install `lucide-react` dependency for UI iconography and verify clean package installation in `package.json`.
- [x] 1.2 Create `lib/types.ts` and `lib/data.ts` containing complete, typed information for LTI Sistemas (services, 4 live portfolio apps, tech stack, experience timeline, metrics, and contact channels).
- [x] 1.3 Configure global typography, color theme tokens, glassmorphism utilities, and glow effects in `app/globals.css`.

## 2. Shared UI & Layout Components

- [x] 2.1 Implement reusable UI primitives (`Button`, `Badge`, `Card`, `SectionHeading`) in `components/ui/` with hover animations and responsive styling.
- [x] 2.2 Create the responsive sticky glassmorphism `Navbar` in `components/layout/Navbar.tsx` with section links, mobile navigation drawer, and direct CTA.
- [x] 2.3 Create `Footer` in `components/layout/Footer.tsx` with branding, copyright, fast navigation links, and social channels.

## 3. Core Page Sections

- [x] 3.1 Implement `Hero` section in `components/sections/Hero.tsx` featuring the official slogan, Luiz Felipe's 20-year credentials badge, primary WhatsApp CTA, and secondary portfolio anchor.
- [x] 3.2 Implement `About` section in `components/sections/About.tsx` highlighting Luiz Felipe's 20-year trajectory, hands-on engineering, squad mentorship, and legacy modernization.
- [x] 3.3 Implement `Services` section in `components/sections/Services.tsx` with cards for the 5 core technical pillars (Senior Engineering, Software Architecture, Technical Leadership, Cloud & DevOps, Full Stack).
- [x] 3.4 Implement `Portfolio` section in `components/sections/Portfolio.tsx` showcasing the 4 live production projects (*Credit Flow App*, *MainFast*, *Meu Fluxo Financeiro*, *Quick InvoiceFlow*) with external links and tech badges.
- [x] 3.5 Implement `TechStack` section in `components/sections/TechStack.tsx` displaying the categorized technology matrix (Backend, Frontend, Cloud, DevOps, Databases, Architecture).
- [x] 3.6 Implement `Experience` section in `components/sections/Experience.tsx` detailing enterprise track record (TCS / Banco Itaú, F3M, Petrobras, LTI Sistemas).
- [x] 3.7 Implement `Metrics` section in `components/sections/Metrics.tsx` highlighting quantified impact statistics (+900% throughput in fraud prevention, 12+ devs led).
- [x] 3.8 Implement `Contact` section in `components/sections/Contact.tsx` providing multi-channel conversion (WhatsApp direct link, LinkedIn, email, and inquiry form).

## 4. Page Assembly, SEO & Final Verification

- [x] 4.1 Assemble all components in `app/page.tsx` and configure SEO metadata (title, description, OpenGraph, JSON-LD schema) in `app/layout.tsx`.
- [x] 4.2 Execute `npm run build` to verify zero TypeScript errors and successful production compilation.
- [x] 4.3 Validate cross-browser responsive layout, interactive states, and all external portfolio links.
