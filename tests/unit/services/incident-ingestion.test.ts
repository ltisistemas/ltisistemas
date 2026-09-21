import { describe, it, expect, vi, beforeEach } from "vitest";
import { ingestIncidentService } from "@/lib/services/incident-ingestion";
import { prisma } from "@/lib/db/prisma";
import { TicketStatus, IncidentOrigin } from "@prisma/client";

describe("lib/services/incident-ingestion", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should throw error if required fields are missing", async () => {
    await expect(
      ingestIncidentService({
        userId: "usr_1",
        title: "",
        screenName: "Checkout",
        description: "Desc",
      })
    ).rejects.toThrow("obrigatórios");

    await expect(
      ingestIncidentService({
        userId: "usr_1",
        title: "Title",
        screenName: "",
        description: "Desc",
      })
    ).rejects.toThrow("obrigatórios");
  });

  it("should create new ticket and initial occurrence when no active ticket matches fingerprint", async () => {
    vi.spyOn(prisma.ticket, "findFirst").mockResolvedValue(null);

    const now = new Date();
    const createSpy = vi.spyOn(prisma.ticket, "create").mockResolvedValue({
      id: "tkt_new_123",
      ticketNumber: 101,
      status: TicketStatus.ABERTO,
      slaDueAt: new Date(Date.now() + 6 * 3600 * 1000),
      occurrenceCount: 1,
      createdAt: now,
      occurrences: [{ id: "occ_init_1" }],
    } as any);

    const result = await ingestIncidentService({
      userId: "usr_1",
      title: "Erro 500 no Gateway",
      screenName: "Pagamentos",
      description: "Gateway recusou conexão",
      origin: "BACK",
      sourceUrl: "https://app.client.com/pay",
      targetUrl: "https://gateway.com/v1/charge",
      errorLog: "Error: Connection reset by peer\n  at Socket.connect",
      payload: { amount: 1500, cardToken: "tok_123" },
    });

    expect(result.success).toBe(true);
    expect(result.isNew).toBe(true);
    expect(result.ticketId).toBe("tkt_new_123");
    expect(result.ticketNumber).toBe(101);
    expect(result.code).toMatch(/^LTI-BUG-[A-Z0-9]{6}-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);
    expect(result.occurrenceCount).toBe(1);
    expect(result.occurrenceId).toBe("occ_init_1");

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "usr_1",
          title: "Erro 500 no Gateway",
          origin: IncidentOrigin.BACK,
          status: TicketStatus.ABERTO,
          occurrences: expect.objectContaining({
            create: expect.objectContaining({
              origin: IncidentOrigin.BACK,
              sourceUrl: "https://app.client.com/pay",
            }),
          }),
        }),
      })
    );
  });

  it("should append occurrence and increment counter when matching active ticket exists", async () => {
    const existingDate = new Date();
    vi.spyOn(prisma.ticket, "findFirst").mockResolvedValue({
      id: "tkt_existing_555",
      ticketNumber: 55,
      status: TicketStatus.PENDENTE,
      slaDueAt: new Date(Date.now() + 3 * 3600 * 1000),
      occurrenceCount: 3,
      createdAt: existingDate,
    } as any);

    const occCreateSpy = vi.spyOn(prisma.ticketOccurrence, "create").mockResolvedValue({
      id: "occ_new_99",
    } as any);

    const updateSpy = vi.spyOn(prisma.ticket, "update").mockResolvedValue({
      occurrenceCount: 4,
    } as any);

    const result = await ingestIncidentService({
      userId: "usr_1",
      title: "Erro recorrente de login",
      screenName: "Tela de Login",
      description: "Usuário reportou falha ao autenticar",
      origin: "FRONT",
      errorLog: "TypeError: Cannot read properties of undefined (reading 'token')",
      payload: { email: "usuario@teste.com" },
    });

    expect(result.success).toBe(true);
    expect(result.isNew).toBe(false);
    expect(result.ticketId).toBe("tkt_existing_555");
    expect(result.ticketNumber).toBe(55);
    expect(result.occurrenceCount).toBe(4);
    expect(result.occurrenceId).toBe("occ_new_99");

    expect(occCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ticketId: "tkt_existing_555",
          origin: IncidentOrigin.FRONT,
        }),
      })
    );

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tkt_existing_555" },
        data: expect.objectContaining({
          occurrenceCount: { increment: 1 },
        }),
      })
    );
  });
});
