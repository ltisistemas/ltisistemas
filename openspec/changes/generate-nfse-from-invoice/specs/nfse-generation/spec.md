## Purpose

Provides end-to-end municipal electronic service invoice (NFS-e) generation, digital signing, national API transmission, status querying, cancellation, replacement, and DANFSE export directly from billed client receivables.

## ADDED Requirements

### Requirement: Invoice to NFS-e Emission Trigger
The system SHALL allow authorized support operators to trigger electronic service invoice (NFS-e) generation directly from any existing client receivable (fatura/mensalidade).

#### Scenario: Successful emission trigger from receivable
- **WHEN** an authorized support user clicks "Gerar NFS-e" on an active or paid client receivable
- **THEN** the system opens the NFS-e emission review dialog pre-populated with client company data, CNPJ/CPF, contract service description, base value, and municipal tax configuration

#### Scenario: Prevention of duplicate emission
- **WHEN** a user attempts to generate an NFS-e for a receivable that already possesses an authorized or processing NFS-e
- **THEN** the system SHALL display the existing NFS-e details and prevent duplicate transmission

---

### Requirement: DPS Construction and Fiscal Validation
The system SHALL construct a standardized DPS (Declaração de Prestação de Serviços) conforming to the National NFS-e standard and validate all mandatory fiscal fields before transmission.

#### Scenario: Valid fiscal data validation
- **WHEN** a DPS is built for emission
- **THEN** the system validates prestador CNPJ, municipal inscription, tomador document (valid CPF/CNPJ), LC 116/03 service item code, municipal tax rate (alíquota between 2.00% and 5.00%), execution date, and calculated ISSQN value before sending

#### Scenario: Rejection of invalid fiscal parameters
- **WHEN** the tomador document is malformed or the service code/aliquot is missing
- **THEN** the system SHALL return explicit validation error messages and halt DPS transmission without sending invalid requests to the tax authority

---

### Requirement: Digital Certificate A1 Signing and National API Transmission
The system SHALL sign the generated DPS XML with the provider's valid A1 Digital Certificate (PKCS#12) and transmit the secure payload to the National NFS-e Environment (Produção Restrita or Produção).

#### Scenario: Successful transmission in restricted production
- **WHEN** a valid DPS is transmitted to the configured National NFS-e API endpoint
- **THEN** the system establishes a mutual TLS/HTTPS connection, submits the signed payload, receives the authorization response with `chaveNFSe` and `numeroNFSe`, and registers the authorized invoice in the database

#### Scenario: API connectivity or rejection handling
- **WHEN** the National NFS-e API rejects the DPS or returns a temporary communication error
- **THEN** the system captures the rejection code, registers an error event in the audit trail, updates the status to `REJEITADA` or `ERRO_TRANSMISSAO`, and displays actionable feedback to the operator

---

### Requirement: Real-time Consultation and Status Polling
The system SHALL allow querying the authoritative state of any DPS or NFS-e by DPS ID or NFS-e Access Key (Chave de Acesso).

#### Scenario: Querying NFS-e status
- **WHEN** an operator requests a status update or opens the NFS-e details modal
- **THEN** the system queries the local database and synchronizes with the National NFS-e registry if needed, displaying status, protocol number, issue timestamp, and tax breakdowns

---

### Requirement: NFS-e Cancellation
The system SHALL allow canceling an authorized NFS-e within permitted legal conditions and municipal rules.

#### Scenario: Authorized cancellation request
- **WHEN** an operator submits a cancellation request with a valid cancellation justification and cancellation code
- **THEN** the system sends the cancellation event to the National NFS-e API, records the cancellation protocol, updates the invoice status to `CANCELADA`, and logs the action in the audit history

---

### Requirement: NFS-e Replacement (Substituição)
The system SHALL allow issuing a replacement NFS-e linked directly to the previously authorized invoice.

#### Scenario: Issuing a replacement NFS-e
- **WHEN** an operator initiates a substitution with corrected values or updated client parameters
- **THEN** the system builds a new DPS referencing the original NFS-e key, transmits the replacement event to the National NFS-e API, links both invoices, and updates the original invoice status to `SUBSTITUIDA`

---

### Requirement: DANFSE Document Visualization and XML Export
The system SHALL generate visual DANFSE (Documento Auxiliar da NFS-e) views and provide one-click XML downloads conforming to standard Brazilian fiscal documentation.

#### Scenario: Viewing DANFSE and downloading XML
- **WHEN** an operator or client requests the visual invoice or raw XML
- **THEN** the system displays the formatted DANFSE with QR code / verification URL, issuer/receiver blocks, tax breakdown, and enables downloading both the certified XML file and printable PDF
