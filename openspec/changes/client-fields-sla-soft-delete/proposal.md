## Why

Para otimizar o atendimento de suporte técnico aos clientes que utilizam diferentes sistemas e sites da LTI Sistemas, é fundamental que cada chamado traga o contexto imediato da ocorrência (como o nome da tela afetada e o endereço/URL do sistema do cliente), conte com um compromisso claro de tempo de resposta inicial (SLA de 6 horas para análise), permita controlar o ciclo de vida do cliente (status ATIVO ou INATIVO), e adote soft-delete em todos os registros para preservar o histórico e a integridade dos dados para auditoria.

## What Changes

- **Cadastro de Usuário / Cliente**:
  - Adicionado campo `systemUrl` (endereço/URL do site ou sistema do cliente).
  - Adicionado campo `status` do cliente (`ATIVO` ou `INATIVO`, padrão: `ATIVO`). Clientes inativos ou marcados como deletados são impedidos de realizar login.
  - Adicionado suporte a soft-delete através do campo `deletedAt: DateTime?`.
- **Abertura e Detalhes do Chamado**:
  - Adicionado campo `screenName` (Nome da tela onde ocorreu o problema, e.g., "Tela de associados", "Cadastro de produtos", "Fluxo de checkout").
  - Adicionado cálculo automático e indicador visual de SLA de 6 horas para análise (`slaDueAt`), exibindo contagem regressiva e alertas de vencimento no painel do suporte e do cliente.
  - Adicionado suporte a soft-delete em chamados (`deletedAt: DateTime?`).
- **Soft-Delete Global**:
  - Todas as consultas normais (listagens de usuários e chamados) passam a filtrar apenas registros onde `deletedAt` é nulo.
  - Exclusão de chamados e desativação de usuários operam via soft-delete (`deletedAt = now()`), garantindo rastreabilidade sem perda física de dados.
- **Interface e Modais**:
  - Atualização do `CreateUserModal` e `UsersClientView` com os campos `systemUrl` e `status` (ATIVO/INATIVO), além de botão de exclusão lógica (soft-delete).
  - Atualização do `CreateTicketModal` com o campo `screenName` e aviso explicativo do SLA de 6 horas.
  - Atualização do `TicketsClientView` e `TicketDetailClientView` para exibir `screenName`, endereço do sistema e badge/contador de SLA de 6h.

## Capabilities

### New Capabilities
- `ticket-system`: Extensões do sistema de chamados e clientes com campos de sistema, nome de tela, cálculo e badges de SLA de 6 horas, status de cliente (ATIVO/INATIVO) e soft-delete global.

## Impact

- **Database / Schema (Prisma)**: Atualização das tabelas `User` e `Ticket` para incluir `systemUrl`, `status`, `screenName`, `slaDueAt` e `deletedAt`.
- **Server Actions**: Atualização de `auth-actions.ts` (`createUserAction`, `loginAction`, `deleteUserAction`) e `ticket-actions.ts` (`createTicketAction`, `getTicketsAction`, `getTicketByIdAction`, `deleteTicketAction`).
- **UI Components**: Atualização dos formulários, modais, tabelas e visualizadores de detalhes no portal de suporte.
- **Testes Automatizados**: Atualização e expansão dos testes unitários e de componentes para validar os novos fluxos mantendo cobertura >= 85%.
