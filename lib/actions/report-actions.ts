"use server";

import { prisma } from "../db/prisma";
import { requireSession } from "../auth/session";
import { TicketStatus, IncidentOrigin } from "@prisma/client";
import { ActionResult } from "./auth-actions";
import { formatTicketCode } from "../utils/ticket-code";

export interface ClientReportFilter {
  clientId?: string;
  startDate: string; // ISO string or YYYY-MM-DD
  endDate: string; // ISO string or YYYY-MM-DD
}

import {
  generateExecutiveCopy,
  OriginStat,
  ScreenStat,
  ExecutiveCopy,
} from "../utils/report-copy";

export type { OriginStat, ScreenStat, ExecutiveCopy };

export interface ReportTicketItem {
  id: string;
  ticketNumber: number;
  code: string;
  title: string;
  screenName: string;
  status: TicketStatus;
  origin: IncidentOrigin;
  occurrenceCount: number;
  createdAt: Date;
  resolvedAt: Date | null;
  slaDueAt: Date;
  slaMet: boolean;
}

export interface ClientReportData {
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
    contractNumber: string | null;
  } | null;
  period: {
    startDate: string;
    endDate: string;
    formattedRange: string;
  };
  metrics: {
    totalTickets: number;
    closedTickets: number;
    openTickets: number;
    pendingTickets: number;
    resolutionRate: number; // 0 to 100
    slaComplianceRate: number; // 0 to 100
    totalOccurrences: number;
    avgOccurrencesPerTicket: number;
  };
  originBreakdown: OriginStat[];
  topScreens: ScreenStat[];
  executiveCopy: ExecutiveCopy;
  tickets: ReportTicketItem[];
}

const ORIGIN_LABELS: Record<IncidentOrigin, string> = {
  FRONT: "Frontend / Interface",
  BACK: "Backend / Serviços",
  INFRA: "Infraestrutura / Redes",
  EVENT: "Eventos / Webhooks",
  OUTROS: "Geral / Outros",
};

/**
 * Server Action para geração e agregação do relatório periódico do cliente.
 */
export async function getClientReportAction(
  filter: ClientReportFilter
): Promise<ActionResult<ClientReportData>> {
  try {
    const session = await requireSession();

    let targetClientId = filter.clientId;

    // Se for CLIENTE, restringe obrigatoriamente aos seus próprios dados
    if (session.role === "CLIENTE") {
      targetClientId = session.userId;
    } else if (targetClientId === "ALL" || !targetClientId) {
      // Se SUPORTE e ALL/vazio, seleciona o primeiro cliente ou consolida
      targetClientId = undefined;
    }

    // Normaliza datas
    const startDate = new Date(filter.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(filter.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        success: false,
        error: "Datas inválidas fornecidas para o relatório.",
      };
    }

    // Formata o label do período (ex: 01/09/2026 até 30/09/2026)
    const formattedRange = `${startDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} até ${endDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}`;

    // Busca o cliente específico se fornecido
    let targetClientUser = null;
    if (targetClientId) {
      targetClientUser = await prisma.user.findUnique({
        where: { id: targetClientId },
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          contractNumber: true,
        },
      });
    }

    // Query de chamados no período
    const tickets = await prisma.ticket.findMany({
      where: {
        ...(targetClientId ? { userId: targetClientId } : {}),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Cálculos de métricas
    const totalTickets = tickets.length;
    const closedTickets = tickets.filter((t) => t.status === "FECHADO").length;
    const openTickets = tickets.filter((t) => t.status === "ABERTO").length;
    const pendingTickets = tickets.filter((t) => t.status === "PENDENTE").length;

    const resolutionRate =
      totalTickets > 0 ? (closedTickets / totalTickets) * 100 : 100;

    // SLA: Para tickets fechados, se updatedAt <= slaDueAt (ou se slaDueAt ainda no futuro)
    let slaMetCount = 0;
    const reportTicketItems: ReportTicketItem[] = tickets.map((t) => {
      const isClosed = t.status === "FECHADO";
      const resolvedAt = isClosed ? t.updatedAt : null;
      const slaMet = isClosed
        ? t.updatedAt.getTime() <= t.slaDueAt.getTime()
        : new Date().getTime() <= t.slaDueAt.getTime();

      if (slaMet) slaMetCount++;

      return {
        id: t.id,
        ticketNumber: t.ticketNumber,
        code: formatTicketCode(t),
        title: t.title,
        screenName: t.screenName,
        status: t.status,
        origin: t.origin,
        occurrenceCount: t.occurrenceCount,
        createdAt: t.createdAt,
        resolvedAt,
        slaDueAt: t.slaDueAt,
        slaMet,
      };
    });

    const slaComplianceRate =
      totalTickets > 0 ? (slaMetCount / totalTickets) * 100 : 100;

    const totalOccurrences = tickets.reduce(
      (sum, t) => sum + (t.occurrenceCount || 1),
      0
    );
    const avgOccurrencesPerTicket =
      totalTickets > 0 ? Number((totalOccurrences / totalTickets).toFixed(1)) : 1;

    // Agrupamento por Origem
    const originMap = new Map<IncidentOrigin, number>();
    Object.values(IncidentOrigin).forEach((orig) => originMap.set(orig, 0));

    tickets.forEach((t) => {
      const count = originMap.get(t.origin) || 0;
      originMap.set(t.origin, count + 1);
    });

    const originBreakdown: OriginStat[] = Array.from(originMap.entries())
      .filter(([_, count]) => count > 0)
      .map(([origin, count]) => ({
        origin,
        label: ORIGIN_LABELS[origin] || origin,
        count,
        percentage: totalTickets > 0 ? (count / totalTickets) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Agrupamento por Top Telas / Módulos
    const screenMap = new Map<string, number>();
    tickets.forEach((t) => {
      const screen = t.screenName || "Geral";
      screenMap.set(screen, (screenMap.get(screen) || 0) + 1);
    });

    const topScreens: ScreenStat[] = Array.from(screenMap.entries())
      .map(([screenName, count]) => ({
        screenName,
        count,
        percentage: totalTickets > 0 ? (count / totalTickets) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Nome da Empresa e Contato para Copywriting
    const companyName =
      targetClientUser?.company ||
      (tickets.length > 0 && tickets[0].user?.company
        ? tickets[0].user.company
        : targetClientId
        ? "Cliente Corporativo"
        : "Todos os Clientes");

    const contactName =
      targetClientUser?.name ||
      (tickets.length > 0 && tickets[0].user?.name
        ? tickets[0].user.name
        : "Gestão de TI");

    const executiveCopy = generateExecutiveCopy({
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
    });

    const reportData: ClientReportData = {
      client: targetClientUser
        ? {
            id: targetClientUser.id,
            name: targetClientUser.name,
            company: targetClientUser.company,
            email: targetClientUser.email,
            contractNumber: targetClientUser.contractNumber,
          }
        : null,
      period: {
        startDate: filter.startDate,
        endDate: filter.endDate,
        formattedRange,
      },
      metrics: {
        totalTickets,
        closedTickets,
        openTickets,
        pendingTickets,
        resolutionRate,
        slaComplianceRate,
        totalOccurrences,
        avgOccurrencesPerTicket,
      },
      originBreakdown,
      topScreens,
      executiveCopy,
      tickets: reportTicketItems,
    };

    return {
      success: true,
      data: reportData,
    };
  } catch (error: any) {
    console.error("Erro ao gerar relatório de suporte:", error);
    return {
      success: false,
      error: error.message || "Falha ao gerar relatório de suporte.",
    };
  }
}
