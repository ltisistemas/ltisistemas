## 1. Database & Domain Models

- [x] 1.1 Extend `prisma/schema.prisma` with `NfseInvoice`, `NfseConfig`, `NfseEvent`, and relationships to `ClientReceivable` and `User`. Verify by running `npx prisma validate`.
- [x] 1.2 Define TypeScript domain models, DPS data contracts, validation schemas, and enum types in `lib/services/nfse/types.ts`. Verify typecheck passes with `npx tsc --noEmit`.

## 2. Core Fiscal Engine (`lib/services/nfse/`)

- [x] 2.1 Implement `tax-calculator.ts` with ISSQN calculations, municipal aliquots (2%-5%), tax withholdings (PIS/COFINS/INSS/IRRF), and LC 116/03 item mappings. Verify with unit tests in `tests/nfse/tax-calculator.test.ts`.
- [x] 2.2 Implement `dps-builder.ts` to build standardized National NFS-e DPS payloads from client receivables and validate required fiscal fields. Verify with unit tests in `tests/nfse/dps-builder.test.ts`.
- [x] 2.3 Implement `nfse-signer.ts` to parse A1 Digital Certificates (.pfx/.p12), validate validity dates, and compute RSA-SHA256 XML signatures. Verify with unit tests in `tests/nfse/nfse-signer.test.ts`.
- [x] 2.4 Implement `nfse-client.ts` with support for Gov.br National NFS-e endpoints (Produção Restrita / Produção) and sandbox simulator mode with retries and structured error logging. Verify with unit tests in `tests/nfse/nfse-client.test.ts`.
- [x] 2.5 Implement `danfse-generator.ts` to generate official DANFSE printable layout, QR codes, and XML export strings. Verify with unit tests in `tests/nfse/danfse-generator.test.ts`.

## 3. Server Actions & API Endpoints

- [x] 3.1 Implement server actions in `lib/actions/nfse-actions.ts` (`emitNfseAction`, `getNfseByReceivableAction`, `consultNfseStatusAction`, `cancelNfseAction`, `replaceNfseAction`, `saveNfseConfigAction`). Verify with integration tests in `tests/nfse/nfse-actions.test.ts`.
- [x] 3.2 Implement API routes `/api/nfse/emitir`, `/api/nfse/consultar/[chave]`, `/api/nfse/cancelar`, and `/api/nfse/danfse/[id]`. Verify with endpoint integration tests.

## 4. User Interface & Integration

- [x] 4.1 Create `NfseStatusBadge.tsx`, `NfseEmissionModal.tsx`, `NfseDetailsModal.tsx`, and `DanfseViewerModal.tsx` in `components/suporte/`. Verify UI component rendering and modal transitions.
- [x] 4.2 Integrate NFS-e generation trigger, status badges, and DANFSE action buttons into `ClientHub360View.tsx` under the Recebíveis table. Verify visual appearance and interaction in browser.
- [x] 4.3 Integrate NFS-e action buttons into `ClientCommercialModal.tsx` for seamless invoice emission directly from client commercial modals. Verify modal flow in browser.

## 5. End-to-End Verification & Validation

- [x] 5.1 Run all unit, integration, and E2E test suites with `npm test`. Verify 100% test passing rate across all NFS-e modules.
- [x] 5.2 Validate OpenSpec artifacts and completeness with `openspec validate`. Verify all requirements and tasks are ready for apply.
