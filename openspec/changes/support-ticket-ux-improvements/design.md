## Context

O sistema de chamados da LTI Sistemas foi implementado em Next.js (App Router), Prisma e TailwindCSS. Atualmente, os chamados criados pelo suporte eram atribuídos apenas ao usuário autenticado, a listagem de chamados não oferecia filtro específico por cliente solicitante, e o portal utilizava um tema visual escuro herdado da landing page institucional, com links sutis de retorno e sem modal de confirmação pós-criação de chamado.

Para detalhes sobre a motivação, consulte [proposal.md](proposal.md) e as especificações em [specs/ticket-system/spec.md](specs/ticket-system/spec.md).

## Goals / Non-Goals

**Goals:**
- Permitir que o time de suporte escolha o cliente solicitante na abertura de chamados, associando o ticket ao `userId` do cliente selecionado no banco de dados.
- Apresentar um modal compacto pós-criação de chamado destacando o número do incidente com botão de cópia rápida para o clipboard e feedback visual imediato.
- Adicionar filtro por cliente (dropdown) na listagem de chamados para usuários com perfil `SUPORTE`.
- Otimizar a ergonomia de navegação: remover link "Voltar para o site" no cabeçalho e converter o link de retorno na tela de detalhes do chamado em um botão proeminente.
- Atualizar a identidade visual do portal de suporte (`/suporte/*`) para um layout limpo de fundo claro/branco (`bg-white` / `bg-gray-50`) com botões semânticos nas cores clássicas do Bootstrap (primary, success, danger, warning, info).
- Manter cobertura de testes >= 85% e testes unitários 100% aprovados.

**Non-Goals:**
- Não alterar as cores ou layout do site institucional público (landing page).
- Não alterar regras de autenticação ou enums no schema do banco de dados (as relações `userId` e tabelas existentes já suportam a associação).

## Decisions

### 1. Associação de Cliente no Server Action `createTicketAction`
- **Decisão:** Aceitar parâmetro opcional `targetUserId?: string` no `createTicketAction`.
- **Regra de Segurança:** Verificar a role do usuário na sessão. Se for `SUPORTE` e `targetUserId` estiver preenchido, validar a existência e status do cliente no Prisma e gravar `userId = targetUserId`. Se a role for `CLIENTE`, ignorar qualquer `targetUserId` enviado e forçar `userId = session.user.id`.
- **Alternativa Considerada:** Criar uma server action separada `createTicketForClientAction`. Descartado por duplicação desnecessária de lógica de validação de anexos e cálculo de SLA.

### 2. Modal de Sucesso Pós-Criação (`TicketSuccessModal`)
- **Decisão:** Criar um componente dedicado `TicketSuccessModal` disparado ao resolver a promise do `createTicketAction`. Ele exibe o número do incidente gerado (`#${ticketNumber}`) e um botão com `navigator.clipboard.writeText(...)` com estado temporário de "Copiado!".
- **Alternativa Considerada:** Apenas toast notification. Descartado porque a modal oferece confirmação visual explícita com o código do ticket para repasse imediato ao cliente via WhatsApp ou telefone.

### 3. Filtro por Cliente em `TicketsClientView`
- **Decisão:** Injetar a lista de clientes ativos via props do Server Component de chamados (`/suporte/chamados/page.tsx`) para o `TicketsClientView`. O suporte pode selecionar um cliente no dropdown, filtrando instantaneamente a visualização no client ou combinando com busca textual e status.
- **Alternativa Considerada:** Requisitar nova busca ao servidor a cada mudança de dropdown. Descartado para manter a performance e resposta instantânea do filtro cliente.

### 4. Design System Bootstrap em Fundo Branco (Portal de Suporte)
- **Decisão:** Refatorar classes CSS dos componentes em `/suporte/*` para fundo branco (`bg-white`, `border-gray-200`, `text-gray-900`) e paleta de botões Bootstrap:
  - Success (`#198754` / `hover:#157347`): Criar chamado, salvar, ações positivas.
  - Danger (`#dc3545` / `hover:#bb2d3b`): Excluir chamado, desativar cliente, soft-delete.
  - Warning (`#ffc107` / `text-gray-900` / `hover:#e0a800`): Redefinir senha, status pendente, SLA em alerta.
  - Info (`#0dcaf0` / `text-gray-900` / `hover:#31d2f2`): Detalhes do ticket, status aberto.
  - Primary (`#0d6efd` / `hover:#0b5ed7`): Ações principais, login, filtros.
  - Secondary/Light (`#f8f9fa`, `border-gray-300`): Botão de retorno e cancelamentos.

## Risks / Trade-offs

- **[Risco]** Erro ao copiar número do chamado em navegadores antigos ou sem permissão de clipboard.
  - **Mitigação:** Implementar fallback com seleção de texto ou bloco visual selecionável caso `navigator.clipboard` falhe.
- **[Risco]** Suporte com lista grande de clientes causando dropdown longo.
  - **Mitigação:** Ordenar alfabeticamente por nome e exibir razão social / empresa no formato `Nome (Empresa)`.
