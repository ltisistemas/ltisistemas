## 1. Backend & Agregação de Métricas

- [x] 1.1 Criar `lib/actions/report-actions.ts` com a função `getClientReportAction` e a função auxiliar `generateExecutiveCopy` para agregação de SLA, resolução, distribuição por origem e narrativa executiva, verificando funcionamento via script de teste
- [x] 1.2 Criar suite de testes unitários `lib/actions/report-actions.test.ts` cobrindo cálculos de SLA, períodos sem chamados e formatação de texto executivo

## 2. Interface de Usuário & Componentes de Apresentação

- [x] 2.1 Atualizar `components/suporte/SupportHeader.tsx` para incluir o item de navegação "Relatórios" (`/suporte/relatorios`) para perfis `SUPORTE` e `CLIENTE`
- [x] 2.2 Criar `components/suporte/ClientReportView.tsx` com seletores de período rápido ("Mês Vigente", "Mês Anterior", "Últimos 90 Dias", "Personalizado"), dropdown de cliente (para Suporte), cards de métricas em cores Bootstrap, barras de distribuição por origem e caixa de copy executivo com botão de copiar em 1 clique
- [x] 2.3 Criar a página `app/suporte/relatorios/page.tsx` protegida por autenticação, carregando a lista de clientes e o relatório do mês corrente

## 3. Estilização para Impressão, Testes e Validação

- [x] 3.1 Adicionar regras de CSS `@media print` para exportação limpa e profissional de PDF através da impressão nativa do navegador
- [x] 3.2 Executar a suite completa de testes automatizados (`npm test`) e o build de produção (`npm run build`) validando a ausência de erros de tipos ou rotas
