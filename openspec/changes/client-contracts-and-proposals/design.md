## Context

O sistema já possui controle de usuários e clientes no modelo `User` do Prisma com perfis `SUPORTE` e `CLIENTE`, além de suporte a chamados e telemetria. Veja `proposal.md` para motivação.

Esta alteração introduz o módulo financeiro e comercial integrado ao cadastro de clientes, fornecendo à equipe de suporte e aos diretores da LTI Sistemas uma visão executiva e operacional do MRR (Monthly Recurring Revenue), faturas/recebíveis e propostas comerciais.

## Goals / Non-Goals

**Goals:**
- Prover modelagem relacional no banco de dados para Contratos (`ClientContract`), Recebíveis/Mensalidades (`ClientReceivable`) e Propostas Comerciais (`ClientProposal`).
- Implementar autorização estrita: qualquer chamada por usuário com papel `CLIENTE` é bloqueada no backend (`FORBIDDEN`).
- Disponibilizar na listagem de usuários (`/suporte/usuarios`) a métrica de MRR por cliente e o total recorrente da carteira da LTI Sistemas.
- Criar a modal/painel interativo Client 360° com abas para gerenciamento rápido de contratos, faturas com baixa em 1 clique e propostas comerciais.
- Prover gerador automático de faturas/recebíveis com base nos contratos ativos e dia de vencimento.

**Non-Goals:**
- Integração direta com gateways de pagamento de terceiros (Stripe/Asaas/Iugu) via Webhook bancário nesta etapa (o objetivo é o controle financeiro, faturamento mensal e esteira comercial da LTI Sistemas).
- Exposição de dados de faturamento para o perfil `CLIENTE` no portal (visão 100% restrita ao `SUPORTE`).

## Decisions

### 1. Modelagem Relacional no Prisma
- **Decisão:** Criar três novas entidades vinculadas ao `User` (`userId`):
  - `ClientContract`: armazena `contractNumber`, `title`, `monthlyValue` (Float), `billingDay` (Int 1-31), `startDate`, `endDate`, `status` (`ATIVO`, `SUSPENSO`, `CANCELADO`, `FINALIZADO`), `notes`.
  - `ClientReceivable`: armazena `contractId` (opcional), `userId`, `description`, `competence` (string YYYY-MM), `amount` (Float), `dueDate`, `paidDate`, `paymentMethod` (`PIX`, `BOLETO`, `TRANSFERENCIA`, `CARTAO`, `OUTRO`), `status` (`PENDENTE`, `PAGO`, `ATRASADO`, `CANCELADO`), `notes`.
  - `ClientProposal`: armazena `userId`, `proposalNumber`, `title`, `scopeDescription` (Text), `oneOffValue` (Float), `monthlyValue` (Float), `sentDate`, `validUntil`, `status` (`RASCUNHO`, `ENVIADA`, `EM_NEGOCIACAO`, `APROVADA`, `RECUSADA`, `EXPIRADA`), `documentUrl`, `notes`.
- **Justificativa:** Permite relacionar faturas a contratos específicos ou criar cobranças avulsas de projetos sob demanda, mantendo histórico financeiro completo.

### 2. Camada de Segurança e Server Actions Dedicadas
- **Decisão:** Concentrar todas as mutações e leituras em `lib/actions/commercial-actions.ts`, validando `requireSession()` com checagem obrigatória de `session.role === "SUPORTE"`.
- **Justificativa:** Garante barreira de segurança impenetrável no servidor, impedindo vazamento de números comerciais e dados financeiros.

### 3. Painel Client 360° e KPIs da Carteira
- **Decisão:** Integrar o modal/drawer `ClientCommercialModal.tsx` acionado diretamente pela tabela de clientes em `UsersClientView.tsx`, além de exibir no topo da tela de Usuários o card de **MRR Total da Carteira** (soma dos contratos ativos de todos os clientes, ex: Aposchesf R$ 480/mês + demais clientes).
- **Justificativa:** Não fragmenta a experiência do suporte em múltiplas telas isoladas; o suporte visualiza o cliente, seu MRR e seus chamados em um único lugar.

## Risks / Trade-offs

- **[Compatibilidade com SQLite / PostgreSQL em migração]** → Usar tipos padrão do Prisma (`Float`, `String`, `DateTime`, `Int`) suportados tanto em dev local quanto em produção PostgreSQL.
- **[Atraso de Recebíveis]** → A Server Action calcula dinamicamente se um recebível pendente está com `dueDate < now()`, marcando visualmente como Atrasado em Vermelho (`#dc3545`) sem necessidade de cron jobs complexos.
