"use server";

import { prisma } from "../db/prisma";
import { requireSession } from "../auth/session";
import { TicketStatus, IncidentOrigin } from "@prisma/client";
import { ActionResult } from "./auth-actions";
import { formatTicketCode } from "../utils/ticket-code";

export interface AttachmentInput {
  fileName: string;
  mimeType: string;
  base64Data: string;
}

export interface TicketOccurrenceItem {
  id: string;
  origin: IncidentOrigin;
  occurredAt: Date;
  sourceUrl: string | null;
  targetUrl: string | null;
  stackTrace: string | null;
  payload: string | null;
  headers: string | null;
  createdAt: Date;
}

export interface TicketSummary {
  id: string;
  ticketNumber: number;
  code: string;
  title: string;
  description: string;
  screenName: string;
  status: TicketStatus;
  origin: IncidentOrigin;
  occurrenceCount: number;
  lastOccurrenceAt: Date;
  sourceUrl: string | null;
  targetUrl: string | null;
  slaDueAt: Date;
  createdAt: Date;
  updatedAt: Date;
  attachmentsCount: number;
  user: {
    id: string;
    name: string;
    company: string;
    contractNumber: string | null;
    systemUrl: string | null;
    email: string;
  };
}

export interface TicketDetail extends TicketSummary {
  attachments: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    base64Data: string;
    createdAt: Date;
  }>;
  occurrences: TicketOccurrenceItem[];
}

export interface TicketStats {
  total: number;
  aberto: number;
  pendente: number;
  fechado: number;
}

/**
 * Creates a new support incident ticket with screen name and 6-hour SLA.
 */
export async function createTicketAction(data: {
  title: string;
  description: string;
  screenName: string;
  targetUserId?: string;
  attachments?: AttachmentInput[];
}): Promise<ActionResult<{ id: string; ticketNumber: number; code: string; slaDueAt: Date }>> {
  try {
    const session = await requireSession();

    const title = data.title?.trim();
    const description = data.description?.trim();
    const screenName = data.screenName?.trim();
    const rawAttachments = data.attachments || [];

    if (!title || !description || !screenName) {
      return { success: false, error: "Título, nome da tela e descrição do problema são obrigatórios." };
    }

    if (rawAttachments.length > 3) {
      return { success: false, error: "É permitido anexar no máximo 3 imagens por chamado." };
    }

    // Validate attachments
    for (const att of rawAttachments) {
      if (!att.base64Data || !att.base64Data.startsWith("data:image/")) {
        return { success: false, error: "Formato de anexo inválido. Apenas imagens são aceitas." };
      }
      // Check approximate base64 payload size (max 3MB per base64 image string)
      if (att.base64Data.length > 4 * 1024 * 1024) {
        return { success: false, error: `A imagem "${att.fileName}" excede o tamanho máximo permitido.` };
      }
    }

    let assignedUserId = session.userId;
    if (session.role === "SUPORTE" && data.targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: data.targetUserId },
        select: { id: true, deletedAt: true },
      });
      if (!targetUser || targetUser.deletedAt) {
        return { success: false, error: "Cliente selecionado não foi encontrado ou está inativo." };
      }
      assignedUserId = targetUser.id;
    }

    // 6-hour SLA for initial analysis
    const slaDueAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        screenName,
        status: TicketStatus.ABERTO,
        slaDueAt,
        userId: assignedUserId,
        attachments: rawAttachments.length > 0
          ? {
              create: rawAttachments.slice(0, 3).map((att) => ({
                fileName: att.fileName || "screenshot.png",
                mimeType: att.mimeType || "image/png",
                base64Data: att.base64Data,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        ticketNumber: true,
        slaDueAt: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        code: formatTicketCode(ticket),
        slaDueAt: ticket.slaDueAt,
      },
    };
  } catch (error: any) {
    console.error("Create ticket error:", error);
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Sua sessão expirou. Por favor, faça login novamente." };
    }
    return { success: false, error: "Erro ao abrir chamado. Tente novamente." };
  }
}

/**
 * Retrieves tickets with role-based isolation and soft-delete filtering:
 * - CLIENTE sees only their own active tickets
 * - SUPORTE sees all active tickets across all clients (or filtered by clientId)
 */
export async function getTicketsAction(
  filterStatus?: TicketStatus | "ALL",
  filterClientId?: string
): Promise<ActionResult<{ tickets: TicketSummary[]; stats: TicketStats }>> {
  try {
    const session = await requireSession();

    const isSupport = session.role === "SUPORTE";
    const statusCondition = filterStatus && filterStatus !== "ALL" ? { status: filterStatus } : {};

    // Filter out soft-deleted tickets and by client userId if not support or if support filtered by clientId
    const clientCondition = isSupport
      ? filterClientId && filterClientId !== "ALL"
        ? { userId: filterClientId }
        : {}
      : { userId: session.userId };

    const baseFilter = {
      deletedAt: null,
      ...clientCondition,
    };
    const queryFilter = { ...baseFilter, ...statusCondition };

    // Fetch tickets and count stats in parallel
    const [tickets, totalCount, abertoCount, pendenteCount, fechadoCount] = await Promise.all([
      prisma.ticket.findMany({
        where: queryFilter,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              company: true,
              contractNumber: true,
              systemUrl: true,
              email: true,
            },
          },
          _count: {
            select: { attachments: true },
          },
        },
      }),
      prisma.ticket.count({ where: baseFilter }),
      prisma.ticket.count({ where: { ...baseFilter, status: TicketStatus.ABERTO } }),
      prisma.ticket.count({ where: { ...baseFilter, status: TicketStatus.PENDENTE } }),
      prisma.ticket.count({ where: { ...baseFilter, status: TicketStatus.FECHADO } }),
    ]);

    const formattedTickets: TicketSummary[] = tickets.map((t) => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      code: formatTicketCode(t),
      title: t.title,
      description: t.description,
      screenName: t.screenName,
      status: t.status,
      origin: t.origin,
      occurrenceCount: t.occurrenceCount,
      lastOccurrenceAt: t.lastOccurrenceAt,
      sourceUrl: t.sourceUrl,
      targetUrl: t.targetUrl,
      slaDueAt: t.slaDueAt,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      attachmentsCount: t._count.attachments,
      user: t.user,
    }));

    const stats: TicketStats = {
      total: totalCount,
      aberto: abertoCount,
      pendente: pendenteCount,
      fechado: fechadoCount,
    };

    return {
      success: true,
      data: {
        tickets: formattedTickets,
        stats,
      },
    };
  } catch (error: any) {
    console.error("Get tickets error:", error);
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Sua sessão expirou. Faça login novamente." };
    }
    return { success: false, error: "Erro ao buscar chamados." };
  }
}

/**
 * Retrieves a single ticket with full details, screen name, SLA and attached screenshots.
 * Strictly verifies that clients cannot view other clients' tickets and ignores soft-deleted tickets.
 */
export async function getTicketByIdAction(ticketId: string): Promise<ActionResult<TicketDetail>> {
  try {
    const session = await requireSession();

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            company: true,
            contractNumber: true,
            systemUrl: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileName: true,
            mimeType: true,
            base64Data: true,
            createdAt: true,
          },
        },
        occurrences: {
          orderBy: { occurredAt: "desc" },
          select: {
            id: true,
            origin: true,
            occurredAt: true,
            sourceUrl: true,
            targetUrl: true,
            stackTrace: true,
            payload: true,
            headers: true,
            createdAt: true,
          },
        },
      },
    });

    if (!ticket || ticket.deletedAt) {
      return { success: false, error: "Chamado não encontrado ou excluído." };
    }

    // Role-based privacy isolation
    if (session.role === "CLIENTE" && ticket.userId !== session.userId) {
      return { success: false, error: "Você não tem permissão para visualizar este chamado." };
    }

    return {
      success: true,
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        code: formatTicketCode(ticket),
        title: ticket.title,
        description: ticket.description,
        screenName: ticket.screenName,
        status: ticket.status,
        origin: ticket.origin,
        occurrenceCount: ticket.occurrenceCount,
        lastOccurrenceAt: ticket.lastOccurrenceAt,
        sourceUrl: ticket.sourceUrl,
        targetUrl: ticket.targetUrl,
        slaDueAt: ticket.slaDueAt,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        attachmentsCount: ticket.attachments.length,
        user: ticket.user,
        attachments: ticket.attachments,
        occurrences: ticket.occurrences,
      },
    };
  } catch (error: any) {
    console.error("Get ticket by id error:", error);
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Sua sessão expirou." };
    }
    return { success: false, error: "Erro ao carregar os detalhes do chamado." };
  }
}

/**
 * Updates the status of a ticket (restricted exclusively to SUPORTE).
 */
export async function updateTicketStatusAction(
  ticketId: string,
  newStatus: TicketStatus
): Promise<ActionResult<{ id: string; status: TicketStatus }>> {
  try {
    await requireSession(["SUPORTE"]);

    if (!["ABERTO", "PENDENTE", "FECHADO"].includes(newStatus)) {
      return { success: false, error: "Status inválido." };
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
      select: {
        id: true,
        status: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  } catch (error: any) {
    console.error("Update ticket status error:", error);
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return { success: false, error: "Apenas a equipe de SUPORTE pode alterar o status de um chamado." };
    }
    return { success: false, error: "Erro ao atualizar status do chamado." };
  }
}

/**
 * Performs soft-delete on a ticket (allowed for ticket owner or SUPORTE).
 */
export async function deleteTicketAction(ticketId: string): Promise<ActionResult> {
  try {
    const session = await requireSession();

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, userId: true, deletedAt: true },
    });

    if (!ticket || ticket.deletedAt) {
      return { success: false, error: "Chamado não encontrado." };
    }

    if (session.role === "CLIENTE" && ticket.userId !== session.userId) {
      return { success: false, error: "Você não tem permissão para excluir este chamado." };
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Delete ticket error:", error);
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Sua sessão expirou." };
    }
    return { success: false, error: "Erro ao excluir chamado." };
  }
}
