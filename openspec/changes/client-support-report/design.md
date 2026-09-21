## Context

O portal de suporte da LTI Sistemas já possui autenticação baseada em sessão JWT com perfis `SUPORTE` e `CLIENTE`, além de gestão de chamados com telemetria automática e deduplicação de ocorrências. Veja `proposal.md` para motivação.

Para atender à necessidade de prestação de contas mensal com clientes e diretores de TI, este design introduz uma camada analítica de relatórios com geração de copy executivo e exportação para envio rápido (e-mail/WhatsApp/PDF).

## Goals / Non-Goals

**Goals:**
- Prover visualização executiva consolidada por cliente e por período (mensal e customizado).
- Calcular métricas de saúde: SLA cumprido (%), taxa de resolução, ocorrências de telemetria e divisão por camadas (`FRONT`, `BACK`, `INFRA`, etc.).
- Gerar copywriting executivo formal em português para envio direto aos clientes.
- Permitir cópia em 1 clique do texto formatado e impressão limpa via `@media print`.
- Respeitar isolamento multi-tenant: clientes só visualizam os próprios dados.

**Non-Goals:**
- Envio automático de e-mails via SMTP agendado por cron nesta etapa (o foco é a geração do relatório sob demanda e cópia/exportação pelo suporte).
- Criação de novas tabelas de banco de dados (as tabelas `tickets`, `ticket_occurrences` e `users` já suprem todas as métricas necessárias).

## Decisions

### 1. Agregação em Tempo Real via Server Action
- **Decisão:** Criar `getClientReportAction` em `lib/actions/report-actions.ts` consultando o Prisma diretamente com filtros de `userId` e intervalo de `createdAt`.
- **Alternativa Considerada:** Tabela de snapshots agregados mensais.
- **Justificativa:** O volume de tickets e ocorrências por cliente permite agregações rápidas sem complexidade adicional de sincronização de dados ou background workers.

### 2. Algoritmo Gerador de Copy Executivo Dinâmico
- **Decisão:** Implementar função determinística de formatação e redação técnica (`generateExecutiveCopy`) que analisa o volume de incidentes, o índice de SLA e as origens mais frequentes para produzir um texto formal, polido e personalizado.
- **Estrutura do Texto:**
  - Saudação Executiva & Identificação da Empresa e Período.
  - Síntese de SLA e Disponibilidade.
  - Análise Técnica das Camadas Afetadas (`FRONT`, `BACK`, `INFRA`, etc.).
  - Recomendações e Próximos Passos de Sustentação.
- **Alternativa Considerada:** Template estático preenchido apenas com números.
- **Justificativa:** Uma narrativa adaptativa (que varia se o mês teve 100% de estabilidade vs quando houve incidentes críticos de infraestrutura) confere valor profissional ao atendimento.

### 3. Layout com Suporte a Impressão e Design System Existente
- **Decisão:** Utilizar a paleta de cores padrão Bootstrap (`#0d6efd`, `#198754`, `#ffc107`, `#dc3545`, `#0dcaf0`) sobre fundo branco, com regras `@media print` no CSS para esconder filtros/menus durante a geração de PDF pelo navegador.
- **Alternativa Considerada:** Gerador de PDF server-side com Puppeteer.
- **Justificativa:** O `window.print()` do navegador nativo com CSS dedicado para print é leve, não aumenta o bundle no Vercel Edge/Serverless e gera saídas nítidas e vetorizadas.

## Risks / Trade-offs

- **[Filtros de Data Sem Registros]** → O sistema trata adequadamente intervalos com zero incidentes, exibindo relatório positivo de 100% de estabilidade operacional sem erros na interface.
- **[Clientes sem Empresa Preenchida]** → Fallback automático para o nome do usuário cadastrado na saudação do relatório.
