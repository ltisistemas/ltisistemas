import { IncidentOrigin } from "@prisma/client";

export interface OriginStat {
  origin: IncidentOrigin;
  label: string;
  count: number;
  percentage: number;
}

export interface ScreenStat {
  screenName: string;
  count: number;
  percentage: number;
}

export interface ExecutiveCopy {
  headline: string;
  greeting: string;
  executiveSummary: string;
  stabilityDiagnostic: string;
  telemetryInsights: string;
  actionPlan: string;
  fullFormattedText: string;
}

/**
 * Redige o parecer executivo formal com alto padrão de copywriting.
 */
export function generateExecutiveCopy(params: {
  companyName: string;
  contactName: string;
  formattedRange: string;
  totalTickets: number;
  closedTickets: number;
  openTickets: number;
  pendingTickets: number;
  resolutionRate: number;
  slaComplianceRate: number;
  totalOccurrences: number;
  originBreakdown: OriginStat[];
  topScreens: ScreenStat[];
}): ExecutiveCopy {
  const {
    companyName,
    contactName,
    formattedRange,
    totalTickets,
    closedTickets,
    openTickets,
    pendingTickets,
    resolutionRate,
    slaComplianceRate,
    totalOccurrences,
    originBreakdown,
    topScreens,
  } = params;

  const headline = `Relatório Executivo Mensal de Sustentação & Telemetria — ${companyName}`;
  const greeting = `Prezados Gestores da ${companyName} (A/C ${contactName || "Diretoria e TI"}),`;

  let executiveSummary = "";
  let stabilityDiagnostic = "";
  let telemetryInsights = "";
  let actionPlan = "";

  if (totalTickets === 0) {
    executiveSummary = `Temos a satisfação de apresentar o relatório de sustentação referente ao período de ${formattedRange}. Durante este intervalo, os sistemas operaram em conformidade absoluta, registrando 100% de disponibilidade técnica sem abertura de chamados ou incidentes críticos reportados.`;
    stabilityDiagnostic = `A estabilidade operacional manteve-se no nível máximo de confiabilidade. O monitoramento contínuo e a telemetria preventiva atuaram silenciosamente na blindagem dos ambientes de produção.`;
    telemetryInsights = `Nenhuma falha de execução, exceção não tratada ou degradação de serviços foi interceptada pelos agentes de telemetria no período.`;
    actionPlan = `Recomendamos a manutenção das rotinas preventivas atuais, revisão periódica dos limites de infraestrutura e prosseguimento no plano de evolução contínua das aplicações.`;
  } else {
    const mainOrigin = originBreakdown.length > 0 ? originBreakdown[0] : null;
    const topScreen = topScreens.length > 0 ? topScreens[0] : null;

    executiveSummary = `Apresentamos o balanço executivo de atendimento técnico e telemetria referente ao período de ${formattedRange}. No intervalo, foram processados ${totalTickets} ${totalTickets === 1 ? "chamado" : "chamados"}, com uma taxa de resolução de ${resolutionRate.toFixed(1)}% e índice de cumprimento de SLA contratual de ${slaComplianceRate.toFixed(1)}%.`;

    stabilityDiagnostic = `Do total de demandas gerenciadas, ${closedTickets} ${closedTickets === 1 ? "chamado foi completamente solucionado" : "chamados foram completamente solucionados"}, restando ${openTickets + pendingTickets} ${openTickets + pendingTickets === 1 ? "incidente em análise prioritária" : "incidentes em análise prioritária"} pela equipe de engenharia de suporte. A prontidão do time técnico garantiu o restabelecimento ágil dos serviços afetados.`;

    if (totalOccurrences > totalTickets) {
      telemetryInsights = `Através do sistema de telemetria automatizada, foram interceptadas e deduplicadas ${totalOccurrences} ocorrências brutas em ${totalTickets} incidentes únicos. A maior concentração de apontamentos situou-se na camada de ${mainOrigin?.label || "Serviços"} (${mainOrigin?.percentage.toFixed(0) || 0}% dos registros)${topScreen ? `, com foco principal no módulo "${topScreen.screenName}"` : ""}.`;
    } else {
      telemetryInsights = `A maior incidência dos chamados esteve associada à camada de ${mainOrigin?.label || "Sistemas"} (${mainOrigin?.percentage.toFixed(0) || 0}%)${topScreen ? `, com atenção especial ao módulo "${topScreen.screenName}"` : ""}. Todas as ocorrências foram devidamente rastreadas com captura de contexto e stack-trace.`;
    }

    actionPlan = `Para o próximo ciclo operacional, recomendamos: 1) Reforço nos testes de regressão no módulo "${topScreen ? topScreen.screenName : "Geral"}"; 2) Otimização dos fluxos na camada de ${mainOrigin?.label || "Backend/Serviços"}; e 3) Monitoramento preventivo contínuo dos tempos de resposta das integrações.`;
  }

  // Monta texto formatado integral para e-mail/WhatsApp/Markdown
  const fullFormattedText = [
    `# ${headline}`,
    `*Período de Apuração: ${formattedRange}*`,
    ``,
    `${greeting}`,
    ``,
    `### 1. Síntese Executiva & Nível de Serviço (SLA)`,
    executiveSummary,
    ``,
    `**Indicadores Chave de Desempenho:**`,
    `- Total de Chamados Processados: ${totalTickets}`,
    `- Chamados Solucionados: ${closedTickets} (${resolutionRate.toFixed(1)}%)`,
    `- Chamados em Andamento: ${openTickets + pendingTickets}`,
    `- Cumprimento de SLA Contratual: ${slaComplianceRate.toFixed(1)}%`,
    `- Ocorrências de Telemetria Interceptadas: ${totalOccurrences}`,
    ``,
    `### 2. Diagnóstico de Estabilidade Técnica`,
    stabilityDiagnostic,
    ``,
    `### 3. Análise de Telemetria e Camadas Afetadas`,
    telemetryInsights,
    ``,
    originBreakdown.length > 0
      ? `**Distribuição por Origem:**\n` +
        originBreakdown
          .map((o) => `  • ${o.label}: ${o.count} (${o.percentage.toFixed(1)}%)`)
          .join("\n")
      : "",
    ``,
    `### 4. Recomendações e Próximos Passos`,
    actionPlan,
    ``,
    `---`,
    `*Relatório emitido pela Central de Suporte & Telemetria — LTI Sistemas*`,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return {
    headline,
    greeting,
    executiveSummary,
    stabilityDiagnostic,
    telemetryInsights,
    actionPlan,
    fullFormattedText,
  };
}
