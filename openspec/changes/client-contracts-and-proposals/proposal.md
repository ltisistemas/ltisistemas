## Why

A equipe de gestão e suporte da LTI Sistemas necessita de uma visão comercial e financeira 360° integrada ao cadastro de cada cliente. Além do atendimento a chamados técnicos e emissão de relatórios, o sistema passará a controlar contratos vigentes, valores mensais recorrentes (MRR, ex: R$ 480/mês na Aposchesf), fluxo de faturas/recebíveis mensais e propostas comerciais emitidas, com acesso estritamente restrito aos administradores e equipe com o perfil `SUPORTE`.

## What Changes

- **Extensão do Modelo de Dados (Prisma Schema)**:
  - Criação do modelo `ClientContract` para registrar contratos, número do contrato, título, valor mensal recorrente (`monthlyValue`), dia de vencimento (`billingDay`), vigência (`startDate`, `endDate`) e status (`ATIVO`, `SUSPENSO`, `CANCELADO`, `FINALIZADO`).
  - Criação do modelo `ClientReceivable` para controle de mensalidades e recebíveis avulsos (competência, valor, data de vencimento, data de pagamento, método de pagamento e status: `PENDENTE`, `PAGO`, `ATRASADO`, `CANCELADO`).
  - Criação do modelo `ClientProposal` para cadastro e acompanhamento de propostas comerciais (número da proposta, título, escopo/descrição, valor pontual, valor recorrente mensal, datas de envio/validade e status: `RASCUNHO`, `ENVIADA`, `EM_NEGOCIACAO`, `APROVADA`, `RECUSADA`, `EXPIRADA`).
- **Segurança & Controle de Acesso Restrito ao Suporte**:
  - Todas as queries e Server Actions comerciais barram sumariamente qualquer requisição originada de usuários com papel `CLIENTE` (`FORBIDDEN`).
  - Nenhuma informação financeira, contratual ou de proposta é exposta para o cliente nas telas ou APIs de autoatendimento.
- **Server Actions Comerciais (`lib/actions/commercial-actions.ts`)**:
  - Operações de criação, edição, listagem e exclusão de contratos por cliente.
  - Gerenciamento de recebíveis com atualização de baixa/pagamento em 1 clique e geração rápida de competências mensais.
  - Cadastro, atualização de status e histórico de propostas comerciais.
  - Consolidação de KPIs financeiros do cliente: MRR Ativo (R$/mês), total a receber, total recebido e propostas em aberto.
- **Interface de Usuário Comercial & Financeira no Suporte**:
  - Adição de visualização detalhada de gestão comercial por cliente em `/suporte/usuarios` (painel/modal Client 360° com abas: *Contratos & MRR*, *Recebíveis & Faturas*, *Propostas Comerciais* e *Chamados*).
  - Modais intuitivos para cadastro de novo contrato, registro de recebível e criação de proposta comercial.
  - Formatação monetária brasileira padrão (`R$ 480,00`) e badges semânticos de status com a paleta Bootstrap.

## Capabilities

### New Capabilities
- `client-commercial-management`: Gestão completa de contratos, recebíveis mensais, propostas comerciais e KPIs financeiros por cliente, exclusiva para o perfil `SUPORTE`.

### Modified Capabilities
<!-- Nenhuma especificação anterior teve seus requisitos fundamentais alterados. -->

## Impact

- **Banco de Dados**: Novas tabelas `client_contracts`, `client_receivables` e `client_proposals` no `prisma/schema.prisma`.
- **Server Actions**: Novo módulo `lib/actions/commercial-actions.ts`.
- **Componentes**: `components/suporte/ClientFinancialDetailsModal.tsx`, `components/suporte/CreateContractModal.tsx`, `components/suporte/CreateReceivableModal.tsx`, `components/suporte/CreateProposalModal.tsx`, e integração na tabela de usuários de `components/suporte/UsersClientView.tsx`.
- **Segurança**: Políticas de autorização rigorosas garantindo sigilo absoluto dos dados financeiros perante clientes.
