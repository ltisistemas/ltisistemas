## Context

Atualmente o sistema de chamados conta com tabelas `User`, `Ticket` e `TicketAttachment`, autenticação baseada em JWT e Argon2id, e gerenciamento de chamados via Server Actions com SQLite. Para dar mais agilidade e precisão ao atendimento de suporte técnico, é necessário registrar o endereço do sistema do cliente, o nome exato da tela onde ocorreu o problema, monitorar o SLA de 6 horas para análise inicial e assegurar retenção histórica com soft-delete global.

## Goals / Non-Goals

**Goals:**
- Estender o modelo do Prisma com os campos:
  - `User`: `systemUrl` (String?), `status` (String/Enum: `ATIVO` | `INATIVO`, padrão `ATIVO`), `deletedAt` (DateTime?).
  - `Ticket`: `screenName` (String), `slaDueAt` (DateTime), `deletedAt` (DateTime?).
- Atualizar `loginAction` para rejeitar credenciais de clientes com status `INATIVO` ou `deletedAt != null`.
- Atualizar `createTicketAction` para registrar `screenName` e calcular `slaDueAt` como `createdAt + 6 horas`.
- Implementar soft-delete em `ticket-actions.ts` (`deleteTicketAction`) e `auth-actions.ts` (`deleteUserAction` e `toggleUserStatusAction`), filtrando `deletedAt: null` em todas as consultas de listagem e detalhe.
- Criar componente visual e utilitário de SLA para exibir badge intuitiva (dentro do prazo, prazo crítico, estourado ou atendido) nos cards e detalhes de chamados.
- Atualizar formulários e modais (`CreateTicketModal`, `CreateUserModal`, `UsersClientView`, `TicketsClientView`, `TicketDetailClientView`).
- Manter cobertura de testes automatizados >= 85%.

**Non-Goals:**
- Implementação de disparadores de e-mail/SMS para SLA estourado (o monitoramento e badges visuais ocorrem no painel do suporte/cliente).
- Configuração de múltiplos tiers de SLA dinâmicos por plano (fixo em 6 horas para primeira análise).

## Decisions

### 1. Modelagem de Dados e Soft-Delete no Prisma
- **Decisão**: Adicionar campos opcionais/retrocompatíveis `deletedAt: DateTime?` nas tabelas `User` e `Ticket`.
- **Alternativas consideradas**:
  - *Hard-delete com cascading*: Rejeitado por violar a exigência de histórico e integridade referencial de chamados já encerrados.
  - *Middleware/Extension global do Prisma*: Rejeitado para evitar complexidade e incompatibilidade com mocks de testes unitários isolados; o filtro `{ deletedAt: null }` será aplicado explicitamente nas Server Actions.

### 2. Status do Cliente e Endereço do Sistema
- **Decisão**: Adicionar `systemUrl` (ex: `https://app.cliente.com.br` ou `ERP Local`) e `status` (`ATIVO` | `INATIVO`) ao modelo `User`.
- **Alternativas consideradas**:
  - *Tabela separada de Sistemas/Clientes*: Excessivamente complexo para a proposta de sistema simples e direto; manter diretamente no perfil do usuário `CLIENTE` atende com máxima performance e simplicidade.

### 3. Identificação de Tela e Cálculo de SLA de 6 Horas
- **Decisão**: Tornar o campo `screenName` obrigatório no formulário de chamado e gravar `slaDueAt = new Date(Date.now() + 6 * 3600 * 1000)`.
- **Alternativas consideradas**:
  - *Calcular SLA dinamicamente apenas na renderização*: Rejeitado pois persistir `slaDueAt` permite queries indexadas no banco para ordenar chamados por urgência e prazo de vencimento.

### 4. Componente Visual de SLA
- **Decisão**: Criar o utilitário `formatSlaStatus(slaDueAt, ticketStatus)` e componente visual `SlaBadge` indicando:
  - 🟢 **No Prazo**: Mais de 2 horas restantes
  - 🟡 **Atenção**: Menos de 2 horas restantes
  - 🔴 **Vencido**: Prazo de 6h expirado sem análise/resolução
  - ⚪ **Concluído**: Chamado finalizado/fechado

## Risks / Trade-offs

- **[Risco] Mocks existentes de testes quebrarem por novos campos obrigatórios**:
  - *Mitigação*: Atualizar as fixtures dos testes unitários e de componentes para incluir `screenName`, `systemUrl`, `status`, `slaDueAt` e `deletedAt`.
- **[Risco] Fusos horários e discrepâncias de relógio**:
  - *Mitigação*: Persistir todos os timestamps em UTC (ISO-8601 padrão do Prisma) e calcular o tempo restante relativo no cliente.
