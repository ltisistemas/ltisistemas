## Why

A equipe de suporte técnico e gestão de contas precisa gerar relatórios executivos mensais e por período personalizado diretamente pelo portal de suporte para prestação de contas com clientes. O relatório consolida métricas de SLA, índice de resolução, telemetria de falhas por módulo/origem e diagnósticos com copywriting profissional e formal para envio a diretores e gestores de TI dos clientes.

## What Changes

- **Novo Módulo de Relatórios no Suporte (`/suporte/relatorios`)**:
  - Aba de navegação "Relatórios" no cabeçalho do portal de suporte (`SupportHeader`).
  - Filtro flexível por Cliente (disponível para perfis de `SUPORTE`; clientes visualizam automaticamente sua própria empresa) e por Período (Mês Atual, Mês Anterior, Últimos 3 Meses ou Intervalo Customizado).
- **Server Action e Agregação de Dados (`lib/actions/report-actions.ts`)**:
  - Busca otimizada de chamados, ocorrências de telemetria e SLAs cumpridos no período selecionado.
  - Cálculo de KPIs: Taxa de Resolução, Cumprimento de SLA (%), Total de Ocorrências Deduplicadas, Média de Ocorrências por Incidente e Distribuição por Origem (`FRONT`, `BACK`, `INFRA`, etc.).
- **Copywriting Executivo e Diagnóstico Inteligente**:
  - Geração de texto executivo contextualizado com tom profissional para o cliente (Saudação executiva, Síntese de disponibilidade e estabilidade, Análise de incidentes críticos e Recomendações técnicas de sustentação).
- **Visualização e Exportação Pronta para Envio**:
  - Layout limpo, responsivo e adaptado para impressão/PDF (`@media print` estilizado com cabeçalho da LTI Sistemas).
  - Botão de "Copiar Texto Executivo" para envio rápido via e-mail ou WhatsApp corporativo, além de botão de impressão/PDF.

## Capabilities

### New Capabilities
- `client-support-report`: Geração, filtragem, visualização executiva e exportação de relatórios periódicos de atendimento e telemetria por cliente.

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos fundamentais alterados. -->

## Impact

- **Rotas e Páginas**: Nova rota `app/suporte/relatorios/page.tsx`.
- **Componentes**: `components/suporte/SupportHeader.tsx` (nova aba), `components/suporte/ClientReportView.tsx` (interface do relatório com filtros, KPIs, gráficos de barra e blocos de copy).
- **Ações e Lógica**: `lib/actions/report-actions.ts` (agregação analítica via Prisma).
- **Navegação**: Links contextuais e permissões de acesso com base no papel do usuário (`SUPORTE` vs `CLIENTE`).
