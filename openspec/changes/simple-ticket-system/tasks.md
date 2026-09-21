## 1. Database & Security Setup

- [x] 1.1 Install dependencies (`prisma`, `@prisma/client`, `argon2`, `jose`) and verify package installation passes without errors.
- [x] 1.2 Define Prisma schema for `User`, `Ticket`, and `TicketAttachment` models in `prisma/schema.prisma` and synchronize database with `npx prisma db push`.
- [x] 1.3 Create database client singleton (`lib/db/prisma.ts`) and seed script (`lib/db/seed.ts`) to provision the default `SUPORTE` administrator account, verifying database connection.

## 2. Authentication & Authorization Core

- [x] 2.1 Implement Argon2id password hashing and verification with server-side pepper in `lib/auth/password.ts` and verify hash/compare logic.
- [x] 2.2 Implement JWT session handling and cookie encryption in `lib/auth/session.ts`, verifying session creation and extraction.
- [x] 2.3 Implement authentication Server Actions (`loginAction`, `logoutAction`, `getCurrentUser`) and verify credential validation and error messaging.
- [x] 2.4 Implement user provisioning Server Action (`createUserAction`) guarded strictly for `SUPORTE` role and verify email uniqueness and field validation.

## 3. Ticket Management & Attachment Engine

- [x] 3.1 Implement ticket creation action (`createTicketAction`) supporting title, description, and up to 3 base64 compressed images, verifying persistence in `Ticket` and `TicketAttachment`.
- [x] 3.2 Implement ticket querying actions (`getTicketsAction`, `getTicketByIdAction`) with strict role-based data isolation (`CLIENTE` sees only own tickets; `SUPORTE` sees all).
- [x] 3.3 Implement ticket status update action (`updateTicketStatusAction`) allowing `SUPORTE` to switch tickets between `aberto`, `pendente`, and `fechado`.

## 4. UI Implementation with Impeccable Design

- [x] 4.1 Build `/suporte/login` page with high-contrast form controls, password visibility toggle, error banners, and clean branding.
- [x] 4.2 Build `/suporte/chamados` interface featuring client ticket list, status filter pills (`Todos`, `Aberto`, `Pendente`, `Fechado`), and "Novo Chamado" modal with drag-and-drop / file upload previews.
- [x] 4.3 Build `/suporte/chamados/[id]` ticket details view featuring complete issue description, client company/contract metadata, status transition controls for support, and zoomable screenshot lightbox.
- [x] 4.4 Build user provisioning view/modal for `SUPORTE` users at `/suporte/usuarios` to register new `CLIENTE` or `SUPORTE` accounts.

## 5. Navigation Integration, Verification & Git Sync

- [x] 5.1 Add "Área do Cliente / Suporte" links in `components/layout/Navbar.tsx` and `components/layout/Footer.tsx` and verify responsive navigation.
- [x] 5.2 Execute end-to-end flow testing (client login, ticket submission with prints, support status change, client verification).
- [x] 5.3 Run production build and linting checks (`npm run build`) to ensure type safety and build integrity.
- [x] 5.4 Commit all changes with a descriptive conventional commit message and push to the remote repository.
