## Context

The application runs Next.js (App Router) with TypeScript, Prisma ORM, and PostgreSQL. The commercial module currently manages contracts (`ClientContract`) and receivables (`ClientReceivable`), but lacks electronic tax invoice (NFS-e) generation.

According to Brazilian National NFS-e standards (Padrão Nacional NFS-e / Gov.br) and LC 116/03 / LC 214/2025:
- Each service invoice requires a structured DPS (Declaração de Prestação de Serviços) in standard XML/JSON.
- Payloads are signed using an ICP-Brasil A1 digital certificate (`.pfx` / `.p12`).
- Communication with the National NFS-e API occurs via mutual TLS (mTLS) or authenticated REST endpoints (Homologação / Produção Restrita & Produção).

## Goals / Non-Goals

**Goals:**
- Provide a full-cycle NFS-e engine: DPS building, tax calculations (ISSQN, retention, deductions), XML generation, digital signing, and Gov.br National NFS-e API communication.
- Enable direct emission from any `ClientReceivable` in the Support Hub (`ClientHub360View` & `ClientCommercialModal`).
- Support complete invoice lifecycle: Issue (`emitir`), Consult (`consultar`), Cancel (`cancelar`), Replace (`substituir`), DANFSE preview, and XML download.
- Provide a robust Simulator/Mock mode for local development, CI/CD, and testing environments where live municipal A1 certs are not yet provisioned.
- Persist structured records (`NfseInvoice`, `NfseConfig`, `NfseEvent`) with full audit history and validation.

**Non-Goals:**
- Legacy proprietary pre-national municipal SOAP connectors (the system standardizes on the unified National NFS-e ADN / Gov.br standard).
- Smartcard/Token A3 hardware certificate drivers (only A1 software certificates in PKCS#12 format are supported).

## Decisions

### 1. Engine Architecture in `lib/services/nfse/`
We organize the fiscal logic into decoupled modules:
- `dps-builder.ts`: Generates compliant DPS data structures from `ClientReceivable`, `User`, and company configuration.
- `tax-calculator.ts`: Computes ISSQN bases, municipal aliquots (2.00% to 5.00%), retention flags, and net/gross invoice values.
- `nfse-signer.ts`: Handles PKCS#12 A1 certificate parsing, RSA-SHA256 XML digital signatures (Enveloped Signature), and digest computations.
- `nfse-client.ts`: Manages HTTPS/mTLS connections to the Gov.br National API (Produção Restrita vs Produção), error decoding, and automatic retries.
- `danfse-generator.ts`: Produces standard DANFSE printable layout with verification QR codes, barcode numbers, and service descriptions.

*Rationale:* High testability without network dependencies, clean separation between business logic, cryptography, and HTTP transport.

### 2. Data Model Extensions in Prisma
Add three central models:
1. `NfseConfig`: Stores company fiscal identity (CNPJ, Inscrição Municipal, CNAE, default LC 116 item, municipal tax rate, environment, certificate payload/reference).
2. `NfseInvoice`: Stores generated invoice records linked to `ClientReceivable` and `User` (status: `PENDENTE`, `PROCESSANDO`, `AUTORIZADA`, `REJEITADA`, `CANCELADA`, `SUBSTITUIDA`, `chaveNFSe`, `numeroNFSe`, `xmlEnviado`, `xmlRetorno`, `danfseUrl`, `motivoCancelamento`).
3. `NfseEvent`: Audit log of each lifecycle event (emission, transmission attempt, webhook/query result, cancellation, substitution).

*Rationale:* Provides 1-to-N relation with `ClientReceivable` allowing replacement/cancellation chains and complete traceability.

### 3. Dual-Mode API Client (Live Gov.br & Integrated Simulator)
Implement a configurable adapter:
- When `NFSE_ENVIRONMENT=sandbox_simulator`, requests are processed locally with realistic protocol/key generation and validation rules.
- When `NFSE_ENVIRONMENT=producao_restrita` or `producao`, requests use authenticated SSL agent with A1 certificate to contact `https://api.producaorestrita.nfse.gov.br` or `https://api.nfse.gov.br`.

*Rationale:* Enables automated tests and development without blocking on municipal registry validation.

### 4. DANFSE Visualization & Export
Implement DANFSE rendering via standard responsive, print-optimized HTML/CSS view with print-to-PDF support, matching the official Gov.br visual layout.

## Risks / Trade-offs

- **[Risk] Municipal rules and tax rates vary across municipalities** → *Mitigation:* `NfseConfig` allows per-tenant / municipal override of aliquots, LC 116 codes, and retention requirements.
- **[Risk] Certificate expiry or encryption errors** → *Mitigation:* Pre-flight certificate validator checks expiration dates, certificate chain validity, and passphrase correctness before transmission.
- **[Risk] Gov.br API downtime or asynchronous batch latency** → *Mitigation:* Status tracking with `PROCESSANDO` state, structured event logging in `NfseEvent`, and manual "Consultar Status" action.
- **[Risk] Security of A1 certificate and private keys** → *Mitigation:* Passphrase stored in server environment variables or encrypted secrets store, never exposed to client-side code.
