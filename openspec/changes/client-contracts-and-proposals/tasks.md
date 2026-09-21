## 1. Modelo de Dados & Migração Prisma

- [x] 1.1 Atualizar `prisma/schema.prisma` com os modelos `ClientContract`, `ClientReceivable`, `ClientProposal` e enums (`ContractStatus`, `ReceivableStatus`, `PaymentMethod`, `ProposalStatus`), gerando o Prisma Client com `npx prisma generate`
- [x] 1.2 Executar sincronização do banco de dados com `npx prisma db push` e verificar integridade das relações com `User`

## 2. Server Actions & Regras Comerciais

- [x] 2.1 Criar `lib/actions/commercial-actions.ts` com funções para visão geral comercial do cliente (`getClientCommercialOverviewAction`), CRUD de contratos com cálculo de MRR, gerenciamento de recebíveis (baixa em 1 clique e geração mensal) e esteira de propostas comerciais com proteção estrita para perfil `SUPORTE`
- [x] 2.2 Criar suite de testes unitários `tests/unit/actions/commercial-actions.test.ts` cobrindo bloqueio de segurança para perfil `CLIENTE`, cálculo de MRR (ex: Aposchesf R$ 480/mês), baixas de faturas e transição de propostas

## 3. Componentes e Interface Client 360° no Suporte

- [x] 3.1 Criar os modais auxiliares com máscara monetária e validação: `components/suporte/CreateContractModal.tsx`, `components/suporte/CreateReceivableModal.tsx` e `components/suporte/CreateProposalModal.tsx`
- [x] 3.2 Criar `components/suporte/ClientCommercialModal.tsx` com visão 360° do cliente (cards de MRR Ativo, Total Recebido, Faturas Abertas/Atrasadas e abas de Contratos, Recebíveis e Propostas Comerciais)
- [x] 3.3 Atualizar `components/suporte/UsersClientView.tsx` com card de MRR Total da Carteira no topo, badges de valor mensal por cliente na tabela e botão de acesso à Gestão Comercial

## 4. Testes Automatizados e Validação

- [x] 4.1 Criar testes de interface em `tests/components/ClientCommercialModal.test.tsx` e atualizar `tests/components/UsersClientView.test.tsx`
- [x] 4.2 Executar suite completa de testes (`npm test`) e o build de produção (`npm run build`) garantindo integridade e conformidade de tipos
