## Purpose

Permite a geração, análise executiva, visualização e exportação de relatórios mensais e periódicos de atendimento, telemetria de incidentes e cumprimento de SLA por cliente no portal de suporte.

## ADDED Requirements

### Requirement: Periodic Report Access and Role Permissions
O sistema SHALL disponibilizar a página de relatórios no endereço `/suporte/relatorios` e um link de navegação no cabeçalho do portal de suporte. Usuários com papel `SUPORTE` SHALL poder selecionar qualquer cliente cadastrado ou visualizar visão consolidada. Usuários com papel `CLIENTE` SHALL ter acesso restrito aos dados de sua própria empresa.

#### Scenario: Support agent selects client report
- **WHEN** um usuário autenticado com perfil `SUPORTE` acessa `/suporte/relatorios` e seleciona uma empresa no seletor de clientes
- **THEN** o sistema exibe os dados consolidados, métricas de SLA e texto executivo correspondentes àquele cliente no período selecionado

#### Scenario: Client user views own report
- **WHEN** um usuário autenticado com perfil `CLIENTE` acessa `/suporte/relatorios`
- **THEN** o sistema carrega automaticamente os dados de sua própria empresa, omitindo seletores de outras contas

---

### Requirement: Date Range and Period Filtering
O sistema SHALL permitir a seleção de períodos através de atalhos rápidos ("Mês Vigente", "Mês Anterior", "Últimos 90 Dias") bem como a seleção personalizada de data inicial e data final.

#### Scenario: Filter by previous month
- **WHEN** o usuário clica no atalho "Mês Anterior"
- **THEN** o sistema recalcula as datas para o primeiro e último dia do mês imediatamente anterior e atualiza as métricas e o texto executivo

#### Scenario: Custom date range selection
- **WHEN** o usuário informa datas válidas de início e fim no formulário de filtro e submete
- **THEN** o sistema filtra todos os chamados e ocorrências registradas no intervalo selecionado

---

### Requirement: Metrics and SLA Performance Aggregation
O sistema SHALL calcular e exibir os principais indicadores de desempenho do período:
1. Total de chamados abertos no período.
2. Total de chamados resolvidos (`FECHADO`).
3. Total de chamados em andamento (`ABERTO` / `PENDENTE`).
4. Taxa de resolução (%) no período.
5. Taxa de cumprimento de SLA (percentual de chamados resolvidos dentro do prazo estipulado).
6. Total de ocorrências brutas capturadas e deduplicadas via telemetria.
7. Distribuição dos incidentes por camada de origem (`FRONT`, `BACK`, `INFRA`, `EVENT`, `OUTROS`).
8. Módulos/Telas com maior incidência de registros (`screenName`).

#### Scenario: Aggregation with tickets in period
- **WHEN** existem chamados registrados para o cliente no período
- **THEN** o sistema exibe os cards de métricas com valores percentuais, badges de status do Bootstrap e gráficos de distribuição por origem

#### Scenario: Empty period handling
- **WHEN** não há chamados registrados para o cliente no período selecionado
- **THEN** o sistema exibe estado informativo de 100% de estabilidade operacional sem incidentes registrados no período

---

### Requirement: Professional Executive Copywriting and Narrative Diagnostics
O sistema SHALL gerar automaticamente uma narrativa executiva com copywriting profissional em língua portuguesa, estruturada em blocos:
1. **Saudação e Identificação Executiva**: Apresentação formal direcionada aos gestores do cliente, mencionando o período analisado.
2. **Diagnóstico de Estabilidade e SLA**: Resumo claro sobre a saúde operacional, volume de chamados e conformidade de atendimento.
3. **Destaques Técnicos e Telemetria**: Síntese das principais causas raiz e camadas afetadas (`FRONT`, `BACK`, etc.).
4. **Recomendações e Próximos Passos**: Sugestões proativas de melhoria técnica, manutenção preventiva ou otimização de fluxos.

#### Scenario: Generation of executive narrative
- **WHEN** os dados do relatório são carregados
- **THEN** o sistema monta o texto executivo dinamicamente combinando as métricas reais do período e o perfil do cliente

---

### Requirement: Export, Copy-to-Clipboard, and Print Presentation
O sistema SHALL fornecer recursos para envio e apresentação do relatório:
1. Botão "Copiar Texto Executivo" para área de transferência formatado para envio direto via e-mail ou WhatsApp.
2. Estilos específicos de impressão (`@media print`) para geração de PDF limpo, com logotipo da LTI Sistemas, paginação elegante e sem elementos desnecessários de navegação.

#### Scenario: Copy formatted text
- **WHEN** o usuário clica no botão "Copiar Texto"
- **THEN** o sistema copia a mensagem executiva completa para o clipboard e exibe feedback de sucesso

#### Scenario: Print report
- **WHEN** o usuário clica em "Imprimir / Gerar PDF"
- **THEN** o sistema aciona `window.print()` renderizando uma versão limpa e formatada do relatório
