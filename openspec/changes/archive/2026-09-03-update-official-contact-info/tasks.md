## 1. Centralized Data Update

- [x] 1.1 Update `lib/data.ts` `siteConfig.contact` with the verified WhatsApp URL (`https://wa.me/5581973123278...`), display phone (`+55 (81) 97312-3278`), LinkedIn (`https://www.linkedin.com/in/luizfelipemarinhodantas/`), and Email (`luizltisistemas@gmail.com`).

## 2. Component Verification & Propagation

- [x] 2.1 Verify all touchpoints in `Navbar.tsx`, `Hero.tsx`, `About.tsx`, `Contact.tsx`, and `Footer.tsx` correctly consume the updated contact coordinates.
- [x] 2.2 Update `app/layout.tsx` JSON-LD structured data and author links with the official email and LinkedIn profile.

## 3. Build & Routing Verification

- [x] 3.1 Execute `npm run build` to ensure clean TypeScript compilation and verify that all contact URLs and mailto actions format correctly.
