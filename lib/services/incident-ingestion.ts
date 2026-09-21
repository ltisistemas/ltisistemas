import { prisma } from "../db/prisma";
import { TicketStatus, IncidentOrigin } from "@prisma/client";
import { formatTicketCode } from "../utils/ticket-code";
import {
  generateIncidentFingerprint,
  sanitizePayload,
} from "../utils/incident-fingerprint";

export interface IngestIncidentInput {
  userId: string;
  title: string;
  screenName: string;
  description: string;
  origin?: "FRONT" | "BACK" | "INFRA" | "EVENT" | "OUTROS" | string;
  sourceUrl?: string | null;
  targetUrl?: string | null;
  occurredAt?: Date | string | null;
  errorLog?: string | null;
  payload?: any;
  headers?: any;
}

export interface IngestIncidentResult {
  success: boolean;
  isNew: boolean;
  ticketId: string;
  ticketNumber: number;
  code: string;
  occurrenceCount: number;
  occurrenceId: string;
  status: TicketStatus;
  slaDueAt: Date;
}

function parseOrigin(origin?: string): IncidentOrigin {
  if (!origin) return IncidentOrigin.OUTROS;
  const upper = origin.toUpperCase().trim();
  if (upper in IncidentOrigin) {
    return upper as IncidentOrigin;
  }
  return IncidentOrigin.OUTROS;
}

export async function ingestIncidentService(
  input: IngestIncidentInput
): Promise<IngestIncidentResult> {
  const title = input.title?.trim();
  const screenName = input.screenName?.trim();
  const description = input.description?.trim();

  if (!title || !screenName || !description) {
    throw new Error("Título, nome da tela/módulo e descrição são obrigatórios.");
  }

  const originEnum = parseOrigin(input.origin);
  const eventDate = input.occurredAt ? new Date(input.occurredAt) : new Date();
  const sanitizedPayloadStr = sanitizePayload(input.payload);
  const sanitizedHeadersStr = sanitizePayload(input.headers);

  const fingerprint = generateIncidentFingerprint({
    userId: input.userId,
    origin: originEnum,
    screenName,
    title,
    errorLog: input.errorLog,
  });

  // Check if an active open ticket exists with this fingerprint for the client
  const existingTicket = await prisma.ticket.findFirst({
    where: {
      userId: input.userId,
      fingerprint,
      status: { in: [TicketStatus.ABERTO, TicketStatus.PENDENTE] },
      deletedAt: null,
    },
    select: {
      id: true,
      ticketNumber: true,
      status: true,
      slaDueAt: true,
      occurrenceCount: true,
      createdAt: true,
    },
  });

  if (existingTicket) {
    // Append occurrence to existing active ticket
    const occurrence = await prisma.ticketOccurrence.create({
      data: {
        ticketId: existingTicket.id,
        origin: originEnum,
        occurredAt: eventDate,
        sourceUrl: input.sourceUrl || null,
        targetUrl: input.targetUrl || null,
        stackTrace: input.errorLog || null,
        payload: sanitizedPayloadStr,
        headers: sanitizedHeadersStr,
      },
      select: { id: true },
    });

    const updated = await prisma.ticket.update({
      where: { id: existingTicket.id },
      data: {
        occurrenceCount: { increment: 1 },
        lastOccurrenceAt: eventDate,
      },
      select: { occurrenceCount: true },
    });

    return {
      success: true,
      isNew: false,
      ticketId: existingTicket.id,
      ticketNumber: existingTicket.ticketNumber,
      code: formatTicketCode(existingTicket),
      occurrenceCount: updated.occurrenceCount,
      occurrenceId: occurrence.id,
      status: existingTicket.status,
      slaDueAt: existingTicket.slaDueAt,
    };
  }

  // Create new ticket with initial occurrence
  const slaDueAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

  const newTicket = await prisma.ticket.create({
    data: {
      title,
      description,
      screenName,
      origin: originEnum,
      status: TicketStatus.ABERTO,
      fingerprint,
      occurrenceCount: 1,
      lastOccurrenceAt: eventDate,
      sourceUrl: input.sourceUrl || null,
      targetUrl: input.targetUrl || null,
      slaDueAt,
      userId: input.userId,
      occurrences: {
        create: {
          origin: originEnum,
          occurredAt: eventDate,
          sourceUrl: input.sourceUrl || null,
          targetUrl: input.targetUrl || null,
          stackTrace: input.errorLog || null,
          payload: sanitizedPayloadStr,
          headers: sanitizedHeadersStr,
        },
      },
    },
    select: {
      id: true,
      ticketNumber: true,
      status: true,
      slaDueAt: true,
      occurrenceCount: true,
      createdAt: true,
      occurrences: {
        select: { id: true },
        take: 1,
      },
    },
  });

  return {
    success: true,
    isNew: true,
    ticketId: newTicket.id,
    ticketNumber: newTicket.ticketNumber,
    code: formatTicketCode(newTicket),
    occurrenceCount: 1,
    occurrenceId: newTicket.occurrences[0]?.id || "",
    status: newTicket.status,
    slaDueAt: newTicket.slaDueAt,
  };
}
