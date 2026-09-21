## Why

LTI Sistemas provides enterprise software engineering and systems maintenance to diverse clients. Currently, there is no centralized, direct portal for clients to report incidents or request technical support. Implementing a lightweight, secure, and straightforward ticket system allows clients to easily submit incidents with descriptions and screenshot attachments, while enabling the LTI Sistemas support team to track, prioritize, and update ticket statuses in real time.

## What Changes

- **Authentication & Security**: Dedicated authentication system using Argon2id with server-side pepper for password hashing and secure session management.
- **Role-Based Access Control**: Two distinct roles (`SUPORTE` and `CLIENTE`). User provisioning is restricted to `SUPORTE` / administrators only.
- **Client Ticket Portal**: A streamlined client interface to view their incident history (status: `aberto`, `pendente`, `fechado`) and submit new support tickets with title, description, and up to 3 image attachments (base64 compressed/stored).
- **Support Management Interface**: An administrative interface for support staff to view all client tickets, inspect company/contract context, preview attached screenshots, and transition ticket statuses.
- **Site-Wide Navigation Integration**: Access links ("Área do Cliente" / "Suporte") placed in the top bar / navbar corner and footer of the main website.
- **Database & Data Layer**: Prisma ORM models and PostgreSQL schema migrations for `User`, `Ticket`, and `TicketAttachment`, utilizing the database credentials configured in `.env`.

## Capabilities

### New Capabilities
- `ticket-system`: Comprehensive client ticket opening, status tracking, image attachment handling, user authentication with Argon2id + pepper, and support incident administration.

### Modified Capabilities
- `landing-page`: Integration of support portal access links in the global navbar and footer.

## Impact

- **New Routes & Pages**:
  - `/suporte/login`: Secure sign-in page for clients and support engineers.
  - `/suporte/chamados`: Ticket overview and submission dashboard for clients, and full incident console for support.
  - `/suporte/chamados/[id]`: Detailed ticket inspection and status management view.
  - `/suporte/usuarios`: User creation and provisioning panel for support administrators.
  - API routes for auth, ticket CRUD, and status updates.
- **Dependencies**: Prisma client, `@prisma/client`, `prisma` (dev dependency), `argon2` or Web Crypto / standard hashing utilities with pepper, `lucide-react` for status icons.
- **Database**: PostgreSQL tables for users, tickets, and attachments via Prisma.
