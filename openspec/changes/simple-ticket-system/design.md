## Context

The application is built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. The user has provided PostgreSQL connection URLs in `.env`. The ticket system needs to be simple, objective, and functional, with zero bloat or complex multi-tiered dashboard layers.

See `proposal.md` for background and `specs/ticket-system/spec.md` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide a clean, modern ticket portal operating under Impeccable UI/UX standards (crisp hierarchy, high scannability, responsive layout, seamless image attachments).
- Deliver secure authentication using Argon2id password hashing combined with a server-side pepper (`AUTH_PEPPER`).
- Strict role isolation: `CLIENTE` users see only their own tickets; `SUPORTE` users have access to all tickets and user provisioning.
- Lightweight image handling: Client-side compression and validation before storing up to 3 screenshot attachments directly in the database.
- Clean navigation integration on the existing landing page (header and footer).

**Non-Goals:**
- Public self-registration (all client and support accounts are provisioned exclusively by Support).
- Complex SLA automation, multi-agent assignees, or AI triage bots (keeping the system focused, fast, and lightweight).
- External cloud S3 bucket setup (attachments are stored directly in PostgreSQL to keep infrastructure zero-config and self-contained).

## Decisions

### 1. Data Layer: Prisma ORM with PostgreSQL
- **Choice**: Use Prisma ORM with `@prisma/client` pointing to `DATABASE_URL` in `.env`.
- **Rationale**: Provides type-safe database queries, schema migrations, and seamless integration with Next.js Server Actions and API routes.
- **Models**:
  - `User`: `id`, `name`, `email`, `company`, `contractNumber` (optional), `role` (`SUPORTE`, `CLIENTE`), `passwordHash`, timestamps.
  - `Ticket`: `id`, `ticketNumber` (integer sequence / code), `title`, `description`, `status` (`ABERTO`, `PENDENTE`, `FECHADO`), `userId`, timestamps.
  - `TicketAttachment`: `id`, `ticketId`, `base64Data`, `mimeType`, `fileName`, `createdAt`.
- **Alternatives Considered**: Raw SQL with `pg` (more error-prone, lacks automatic migration management).

### 2. Authentication & Password Security: Argon2id + Server Pepper + Encrypted Session
- **Choice**: Hash passwords using `argon2` (or `@node-rs/argon2`) with an environment-based secret pepper (`AUTH_PEPPER` + salt). Issue secure HTTP-only cookies containing signed session JWTs (via `jose`).
- **Rationale**: Argon2id is the gold standard for password hashing, resistant to GPU/ASIC cracking. A server-side pepper ensures hashes cannot be cracked offline even if database dumps leak.
- **Alternatives Considered**: bcrypt (older, less memory-hard than Argon2id).

### 3. Attachment Storage Strategy
- **Choice**: Accept up to 3 image files (PNG, JPEG, WebP) per ticket. Compress images on the client side to maximum 1200px width / ~300KB-800KB before converting to base64, storing them in the `TicketAttachment` table.
- **Rationale**: Eliminates the need for external AWS S3 / Cloudflare R2 configurations and credentials, keeping deployment 100% self-contained within the existing database.
- **Alternatives Considered**: Direct S3 upload (requires separate cloud account, billing, and API keys).

### 4. UI/UX Architecture & Route Organization
- **Choice**:
  - `/suporte/login`: Centered, high-contrast, accessible login card.
  - `/suporte/chamados`: Responsive list/table of tickets with quick status filters (`Todos`, `Aberto`, `Pendente`, `Fechado`), new ticket trigger, and status badges.
  - `/suporte/chamados/[id]`: Dedicated incident view with ticket metadata, client company info, full problem description, and thumbnail grid with zoomable lightbox modal for screenshots.
  - `/suporte/usuarios`: Minimalist modal/page for Support to register new clients or colleagues.
- **Design Tokens & Style**: Impeccable design principles (clean neutral dark surfaces, emerald/amber/zinc status badges, Lucide icons, accessible contrast, smooth micro-interactions).

## Risks / Trade-offs

- **[Risk] Database size growth due to base64 image storage** → **Mitigation**: Limit attachments to max 3 images per ticket, enforce client-side compression (max ~800KB each), and validate payload sizes on API routes.
- **[Risk] Initial setup without existing Support account** → **Mitigation**: Provide an automatic database seeding script (`npm run db:seed` or auto-seed on startup if zero users exist) with default secure credentials to allow immediate first login.
- **[Risk] Cross-tenant data leakage** → **Mitigation**: Enforce server-side session checks in all Server Actions / API routes where client queries strictly filter by `where: { userId: session.userId }` unless `session.role === 'SUPORTE'`.

## Migration Plan

1. Install Prisma and auth dependencies (`prisma`, `@prisma/client`, `argon2`, `jose`).
2. Define `prisma/schema.prisma` matching the models.
3. Run `npx prisma db push` to synchronize PostgreSQL database schema.
4. Run seed script to generate the default `SUPORTE` administrator account.
5. Implement authentication helpers, middleware/session validation, and server actions.
6. Implement UI routes (`/suporte/*`) and integrate navigation links in `Navbar.tsx` and `Footer.tsx`.
7. Verify end-to-end flows for both `CLIENTE` and `SUPORTE` roles.
