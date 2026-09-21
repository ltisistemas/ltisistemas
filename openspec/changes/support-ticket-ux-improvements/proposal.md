## Why

Aprimorar a experiência operacional do time de suporte e a navegação dos clientes no sistema de chamados da LTI Sistemas, permitindo que o suporte abra chamados em nome de clientes específicos, confirme o número do chamado imediatamente via modal de sucesso com cópia rápida, filtre a lista de chamados por cliente com facilidade, navegue de volta com botão proeminente e usufrua de uma interface visual limpa em fundo branco com a paleta de botões e ações no padrão Bootstrap (success, danger, info, warning, primary).

## What Changes

- **Abertura de Chamado com Associação de Cliente**:
  - Quando um usuário com perfil `SUPORTE` abre o modal de novo chamado, um campo de seleção (dropdown) permite indicar qual cliente é o solicitante do ticket.
  - O chamado é associado diretamente ao `userId` do cliente selecionado, permitindo que o cliente visualize o ticket ao efetuar login.
  - Para usuários com perfil `CLIENTE`, o chamado continua sendo associado automaticamente ao próprio usuário autenticado.
- **Modal de Confirmação e Sucesso com Cópia de Número**:
  - Ao criar o chamado com sucesso, exibir uma modal dedicada de confirmação destacando o número do chamado (e.g., `#1001` ou código do incidente) e um botão de ação rápida para copiar o número para a área de transferência.
- **Filtro de Chamados por Cliente**:
  - Na página de listagem de chamados (`/suporte/chamados`), incluir um dropdown de seleção de clientes para filtrar os chamados atribuídos a um cliente específico (visível para o suporte).
- **Ajustes de Navegação**:
  - Remover o link de retorno "Voltar para o site" no cabeçalho do portal de suporte.
  - Na tela de detalhes do chamado (`/suporte/chamados/[id]`), substituir o pequeno link textual de voltar por um botão estilizado e altamente visível.
- **Tema Visual e Design System do Sistema de Suporte**:
  - Transformar o layout e páginas do sistema de chamados (`/suporte/*`) para uma interface de fundo branco / clean (`bg-white` / `bg-gray-50`), mantendo o site institucional intacto.
  - Padronizar os botões e badges de ação nas cores do Bootstrap:
    - Primary: `#0d6efd` (Ações principais e filtros)
    - Success: `#198754` (Criar chamado, confirmações, botões de cópia bem-sucedida)
    - Danger: `#dc3545` (Exclusão lógica, cancelamentos, encerramentos)
    - Warning: `#ffc107` / `#d39e00` (Status pendente, redefinição de senha, alertas de SLA)
    - Info: `#0dcaf0` (Status aberto, visualização de detalhes, tags informativas)

## Capabilities

### New Capabilities
- `ticket-system`: Melhorias na experiência de uso do suporte (abertura de chamado em nome do cliente, modal de sucesso com cópia do número do incidente, filtro por cliente na listagem, botão de retorno em destaque, remoção de links desnecessários e tema em fundo branco com botões estilo Bootstrap).

## Impact

- **Server Actions & APIs**:
  - `createTicketAction`: aceitar opcionalmente `targetUserId` quando executado por usuário com role `SUPORTE` (validando se o usuário de destino existe e não está deletado).
  - `getTicketsAction`: aceitar opcionalmente o parâmetro de filtro `clientId?: string` para filtrar por usuário solicitante.
- **Componentes de UI**:
  - `SupportHeader`: remoção do link "Voltar para o site".
  - `CreateTicketModal`: inclusão de dropdown de seleção de clientes quando o usuário for suporte; disparo do modal de sucesso pós-criação.
  - `TicketSuccessModal`: novo componente modal compacto exibindo número do chamado e botão para copiar código.
  - `TicketsClientView`: inclusão do filtro por cliente e estilização limpa em fundo branco com botões Bootstrap.
  - `TicketDetailClientView`: substituição do link de retorno por um botão destacado e aplicação do tema visual.
  - `UsersClientView`: padronização com tema em fundo branco e botões Bootstrap.
  - `SupportLayout`: transição para tema de fundo claro / branco.
- **Testes Automatizados**:
  - Atualização e expansão de testes unitários e de componentes para validar novas ações, filtros, modais e comportamentos visuais mantendo cobertura elevada.
