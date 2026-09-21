"use server";

import { prisma } from "../db/prisma";
import { requireSession } from "../auth/session";
import { TicketStatus } from "@prisma/client";
import { ActionResult } from "./auth-actions";

export interface AttachmentInput {
  fileName: string;
  mimeType: string;
  base64Data: string;
}

export interface TicketSummary {
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  attachmentsCount: number;
  user: {
    id: string;
    name: string;
    company: string;
    contractNumber: string | null;
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
}

export interface TicketStats {
  total: number;
  aberto: number;
  pendente: number;
  fechado: number;
}

/**
 * Creates a new support incident ticket with optional screenshot attachments.
 */
export async function createTicketAction(data: {
  title: string;
  description: string;
  attachments?: AttachmentInput[];
}): Promise<ActionResult<{ id: string; ticketNumber: number }>> {
  try {
    const session = await requireSession();

    const title = data.title?.trim();
    const description = data.description?.trim();
    const rawAttachments = data.attachments || [];

    if (!title || !description) {
      return { success: false, error: "Título e descrição do problema são obrigatórios." };
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

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        status: TicketStatus.ABERTO,
        userId: session.userId,
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
      },
    });

    return {
      success: true,
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
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
 * Retrieves tickets with role-based isolation:
 * - CLIENTE sees only their own tickets
 * - SUPORTE sees all tickets across all clients
 */
export async function getTicketsAction(
  filterStatus?: TicketStatus | "ALL"
): Promise<ActionResult<{ tickets: TicketSummary[]; stats: TicketStats }>> {
  try {
    const session = await requireSession();

    const isSupport = session.role === "SUPORTE";
    const statusCondition = filterStatus && filterStatus !== "ALL" ? { status: filterStatus } : {};

    // Filter by client userId if not support
    const baseFilter = isSupport ? {} : { userId: session.userId };
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
      title: t.title,
      description: t.description,
      status: t.status,
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
 * Retrieves a single ticket with full details and attached screenshots.
 * Strictly verifies that clients cannot view other clients' tickets.
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
      },
    });

    if (!ticket) {
      return { success: false, error: "Chamado não encontrado." };
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
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        attachmentsCount: ticket.attachments.length,
        user: ticket.user,
        attachments: ticket.attachments,
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
