## 1. Backend & Server Actions

- [x] 1.1 Atualizar `createTicketAction` em `lib/actions/ticket-actions.ts` para aceitar `targetUserId` opcional quando o usuário autenticado possuir perfil `SUPORTE`, validando a existência do cliente e gravando `userId = targetUserId`, e verificar com testes unitários.
- [x] 1.2 Atualizar `getTicketsAction` em `lib/actions/ticket-actions.ts` para suportar filtro opcional por cliente (`clientId`) para usuários de suporte e verificar com testes unitários.

## 2. Modais e Fluxo de Criação de Chamados

- [x] 2.1 Criar o componente `TicketSuccessModal` exibindo o número do chamado gerado (`#${ticketNumber}`) e botão de cópia para o clipboard com feedback visual ("Copiado!"), e verificar com testes de renderização e interação.
- [x] 2.2 Atualizar o componente `CreateTicketModal` para renderizar o dropdown de seleção de cliente quando o operador for `SUPORTE`, enviar `targetUserId` e disparar o `TicketSuccessModal` pós-sucesso, e verificar com testes automatizados.

## 3. Listagem e Navegação do Portal

- [x] 3.1 Atualizar `SupportHeader` removendo o link "Voltar para o site" e verificar com testes de componente.
- [x] 3.2 Atualizar `TicketsClientView` e a página `/suporte/chamados/page.tsx` para incluir o dropdown de filtro por cliente com opção "Todos os Clientes", e verificar com testes automatizados.
- [x] 3.3 Atualizar `TicketDetailClientView` substituindo o link discreto de retorno por um botão estilizado e altamente visível de volta para a listagem, e verificar com testes.

## 4. Tema Visual e Cores Bootstrap

- [x] 4.1 Atualizar o layout do portal de suporte e componentes (`SupportHeader`, `TicketsClientView`, `TicketDetailClientView`, `UsersClientView`, `CreateUserModal`, `ResetPasswordModal`) para fundo branco/claro (`bg-white` / `bg-gray-50`) com botões semânticos nas cores clássicas do Bootstrap (primary, success, danger, warning, info), mantendo o site institucional inalterado.
- [x] 4.2 Revisar o design visual e micro-interações do portal com base no Impeccable, garantindo contraste, tipografia e espaçamentos consistentes.

## 5. Verificação, Build e Entrega

- [x] 5.1 Executar a suíte de testes completa (`npm run test`) e o build de produção (`npm run build`), garantindo 100% dos testes aprovados e cobertura >= 85%.
- [x] 5.2 Realizar o commit e push das alterações no Git.
