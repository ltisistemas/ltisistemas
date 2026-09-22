## Why

Currently, LTI Sistemas manages contracts, proposals, and receivables (faturas/mensalidades) within the Support & Commercial Hub, but lacks native municipal electronic service invoice (NFS-e) generation connected to the National NFS-e System (Padrão Nacional NFS-e / GOV.BR). In accordance with municipal fiscal requirements (LC 116/03 and LC 214/2025), administrative and support operators need to generate, transmit, query, cancel, and export compliant NFS-e documents directly from billed client receivables.

## What Changes

- **Invoice-to-NFS-e Emission Workflow**: Add seamless "Gerar NFS-e" action on client receivables (`ClientReceivable`) in both the 360 Client Hub and Commercial Modal.
- **National NFS-e Engine (DPS & Transmission)**: Implement DPS (Declaração de Prestação de Serviços) construction conforming to the National NFS-e XML/JSON schema, Digital Certificate A1 (PKCS#12 `.pfx`/`.p12`) signing, and integration with the Gov.br National NFS-e REST/SOAP API endpoints (Produção Restrita & Produção).
- **Fiscal Database Models**: Extend Prisma schema with `NfseInvoice`, `NfseConfig` (prestador municipal settings, IBGE codes, environment, certificate storage/config), and `NfseEvent` (audit trail of transmissions, queries, cancellations, replacements).
- **Fiscal Calculations & Validation**: Automated calculation of ISSQN, base values, municipal aliquots (2% to 5%), tax withholdings (PIS/COFINS/CSLL/IRRF/INSS), service code mapping (LC 116/03 items), and pre-submission validation of CPF/CNPJ, municipal registrations, and dates.
- **NFS-e Lifecycle Operations**: Server actions and endpoints for emission, real-time consultation by DPS/NFS-e key, cancellation (within authorized legal windows), replacement (substituição), DANFSE generation (PDF visualization), and XML export.
- **Rich UI & Support View**: Emission confirmation dialog with live tax preview, real-time status badges (`EMITINDO`, `AUTORIZADA`, `REJEITADA`, `CANCELADA`, `SUBSTITUIDA`), DANFSE viewer, and error/rejection diagnostics.

## Capabilities

### New Capabilities
- `nfse-generation`: Complete capability for generating, signing, transmitting, querying, canceling, and managing Brazilian National NFS-e (Nota Fiscal de Serviços Eletrônica) documents linked to client invoices/receivables.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: Add `NfseInvoice`, `NfseConfig`, and `NfseEvent` models to `prisma/schema.prisma` with relations to `User` and `ClientReceivable`.
- **Backend & Services**: Create `lib/services/nfse/` modular architecture (`dps-builder.ts`, `tax-calculator.ts`, `nfse-signer.ts`, `nfse-client.ts`, `danfse-generator.ts`).
- **Server Actions**: Create `lib/actions/nfse-actions.ts` exposing authenticated mutations for support staff.
- **API Endpoints**: Provide `/api/nfse/emitir`, `/api/nfse/consultar/[chave]`, `/api/nfse/cancelar`, `/api/nfse/danfse/[id]`.
- **UI Components**: Add `NfseEmissionModal.tsx`, `NfseViewerModal.tsx`, `NfseStatusBadge.tsx` and integrate into `ClientHub360View.tsx` and `ClientCommercialModal.tsx`.
- **Dependencies**: Add cryptographic / XML / PDF utilities (e.g. `fast-xml-parser`, `node-forge`, `xml-crypto`, `pdfkit` / `@react-pdf/renderer` or HTML-to-DANFSE).
